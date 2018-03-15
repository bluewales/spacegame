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

    this.button_data = [
      {
        "name":"Controls",
        "card": new ControlsCard()
      },{
        "name":"Save",
        "on_click": function(event) {
          game.save();
          event.currentTarget.active = false;
        }
      }
    ];

    this.buttons = new createjs.Container();
    for(var i = 0; i < this.button_data.length; i++) {
      var button_config = {
        "width": this.button_width,
        "height": this.button_height,
        "text": this.button_data[i].name,
        "card": this.button_data[i].card,
        "on_click": this.button_data[i].on_click
      };
      var button = new Button(button_config);
      this.buttons.addChild(button);
      //button.active = true;
      this.button_data[i].button = button;
    }
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
