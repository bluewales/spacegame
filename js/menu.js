/**
 * Created by Ox The Automaton on 7/3/2017.
 */


var menu_palette = 18;

var menus = {
    create : function(items, parent, x, y) {
        menu = {};
        menu.items = items;
        menu.parent = parent;
        menu.position = {"x":x, "y":y};

        menu.ul = parent
            .append("ul")
            .style("left", menu.position.x + "px")
            .style("top", menu.position.y + "px");


        menu.lines = menu.ul.selectAll("li")
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
                        clear_highlight();
                    }
                }
            })
            .classed("info", function(d) { return d.info; })
            .classed("header", function(d) {return d.header;})
            .classed("expandable", function(d) {return d.list;});

        menu.ul.selectAll(".header")
            .call(d3.drag()
                .on("start", function(d) {
                    console.log(d3.event.x + " " + d3.event.y);

                    this.drag_start = {x:d3.event.x, y:d3.event.y};
                })
                .on("drag", function() {
                    var old_left = 1*d3.select(this.parentNode).style("left").replace("px","");
                    var old_top = 1*d3.select(this.parentNode).style("top").replace("px","");

                    var new_left = d3.event.x + old_left - this.drag_start.x;
                    var new_top = d3.event.y + old_top - this.drag_start.y;

                    d3.select(this.parentNode)
                        .style("left", new_left + "px")
                        .style("top", new_top + "px");
                })
                .on("end", function(d) {}));
        /*
         .on("mousedown", function() {

         console.log("mousedown");

         menu.drag_start = {x:d3.event.pageX, y:d3.event.pageY};
         })
         .on(".drag", function() {

         console.log("mousemove");

         if(!menu.drag_start) return;

         menu.position.x += d3.event.pageX - menu.drag_start.x;
         menu.position.y += d3.event.pageY - menu.drag_start.y;

         menu.ul
         .style("left", menu.position.x + "px")
         .style("top", menu.position.y + "px");
         })
         .on("mouseup", function() {
         console.log("mouseup");
         menu.drag_start = null;
         })
         */
        menu.ul.selectAll(".expandable")
            .append("span")
            .classed("triangle", function(d){return d.list});

        return menu;
    },
    destroy: function(menu) {
        menu.ul.remove();
    }
}