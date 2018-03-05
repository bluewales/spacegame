"use strict";

class Wall extends Structure {

  constructor(ship, raw) {
    super(ship, raw);





  }
	get ori() {
		return this.component.ori;
	}
  set name(value) {}
	get name() {
		return this.component.name;
	}

  get passable() {
    return this.component.passable;
  }
  get traverse_weight() {
    return this.component.traverse_weight;
  }
  get_menu_item() {
    return {"name":this.name, "list":[{
      "name":"deconstruct",
      "list":[{"name":"deconstruct", "handle":this.deconstruct.bind(this)}]
    }]};
  }
  deconstruct() {
    console.log("deconstruct " + this.name + " " + this.pos.x + "," + this.pos.y + "," + this.pos.z);
    this.ship.remove_wall(this.pos, this.ori);
  }
  get_raw() {
    this.raw.pos = this.pos;
    this.raw.progress = this.progress;
    this.raw.type = this.type;
    return this.raw;
  }
  get layer() {
    return "wall";
  }
}
