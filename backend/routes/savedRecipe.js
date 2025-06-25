import express from "express";
import SavedRecipe from "../models/recipeSaved.js"; 
import authenticateToken from "../middleware/auth.js"; 

const router = express.Router();

// GET saved recipes for a user
router.get("/saved", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // from JWT
        const recipes = await SavedRecipe.find({ user: userId }).sort({ createdAt: -1 });
        res.json({ recipes });
    } catch (err) {
        console.error("Failed to fetch saved recipes:", err);
        res.status(500).json({ error: "Failed to load saved recipes" });
    }
});



// Save recipe route
router.post("/", authenticateToken, async (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Recipe content required" });

    try {
        const newRecipe = new SavedRecipe({
            user: req.user.id,
            content
        });
        await newRecipe.save();
        res.status(201).json({ message: "Recipe saved!" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});


//delete route
router.delete("/saved/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const deleted = await SavedRecipe.findOneAndDelete({ _id: id, user: userId });
        if (!deleted) return res.status(404).json({ error: "Recipe not found or unauthorized" });
        res.json({ message: "Recipe deleted" });
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

export default router;
