class Item extends createjs.Container {
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

    this.x = this.ship.position_transform(this.pos.x);
    this.y = this.ship.position_transform(this.pos.y);
  }
  start(raw, objects) {
  }
  static get_type_from_string(str) {
    return type_lookup[str];
  }
  static create(ship, raw) {
    var type = Item.get_type_from_string(raw.type);
    return new type(ship, raw);
  }
  get layer() {
    return "item";
  }
  get_raw(callback) {
    this.raw = {};
    this.raw.pos = this.pos;
    this.raw.type = this.type;
    this.raw.ship = this.ship.id;
    return callback(this, this.raw);
  }
}
