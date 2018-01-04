"use strict";

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
	constructor(sprites, raw) {
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
    this.rooms = new Rooms(this);

		this.raw = raw;

		this.min_z = d3.min([d3.min(d3.keys(raw.walls), function(d) {return d*1;}),d3.min(raw.walls, function(d) {return d.location.z*1;})]);
  	this.max_z = d3.max([d3.max(d3.keys(raw.walls), function(d) {return d*1;}),d3.max(raw.walls, function(d) {return d.location.z*1;})]);

		var x,y,z;

    var floors = raw.floors;
  	for(var i = 0; i < floors.length; i++) {
  		this.add_floor(floors[i]);
  	}

		var walls = raw.walls;
  	for(var i = 0; i < walls.length; i++) {
  		this.add_wall(walls[i]);
  	}

  	var crew = raw.crew;
  	for(var i = 0; i < crew.length; i++) {
  		this.add_crew_member(crew[i]);
  	}

    var furniture = raw.furniture;
  	for(var i = 0; i < furniture.length; i++) {
  		this.add_furniture(furniture[i]);
  	}
	}

  get_raw() {
    this.raw = {"walls": [], "floors":[], "crew": [], "furniture": []};
    for (var thing of iterate_3d(this.walls)) {
      if(thing['-']) this.raw.walls.push(thing['-'].get_raw());
      if(thing['|']) this.raw.walls.push(thing['|'].get_raw());
    }
    for (var thing of iterate_3d(this.floors)) {
      this.raw.floors.push(thing.get_raw());
    };
    for (var thing of iterate_3d(this.crew)) {
      this.raw.crew.push(thing.get_raw());
    };
    for (var thing of iterate_3d(this.furniture)) {
      this.raw.furniture.push(thing.get_raw());
    };
    console.log(this.raw);
    return this.raw;
  }

  tick(event) {
    for(var i = 0; i < this.places.length; i++) {
      var iter = iterate_3d(this.places[i]);
      while(true) {
        var thing = iter.next();
        if(thing.done) break;
        if(thing.value.tick) thing.value.tick(event);
        if(thing.value["-"] && thing.value["-"].tick) thing.value["-"].tick(event);
        if(thing.value["|"] && thing.value["|"].tick) thing.value["|"].tick(event);
      }
    }
  }

	position_transform(x) {
		return x*(this.grid_width+this.padding*2)+this.padding;
	}

  get_menu_tree_at(pos) {
    var menu_tree = [];

		var floor = get_3d(this.floors, pos);
		if(floor) menu_tree.push(floor.get_menu_item());

    var furniture = get_3d(this.furniture, pos);
		if(furniture) menu_tree.push(furniture.get_menu_item());

    var walls = [];
    var dirs = ["north","south","east","west"];
    for(var i = 0; i < dirs.length; i++) {
      var wall = this.get_wall(pos, dirs[i]);
      if(wall) walls.push({"dir":dirs[i],"wall":wall});
    }
    if(walls.length > 0) {
      var wall_menu_list = [];
      for(var i = 0; i < walls.length; i++) {
        wall_menu_list.push({"name":walls[i].dir, "list":[{"name":"deconstruct","handle":walls[i].wall.deconstruct.bind(walls[i].wall)}]});
      }
      menu_tree.push({"name": "walls", "list":wall_menu_list});
    }
		return menu_tree;
  }

  add_thing(pos, place, thing, layer) {
    if(this.levels[pos.z] === undefined) this.levels[pos.z] = new Level();
    this.levels[pos.z].remove(thing, layer);
		if(place !== undefined) set_3d(place, pos, thing);
		this.levels[pos.z].add(thing, layer);
  }
  add_floor(floor_raw) {
    var floor = new Floor(this, floor_raw);
    this.add_thing(floor.pos, this.floors, floor, this.floor_layer);
		this.graph.update_floor(floor.pos);
  }
  get_floor(pos) {
    return get_3d(this.floors, pos);
  }
  remove_floor(pos) {
    var floor = get_3d(this.floors, pos);
    this.levels[pos.z].remove(floor, this.floor_layer);
    set_3d(this.floors, pos, undefined);
    this.graph.update_floor(pos);
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
			this.remove_wall(wall.pos, wall.raw.orientation);
		}
		both_walls[wall.raw.orientation] = wall;
		this.graph.update_wall(wall.pos, wall.raw.orientation);
  }
	remove_wall(pos, wall_dir) {
		var both_walls = get_3d(this.walls, pos);
		if(!both_walls) return;
		var wall = both_walls[wall_dir];
		if(!wall) return;
		this.levels[pos.z].remove(wall, this.wall_layer);
		both_walls[wall_dir] = undefined;
		this.graph.update_wall(pos, wall_dir);
	}
  get_wall(pos, dir) {
    var wall_pos = pos;
    if(dir == "north" || dir == "west") {
      var delta = this.graph.neighbor_deltas[dir];
      wall_pos = {"x":pos.x+delta.x,"y":pos.y+delta.y,"z":pos.z+delta.z};
    }

    var both_walls = get_3d(this.walls, wall_pos);
		if(!both_walls) return undefined;
    var wall_ori = this.graph.orientations[dir];
    if(dir == "-" || dir == "|") wall_ori = dir;
		return both_walls[wall_ori];
  }
  add_crew_member(crew_raw) {
		var crew_member = new Crew(this, crew_raw);
    this.add_thing(crew_member.pos, this.crew, crew_member, this.crew_layer);
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
		var furniture = new Furniture(this, furniture_raw);
    this.add_thing(furniture.pos, this.furniture, furniture, this.furniture_layer);
		this.graph.update_furniture(furniture.pos);
  }
  remove_furniture(pos) {
    var furniture = get_3d(this.furniture, pos);
    this.levels[pos.z].remove(furniture, this.furniture_layer);
    set_3d(this.furniture, pos, undefined);
    this.graph.update_furniture(pos);
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

	get_construction_menu_list(pos) {
    var construction_menu_list = [];
    var wall_menu_list = [];
    var floor_menu_list = [];
    var dirs = ["north","south","east","west"];

    if(!get_3d(this.floors, pos)) {
      for(var i = 0; i < dirs.length; i++) {
        var dir = dirs[i];
        var d = this.graph.neighbor_deltas;
        var floor_pos = {"x":pos.x+d[dir].x,"y":pos.y+d[dir].y,"z":pos.z+d[dir].z};
        if(get_3d(this.floors, floor_pos)) {
          construction_menu_list.push({
            "name": "build floor",
            "handle": create_floor.bind({"type":"plate","location":pos})
          });
          break;
        }
      }
    }
    wall_menu_list = [
      {"name":"build north wall","handle":create_wall.bind({"orientation":"-","type":"panel","build_pos":pos,"location":{"x":pos.x,"y":pos.y-1,"z":pos.z}})},
      {"name":"build south wall","handle":create_wall.bind({"orientation":"-","type":"panel","build_pos":pos,"location":{"x":pos.x,"y":pos.y,"z":pos.z}})},
      {"name":"build east wall","handle":create_wall.bind({"orientation":"|","type":"panel","build_pos":pos,"location":{"x":pos.x,"y":pos.y,"z":pos.z}})},
      {"name":"build west wall","handle":create_wall.bind({"orientation":"|","type":"panel","build_pos":pos,"location":{"x":pos.x-1,"y":pos.y,"z":pos.z}})}
    ];
    if(wall_menu_list.length > 0) {
      construction_menu_list.push({"name": "walls", "list":wall_menu_list});
    }
    return construction_menu_list;
  }
}
