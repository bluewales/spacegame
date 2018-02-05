class CardFrame extends createjs.Container {
  constructor(width, height) {
    super();

    this.width = width;
    this.height = height;

    this.border_width = 5;

    this.box = new createjs.Shape();
    this.box.graphics.beginFill(menu_palette[0]).drawRect(-this.border_width, -this.border_width, this.width+this.border_width*2, this.height+this.border_width*2).endFill();
    this.box.graphics.beginFill(menu_palette[1]).drawRect(0, 0, this.width, this.height).endFill();

    this.addChild(this.box);
  }
}
