/**
 * Created by Ox The Automaton on 7/3/2017.
 */

var menus = {
    create : function(items, parent, x, y) {
        menu = {};
        menu.items = items;
        menu.parent = parent;

        menu.ul = parent
            .append("ul")
            .style("left", x + "px")
            .style("top", y + "px");


        menu.ul.selectAll("li")
            .data(items)
            .enter().append("li")
            .text(function(d,i) {
                return d.name;
            })
            .on("click", function(d, i) {

                parent.selectAll("ul").selectAll("li").selectAll("ul").remove();

                if(d.list) {
                    var w = d3.select(this).node().getBoundingClientRect().width;
                    var h = d3.select(this).node().getBoundingClientRect().height;

                    menus.create(d.list, d3.select(this), w, i * h);
                    d3.event.stopPropagation();
                } else {
                    if(d.handle) {
                        d.handle(x, y);
                    }
                    clear_highlight()
                }
            })
            .classed("info", function(d) { return !(d.handle || d.list); })
            .append("span")
            .classed("triangle", function(d){return d.list});

        return menu;
    },
    destroy: function(menu) {
        menu.ul.remove();
    }
}
