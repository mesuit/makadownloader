async function searchVideo() {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return alert("Please enter a search term");

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "<p>⏳ Searching...</p>";

  try {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();

    if (data.error) {
      resultsDiv.innerHTML = `<p style="color:red;">❌ ${data.error}</p>`;
      return;
    }

    resultsDiv.innerHTML = `
      <div class="card">
        <h3>${data.title}</h3>
        <img src="${data.thumbnail}" alt="Thumbnail"><br>
        <p>⏱ Duration: ${data.duration || "N/A"}</p>
        <p>👤 Channel: ${data.channel}</p>
        <p>👁 Views: ${data.views}</p>
        <a href="/api/download?url=${encodeURIComponent(data.url)}&type=audio" target="_blank">
          <button>⬇ Download MP3</button>
        </a>
        <a href="/api/download?url=${encodeURIComponent(data.url)}&type=video" target="_blank">
          <button>⬇ Download MP4</button>
        </a>
        <button onclick="previewAudio('${data.url}')">🎧 Preview Audio</button>
      </div>
    `;
  } catch (err) {
    resultsDiv.innerHTML = `<p style="color:red;">⚠️ Error: ${err.message}</p>`;
  }
}

async function previewAudio(url) {
  try {
    const response = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
    const data = await response.json();

    if (data.error) {
      alert("❌ Preview failed: " + data.error);
      return;
    }

    const audio = new Audio(data.previewUrl);
    audio.play();
  } catch (err) {
    alert("⚠️ Preview error: " + err.message);
  }
}
