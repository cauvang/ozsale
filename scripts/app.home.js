'strict'

var app = app || {};
app.home = {};

(function () {
    this.init = function () {
        $(window).on('hashchange', this.reloadDataMatchHash.bind(this));
        this.reloadDataMatchHash();
    }

    this.reloadDataMatchHash = function () {
        if (window.location.hash) {
            var hash = window.location.hash.substring(1); //Puts hash in variable, and removes the # character
            this.loadCategory(hash);
        }
    }
    this.loadCategory = function (categoryId) {
        const me = this;
        const url = "https://ozsale.herokuapp.com/api/category/" + categoryId
        $.ajax({
            url: url
        }).done(this.renderCategoryList.bind(me));
    }
    this.renderCategoryList = function (items) {
        var main;
        $(".shopping").remove();
        for (var i = 0; i < items.length; i++) {
            if (items[i].Name == "Main") {
                main = items[i];
            } else {
                this.renderSection(items[i])
            }
        }
        this.renderHero(main);
    }
    this.renderSection = function (section) {
        if (!section.Sales || section.Sales.length == 0) return;
        var html = $("<section class='shopping'><h2> " + section.Name + "</h2></section>");
        var template = $("#shopping-item-template").html();
        var classes = ['first', 'second', 'third']
        for (let index = 0; index < section.Sales.length; index++) {
            const data = section.Sales[index];
            const className = classes[index % 3];
            const el = $(template).addClass(className);
            el.find(".shopping-title").text(data.Name);
            el.find(".description-top").text(data.Desc);
            el.find(".img-inner").attr("src", app.utils.getImageUrl(data));
            el.find("a").attr("href", "item.html?id=" + data.ID);
            if (!data.Desc) {
                el.find(".description-top").remove();
            }
            html.append(el);

        }
        $(".main").append(html);

    }
    this.updateHeroItem = function (selector, item) {
        var hero = $(selector);
        hero.find(".description-top").text(item.Desc);
        hero.find(".description-bottom").text(item.Name);
        hero.find("a").attr("href", "item.html?id=" + item.ID);
        hero.find(".img-inner").attr("src", app.utils.getImageUrl(item));
        if (!item.Desc) {
            hero.find(".description-top").remove();
        }
    }
    this.renderHero = function (heroItem) {
        this.updateHeroItem(".hero-inner", heroItem.Sales[0])
        this.updateHeroItem(".hero-upper .hero-upper-inner", heroItem.Sales[1])
        this.updateHeroItem(".hero-lower .hero-upper-inner", heroItem.Sales[2])
    }

}).apply(app.home)