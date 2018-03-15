class Floor extends Structure {
  constructor() {
    super();
  }
  init(raw, objects) {
		super.init(raw, objects);
	}
  start(raw, objects) {
    super.start(raw, objects);
  }
  deconstruct() {
    console.log("deconstruct " + this.name + " " + this.pos.x + ","+this.pos.y + "," + this.pos.z);
    this.ship.remove_floor(this.pos);
  }
  get_raw(callback) {
    this.raw = {};
    this.raw.pos = {x:this.pos.x, y:this.pos.y, z:this.pos.z};
    this.raw.progress = this.progress;
    this.raw.type = this.type;
    this.raw.ship = this.ship.id;
    callback(this, this.raw);
  }
  get layer() {
    return "floor";
  }
  static can_build(pos) {
    if(game.ship.get_floor(pos)) return false;
    return true;
  }
}
