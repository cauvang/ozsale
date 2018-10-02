'strict'

var app = app || {};
app.product = {};

(function () {

    this.getProductDetail = function (data) {
        console.log("product info:", data);
        this.getImages(data);
        this.getDetail(data);
    }

    this.getDetail = function (data) {
        $(".brand-name").text(data.BrandName);
        $(".product-name").text(data.Name);
        var price = data.RegularPrice;
        if (price % 10 == 0)
            $(".price-text").text(app.utils.currencyFormat(price));
        else
            $(".price-text").text(price);
        price = data.UserPrice;
        if (price % 10 == 0)
            $(".website-price-text").text(app.utils.currencyFormat(price));
        else
            $(".website-price-text").text(price);
        price = data.OurPay.Summary.FirstTransactionAmount;
        if (price % 10 == 0)
            $(".pay-now-price").text(app.utils.currencyFormat(price));
        else
            $(".pay-now-price").text(price);
        $(".pay-now-count").text(data.OurPay.Summary.FirstTransactionText);
        $(".delivery").html(data.publicDetails.Shipping);
        $(".product-description").html(data.Description);
        $(".btn-size").remove();
        if (data.Sizes.length == 1)
            $(".size-container").append('<button class = "buttons select btn-size" >' + data.Sizes[0].Name + '</button>');
        else {
            for (var is = 0; is < data.Sizes.length; is++) {
                $(".size-container").append('<button class = "buttons  btn-size" >' + data.Sizes[is].Name + '</button>');
            }
        }
        $(".btn-size").click(this.onButtonSizeClick);
        $(".btn-quantity").click(this.onButtonQuantityClick);

    }

    this.onButtonSizeClick = function () {
        console.log("textSizeClick");
        $(".size-container button").removeClass("select");
        $(this).addClass("select");
    }
    this.onButtonQuantityClick = function () {
        $(".quantity-container button").removeClass("select");
        $(this).addClass("select");
    }

    this.getImages = function (data) {
        var images = data.Images;

        $(".img-small").remove();
        var imgURLs = app.utils.getProductImageList(data);
        if (imgURLs.length == 0)
            return;

        $(".img-big").attr("src", imgURLs[0].thumbnail)

        for (var i = 0; i < imgURLs.length; i++) {
            var li = $('<li><a href="#"><img class="img-small" src="' + imgURLs[i].smallThumbnail + '"></a></li>');
            li.data(imgURLs[i])
            li.click(function () {
                // console.log(this, $(this).data())
                $(".img-big").attr("src", $(this).data().thumbnail);
                $("#image-navigator li").removeClass("img-select")
                $(this).addClass("img-select")

                $('.img-big')
                    .wrap('<span style="display:inline-block"></span>')
                    .css('display', 'block')
                    .parent()
                    .zoom({
                        url: $(this).data().preview
                    });

            })
            $("#image-navigator").append(li);

            $("#image-navigator li:first").click();
        }

    }
    this.fetchProductDetail = function () {
        const url = "https://ozsale.herokuapp.com/api/product/" + this.saleId + "/" + this.productId;
        $.ajax({
            url: url
        }).done(this.getProductDetail.bind(this));


    }

    this.init = function () {
        this.productId = app.utils.getParameterValues("id");
        this.saleId = app.utils.getParameterValues("saleID");
        console.log(this)
        this.fetchProductDetail();
    }
}).apply(app.product)