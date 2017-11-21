/**
 * Created by Luke on 7/9/2017.
 */







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
		if(this.layers[layer] === undefined) {
			return;
		}
		this.layers[layer].removeChild(item);
	}
}

class Ship extends createjs.Container {
	constructor(sprites, raw_ship) {
		super();

    this.sprites = sprites;

		this.grid_width = 24;
		this.padding = 1;

		this.floor_layer = 0;
		this.wall_layer = 1;
		this.furniture_layer = 2;
		this.crew_layer = 3;

		this.floors = {};
		this.walls = {};
		this.furniture = {};
		this.crew = {};

		this.places = [
			this.floors,
			this.walls,
			this.furniture,
			this.crew
		];

    this.levels = {};
		this.graph = new Graph(this);

		this.raw_ship = raw_ship;

		this.min_z = d3.min([d3.min(d3.keys(raw_ship.walls), function(d) {return d*1;}),d3.min(raw_ship.walls, function(d) {return d.location.z*1;})]);
  	this.max_z = d3.max([d3.max(d3.keys(raw_ship.walls), function(d) {return d*1;}),d3.max(raw_ship.walls, function(d) {return d.location.z*1;})]);

		var x,y,z;

  	var floors = raw_ship.floors;
    for(z = this.min_z; z <= this.max_z; z++) {
    	if(z in floors) {
    		for(y = 0; y < floors[z].length; y++) {
    			for(x = 0; x < floors[z][y].length; x++) {
    				var floor_key = floors[z][y][x];
    				this.add_floor_at({"x":x, "y":y, "z":z}, floor_key);
    			}
    		}
    	}
    }

		var walls = raw_ship.walls;
  	for(var i = 0; i < walls.length; i++) {
  		this.add_wall(walls[i]);
  	}

  	var crew = raw_ship.crew;
  	for(var i = 0; i < crew.length; i++) {
  		this.add_crew_member(crew[i]);
  	}

    var furniture = raw_ship.furniture;
  	for(var i = 0; i < furniture.length; i++) {
  		this.add_furniture(furniture[i]);
  	}
	}

	position_transform(x) {
		return x*(this.grid_width+this.padding*2)+this.padding;
	}

	get_things(pos) {
		var things = [];
		for(var i = 0; i < this.places.length; i++) {
			var thing = get_3d(this.places[i], pos);
			if(thing) {
				things.push(thing);
			}
		}
		return things;
	}

  add_thing(pos, place, thing, layer) {
    if(this.levels[pos.z] === undefined) this.levels[pos.z] = new Level();
		if(place !== undefined) set_3d(place, pos, thing);
		this.levels[pos.z].add(thing, layer);
  }

  add_floor_at(pos, floor_key) {
		if(floor_key == ".") return;
		var floor = new Floor(this, this.sprites[floor_key].sprite, floor_key, pos);

    this.add_thing(pos, this.floors, floor, this.floor_layer);
		this.graph.update_node( pos);
  }
  add_wall(wall_raw) {
    var wall = new Wall(this, wall_raw);

		if(this.levels[wall.pos.z] === undefined)
			this.levels[wall.pos.z] = new Level();
		this.levels[wall.pos.z].add(wall, this.wall_layer);

		var both_walls = get_3d(this.walls, wall_raw.location);
		if(!both_walls) {
			set_3d(this.walls, wall.pos, {});
			both_walls = get_3d(this.walls, wall_raw.location);
		}
		if(both_walls[wall.raw.direction]) {
			this.remove_wall(wall.pos, wall.raw.direction);
		}
		both_walls[wall.raw.direction] = wall;
		this.graph.update_node(wall.pos);
  }
	remove_wall(pos, dir) {
		var both_walls = get_3d(this.walls, wall_raw.location);
		if(!both_walls) return;
		var wall = both_walls[dir];
		if(!wall) return;
		this.levels[pos.z].remove(wall, this.wall_layer);
		both_walls[dir] = undefined;
		this.graph.update_node(pos);
	}
  add_crew_member(crew_raw) {
		var crew_member = new Crew(this, crew_raw);
    this.add_thing(crew_raw.location, this.crew, crew_member, this.crew_layer);
		this.graph.update_node(crew_raw.location);
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
		var furniture = new Furniture(this, this.sprites[furniture_raw.sprite].sprite, furniture_raw);
    this.add_thing(furniture_raw.location, this.furniture, furniture, this.furniture_layer);
		this.graph.update_node(furniture_raw.location);
  }

	draw_highlight(pos) {
		var grid = this.grid_width+this.padding*2;
		this.highlight_square = new createjs.Shape();
		this.highlight_square.graphics
			.beginStroke('orange')
			.drawRect(pos.x*grid, pos.y*grid, grid, grid);
		this.addChild(this.highlight_square);
	}
	clear_highlight() {
		this.removeChild(this.highlight_square);
	}

	set_display_level(z_level) {
		this.removeAllChildren();
    this.addChild(this.levels[z_level]);
    return;

		for(var z = d3.min(d3.keys(this.levels), function(d) {return d*1;}); z <= z_level; z++) {
			if(this.levels[z] !== undefined) {
				var darken = Math.pow(0.5, z_level-z);
				this.levels[z].alpha = Math.floor(darken);
				this.addChild(this.levels[z]);
			}
		}
	}

	get_buildables(pos) {
		var buildables = [];
		var floor = get_3d(this.floors, pos);
		var wall = get_3d(this.walls, pos);
		if(!floor || floor.name != "floor") {
			buildables.push("floor");
		}
		if(!floor || floor.name != "hatch") {
			buildables.push("hatch");
		}
		return buildables;
	}
}
