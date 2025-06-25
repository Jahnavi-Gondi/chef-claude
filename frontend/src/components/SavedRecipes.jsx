import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function SavedRecipes() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        async function fetchSavedRecipes() {
            try {
                const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/saved-recipes/saved`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    setRecipes(data.recipes);
                } else {
                    alert(data.error || "Failed to load saved recipes.");
                }
            } catch (err) {
                console.error(err);
                alert("Something went wrong.");
            } finally {
                setLoading(false);
            }
        }

        fetchSavedRecipes();
    }, []);

    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/saved-recipes/saved/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.ok) {
                setRecipes(recipes.filter((r) => r._id !== id));
            } else {
                const errData = await res.json();
                alert(errData.error || "Failed to delete recipe.");
            }
        } catch (err) {
            console.error(err);
            alert("Error deleting recipe.");
        }
    };

    if (loading) return <p>Loading your saved recipes...</p>;

    return (
        <section className="saved-recipes-section">
            <h2>Saved Recipes</h2>
            {recipes.length === 0 ? (
                <p>You haven't saved any recipes yet.</p>
            ) : (
                <div className="recipe-grid">
                    {recipes.map((r) => (
                        <div key={r._id} className="recipe-card">
                            <div className="recipe-content">
                                <ReactMarkdown>{r.content}</ReactMarkdown>
                            </div>
                            <p className="date">Saved on {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Unknown"}</p>
                            <button className="delete-btn" onClick={() => handleDelete(r._id)}>Delete</button>
                        </div>
                    ))}
                </div>

            )}
        </section>
    );
}
