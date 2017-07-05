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
            .style("position", "absolute")
            .style("left", x + "px")
            .style("top", y + "px")

        console.log(x + "px")
        console.log(y + "px")

        console.log(items)

        menu.ul.selectAll("li")
            .data(items)
            .enter().append("li")
            .text(function(d,i) {
                return d.name;
            })

        return menu;
    },
    destroy: function(menu) {
        menu.ul.remove();
    }
}
