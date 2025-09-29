import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5000;

// ES module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// serve frontend
app.use(express.static(path.join(__dirname, "public")));

// 🔍 Search endpoint
app.get("/api/search", async (req, res) => {
  const query = req.query.query;
  if (!query) {
    return res.status(400).json({ error: "No query provided" });
  }

  try {
    const apiUrl = `https://apis.davidcyriltech.my.id/search/ytsearch?query=${encodeURIComponent(
      query
    )}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data && data.result && data.result.length > 0) {
      res.json(data.result);
    } else {
      res.json([]);
    }
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Failed to fetch results" });
  }
});

// 🎵 Download endpoint
app.get("/api/download", async (req, res) => {
  const { url, type } = req.query;
  if (!url || !type) {
    return res.status(400).json({ error: "Missing url or type" });
  }

  try {
    const apiUrl =
      type === "mp3"
        ? `https://apis.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(
            url
          )}`
        : `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(
            url
          )}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Failed to fetch download link" });
  }
});

app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);

