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
      this.drawing.addChild(create_polygon('#D3D3D3', [[0,g],[g,g],[g+p,g+p],[g,g+p*2],[0,g+p*2],[-p,g+p]]));
    } else if(this.ori == "|") {
      this.drawing.addChild(create_polygon('#D3D3D3', [[g+p*2,0],[g+p*2,g],[g+p,g+p],[g,g],[g,0],[g+p,-p]]));
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
  get_menu_item() {
    return {"name":this.name, "list":[{
      "name":"deconstruct",
      "list":[{"name":"deconstruct", "handle":this.deconstruct.bind(this)}]
    }]};
  }
  deconstruct() {
    console.log("deconstruct " + this.name + " " + this.pos.x + "," + this.pos.y + "," + this.pos.z);
    this.ship.remove_wall(this.pos, this.ori);
  }
}
