'strict'

var app = app || {};
app.checkout = {};

(function () {

    this.onQuantityUpClick = function () {
        var val = parseInt($(".qty-value").text(), 10);
        val = isNaN(val) ? 0 : val;
        $(".qty-value").text(++val)
    }
    this.onQuantityDownClick = function () {
        var val = parseInt($(".qty-value").text(), 10);
        val = isNaN(val) ? 0 : val;
        val > 0 ? --val : val;
        $(".qty-value").text(val)
    }
    this.onPaymentRadioButtonClick = function () {
        if ($(this).is(':checked') && $(this).val() == "Select") {
            $(".delivery-options").addClass("show-delivery");
        }
    }
    this.init = function () {
        $(".qty-up").click(this.onQuantityUpClick);
        $(".qty-down").click(this.onQuantityDownClick);
        $(".radio-payment").click(this.onPaymentRadioButtonClick);
    }

}).apply(app.checkout)