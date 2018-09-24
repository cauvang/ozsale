'strict'

var app = app || {}
app.mainMenu = {}

const func = function () {
    this.onMenuClick = function () {
        $("header").toggleClass("menu-open")
    }
    this.init = function () {
        this.togglemenu = $("#togglemenu");
        this.togglemenu.click(this.onMenuClick)
    }
};
func.apply(app.mainMenu)