import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import authenticateToken from "../middleware/auth.js";
dotenv.config();

const router = express.Router();

// check
router.get("/", (req, res) => {
    res.send("Recipe API is working!");
});

// Recipe-generation endpoint
router.post("/generate", authenticateToken, async (req, res) => {
    const { ingredients } = req.body;

    if (!Array.isArray(ingredients) || ingredients.length < 1) {
        return res.status(400).json({ error: "Please provide at least 1 ingredient." });
    }

    const prompt = `
Create a complete, formatted recipe using these ingredients: ${ingredients.join(", ")}.
Include:
• A title
• Ingredient list with quantities
• Step-by-step instructions
Please format as markdown text.
`;

    const HF_MODEL_URL = "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1";

    try {

        const hfResponse = await fetch(HF_MODEL_URL, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.HF_ACCESS_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_new_tokens: 800,
                    temperature: 0.7,
                    top_p: 0.9,
                },
            }),
        });


        const raw = await hfResponse.text();

        let json;
        try {
            json = JSON.parse(raw);
        } catch (e) {
            return res.status(500).json({ error: "Invalid response from Hugging Face." });
        }

        if (!hfResponse.ok) {
            return res.status(500).json({ error: json.error || "Hugging Face model returned an error." });
        }

        let recipe =
            json.generated_text || (Array.isArray(json) && json[0]?.generated_text) || "";

        if (!recipe.trim()) {
            return res.status(500).json({ error: "Empty recipe returned from model." });
        }

        // Remove echoed prompt by slicing from the first Markdown heading
        const firstHeadingIndex = recipe.indexOf("#");
        if (firstHeadingIndex !== -1) {
            recipe = recipe.substring(firstHeadingIndex).trim();
        }

        res.json({ recipe });

    } catch (err) {
        console.error("🔥 Unexpected server error:", err);
        res.status(500).json({ error: "Internal server error." });
    }
});

export default router;
