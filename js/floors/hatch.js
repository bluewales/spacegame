function get_hatch_art(open) {
  if(!window.singletons) window.singletons = {};
  if(!window.singletons.hatch_art) window.singletons.hatch_art = {};
  if(!window.singletons.hatch_art[open]) {

    var g = window.game.ship.grid_width;
    var p = window.game.ship.padding;
    var o = open;

    var drawing = new createjs.Container();

    var shape = new createjs.Shape();
    shape.graphics.beginFill("#D3D3D3").drawCircle(g/2, g/2, g/2, g/2);
    drawing.addChild(shape);

    var petals = 13;
    var R = g/2 - p;
    var r = (R-p*2) * (open);
    var c = g/2;

    var centers = [];

    for(var i = 0; i < petals; i++) {
      var theta = 2*Math.PI * (i) / petals;
      var theta2 = 2*Math.PI * (i+1) / petals;
      var phi1 = theta - Math.acos(r/R);
      var phi2 = theta2 - Math.acos(r/R);
      var phi = (phi1+phi2)/2;
      var cr = r/Math.cos(Math.abs(phi2-phi1)/2);

      var p1 = [c+R*Math.sin(theta),c+R*Math.cos(theta)];
      var p2 = [c+R*Math.sin(theta2),c+R*Math.cos(theta2)];
      var p3 = [c+cr*Math.sin(phi),c+cr*Math.cos(phi)];
      drawing.addChild(create_polygon("#605DEF", [p1,p2,p3]));

      centers.push(p3);
    }
    drawing.addChild(create_polygon("black", centers));

    window.singletons.hatch_art[open] = drawing;
  }

  return window.singletons.hatch_art[open];
}

class Hatch extends createjs.Container {

  constructor(ship, raw) {
    super(raw);

    this.ship = ship;
		this.type = raw.type;
    this.sprite_key = "h";
    this.pos = raw.location;

    var grid = this.ship.grid_width+this.ship.padding*2;
		this.skirt = new createjs.Shape();
		this.skirt.graphics.beginFill('#2A2630')
			.drawRect(-this.ship.padding, -this.ship.padding, grid, grid);
		this.addChild(this.skirt);
		//this.addChild(new createjs.Sprite(this.ship.sprites[this.sprite_key].sprite, this.sprite_key));

    this.open = 0;

    this.drawing = new createjs.Container();
    this.addChild(this.drawing);
    this.name = "hatch";
  }
  get passable() {
    return true;
  }
  get traverse_weight() {
    return this.progress < 100 ? 1 : (this.passable ? 1 : 0);
  }
  tick(event) {
    var other_pos = {"x":this.pos.x,"y":this.pos.y, "z":this.pos.z-1};

    if(get_3d(window.game.ship.crew, this.pos) || get_3d(window.game.ship.crew, other_pos)) {
      this.open += 1/32;
      if(this.open > 1) this.open = 1;
    } else {
      this.open -= 1/32;
      if(this.open < 0) this.open = 0;
    }

    this.removeChild(this.drawing);
    this.drawing = get_hatch_art(this.open);
    this.addChild(this.drawing);
  }
}
