const sliderCarouselButtons = document.querySelectorAll(".carousel-button");
const cardImageGamecontainer = document.getElementById("card-game");
const searchInput = document.querySelectorAll(".search-game")[0];
import { GameListAPI } from "./database/api.js";
const loadMoreButton = document.getElementById("load-more-games");
const loadingSpinner = document.createElement("span");

loadingSpinner.classList.add("loading");
cardImageGamecontainer.appendChild(loadingSpinner);

import setFakeDelay from "./helpers/utils.js";

const gamesAPI = GameListAPI;

sliderCarouselButtons.forEach(button =>
  button.addEventListener("click", () => handleMouseOnClickCarousel(button))
);

function handleMouseOnClickCarousel(button) {
  const carousel = button.closest("[data-carousel]");

  if (!carousel) return;

  const allSlides = carousel.querySelector("[data-slides]");

  if (!allSlides) return;

  const switchDirection = button.dataset.carouselButton === "next" ? 1 : -1;
  const activeSlide = allSlides.querySelector("[data-active]");

  if (!activeSlide) return;

  let newIndex = [...allSlides.children].indexOf(activeSlide) + switchDirection;

  if (newIndex < 0) newIndex = allSlides.children.length - 1;

  if (newIndex >= allSlides.children.length) newIndex = 0;

  allSlides.children[newIndex].setAttribute("data-active", "true");

  activeSlide.removeAttribute("data-active");
}

function onInitialRender(games) {
  games.map(({ imageURL, name }) => {
    const cardBoxElement = document.createElement("span");
    cardBoxElement.innerHTML = `<img src="${imageURL}" alt="${name}" class="card-game-img" loading="lazy" fetchpriority="high">`;
    cardImageGamecontainer.appendChild(cardBoxElement);
  });
}

let currentPage = 1;
let itemsPerPage = 8;
let displayedGames = [];

function onHandleLoadMore() {
  loadMoreButton.disabled = true;
  loadingSpinner.style.display = "block";

  setFakeDelay(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const displayGames = gamesAPI.slice(start, end);

    displayedGames = displayedGames.concat(displayGames);
    onInitialRender(displayGames);

    currentPage++;

    if (displayedGames.length >= gamesAPI.length) {
      loadMoreButton.disabled = true;
      loadMoreButton.textContent = "Todos os jogos carregados.";
      loadingSpinner.style.display = "none";
    } else {
      loadMoreButton.disabled = false;
      loadingSpinner.style.display = "none";
    }
  });
}

function handleSearch(term, jsonData) {
  if (!term.trim()) {
    return jsonData;
  }

  const switchToLowerCase = term.toLowerCase();

  const handleSearchedValue = jsonData.filter(item => {
    return Object.values(item).some(value =>
      String(value).toLowerCase().includes(switchToLowerCase)
    );
  });

  return handleSearchedValue;
}

function handleSearchInput(event) {
  const getSearchTerm = event.target.value;

  const handleGetResults = handleSearch(getSearchTerm, gamesAPI);

  displaySearchResults(handleGetResults);
}

function displaySearchResults(results) {
  cardImageGamecontainer.innerHTML = "";

  if (results.length === 0) {
    displayNoResults();

    loadMoreButton.style.display = "none";
  } else {
    results.forEach(({ imageURL, name }) => {
      const cardBoxElement = document.createElement("span");
      cardBoxElement.innerHTML = `<img src="${imageURL}" alt="${name}" class="card-game-img" loading="lazy" fetchpriority="high">`;
      cardImageGamecontainer.appendChild(cardBoxElement);
    });

    loadMoreButton.style.display = "none";
  }
}

function displayNoResults() {
  const inexistResult = document.createElement("div");

  inexistResult.className = "show-off";

  inexistResult.textContent = "Nenhum jogo foi encontrado.";

  cardImageGamecontainer.appendChild(inexistResult);
}

searchInput.addEventListener("input", handleSearchInput);

onHandleLoadMore();

loadMoreButton.addEventListener("click", onHandleLoadMore);
