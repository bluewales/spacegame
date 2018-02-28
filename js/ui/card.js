class Card extends createjs.Container {
  constructor() {
    super();

    this.x = game.width/2;
    this.y = game.height/2;

    this.height = 100;
    this.width = 100;

    this.box = new createjs.Shape();
    this.box.graphics.beginFill(menu_palette[0]).drawRect(-this.width/2, -this.height/2, this.width, this.height).endFill();

    this.addChild(this.box);
  }

  set_level(new_level) {
    this.level = new_level;
    this.text.text = "Level " + this.level;
  }

  tick(width, height) {
    this.box.x = width/2;
    this.box.y = 0;
  }
}
