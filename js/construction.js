/**
 * Created by ldavidson on 7/13/2017.
 */


function construct_structure(type, pos) {
  if(!type.can_build(pos)) {
    return;
  }
  var raw = type.generate_raw(pos);
  var structure = new type();
  structure.init(raw);
  structure.start(raw);
  game.ship.add_structure(structure);
  var job = new Construct(structure, this.build_pos);
  job.on_complete = function(){game.ship.graph.update_pos(structure.pos);};

  game.ship.jobs.create_job(job);

  console.log("build " + raw.type + " at " + pos_to_index(pos));
}


class Construct extends Job {
  constructor(structure) {
    super();
    if(structure) {
      this.structure = structure;
      this.pos = this.structure.pos;
    }
  }
  init(raw, objects) {
    super.init(raw, objects);
    this.structure = objects[raw.structure];
    this.pos = this.structure.pos;
  }
  start(raw, objects) {
  }

  work(crew) {
    var p = crew.pos;
    var tp = this.pos;

    if(walled_distance(p, tp) == 0) {
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

  get_raw(callback) {
    this.raw = {};
    this.raw.structure = this.structure.id;
    this.raw.count = this.count;
    this.raw.type = "Construct";
    callback(this, this.raw);
  }
}
