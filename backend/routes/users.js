import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/User.js";

const router = express.Router();

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { name, bio, profilePic } = req.body;
    const user = await User.findById(req.user._id);
    
    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (profilePic !== undefined) user.profilePic = profilePic;
    
    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user bookmarks
router.get("/bookmarks", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("bookmarks");
    res.json(user.bookmarks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add bookmark
router.post("/bookmarks/:postId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user.bookmarks.includes(req.params.postId)) {
      user.bookmarks.push(req.params.postId);
      await user.save();
    }
    res.json({ message: "Bookmark added" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove bookmark
router.delete("/bookmarks/:postId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.bookmarks = user.bookmarks.filter(id => id.toString() !== req.params.postId);
    await user.save();
    res.json({ message: "Bookmark removed" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
