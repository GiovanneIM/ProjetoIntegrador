var swiper = new Swiper(".swiper", {
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
      clickable: true,
      loop: true,
      grabCursor: true,
    },
    breakpoints: {
  // when window width is >= 320px
  640: {
    slidesPerView: 2,
    spaceBetween: 20
  },
  // when window width is >= 480px
  768: {
    slidesPerView: 2,
    spaceBetween: 18,
  },
  // when window width is >= 640px
  1188: {
    slidesPerView: 3,
    spaceBetween: 24
  }
}
  });