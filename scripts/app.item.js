'strict'

var app = app || {};
app.item = {};

(function () {
    this.renderSidebarList = function (items) {
        $(".side-bar").html("");
        console.log(items);
        for (var i = 0; i < items.Categories.length; i++) {
            console.log(items.Categories[i])
            const item = items.Categories[i];
            const ulLevel1 = $("<ul class='category-level-1'/>");
            const li1 = $('<li><a href="#" class="link-small-hover text-dark">' + item.Name + '</a></li>');
            const ulLevel2 = $("<ul class='category-level-2'/>");

            for (var j = 0; j < item.SubCategories.length; j++) {
                const li2 = $('<li><a href="#" class="link-small-hover">' + item.SubCategories[j].Name + '</a></li>')
                ulLevel2.append(li2);
            }
            li1.append(ulLevel2);
            ulLevel1.append(li1);
            $(".side-bar").append(ulLevel1)
        }
    }

    this.loadSidebar = function () {
        const url = "https://ozsale.herokuapp.com/api/saleItem/da9b7801-8482-4b9f-b520-de0126325012/categories"
        $.ajax({
            url: url
        }).done(this.renderSidebarList);
    }
    this.init = function () {
        this.loadSidebar();
    }
}).apply(app.item)