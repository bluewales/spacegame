class Structure extends createjs.Container {
  constructor() {
    super();
  }

  init(raw, objects) {

    if(objects === undefined) {
      this.ship = game.ship;
    } else {
      this.ship = objects[raw.ship];
    }


		this.type = raw.type;
    this.pos = raw.pos;

    this.progress = raw.progress;
    if(raw.progress === undefined)
    this.progress = 0;

    this.x = this.ship.position_transform(this.pos.x);
    this.y = this.ship.position_transform(this.pos.y);
  }
  start(raw, objects) {

  }
  set progress(value) {
    this._progress = value;
    this.alpha = value >= 100 ? 1 : 0.4 + value/250;
  }
  get progress() {
    return this._progress;
  }
}
