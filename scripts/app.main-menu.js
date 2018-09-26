'strict'

var app = app || {}
app.mainMenu = {}

const func = function () {
    this.renderMenuList = function (items) {
        $("#menu-list").html("");
        // console.log("window.location.hash", window.location.hash)
        for (var i = 0; i < items.length; i++) {
            // console.log(items[i])
            const item = items[i];
            let className = "";
            if (i == items.length - 1) className = "emphasis";

            var activeClass = "";
            var hash = window.location.hash.substring(1);

            if (hash == item.catId) activeClass = "active";

            $("#menu-list").append("<li rel= '" + item.catId + "' class ='" + activeClass + "'><a data-catId= '" + item.catId + "' href='#" + item.catId + "' class='" + className + "'>" + item.name + "</a></li>")
        }

        // set hash for fist item
        if (!window.location.hash) {
            window.location.hash = items[0].catId;
            $("#menu-list").find("li:first-child").addClass("active");
        }
        $(window).on('hashchange', function () {
            $("#menu-list li").removeClass("active")
            var hash = window.location.hash.substring(1);
            $("li[rel='" + hash + "']").addClass("active")

        });

        // this.reloadDataMatchHash();

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