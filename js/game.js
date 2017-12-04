/**
 * Created by Ox The Automaton on 7/1/2017.
 */
 /*jshint esversion: 6 */


class Game {
  constructor() {
    this.width = d3.select("canvas").node().getBoundingClientRect().width;
    this.height = d3.select("canvas").node().getBoundingClientRect().height;

    this.pan_x = 0;
    this.pan_y = 0;
    this.z_level = 1;
    this.zoom = 15;

    d3.select("canvas")
        .attr("width", this.width)
        .attr("height", this.height);

    this.sprites = {
      /* Crew */
      "builder_crew": {
        "sources": [
          "img/sliced/creatures_sliced/images/oryx_16bit_scifi_creatures_1249.png",
          "img/sliced/creatures_sliced/images/oryx_16bit_scifi_creatures_1250.png"
        ]
      },
      "hat_crew": {
        "sources": [
          "img/sliced/creatures_sliced/images/oryx_16bit_scifi_creatures_01.png",
          "img/sliced/creatures_sliced/images/oryx_16bit_scifi_creatures_02.png"
        ]
      },
      "blue_crew": {
        "sources": [
          "img/sliced/creatures_sliced/images/oryx_16bit_scifi_creatures_33.png",
          "img/sliced/creatures_sliced/images/oryx_16bit_scifi_creatures_34.png"
        ]
      },
      "green_crew": {
        "sources": [
          "img/sliced/creatures_sliced/images/oryx_16bit_scifi_creatures_65.png",
          "img/sliced/creatures_sliced/images/oryx_16bit_scifi_creatures_66.png"
        ]
      },
      "blonde_crew": {
        "sources": [
          "img/sliced/creatures_sliced/images/oryx_16bit_scifi_creatures_96.png",
          "img/sliced/creatures_sliced/images/oryx_16bit_scifi_creatures_97.png"
        ]
      },

      /* Structure */
      /* floors */
      "X": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_01.png"]},
      "h": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_106.png"]},

      /* Furniture */
      "crate": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_679.png"]},
      "barrel": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_708.png"]},

      /* Background" */
      "background": {"sources": ["img/mars.jpg"]},

      /* Effects */
      "sparks_1": {
        "sources": [
          "img/sliced/FX_sm_sliced/images/oryx_16bit_scifi_FX_sm_79.png",
          "img/sliced/FX_sm_sliced/images/oryx_16bit_scifi_FX_sm_89.png"
        ]
      },
      "sparks_2": {
        "sources": [
          "img/sliced/FX_sm_sliced/images/oryx_16bit_scifi_FX_sm_80.png",
          "img/sliced/FX_sm_sliced/images/oryx_16bit_scifi_FX_sm_90.png"
        ]
      },
      "sparks_3": {
        "sources": [
          "img/sliced/FX_sm_sliced/images/oryx_16bit_scifi_FX_sm_81.png",
          "img/sliced/FX_sm_sliced/images/oryx_16bit_scifi_FX_sm_91.png"
        ]
      },
      "sparks_4": {
        "sources": [
          "img/sliced/FX_sm_sliced/images/oryx_16bit_scifi_FX_sm_82.png",
          "img/sliced/FX_sm_sliced/images/oryx_16bit_scifi_FX_sm_92.png"
        ]
      },
    };

    this.sources = {
      /* javascript */
      "menu": {"source": "js/menu.js"},
      "d3": {"source": "js/lib/d3.js"},
    	"easel": {"source": "js/lib/easeljs-0.8.2.min.js"},
    	"astar": {"source": "js/lib/astar.js"},
    	"pathfinding": {"source": "js/pathfinding.js"},
      "structure": {"source": "js/structure.js"},
    	"jobs": {"source": "js/jobs.js"},
    	"crew": {"source": "js/crew.js"},
      "wall": {"source": "js/wall.js"},
      "floor": {"source": "js/floor.js"},
      "furniture": {"source": "js/furniture.js"},
    	"ship": {"source": "js/ship.js"},
    	"graph": {"source": "js/graph.js"},
      "construction": {"source": "js/construction.js"},

    };

    this.data = {
      "ship": {"source": "dat/sample_ship6.json"},
      "things": {"source": "dat/things.json"}
    };

    this.manifest = [];

    for(var name in this.sprites) {
      var source = this.sprites[name];
      for(var j = 0; j < source.sources.length; j++) {
        this.manifest.push(
          {src: source.sources[j], id: name + (source.sources.length>0?("_"+j):"")}
        );
      }
    }

    for(var name in this.sources) {
      var source = this.sources[name];
      this.manifest.push({src: source.source, id: name});
    }

    for(var name in this.data) {
      var source = this.data[name];
      this.manifest.push({src: source.source, id: name});
    }

    this.loader = new createjs.LoadQueue(false);
    this.loader.on("complete", this.on_asset_load.bind(this));

    var loading_div = d3.select("body")
      .style("width", this.width + "px")
      .style("height", this.height + "px")
        .append("div")
        .attr("id", "loading")
        .style("color", "black")
        .style("margin", "auto")
        .style("width", "300px")
        .style("height", "50%")

    loading_div.append("h1")
      .style("color", "black")
      .text("Space Game")
      .style("margin", "auto")
      .style("position", "static")
      .style("font-size", "200%")
      .style("padding", "20px");

    loading_div.append("p")
        .style("color", "black")
        .text("Loading")
        .style("margin", "auto");

    loading_div.append("div")
      .attr("id", "loading_box")
      .style("border", "1px solid black")
      .style("width", "300px")
      .style("height", "25px")
        .append("div")
          .attr("id", "loading_bar")
          .style("background-color", "black")
          .style("width", "0px")
          .style("height", "25px");

    this.loader.on("progress", function(event) {
      console.log(Math.round(event.progress*100) + " % loaded");
      d3.select("#loading_bar").style("width", (event.progress*100) + "%");
    });

    this.loader.loadManifest(this.manifest, true, "");

    document.onkeydown = this.handleKeyDown.bind(this);
    document.onkeyup = this.handleKeyUp.bind(this);
    document.onmousewheel = this.handleMouseWheel.bind(this);

    this.currentlyPressedKeys = {};
  }

  on_asset_load(event) {
  	console.log("handleComplete");

  	this.canvas = document.getElementById("easel");

    d3.select("body").style("background-image", "url('img/mars.jpg')");
    d3.select("#loading").remove();

    for(var name in this.sprites) {
      var source = this.sprites[name];
      var sprite_obj = {
        framerate: 2,
        images: [],
    		frames: {regX: 0, regY: 0, height: 24, width: 24},
        animations:{}
      }
      for(var j = 0; j < source.sources.length; j++) {
        sprite_obj.images.push(event.target.getResult(name + (source.sources.length>0?("_"+j):"")));
        if(sprite_obj.animations[name])
          sprite_obj.animations[name].push(j);
        else
          sprite_obj.animations[name] = [j];
      }
      source.sprite = new createjs.SpriteSheet(sprite_obj);
    }

    this.things = event.target.getResult("things");

  	var raw_ship = event.target.getResult("ship");
  	this.ship = new Ship(this.sprites, raw_ship);

  	this.ship.set_display_level(this.z_level);


    var ctx = this.canvas.getContext('2d');
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;


  	this.stage = new createjs.Stage(this.canvas);
  	this.stage.addChild(this.ship);

    d3.select("#easel").on("click",function(){window.game.handle_click(this);});

    this.jobs = new Jobs();

    this.jobs.create_job(new Patrol([
      {"x":2,"y":2,"z":-1},
      {"x":1,"y":1,"z":0}
    ]));
    this.jobs.create_job(new Patrol([
      {"x":0,"y":0,"z":0},
      {"x":2,"y":0,"z":-1}
    ]));

  	createjs.Ticker.setFPS(32);
  	createjs.Ticker.on("tick", this.tick.bind(this));

    this.z_menu = new Menu(
      [{"name":"z-level: " + this.z_level,"info":true}],
      d3.select("#menus"),
      this.width - 100,
      this.height - 25
    );

    this.re_center();
  }

  tick(event) {
    var ctx = this.canvas.getContext('2d');
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    var new_width = this.canvas.getBoundingClientRect().width;
    var new_height = this.canvas.getBoundingClientRect().height;
    if(new_width != this.width || new_height != this.height) {
      this.width = new_width;
      this.height = new_height;

      d3.select("canvas")
          .attr("width", this.width)
          .attr("height", this.height);

      this.z_menu.ul
        .style("left", this.width - 100 + "px")
        .style("top", this.height - 25 + "px");
    }

    var centerX = this.canvas.width/2;
    var centerY = this.canvas.height/2;

    var real_zoom_multiplier = Math.pow(seventh_root_of_two, this.zoom);
    this.stage.scaleX = real_zoom_multiplier;
    this.stage.scaleY = real_zoom_multiplier;

    this.stage.x = centerX + this.pan_x * real_zoom_multiplier;
    this.stage.y = centerY + this.pan_y * real_zoom_multiplier;


    this.stage.update(event);

    if(this.currentlyPressedKeys[65]) this.pan(-5, 0);
    if(this.currentlyPressedKeys[68]) this.pan(5, 0);
    if(this.currentlyPressedKeys[83]) this.pan(0, 5);
    if(this.currentlyPressedKeys[87]) this.pan(0, -5);

    var iter = iterate_3d(this.ship.crew);
    while(true) {
      var crew_member = iter.next();
      if(crew_member.done) break;
      crew_member.value.tick(event, this);
    }
  }

  re_center() {
    this.change_z(-this.z_level);
    this.change_zoom(-this.zoom + 10);

    var mid_x = (this.ship.graph.max_bound.x + this.ship.graph.min_bound.x) / 2 + 1;
    var mid_y = (this.ship.graph.max_bound.y + this.ship.graph.min_bound.y) / 2 + 1;

    this.pan_x = -(this.ship.grid_width + this.ship.padding*2) * mid_x;
    this.pan_y = -(this.ship.grid_width + this.ship.padding*2) * mid_y;

    this.clear_highlight();
  }


  change_z(dz) {
  	this.z_level += dz;
  	this.ship.set_display_level(this.z_level);
    this.z_menu.lines.text("z-level: " + this.z_level);
    if(this.highlighted_square) this.clear_highlight();
  }

  change_zoom(delta_zoom) {
  	this.zoom += delta_zoom;
  }

  pan(dx, dy) {
    var pan_ratio = Math.sqrt(Math.pow(seventh_root_of_two, this.zoom));
  	this.pan_x += dx/pan_ratio;
  	this.pan_y += dy/pan_ratio;
  }
  highlight_square(pos) {
    if(this.highlighted_square) this.clear_highlight();
    this.highlighted_square = pos;
    this.ship.draw_highlight(pos);
  }
  clear_highlight() {
    this.highlighted_square = null;
    this.ship.clear_highlight();
    if(this.active_menu) this.active_menu.destroy();
    this.active_menu = false;
  }
  handleKeyDown(event) {
    this.currentlyPressedKeys[event.keyCode] = true;

    if(event.keyCode == 69) this.change_z(-1); // e key
    if(event.keyCode == 81) this.change_z(1); // q key
    if(event.keyCode == 32) this.re_center(); // space bar
  }
  handleKeyUp(event) {
    this.currentlyPressedKeys[event.keyCode] = false;
  }
  handleMouseWheel(event) {
    this.change_zoom(event.deltaY / 100);
  }
  handle_click(event) {
    var raw = d3.mouse(event);
    var centerX = this.canvas.width/2;
    var centerY = this.canvas.height/2;
    var real_zoom_multiplier = Math.pow(seventh_root_of_two, this.zoom);
    var grid = this.ship.grid_width + (this.ship.padding*2);
    var pos = {
      "x":Math.floor((raw[0]-centerX-this.pan_x*real_zoom_multiplier)/(grid*real_zoom_multiplier)),
      "y":Math.floor((raw[1]-centerY-this.pan_y*real_zoom_multiplier)/(grid*real_zoom_multiplier)),
      "z":this.z_level
    }
    if(this.highlighted_square
      && this.highlighted_square.x == pos.x
      && this.highlighted_square.y == pos.y
      && this.highlighted_square.z == pos.z) {
      this.clear_highlight();
    } else {
      this.highlight_square(pos);

      var menu_tree = this.ship.get_menu_tree_at(pos);

      var construction_menu = {
        "name":"construction",
        "list":this.ship.get_construction_menu_list(pos)
      };
      if(construction_menu.list.length > 0) {
        menu_tree.push(construction_menu);
      }

      if(menu_tree.length == 0) {
        menu_tree.push({"name":"empty space", "info":true});
      }

      this.active_menu = new Menu(menu_tree, d3.select("#menus"),raw[0]+1, raw[1]+1);
    }
  }
}
