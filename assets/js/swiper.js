var mySwiper = new Swiper('.swiper-container', {
    // Optional parameters
    loop: true,
    effect: 'fade',
    centeredSlides: true,
    autoplay: {
      delay: 2500,
      disableOnInteraction: false,
    },
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
  })