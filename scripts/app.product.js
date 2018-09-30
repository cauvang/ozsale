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
        $(".price-text").text(app.utils.currencyFormat(data.RegularPrice));
        $(".website-price-text").text(app.utils.currencyFormat(data.UserPrice));
        $(".pay-now-price").text(data.OurPay.Summary.FirstTransactionAmount);
        $(".pay-now-count").text(data.OurPay.Summary.FirstTransactionText);

    }
    this.getImages = function (data) {
        var images = data.Images;

        $(".img-small").remove();
        var imgURLs = app.utils.getProductImageList(data);
        $(".img-big").attr("src", imgURLs[0].thumbnail)

        for (var i = 0; i < imgURLs.length; i++) {
            var li = $('<li><a href="#"><img class="img-small" src="' + imgURLs[i].smallThumbnail + '"></a></li>');
            li.data(imgURLs[i])
            li.click(function () {
                // console.log(this, $(this).data())

                $(".img-big").attr("src", $(this).data().thumbnail)
            })
            $("#image-navigator").append(li);
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
        this.fetchProductDetail();
    }
}).apply(app.product)