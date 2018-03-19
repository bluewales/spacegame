class Item extends createjs.Container {
  constructor() {
    super();
  }
  init(raw, objects) {


		this.type = raw.type;
    this.pos = raw.pos;

    if(objects === undefined) {
      this.ship = game.ship;
      this.container = game.ship;
    } else {
      this.ship = objects[raw.ship];
      this.container = objects[raw.container];
    }


    this.uid = getUID(this.type);

    this.x = this.ship.position_transform(this.pos.x);
    this.y = this.ship.position_transform(this.pos.y);
  }
  start(raw, objects) {
  }

  set container(c) {
    if(this._container) {
      this._container.remove_item(this);
    }
    this._container = c;
  }
  get container() {
    return this._container;
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
    this.raw.pos = copy_pos(this.pos);
    this.raw.type = this.type;
    this.raw.ship = this.ship.id;
    this.raw.container = this.container.id;
    this.raw.claimed = this.claimed;
    return callback(this, this.raw);
  }
}
