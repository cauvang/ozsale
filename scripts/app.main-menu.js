'strict'

var app = app || {}
app.mainMenu = {}

const func = function () {
    this.renderMenuList = function (items) {
        $("#menu-list").html("");
        for (var i = 0; i < items.length; i++) {
            console.log(items[i])
            const item = items[i];
            let className = "";
            if (i == items.length - 1) className = "emphasis";
            $("#menu-list").append("<li><a data-catId= '" + item.catId + "' href='#" + item.catId + "' class='" + className + "'>" + item.name + "</a></li>")

        }
    }
    this.loadMenu = function () {
        const url = "https://ozsale.herokuapp.com/api/menu"
        $.ajax({
            url: url
        }).done(this.renderMenuList);
    }
    this.onMenuClick = function () {
        $("header").toggleClass("menu-open")
    }
    this.init = function () {
        this.togglemenu = $("#togglemenu");
        this.togglemenu.click(this.onMenuClick);
        this.loadMenu();
    }
};
func.apply(app.mainMenu)