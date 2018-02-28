/**
 * Created by ldavidson on 7/13/2017.
 */

function create_floor(floor_type, pos) {

  var existing_floor = window.game.ship.get_floor(pos);
  if(existing_floor) return;

  var raw = floor_type.generate_raw(pos);
  window.game.ship.add_floor(raw);
  var floor = window.game.ship.get_floor(pos);
  var job = new Construct(floor);
  job.on_complete = function(){game.ship.graph.update_floor(this.structure.pos);};
  window.game.jobs.create_job(job);
}

function create_wall(wall_type, pos) {
  window.game.ship.add_wall(this);
  var wall = window.game.ship.get_wall(this.location, this.orientation);
  var job = new Construct(wall, this.build_pos);
  job.on_complete = function(){game.ship.graph.update_wall(this.structure.pos, this.structure.ori);};
  window.game.jobs.create_job(job);
}


class Construct extends Job {
  constructor(structure, build_pos=false) {
    super();
    this.structure = structure;
    this.buid_pos = build_pos || structure.pos;
  }
  work(crew) {
    var p = crew.pos;
    var tp = this.buid_pos;

    if(p.x==tp.x && p.y==tp.y && p.z==tp.z) {
      this.structure.progress = this.structure.progress+1;
      if(this.structure.progress >= 100) {
          return true;
      }
    } else {
      crew.move_towards(tp);
    }
    return false;
  }
  on_complete() {
    this.structure.ship.graph.init_node(this.structure.pos);
  }
}
