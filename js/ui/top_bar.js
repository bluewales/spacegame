class TopBar extends createjs.Container {
  constructor() {
    super();

    this.height = 40;
    this.width = 100;

    this.button_width = 100;
    this.button_height = this.height;

    this.box = new createjs.Shape();
    this.box.graphics.beginFill(menu_palette[0]).drawRect(0, 0, this.width, this.height).endFill();
    this.addChild(this.box);

    this.control_card = new Controls();

    this.buttons = new createjs.Container();
    this.buttons.addChild(new Button(this.button_width, this.button_height, "Controls", this.control_card));
    this.addChild(this.buttons);
  }

  tick(width, height) {
    this.width = width;

    this.box.graphics.clear().beginFill(menu_palette[0]).drawRect(0, 0, this.width, this.height).endFill();

    var buttons = this.buttons.children;

    for(var i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      var half = Math.round(buttons.length/2)
      button.x = width/2 - this.button_width*(half - i) - 50 + (i>=half?this.button_width+100:0);
    }
  }
}
