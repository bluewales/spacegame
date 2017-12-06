class FloorPlate extends createjs.Container {

  constructor(ship, raw) {
    super(raw);

    this.ship = ship;
		this.type = raw.type;
    this.sprite_key = "X";

    var grid = this.ship.grid_width+this.ship.padding*2;
		this.skirt = new createjs.Shape();
		this.skirt.graphics.beginFill('#2A2630')
			.drawRect(-this.ship.padding, -this.ship.padding, grid, grid);
		this.addChild(this.skirt);
		this.addChild(new createjs.Sprite(this.ship.sprites[this.sprite_key].sprite, this.sprite_key));

    this.name = "wall";
  }
  get passable() {
    return this.progress < 100;
  }
  get traverse_weight() {
    return this.progress < 100 ? 1 : (this.passable ? 2 : 0);
  }
}