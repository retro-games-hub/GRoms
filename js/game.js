const params = new URLSearchParams(window.location.search);
const gameId = Number(params.get("id"));

const gameTitle = document.getElementById("gameTitle");
const gameDetails = document.getElementById("gameDetails");

fetch("games.json")
  .then(response => response.json())
  .then(games => {
    const game = games.find(item => item.id === gameId);

    if (!game) {
      gameDetails.innerHTML = "<p>Game not found.</p>";
      return;
    }

    renderGame(game);
    renderRecommendedGames(games, game.id);
  })
  .catch(error => {
    gameDetails.innerHTML = "<p>Error loading game.</p>";
    console.error(error);
  });

function renderGame(game) {
  gameTitle.textContent = game.title;

  const regions = Object.keys(game.downloads);

  gameDetails.innerHTML = `
    <div class="game-layout">

      <!-- LEFT -->
      <div class="left-side">
        <img class="cover" src="${game.cover}" alt="${game.title}">
      </div>

      <!-- RIGHT -->
      <div class="right-side">

        <h2>${game.title}</h2>

        <div class="info-box">
          <p><strong>Platform:</strong> ${game.platform}</p>
          <p><strong>Category:</strong> ${game.category.join(", ")}</p>
          <p><strong>Year:</strong> ${game.year}</p>
          <p><strong>Publisher:</strong> ${game.publisher}</p>
          <p>
            <strong>Languages:</strong>
            ${game.languages.join(", ")}
          </p>
          <p>
            <strong>User Score:</strong>
            ⭐ ${game.userScore}/10
          </p>
        </div>

        <div class="description">
          <h3>Description</h3>
          <p>${game.description}</p>
        </div>

        <div class="download-box">
          <h3>Download</h3>

          <select id="regionSelect">
            ${regions.map(region =>
              `<option value="${region}">${region}</option>`
            ).join("")}
          </select>

          <a id="downloadBtn"
             class="btn"
             href="${game.downloads[regions[0]]}"
             download>
             Download Game
          </a>
        </div>

        <div class="gallery-section">
          <h3>Screenshots</h3>

          <div class="gallery">
            ${game.images.map(img =>
              `<img src="${img}" alt="${game.title}">`
            ).join("")}
          </div>
        </div>

        <div class="trailer-section">
          <h3>Trailer</h3>

          <iframe
            class="trailer"
            src="${game.trailer}"
            allowfullscreen>
          </iframe>
        </div>

      </div>
    </div>
  `;

  const regionSelect = document.getElementById("regionSelect");
  const downloadBtn = document.getElementById("downloadBtn");

  regionSelect.addEventListener("change", () => {
    downloadBtn.href = game.downloads[regionSelect.value];
  });
}
function renderRecommendedGames(allGames, currentGameId) {
  const recommendedContainer =
    document.getElementById("recommendedGames");

  if (!recommendedContainer) return;

  const filteredGames = allGames.filter(
    game => game.id !== currentGameId
  );

  const shuffled = filteredGames.sort(
    () => 0.5 - Math.random()
  );

  const selectedGames = shuffled.slice(0, 4);

  recommendedContainer.innerHTML = "";

  selectedGames.forEach(game => {
    recommendedContainer.innerHTML += `
      <div class="game-card">
        <img src="${game.cover}" alt="${game.title}">

        <div class="game-card-content">
          <h3>${game.title}</h3>

          <p>
            ${game.platform} • ${game.year}
          </p>

          <a class="btn"
             href="game.html?id=${game.id}">
             View Game
          </a>
        </div>
      </div>
    `;
  });
}