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
    renderLastAdded(games);
    renderRandomCategory(games);
    renderRecommendedGames(games, game.id);

    const btn =
        document.getElementById("newCategoryBtn");

    if (btn) {
        btn.addEventListener("click", () => {
            renderRandomCategory(games);
        });
    }

  })
  .catch(error => {
    gameDetails.innerHTML = "<p>Error loading game.</p>";
    console.error(error);
  });

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

function formatReleaseDate(releaseDate) {
  if (!releaseDate) return "Unknown";

  const { year, month, day } = releaseDate;

  if (year && month && day) {
    const date = new Date(year, month - 1, day);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }

  if (year && month) {
    const date = new Date(year, month - 1);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long"
    });
  }

  return year.toString();
}

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
          <p><strong>Year:</strong>  ${formatReleaseDate(game.releaseDate)}</p>
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
      </div>
    </div>
    <div class="additional-content">
      <div class="download-box">
        <h3>Download</h3>
        <div class="download-info">
          <select id="regionSelect">
            ${regions.map(region =>
              `<option value="${region}">${region}</option>`
            ).join("")}
          </select>
          <a id="downloadBtn" class="btn"
            href="${game.downloads[regions[0]]}"
            target="_blank"
            rel="noopener noreferrer">
            Download Game
          </a>
        </div>
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
  `;

  const regionSelect = document.getElementById("regionSelect");
  const downloadBtn = document.getElementById("downloadBtn");

  regionSelect.addEventListener("change", () => {
    downloadBtn.href = game.downloads[regionSelect.value];
  });

  const lightbox =
  document.getElementById("lightbox");

  const lightboxImage =
    document.getElementById("lightboxImage");

  const closeLightbox =
    document.getElementById("closeLightbox");

  const prevImageBtn =
    document.getElementById("prevImage");

  const nextImageBtn =
    document.getElementById("nextImage");

  const galleryImages =
    document.querySelectorAll(".gallery img");

  let currentImageIndex = 0;

  function openLightbox(index) {
    currentImageIndex = index;

    lightbox.style.display = "flex";

    lightboxImage.src =
      galleryImages[currentImageIndex].src;
  }

  function showNextImage() {
    currentImageIndex++;

    if (currentImageIndex >= galleryImages.length) {
      currentImageIndex = 0;
    }

    lightboxImage.src =
      galleryImages[currentImageIndex].src;
  }

  function showPrevImage() {
    currentImageIndex--;

    if (currentImageIndex < 0) {
      currentImageIndex =
        galleryImages.length - 1;
    }

    lightboxImage.src =
      galleryImages[currentImageIndex].src;
  }

  galleryImages.forEach((image, index) => {
    image.addEventListener("click", () => {
      openLightbox(index);
    });
  });

  nextImageBtn.addEventListener(
    "click",
    showNextImage
  );

  prevImageBtn.addEventListener(
    "click",
    showPrevImage
  );

  closeLightbox.addEventListener("click", () => {
    lightbox.style.display = "none";
  });

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = "none";
    }
  });

  document.addEventListener("keydown", (e) => {

    if (lightbox.style.display !== "flex") return;

    if (e.key === "ArrowRight") {
      showNextImage();
    }

    if (e.key === "ArrowLeft") {
      showPrevImage();
    }

    if (e.key === "Escape") {
      lightbox.style.display = "none";
    }
  });
}
function renderRecommendedGames(allGames, currentGameId) {
  const recommendedContainer =
    document.getElementById("recommendedGames");

  if (!recommendedContainer) return;

  const currentGame = allGames.find(g => g.id === currentGameId);
  if (!currentGame) return;

  const scoredGames = allGames
    .filter(game => game.id !== currentGameId)
    .map(game => {
      let score = 0;

      // 🎯 Category match (MOST IMPORTANT)
      const sharedCategories = game.category.filter(cat =>
        currentGame.category.includes(cat)
      );
      score += sharedCategories.length * 5;

      // 🎮 Platform match
      if (game.platform === currentGame.platform) {
        score += 3;
      }

      // 📅 Same year (small bonus)
      if (game.releaseDate?.year === currentGame.releaseDate?.year) {
        score += 1;
      }

      return { game, score };
    });

  const selectedGames = scoredGames
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map(item => item.game);

  recommendedContainer.innerHTML = "";

  selectedGames.forEach(game => {
    recommendedContainer.innerHTML += `
      <div class="game-card">
        <img src="${game.cover}" alt="${game.title}">

        <div class="game-card-content">
          <h3>${game.title}</h3>

          <p>${game.platform} • ${game.category.join(", ")}</p>

          <a class="btn" href="game.html?id=${game.id}">
            View Game
          </a>
        </div>
      </div>
    `;
  });
}