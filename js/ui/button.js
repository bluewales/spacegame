class Button extends createjs.Container {
  constructor(width, height, text, card) {
    super();

    this.width = width;
    this.height = height;
    this.text = this.text = new createjs.Text(text, "20px Arial", menu_palette[1]);
    this.text.textAlign = "center";
    this.text.y = 10;
    this.card = card;
    this.card.button = this;
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
    }.bind(this));

    this.addChild(this.box);
    this.addChild(this.text);
  }

  set active(value) {
    if(this._active === value) return;
    this._active = value;
    if(this._active) {
      this.background_color = menu_palette[3];
      game.card_table.addChild(this.card);
    } else {
      this.background_color = menu_palette[0];
      game.card_table.removeChild(this.card);
    }
    this.box.graphics.clear().beginFill(this.background_color).drawRect(-this.width/2, 0, this.width, this.height).endFill();
  }
  get active() {
    return this._active;
  }
}
