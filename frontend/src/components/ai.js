export async function getRecipeFromMistral(ingredients) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("http://localhost:5000/api/recipe/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ ingredients })
        });

        const data = await response.json();

        // Handle expired or invalid token
        if (response.status === 401 || response.status === 403) {
            alert("Session expired. Please login again.");
            localStorage.removeItem("token");
            window.location.href = "/login";
            return;
        }

        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch recipe");
        }

        return data.recipe;

    } catch (error) {
        throw error;
    }
}
