class Furniture extends Structure {
	constructor() {
		super();
	}
	init(raw, objects) {
		super.init(raw, objects);

		this.name = raw.sprite;
	}

  start(raw, objects) {
    super.start(raw, objects);
  }
	deconstruct() {
    console.log("deconstruct " + this.name + " " + this.pos.x + ","+this.pos.y + "," + this.pos.z);
		this.ship.remove_furniture(this.pos);
  }
	get_raw(callback) {
		this.raw = {};
    this.raw.pos = {x:this.pos.x, y:this.pos.y, z:this.pos.z};
		this.raw.progress = this.progress;
		this.raw.ship = this.ship.id;
		this.raw.type = this.type;
    callback(this, this.raw);
  }
  get layer() {
    return "furniture";
  }
  static can_build(pos) {
    if(game.ship.get_furniture(pos)) return false;
    return true;
  }
}
