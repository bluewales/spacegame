
var seventh_root_of_two = Math.pow(2, 1/7);

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
	z_level += 1;
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


class Crew extends createjs.Sprite {
	constructor(sheet, sprite_key, x, y) {
		super(sheet, sprite_key);

		this.x_pos = x;
		this.y_pos = y;

		this.x = this.x_pos * 24;
		this.y = this.y_pos * 24;

		// handle click/tap
		this.on('click', this.handle_click.bind(this));
	}
	handle_click() {
		handle_click();
	}
}

class Wall extends createjs.Sprite {
	constructor(sheet, sprite_key, x, y) {
		super(sheet, sprite_key);

		this.x_pos = x;
		this.y_pos = y;

		this.x = this.x_pos * 24;
		this.y = this.y_pos * 24;

		// handle click/tap
		this.on('click', this.handle_click.bind(this));
	}
	handle_click() {
		handle_click();
	}
}


function init() {

    var width = d3.select("canvas").node().getBoundingClientRect().width;
    var height = d3.select("canvas").node().getBoundingClientRect().height;

    d3.select("canvas")
        .attr("width", width)
        .attr("height", height);

	manifest = [
		{src: "oryx_16bit_scifi_world_trans.png", id: "world"},
		{src: "oryx_16bit_scifi_creatures_trans.png", id: "creatures"}
	];
	loader = new createjs.LoadQueue(false);
	loader.addEventListener("complete", handleComplete);
	loader.loadManifest(manifest, true, "img/");

	document.onkeydown = handleKeyDown;
    document.onkeyup = handleKeyUp;
    document.onmousewheel = handleMouseWheel;
}

var raw_data = {
	"raw_ship" : [
		"╔══╦══╗",
		"║xx║xx║",
		"║xx║xx║",
		"╚═╦╩══╣",
		"..║xxx║",
		"..║xxx║",
		"..╚═══╝"
	],
	"crew" : [
		{
			"sprite": "green",
			"location": {
				"x": 5,
				"y": 2
			}
		},
		{
			"sprite": "blue",
			"location": {
				"x": 4,
				"y": 4
			}
		},
		{
			"sprite": "pony",
			"location": {
				"x": 1,
				"y": 1
			}
		},
		{
			"sprite": "blonde",
			"location": {
				"x": 2,
				"y": 2
			}
		}
	]
};

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
			"pony": [664,665]
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
			"x": [0],
			"═": [8],
			"║": [11],
			"╔": [13],
			"╗": [14],
			"╚": [15],
			"╝": [16],
			"╬": [17],
			"╦": [18],
			"╣": [19],
			"╠": [20],
			"╩": [21],
			".": [34]
		},
		images: [loader.getResult("world")],
		frames: {
			regX: 12,
			regY: 12,
			height: 24,
			width: 24
		}
	});

	var ship = new createjs.Container();

	var raw_ship = raw_data.raw_ship;
	for(var y = 0; y < raw_ship.length; y++) {
		for(var x = 0; x < raw_ship[y].length; x++) {
			var wall = new Wall(structure, raw_ship[y][x], x, y);

			ship.addChild(wall)
		}
	}
	var raw_crew = raw_data.crew;
	for(var i = 0; i < raw_crew.length; i++) {
		var crew = new Crew(creatures, raw_crew[i].sprite, raw_crew[i].location.x, raw_crew[i].location.y);
		console.log("crew " + i)

		ship.addChild(crew);
	}

	var stage = new createjs.Stage(canvas);

	stage.addChild(ship);

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