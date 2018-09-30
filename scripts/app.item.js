'strict'

var app = app || {};
app.item = {};

(function () {
    this.renderSidebarList = function (items) {
        $("#current-sale-item").text(items.Name); //render breakcrum

        $(".side-bar").html("");
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
            const li1 = $('<li><a  data-category="' + item.ID + '" href="#" class="link-small-hover text-dark">' + item.Name + '</a></li>');
            const ulLevel2 = $("<ul class='category-level-2'/>");

            for (var j = 0; j < item.SubCategories.length; j++) {
                const item2 = item.SubCategories[j];
                const li2 = $('<li><a data-category="' + item2.ID + '" href="#" class="link-small-hover">' + item2.Name + '</a></li>');
                if (item2.Sizes) {
                    const ulLevel3 = $("<ul class='category-level-3'/>");

                    for (var k = 0; k < item2.Sizes.length; k++) {
                        const item3 = item2.Sizes[k];
                        const li3 = $('<li><a  data-category="' + item3.Name + '" href="#" class="link-small-hover">' + item3.Name + '</a></li>');
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
        const me = this;
        setTimeout(function () {
            $(".side-bar a").click(me.onSidebarClick);

        }, 100)


    }

    this.onSidebarClick = function () {
        $(".cat-li").remove();

        const links = [];
        const el = $(this);
        var li = el.closest("li");
        var ul = li.parent();
        var parentId = "";
        if ($(li).parent().hasClass("category-level-3")) {
            var aLevel2 = ul.prev();
            parentId = aLevel2.data().category;

            var aLevel1 = aLevel2.closest("li").parent().prev();
            links.push({
                text: aLevel1.text(), //level1,
                id: aLevel1.data().category,
            });
            links.push({
                text: aLevel2.text(), //level2,
                id: aLevel2.data().category,
            });
            links.push({
                text: el.text() //level3
            })

        }

        if ($(li).parent().hasClass("category-level-2")) {
            var aLevel1 = ul.prev();
            links.push({
                text: aLevel1.text(), //level1
                id: aLevel1.data().category,

            });
            links.push({
                text: el.text(), //level2
                id: el.data().category,

            });
            $(".category-level-3").hide();

            li.find("ul").show();
        }

        if ($(li).parent().hasClass("category-level-1")) {
            links.push({
                text: el.text(),
                id: el.data().category,

            })
        }
        for (const link of links) {
            var liElement = $('<li id="category-li" class="cat-li" data-ref="' + link.id + '">' + link.text + "</li>")
            liElement.click(function () {
                console.log($(this).data(), link)
            })
            $(".page-breakcrum").append(liElement)
        }

        var saleItems = $(".product-item-wrapper");
        console.log("parentId", parentId)
        saleItems.each(function (index, saleItem) {
            const menuCategory = el.data().category;

            const itemData = $(saleItem).data();

            if ($(saleItem).data()["category"] == menuCategory ||
                $(saleItem).data()["parentCategory"] == menuCategory ||
                $(saleItem).data()["grandParentCategory"] == menuCategory ||
                (itemData.sizes && itemData.sizes.indexOf(menuCategory) >= 0 && itemData.parentCategory == parentId))
                $(saleItem).show();
            else
                $(saleItem).hide();

        })
    }

    this.renderItems = function (items) {
        $(".products").html("");
        $(".products-list").html("");

        var count = 0;
        for (var i = 0; i < items.SubCategories.length; i++) {
            const itemList = items.SubCategories[i].Items;
            for (var j = 0; j < itemList.length; j++) {
                this.renderItem(itemList[j], itemList[j].ID, items.SubCategories[i].ID, items.ID, count++)
            }
        }
    }

    this.renderItem = function (item, catID, parentCatID, grandParentCatID, count) {
        var template = $($("#product-item-template").html());
        template.data("category", catID);
        template.data("parentCategory", parentCatID);
        template.data("grandParentCategory", grandParentCatID);
        template.attr("id", "item_" + count)
        template.find(".wrapper-image").attr("src", app.utils.getBrandImageUrl(item));
        if (item.Sizes && item.Sizes.length > 0) {
            let sizes = "";
            template.find(".btn-size").remove();
            for (var is = 0; is < item.Sizes.length; is++) {
                sizes += item.Sizes[is].Name + ";"
                template.find(".size-container").append('<button class = "buttons btn-size" >' + item.Sizes[is].Name + '</button>');
            }
            template.data("sizes", sizes)

        } else
            template.find(".size-container").remove();

        if (!item.Available) {
            template.find(".sold-out").showhide();
            template.find(".quantity-container").remove();
        }
        template.find(".product-type").text(item.BrandName);
        template.find(".brand-detail").text(item.Name);
        template.find(".real-price").text('$' + item.RP + '.00');
        template.find(".reduced-price").text('$' + item.Price + '.00');

        template.find(".view-product").attr("href", "product.html?id=" + item.ID + '&saleID=' + this.saleId);

        if (count < 3) {
            template.removeClass("col-4");
            template.addClass("col-3");
            $(".products").append(template);
        } else
            $(".products-list").append(template);

    }

    this.onBreakcrumClick = function () {
        $(".product-item-wrapper").show();
        console.log(this.data())
        if ($("#category-li[data-ref]") == $(".side-bar a[data-category]")) {
            console.log("testt");
        }

    }

    this.loadSidebar = function () {
        const url = "https://ozsale.herokuapp.com/api/saleItem/" + this.saleId + "/categories"
        $.ajax({
            url: url
        }).done(this.renderSidebarList.bind(app.item));
    }

    this.loadItems = function () {
        const me = this;
        const url = "https://ozsale.herokuapp.com/api/saleItem/" + this.saleId;
        $.ajax({
            url: url
        }).done(this.renderItems.bind(me));
    }
    this.init = function () {
        this.saleId = app.utils.getParameterValues("id");
        this.loadSidebar();
        this.loadItems();
        $("#current-sale-item").click(this.onBreakcrumClick);
    }
}).apply(app.item)