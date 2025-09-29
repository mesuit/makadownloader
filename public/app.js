document.getElementById("searchBtn").addEventListener("click", searchVideos);
document.getElementById("query").addEventListener("keypress", e => {
  if (e.key === "Enter") searchVideos();
});

async function searchVideos() {
  const query = document.getElementById("query").value.trim();
  const resultsEl = document.getElementById("results");
  resultsEl.innerHTML = "Searching...";

  if (!query) {
    resultsEl.innerHTML = "<li>Please enter a search term</li>";
    return;
  }

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (!data || !data.result || data.result.length === 0) {
      resultsEl.innerHTML = "<li>No results found</li>";
      return;
    }

    resultsEl.innerHTML = "";
    data.result.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `
        <img src="${item.thumbnail}" width="200"><br>
        <b>${item.title}</b><br>
        <small>${item.published} • ${item.views} views</small><br>
        <button onclick="downloadMedia('${item.url}', 'mp3')">Download MP3</button>
        <button onclick="downloadMedia('${item.url}', 'mp4')">Download MP4</button>
      `;
      resultsEl.appendChild(li);
    });
  } catch (err) {
    console.error("❌ Search error:", err);
    resultsEl.innerHTML = "<li>Search failed</li>";
  }
}

function downloadMedia(videoUrl, format) {
  window.location.href = `/api/download?url=${encodeURIComponent(videoUrl)}&format=${format}`;
}

