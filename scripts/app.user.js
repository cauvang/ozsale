'strict'

'strict'

var app = app || {};
app.user = {};

(function () {

    this.onProfileClick = function () {
        $.fancybox.open($(".login-form"));

    }

    this.onSignUpClick = function () {
        $.fancybox.getInstance().close();
        $.fancybox.open($(".sign-up-form"));

    }
    this.init = function () {
        $(".profile-image").click(this.onProfileClick);
        $(".btn-sign-up").click(this.onSignUpClick);

    }
}).apply(app.user)