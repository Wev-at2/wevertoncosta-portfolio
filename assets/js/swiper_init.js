export function swiperInit() {
  document.addEventListener('DOMContentLoaded', function () {
    const swiper = new Swiper('.wc-projects__items', {
      loop: true,
      // effect: "coverflow",
      centeredSlides: true,
      centeredSlidesBounds: true,
      slidesPerView: "auto",
      coverflowEffect: {
        depth: 0,
        modifier: 1,
        rotate: 50,
        scale: 0.8,
        stretch: 0,
        slideShadows: true,
      },
      // autoplay: {
      //   delay: 10000,
      //   disableOnInteraction: false,
      //   pauseOnMouseEnter: true,
      // },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 1.2,
          spaceBetween: 20,
          navigation: false,
        },
        768: {
          slidesPerView: 1,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 50,
        },
      },
    });
  });

}
