"use strict";

class Furniture extends Structure {
	constructor(ship, raw) {
		super(raw);

		this.ship = ship;
		this.sprite = raw.sprite;

		this.addChild(new createjs.Sprite(ship.sprites[raw.sprite].sprite, this.sprite));

		this.x = this.ship.position_transform(this.pos.x);
		this.y = this.ship.position_transform(this.pos.y);

		this.name = raw.sprite;
	}
	get_menu_item() {
    return {"name":this.name, "list":[{"name":"deconstruct", "handle":this.deconstruct.bind(this)}]}
  }
	deconstruct() {
    console.log("deconstruct " + this.name + " " + this.pos.x + ","+this.pos.y + "," + this.pos.z);
		this.ship.remove_furniture(this.pos);
  }
	get_raw() {
    this.raw.location = {"x":this.pos.x, "y":this.pos.y, "z":this.pos.z};
		this.raw.progress = this.progress;
    this.raw.name = this.name;
    this.raw.sprite = this.sprite;
    return this.raw;
  }
}
