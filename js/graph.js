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

    this.min_bound = {"x":0,"y":0,"z":0};
    this.max_bound = {"x":0,"y":0,"z":0};

    this.ship = ship;
    this.dirtyNodes = [];
  }
  get_node(p) {
    return get_3d(this.three_d, p);
  }
  clear_node(p) {
    if(this.three_d[p.z] === undefined) return;
    if(this.three_d[p.z][p.y] === undefined) return;
    if(this.three_d[p.z][p.y][p.x] === undefined) return;
    var node = this.three_d[p.z][p.y][p.x];
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
  set_node(p, weight) {
    if(weight == 0) {
      this.clear_node(p);
      return;
    }

    if(this.three_d[p.z] === undefined) this.three_d[p.z] = {};
    if(this.three_d[p.z][p.y] === undefined) this.three_d[p.z][p.y] = {};
    if(this.three_d[p.z][p.y][p.x] === undefined) this.three_d[p.z][p.y][p.x] = {};

    var node = this.three_d[p.z][p.y][p.x];
    astar.cleanNode(node);
    node.x = p.x; node.y = p.y; node.z = p.z;

    node.weight = weight;
    if(!node.neighbors)
      node.neighbors = {};

    for(var i = 0; i < this.neighbor_names.length; i++) {
      var neighbor_name = this.neighbor_names[i];
      var delta = this.neighbor_deltas[neighbor_name];

      p.x += delta.x; p.y += delta.y; p.z += delta.z;
      var neighbor = this.get_node(p);
      p.x -= delta.x; p.y -= delta.y; p.z -= delta.z;
      var link_ok = !!(neighbor && neighbor.weight > 0);
      if(neighbor_name == "up" || neighbor_name == "down") {
        var floor;
        if(neighbor_name == "up") {
          floor = get_3d(this.ship.floors, {"x":p.x,"y":p.y,"z":p.z+1});
        }
        if(neighbor_name == "down") {
          floor = get_3d(this.ship.floors, p);
        }
        if(floor && !floor.passable) {
          link_ok = false;
        }
      }
      if(link_ok) {
        node.neighbors[neighbor_name] = neighbor;
        var oposite = this.neighbor_oposites[neighbor_name];
        neighbor.neighbors[oposite] = node;
      } else {
        node.neighbors[neighbor_name] = undefined;
        var oposite = this.neighbor_oposites[neighbor_name];
        if(neighbor) neighbor.neighbors[oposite] = undefined;
      }
    }
  }
  update_bounding(ship, p) {
    var changed = false;

    if(this.max_bound.x < p.x) {this.max_bound.x = p.x; changed = true;}
    if(this.max_bound.y < p.y) {this.max_bound.y = p.y; changed = true;}
    if(this.max_bound.z < p.z) {this.max_bound.z = p.z; changed = true;}

    if(this.min_bound.x > p.x) {this.min_bound.x = p.x; changed = true;}
    if(this.min_bound.y > p.y) {this.min_bound.y = p.y; changed = true;}
    if(this.min_bound.z > p.z) {this.min_bound.z = p.z; changed = true;}

    if(changed) {
      for(var x = this.min_bound.x-1; x <= this.min_bound.x+1; x++) {
        for(var y = this.min_bound.y-1; y <= this.min_bound.y+1; y++) {
          for(var z = this.min_bound.z-1; z <= this.min_bound.z+1; z++) {
            this.update_node(ship, {"x":x,"y":y,"z":z}, false);
          }
        }
      }
    }
  }
  update_node(ship, p, part_of_bounding=true) {

    if(part_of_bounding)
      this.update_bounding(ship, p);

    function cell_weight(ship, p) {
      var weight = 1;
      if(get_3d(ship.walls, p))
        return 0;
      if(get_3d(ship.furniture, p))
        weight *= 4;
      return weight;
    }

    var node = this.set_node(p, cell_weight(ship, p));

    // set/check this nodes weight based on ship(wall, furniture)
    // set/check neighbor weights based on ship
    // set neighbor links based on ship (floors, etc)
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
    var ret = [];
    for(var i = 0; i < this.neighbor_names.length; i++) {
      var neighbor_name = this.neighbor_names[i];
      if(node.neighbors[neighbor_name]) {
        ret.push(node.neighbors[neighbor_name]);
      }
    }
    return ret;
  }
}
