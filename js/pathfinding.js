function get_path(from, to) {
  var graph = window.game.ship.graph;
  var start = graph.get_node(from);
  var end = graph.get_node(to);
  return astar.search(graph, start, end);
}

function passable(from, to) {

  var dx = from.x-to.x;
  var dy = from.y-to.y;
  var dz = from.z-to.z;
  var dist = Math.abs(dx) + Math.abs(dy) + Math.abs(dz);
  if(dist > 1) return false;
  if(dist < 1) return true;

  if(dx != 0) {
    if(dx > 0) {
      return window.game.ship.graph.link_weight(from, "west");
    } else {
      return window.game.ship.graph.link_weight(from, "east");
    }
  }
  if(dy != 0) {
    if(dy > 0) {
      return window.game.ship.graph.link_weight(from, "north");
    } else {
      return window.game.ship.graph.link_weight(from, "south");
    }
  }
  if(dz != 0) {
    if(dz > 0) {
      return window.game.ship.graph.link_weight(from, "down");
    } else {
      return window.game.ship.graph.link_weight(from, "up");
    }
  }
  console.log("ERROR");
}
