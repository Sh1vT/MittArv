import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function signToken(user){
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });
}

// Register
export const register = async (req,res,next)=>{
  try{
    const { name, email, password } = req.body;
    if(!name || !email || !password) return res.status(400).json({error:"Missing fields"});
    const exists = await User.findOne({email});
    if(exists) return res.status(400).json({error:"Email in use"});
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hash });
    const token = signToken(user);
    res.json({ user: {id:user._id, name:user.name, email:user.email}, token });
  }catch(err){ next(err); }
};

// Login
export const login = async (req,res,next)=>{
  try{
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({error:"Invalid credentials"});
    if(!user.password) return res.status(400).json({error:"Use Google sign-in"});
    const ok = await bcrypt.compare(password, user.password);
    if(!ok) return res.status(400).json({error:"Invalid credentials"});
    const token = signToken(user);
    res.json({ user:{id:user._id, name:user.name, email:user.email}, token });
  } catch(err){ next(err); }
};

// Google sign-in (frontend sends id_token)
export const googleSignIn = async (req,res,next)=>{
  try{
    const { id_token } = req.body;
    const ticket = await client.verifyIdToken({ idToken: id_token, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;
    let user = await User.findOne({ email });
    if(!user){
      user = await User.create({ email, name, profilePic: picture, googleId });
    } else if(!user.googleId){
      user.googleId = googleId;
      await user.save();
    }
    const token = signToken(user);
    res.json({ user:{id:user._id, name:user.name, email:user.email}, token });
  }catch(err){ next(err); }
};
