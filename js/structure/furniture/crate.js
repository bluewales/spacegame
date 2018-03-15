class Crate extends Furniture {

  constructor() {
    super();
  }
  init(objects, raw) {
    super.init(objects, raw);

    this.sprite = "crate";

		this.addChild(new createjs.Sprite(game.sprites[this.sprite].sprite, this.sprite));
  }
  start(raw, objects) {
    super.start(raw, objects);
  }

  static generate_raw(pos) {
    return {
      "type": "Crate",
      "pos": pos,
      "progress": 0
    };
  }
}
