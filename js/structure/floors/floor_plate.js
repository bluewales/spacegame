class FloorPlate extends Floor {

  constructor() {
    super();
  }
  init(raw, objects) {
    super.init(raw, objects);

    this.sprite_key = "floor_plate";

    var grid = this.ship.grid_width+this.ship.padding*2;
		this.skirt = new createjs.Shape();
		this.skirt.graphics.beginFill(ship_palette[0])
			.drawRect(-this.ship.padding, -this.ship.padding, grid, grid);
		this.addChild(this.skirt);
		this.addChild(new createjs.Sprite(game.sprites[this.sprite_key].sprite, this.sprite_key));

    this.name = "floor";
  }
  start(raw, objects) {
    super.start(raw, objects);
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
