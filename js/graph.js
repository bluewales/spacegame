class Graph {
  constructor(ship) {
    this.three_d = {};
    this.neighbor_names = ["north","south","east","west","up","down"];
    this.neighbor_deltas = {
      "north": {"x":0,"y":-1,"z":0},
      "south": {"x":0,"y":1,"z":0},
      "east": {"x":1,"y":0,"z":0},
      "west": {"x":-1,"y":0,"z":0},
      "up": {"x":0,"y":0,"z":1},
      "down": {"x":0,"y":0,"z":-1}
    };
    this.neighbor_oposites = {
      "north":"south",
      "south":"north",
      "east":"west",
      "west":"east",
      "up":"down",
      "down":"up"
    };
    this.orientations = {
      "north":"-",
      "south":"-",
      "east":"|",
      "west":"|"
    }

    this.min_bound = {"x":0,"y":0,"z":0};
    this.max_bound = {"x":-1,"y":-1,"z":-1};

    this.ship = ship;
    this.dirtyNodes = [];
  }
  get_node(p) {
    return get_3d(this.three_d, p);
  }
  clear_node(p) {
    var node = get_3d(this.three_d, p);
    if(node === undefined) return;
    for(var i = 0; i < this.neighbor_names.length; i++) {
      var neighbor_name = this.neighbor_names[i];
      var neighbor = node.neighbors[neighbor_name];
      if(neighbor) {
        var oposite = this.neighbor_oposites[neighbor_name];
        neighbor.neighbors[oposite] = undefined;
        node.neighbors[neighbor_name] = undefined;
      }
    }
    node.weight = 0;
  }

  set_node(p) {

    var node = get_3d(this.three_d, p);
    if(node === undefined) {
      node = {};
      set_3d(this.three_d, p, node);
    }

    astar.cleanNode(node);
    node.x = p.x; node.y = p.y; node.z = p.z;

    node.neighbors = [];

    for(var i = 0; i < this.neighbor_names.length; i++) {
      var neighbor_name = this.neighbor_names[i];
      var delta = this.neighbor_deltas[neighbor_name];

      p.x += delta.x; p.y += delta.y; p.z += delta.z;
      var neighbor = this.get_node(p);
      p.x -= delta.x; p.y -= delta.y; p.z -= delta.z;

      var link_weight = this.link_weight(p, neighbor_name);
      node.weight = this.cell_weight(p);

      if(link_weight > 0 && neighbor) {
        node.neighbors.push({
          "weight": (link_weight),
          "node": neighbor,
          "direction": neighbor_name
        });
      }
    }
  }

  cell_weight(pos) {
    var weight = 1;
    if(get_3d(this.ship.furniture, pos))
      weight *= 4;
    return weight;
  }

  link_weight(pos, dir) {
    var weight = 0;
    var to_pos = {
      "x":pos.x+this.neighbor_deltas[dir].x,
      "y":pos.y+this.neighbor_deltas[dir].y,
      "z":pos.z+this.neighbor_deltas[dir].z
    };
    if(dir == "up" || dir == "down") {
      var floor_pos = pos;
      if(dir == "up") floor_pos = to_pos;
      var floor = get_3d(this.ship.floors, floor_pos);

      if(floor) {
        weight = floor.traverse_weight;
      } else {
        weight = 1;
      }
    } else {
      var wall_pos = pos;
      if(dir == "north" || dir == "west") {
        wall_pos = to_pos;
      }
      var orientation = this.orientations[dir];
      var both_walls = get_3d(this.ship.walls, wall_pos);
      if(!both_walls) {
        weight = 1;
      } else {
        var wall = both_walls[orientation];
        if(wall)
          weight = wall.traverse_weight;
        else
          weight = 1;
      }
    }
    return weight * this.cell_weight(to_pos);
  }

  update_bounding(p) {
    var changed = false;

    if(this.max_bound.x < p.x) {this.max_bound.x = p.x; changed = true;}
    if(this.max_bound.y < p.y) {this.max_bound.y = p.y; changed = true;}
    if(this.max_bound.z < p.z) {this.max_bound.z = p.z; changed = true;}

    if(this.min_bound.x > p.x) {this.min_bound.x = p.x; changed = true;}
    if(this.min_bound.y > p.y) {this.min_bound.y = p.y; changed = true;}
    if(this.min_bound.z > p.z) {this.min_bound.z = p.z; changed = true;}

    if(changed) {
      for(var x = this.min_bound.x-1; x <= this.max_bound.x+1; x++) {
        for(var y = this.min_bound.y-1; y <= this.max_bound.y+1; y++) {
          for(var z = this.min_bound.z-1; z <= this.max_bound.z+1; z++) {
            this.update_node({"x":x,"y":y,"z":z}, false);
          }
        }
      }
    }
  }
  update_node(p, part_of_bounding=true) {
    this.set_node(p);
    if(part_of_bounding) {
      this.update_bounding(p);
      this.update_node({"x":p.x+1,"y":p.y,"z":p.z},false);
      this.update_node({"x":p.x-1,"y":p.y,"z":p.z},false);
      this.update_node({"x":p.x,"y":p.y+1,"z":p.z},false);
      this.update_node({"x":p.x,"y":p.y-1,"z":p.z},false);
      this.update_node({"x":p.x,"y":p.y,"z":p.z+1},false);
      this.update_node({"x":p.x,"y":p.y,"z":p.z-1},false);
    }
  }
  cleanDirty() {
    for (var i = 0; i < this.dirtyNodes.length; i++) {
      astar.cleanNode(this.dirtyNodes[i]);
    }
    this.dirtyNodes = [];
  }
  markDirty(node) {
    this.dirtyNodes.push(node);
  }
  neighbors(node) {
    shuffle_array(node.neighbors);
    return node.neighbors;
  }
}
