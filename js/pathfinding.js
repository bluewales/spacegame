

function get_path(from, to) {
  var ship = window.game.ship;

  var p = {"x":from.x, "y":from.y, "z":from.z};
  var path = [];

  path.push({"x":p.x, "y":p.y, "z":p.z});
  function adjust_to(dim) {
    if(p[dim] != to[dim]) {
      var dif = (to[dim] - p[dim]);
      p[dim] += dif / Math.abs(dif);
      path.push({"x":p.x, "y":p.y, "z":p.z});
    }
  }
  while(p.x!=to.x || p.y!=to.y || p.z!=to.z) {
    var dims = ["x", "y", "z"];
    var i = Math.floor(Math.random()*dims.length);
    adjust_to(dims[i]);
  }

  var graph = window.game.ship.graph;
  var start = graph.get_node(from);
  var end = graph.get_node(to);

  path = astar.search(window.game.ship.graph, start, end);

  return path;



}
