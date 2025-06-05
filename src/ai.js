const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients a user has and suggests one or more recipes...
`;

export async function getRecipeFromMistral(ingredients) {
    console.log("Calling HF API...");

    const prompt = `Make a recipe using the following ingredients: ${ingredients.join(", ")}`;

    const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3",
        {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${import.meta.env.VITE_HF_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 800,
                    temperature: 0.7,
                }
            }),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        console.error("HF API error:", error);
        throw new Error(error.error || "API call failed");
    }

    const result = await response.json();
    console.log("Raw HF response:", result);

    if (Array.isArray(result) && result[0]?.generated_text) {
        return result[0].generated_text;
    } else if (result?.generated_text) {
        return result.generated_text;
    } else {
        throw new Error("Unexpected response from API");
    }
}
