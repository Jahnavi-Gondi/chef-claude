import express from 'express';
import bcrypt from "bcryptjs";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import User from '../models/User.js';
import authenticate from '../middleware/auth.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// uploads directory
const avatarDir = path.join(__dirname, '..', 'uploads', 'avatars');
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, avatarDir);
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, `${req.user.id}-${Date.now()}${ext}`);
    },
});
const upload = multer({ storage });

/**
 * GET /api/profile
 */
router.get('/', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('email username bio avatarUrl');
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error("Error fetching profile:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

/**
 * PUT /api/profile
 */
router.put('/', authenticate, upload.single('avatar'), async (req, res) => {
    try {
        const updateFields = {};
        if (req.body.name) updateFields.username = req.body.name;
        if (req.body.bio) updateFields.bio = req.body.bio;
        if (req.file) updateFields.avatarUrl = `/uploads/avatars/${req.file.filename}`;

        const updatedUser = await User.findByIdAndUpdate(req.user.id, updateFields, {
            new: true,
            select: 'email username bio avatarUrl',
        });

            res.json(updatedUser);
    } catch (err) {
        console.error("Error updating profile:", err);
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/change-password', authenticate, async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: "Both old and new passwords are required" });
    }

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Old password is incorrect" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (err) {
        console.error("Error updating password:", err);
        res.status(500).json({ error: "Failed to update password" });
    }
});


export default router;
