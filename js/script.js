var seventh_root_of_two = Math.pow(2, 1/7);

function init() {
	window.game = new Game();
}

function* iterate_3d(place) {
	if(place.d === undefined) place.d = {};
	if(place.iter === undefined) {place.iter = []; place.index = 0;}
	if(place.changed) {
		place.index = 0;
		place.changed = false;
		for(var z in place.d) {
			for(var y in place.d[z]) {
				for(var x in place.d[z][y]) {
					var thing = place.d[z][y][x];
					if(thing !== undefined) {
						if(place.index < place.iter.length) place.iter[place.index] = thing;
						else place.iter.push(thing);
						place.index++;
					}
				}
			}
		}
	}

	for(var i = 0; i < place.index; i++) {
		yield place.iter[i];
	}
}

function get_3d(place, p) {
	if(place.d && place.d[p.z] && place.d[p.z][p.y]) {
		return place.d[p.z][p.y][p.x];
	} else {
		return undefined;
	}
}

function set_3d(place, p, thing) {
	if(place.d === undefined) place.d = {};
	if(place.d[p.z] === undefined) place.d[p.z] = {};
	if(place.d[p.z][p.y] === undefined) place.d[p.z][p.y] = {};
	place.d[p.z][p.y][p.x] = thing;
	place.changed = true;
}

function shuffle_array(a) {
    var i, j, x;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
}

function create_polygon(color, points, shape) {
	if(shape === undefined) {
		shape = new createjs.Shape();
	}
	shape.graphics.beginFill(color).moveTo(points[0][0], points[0][1]);

	for(var i = 0; i < points.length; i++) {
		shape.graphics.lineTo(points[i][0], points[i][1]);
	}
	shape.graphics.endFill();

	return shape;
}
