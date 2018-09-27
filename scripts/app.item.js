'strict'

var app = app || {};
app.item = {};

(function () {
    this.renderSidebarList = function (items) {
        $(".side-bar").html("");
        //   console.log("renderSidebarList", items);
        let categories = [];
        if (items.Categories) {
            categories = items.Categories;
        } else {
            categories.push({
                Name: items.Name,
                ID: items.ID,
                SubCategories: items.SubCategories
            })
        }

        for (var i = 0; i < categories.length; i++) {
            const item = categories[i];
            const ulLevel1 = $("<ul class='category-level-1'/>");
            const li1 = $('<li><ta href="#" class="link-small-hover text-dark">' + item.Name + '</ta></li>');
            const ulLevel2 = $("<ul class='category-level-2'/>");

            for (var j = 0; j < item.SubCategories.length; j++) {
                const item2 = item.SubCategories[j];
                const li2 = $('<li><a href="#" class="link-small-hover">' + item2.Name + '</a></li>');
                if (item2.Sizes) {
                    const ulLevel3 = $("<ul class='category-level-3'/>");

                    for (var k = 0; k < item2.Sizes.length; k++) {
                        const item3 = item2.Sizes[k];
                        const li3 = $('<li><a href="#" class="link-small-hover">' + item3.Name + '</a></li>');
                        ulLevel3.append(li3);
                    }
                    li2.append(ulLevel3);
                }
                ulLevel2.append(li2);
            }
            li1.append(ulLevel2);
            ulLevel1.append(li1);
            $(".side-bar").append(ulLevel1)
        }
    }

    this.GetParameterValues = function (param) {
        var rawUrl = window.location.href.slice(0, window.location.href.indexOf('#'))
        var url = rawUrl.slice(window.location.href.indexOf('?') + 1).split('&');
        for (var i = 0; i < url.length; i++) {
            var urlparam = url[i].split('=');
            if (urlparam[0] == param) {
                return urlparam[1];
            }
        }
    }

    this.renderItems = function (items) {
        console.log("renderItems", this);

        $(".products").html("");
        $(".products-list").html("");

        var count = 0;
        for (var i = 0; i < items.SubCategories.length; i++) {
            const itemList = items.SubCategories[i].Items;
            for (var j = 0; j < itemList.length; j++) {
                this.renderItem(itemList[j], count++)
            }
        }
    }

    this.renderItem = function (item, count) {
        var template = $($("#product-item-template").html());
        template.find(".wrapper-image").attr("src", app.utils.getBrandImageUrl(item));

        // var classes = ['first', 'second', 'third']
        // for (let index = 0; index < section.Sales.length; index++) {
        //     const data = section.Sales[index];
        //     const className = classes[index % 3];
        //     const el = $(template).addClass(className);
        //     el.find(".shopping-title").text(data.Name);
        //     el.find(".description-top").text(data.Desc);
        //     el.find(".img-inner").attr("src", app.utils.getImageUrl(data));
        //     el.find("a").attr("href", "item.html?id=" + data.ID);
        //     if (!data.Desc) {
        //         el.find(".description-top").remove();
        //     }
        //     html.append(el);

        // }
        if (count < 3) {
            template.removeClass("col-4");
            template.addClass("col-3");
            $(".products").append(template);
        } else
            $(".products-list").append(template);
        // $(".main").append(html);

    }

    this.loadSidebar = function (saleId) {
        const url = "https://ozsale.herokuapp.com/api/saleItem/" + this.saleId + "/categories"
        $.ajax({
            url: url
        }).done(this.renderSidebarList);
    }

    this.loadItems = function () {
        const me = this;
        const url = "https://ozsale.herokuapp.com/api/saleItem/" + this.saleId;
        $.ajax({
            url: url
        }).done(this.renderItems.bind(me));
    }
    this.init = function () {
        this.saleId = this.GetParameterValues("id");
        // console.log("saleid", this.saleId);
        this.loadSidebar();
        this.loadItems();
    }
}).apply(app.item)