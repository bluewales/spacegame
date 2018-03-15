class Rooms {
  constructor(ship) {
    this.ship = ship;
    this.graph = ship.graph;
    this.default_room = "outer_space"
    this.rooms = {};
    this.rooms[this.default_room] = {"nodes":{}}
  }
  add_node(node) {
    if(!node.room) {
      set_3d(this.rooms[this.default_room].nodes, node, node);
      node.room = this.default_room;
    }
  }
  update_divider(pos, other_pos, dir) {
    var divider = this.graph.get_divider(pos, other_pos, dir);
    var node = this.graph.get_node(pos);
    var other_node = this.graph.get_node(other_pos);

    if(divider) {
      // there is a divider
      // if both sides are in different rooms then we're done
      if(node.room != other_node.room) {
        return;
      }

      // else we need to check for a path from one side to the other
      // the path cannot use doors
      // if there is a path, or both sides can reach outer_space then we're done
      // if there is no path, then we need to explore both room to find all nodes,
      // and make one new room for the nodes on one side

    } else {
      // there is no divider
      // if both sides are in the same room, then we're done
      if(node.room == other_node.room) {
        return;
      }
      // else move all nodes from one side into the other room
      // just check that we don't destroy outer space
      if(other_node.room == this.default_room) {
        var temp = other_node;
        other_node = node;
        node = temp;
      }
      var iter = iterate_3d(this.rooms[other_node.room].nodes);
      while(true) {
        var thing = iter.next();
        if(thing.done) break;
        var moving_node = thing.value;
        moving_node.room = node.room;
        set_3d(this.rooms[node.room].nodes, moving_node, moving_node);
      }
      delete this.rooms[other_node.room];
    }
  }
}
