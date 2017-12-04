class Wall extends Structure {

	constructor(ship, raw) {
		super(raw);

		this.ship = ship;

		this.ori = raw.orientation;

		this.x = this.ship.position_transform(this.pos.x);
		this.y = this.ship.position_transform(this.pos.y);

		var g = this.ship.grid_width;
		var p = this.ship.padding;
		var points = [];
		if(this.ori == "-") {
			points = [[0,g],[g,g],[g+p,g+p],[g,g+p*2],[0,g+p*2],[-p,g+p]];
		} else if(this.ori == "|") {
			points = [[g+p*2,0],[g+p*2,g],[g+p,g+p],[g,g],[g,0],[g+p,-p]];
		}

		var shape = new createjs.Shape();
		shape.graphics.beginFill('#D3D3D3').moveTo(points[0][0], points[0][1]);

		for(var i = 1; i < points.length; i++) {
			shape.graphics.lineTo(points[i][0], points[i][1]);
		}

		this.addChild(shape);

		this.name = "wall";
		this.on('click', this.handle_click.bind(this));
	}
	get passable() {
    return this.progress < 100;
  }
	get traverse_weight() {
		return this.progress < 100 ? 1 : (this.passable ? 2 : 0);
	}
	handle_click(event) {
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
