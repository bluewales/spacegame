/**
 * Created by Ox The Automaton on 7/1/2017.
 */
 /*jshint esversion: 6 */


class Game {
  constructor() {
    this.width = d3.select("canvas").node().getBoundingClientRect().width;
    this.height = d3.select("canvas").node().getBoundingClientRect().height;

    this.pan_x = -130;
    this.pan_y = -130;
    this.z_level = 1;
    this.zoom = 7;

    d3.select("canvas")
        .attr("width", this.width)
        .attr("height", this.height);

    this.sprites = {
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
      "blonde_crew": {
        "sources": [
          "img/sliced/creatures_sliced/images/oryx_16bit_scifi_creatures_664.png",
          "img/sliced/creatures_sliced/images/oryx_16bit_scifi_creatures_665.png"
        ]
      },

      /* Structure */
      /* floors */
      "X": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_01.png"]},
      "h": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_106.png"]},
      /* walls */
      "o": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_07.png"]},
      "c": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_08.png"]},
      "═": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_09.png"]},
      "ↄ": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_10.png"]},
      "n": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_11.png"]},
      "║": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_12.png"]},
      "u": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_13.png"]},
      "╔": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_14.png"]},
      "╗": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_15.png"]},
      "╚": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_16.png"]},
      "╝": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_17.png"]},
      "╬": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_18.png"]},
      "╦": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_19.png"]},
      "╣": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_20.png"]},
      "╠": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_21.png"]},
      "╩": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_22.png"]},

      /* Furniture */
      "crate": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_679.png"]},
      "barrel": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_708.png"]},

      /* Background" */
      "background": {"sources": ["img/mars.jpg"]},

      /* javascript */
      "menu": {"sources": ["js/menu.js"]},
      "d3": {"sources": ["js/lib/d3.js"]},
    	"easel": {"sources": ["js/lib/easel.js"]},
    	"astar": {"sources": ["js/lib/astar.js"]},
    	"pathfinding": {"sources": ["js/pathfinding.js"]},
    	"jobs": {"sources": ["js/jobs.js"]},
    	"crew": {"sources": ["js/crew.js"]},
    	"ship": {"sources": ["js/ship.js"]},
    	"graph": {"sources": ["js/graph.js"]},
    };

    this.manifest = [
      {src: "dat/sample_ship5.json", id: "ship"}
    ];

    for(var name in this.sprites) {
      var source = this.sprites[name];
      for(var j = 0; j < source.sources.length; j++) {
        this.manifest.push({src: source.sources[j], id: name + (source.sources.length>0?j:"")});
      }
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
          .style("height", "25px")

    this.loader.on("progress", function(event) {
      console.log(Math.round(event.progress*100) + " % loaded");
      d3.select("#loading_bar")
        .style("width", (event.progress*100) + "%")
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

    d3.select("body")
      .style("background-image", "url('img/mars.jpg')");
    d3.select("#loading")
      .remove();

    for(var name in this.sprites) {
      var source = this.sprites[name];
      var sprite_obj = {
        framerate: 2,
        images: [],
    		frames: {regX: 0, regY: 0, height: 24, width: 24},
        animations:{}
      }
      for(var j = 0; j < source.sources.length; j++) {
        sprite_obj.images.push(event.target.getResult(name + j));
        if(sprite_obj.animations[name])
          sprite_obj.animations[name].push(j);
        else
          sprite_obj.animations[name] = [j];
      }
      source.sprite = new createjs.SpriteSheet(sprite_obj);
    }



  	var raw_ship = event.target.getResult("ship");
  	this.ship = new Ship(this.sprites, raw_ship);



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
      {"x":3,"y":3,"z":1}
    ]));

  	console.log(this.stage);

  	this.ship.scaleX = 1;
  	this.ship.scaleY = 1;

  	createjs.Ticker.setFPS(32);
  	createjs.Ticker.on("tick", this.tick.bind(this));

    this.z_menu = new Menu([{"name":"z-level: " + this.z_level,"info":true}], d3.select("#menus"), this.width - 100, this.height - 25);
  }

  tick(event) {

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
        .style("top", this.height - 25 + "px")
    }

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
    this.z_menu.lines.text("z-level: " + this.z_level);
    if(this.highlighted_square) this.clear_highlight();
  }

  change_zoom(delta_zoom) {
  	this.zoom += delta_zoom;
  }

  pan(dx, dy) {
  	this.pan_x += dx;
  	this.pan_y += dy;
  }
  highlight_square(pos) {
    if(this.highlighted_square) this.clear_highlight();
    this.highlighted_square = pos;
    this.ship.draw_highlight(pos);
  }
  clear_highlight() {
    this.highlighted_square = null;
    this.ship.clear_highlight();
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
    console.log(object.pos.x + " " + object.pos.y + " " + object.pos.z);
    if(this.active_menu) this.active_menu.destroy();
    this.active_menu = false;
    if(this.highlighted_square) {
      this.clear_highlight();
    } else if(this.z_level == object.pos.z) {
      this.highlight_square(object.pos);
      var menu_tree = [
        {"name":object.name, "info":true}
      ];
      var structure = {
        "name":"structure",
        "list":[

        ]
      };

      var build = {
        "name":"build",
        "list":[

        ]
      };

      structure.list.push(build);

      var floor = get_3d(this.ship.floors, object.pos);
      console.log(floor);
      if(floor) {

      }

      menu_tree.push(structure);


      this.active_menu = new Menu(menu_tree,
        d3.select("#menus"),
        event.rawX+1, event.rawY+1);
      console.log(event);
    }
  }
}
