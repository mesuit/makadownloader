document.getElementById("searchBtn").addEventListener("click", async () => {
  const query = document.getElementById("searchInput").value.trim();
  if (!query) return alert("Enter a search term");

  const resultsEl = document.getElementById("results");
  resultsEl.innerHTML = "<li>Searching...</li>";

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    resultsEl.innerHTML = "";

    if (!data || !data.result || data.result.length === 0) {
      resultsEl.innerHTML = "<li>No results found</li>";
      return;
    }

    data.result.forEach(item => {
      const li = document.createElement("li");

      li.innerHTML = `
        <img src="${item.thumbnail}" alt="${item.title}">
        <div class="info">
          <h3>${item.title}</h3>
          <p>${item.author?.name || "Unknown Author"}</p>
        </div>
        <div>
          <button class="mp3" onclick="downloadMedia('${item.url}', 'mp3')">MP3</button>
          <button class="mp4" onclick="downloadMedia('${item.url}', 'mp4')">MP4</button>
        </div>
      `;

      resultsEl.appendChild(li);
    });
  } catch (err) {
    console.error("Search error:", err);
    resultsEl.innerHTML = "<li>Error searching. Try again later.</li>";
  }
});

function downloadMedia(url, format) {
  window.location.href = `/api/download?url=${encodeURIComponent(url)}&format=${format}`;
}
