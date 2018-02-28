class Card extends createjs.Container {
  constructor(name, button, width, height) {
    super();

    this.width = width;
    this.height = height;
    this.name = name;


    this.x = (game.width - this.width)/2;
    this.y = (game.height - this.height)/2;

    this.frame = new CardFrame(this, this.width, this.height);
    this.addChild(this.frame);

    this.button = button;

    game.card_table.register(this);
  }
  deactivate() {}
  set active(value) {
    if(this._active === value) return;
    this._active = value;
    this.button.active = value;
    if(!this._active) {
      this.deactivate();
    }
  }
  set pinned(value) {
    this.frame.pinned = value;
  }
  get pinned() {
    return this.frame.pinned;
  }
}
