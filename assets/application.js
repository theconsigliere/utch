// ADD TO CART FORM
//--------------------------------------------------------------------------------------------------------------

// Add to Cart Form
let addToCartFormSelector = "#add-to-cart-form",
  // jquery [name*=option] selects any html component ie select, radio with name = option
  productOptionSelector = addToCartFormSelector + " [name*=option]";

// Object of functions for use in product form

let productForm = {
  onProductOptionChanged: function (event) {
    let $form = $(this).closest(addToCartFormSelector),
      selectedVariant = productForm.getActiveVariant($form);

    // make accessible to validate function
    $form.trigger("form:change", [selectedVariant]);
  },
  getActiveVariant: function ($form) {
    // get variants from JSON data-variants='{{ variants_with_quantity_json | url_param_escape }} in add to cart form
    let //read JSON

      variants = JSON.parse(decodeURIComponent($form.attr("data-variants"))),
      formData = $form.serializeArray(),
      // create blank object
      formOptions = {
        option1: null,
        option2: null,
        option3: null
      },
      selectedVariant = null;

    // match formOptions object with formData Object
    $.each(formData, function (index, item) {
      if (item.name.indexOf("option") !== -1) {
        formOptions[item.name] = item.value;
      }
    });

    // match JSON with formOptions Object
    $.each(variants, function (index, variant) {
      if (
        variant.option1 === formOptions.option1 &&
        variant.option2 === formOptions.option2 &&
        variant.option3 === formOptions.option3
      ) {
        selectedVariant = variant;
        return false;
      }
    });

    return selectedVariant;
  },
  validate: function (event, selectedVariant) {
    let $form = $(this),
      hasVariant = selectedVariant !== null,
      canAddToCart = hasVariant && selectedVariant.inventory_quantity > 0,
      $id = $form.find(".js-variant-id"),
      $addToCartButton = $form.find("#add-to-cart-button"),
      $price = $form.find(".js-price"),
      formattedVariantPrice,
      priceHtml;
    // add email when available button
    $emailButton = $form.find('#mhaRnProduct')


    // when we have variant amke sure we have the correct price
    if (hasVariant) {
      // Changes price from 24900 to $249.00
      formattedVariantPrice = "$" + (selectedVariant.price / 100).toFixed(2);
      priceHtml = '<span class="money">' + formattedVariantPrice + "</span>";

      // create url of each variant
      //https://developer.mozilla.org/en-US/docs/Web/API/History_API

      window.history.replaceState(null, null, "?variant=" + selectedVariant.id);
    } else {
      priceHtml = $price.attr("data-default-price");
    }

    // hide and show email when avaible button

    if (canAddToCart) {
      $id.val(selectedVariant.id);
      $addToCartButton.prop("disabled", false);
      $emailButton.css("display", "none")

    } else {
      $id.val("");
      $addToCartButton.prop("disabled", true);
      $emailButton.css("display", "block")
    }

    $price.html(priceHtml);
    currencyPicker.onMoneySpanAdded();
  },
  init: function () {


    // when select form is changed run productForm.onProductOptionChanged

    $(document).on(
      "change",
      productOptionSelector,
      productForm.onProductOptionChanged
    );



    // validate form
    $(document).on("form:change", addToCartFormSelector, productForm.validate);
  }
};

// run object of functions
productForm.init();





// AJAX API FUNCTIONALITY
//---------------------------------------------------------------
//
let miniCartContentsSelector = ".js-mini-cart-contents";
let ajaxify = {
  onAddToCart: function (event) {
    event.preventDefault();

    $.ajax({
      type: "POST",
      url: "/cart/add.js",
      data: $(this).serialize(),
      dataType: "json",
      success: ajaxify.onCartUpdated,
      error: ajaxify.onError
    });
  },
  onCartUpdated: function () {
    // disable while updating with ajax
    let $miniCartFieldset = $(miniCartContentsSelector + " .js-cart-fieldset");

    $miniCartFieldset.prop("disabled", true);

    $.ajax({
      type: "GET",
      url: "/cart",
      context: document.body,
      success: function (context) {
        let $dataCartContents = $(context).find(".js-cart-page-contents"),
          dataCartHtml = $dataCartContents.html(),
          dataCartItemCount = $dataCartContents.attr("data-cart-item-count"),
          $miniCartContents = $(miniCartContentsSelector),
          $cartItemCount = $(".js-cart-item-count");

        $cartItemCount.text(dataCartItemCount);
        $miniCartContents.html(dataCartHtml);
        currencyPicker.onMoneySpanAdded();

        if (parseInt(dataCartItemCount) > 0) {
          ajaxify.openCart();
        } else {
          ajaxify.closeCart();
        }
      }
    });
  },
  onError: function (XMLHttpRequest, textStatus) {
    let data = XMLHttpRequest.responseJSON;
    alert(data.status + " - " + data.message + ": " + data.description);
  },
  onCartButtonClick: function (event) {
    let isCartOpen = $("html").hasClass("mini-cart-open"),
      // no mini-cart if we are on cart page, 'window.location.href.indexOf' returns an integer so we have to check it doesn't return -1
      isInCart = window.location.href.indexOf("/cart") !== -1;

    if (!isInCart) {
      event.preventDefault();
      if (!isCartOpen) {
        ajaxify.openCart();
      } else {
        ajaxify.closeCart();
      }
    }
  },
  // if mega menu is hovered close mini cart
  ifMegaMenu: function () {

    if ($('.mega-menu-full').is(':visible')) {
      ajaxify.closeCart()
    }
  },

  openCart: function () {
    $("html").addClass("mini-cart-open");
  },
  closeCart: function () {
    $("html").removeClass("mini-cart-open");
  },
  init: function () {
    $(document).on("submit", addToCartFormSelector, ajaxify.onAddToCart);

    $('.nav_item').on('mouseover', ajaxify.ifMegaMenu)

    $(document).on(
      "click",
      ".js-cart-link, .js-keep-shopping",
      ajaxify.onCartButtonClick
    );
  }
};

ajaxify.init();

// Quantity Fields
//-----------------------------------------------------------
//
let quantityFieldSelector = ".js-quantity-field",
  quantityButtonSelector = ".js-quantity-button",
  quantityPickerSelector = ".js-quantity-picker",
  quantityPicker = {
    onButtonClick: function (event) {
      // alert('button clicked');
      let $button = $(this),
        $picker = $button.closest(quantityPickerSelector),
        $quantity = $picker.find(".js-quantity-field"),
        quantityValue = parseInt($quantity.val()),
        max = $quantity.attr("max") ? parseInt($quantity.attr("max")) : null;

      if (
        $button.hasClass("plus") &&
        (max === null || quantityValue + 1 <= max)
      ) {
        // do something for plus click
        $quantity.val(quantityValue + 1).change();
      } else if ($button.hasClass("minus")) {
        // do something for minus click
        $quantity.val(quantityValue - 1).change();
      }
    },
    onChange: function (event) {
      let $field = $(this),
        $picker = $field.closest(quantityPickerSelector),
        $quantityText = $picker.find(".js-quantity-text"),
        shouldDisableMinus =
        parseInt(this.value) === parseInt($field.attr("min")),
        shouldDisablePlus =
        parseInt(this.value) === parseInt($field.attr("max")),
        $minusButton = $picker.find(".js-quantity-button.minus"),
        $plusButton = $picker.find(".js-quantity-button.plus");

      $quantityText.text(this.value);

      if (shouldDisableMinus) {
        $minusButton.prop("disabled", true);
      } else if ($minusButton.prop("disabled") === true) {
        $minusButton.prop("disabled", false);
      }

      if (shouldDisablePlus) {
        $plusButton.prop("disabled", true);
      } else if ($plusButton.prop("disabled") === true) {
        $plusButton.prop("disabled", false);
      }
    },
    init: function () {
      $(document).on(
        "click",
        quantityButtonSelector,
        quantityPicker.onButtonClick
      );
      $(document).on("change", quantityFieldSelector, quantityPicker.onChange);
    }
  };

quantityPicker.init();

// Line Item
// -----------------------------------------------------------------------------
// Automatically update Mini Cart & Regular Cart

// Line Item
let removeLineSelector = ".js-remove-line",
  lineQuantitySelector = ".js-line-quantity";

let lineItem = {
  isInMiniCart: function (element) {
    let $element = $(element),
      $miniCart = $element.closest(miniCartContentsSelector),
      // Checking if miniCart element exists, will return true if bigger than 0
      isInMiniCart = $miniCart.length !== 0;

    return isInMiniCart;
  },
  onLineQuantityChanged: function (event) {
    let quantity = this.value,
      id = $(this)
      .attr("id")
      .replace("updates_", "");

    // https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#change-cart
    let changes = {
        quantity: quantity,
        id: id
      },
      // check if in mini cart
      isInMiniCart = lineItem.isInMiniCart(this);

    // pass changes object into ajax update
    if (isInMiniCart) {
      $.post("/cart/change.js", changes, ajaxify.onCartUpdated, "json");
    }
  },
  onLineRemoved: function (event) {
    let isInMiniCart = lineItem.isInMiniCart(this);

    if (isInMiniCart) {
      event.preventDefault();

      let $removeLink = $(this),
        removeQuery = $removeLink.attr("href").split("change?")[1];
      $.post("/cart/change.js", removeQuery, ajaxify.onCartUpdated, "json");
    }
  },
  init: function () {
    $(document).on("click", removeLineSelector, lineItem.onLineRemoved);
    $(document).on(
      "change",
      lineQuantitySelector,
      lineItem.onLineQuantityChanged
    );
  }
};

lineItem.init();