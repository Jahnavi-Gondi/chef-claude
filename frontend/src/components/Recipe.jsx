import ReactMarkdown from "react-markdown";

export default function Recipe({ recipe }) {
    async function handleSave() {
        const token = localStorage.getItem("token");
        if (!token) return alert("Please login to save the recipe.");

        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/saved-recipes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ content: recipe }),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Recipe saved successfully!");
            } else {
                alert(data.error || "Failed to save recipe");
            }
        } catch (err) {
            alert("Something went wrong");
        }
    }

    return (
        <section className="suggested-recipe-container" aria-live="polite">
            <h2>Chef Claude Recommends</h2>
            <ReactMarkdown>{recipe}</ReactMarkdown>
            {recipe && (
                <button onClick={handleSave} className="save-recipe-btn">
                    Save Recipe
                </button>
            )}
        </section>
    );
}
