var app = app || {};
app.utils = {};
(function () {
    this.getImageUrl = function (item) {
        return "https://c1.mysalec.com/sales/" + item.ID + "/" + item.ImageID + "/" + item.File
    }
}).apply(app.utils)