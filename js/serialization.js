
var type_lookup = {
  "WallPanel": WallPanel,
  "Door": Door,
  "Hatch": Hatch,
  "FloorPlate": FloorPlate,
  "Crate": Crate,
  "Barrel": Barrel,
  "Ship": Ship,
  "Crew": Crew,
  "Steel": Steel,
  "Construct": Construct,
  "Patrol": Patrol,
  "PutAway": PutAway
};



function deserialize(raw) {
  var objects = [];
  var root = raw.root;
  var raws = raw.objects;

  for (var i = 0; i < raws.length; i++) {
    var type = type_lookup[raws[i].type];
    objects.push(new type());
  }

  for (var i = 0; i < raws.length; i++) {
    objects[i].init(raws[i], objects);
  }

  for (var i = 0; i < raws.length; i++) {
    objects[i].start(raws[i], objects);
  }

  return objects[root];
}




function serialize(object) {
  var object_count = 0;
  var raws = [];

  function swizzle(object, raw) {
    object.id = object_count;
    object_count += 1;
  }
  object.get_raw(swizzle);

  function serial(object, raw) {
    if(object.id != raws.length) console.log("ERROR in serialization of " + raw.type);
    raws.push(raw);
  }
  object.get_raw(serial);

  return {"root":object.id, "objects":raws};
}
