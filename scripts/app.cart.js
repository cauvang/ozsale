'strict'

var app = app || {};
app.cart = {};

(function () {
    this.onAddToCartClick = function () {
        const me = this;
        console.log(app.user.logged)
        if (app.user.logged) {
            if ($(".size-container").length != 0) {
                if (($(".size-container .select")).length == 0) {
                    $(".announce-size").addClass("no-size-selected");
                    setTimeout(function () {
                        $(".announce-size").removeClass("no-size-selected");
                    }, 2000);
                    return;
                }
            }
            console.log("have size", $(".size-container .select"))

            const url = "https://ozsale.herokuapp.com/api/cart";
            $.ajax({
                headers: {
                    'Authorization': 'Bearer ' + localStorage.token,
                    'Content-Type': 'application/json'
                },
                type: "POST",
                url: url,
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                data: JSON.stringify({
                    "productId": app.product.seoIdentifier,
                    "quantity": 1
                }),
                success: function (data) {
                    $(".announce-basket").addClass("added-to-basket");
                    setTimeout(function () {
                        $(".announce-basket").removeClass("added-to-basket");
                    }, 2000);
                    console.log("Add cart", data)
                    me.displayCart(data);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(thrownError);
                }
            });
        } else {
            $.fancybox.open($(".login-form"));
            this.displayCart();
        }
    }

    this.displayCart = function (data) {
        if (data.items.length == 0)
            this.EmptyCart();
        else {
            $(".cart-detail .cart-row").remove();
            var itemCount = 0;
            for (var i = 0; i < data.items.length; i++) {
                var template = $($("#cart-row-template").html());
                var item = data.items[i];
                //  console.log(item);
                template.find(".cart-row-product-count").text(item.quantity + " items");
                itemCount += item.quantity;
                template.find(".cart-row-product-name").text(item.productDetail.name);
                template.find(".cart-row-product-size").text(item.size);
                template.find(".cart-row-image").attr("src", item.productDetail.images[0]);
                template.find(".cart-row-product-price").text(app.utils.currencyFormat(item.productDetail.price.value * item.quantity))

                $(".cart-detail").prepend(template);
            }
            this.HavingCartItems(itemCount);
        }
    }

    this.getCartItems = function () {
        if (app.user.logged) {
            const url = "https://ozsale.herokuapp.com/api/cart";
            $.ajax({
                headers: {
                    'Authorization': 'Bearer ' + localStorage.token,
                    'Content-Type': 'application/json'
                },
                type: "GET",
                url: url

            }).done(this.displayCart.bind(app.cart));
        } else
            this.EmptyCart();
    }

    this.onCheckOutClick = function () {
        console.log("checkout")
        window.location.href = "checkout.html"
    }
    this.EmptyCart = function () {
        $("#shopping-cart-icon").removeClass("not-empty-cart");
        $(".shopping-cart-delivery").text("Your cart is empty");
        $(".cart-detail").remove();
    }
    this.HavingCartItems = function (itemCount) {
        $("#shopping-cart-icon").addClass("not-empty-cart");
        $(".shopping-cart-item-count").text(itemCount);
        $(".shopping-cart-delivery").text("$9.95 Delivery")
    }
    this.init = function () {
        $(".shopping-cart").hover(this.getCartItems.bind(this));
        $(".add-to-cart-button").click(this.onAddToCartClick.bind(this));
        $(".btn-view-basket").click(this.onCheckOutClick);
        $(".btn-checkout").click(this.onCheckOutClick);
    }

}).apply(app.cart)