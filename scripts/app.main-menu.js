'strict'

var app = app || {}
app.mainMenu = {}

const func = function () {
    this.renderMenuList = function (items) {
        $("#menu-list").html("");

        for (var i = 0; i < items.length; i++) {
            const item = items[i];
            const catId = item.id || "";

            var activeClass = "";
            var hash = window.location.hash.substring(1);

            if (hash == catId || (hash == undefined && catId == "")) activeClass = "active";

            const li = $("<li></li>").attr("rel", catId).addClass("menu-hover " + activeClass);
            const a = $("<a></a>").attr("href", "index.html#" + catId).text(item.name);
            li.append(a)
            const div = $("<div class='menu-inner'></div>")
            item.children = item.children || [];
            for (var j = 0; j < item.children.length; j++) {
                let child = item.children[j];
                const div1 = $("<div></div>").addClass("menu-inner-col");
                const h4 = $("<h4></h4>");
                const ah4 = $("<a></a>").attr("href", "item.html?id=" + encodeURIComponent(child.id) + '&key=' + encodeURIComponent(child.key)).text(child.name);
                h4.append(ah4);
                div1.append(h4);

                child.children = child.children || [];


                const ul = $("<ul></ul>");

                for (var k = 0; k < child.children.length; k++) {
                    let grandchild = child.children[k];
                    const li1 = $("<li></li>");
                    const ali1 = $("<a></a>").attr("href", "item.html?id=" + encodeURIComponent(grandchild.id) + '&key=' + encodeURIComponent(grandchild.key)).text(grandchild.name);
                    li1.append(ali1);
                    ul.append(li1);
                }
                div1.append(ul);

                div.append(div1);

                li.append(div);

            }

            $("#menu-list").append(li);


        }

        $(window).on('hashchange', function () {
            $("#menu-list li").removeClass("active")
            var hash = window.location.hash.substring(1);
            $("li[rel='" + hash + "']").addClass("active")
        });

    }

    this.loadMenu = function () {
        const url = "https://ozsale.herokuapp.com/api/shop/menu"
        $.ajax({
            url: url
        }).done(this.renderMenuList);
    }
    this.onMenuClick = function () {
        $("header").toggleClass("menu-open")
    }
    this.init = function () {
        this.togglemenu = $("#togglemenu");
        this.loadMenu();
        this.togglemenu.click(this.onMenuClick);
    }
};
func.apply(app.mainMenu)