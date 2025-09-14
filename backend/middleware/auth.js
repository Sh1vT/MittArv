import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function auth(req,res,next){
  try{
    const header = req.headers.authorization;
    if(!header) return res.status(401).json({error:"No token"});
    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if(!user) return res.status(401).json({error:"Invalid token"});
    req.user = user;
    next();
  }catch(err){
    return res.status(401).json({error:"Authentication failed"});
  }
}
