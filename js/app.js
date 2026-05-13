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
    filteredGames.sort((a, b) => b.year - a.year);
  }

  if (sortValue === "oldest") {
    filteredGames.sort((a, b) => a.year - b.year);
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
          <p>${game.platform} • ${game.category} • ${game.year}</p>
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