import express from "express";
import auth from "../middleware/auth.js";
import {
  createPost, getPosts, getPost, updatePost, deletePost
} from "../controllers/postController.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getPost);
router.post("/", auth, createPost);       // protected: create
router.put("/:id", auth, updatePost);     // protected: update own
router.delete("/:id", auth, deletePost);  // protected: delete own

export default router;
