const buttons = document.querySelectorAll(".carousel-button"); // Buttons of what? Specialize where this buttos are being used...
const cardImageGamecontainer = document.getElementById("card-game");
import { GameListAPI } from "./database/api.js";
const loadMoreButton = document.getElementById("load-more-games");

const loadingSpinner = document.createElement("span"); 
loadingSpinner.classList.add("loading"); 
cardImageGamecontainer.appendChild(loadingSpinner); 

import setFakeDelay from "./helpers/utils.js"; 

const gamesAPI = GameListAPI;

buttons.forEach(button => button.addEventListener("click", () => handleMouseOnClickCarousel(button)));

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
    cardBoxElement.innerHTML = `<img src="${imageURL}" alt="${name}" class="card-game-img">`;
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
  })
}

// Load initial games
onHandleLoadMore();

// Button -> Invoked the function 'onHandleLoadMore' and bring it more data from mock api.
loadMoreButton.addEventListener("click", onHandleLoadMore);
