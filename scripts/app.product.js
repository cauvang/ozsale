'strict'

var app = app || {};
app.product = {};

(function () {

    this.getProductDetail = function (data) {
        //     console.log("product info:", data);
        this.getImages(data);
        this.getDetail(data);
    }

    this.getDetail = function (data) {
        $(".brand-name").text(data.brandName);
        $(".product-name").text(data.name);
        $(".price-text").text(app.utils.currencyFormat(data.originalPrice.value));
        $(".website-price-text").text(app.utils.currencyFormat(data.price.value));
        $(".pricing-hint").text(data.pricing);
        $(".pay-now-price").text(app.utils.currencyFormat(data.ourPayInfo.summary.firstTransactionAmount));
        $(".pay-now-count").text(data.ourPayInfo.summary.firstTransactionText);
        $(".delivery-date").text(data.deliveryInformation);
        $(".shipping-info").html(data.shippingInformation);
        $(".product-description").html(data.description);
        $(".brand-description").text(data.attributes.brandDescription);

        $(".buttons").remove();
        if (data.skuVariants.length == 1)
            $(".size-container").append('<button class = "buttons select" >' + data.skuVariants[0].attributes.size + '</button>');
        else {
            for (var is = 0; is < data.skuVariants.length; is++) {
                $(".size-container").append('<button class = "buttons">' + data.skuVariants[is].attributes.size + '</button>');
            }
        }
        $(".btn-size").click(this.onButtonSizeClick);

    }

    this.onButtonSizeClick = function () {
        $(".size-container button").removeClass("select");
        $(this).addClass("select");
    }

    this.getImages = function (data) {
        var images = data.images;


        $(".img-big")
            .attr("src", images[3])
            .wrap('<span style="display:inline-block"></span>')
            .css('display', 'block')
            .parent()
            .zoom({
                url: images[3]
            });
    }

    this.onTooltipClick = function () {
        $(".pricing-hint").addClass("show-hint");
    }
    this.fetchProductDetail = function () {
        const url = "https://ozsale.herokuapp.com/api/product/" + this.seoIdentifier;
        $.ajax({
            url: url
        }).done(this.getProductDetail.bind(this));
    }

    this.init = function () {
        this.seoIdentifier = app.utils.getParameterValues("id");
        this.fetchProductDetail();
        $(".img-tooltip").click(this.onTooltipClick);
    }
}).apply(app.product)