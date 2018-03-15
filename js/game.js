/**
 * Created by Ox The Automaton on 7/1/2017.
 */
 /*jshint esversion: 6 */



class Game {
  constructor() {
    this.width = d3.select("canvas").node().getBoundingClientRect().width - 1;
    this.height = d3.select("canvas").node().getBoundingClientRect().height - 1;

    this.pan_x = 0;
    this.pan_y = 0;
    this.z_level = 1;
    this.zoom = 16;

    this.index = {};

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
      },/*
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
      },*/

      /* Structure */
      /* Floors */
      "floor_plate": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_01.png"]},

      /* Furniture */
      "crate": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_679.png"]},
      "barrel": {"sources": ["img/sliced/world_sliced/images/oryx_16bit_scifi_world_708.png"]},

      /* Background */
      "background": {"sources": ["img/mars.jpg"]},

      /* Items */
      "steel_sprite": {"sources": ["img/items/steel-plate.png"]},

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

      /* UI */
      "pinned": {"sources": ["img/ui/pinned.png"]},
      "un_pinned": {"sources": ["img/ui/un_pinned.png"]},
    };

    this.sources = {
      /* javascript */
      "api": {"source": "js/api.js"},
      "astar": {"source": "js/lib/astar.js"},
      "easel": {"source": "js/lib/easeljs-0.8.2.min.js"},
      "structure": {"source": "js/structure/structure.js"},
      "furniture": {"source": "js/structure/furniture/furniture.js"},
      "barrel": {"source": "js/structure/furniture/barrel.js"},
      "bottom_bar": {"source": "js/ui/bottom_bar.js"},
      "card": {"source": "js/ui/cards/card.js"},
      "build_card": {"source": "js/ui/cards/build_card.js"},
      "button": {"source": "js/ui/button.js"},
      "card_frame": {"source": "js/ui/cards/card_frame.js"},
      "card_table": {"source": "js/ui/card_table.js"},
      "jobs": {"source": "js/jobs.js"},
      "construction": {"source": "js/construction.js"},
      "controls_card": {"source": "js/ui/cards/controls_card.js"},
      "crate": {"source": "js/structure/furniture/crate.js"},
      "crew": {"source": "js/crew.js"},
      "d3": {"source": "js/lib/d3.js"},
      "wall": {"source": "js/structure/walls/wall.js"},
      "door": {"source": "js/structure/walls/door.js"},
      "floor": {"source": "js/structure/floors/floor.js"},
      "floor_plate": {"source": "js/structure/floors/floor_plate.js"},
      "graph": {"source": "js/graph.js"},
      "hatch": {"source": "js/structure/floors/hatch.js"},
      "hud": {"source": "js/ui/hud.js"},
      "palettes": {"source": "js/palettes.js"},
    	"pathfinding": {"source": "js/pathfinding.js"},
      "prompt": {"source": "js/ui/prompt.js"},
      "rooms": {"source": "js/rooms.js"},
      "ship": {"source": "js/ship.js"},
      "top_bar": {"source": "js/ui/top_bar.js"},
      "wall_panel": {"source": "js/structure/walls/wall_panel.js"},
      "ui_level": {"source": "js/ui/level.js"},
      "item": {"source": "js/items/item.js"},
      "steel": {"source": "js/items/steel.js"},
      "serialization": {"source": "js/serialization.js"},
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
      this.manifest.push({src: source.source + "?a=" + Math.random(), id: name});
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
        .style("height", "50%");

    loading_div.append("h1")
      .style("color", "black")
      .text("Safiina")
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

    this.loader.on("progress", (function(event) {
      console.log(Math.round(event.progress*100) + " % loaded");
      d3.select("#loading_bar").style("width", (event.progress*100) + "%");
    }).bind(this));

    this.loader.loadManifest(this.manifest, true, "");

    this.currentlyPressedKeys = {};
  }



  on_asset_load() {
    this.api = new API();

    this.api.download_save_state((function(game_state){
      this.game_state=game_state;
      this.start_game();
    }).bind(this));
  }

  start_game() {
  	this.canvas = document.getElementById("easel");

    var ctx = this.canvas.getContext('2d');
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;



    for(var name in this.sprites) {
      var source = this.sprites[name];
      var sprite_obj = {
        framerate: 2,
        images: [],
    		frames: {regX: 0, regY: 0, height: 24, width: 24},
        animations:{}
      }
      for(var j = 0; j < source.sources.length; j++) {
        sprite_obj.images.push(this.loader.getResult(name + (source.sources.length>0?("_"+j):"")));
        if(sprite_obj.animations[name])
          sprite_obj.animations[name].push(j);
        else
          sprite_obj.animations[name] = [j];
      }
      source.sprite = new createjs.SpriteSheet(sprite_obj);
    }

  	this.ship = deserialize(this.game_state);

  	this.ship.set_display_level(this.z_level);


    this.ui_level = new UILevel(this.z_level);



    this.bg_img = document.createElement("img");
    this.bg_img.src = "img/mars.jpg";
    this.background = new createjs.Shape();
    this.background.graphics
      .beginBitmapFill(this.bg_img, "repeat")
      .drawRect(0,0,this.width,this.height);





    this.space = new createjs.Container();
    this.space.addChild(this.ship);
    this.space.on("click", this.handle_click.bind(this));

    this.card_table = new CardTable();

    this.hud = new HUD();
    this.hud.addChild(this.ui_level);
    this.hud.on("click", function(evt){}.bind(this));

    this.stage = new createjs.Stage(this.canvas);
    this.stage.addChild(this.background);
  	this.stage.addChild(this.space);
    this.stage.addChild(this.hud);
    this.stage.addChild(this.card_table);







  	createjs.Ticker.setFPS(32);
  	createjs.Ticker.on("tick", this.tick.bind(this));



    this.re_center();

    this.now = Date.now()/1000;
    this.last_save = this.now;

    // setup inputs

    this.space.on("click", this.handle_click.bind(this));
    this.background.on("click", this.handle_click.bind(this));

    document.onkeydown = this.handleKeyDown.bind(this);
    document.onkeyup = this.handleKeyUp.bind(this);
    document.onmousewheel = this.handleMouseWheel.bind(this);

    console.log(this.stage);
  }


  tick(event) {
    this.now = Date.now()/1000;

    this.crew_ticks = 0;

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

      this.background.graphics
        .clear()
        .beginBitmapFill(this.bg_img, "repeat")
        .drawRect(0,0,this.width,this.height);

        this.hud.tick(this.width, this.height);
        this.card_table.tick(this.width, this.height);
    }

    var centerX = this.canvas.width/2;
    var centerY = this.canvas.height/2;

    var real_zoom_multiplier = Math.pow(seventh_root_of_two, this.zoom);
    this.ship.scaleX = real_zoom_multiplier;
    this.ship.scaleY = real_zoom_multiplier;

    this.ship.x = centerX + this.pan_x * real_zoom_multiplier;
    this.ship.y = centerY + this.pan_y * real_zoom_multiplier;

    if(this.currentlyPressedKeys[65]) this.pan(-5, 0);
    if(this.currentlyPressedKeys[68]) this.pan(5, 0);
    if(this.currentlyPressedKeys[83]) this.pan(0, 5);
    if(this.currentlyPressedKeys[87]) this.pan(0, -5);

    this.ship.tick(event);


    this.stage.update(event);

    if(this.now - this.last_save > 5 * 60) {
      this.last_save = this.now;
      this.save();
    }

    if(this.cell_cursor || this.wall_cursor) {
      var mouse_hits_ui = this.hud.hitTest(this.stage.mouseX, this.stage.mouseY) || this.card_table.hitTest(this.stage.mouseX, this.stage.mouseY);

      if(mouse_hits_ui) {
        this.clear_highlight();
      } else {
        if(this.cell_cursor) {
          var pos = this.pos_from_coord(this.stage.mouseX, this.stage.mouseY);
          this.highlight_square(pos);
        }
        if(this.wall_cursor) {
          var pos = this.wall_pos_from_coord(this.stage.mouseX, this.stage.mouseY);
          this.highlight_square(pos);
        }
      }
    }
  }

  re_center() {
    this.change_z(-this.z_level);
    this.change_zoom(-this.zoom + 10);

    var mid_x = (this.ship.graph.max_bound.x + this.ship.graph.min_bound.x+1) / 2;
    var mid_y = (this.ship.graph.max_bound.y + this.ship.graph.min_bound.y+1) / 2;

    this.pan_x = -(this.ship.grid_width + this.ship.padding*2) * mid_x;
    this.pan_y = -(this.ship.grid_width + this.ship.padding*2) * mid_y;

    this.clear_highlight();
  }


  change_z(dz) {
  	this.z_level += dz;
  	this.ship.set_display_level(this.z_level);
    this.ui_level.set_level(this.z_level);
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
  clear_highlight(clear_focus=true) {
    this.highlighted_square = null;
    this.ship.clear_highlight();
    if(clear_focus) {
      this.card_table.focus(undefined);
    }
  }

  handleKeyDown(event) {
    this.currentlyPressedKeys[event.keyCode] = true;

    if(event.keyCode == 69) this.change_z(1); // e key
    if(event.keyCode == 81) this.change_z(-1); // q key
    if(event.keyCode == 32) this.re_center(); // space bar
  }
  handleKeyUp(event) {
    this.currentlyPressedKeys[event.keyCode] = false;
  }
  handleMouseWheel(event) {
    this.change_zoom(event.deltaY / 100);
  }
  handle_click(event) {
    var pos = this.pos_from_coord(event.stageX, event.stageY);
    var wall_pos = this.wall_pos_from_coord(event.stageX, event.stageY);

    if(this.cell_cursor) {
      this.cell_cursor(pos);
    }
    if(this.wall_cursor) {
      this.wall_cursor(wall_pos);
    }
  }

  pos_from_coord(stageX, stageY) {
    var centerX = this.canvas.width / 2;
    var centerY = this.canvas.height / 2;
    var real_zoom_multiplier = Math.pow(seventh_root_of_two, this.zoom);
    var grid = this.ship.grid_width + (this.ship.padding*2);
    var x = Math.floor((stageX-centerX-this.pan_x*real_zoom_multiplier)/(grid*real_zoom_multiplier));
    var y = Math.floor((stageY-centerY-this.pan_y*real_zoom_multiplier)/(grid*real_zoom_multiplier));
    var pos = {
      "x": x,
      "y": y,
      "z": this.z_level
    };
    return pos;
  }

  wall_pos_from_coord(stageX, stageY) {
    var centerX = this.canvas.width / 2;
    var centerY = this.canvas.height / 2;
    var real_zoom_multiplier = Math.pow(seventh_root_of_two, this.zoom);
    var grid = this.ship.grid_width + (this.ship.padding*2);
    var x = (stageX - centerX - this.pan_x*real_zoom_multiplier) / (grid*real_zoom_multiplier);
    var y = (stageY - centerY - this.pan_y*real_zoom_multiplier) / (grid*real_zoom_multiplier);
    var px = x % 1 + (x < 0?1:0);
    var py = y % 1 + (y < 0?1:0);

    var step_back = 1-px > py;
    var ori = "-";
    if(px > py) {
      if(step_back) {
        y -= 1;
        ori = "-";
      } else {
        ori = "|";
      }
    } else {
      if(step_back) {
        x -= 1;
        ori = "|";
      } else {
        ori = "-";
      }
    }
    var pos = {
      "x": Math.floor(x),
      "y": Math.floor(y),
      "z": this.z_level,
      "ori": ori
    };
    return pos;
  }

  save() {
    this.game_state = serialize(this.ship);
    console.log(this.game_state);
    this.api.upload_save_state(this.game_state);
  }
}
