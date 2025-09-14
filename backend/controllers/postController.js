import Post from "../models/Post.js";
import sanitizeHtml from "sanitize-html";

// Create post
export const createPost = async (req,res,next) => {
  try {
    const { title, content, tags, image } = req.body;
    const safeContent = sanitizeHtml(content, { allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']) });
    const post = await Post.create({
      title,
      content: safeContent,
      tags: tags ? tags.map(t => t.trim()) : [],
      image: image || "",
      author: req.user._id
    });
    res.status(201).json(post);
  } catch (err) { next(err); }
};

// Get posts (search + tags + pagination)
export const getPosts = async (req,res,next) => {
  try {
    const { page = 1, limit = 10, search = "", tags } = req.query;
    const query = {};
    if(search) query.$text = { $search: search };
    if(tags) {
      const tagsArr = tags.split(",").map(t => t.trim());
      query.tags = { $in: tagsArr };
    }
    const skip = (page - 1) * limit;
    const [posts, total] = await Promise.all([
      Post.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).populate("author", "name profilePic"),
      Post.countDocuments(query)
    ]);
    res.json({ posts, total, page: Number(page), pages: Math.ceil(total/limit) });
  } catch(err){ next(err); }
};

// Get single post (by slug or id)
export const getPost = async (req,res,next) => {
  try {
    const { id } = req.params;
    const post = await Post.findOne({ $or: [{ slug: id }, { _id: id }] }).populate("author", "name profilePic");
    if(!post) return res.status(404).json({error:"Not found"});
    res.json(post);
  } catch(err){ next(err); }
};

// Update post (author only)
export const updatePost = async (req,res,next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if(!post) return res.status(404).json({error:"Not found"});
    if(post.author.toString() !== req.user._id.toString()) return res.status(403).json({error:"Not allowed"});
    const allowed = ["title","content","tags","image"];
    allowed.forEach(k => { if(req.body[k] !== undefined) post[k] = req.body[k]; });
    post.content = sanitizeHtml(post.content);
    await post.save();
    res.json(post);
  } catch(err){ next(err); }
};

// Delete post
export const deletePost = async (req,res,next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if(!post) return res.status(404).json({error:"Not found"});
    if(post.author.toString() !== req.user._id.toString()) return res.status(403).json({error:"Not allowed"});
    await post.remove();
    res.json({ success: true });
  } catch(err){ next(err); }
};
