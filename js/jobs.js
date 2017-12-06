class Jobs {
  constructor() {
    this.queue = [];
  }

  create_job(job) {
    this.queue.push(job);
  }

  get_job(crew) {
    shuffle_array(this.queue);
    for(var i = this.queue.length-1; i >= 0; i--) {
      if(!this.queue[i].active) {
        this.queue[i].active = true;
        return this.queue[i];
      }
    }
  }

  complete_job(job) {
    for(var i = this.queue.length-1; i >= 0; i--) {
      if(this.queue[i] === job) {
        this.queue.splice(i, 1);
        break;
      }
    }
  }
}

class Job {
  constructor() {
    this.active = false;
  }
  work(crew) {
    console.log("Default Job cannot be worked, is always done.")
    return True;
  }
  // leave this one alone, it belongs to the super class
  complete() {
    this.on_complete();
    window.game.jobs.complete_job(this);
  }
  // overwrite this one, it's supposed to be overwritten by the child class
  on_complete(){}
}

class Patrol extends Job {
  constructor(points) {
    super();
    this.current_point = 0;
    this.points = points;
    this.count = 0;
  }
  work(crew) {
    var p = crew.pos;
    var tp = this.points[this.current_point];

    if(p.x==tp.x && p.y==tp.y && p.z==tp.z) {
      if(this.count++ >= 30) {
        this.count = 0;
        this.current_point = (this.current_point + 1);
        if(this.current_point >= this.points.length) return true;
      }
    } else {
      crew.move_towards(tp);
    }
    return false;
  }
  on_complete() {
    window.game.jobs.create_job(new Patrol([
      {"x":2,"y":2,"z":0},
      {"x":0,"y":0,"z":-1},
      {"x":0,"y":0,"z":0}

    ]));
  }
}
