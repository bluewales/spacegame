"use strict";

class Wall extends Structure {

  constructor(ship, raw) {
    super(raw);

    this.ship = ship;
		this.raw = raw;
		this.type = raw.type;
		if(this.type == "door") this.component = new Door(ship, raw);
		if(this.type == "panel") this.component = new WallPanel(ship, raw);

    this.x = this.ship.position_transform(this.pos.x);
    this.y = this.ship.position_transform(this.pos.y);

    this.addChild(this.component);
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
  tick(event) {
    if(this.component.tick) this.component.tick(event);
  }
}
