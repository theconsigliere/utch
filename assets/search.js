// SEARCH INPUT
// --------------------------------------------------------------------
//
let searchInputSelector = ".js-search-input",
  searchSubmitSelector = ".js-search-submit",
  onSearchInputKeyup = function(event) {
    let $form = $(this).closest("form"),
      $button = $form.find(searchSubmitSelector),
      // if search term has no value disable button
      shouldDisableButton = this.value.length === 0;

    $button.prop("disabled", shouldDisableButton);

    // console.log(shouldDisableButton);
  };

$(document).on("keyup", searchInputSelector, onSearchInputKeyup);
