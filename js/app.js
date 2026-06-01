let games = [];

const gamesGrid = document.getElementById("gamesGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const platformFilter = document.getElementById("platformFilter");
const sortSelect = document.getElementById("sortSelect");

fetch("games.json")
  .then(response => response.json())
  .then(data => {
    games = data;
    fillFilters();
    renderGames();
    renderLastAdded(games);
    renderRandomCategory(games);

    const newCategoryBtn =
      document.getElementById("newCategoryBtn");

    if (newCategoryBtn) {
      newCategoryBtn.addEventListener("click", () => {
        renderRandomCategory(games);
      });
    }

  })
  .catch(error => {
    gamesGrid.innerHTML = `
        <p style="color:red;">
        Error loading games.json
        </p>
    `;

    console.log("FULL ERROR:");
    console.log(error);
    });

function fillFilters() {
  const categories = [
    ...new Set(
        games.flatMap(game => game.category)
    )
];
  const platforms = [...new Set(games.map(game => game.platform))];

  categories.forEach(category => {
    categoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
  });

  platforms.forEach(platform => {
    platformFilter.innerHTML += `<option value="${platform}">${platform}</option>`;
  });
}

function renderLastAdded(games) {

  const container =
    document.getElementById("lastAddedGames");

  if (!container) return;

  const latestGames = [...games]
    .sort((a, b) => b.id - a.id)
    .slice(0, 3);

  container.innerHTML = "";

  latestGames.forEach(game => {

    container.innerHTML += `
      <div class="sidebar-game">

        <img src="${game.cover}" alt="${game.title}">

        <div class="sidebar-game-info">

          <a href="game.html?id=${game.id}">
            ${game.title}
          </a>

          <p>${game.releaseDate?.year || ""}</p>

        </div>

      </div>
    `;
  });
}

function renderRandomCategory(games) {

  const container =
    document.getElementById("randomCategoryGames");

  const title =
    document.getElementById("randomCategoryTitle");

  if (!container || !title) return;

  const allCategories = [
    ...new Set(
      games.flatMap(game => game.category)
    )
  ];

  const randomCategory =
    allCategories[
      Math.floor(
        Math.random() * allCategories.length
      )
    ];

  title.textContent =
    `Random Category: ${randomCategory}`;

  const selectedGames = games
    .filter(game =>
      game.category.includes(randomCategory)
    )
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  container.innerHTML = "";

  selectedGames.forEach(game => {

    container.innerHTML += `
      <div class="sidebar-game">

        <img
          src="${game.cover}"
          alt="${game.title}"
        >

        <div class="sidebar-game-info">

          <a href="game.html?id=${game.id}">
            ${game.title}
          </a>

          <p>
            ${game.releaseDate?.year || ""}
          </p>

        </div>

      </div>
    `;
  });
}

function renderGames() {
  let filteredGames = [...games];

  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedPlatform = platformFilter.value;
  const sortValue = sortSelect.value;

  filteredGames = filteredGames.filter(game => {
    return (
      game.title.toLowerCase().includes(searchText) &&
      (selectedCategory === "" || game.category.includes(selectedCategory)) &&
      (selectedPlatform === "" || game.platform === selectedPlatform)
    );
  });

  if (sortValue === "az") {
    filteredGames.sort((a, b) => a.title.localeCompare(b.title));
  }

  if (sortValue === "za") {
    filteredGames.sort((a, b) => b.title.localeCompare(a.title));
  }

  if (sortValue === "newest") {
    filteredGames.sort(
      (a, b) => (b.releaseDate?.year || 0) - (a.releaseDate?.year || 0)
    );
  }

  if (sortValue === "oldest") {
    filteredGames.sort(
      (a, b) => (a.releaseDate?.year || 0) - (b.releaseDate?.year || 0)
    );
  }

  gamesGrid.innerHTML = "";

  if (filteredGames.length === 0) {
    gamesGrid.innerHTML = "<p>No games found.</p>";
    return;
  }

  filteredGames.forEach(game => {
    gamesGrid.innerHTML += `
      <div class="game-card">
        <img src="${game.cover}" alt="${game.title}">
        <div class="game-card-content">
          <h3>${game.title}</h3>
          <p>${game.platform} • ${game.category} • ${game.releaseDate?.year || "Unknown"}</p>
          <a class="btn" href="game.html?id=${game.id}">View Game</a>
        </div>
      </div>
    `;
  });
}

searchInput.addEventListener("input", renderGames);
categoryFilter.addEventListener("change", renderGames);
platformFilter.addEventListener("change", renderGames);
sortSelect.addEventListener("change", renderGames);