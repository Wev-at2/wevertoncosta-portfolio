// Header fixo após 100px de rolagem.
// A rolagem suave das âncoras fica no CSS (scroll-behavior), respeitando prefers-reduced-motion.
export function menuScroll() {
    const sticky = document.querySelector(".sticky");
    if (!sticky) return;

    let ticking = false;

    function updateHeader() {
        sticky.classList.toggle("fixed", window.scrollY >= 100);
        ticking = false;
    }

    window.addEventListener(
        "scroll",
        () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeader);
                ticking = true;
            }
        },
        { passive: true }
    );

    updateHeader();
}
