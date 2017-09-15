/**
 * Created by Ox The Automaton on 7/1/2017.
 */
 /*jshint esversion: 6 */


class Game {
  constructor() {
    var width = d3.select("canvas").node().getBoundingClientRect().width;
    var height = d3.select("canvas").node().getBoundingClientRect().height;

    this.pan_x = 0;
    this.pan_y = 0;
    this.z_level = 1;
    this.zoom = 0;

    d3.select("canvas")
        .attr("width", width)
        .attr("height", height);

    this.manifest = [
      {src: "img/oryx_16bit_scifi_world_trans.png", id: "world"},
      {src: "img/oryx_16bit_scifi_creatures_trans.png", id: "creatures"},
      {src: "dat/sample_ship3.json", id: "ship"}
    ];
    this.loader = new createjs.LoadQueue(false);
    this.loader.addEventListener("complete", this.on_asset_load.bind(this));
    this.loader.loadManifest(this.manifest, true, "");

    document.onkeydown = this.handleKeyDown.bind(this);
    document.onkeyup = this.handleKeyUp.bind(this);
    document.onmousewheel = this.handleMouseWheel.bind(this);

    this.currentlyPressedKeys = {};
  }

  on_asset_load(event) {
  	console.log("handleComplete");

  	this.canvas = document.getElementById("easel");

  	var creatures = new createjs.SpriteSheet({
  		framerate: 2,
  		animations:{
  			"hat": [0,1],
  			"blue": [32,33],
  			"green": [64,65],
  			"blonde": [96,97],
  			"pony": [664,665],
  			"constructor": [1248,1249],
  		},
  		images: [event.target.getResult("creatures")],
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
  		images: [event.target.getResult("world")],
  		frames: {
  			regX: 12,
  			regY: 12,
  			height: 24,
  			width: 24
  		}
  	});


  	var raw_ship = event.target.getResult("ship");
  	this.ship = new Ship(structure, creatures, raw_ship);

  	var min_level = d3.min(d3.keys(raw_ship.structure.walls).concat(d3.keys(raw_ship.structure.floors)), function(d) {return d*1;});
  	var max_level = d3.max(d3.keys(raw_ship.structure.walls).concat(d3.keys(raw_ship.structure.floors)), function(d) {return d*1;});

  	var floors = raw_ship.structure.floors;
    for(var z = min_level; z <= max_level; z++) {
      var x, y;
    	if(z in floors) {
    		for(y = 0; y < floors[z].length; y++) {
    			for(x = 0; x < floors[z][y].length; x++) {
    				var floor_key = floors[z][y][x];
    				this.ship.add_floor_at({"x":x, "y":y, "z":z}, floor_key);
    			}
    		}
    	}

    	var walls = raw_ship.structure.walls;
    	if(z in walls) {
    		for(y = 0; y < walls[z].length; y++) {
    			for(x = 0; x < walls[z][y].length; x++) {
    				var wall_key = walls[z][y][x];
    				this.ship.add_wall_at({"x":x, "y":y, "z":z}, wall_key);
    			}
    		}
    	}
    }

  	var crew = raw_ship.crew;
  	for(var i = 0; i < crew.length; i++) {
  		this.ship.add_crew_member(crew[i]);
  	}

  	this.ship.set_display_level(this.z_level);

  	this.stage = new createjs.Stage(this.canvas);
  	this.stage.addChild(this.ship);

    this.jobs = new Jobs();

    this.jobs.create_job(new Patrol([
      {"x":1,"y":1,"z":1},
      {"x":2,"y":2,"z":1}
    ]));
    this.jobs.create_job(new Patrol([
      {"x":1,"y":1,"z":0},
      {"x":5,"y":5,"z":0}
    ]));

  	console.log(this.stage);

  	this.ship.scaleX = 1;
  	this.ship.scaleY = 1;

  	createjs.Ticker.setFPS(32);
  	createjs.Ticker.on("tick", this.tick.bind(this));
  }

  tick(event) {
    var width = this.canvas.getBoundingClientRect().width;
    var height = this.canvas.getBoundingClientRect().height;

    d3.select("canvas")
        .attr("width", width)
        .attr("height", height);

    var centerX = this.canvas.width/2;
  	var centerY = this.canvas.height/2;

    this.stage.x = centerX + this.pan_x;
    this.stage.y = centerY + this.pan_y;

    var real_zoom_multiplier = Math.pow(seventh_root_of_two, this.zoom);
    this.stage.scaleX = real_zoom_multiplier;
    this.stage.scaleY = real_zoom_multiplier;

    this.stage.update(event);

    if(this.currentlyPressedKeys[65]) {
        this.pan(-5, 0);
    }
    if(this.currentlyPressedKeys[68]) {
        this.pan(5, 0);
    }
    if(this.currentlyPressedKeys[83]) {
        this.pan(0, 5);
    }
    if(this.currentlyPressedKeys[87]) {
        this.pan(0, -5);
    }

    var iter = iterate_3d(this.ship.crew);
    while(true) {
      var crew_member = iter.next();
      if(crew_member.done) break;
      crew_member.value.tick(event, this);
    }
  }


  change_z(dz) {
  	this.z_level += dz;
  	this.ship.set_display_level(this.z_level);
  	console.log("z_level " + this.z_level);
  }

  change_zoom(delta_zoom) {
  	this.zoom += delta_zoom;
  }

  pan(dx, dy) {
  	this.pan_x += dx;
  	this.pan_y += dy;
  }
  handleKeyDown(event) {
      this.currentlyPressedKeys[event.keyCode] = true;

      if(event.keyCode == 69) this.change_z(1);
      if(event.keyCode == 81) this.change_z(-1);
  }
  handleKeyUp(event) {
      this.currentlyPressedKeys[event.keyCode] = false;
  }
  handleMouseWheel(event) {
      this.change_zoom(event.deltaY / 100);
  }
  handle_click(event, object) {
  	console.log("clicked");
  }
}
