$('.main-carousel').slick({
  centerMode: true,
  centerPadding: '60px',
  slidesToShow: 3,
  dots: true,
  infinite: true,
  responsive: [
    {
      breakpoint: 768,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 3
      }
    },
    {
      breakpoint: 480,
      settings: {
        arrows: false,
        centerMode: true,
        centerPadding: '40px',
        slidesToShow: 1
      }
    }
  ]
});

const slide = document.querySelector('.slick-center')

function handleMouseMove(event) {
  
  const r = slide.getBoundingClientRect()

  slide.style.setProperty('--x', event.clientX - (r.left + Math.floor(r.width / 2)))
  slide.style.setProperty('--y', event.clientY - (r.top + Math.floor(r.height / 2)))
}

function handleMouseLeave() {   
  
  slide.style.setProperty('--x', 0)
  slide.style.setProperty('--y', 0)
}

window.addEventListener('mousemove', handleMouseMove)
window.addEventListener('mouseleave', handleMouseLeave)