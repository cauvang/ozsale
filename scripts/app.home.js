'strict'

var app = app || {};
app.home = {};

(function () {
    this.init = function () {
        $(window).on('hashchange', this.reloadDataMatchHash.bind(this));
        this.reloadDataMatchHash();
        this.onScroll();
    };




    this.reloadDataMatchHash = function () {
        $(".shopping").remove();
        this.lastOffset = 0;
        this.lastGroupType = null;
        var hash = "";
        if (window.location.hash)
            hash = window.location.hash.substring(1);
        this.categoryId = hash;
        this.loadCategory();
    }

    this.loadCategory = function () {

        const me = this;
        var url = "https://ozsale.herokuapp.com/api/category?limit=10";
        if (this.categoryId)
            url += "&category=" + this.categoryId;
        if (this.lastGroupType)
            url += "&lastGroupType=" + this.lastGroupType + "&lastGroupOffset=" + this.lastOffset;

        $.ajax({
            url: url
        }).done(this.renderCategoryList.bind(me));


    }

    this.renderCategoryList = function (items) {
        var grps = items.groups;

        for (var i = 0; i < grps.length; i++) {
            if (grps[i].type == "main")
                this.renderHero(grps[i].banners);
            else {
                if (grps[i].type == "promo")
                    continue;
                this.renderSection(grps[i])
            }
        }

        if (grps.length == 0) {
            $("#loadMore").hide();
        } else
            $("#loadMore").show();


    }
    this.renderSection = function (section, ) {
        if (this.lastGroupType == section.type)
            this.lastOffset += section.banners.length;

        else {
            this.lastOffset = section.banners.length
            this.lastGroupType = section.type;
            this.itemCount = 0;
        }

        if (!section.banners || section.banners.length == 0) return;
        var sectionEl = null;
        if ($("." + section.type).length == 0) {
            sectionEl = $("<section class='shopping " + section.type + "'><h2  class='category'>" + section.title + "</h2></section>");
            $(".main").append(sectionEl);
        } else {
            sectionEl = $($("." + section.type)[0])
        }
        var classes = ['first', 'second', 'third']

        for (let index = 0; index < section.banners.length; index++) {
            var template = $("#shopping-item-template").html();
            const data = section.banners[index];
            const className = classes[this.itemCount % 3];
            this.itemCount++;
            const el = $(template).addClass(className);
            if (data.bannerText)
                el.find(".description-top").text(data.bannerText);
            el.find(".description-bottom").text(data.description);
            el.find("a").attr("href", "item.html?id=" + data.destinationId);
            el.find(".img-inner").attr("src", app.utils.replaceImageUrl(data.image, "_313x294"));

            sectionEl.append(el);
        }
    }

    this.updateHeroItem = function (selector, item, imgParam) {
        var hero = $(selector);
        hero.find(".description-top").text(item.bannerText);
        hero.find(".description-bottom").text(item.description);
        hero.find("a").attr("href", "item.html?id=" + item.destinationId);
        hero.find(".img-inner").attr("src", app.utils.replaceImageUrl(item.image, imgParam));
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

    this.onScroll = function () {
        me = this;
        $(window).scroll($.debounce(250, false, function () {

            if ($("#loadMore").visible()) {
                me.loadCategory(null);
            }

        }));

    }


}).apply(app.home)