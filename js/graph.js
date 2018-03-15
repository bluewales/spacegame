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
    this.dir_by_ori = {
      "|":"east",
      "-":"south"
    };

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

  set_neighbor(neighbors, dir, link) {
    for(var i = 0; i < neighbors.length; i++) {
      if(dir == neighbors[i].direction) {
        neighbors.splice(i,1);
        break;
      }
    }
    if(link !== undefined && link.weight > 0) neighbors.push(link);
  }

  init_node(p) {

    var node = get_3d(this.three_d, p);
    if(node === undefined) {
      node = {};
      set_3d(this.three_d, p, node);
    }

    node.x = p.x; node.y = p.y; node.z = p.z;
    astar.cleanNode(node);

    this.ship.rooms.add_node(node);


    node.neighbors = [];

    for(var i = 0; i < this.neighbor_names.length; i++) {
      var neighbor_dir = this.neighbor_names[i];

      var delta = this.neighbor_deltas[neighbor_dir];
      p.x += delta.x; p.y += delta.y; p.z += delta.z;
      var neighbor = this.get_node(p);
      p.x -= delta.x; p.y -= delta.y; p.z -= delta.z;

      var to_link = undefined;


      if(neighbor) {
        to_link = {
          "weight": this.link_weight(node, neighbor_dir),
          "node": neighbor,
          "direction": neighbor_dir
        };

        var return_dir = this.neighbor_oposites[neighbor_dir];
        var return_link = {
          "weight": this.link_weight(neighbor, return_dir),
          "node": node,
          "direction": return_dir
        };
        this.set_neighbor(neighbor.neighbors, return_dir, return_link);
      }
      this.set_neighbor(node.neighbors, neighbor_dir, to_link);
    }
  }

  cell_weight(pos) {
    var weight = 1;
    if(get_3d(this.ship.furniture, pos))
      weight *= 4;
    return weight;
  }

  get_divider(pos, other_pos, dir) {
    if(dir == "up" || dir == "down") {
      var floor_pos = pos;
      if(dir == "up") floor_pos = other_pos;
      var floor = get_3d(this.ship.floors, floor_pos);

      return floor;
    } else {
      var wall_pos = pos;
      if(dir == "north" || dir == "west") {
        wall_pos = {"x":other_pos.x,"y":other_pos.y,"z":other_pos.z};
      } else {
        wall_pos = {"x":pos.x,"y":pos.y,"z":pos.z};
      }
      var orientation = this.orientations[dir];
      wall_pos.ori = orientation;
      var wall = get_3d(this.ship.walls, wall_pos);
      return wall;
    }
  }

  link_weight(pos, dir) {

    var to_pos = {
      "x":pos.x+this.neighbor_deltas[dir].x,
      "y":pos.y+this.neighbor_deltas[dir].y,
      "z":pos.z+this.neighbor_deltas[dir].z
    };

    var weight = 1;
    var divider = this.get_divider(pos, to_pos, dir);
    if(divider) weight = divider.traverse_weight;
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
            var pos = {"x":x,"y":y,"z":z};
            if(!get_3d(this.three_d, pos))
            this.init_node(pos);
          }
        }
      }
    }
  }

  update_divider(pos, other_pos, dir) {
    this.update_bounding(pos);
    this.update_bounding(other_pos);

    var node = this.get_node(pos);
    var neighbor = this.get_node(other_pos);

    var link = {
      "weight": this.link_weight(node, dir),
      "node": neighbor,
      "direction": dir
    };
    this.set_neighbor(node.neighbors, dir, link);

    var return_dir = this.neighbor_oposites[dir];
    var return_link = {
      "weight": this.link_weight(neighbor, return_dir),
      "node": node,
      "direction": return_dir
    };
    this.set_neighbor(neighbor.neighbors, return_dir, return_link);

    this.ship.rooms.update_divider(pos, other_pos, dir);
  }

  update_wall(pos) {
    var ori = pos.ori;
    var cell_pos = {"x":pos.x,"y":pos.y,"z":pos.z};
    var other_pos = {"x":pos.x+(ori=="|"?1:0),"y":pos.y+(ori=="-"?1:0),"z":pos.z};
    var dir = this.dir_by_ori[ori];
    this.update_divider(cell_pos, other_pos, dir);
  }
  update_floor(pos) {
    var other_pos = {"x":pos.x,"y":pos.y,"z":pos.z-1};
    this.update_divider(pos, other_pos, "down");
  }
  update_furniture(pos) {
    this.update_bounding(pos);
    this.init_node(pos);
  }

  update_pos(pos) {
    if(pos.ori) {
      this.update_wall(pos);
    } else {
      this.update_floor(pos);
      this.update_furniture(pos);
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
