'strict'

var app = app || {};
app.item = {};

(function () {

    this.onCategoryMenuClick = function (ev) {
        $(".sidebar-category .selected").removeClass("selected");
        ev.addClass("selected");

        ul = ev.closest("ul");

        if (ul.hasClass("category-level-1") || ul.hasClass("category-level-2")) {
            $(".sidebar-category .open").removeClass("open");
            ul.addClass("open");
            ev.next().addClass("open");
        }
        ul.closest("div").addClass("has-filter");
        //console.log("menuclick", ev.data());
        this.saleId = ev.data().id;
        this.key = ev.data().key;
        this.ipage = 0;
        this.loadItems();
        return false;
    }
    this.renderSidebarCategory = function (items) {
        $(".sidebar-category ul").remove();
        const ul1 = $("<ul class='category-level-1'></ul>");
        $(".sidebar-category").append(ul1);
        var selectedClass = "";

        for (var i = 1; i < items.length; i++) {

            const item = items[i];
            const catId = item.id || "";
            if (this.saleId == catId) {
                ul1.addClass("open");
                selectedClass = "selected";
            }

            const li1 = $("<li></li>");
            const a1 = $("<a></a>").attr("href", "item.html#").text(item.name).addClass("link-small-hover " + selectedClass);
            a1.data(item);
            a1.click(this.onCategoryMenuClick.bind(this, a1));
            li1.append(a1);

            const ul2 = $("<ul class='category-level-2'></ul>");
            li1.append(ul2);

            item.children = item.children || [];
            for (var j = 0; j < item.children.length; j++) {
                let child = item.children[j];
                const li2 = $("<li></li>");
                ul2.append(li2);
                const ul3 = $("<ul class='category-level-3 '></ul>");

                selectedClass = "";
                if (this.saleId == child.id) {
                    ul2.addClass("open");
                    ul3.addClass("open");
                    selectedClass = "selected";
                }
                const a2 = $("<a></a>").attr("href", "item.html#").addClass("link-small-hover " + selectedClass).text(child.name);
                a2.data(child);
                a2.click(this.onCategoryMenuClick.bind(this, a2));
                li2.append(a2);
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
                    const a3 = $("<a></a>").attr("href", "item.html#").addClass("link-small-hover " + selectedClass).text(grandchild.name);
                    a3.data(grandchild);
                    a3.click(this.onCategoryMenuClick.bind(this, a3));
                    li3.append(a3);
                }
            }
            ul1.append(li1);
        }
        $(".sidebar-category").addClass("has-filter");
    }
    this.onSidebarSortClick = function (item) {
        if (this.sort != item.key) {
            this.ipage = 0;
        }
        $(".sidebar-sort ul li").removeClass("selected");
        $("#" + item.key).addClass("selected");
        this.sort = item.key;
        $(".sidebar-sort").addClass("has-filter");
        this.loadItems();

    }

    this.renderSidebarSort = function (items) {
        $(".sidebar-sort ul li").remove();
        for (var i = 0; i < items.length; i++) {
            const li = $('<li id="' + items[i].key + '"><a href = "#" class = "link-small-hover">' + items[i].title + '</a></li>');
            $(".sidebar-sort ul").append(li);
            li.click(this.onSidebarSortClick.bind(this, items[i]));
        }

    }

    this.loadSidebar = function (items) {
        if (this.siderbarLoaded) return;
        this.renderSidebarBrand(items[0].values); //name: "skus.brandName"
        this.renderSiderbarSize(items[1].values); //name: "skus.attributes.size"
        this.renderSidebarColor(items[3].values); //name: "color"
        this.siderbarLoaded = true;
    }

    this.onSidebarBrandClick = function (el) {
        const me = this;
        //console.log("brandclick", el, el.data());
        this.ipage = 0;
        this.filters["skus.brandName"] = [];

        el.toggleClass("selected");
        const selectedELs = $(".sidebar-brand ul li.selected");
        selectedELs.each(function (index, el) {
            me.filters["skus.brandName"].push($(el).data().value)
        })
        if (selectedELs.length > 0)
            el.closest("div").addClass("has-filter");
        else
            el.closest("div").removeClass("has-filter");

        this.loadItems();
    }

    this.renderSidebarBrand = function (items) {
        $(".sidebar-brand ul li").remove();
        const me = this;
        for (var i = 0; i < items.length; i++) {
            const li = $('<li> <a href = "#" class = "link-small-hover" > ' + items[i].value + ' </a></li> ');
            $(".sidebar-brand ul").append(li);
            li.data(items[i]);
            li.click(this.onSidebarBrandClick.bind(me, li));
        }
    }

    this.onSidebarSizeClick = function (el) {
        const me = this;
        el.toggleClass("selected");
        this.filters["skus.attributes.size"] = [];
        this.ipage = 0;
        const selectedELs = $(".sidebar-size ul li.selected");

        selectedELs.each(function (index, el1) {
            me.filters["skus.attributes.size"].push($(el1).data().value)
        })
        if (selectedELs.length > 0)
            el.closest("div").addClass("has-filter");
        else
            el.closest("div").removeClass("has-filter");

        this.loadItems();
    }
    this.renderSiderbarSize = function (items) {

        $(".sidebar-size ul li").remove();
        const me = this;
        for (var i = 0; i < items.length; i++) {
            const li = $('<li><a href = "#" class = "link-small-hover">' + items[i].value + '</a></li>');
            $(".sidebar-size ul").append(li);
            li.data(items[i]);
            li.click(this.onSidebarSizeClick.bind(me, li));
        }
    }


    this.onSidebarColorClick = function (el) {
        const me = this;
        this.ipage = 0;
        el.toggleClass("selected");
        this.filters["color"] = []
        const selectedELs = $(".sidebar-color ul li.selected");
        selectedELs.each(function (index, el1) {
            me.filters["color"].push($(el1).data().value)
        })
        if (selectedELs.length > 0)
            el.closest("div").addClass("has-filter");
        else
            el.closest("div").removeClass("has-filter");

        this.loadItems();
    }
    this.renderSidebarColor = function (items) {
        $(".sidebar-color ul li").remove();
        me = this;
        for (var i = 0; i < items.length; i++) {
            const li = $('<li><a href = "#" class = "link-small-hover">' + items[i].value + '</a></li>');
            $(".sidebar-color ul").append(li);
            li.data(items[i]);
            li.click(this.onSidebarColorClick.bind(me, li));
        }
    }
    this.onSidebarPriceChange = function (data) {
        this.ipage = 0;
        this.filters["skus.attributesForFaceting.aud"] = [data.from + " to " + data.to];
        this.loadItems();
    }



    this.renderItems = function (items) {
        // console.log(items);
        if (!items || items.length == 0)
            return;

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



    this.loadSidebarCategory = function () {
        const url = "https://ozsale.herokuapp.com/api/shop/menu"; // + "/categories"
        $.ajax({
            url: url
        }).done(this.renderSidebarCategory.bind(app.item));

    }
    this.loadSidebarSort = function () {
        const url = "https://ozsale.herokuapp.com/api/shop/sorting";
        $.ajax({
            url: url
        }).done(this.renderSidebarSort.bind(app.item));
    }

    this.loadItems = function () {
        const me = this;
        const category = [];
        var url = 'https://ozsale.herokuapp.com/api/saleItems?category=';

        if (this.key)
            category.push(encodeURIComponent(this.key));

        url += JSON.stringify(category);

        url += '&page=' + this.ipage + '&pageSize=10';
        if (this.sort) {
            url += '&sort=' + this.sort;
        }
        url += "&filters=" + encodeURIComponent(JSON.stringify(this.filters));

        console.log("url", url)
        $.ajax({
            url: url
        }).done(this.renderItems.bind(me));
    }

    this.clearFilter = function () {
        const div = $(this).closest("div");
        console.log("div", div.data())
        const ul = div.find("ul");

        div.find(".selected").removeClass("selected");

        const me = app.item;
        me.ipage = 0;

        const filter = div.data().reset;
        if (filter == "sort")
            this.sort = null;
        else if (filter == "category") {
            div.find(".open").removeClass("open");
            div.find(".category-level-1").addClass("open");
            me.key = null;

        } else
            me.filters[filter] = [];

        div.removeClass("has-filter");


        me.loadItems();

    }
    this.init = function () {
        this.saleId = app.utils.getParameterValues("id");
        this.key = app.utils.getParameterValues("key");
        this.ipage = 0;
        this.filters = {};

        this.loadSidebarCategory();
        this.loadSidebarSort();
        this.loadItems();

        me = this;
        $("#price_rangeSlider").ionRangeSlider({
            type: "double",
            grid: true,
            min: 0,
            max: 100,
            from1: 1,
            to1: 8,
            prefix: "$",
            onFinish: function (data) {
                me.onSidebarPriceChange(data);
            }
        });
        this.onScroll();

        $(".fa-times").click(this.clearFilter);
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