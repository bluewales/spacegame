class Button extends createjs.Container {
  constructor(config) {
    super();

    this.config = config;
    this.width = config.width;
    this.height = config.height;
    this.text_hight = config.text_hight || 20;
    this.text = new createjs.Text(config.text, this.text_hight + "px Arial", menu_palette[1]);
    this.on_click = config.on_click;


    this.text.textAlign = "center";
    this.text.y = this.height/2 - this.text_hight/2;
    if(config.card) {
      this.card = config.card;
      this.card.button = this;
    }
    this._active = false;
    this.background_color = menu_palette[0];


    this.box = new createjs.Shape();
    this.box.graphics.beginFill(this.background_color).drawRect(-this.width/2, 0, this.width, this.height).endFill();

    this.addEventListener("mousedown", function(event) {
      this.box.graphics.clear().beginFill(menu_palette[2]).drawRect(-this.width/2, 0, this.width, this.height).endFill();
    }.bind(this));

    this.addEventListener("pressup", function(event) {
      this.box.graphics.clear().beginFill(this.background_color).drawRect(-this.width/2, 0, this.width, this.height).endFill();
    }.bind(this));

    this.addEventListener("click", function(event) {
      console.log(this.text.text + " button");
      this.active = !this.active;
      if(this.on_click) {
        this.on_click(event);
      }
      if(!this.active && this.card) {
        this.card.deactivate();
      }
    }.bind(this));

    this.addChild(this.box);
    this.addChild(this.text);
  }

  set active(value) {
    if(this._active === value) return;
    this._active = value;
    if(this._active) {
      this.background_color = menu_palette[3];
      if(this.card) {
        game.card_table.focus(this.card);
        this.card.active = true;
      }
    } else {
      this.background_color = menu_palette[0];
      if(this.card) {
        game.card_table.removeChild(this.card);
      }
    }
    this.box.graphics.clear().beginFill(this.background_color).drawRect(-this.width/2, 0, this.width, this.height).endFill();
  }
  get active() {
    return this._active;
  }
}
