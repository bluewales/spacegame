class Jobs {
  constructor() {
    this.queue = [];
  }

  create_job(job) {
    this.queue.push(job);
    job.job_queue = this;
  }

  get_job(crew) {
    var distance = undefined;
    var closest = undefined;
    for(var i = this.queue.length-1; i >= 0; i--) {
      if(!this.queue[i].active) {
        var d = walled_distance(crew.pos, this.queue[i].pos);
        if(closest === undefined || d < distance) {
          distance = d;
          closest = this.queue[i];
        }
      }
    }
    if(closest) {
      closest.active = true;
      return closest;
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
  init(raw, objects) {
    this.active = raw.active;
  }
  work(crew) {
    console.log("Default Job cannot be worked, is always done.")
    return true;
  }
  // leave this one alone, it belongs to the super class
  complete() {
    this.on_complete();
    this.job_queue.complete_job(this);
  }
  // overwrite this one, it's supposed to be overwritten by the child class
  on_complete(){}


  take_item_to(crew, item, dest) {
    if(crew.carried_item !== item) {
      if(walled_distance(crew.pos, item.pos) > 0) {
        crew.move_towards(item.pos);
      } else {
        crew.grab(item);
      }
    } else {
      if(walled_distance(crew.pos, dest) > 0) {
        crew.move_towards(dest);
      } else {
        return true;
      }
    }
    return false;
  }
}

class Patrol extends Job {
  constructor(points) {
    super();
    this.current_point = 0;
    this.count = 0;
    if(points) {
      this.points = points;
      this.pos = this.points[0];
    }
  }
  init(raw, objects) {
    super.init(raw, objects);
    this.current_point = raw.current_point;
    this.points = raw.points;
    this.count = raw.count;
    this.pos = this.points[0];
  }
  start(raw, objects) {}
  work(crew) {
    var p = crew.pos;
    var tp = this.points[this.current_point];

    if(walled_distance(p, tp) == 0) {
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
  }
  get_raw(callback) {
    this.raw = {};
    this.raw.current_point = this.current_point;
    this.raw.points = this.points;
    this.raw.count = this.count;
    this.raw.active = this.active;
    this.raw.type = "Patrol";
    callback(this, this.raw);
  }
}
