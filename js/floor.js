class Floor extends createjs.Container {

 constructor(ship, sheet, sprite_key, pos) {
		super();

		this.ship = ship;
		this.sprite_key = sprite_key;
		this.pos = pos;

		this.passable = sprite_key != "X";
		this.permiable = sprite_key == ".";
		this.traverse_weight = this.passable ? 2 : 0;

		this.x = this.ship.position_transform(this.pos.x);
		this.y = this.ship.position_transform(this.pos.y);

		var grid = this.ship.grid_width+this.ship.padding*2;
		var skirt = new createjs.Shape();
		skirt.graphics.beginFill('#2A2630')
			.drawRect(-this.ship.padding, -this.ship.padding, grid, grid);
		this.addChild(skirt);
		this.addChild(new createjs.Sprite(sheet, sprite_key));

		this.name = "floor";
		if(sprite_key=="h") this.name = "hatch";

		// handle click/tap
		this.on('click', this.handle_click.bind(this));
	}
	handle_click(event) {
		console.log("floor clicked");
		//window.game.handle_click(event, this);
	}
}
