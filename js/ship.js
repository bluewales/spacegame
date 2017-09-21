/**
 * Created by Luke on 7/9/2017.
 */


class Wall extends createjs.Sprite {
	constructor(sheet, sprite_key, pos) {
		super(sheet, sprite_key);

		this.pos = pos;

		this.x = this.pos.x * 24;
		this.y = this.pos.y * 24;

		// handle click/tap
		this.on('click', this.handle_click.bind(this));
	}
	handle_click(event) {
		console.log("click " + this.pos.x + "," + this.pos.y + "," + this.pos.z);
		window.game.handle_click(event, this);
	}
}

class Furniture extends createjs.Sprite {
	constructor(sheet, raw) {
		super(sheet, raw.sprite);

		this.pos = raw.location;
    this.raw = raw;

		this.x = this.pos.x * 24;
		this.y = this.pos.y * 24;

		// handle click
		this.on('click', this.handle_click.bind(this));
	}
	handle_click(event) {
		window.game.handle_click(event, this);
	}
}

class Floor extends createjs.Sprite {
	constructor(sheet, sprite_key, pos) {
		super(sheet, sprite_key);
		this.sprite_key = sprite_key;

		this.pos = pos;

		this.passable = sprite_key != "X";
		this.permiable = sprite_key == ".";

		this.x = this.pos.x * 24;
		this.y = this.pos.y * 24;

		// handle click/tap
		this.on('click', this.handle_click.bind(this));
	}
	handle_click() {
		window.game.handle_click(event, this);
	}
}



class Level extends createjs.Container {
  constructor() {
    super();

    this.layers = {};
  }

	add(item, layer) {
		if(this.layers[layer] === undefined) {
			this.layers[layer] = new createjs.Container();
			this.addChild(this.layers[layer]);
		}
		this.layers[layer].addChild(item);
		this.setChildIndex(this.layers[layer], layer);
	}
	remove(item, layer) {
		this.layers[layer].removeChild(item);
	}
}

class Ship extends createjs.Container {
	constructor(structure_sheet, creature_sheet, raw_ship) {
		super();

    this.structure_sheet = structure_sheet;
    this.creature_sheet = creature_sheet;

		this.floor_layer = 0;
		this.wall_layer = 1;
		this.furniture_layer = 2;
		this.crew_layer = 3;

		this.floors = {};
		this.walls = {};
		this.furniture = {};
		this.crew = {};

    this.levels = {};
		this.graph = new Graph(this);

	}

  add_thing(pos, place, thing, layer) {
    if(this.levels[pos.z] === undefined) this.levels[pos.z] = new Level();
		set_3d(place, pos, thing);
		this.levels[pos.z].add(thing, layer);
  }

  add_floor_at(pos, floor_key) {
		if(floor_key == ".") return;
		var floor = new Floor(this.structure_sheet, floor_key, pos);

    this.add_thing(pos, this.floors, floor, this.floor_layer);
		this.graph.update_node(this, pos);
  }
  add_wall_at(pos, wall_key) {
		if(wall_key == ".") return;
    var wall = new Wall(this.structure_sheet, wall_key, pos);

    this.add_thing(pos, this.walls, wall, this.wall_layer);
		this.graph.update_node(this, pos);
  }
  add_crew_member(crew_raw) {
		var crew_member = new Crew(this.creature_sheet, crew_raw, this);
    this.add_thing(crew_raw.location, this.crew, crew_member, this.crew_layer);
		this.graph.update_node(this, crew_raw.location);
  }
	change_position_crew(crew_member, p) {
		if(get_3d(this.crew, crew_member.pos) !== crew_member) {
			console.log("ERROR!");
		}
		set_3d(this.crew, crew_member.pos, undefined);
		set_3d(this.crew, p, crew_member);
		if(crew_member.pos.z != p.z) {
			this.levels[crew_member.pos.z].remove(crew_member, this.crew_layer);
			this.add_thing(p, this.crew, crew_member, this.crew_layer);
		}

	}
	add_furniture(furniture_raw) {
		var furniture = new Furniture(this.structure_sheet, furniture_raw);
    this.add_thing(furniture_raw.location, this.furniture, furniture, this.furniture_layer);
		this.graph.update_node(this, furniture_raw.location);
  }


	set_display_level(z_level) {
		this.removeAllChildren();
    this.addChild(this.levels[z_level]);
    return;

		for(var z = d3.min(d3.keys(this.levels), function(d) {return d*1;}); z <= z_level; z++) {
			if(!(this.levels[z] === undefined)){
				var darken = Math.pow(.5, z_level-z);
				this.levels[z].alpha = Math.floor(darken);
				this.addChild(this.levels[z]);
			}
		}
	}
}
