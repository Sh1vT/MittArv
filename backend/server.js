import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '5mb' }));
app.use(morgan('dev'));

// routes
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import userRoutes from "./routes/users.js";

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// sitemap route (utils will generate)
import { sitemapRoute } from "./utils/sitemap.js";
app.get("/sitemap.xml", sitemapRoute);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
