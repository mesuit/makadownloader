const express = require("express");
const axios = require("axios");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// Example: proxy search request to your modded API
app.get("/api/search", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing query" });

  try {
    // Replace with your modded API endpoint
    const apiUrl = `https://your-modded-api.com/search?query=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    res.json(response.data);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to fetch from API" });
  }
});

// Example: proxy download request
app.get("/api/download", async (req, res) => {
  const url = req.query.url;
  if (!url) return res.status(400).json({ error: "Missing url" });

  try {
    const response = await axios.get(url, { responseType: "stream" });

    // Stream file to client
    res.setHeader("Content-Disposition", "attachment; filename=media.mp3");
    response.data.pipe(res);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to download media" });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
