class FloorPlate extends Floor {

  constructor(ship, raw) {
    super(ship, raw);

    this.sprite_key = "X";

    var grid = this.ship.grid_width+this.ship.padding*2;
		this.skirt = new createjs.Shape();
		this.skirt.graphics.beginFill(ship_palette[0])
			.drawRect(-this.ship.padding, -this.ship.padding, grid, grid);
		this.addChild(this.skirt);
		this.addChild(new createjs.Sprite(this.ship.sprites[this.sprite_key].sprite, this.sprite_key));

    this.name = "floor";
  }
  get passable() {
    return this.progress < 100;
  }
  get traverse_weight() {
    return this.progress < 100 ? 1 : (this.passable ? 2 : 0);
  }

  static generate_raw(pos) {
    return {
  		"type": "FloorPlate",
  		"pos": pos,
  		"progress": 0
  	};
  }

}
