/**
 * Created by Luke on 7/9/2017.
 */


var ship = {};

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

class Floor extends createjs.Sprite {
	constructor(sheet, sprite_key, pos) {
		super(sheet, sprite_key);

		this.pos = pos;

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

    this.floors = new createjs.Container();
    this.walls = new createjs.Container();
    this.crew = new createjs.Container();

    this.layers = {

		};
  }

	add(item, layer) {
		if(this.layers[layer] === undefined) {
			this.layers[layer] = new createjs.Container();
			this.addChild(this.layers[layer]);
		}
		this.layers[layer].addChild(item);
		//this.setChildIndex(this.layers[layer], layer);
	}
}

class Ship extends createjs.Container {
	constructor(structure_sheet, creature_sheet, raw_ship) {
		super();

    this.structure_sheet = structure_sheet;
    this.creature_sheet = creature_sheet;

		this.floor_layer = 0;
		this.wall_layer = 1;
		this.crew_layer = 2;

		this.floors = {};
		this.walls = {};
		this.crew = {};

    this.levels = {};
	}

  add_thing(pos, place, thing, layer) {

		var z = pos.z;
		var y = pos.y;
		var x = pos.x;

    if(this.levels[z] === undefined) this.levels[z] = new Level();
		if(place[z] == undefined) place[z] = {};
		if(place[z][y] === undefined) place[z][y] = {};
		place[z][y][x] = thing;
		this.levels[z].add(thing, layer);
  }

  add_floor_at(pos, floor_key) {
		if(floor_key == ".") return;
		var floor = new Floor(this.structure_sheet, floor_key, pos);

    this.add_thing(pos, this.floors, floor, this.floor_layer);
  }
  add_wall_at(pos, wall_key) {
		if(wall_key == ".") return;
    var wall = new Wall(this.structure_sheet, wall_key, pos);

    this.add_thing(pos, this.walls, wall, this.wall_layer);
  }
  add_crew_member(crew_raw) {

		var crew = new Crew(this.creature_sheet, crew_raw);
    this.add_thing(crew_raw.location, this.crew, crew, this.crew_layer);

    //test_jobs(crew);
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
