class Barrel extends Furniture {

  constructor(ship, raw) {
    super(ship, raw);

    this.sprite = "barrel";

		this.addChild(new createjs.Sprite(ship.sprites[this.sprite].sprite, this.sprite));
  }

  static generate_raw(pos) {
    return {
      "type": "Barrel",
      "pos": pos,
      "progress": 0
    };
  }
}
