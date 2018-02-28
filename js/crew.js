"use strict";
/**
 * Created by Luke on 7/18/2017.
 */

function p_to_s(p) {
  return "(" + p.x + "," + p.y + "," + p.z + ")";
}

class Crew extends createjs.Container {
	constructor(ship, raw) {
		super();


    this.addChild(new createjs.Sprite(ship.sprites[raw.sprite].sprite, raw.sprite));

    this.ship = ship;
    this.raw = raw;
    this.pos = raw.pos;
    this.sprite = raw.sprite;

    this.x = this.ship.position_transform(this.pos.x);
		this.y = this.ship.position_transform(this.pos.y);

    this.path_progress = 0;
    this.path = false;
    this.cooldown = 0;
    this.speed = 1;

    this.name = raw.name;

		// handle click
		this.on('click', this.handle_click.bind(this));
	}
  move_towards(target) {
    //console.log(p_to_s(this.pos) + " move toward " + p_to_s(target));
    this.path = get_path(this.pos, target);
    if(this.path.length == 0) {
      this.clear_path();
      console.log("Path failed, we probably need to cancel this job. " + p_to_s(target));
    }
  }
  tick(event) {
    if(this.cooldown > 0) {
      this.cooldown -= 1;
    } else if(this.path) {
      var c = this.pos;
      var t = this.path[this.path_progress];
      var distance = Math.abs(c.x-t.x) + Math.abs(c.y-t.y) + Math.abs(c.z-t.z);
      var path_weight = passable(c, t);
      if(distance == 0) {
        this.path_progress += 1;
        if(this.path_progress == this.path.length) {
          this.clear_path();
        }
      } else if(distance == 1 && path_weight > 0) {
          this.ship.change_position_crew(this, t);
          this.pos = t;
          this.cooldown = 30 * path_weight;
          this.speed = 1 / path_weight;
      } else {
        console.log("Cancel path " + distance + " " + passable(c, t));
        this.clear_path();
      }
    } else if(this.current_job) {
      if(this.current_job.work(this)) {
        this.current_job.complete();
        this.current_job = false;
      }
    } else {
      this.current_job = window.game.jobs.get_job(this);
    }

    var dx = this.ship.position_transform(this.pos.x) - this.x;
    var dy = this.ship.position_transform(this.pos.y) - this.y;
    if(Math.abs(dx) > this.speed) {
      this.x += this.speed * dx / Math.abs(dx);
    } else {
      this.x = this.ship.position_transform(this.pos.x);
    }
    if(Math.abs(dy) > this.speed) {
      this.y += this.speed * dy / Math.abs(dy);
    } else {
  		this.y = this.ship.position_transform(this.pos.y);
    }
  }
  clear_path() {
    this.path = false;
    this.path_progress = 0;
  }
	handle_click(event) {
    console.log("crew clicked");
	}
  get_raw() {
    this.raw.pos = {"x":this.pos.x, "y":this.pos.y, "z":this.pos.z};
    this.raw.name = this.name;
    this.raw.sprite = this.sprite;
    return this.raw;
  }
}
