import mongoose from "mongoose";
import slugify from "slugify";

const commentSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true }, // store sanitized HTML or markdown
  tags: [{ type: String }],
  image: { type: String, default: "" },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [commentSchema],
}, { timestamps: true });

postSchema.index({ title: 'text', content: 'text' });

postSchema.pre('validate', function(next){
  if(this.title && !this.slug){
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Math.random().toString(36).slice(2,8);
  }
  next();
});

export default mongoose.model("Post", postSchema);
