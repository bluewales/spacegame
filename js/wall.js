class Wall extends createjs.Container {

	constructor(ship, raw) {
		super();

		this.ship = ship;
		this.raw = raw;

		this.passable = false;
		this.traverse_weight = this.passable ? 2 : 0;

		var g = this.ship.grid_width;
		var p = this.ship.padding;
		var points = [];
		if(raw.direction == "-") {
			points = [[0, g],[g, g],[g+p, g+p],[g, g+p*2],[0, g+p*2],[-p, g+p]];
		} else if(raw.direction == "|") {
			points = [[g+p*2, 0],[g+p*2, g],[g+p, g+p],[g, g],[g, 0],[g+p, -p]];
		}

		var skirt = new createjs.Shape();
		skirt.graphics.beginFill('#D3D3D3').moveTo(points[0][0], points[0][1]);
		for(var i = 1; i < points.length; i++) {
			skirt.graphics.lineTo(points[i][0], points[i][1]);
		}
		this.addChild(skirt);

		this.pos = raw.location;

		this.x = this.ship.position_transform(this.pos.x);
		this.y = this.ship.position_transform(this.pos.y);

		this.name = "wall";

		// handle click/tap
		this.on('click', this.handle_click.bind(this));
	}
	handle_click(event) {
		console.log("wall clicked");
		//window.game.handle_click(event, this);
	}
}
