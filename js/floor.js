class Floor extends Structure {
 constructor(ship, raw) {
		super(raw);

		this.ship = ship;
		this.sprite_key = raw.sprite;

		this.permiable = this.sprite_key == ".";

		this.x = this.ship.position_transform(this.pos.x);
		this.y = this.ship.position_transform(this.pos.y);

		var grid = this.ship.grid_width+this.ship.padding*2;
		var skirt = new createjs.Shape();
		skirt.graphics.beginFill('#2A2630')
			.drawRect(-this.ship.padding, -this.ship.padding, grid, grid);
		this.addChild(skirt);
		this.addChild(new createjs.Sprite(ship.sprites[raw.sprite].sprite, this.sprite_key));

		this.name = "floor";
		if(this.sprite_key=="h") this.name = "hatch";

		// handle click/tap
		this.on('click', this.handle_click.bind(this));
	}
  get passable() {
    return this.progress < 100 || this.sprite_key != "X";
  }
	get traverse_weight() {
		return this.progress < 100 ? 1 : (this.passable ? 2 : 0);
	}
	handle_click(event) {
		//window.game.handle_click(event, this);
	}
  get_menu_item() {
    return {"name":this.name, "list":[{"name":"deconstruct", "handle":this.deconstruct.bind(this)}]}
  }
  deconstruct() {
    console.log("deconstruct " + this.name + " " + this.pos.x + ","+this.pos.y + "," + this.pos.z);
    this.ship.remove_floor(this.pos);
  }
}
