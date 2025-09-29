const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// 🔎 Search route
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    // ✅ Your real search API
    const apiUrl = `https://apis-keith.vercel.app/search?q=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    res.json(response.data);
  } catch (err) {
    console.error("❌ Search error:", err.message);
    res.status(500).json({ error: "Search failed" });
  }
});

// 🎵 Download route
app.get("/api/download", async (req, res) => {
  const videoUrl = req.query.url;
  const format = req.query.format || "mp3"; // default to mp3

  if (!videoUrl) return res.status(400).json({ error: "Missing video URL" });

  try {
    // Select correct endpoint based on format
    const apiUrl =
      format === "mp3"
        ? `https://apis.davidcyriltech.my.id/download/ytmp3?url=${encodeURIComponent(videoUrl)}`
        : `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(videoUrl)}`;

    const response = await axios.get(apiUrl);

    if (!response.data || !response.data.result || !response.data.result.download_url) {
      return res.status(500).json({ error: "Invalid API response" });
    }

    const downloadUrl = response.data.result.download_url;

    // Redirect user directly to the file
    return res.redirect(downloadUrl);
  } catch (err) {
    console.error("❌ Download error:", err.message);
    res.status(500).json({ error: "Download failed" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
