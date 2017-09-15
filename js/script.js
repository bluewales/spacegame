
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


function init() {

	window.game = new Game();
}
