import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

import connectDB from "./config/db.js";
import recipeRoutes from "./routes/recipe.js";
import authRoutes from "./routes/auth.js";
import savedRecipeRoutes from "./routes/savedRecipe.js";
import profileRoutes from "./routes/profile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Serve static avatars from uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/recipe", recipeRoutes);
app.use("/api/saved-recipes", savedRecipeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
