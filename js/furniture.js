
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
		console.log("furniture clicked");
		//window.game.handle_click(event, this);
	}
}
