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

		this.min_z = d3.min([d3.min(d3.keys(raw.walls), function(d) {return d*1;}),d3.min(raw.walls, function(d) {return d.pos.z*1;})]);
  	this.max_z = d3.max([d3.max(d3.keys(raw.walls), function(d) {return d*1;}),d3.max(raw.walls, function(d) {return d.pos.z*1;})]);

		var x,y,z;

    var floors = raw.floors;
  	for(var i = 0; i < floors.length; i++) {
  		this.add_structure(floors[i]);
  	}

		var walls = raw.walls;
  	for(var i = 0; i < walls.length; i++) {
  		this.add_structure(walls[i]);
  	}

    var furniture = raw.furniture;
  	for(var i = 0; i < furniture.length; i++) {
  		this.add_structure(furniture[i]);
  	}

  	var crew = raw.crew;
  	for(var i = 0; i < crew.length; i++) {
  		this.add_crew_member(crew[i]);
  	}


	}

  get_raw() {
    this.raw = {"walls": [], "floors":[], "crew": [], "furniture": []};
    for (var thing of iterate_3d(this.walls)) {
      this.raw.walls.push(thing.get_raw());
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
    //console.log(this.raw);
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
  get_layer_from_string(str) {
    switch(str) {
      case "floor":
        return this.floor_layer;
      case "wall":
        return this.wall_layer;
      case "furniture":
        return this.furniture_layer;
      default:
        console.log("ERROR cannot find layer '" + str + "'");
        return undefined;
    }
  }
  get_place_from_string(str) {
    switch(str) {
      case "floor":
        return this.floors;
      case "wall":
        return this.walls;
      case "furniture":
        return this.furniture;
      default:
        console.log("ERROR cannot find place '" + str + "'");
        return undefined;
    }
  }
  add_structure(raw) {
    var structure = Structure.createStructure(this, raw);
    var layer = this.get_layer_from_string(structure.layer);
    var place = this.get_place_from_string(structure.layer);
    this.add_thing(structure.pos, place, structure, layer);
    this.graph.update_pos(structure.pos);
    return structure;
  }
  get_floor(pos) {
    return get_3d(this.floors, pos);
  }
  remove_floor(pos) {
    var floor = get_3d(this.floors, pos);
    this.levels[pos.z].remove(floor, this.floor_layer);
    set_3d(this.floors, pos, undefined);
    this.graph.update_pos(pos);
  }
  get_wall(pos) {
    return get_3d(this.walls, pos);
  }
	remove_wall(pos) {
    var floor = get_3d(this.walls, pos);
		this.levels[pos.z].remove(wall, this.wall_layer);
		set_3d(this.walls, pos, undefined);
		this.graph.update_pos(pos);
	}
  remove_furniture(pos) {
    var furniture = get_3d(this.furniture, pos);
    this.levels[pos.z].remove(furniture, this.furniture_layer);
    set_3d(this.furniture, pos, undefined);
    this.graph.update_pos(pos);
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


	draw_highlight(pos) {
		var grid = this.grid_width+this.padding*2;
    if(!this.highlight_square) {
  		this.highlight_square = new createjs.Shape();
    }
    this.highlight_square.graphics.clear();
    if(pos.ori) {
      if(pos.ori == "-") {
        this.highlight_square.graphics
    			.beginFill('red')
    			.drawRect(pos.x*grid, (pos.y+1)*grid - this.padding, grid, this.padding*2);
      } else {
    		this.highlight_square.graphics
    			.beginFill('red')
    			.drawRect((pos.x + 1)*grid - this.padding, pos.y*grid, this.padding*2, grid);
      }
    } else {
      this.highlight_square.graphics
  			.beginStroke('orange')
  			.drawRect(pos.x*grid, pos.y*grid, grid, grid);
    }

		this.addChild(this.highlight_square);
	}
	clear_highlight() {
		this.removeChild(this.highlight_square);
	}

	set_display_level(z_level) {
		this.removeAllChildren();
    this.addChild(this.levels[z_level]);
    return;

    var min_z = d3.min(d3.keys(this.levels), function(d) {return d*1;});
		for(var z = min_z; z <= z_level; z++) {
			if(this.levels[z] !== undefined) {
				var darken = Math.pow(0.5, z_level-z);
				this.levels[z].alpha = Math.floor(darken);
				this.addChild(this.levels[z]);
			}
		}
	}
}
