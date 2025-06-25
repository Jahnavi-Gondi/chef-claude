import React from "react"
import IngredientList from "./components/IngredientList"
import Recipe from "./components/Recipe"
import { getRecipeFromMistral } from "./components/ai"

export default function Main() {
    const [ingredients, setIngredients] = React.useState([])
    const [recipe, setRecipe] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
    const recipeSection = React.useRef(null)

    React.useEffect(() => {
    if (recipe && recipeSection.current !== null) {
        const yCoord = recipeSection.current.offsetTop;
        window.scrollTo({
            top: yCoord,
            behavior: "smooth"
        });
    }
    }, [recipe]);

    async function handleGenerateRecipe() {
        setIsLoading(true);
        setError(null); // Clear previous errors

        try {
            const recipe = await getRecipeFromMistral(ingredients);
            setRecipe(recipe);
        } catch (err) {
            setError("Failed to generate recipe. Please try again.");
        }

        setIsLoading(false);
    }

    async function getRecipe() {
        console.log("Fetching recipe...");
        setIsLoading(true)
        try {
            const generatedRecipe = await getRecipeFromMistral(ingredients);
            console.log("Recipe received:", generatedRecipe);
            setRecipe(generatedRecipe);
        } catch (error) {
            console.error("Error while fetching recipe:", error);
        }finally{
            setIsLoading(false)
        }
    }


    function addIngredient(formData){
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients => [...prevIngredients, newIngredient])
    }

    const handleRemoveIngredient = (index) => {
        setIngredients(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <main>
            <form action={addIngredient} className="add-ingredient-form">
                <input

                    type = "text" 
                    placeholder="e.g. oregano"
                    aria-label="Add ingredient"
                    name="ingredient"
                />
                <button type="submit"> + Add ingredient</button>
            </form>
            {ingredients.length > 0 && 
                <IngredientList
                    ref={recipeSection}
                    ingredients={ingredients}
                    onRemove={handleRemoveIngredient}
                    getRecipe={getRecipe}
                />
            }
            {isLoading && <p>Loading recipe...</p>}
            {error && <p className="error">{error}</p>}
            {recipe && <Recipe recipe={recipe} />}
        </main>
    )
}






