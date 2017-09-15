class Jobs {
  constructor() {
    this.queue = [];
  }

  create_job(job) {
    job.on_complete = this.complete_job;
    this.queue.push(job);
  }

  get_job(crew) {
    for(var i = this.queue.length-1; i >= 0; i--) {
      if(!this.queue[i].active) {
        this.queue[i].active = true;
        return this.queue[i];
      }
    }
  }

  complete_job(job) {;
    for(var i = this.queue.length-1; i >= 0; i--) {
      if(this.queue[i] === job) {
        array.splice(i, 1);
        break;
      }
    }
  }
}

class Job {
  constructor() {
    this.on_complete = function(){};
    this.active = false;
  }
  work(crew) {
    console.log("Default Job cannot be worked, is always done.")
    return True;
  }
  complete() {
    this.on_complete();
  }
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
    if(this.count++ < 32) return false;
    this.count = 0;
    if(p.x==tp.x && p.y==tp.y && p.z==tp.z) {
      console.log("here I am")
      this.current_point = (this.current_point + 1) % this.points.length;
    } else {
      crew.move_towards(tp);
    }
    return false;
  }
}
