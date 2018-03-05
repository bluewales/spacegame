class CardFrame extends createjs.Container {
  constructor(parent, width, height) {
    super();

    this.parent = parent;
    this.width = width;
    this.height = height;

    this.border_width = 6;
    this.header_width = 40;

    this.box = new createjs.Shape();
    this.box.graphics.beginFill(menu_palette[0]).drawRect(
      -this.border_width,
      -this.border_width*2 - this.header_width,
      this.width+this.border_width*2,
      this.height+this.border_width*3 + this.header_width
    ).endFill();

    this.box.graphics.beginFill(menu_palette[1]).drawRect(
      0,
      -this.header_width - this.border_width,
      this.width,
      this.height + this.header_width + this.border_width
    ).endFill();

    this.box.graphics.beginFill(menu_palette[0]).drawRect(
      this.border_width,
      -this.border_width,
      this.width - this.border_width*2,
      this.border_width
    ).endFill();
    this.addChild(this.box);

    this.title = new createjs.Text(this.parent.name, (this.header_width-this.border_width*2) + "px Arial", menu_palette[0]);
    this.title.x = this.border_width;
    this.title.y = -this.header_width;
    this.addChild(this.title);

    this.ex_width = this.header_width-this.border_width*2;
    this.ex = new createjs.Shape();
    this.ex.x = this.width + this.border_width - this.header_width;
    this.ex.y = -this.header_width;
    this.draw_ex(menu_palette[0], menu_palette[4]);
    this.addChild(this.ex);

    this.ex.on("click", function(event) {this.parent.active=false; event.stopPropagation();}.bind(this));
    this.ex.on("mousedown", function(event) {this.draw_ex(menu_palette[1], menu_palette[3]); event.stopPropagation();}.bind(this));
    this.ex.on("pressup", function(event) {this.draw_ex(menu_palette[0], menu_palette[4]); event.stopPropagation();}.bind(this));
    this.ex.on("pressmove", function(event) {event.stopPropagation();}.bind(this));


    this.un_pinned = new createjs.Sprite(game.ship.sprites["un_pinned"].sprite, "un_pinned");
    this.is_pinned = new createjs.Sprite(game.ship.sprites["pinned"].sprite, "pinned");
    this.un_pinned.x = this.is_pinned.x = this.width - this.icon_width;
    this.un_pinned.y = this.is_pinned.y = 0-this.header_width;
    this.un_pinned.on("click", function(){this.pinned=true;}.bind(this));
    this.is_pinned.on("click", function(){this.pinned=false;}.bind(this));

    this.on("click", this.click.bind(this));
    this.on("mousedown", this.mousedown.bind(this));
    this.on("pressmove", this.drag.bind(this));

    this.pinned = true;
  }
  click(event) {
    game.card_table.focus(this.parent);
  }
  mousedown(event) {
    this.drag_start = [event.stageX, event.stageY];
    game.card_table.focus(this.parent);
  }
  drag(event) {
    this.parent.x += event.stageX - this.drag_start[0];
    this.parent.y += event.stageY - this.drag_start[1];
    this.drag_start = [event.stageX, event.stageY];
  }
  draw_ex(background, foreground) {
    this.ex.graphics.clear();
    this.ex.graphics.beginFill(background).drawRect(
      0,
      0,
      this.ex_width,
      this.ex_width
    ).endFill();

    this.ex.graphics
      .setStrokeStyle(this.border_width)
      .beginStroke(foreground)
      .moveTo(this.border_width, this.border_width)
      .lineTo(this.ex_width-this.border_width, this.ex_width-this.border_width)
      .moveTo(this.ex_width-this.border_width, this.border_width)
      .lineTo(this.border_width, this.ex_width-this.border_width);
  }
  set pinned(value) {
    if(this._pinned === value) return;
    this._pinned = value;
    if(this._pinned) {
      this.removeChild(this.un_pinned);
      //this.addChild(this.is_pinned);
    } else {
      this.removeChild(this.is_pinned);
      //this.addChild(this.un_pinned);
    }
  }
  get pinned() {
    return this._pinned;
  }

}
