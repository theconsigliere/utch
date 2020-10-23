// Currency Global Variables
//
// CURRENCY PICKER
//-----------------------------------------------------------------------------------------------------

let moneySpanSelector = "span.money",
  currencyPickerSelector = "[name=currencies]",
  activeCurrencySelector = ".js-active-currency",
  currencyNoteSelector = ".js-cart-currency-note";

let currencyPicker = {
  loadCurrency: function() {
    /* Fix for customer account pages */
    $(moneySpanSelector + " " + moneySpanSelector).each(function() {
      $(this)
        .parents(moneySpanSelector)
        .removeClass("money");
    });

    /* Saving the current price */
    $(moneySpanSelector).each(function() {
      $(this).attr("data-currency-" + shopCurrency, $(this).html());
    });

    // If there's no cookie.
    if (cookieCurrency == null) {
      if (shopCurrency !== defaultCurrency) {
        Currency.convertAll(shopCurrency, defaultCurrency);
      } else {
        Currency.currentCurrency = defaultCurrency;
      }
    }
    // If the cookie value does not correspond to any value in the currency dropdown.
    else if (
      $(currencyPickerSelector).length &&
      $(currencyPickerSelector + " option[value=" + cookieCurrency + "]")
        .length === 0
    ) {
      Currency.currentCurrency = shopCurrency;
      Currency.cookie.write(shopCurrency);
    } else if (cookieCurrency === shopCurrency) {
      Currency.currentCurrency = shopCurrency;
    } else {
      $(currencyPickerSelector).val(cookieCurrency);
      Currency.convertAll(shopCurrency, cookieCurrency);
    }

    // at end of currency load set currency blurb in cart
    currencyPicker.setCurrencyText();
  },
  onCurrencyChanged: function(event) {
    let newCurrency = $(this).val(),
      $otherPickers = $(currencyPickerSelector).not($(this));

    Currency.convertAll(Currency.currentCurrency, newCurrency);
    currencyPicker.setCurrencyText(newCurrency);

    if ($otherPickers.length > 0) {
      $otherPickers.val(newCurrency);
    }
  },
  // if nothing is specified in current currency default to Currency.currentCurrency
  setCurrencyText: function(newCurrency = Currency.currentCurrency) {
    let $activeCurrency = $(activeCurrencySelector),
      $currencyNote = $(currencyNoteSelector);

    // if activeCurrency exists

    if ($activeCurrency.length > 0) {
      $activeCurrency.text(newCurrency);
    }

    // show note if currency is different from our default currency but not if it is the same

    if ($currencyNote.length > 0) {
      if (newCurrency !== shopCurrency) {
        $currencyNote.show();
      } else {
        $currencyNote.hide();
      }
    }
  },
  onMoneySpanAdded: function() {
    Currency.convertAll(shopCurrency, Currency.currentCurrency);
    // at end of currency load set currency blurb in cart
    currencyPicker.setCurrencyText();
  },
  init: function() {
    if (showMultipleCurrencies !== true) {
      return false;
   }

    currencyPicker.loadCurrency();

    $(document).on(
      "change",
      currencyPickerSelector,
      currencyPicker.onCurrencyChanged
    );
  }
};

currencyPicker.init();