class Steel extends Item {
  constructor() {
    super();
  }
  init(raw, objects) {
    super.init(raw, objects);

    this.sprite_key = "steel_sprite";

    this.addChild(new createjs.Sprite(game.sprites[this.sprite_key].sprite, this.sprite_key));
  }
  start(raw, objects) {
    super.start(raw, objects);
  }
}
