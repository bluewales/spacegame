/**
 * Created by ldavidson on 7/13/2017.
 */

function create_floor() {
  console.log(this);
  window.game.ship.add_floor(this);
  var floor = window.game.ship.get_floor(this.location);
  window.game.jobs.create_job(new Construct(floor));
}

function create_wall() {
  console.log(this);
  window.game.ship.add_wall(this);
  var wall = window.game.ship.get_wall(this.location, this.orientation);
  window.game.jobs.create_job(new Construct(wall, build_pos=this.build_pos));
}


class Construct extends Job {
  constructor(structure, build_pos=false) {
    super();
    this.structure = structure;
    this.buid_pos = build_pos || structure.pos;
    console.log(structure.pos);
    console.log(build_pos);
    console.log(this.build_pos);
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
    this.structure.ship.graph.update_node(this.structure.pos);
  }
}
