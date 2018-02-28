class BottomBar extends createjs.Container {
  constructor() {
    super();

    this.bar_height = 40;
    this.width = 100;
    this.height = 100;

    this.button_width = 100;
    this.button_height = this.bar_height;

    this.box = new createjs.Container();
    this.box = new createjs.Shape();
    this.box.graphics.beginFill(menu_palette[0]).drawRect(0, this.height-this.bar_height, this.width, this.height).endFill();
    this.addChild(this.box);

    this.button_data = [
      {
        "name":"Build",
        "card": new BuildCard()
      }
      //this.buttons.addChild(new Button(this.button_width, this.button_height, "Crew"));
      //this.buttons.addChild(new Button(this.button_width, this.button_height, "Jobs"));
      //this.buttons.addChild(new Button(this.button_width, this.button_height, "Trade"));
      //this.buttons.addChild(new Button(this.button_width, this.button_height, "Navigation"));
    ];

    this.buttons = new createjs.Container();
    for(var i = 0; i < this.button_data.length; i++) {
      var button_config = {
        "width": this.button_width,
        "height": this.button_height,
        "text": this.button_data[i].name,
        "card": this.button_data[i].card
      };
      var button = new Button(button_config);
      this.buttons.addChild(button);
      button.active = true;
      this.button_data[i].button = button;
    }
    this.addChild(this.buttons);

  }


  tick(width, height) {
    this.width = width;
    this.height = height;

    this.box.graphics.clear().beginFill(menu_palette[0]).drawRect(0, this.height-this.bar_height, this.width, this.height).endFill();

    var buttons = this.buttons.children;

    for(var i = 0; i < buttons.length; i++) {
      var button = buttons[i];
      var half = buttons.length/2;
      button.x = width/2 - this.button_width*(half - i - 0.5);
      button.y = height - this.button_height;
    }
  }
}
