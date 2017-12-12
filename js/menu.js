"use strict";

/**
 * Created by Ox The Automaton on 7/3/2017.
 */

class Menu {
  constructor(items, parent, x, y) {

    this.items = items;
    this.parent = parent;
    this.position = {"x":x, "y":y};

    this.ul = parent
      .append("ul")
      .style("left", this.position.x + "px")
      .style("top", this.position.y + "px");


    this.lines = this.ul.selectAll("li")
        .data(items)
        .enter().append("li")
        .text(function(d,i) {
          return d.name;
        })
        .on("click", function(d, i) {

          parent.selectAll("ul").selectAll("li").selectAll("ul").remove();

          if(d.list) {
            var rect = d3.select(this).node().getBoundingClientRect();
            var w = rect.width;
            var h = rect.height;

            this.clild_menu = new Menu(d.list, d3.select(this), w, i*h);
            d3.event.stopPropagation();
          } else {
            if(d.handle) {
              d.handle(x, y);
              window.game.clear_highlight();
            }
          }
        })
        .classed("info", function(d) { return d.info; })
        .classed("header", function(d) {return d.header;})
        .classed("expandable", function(d) {return d.list;});

    this.ul.selectAll(".header")
      .call(d3.drag()
        .on("start", function(d) {
          console.log(d3.event.x + " " + d3.event.y);

          this.drag_start = {x:d3.event.x, y:d3.event.y};
        })
        .on("drag", function() {
          var parent = d3.select(this.parentNode);

          var old_left = 1*parent.style("left").replace("px","");
          var old_top = 1*parent.style("top").replace("px","");

          var new_left = d3.event.x + old_left - this.drag_start.x;
          var new_top = d3.event.y + old_top - this.drag_start.y;

          d3.select(this.parentNode)
            .style("left", new_left + "px")
            .style("top", new_top + "px");
        })
        .on("end", function(d) {}));
    this.ul.selectAll(".expandable")
      .append("span")
      .classed("triangle", function(d){return d.list});
  }
  destroy() {
    this.ul.remove();
  }
}
