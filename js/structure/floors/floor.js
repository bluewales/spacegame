class Floor extends Structure {
 constructor(ship, raw) {
		super(ship, raw);

	}
  set name(value) {}
  get name() {
    return this.component.name;
  }
  get permiable() {
    return this.component.permiable;
  }
  get passable() {
    return this.component.passable;
  }
	get traverse_weight() {
		return this.component.traverse_weight;
	}
  get_menu_item() {
    return {"name":this.name, "list":[{"name":"deconstruct", "handle":this.deconstruct.bind(this)}]}
  }
  deconstruct() {
    console.log("deconstruct " + this.name + " " + this.pos.x + ","+this.pos.y + "," + this.pos.z);
    this.ship.remove_floor(this.pos);
  }
  get_raw() {
    this.raw.pos = {"x":this.pos.x, "y":this.pos.y, "z":this.pos.z};
    this.raw.progress = this.progress;
    this.raw.type = this.type;
    return this.raw;
  }
  get layer() {
    return "floor";
  }
}
