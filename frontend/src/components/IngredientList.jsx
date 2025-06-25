import React from "react";

export default function IngredientList({ ingredients, onRemove, getRecipe, recipeRef }) {
    return (
        <section className="ingredients-container">
            <h2>Ingredients on hand:</h2>
            <ul className="ingredients-list" aria-live="polite">
                {ingredients.map((ingredient, index) => (
                    <li key={index}>
                        {ingredient}
                        <button onClick={() => onRemove(index)} style={{ marginLeft: '10px' }}>❌</button>
                    </li>
                ))}
            </ul>

            {ingredients.length > 3 && (
                <div className="get-recipe-container">
                    <div ref={recipeRef}>
                        <h3>Ready for a recipe?</h3>
                        <p>Generate a recipe from your list of ingredients.</p>
                    </div>
                    <button onClick={getRecipe}>Get a recipe</button>
                </div>
            )}
        </section>
    );
}
