
var seventh_root_of_two = Math.pow(2, 1/7);

function init() {
	window.game = new Game();
}

function* iterate_3d(place) {
	for(var i in place) {
		var value = place[i];
		if(value) yield value;
	}
}

function pos_to_index(p) {
	return p.x+","+p.y+","+p.z;
}

function get_3d(place, p) {
	return place[pos_to_index(p)];
}

function set_3d(place, p, thing) {
	place[pos_to_index(p)] = thing;
}

function shuffle_array(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

function create_polygon(color, points) {
	var shape = new createjs.Shape();
	shape.graphics.beginFill(color).moveTo(points[0][0], points[0][1]);

	for(var i = 1; i < points.length; i++) {
		shape.graphics.lineTo(points[i][0], points[i][1]);
	}

	return shape;
}
