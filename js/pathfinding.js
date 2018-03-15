function get_path(from, to) {

  var graph = window.game.ship.graph;
  var start = graph.get_node(from);
  var end = graph.get_node(to);
  var path = astar.search(graph, start, end);

  return path;
}

function walled_distance(a, b) {
  var dx = Math.abs(a.x - b.x);
  var dy = Math.abs(a.y - b.y);
  var dz = Math.abs(a.z - b.z);

  if(a.ori || b.ori) {
    var dx1 = Math.abs((a.x+(a.ori=='|'?1:0)) - b.x);
    var dx2 = Math.abs(a.x - (b.x+(b.ori=='|'?1:0)));
    var dx3 = Math.abs((a.x+(a.ori=='|'?1:0)) - (b.x+(b.ori=='|'?1:0)));

    var dy1 = Math.abs((a.y+(a.ori=='-'?1:0)) - b.y);
    var dy2 = Math.abs(a.y - (b.y+(b.ori=='-'?1:0)));
    var dy3 = Math.abs((a.y+(a.ori=='-'?1:0)) - (b.y+(b.ori=='-'?1:0)));

    if(dx > dx1) dx = dx1;
    if(dx > dx2) dx = dx2;
    if(dx > dx3) dx = dx3;

    if(dy > dy1) dy = dy1;
    if(dy > dy2) dy = dy2;
    if(dy > dy3) dy = dy3;
  }

  return dx + dy + dz;
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
