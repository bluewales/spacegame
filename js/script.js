
var seventh_root_of_two = Math.pow(2, 1/7);

function* iterate_3d(place) {
	for(var z in place) {
		for(var y in place[z]) {
			for(var x in place[z][y]) {
				if(place[z][y][x]) {
					yield place[z][y][x];
				}
			}
		}
	}
}

function get_3d(place, p) {
	if(place && place[p.z] && place[p.z][p.y] && place[p.z][p.y][p.x]) {
		return place[p.z][p.y][p.x];
	} else {
		return undefined;
	}
}

function set_3d(place, p, thing) {
	if(place[p.z] == undefined) place[p.z] = {};
	if(place[p.z][p.y] === undefined) place[p.z][p.y] = {};
	place[p.z][p.y][p.x] = thing;
}

function init() {
	window.game = new Game();
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
