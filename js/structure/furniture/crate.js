class Crate extends Furniture {

  constructor(ship, raw) {
    super(ship, raw);

    this.sprite = "crate";

		this.addChild(new createjs.Sprite(ship.sprites[this.sprite].sprite, this.sprite));
  }

  static generate_raw(pos) {
    return {
      "type": "Crate",
      "pos": pos,
      "progress": 0
    };
  }
}
