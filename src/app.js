const buttons = document.querySelectorAll(".carousel-button");

buttons.forEach(button => button.addEventListener("click", () => handleMouseOnClickCarousel(button)));

function handleMouseOnClickCarousel(button) {
    const carousel = button.closest('[data-carousel]');
    
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
import { GameListAPI } from "./database/api.js";
console.log(GameListAPI);
