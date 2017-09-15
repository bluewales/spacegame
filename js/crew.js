/**
 * Created by Luke on 7/18/2017.
 */

function p_to_s(p) {
  return "(" + p.x + "," + p.y + "," + p.z + ")";
}

class Crew extends createjs.Sprite {
	constructor(sheet, raw) {
		super(sheet, raw.sprite);

		this.pos = raw.location;
    this.raw = raw;

		this.x = this.pos.x * 24;
		this.y = this.pos.y * 24;

		// handle click/tap
		this.on('click', this.handle_click.bind(this));
	}
  move_towards(target) {
    console.log(p_to_s(this.pos) + " move toward " + p_to_s(target));
    var dif_x = target.x - this.pos.x;
    var dif_y = target.y - this.pos.y;
    var dif_z = target.z - this.pos.z;
    if(dif_x != 0) {
      this.pos.x += dif_x / Math.abs(dif_x);
    } else if(dif_y != 0) {
      this.pos.y += dif_y / Math.abs(dif_y);
    } else if(dif_z != 0) {
      this.pos.z += dif_z / Math.abs(dif_z);
    }

    this.x = this.pos.x * 24;
		this.y = this.pos.y * 24;

  }
  tick(event, game) {
    if(!this.current_job) {
      this.current_job = game.jobs.get_job(this);
    }
    if(this.current_job) {
      this.current_job.work(this);
    }

  }
	handle_click(event) {
		window.game.handle_click(event, this);
	}
}
