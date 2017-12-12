"use strict";

class Floor extends Structure {
 constructor(ship, raw) {
		super(raw);

		this.ship = ship;
		this.type = raw.type;

		this.x = this.ship.position_transform(this.pos.x);
		this.y = this.ship.position_transform(this.pos.y);



    this.ship = ship;
		this.raw = raw;
		this.type = raw.type;
		if(this.type == "hatch") this.component = new Hatch(ship, raw);
		if(this.type == "plate") this.component = new FloorPlate(ship, raw);

		if(this.sprite_key=="h") this.name = "hatch";

		this.addChild(this.component);
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
  tick(event) {
    if(this.component.tick) this.component.tick(event);
  }
}
