class Crate extends Furniture {

  constructor() {
    super();
    this.items = {};
    this.inventory_size = 10;
    this.item_count = 0;
    this.pending_items = 0;

    this.uid = getUID("Crate");
  }
  init(raw, objects) {
    super.init(raw, objects);

    this.sprite = "crate";

		this.addChild(new createjs.Sprite(game.sprites[this.sprite].sprite, this.sprite));

    var items = raw.item;
    if(!items) items = [];

  	for(var i = 0; i < items.length; i++) {
  		this.add_item(objects[items[i]]);
  	}

  }
  start(raw, objects) {
    super.start(raw, objects);
  }

  tick() {
    if(this.item_count + this.pending_items < this.inventory_size){
      if(Math.random()*1000 < 1) {
        for (var key in this.ship.items) {
          if(this.ship.items[key] === undefined) continue;
          if(!this.ship.items[key].claimed) {
            console.log("tick tock " + this.ship.items[key].uid);
            this.ship.items[key].claimed = true;

            var job = new PutAway(this, this.ship.items[key]);
            this.ship.jobs.create_job(job);
            break;
          }
        }
      }
    }
  }

  add_item(item) {
    this.items[item.uid] = item;

    this.item_count++;

    item.container = this;
    item.pos = this.pos;

    if(!item.claimed) {
      this.ship.item_store.add_item(item);
    }
  }


  remove_item(item) {
    if(!this.items[item.uid]) {
      console.log("ERROR cannot remove item.  It's not here.");
      //console.trace();
      return;
    }
    this.item_count--;
    this.items[item.uid] = undefined;
    delete this.items[item.uid];
  }


  get_raw(callback) {
    this.raw = {};
    this.raw.pos = {x:this.pos.x, y:this.pos.y, z:this.pos.z};
    this.raw.progress = this.progress;
    this.raw.ship = this.ship.id;
    this.raw.type = this.type;

    this.raw.item = [];
    for (var key in this.items) {
      this.raw.item.push(this.items[key].id);
      this.items[key].get_raw(callback);
    }

    callback(this, this.raw);
  }

  static generate_raw(pos) {
    return {
      "type": "Crate",
      "pos": pos,
      "progress": 0
    };
  }

  static get materials() {
    return ["Steel"];
  }
}

class PutAway extends Job {
  constructor(crate, item) {
    super();
    if(crate) {
      this.crate = crate;
      this.pos = item.pos;
      this.item = item;

      this.crate.pending_items++;
    }
  }
  init(raw, objects) {
    super.init(raw, objects);
    this.crate = objects[raw.crate];
    this.item = objects[raw.item];
    this.pos = this.item.pos;

    this.crate.pending_items++;
  }
  start(raw, objects) {
    super.start(raw, objects);
  }

  work(crew) {
    var p = crew.pos;

    if(!this.take_item_to(crew, this.item, this.crate.pos)) return false;

    this.item.claimed = false;
    this.crate.add_item(this.item);

    return true;
  }

  on_complete() {

  }

  get_raw(callback) {
    this.raw = {};
    this.raw.crate = this.crate.id;
    this.raw.item = this.item.id;
    this.raw.type = "PutAway";

    callback(this, this.raw);
  }
}
