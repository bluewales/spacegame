class Barrel extends Furniture {

  constructor() {
    super();
  }
  init(raw, objects) {
    super.init(raw, objects);

    this.sprite = "barrel";

		this.addChild(new createjs.Sprite(game.sprites[this.sprite].sprite, this.sprite));
  }
  start(raw, objects) {
    super.start(raw, objects);
  }

  static generate_raw(pos) {
    return {
      "type": "Barrel",
      "pos": pos,
      "progress": 0
    };
  }

  static get materials() {
    return ["Steel"];
  }
}
