let mm = new MagnetMouse({
    magnet: {
      element: '.password__title, .btn--share, .button',
      position: 'center'
    },
    follow: {
        element: '.follow',
        class: 'follow-mouse-active' /* Add class to element that follows the mouse when enter in the magnet effect */
      }
  });


  mm.init();