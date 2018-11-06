'strict'

var app = app || {};
app.user = {};

(function () {

    this.onProfileClick = function () {
        // console.log("profile click", localStorage.token)
        if (localStorage.token)
            window.location.href = "profile.html";
        else
            $.fancybox.open($(".login-form"));

    }

    this.onSignUpClick = function () {
        $.fancybox.getInstance().close();
        $.fancybox.open($(".sign-up-form"));
        $(".sign-up-form input").val("");
    }

    this.onJoinClick = function (e) {
        // console.log(e)
        var validation_email = $("#email-signUp")[0].checkValidity();
        var validation_pass = $("#password-signUp")[0].checkValidity();
        // console.log("hasError_pass", validation_email, validation_pass)
        if (validation_email && validation_pass) {
            // console.log("pass")
            e.preventDefault()
            var user = {
                email: $("#email-signUp").val(),
                firstName: $("#firstName").val(),
                lastName: $("#lastName").val(),
                password: $("#password-signUp").val(),
                agreedTerm: $("#termCheck").is(":checked")
            }

            const url = "https://ozsale.herokuapp.com/api/user";
            $.ajax({
                type: "POST",
                url: url,
                data: user,
                success: function (heo) {
                    $.fancybox.getInstance().close();
                    $.fancybox.open($(".login-form"));
                    $(".notice").addClass("show-notice")
                    $("#login-hidden-content").removeClass("show-notice-wrong");
                    $(".login-form #email").val(user.email);
                },
            });
        } else {
            console.log("fail")
        }

    }

    this.onSignInClick = function (e) {
        var me = app.user;
        if (localStorage.getItem("token") != null) {} else {

            e.preventDefault()

            var user = {
                email: $("#email").val(),
                password: $("#password").val(),
            }
            const url = "https://ozsale.herokuapp.com/auth/login";
            $.ajax({
                type: "POST",
                url: url,
                data: user,
                success: function (data) {
                    me.logged = true;
                    me.userData = data;
                    localStorage.setItem("user", {
                        email: data.user.email,
                        firstName: data.user.firstName,
                        lastName: data.user.lastName
                    });
                    localStorage.token = data.token;
                    $.fancybox.getInstance().close();
                    $("body").addClass("logged");
                    $(".username").text("Hello, " + data.user.firstName)
                    app.cart.getCartItems();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    // alert(xhr.status);
                    // alert(thrownError);
                    // alert(errorMessage); //: "Wrong email or password"
                    $(".notice-wrong").addClass("show-notice-wrong")
                },
            });
        }
    }
    this.onSignOutClick = function () {
        this.logged = false;
        this.userData = null;
        localStorage.clear();
        $(".username").text("");
        $("body").removeClass("logged");

        app.cart.EmptyCart();

    }
    this.verify = function (success, err) {
        if (this.logged) {
            success();
        } else
            err();
    }
    this.checkLoggedOn = function () {
        var me = this;
        if (localStorage.token) {
            $.ajax({
                url: "https://ozsale.herokuapp.com/api/user",
                headers: {
                    'Authorization': 'Bearer ' + localStorage.token,
                    'Content-Type': 'application/json'
                },
                method: 'GET',
                success: function (data) {
                    me.logged = true;
                    me.userData = data;
                    //   console.log('logged on success: ', data);
                    $("body").addClass("logged");
                    if (data.email)
                        $(".username").text("Hello, " + data.firstName);

                    app.cart.getCartItems();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    localStorage.clear();
                },
            });
        }
    }
    this.init = function () {
        this.logged = false;
        this.checkLoggedOn();

        $(".profile-image").click(this.onProfileClick);
        $(".btn-sign-up").click(this.onSignUpClick);
        $(".btn-join").click(this.onJoinClick);
        $("#login-hidden-content").submit(this.onSignInClick)
        $(".sign-out").click(this.onSignOutClick);
    }
}).apply(app.user)