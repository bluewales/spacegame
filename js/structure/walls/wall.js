class Wall extends Structure {

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
    console.log("deconstruct " + this.name + " " + this.pos.x + "," + this.pos.y + "," + this.pos.z);
    this.ship.remove_wall(this.pos, this.ori);
  }
  get_raw(callback) {
    this.raw = {};
    this.raw.pos = {x:this.pos.x, y:this.pos.y, z:this.pos.z, ori:this.pos.ori};
    this.raw.progress = this.progress;
    this.raw.type = this.type;
    this.raw.ship = this.ship.id;
    callback(this, this.raw);
  }
  get layer() {
    return "wall";
  }
  static can_build(pos) {
    if(game.ship.get_wall(pos)) return false;
    return true;
  }
}
