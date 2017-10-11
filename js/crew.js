/**
 * Created by Luke on 7/18/2017.
 */

function p_to_s(p) {
  return "(" + p.x + "," + p.y + "," + p.z + ")";
}

class Crew extends createjs.Sprite {
	constructor(sheet, raw, ship) {
		super(sheet, raw.sprite);

		this.pos = raw.location;
    this.raw = raw;
    this.ship = ship;

		this.x = this.pos.x * 24;
		this.y = this.pos.y * 24;

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
    this.path = get_path(this.pos,target);
  }
  tick(event, game) {
    if(this.cooldown > 0) {
      this.cooldown -= 1;
    } else if(this.path) {
      var c = this.pos;
      var t = this.path[this.path_progress];
      var distance = Math.abs((c.x-t.x) + (c.y-t.y) + (c.z-t.z));
      if(distance == 0) {
        this.path_progress += 1;
        if(this.path_progress == this.path.length) {
          //console.log("Path complete");
          this.clear_path();
        }
      } else if(distance == 1) {

        this.ship.change_position_crew(this, t);
        this.pos = t;
        this.cooldown = 30 * t.weight;
        this.speed = 1/t.weight;
      } else {
        console.log("Abort Path " + this.path_progress + " " + distance);
        this.clear_path();
      }

    } else if(this.current_job) {
      if(this.current_job.work(this)) {
        this.current_job = false;
      }
    } else {
      this.current_job = game.jobs.get_job(this);
    }

    var dx = this.pos.x * 24 - this.x;
    var dy = this.pos.y * 24 - this.y;
    if(Math.abs(dx) > this.speed) {
      this.x += this.speed * dx / Math.abs(dx);
    } else {
      this.x = this.pos.x * 24;
    }
    if(Math.abs(dy) > this.speed) {
      this.y += this.speed * dy / Math.abs(dy);
    } else {
      this.y = this.pos.y * 24;
    }

  }
  clear_path() {
    this.path = false;
    this.path_progress = 0;
  }
	handle_click(event) {
    console.log("crew clicked");
		window.game.handle_click(event, this);
	}
}
