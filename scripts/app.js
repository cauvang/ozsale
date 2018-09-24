'strict'

var app = app || {}

const func1 = function () {
    this.onGotopButtonClick = function () {
        $('html, body').animate({
            scrollTop: 0
        }, 1200, function () {});
    }
    this.onScrollChange = function () {
        if (window.scrollY > 70) {
            $("body").addClass("scroll-top");
        } else {
            $("body").removeClass("scroll-top");
        }
    }
    this.onArrowRightClick = function () {
        $(".side-bar").toggleClass("show-sidebar");
    }

    this.onZoom = function () {
        $('.img-big')
            .wrap('<span style="display:inline-block"></span>')
            .css('display', 'block')
            .parent()
            .zoom();
    }



    this.init = function () {
        $(".button-goup").click(this.onGotopButtonClick)
        $(document).scroll(this.onScrollChange)
        $("#arrow-right").click(this.onArrowRightClick)
        $(".img-small").click(this.onZoom)
    };
}
func1.apply(app)