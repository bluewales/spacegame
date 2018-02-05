"use strict";

function get_door_art(ori, open) {
  if(!window.singletons) window.singletons = {};
  if(!window.singletons.door_art) window.singletons.door_art = {};
  if(!window.singletons.door_art[open]) {


    window.singletons.door_art[open] = {};

    var g = window.game.ship.grid_width;
    var p = window.game.ship.padding;
    var o = open;

    var v_drawing = new createjs.Container();
    v_drawing.addChild(create_polygon(ship_palette[1], [[g+p*2,0],[g+p,p],[g,0],[g+p,-p]]));
    v_drawing.addChild(create_polygon(ship_palette[2], [[g+p*2,0],[g+p*2,(1-o)*(g/2-p)],[g+p,(1-o)*(g/2-p)+p],[g,(1-o)*(g/2-p)],[g,0],[g+p,p]]));
    v_drawing.addChild(create_polygon(ship_palette[1], [[g+p*2,(1-o)*(g/2-p)],[g+p*2,(1-o)*(g/2-p)+p],[g,(1-o)*(g/2-p)+p],[g,(1-o)*(g/2-p)],[g+p,(1-o)*(g/2-p)+p]]));
    v_drawing.addChild(create_polygon(ship_palette[1], [[g+p*2,(1+o)*(g/2-p)+p],[g+p*2,(1+o)*(g/2-p)+2*p],[g+p,(1+o)*(g/2-p)+p],[g,(1+o)*(g/2-p)+2*p],[g,(1+o)*(g/2-p)+p]]));
    v_drawing.addChild(create_polygon(ship_palette[2], [[g+p*2,(1+o)*(g/2-p)+2*p],[g+p*2,g],[g+p,g-p],[g,g],[g,(1+o)*(g/2-p)+2*p],[g+p,(1+o)*(g/2-p)+p]]));
    v_drawing.addChild(create_polygon(ship_palette[1], [[g+p*2,g],[g+p,g-p],[g,g],[g+p,g+p]]));
    window.singletons.door_art[open]['|'] = v_drawing;

    var h_drawing = new createjs.Container();
    h_drawing.addChild(create_polygon(ship_palette[1], [[0,g+p*2],[p,g+p],[0,g],[-p,g+p]]));
    h_drawing.addChild(create_polygon(ship_palette[2], [[0,g+p*2],[(1-o)*(g/2-p),g+p*2],[(1-o)*(g/2-p)+p,g+p],[(1-o)*(g/2-p),g],[0,g],[p,g+p]]));
    h_drawing.addChild(create_polygon(ship_palette[1], [[(1-o)*(g/2-p),g+p*2],[(1-o)*(g/2-p)+p,g+p*2],[(1-o)*(g/2-p)+p,g],[(1-o)*(g/2-p),g],[(1-o)*(g/2-p)+p,g+p]]));
    h_drawing.addChild(create_polygon(ship_palette[1], [[(1+o)*(g/2-p)+p,g+p*2],[(1+o)*(g/2-p)+2*p,g+p*2],[(1+o)*(g/2-p)+p,g+p],[(1+o)*(g/2-p)+2*p,g],[(1+o)*(g/2-p)+p,g]]));
    h_drawing.addChild(create_polygon(ship_palette[2], [[(1+o)*(g/2-p)+2*p,g+p*2],[g,g+p*2],[g-p,g+p],[g,g],[(1+o)*(g/2-p)+2*p,g],[(1+o)*(g/2-p)+p,g+p]]));
    h_drawing.addChild(create_polygon(ship_palette[1], [[g,g+p*2],[g-p,g+p],[g,g],[g+p,g+p]]));
    window.singletons.door_art[open]['-'] = h_drawing;
  }

  return window.singletons.door_art[open][ori];
}


class Door extends createjs.Container {

  constructor(ship, raw) {
    super();

    this.ship = ship;

    this.ori = raw.orientation;
    this.pos = raw.location;

    var g = this.ship.grid_width;
    var p = this.ship.padding;

    this.drawing = new createjs.Container();
    this.addChild(this.drawing);

    this.open = 0;


    this.name = "door";
  }
  get passable() {
    return true;
  }
  get traverse_weight() {
    return this.progress < 100 ? 1 : (this.passable ? 1 : 0);
  }
  get_menu_item() {
    return {"name":this.name, "list":[{
      "name":"deconstruct",
      "list":[{"name":"deconstruct", "handle":this.deconstruct.bind(this)}]
    }]};
  }
  tick(event) {
    var other_pos = {"x":this.pos.x+(this.ori=="|"?1:0),"y":this.pos.y+(this.ori=="-"?1:0), "z":this.pos.z};
    if(get_3d(window.game.ship.crew, this.pos) || get_3d(window.game.ship.crew, other_pos)) {
      this.open += 1/25;
      if(this.open > 1) this.open = 1;
    } else {
      this.open -= 1/25;
      if(this.open < 0) this.open = 0;
    }

    this.removeChild(this.drawing);

    this.drawing = get_door_art(this.ori, this.open);
    this.addChild(this.drawing);
  }
}
