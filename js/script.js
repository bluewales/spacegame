
var seventh_root_of_two = Math.pow(2, 1/7);

var ship;

var pan_x = 0;
var pan_y = 0;
var z_level = 1;
var zoom = 0;

function pan(dx, dy) {
	pan_x += dx;
	pan_y += dy;

	console.log(dx + " " + dy);
}

function change_z(dz) {
	z_level += dz;
	ship.set_display_level(z_level);
	console.log("z_level " + z_level);
}

function change_zoom(delta_zoom) {
	zoom += delta_zoom;
}

var currentlyPressedKeys = {};

function handleKeyDown(event) {
    currentlyPressedKeys[event.keyCode] = true;

    if(event.keyCode == 69) {
        change_z(1)
    }
    if(event.keyCode == 81) {
        change_z(-1)
    }
}

function handleKeyUp(event) {
    currentlyPressedKeys[event.keyCode] = false;
}
function handleMouseWheel(event) {
    change_zoom(event.deltaY / 100);
}




function init() {

    var width = d3.select("canvas").node().getBoundingClientRect().width;
    var height = d3.select("canvas").node().getBoundingClientRect().height;

    d3.select("canvas")
        .attr("width", width)
        .attr("height", height);

	manifest = [
		{src: "img/oryx_16bit_scifi_world_trans.png", id: "world"},
		{src: "img/oryx_16bit_scifi_creatures_trans.png", id: "creatures"},
		{src: "dat/sample_ship3.json", id: "ship"}
	];
	loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", handleComplete);
	loader.loadManifest(manifest, true, "");

	document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    document.onmousewheel = handleMouseWheel;
}

function handleComplete() {
	console.log("handleComplete");

	var canvas = document.getElementById("easel");

	var graphics = new createjs.Graphics();

	var SIZE = 100;
	var centerX = canvas.width/2;
	var centerY = canvas.height/2;
	var rotation = 0;

	var creatures = new createjs.SpriteSheet({
		framerate: 2,
		animations:{
			"hat": [0,1],
			"blue": [32,33],
			"green": [64,65],
			"blonde": [96,97],
			"pony": [656,657],
			"constructor": [1248,1249],
		},
		images: [loader.getResult("creatures")],
		frames: {
			regX: 12,
			regY: 12,
			height: 24,
			width: 24
		}
	});


	var structure = new createjs.SpriteSheet({
		animations:{
			"X": [0],
			"o": [6],
			"c": [7],
			"═": [8],
			"ↄ": [9],
			"n": [10],
			"║": [11],
			"u": [12],
			"╔": [13],
			"╗": [14],
			"╚": [15],
			"╝": [16],
			"╬": [17],
			"╦": [18],
			"╣": [19],
			"╠": [20],
			"╩": [21],
			".": [34],
			" ": [34]

		},
		images: [loader.getResult("world")],
		frames: {
			regX: 12,
			regY: 12,
			height: 24,
			width: 24
		}
	});


	var raw_ship = loader.getResult("ship");
	ship = new Ship(structure, creatures, raw_ship);

	var min_level = d3.min(d3.keys(raw_ship.structure.walls).concat(d3.keys(raw_ship.structure.floors)), function(d) {return d*1;});
	var max_level = d3.max(d3.keys(raw_ship.structure.walls).concat(d3.keys(raw_ship.structure.floors)), function(d) {return d*1;});

	var floors = raw_ship.structure.floors;
	for(var z = min_level; z <= max_level; z++) {
		if(z in floors) {
			for(var y = 0; y < floors[z].length; y++) {
				for(var x = 0; x < floors[z][y].length; x++) {
					var floor_key = floors[z][y][x];
					ship.add_floor_at(x, y, z, floor_key);
				}
			}
		}

		var walls = raw_ship.structure.walls;
		if(z in walls) {
			for(var y = 0; y < walls[z].length; y++) {
				for(var x = 0; x < walls[z][y].length; x++) {
					var wall_key = walls[z][y][x];
					ship.add_wall_at(x, y, z, wall_key);
				}
			}
		}
	}

	var crew = raw_ship.crew;
	for(var i = 0; i < crew.length; i++) {
		ship.add_crew_member(crew[i]);
	}

	ship.set_display_level(z_level);

	var stage = new createjs.Stage(canvas);
	stage.addChild(ship);

	console.log(stage);

	ship.scaleX = 1;
	ship.scaleY = 1;

	createjs.Ticker.setFPS(30);
	createjs.Ticker.on("tick", function(event) {

		var width = canvas.getBoundingClientRect().width;
	    var height = canvas.getBoundingClientRect().height;

	    d3.select("canvas")
	        .attr("width", width)
	        .attr("height", height);

	    stage.x = centerX + pan_x;
	    stage.y = centerY + pan_y;

	    var real_zoom_multiplier = Math.pow(seventh_root_of_two, zoom);
	    stage.scaleX = real_zoom_multiplier;
	    stage.scaleY = real_zoom_multiplier;

        stage.update(event);

	    if(currentlyPressedKeys[65]) {
	        pan(-5, 0);
	    }
	    if(currentlyPressedKeys[68]) {
	        pan(5, 0);
    	}
    	if(currentlyPressedKeys[83]) {
	        pan(0, 5);
	    }
	    if(currentlyPressedKeys[87]) {
	        pan(0, -5);
	    }
	});
}

function handle_click() {
	console.log("clicked")
}
