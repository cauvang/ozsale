var app = app || {};
app.utils = {};
(function () {
    this.getImageUrl = function (item) {
        return "https://c1.mysalec.com/sales/" + item.ID + "/" + item.ImageID + "/" + item.File
    }

    this.getBrandImageUrl = function (item) {
        return "https://c1.mysalec.com/brands/" + item.BrandID + "/" + item.ImageID + "/" + item.File
    }

    this.getProductImageList = function (item) {
        var images = [];
        if (item.Images && item.Images.length > 0) {
            for (var i = 0; i < item.Images.length; i++) {
                var img = item.Images[i];
                var url = "https://c1.mysalec.com/brands/" + item.BrandID + "/" + img.ID + "/";
                images[i] = {
                    smallThumbnail: url + img.SmallThumbnail,
                    thumbnail: url + img.Thumbnail,
                    preview: url + img.Preview
                }
            }
        }
        return images;
    }

    this.currencyFormat = function (item) {
        return "$" + item + ".00";
    }
    this.getParameterValues = function (param) {
        var rawUrl = window.location.href.slice(0, window.location.href.indexOf('#'))
        var url = rawUrl.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < url.length; i++) {
            var urlparam = url[i].split('=');
            if (urlparam[0] == param) {
                return urlparam[1];
            }
        }
    }
}).apply(app.utils)