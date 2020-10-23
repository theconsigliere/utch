const mobile = document.querySelector('.mobile-menu-icon')
const mobileNav = document.querySelector('.mobile-nav')
const toggleIcon = document.getElementById('toggle');


//open mobile menu

mobile.addEventListener('click', function () {
  mobileNav.classList.toggle('js-mobile-menu-appear')
  toggleIcon.classList.toggle('on');


})

// click menu item menu stays open

const navItems = document.querySelectorAll('.nav .nav_item')
const megaMenus = document.querySelectorAll('.mega-menu-full')


function handleNavClick(event) {



  // console.log(this.getElementsByClassName('mega-menu-full')[0] )

  let thisMenu = this.getElementsByClassName('mega-menu-full')[0]

  this.classList.remove('yellow-nav-item')


  // mark the clicked tab as selected

  if (thisMenu.classList.contains('js-display')) {


    // mark all tabs as unselected
    megaMenus.forEach(menu => {
      menu.classList.remove('js-display')
    })

    thisMenu.classList.remove('js-display')
    console.log('contains')


  } else {

    // mark all tabs as unselected
    megaMenus.forEach(menu => {
      menu.classList.remove('js-display')

    })

    navItems.forEach(nav => {
      nav.classList.remove('yellow-nav-item')

    })


    this.classList.add('yellow-nav-item')

    console.log('doesnt contain')
    thisMenu.classList.add('js-display')

  }


}


navItems.forEach(navItem => navItem.addEventListener('click', handleNavClick));

const megaGroups = document.querySelectorAll('.mega-menu-group')


// on page load hide mega menu
window.onload = function () {
  megaGroups.forEach(menu => {
    menu.style.display = 'none !important';
  })
};