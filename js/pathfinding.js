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

  if(dz != 0) {
    var pos = from.z>to.z?from:to;
    var floor = get_3d(window.game.ship.floors, pos);
    return (!floor || floor.passable);
  }
  var dir = "?";
  var pos = {};
  if(dx != 0) {
    dir = "east";
    pos = from.x<to.x?from:to;
  }
  if(dy != 0) {
    dir = "south";
    pos = from.y<to.y?from:to;
  }
  var wall = window.game.ship.get_wall(pos, dir);
  return (!wall || wall.passable);
}
