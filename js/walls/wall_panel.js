"use strict";

class WallPanel extends createjs.Container {

  constructor(ship, raw) {
    super(raw);

    this.ship = ship;
    this.ori = raw.orientation;
		this.type = raw.type;

    var g = this.ship.grid_width;
    var p = this.ship.padding;

    this.drawing = new createjs.Container();
    if(this.ori == "-") {
      this.drawing.addChild(create_polygon(ship_palette[1], [[0,g],[g,g],[g+p,g+p],[g,g+p*2],[0,g+p*2],[-p,g+p]]));
    } else if(this.ori == "|") {
      this.drawing.addChild(create_polygon(ship_palette[1], [[g+p*2,0],[g+p*2,g],[g+p,g+p],[g,g],[g,0],[g+p,-p]]));
    }

    this.addChild(this.drawing);

    this.name = "wall";
  }
  get passable() {
    return this.progress < 100;
  }
  get traverse_weight() {
    return this.progress < 100 ? 1 : (this.passable ? 2 : 0);
  }
}
