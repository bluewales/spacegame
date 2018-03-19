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
			var thing = place.d[z];
			if(thing !== undefined) {
				if(place.index < place.iter.length)
					place.iter[place.index] = thing;
				else
					place.iter.push(thing);
				place.index++;
			}
		}
	}

	for(var i = 0; i < place.index; i++) {
		yield place.iter[i];
	}
}

function pos_to_index(p) {
	var dim = p.ori ? p.ori : ",";

	return p.x + dim + p.y + dim + p.z;
}

function get_3d(place, p) {
	var index = pos_to_index(p);
	if(place.d === undefined) return undefined;
	return place.d[index];
}

function set_3d(place, p, thing) {
	var index = pos_to_index(p);
	if(place.d === undefined) place.d = {};
	place.d[index] = thing;
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

function copy_pos(pos) {
	return {"x": pos.x, "y":pos.y, "z":pos.z, "ori":pos.ori};
}

function copy_posses(posses) {
	var result = [];
	for(var i = 0; i < posses.length; i++) {
		result.push(copy_pos( posses[i]));
	}
	return result;
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function getUID(seed) {
	if(!seed) {
		seed = "";
	}
	return seed + "-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
