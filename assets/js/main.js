import { menuScroll } from "./menu_scroll.js";
import { setupMenu } from "./menu_mobile.js";
import { swiperInit } from "./swiper_init.js";
import { toggleContent } from "./toggleContent.js";
import { revealSectionsOnScroll, projectCardTilt } from "./interactionEnhancements.js";

menuScroll();
setupMenu();
swiperInit();

// Adiciona o evento de clique para o botão "Leia mais"
const readButton = document.getElementById('read-button');
if (readButton) {
  readButton.addEventListener('click', toggleContent);
}

revealSectionsOnScroll();
projectCardTilt();
