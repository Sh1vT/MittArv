import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },            // absent for Google-only users
  googleId: { type: String, default: null },
  bio: { type: String, default: "" },
  profilePic: { type: String, default: "" },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
}, { timestamps: true });

export default mongoose.model("User", userSchema);
