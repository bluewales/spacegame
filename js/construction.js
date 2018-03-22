/**
 * Created by ldavidson on 7/13/2017.
 */


function construct_structure(type, pos) {
  if(!type.can_build(pos)) {
    return;
  }
  var raw = type.generate_raw(pos);
  var materials = type.materials;
  var items = [];

  var store = game.ship.item_store;

  for(var i = 0; i < materials.length; i++) {
    var item = store.claim_item(materials[i]);
    if(!item) break;
    items.push(item);
  }
  if(items.length != materials.length) {
    for(var i = 0; i < items.length; i++) {
      store.add_item(items[i]);
      item.get_raw();
    }
    return;
  }


  var structure = new type();
  structure.init(raw);
  structure.start(raw);
  game.ship.add_structure(structure);
  var job = new Construct(structure, items);
  job.on_complete = function(){game.ship.graph.update_pos(structure.pos);};

  game.ship.jobs.create_job(job);

  console.log("build " + raw.type + " at " + pos_to_index(pos));
}


class Construct extends Job {
  constructor(structure, materials) {
    super();
    if(structure) {
      this.structure = structure;
      this.pos = this.structure.pos;
      this.materials = materials;
    }
  }
  init(raw, objects) {
    super.init(raw, objects);
    this.structure = objects[raw.structure];
    this.pos = this.structure.pos;

    this.materials = [];
    if(raw.materials === undefined) raw.materials = [];
    for(var i = 0; i < raw.materials.length; i++) {
      this.materials.push(objects[raw.materials[i]]);
    }
  }
  start(raw, objects) {
    super.start(raw, objects);
  }

  work(crew) {
    var p = crew.pos;

    // get materials
    for(var i = 0; i < this.materials.length; i++) {
      var item = this.materials[i];
      if(item.container !== this) {
        if(!this.take_item_to(crew, item, this.pos)) return false;
        item.container = this;
        item.pos = this.pos;
      }
    }

    // build it
    if(walled_distance(p, this.pos) > 0) {
      crew.move_towards(this.pos);
    } else {
      this.structure.progress = this.structure.progress+1;
      if(this.structure.progress >= 100) {
          return true;
      }
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
    this.raw.materials = [];
    for(var i = 0; i < this.materials.length; i++) {
      this.raw.materials.push(this.materials[i].id);
      if(this.materials[i].container == this){
        this.materials[i].get_raw(callback);
      }
    }
    callback(this, this.raw);
  }
}
