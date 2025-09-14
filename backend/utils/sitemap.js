// backend/utils/sitemap.js
import { Router } from "express";

const sitemapRoute = Router();

sitemapRoute.get("/sitemap.xml", (req, res) => {
  res.header("Content-Type", "application/xml");

  const urls = [
    { loc: "https://mittarv.com/", changefreq: "daily", priority: 1.0 },
    { loc: "https://mittarv.com/about", changefreq: "monthly", priority: 0.8 },
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls
      .map(
        (url) => `
        <url>
          <loc>${url.loc}</loc>
          <changefreq>${url.changefreq}</changefreq>
          <priority>${url.priority}</priority>
        </url>`
      )
      .join("")}
  </urlset>`;

  res.send(xml);
});

export { sitemapRoute };
