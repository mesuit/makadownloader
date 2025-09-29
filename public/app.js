document.getElementById("searchBtn").addEventListener("submit", async (e) => {
  e.preventDefault();
  const query = document.getElementById("searchInput").value.trim();
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "Searching...";

  try {
    const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
    const results = await res.json();

    resultsDiv.innerHTML = "";

    if (!results || results.length === 0) {
      resultsDiv.innerHTML = "<p>No results found.</p>";
      return;
    }

    results.forEach((video) => {
      const card = document.createElement("div");
      card.className = "result-card";
      card.innerHTML = `
        <img src="${video.thumbnail}" width="150" />
        <h3>${video.title}</h3>
        <p>Views: ${video.views} | Duration: ${video.duration}</p>
        <button onclick="downloadMedia('${video.url}','mp3')">Download MP3</button>
        <button onclick="downloadMedia('${video.url}','mp4')">Download MP4</button>
      `;
      resultsDiv.appendChild(card);
    });
  } catch (err) {
    console.error("Search failed:", err);
    resultsDiv.innerHTML = "<p>Error while searching.</p>";
  }
});

async function downloadMedia(url, type) {
  try {
    const res = await fetch(
      `/api/download?url=${encodeURIComponent(url)}&type=${type}`
    );
    const data = await res.json();

    if (data && data.result && data.result.download_url) {
      window.open(data.result.download_url, "_blank");
    } else {
      alert("Download link not available.");
    }
  } catch (err) {
    console.error("Download error:", err);
    alert("Failed to download.");
  }
}

