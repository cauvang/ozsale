'strict'

var app = app || {};
app.home = {};

(function () {
    this.init = function () {
        $(window).on('hashchange', this.reloadDataMatchHash.bind(this));
        this.reloadDataMatchHash();
    }

    this.reloadDataMatchHash = function () {
        var hash = "";
        if (window.location.hash)
            hash = window.location.hash.substring(1);
        this.loadCategory(hash);
    }

    this.loadCategory = function (categoryId) {
        const me = this;
        const url = "https://ozsale.herokuapp.com/api/category?limit=10"; // + categoryId
        $.ajax({
            url: url
        }).done(this.renderCategoryList.bind(me));
    }

    this.renderCategoryList = function (items) {
        $(".shopping").remove();
        var grps = items.groups;

        for (var i = 0; i < grps.length; i++) {
            if (grps[i].type == "main")
                this.renderHero(grps[i].banners);
            else
                this.renderSection(grps[i])
        }
    }
    this.renderSection = function (section) {
        if (!section.banners || section.banners.length == 0) return;
        var html = $("<section class='shopping'><h2> " + section.title + "</h2></section>");
        var template = $("#shopping-item-template").html();
        var classes = ['first', 'second', 'third']
        for (let index = 0; index < section.Sales.length; index++) {
            const data = section.Sales[index];
            const className = classes[index % 3];
            const el = $(template).addClass(className);
            el.find(".shopping-title").text(data.Name);
            el.find(".description-top").text(data.Desc);
            el.find(".img-inner").attr("src", app.utils.getImageUrl(data));
            el.find("a").attr("href", "item.html?id=" + data.ID + '&name=' + data.Name);
            if (!data.Desc) {
                el.find(".description-top").remove();
            }
            html.append(el);

        }
        $(".main").append(html);

    }
    this.updateHeroItem = function (selector, item, imgParam) {
        var hero = $(selector);
        hero.find(".description-top").text(item.bannerText);
        hero.find(".description-bottom").text(item.description);
        hero.find("a").attr("href", "item.html?id=" + item.destinationId);
        hero.find(".img-inner").attr("src", app.utils.replaceImageUrl(item.image, imgParam));
        if (!item.description) {
            hero.find(".description-top").remove();
        }


    }
    this.renderHero = function (heroItem) {

        this.updateHeroItem(".item1", heroItem[0], "_642x603")
        this.updateHeroItem(".item2", heroItem[1], "_313x603")
        this.updateHeroItem(".item3", heroItem[2], "_313x294")
        this.updateHeroItem(".item4", heroItem[3], "_313x294")
        this.updateHeroItem(".item5", heroItem[4], "_313x294")
        this.updateHeroItem(".item6", heroItem[5], "_313x294")
        this.updateHeroItem(".item7", heroItem[6], "_313x603")

    }

}).apply(app.home)