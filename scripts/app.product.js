'strict'

var app = app || {};
app.product = {};

(function () {

    this.getProductDetail = function (data) {
        //  console.log("product info:", data);
        this.getImages(data.images);
        this.getDetail(data);
    }

    this.getDetail = function (data) {
        $(".description-top").text(data.labelText);
        $(".brand-name").text(data.brandName);
        $(".product-name").text(data.name);
        if (data.originalPrice.value == 0) {
            $(".original-price .price-text").remove();
            $(".original-price .img-tooltip").remove();
        } else {
            $(".original-price .price-text").text(app.utils.currencyFormat(data.originalPrice.value));
            $(".original-price .pricing-hint").text(data.rrpText);
        }
        $(".website-price .price-text").text(app.utils.currencyFormat(data.price.value));
        $(".website-price .pricing-hint").html(data.pricing);
        $(".pay-now-price").text(app.utils.currencyFormat(data.ourPayInfo.summary.firstTransactionAmount));
        $(".pay-now-count").text(data.ourPayInfo.summary.firstTransactionText);
        $(".payment-info").text(data.ourPayInfo.summary.description);

        $(".delivery-date").text(data.deliveryInformation);
        $(".shipping-info").html(data.shippingInformation);
        $(".product-description").html(data.description);

        if (data.attributes.brandDescription)
            $(".brand-description").text(data.attributes.brandDescription);
        else
            $(".brand-description").remove();

        $(".buttons").remove();
        for (var is = 0; is < data.skuVariants.length; is++) {
            const size = data.skuVariants[is].attributes.size;
            // var soldOut = true;
            // console.log("Sizee", size, data);
            // for (var ia = 0; ia < data.attributes.length; ia++) {
            //     console.log("Sizee", data.attributes[ia].size)
            //     if (size == data.attributes[ia].size) {
            //         soldOut = false;
            //         break;
            //     }
            // }
            // if (soldOut)
            //     $(".size-container").append('<button class = "buttons is-sold-out">' + size + '</button>');
            // else
            if (size != null)
                $(".size-container").append('<button class = "buttons">' + size + '</button>');
        }
        if (data.skuVariants.length == 1)
            $(".size-container buttons").addClass("select");
        if ($(".size-container .buttons").length == 0)
            $(".size-container").remove();

        $(".buttons").click(this.onButtonSizeClick);
        $(".pay-now-container .img-tooltip").click(this.onPaymentClick);

        $(".schedule ul").remove();
        var paymentSchedule = data.ourPayInfo.summary.schedule;
        for (var i = 0; i < paymentSchedule.length; i++) {
            const ul = $("<ul></ul>");
            $(".schedule").append(ul);
            const ps = paymentSchedule[i];
            const li1 = $("<li></li>").addClass("date").text(moment(ps.plannedDate).format('DD MMM'));
            ul.append(li1);
            for (k = 1; k <= 4; k++) {
                const li2 = $('<li><div><span class="number">' + k + '</div></span></li>');
                if (k <= ps.number) {
                    li2.find(".number").addClass("number-select");
                }
                ul.append(li2);
            }
            const li3 = $("<li></li>").addClass("price-text").text(ps.amount);
            ul.append(li3);
        }
    }

    this.onPaymentClick = function (data) {
        $(".payment-schedule").toggleClass("show-payment");

    }
    this.onButtonSizeClick = function () {
        $(".size-container button").removeClass("select");
        $(this).addClass("select");
    }

    this.getImages = function (data) {
        if (data.length == 4) {
            $(".small-images").remove();

            $('.img-big')
                .attr("src", data[3])
                .wrap('<span style="display:inline-block"></span>')
                .css('display', 'block')
                .parent()
                .zoom({
                    url: data[3]
                });
        } else {
            $(".img-small").remove();
            var imgURLs = app.utils.getImages(data);
            // console.log(imgURLs)
            $(".img-big").attr("src", imgURLs[0].preview)

            for (var i = 0; i < imgURLs.length; i++) {
                var li = $('<li><a href="#"><img class="img-small" src="' + imgURLs[i].smallThumbnail + '"></a></li>');
                li.data(imgURLs[i])
                li.click(function () {
                    // console.log(this, $(this).data())
                    $("#image-navigator li").removeClass("img-select")
                    $(this).addClass("img-select")
                    var url = $(this).data().preview
                    $('.img-big')
                        .attr("src", url)
                        .wrap('<span style="display:inline-block"></span>')
                        .css('display', 'block')
                        .parent()
                        .trigger('zoom.destroy')
                        .zoom({
                            url: url
                        });

                })
                $("#image-navigator").append(li);
                $("#image-navigator li:first").click();
            }
        }
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

    }


}).apply(app.product)