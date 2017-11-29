
class Furniture extends createjs.Sprite {
	constructor(ship, sheet, raw) {
		super(sheet, raw.sprite);

		this.ship = ship;

		this.pos = raw.location;
    this.raw = raw;

		this.x = this.ship.position_transform(this.pos.x);
		this.y = this.ship.position_transform(this.pos.y);

		this.name = raw.sprite;

		// handle click
		this.on('click', this.handle_click.bind(this));
	}
	handle_click(event) {
		//window.game.handle_click(event, this);
	}
	get_menu_item() {
    return {"name":this.name, "list":[{"name":"deconstruct", "handle":this.deconstruct.bind(this)}]}
  }
	deconstruct() {
    console.log("deconstruct " + this.name + " " + this.pos.x + ","+this.pos.y + "," + this.pos.z);
		this.ship.remove_furniture(this.pos);
  }
}
