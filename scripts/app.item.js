'strict'

var app = app || {};
app.item = {};

(function () {

    this.renderSidebar_Category = function (items) {
        $(".sidebar-category ul").remove();
        const ul1 = $("<ul class='category-level-1'></ul>");
        $(".sidebar-category").append(ul1);

        for (var i = 1; i < items.length; i++) {

            const item = items[i];
            const catId = item.id || "";
            const li1 = $("<li></li>");
            const a1 = $("<a></a>").attr("href", "index.html#").text(item.name).addClass("link-small-hover");
            li1.append(a1);

            const ul2 = $("<ul class='category-level-2'></ul>");
            li1.append(ul2);

            item.children = item.children || [];
            for (var j = 0; j < item.children.length; j++) {
                let child = item.children[j];
                const li2 = $("<li></li>");
                ul2.append(li2);

                var selectedClass = "";
                if (this.saleId == child.id) {
                    ul2.addClass("open");
                    selectedClass = "selected";
                }
                const a2 = $("<a></a>").attr("href", "index.html#").addClass("link-small-hover " + selectedClass).text(child.name);
                li2.append(a2);

                const ul3 = $("<ul class='category-level-3'></ul>");
                li2.append(ul3);

                child.children = child.children || [];
                for (var k = 0; k < child.children.length; k++) {
                    let grandchild = child.children[k];
                    const li3 = $("<li></li>");
                    ul3.append(li3);

                    selectedClass = "";
                    if (this.saleId == grandchild.id) {
                        selectedClass = "selected";
                        ul2.addClass("open");
                        ul3.addClass("open");

                    }
                    const a3 = $("<a></a>").attr("href", "index.html#").addClass("link-small-hover " + selectedClass).text(grandchild.name);
                    li3.append(a3);
                }
            }
            ul1.append(li1);
        }

    }
    this.onSidebarSortClick = function (item) {
        // console.log("dau heo", this, item)
        if (this.sort != item.key) {
            this.ipage = 0;
        }
        $(".sidebar-sort ul li").removeClass("selected");
        $("#" + item.key).addClass("selected");
        this.sort = item.key;
        this.loadItems();

    }

    this.renderSidebar_Sort = function (items) {
        console.log("sidebar:", items)
        $(".sidebar-sort ul li").remove();
        for (var i = 0; i < items.length; i++) {
            const li = $('<li id="' + items[i].key + '"><a href = "#" class = "link-small-hover">' + items[i].title + '</a></li>');
            $(".sidebar-sort ul").append(li);
            li.click(this.onSidebarSortClick.bind(this, items[i]));
        }

    }
    this.loadSidebar = function (items) {

        this.renderSidebar_Brand(items[0].values); //name: "skus.brandName"
        this.renderSiderbar_Size(items[1].values); //name: "skus.attributes.size"
        this.renderSidebar_Color(items[3].values); //name: "color"
    }

    this.renderSidebar_Brand = function (items) {
        $(".sidebar-brand ul li").remove();
        for (var i = 0; i < items.length; i++) {
            const li = $('<li><a href = "#" class = "link-small-hover">' + items[i].value + '</a></li>');
            $(".sidebar-brand ul").append(li);
        }
    }

    this.renderSiderbar_Size = function (items) {
        $(".sidebar-size ul li").remove();
        for (var i = 0; i < items.length; i++) {
            const li = $('<li><a href = "#" class = "link-small-hover">' + items[i].value + '</a></li>');
            $(".sidebar-size ul").append(li);
        }
    }
    this.renderSidebar_Currency = function (items) {
        //   2: {
        //       name: "skus.attributesForFaceting.aud",
        //       values: Array(500)
        //   }
    }
    this.renderSidebar_Color = function (items) {
        $(".sidebar-color ul li").remove();
        for (var i = 0; i < items.length; i++) {
            const li = $('<li><a href = "#" class = "link-small-hover">' + items[i].value + '</a></li>');
            $(".sidebar-color ul").append(li);
        }
    }
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
            const ulLevel1 = $("<ul class='category-level-1 sidebar-item'/>");
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
            // $(".category-level-3").hide();

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
        console.log(items);
        if (this.ipage == 0) {
            $(".products").html("");
            $(".products-list").html("");
        }
        var count = 0;
        for (var i = 0; i < items.products.length; i++) {
            const item = items.products[i];
            this.renderItem(item, item.id, item.taxonomyTree, count++)
        }

        this.loadSidebar(items.facets);
    }

    this.renderItem = function (item, catID, taxonomyTree, count) {
        //  console.log(item);
        parentCatID = taxonomyTree[1];
        grandParentCatID = taxonomyTree[0];
        var template = $($("#product-item-template").html());
        template.data("category", catID);
        template.data("parentCategory", parentCatID);
        template.data("grandParentCategory", grandParentCatID);
        template.attr("id", "item_" + count)
        template.find(".wrapper-image").attr("src", item.images[0]);
        // if (item.Sizes && item.Sizes.length > 0) {
        //     let sizes = "";
        //     template.find(".btn-size").remove();
        //     for (var is = 0; is < item.Sizes.length; is++) {
        //         sizes += item.Sizes[is].Name + ";"
        //         template.find(".size-container").append('<button class = "buttons btn-size" >' + item.Sizes[is].Name + '</button>');
        //     }
        //     template.data("sizes", sizes)

        // } else
        //     template.find(".size-container").remove();

        // if (!item.Available) {
        //     template.find(".sold-out").showhide();
        //     template.find(".quantity-container").remove();
        // }
        template.find(".product-type").text(item.brandName);
        template.find(".brand-detail").text(item.name);
        template.find(".real-price").text(app.utils.currencyFormat(item.originalPrice.value));
        template.find(".reduced-price").text(app.utils.currencyFormat(item.price.value));

        //  template.find(".view-product").attr("href", "product.html?id=" + item.ID + '&saleID=' + this.saleId);

        if (count < 3) {
            template.removeClass("col-4");
            template.addClass("col-3");
            $(".products").append(template);
        } else
            $(".products-list").append(template);

    }

    this.onBreakcrumClick = function () {
        $(".product-item-wrapper").show();
        //   console.log(this.data())
        if ($("#category-li[data-ref]") == $(".side-bar a[data-category]")) {
            console.log("testt");
        }

    }

    this.loadSidebar_Category = function () {
        const url = "https://ozsale.herokuapp.com/api/shop/menu"; // + "/categories"
        $.ajax({
            url: url
        }).done(this.renderSidebar_Category.bind(app.item));

    }
    this.loadSidebar_Sort = function () {
        const url = "https://ozsale.herokuapp.com/api/shop/sorting";
        $.ajax({
            url: url
        }).done(this.renderSidebar_Sort.bind(app.item));
    }

    this.loadItems = function () {
        const me = this;
        var url = 'https://ozsale.herokuapp.com/api/saleItems?category=["' + this.key + '"]&page=' + this.ipage + '&pageSize=10';
        if (this.sort) {
            url += '&sort=' + this.sort;
        }
        $.ajax({
            url: url
        }).done(this.renderItems.bind(me));
    }
    this.init = function () {
        this.saleId = app.utils.getParameterValues("id");
        this.key = app.utils.getParameterValues("key");
        this.ipage = 0;

        this.loadSidebar_Category();
        this.loadSidebar_Sort();
        this.loadItems();


        // $("#current-sale-item").click(this.onBreakcrumClick);

        $("#price_rangeSlider").ionRangeSlider({
            type: "double",
            grid: true,
            min: 0,
            max: 100,
            from: 1,
            to: 8,
            prefix: "$"
        });
        this.onScroll();
    }

    this.onScroll = function () {
        me = this;
        $(window).scroll($.debounce(250, false, function () {

            if ($("#loadMore").visible()) {
                me.ipage++;
                me.loadItems();
            }

        }));

    }

}).apply(app.item)