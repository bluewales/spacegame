class Structure extends createjs.Container {
  constructor(ship, raw) {
    super();
    this.ship = ship;
    this.raw = raw;
		this.type = raw.type;
    this.pos = raw.pos;

    this.progress = raw.progress;
    if(raw.progress === undefined)
    this.progress = 0;

    this.x = this.ship.position_transform(this.pos.x);
    this.y = this.ship.position_transform(this.pos.y);
  }
  set progress(value) {
    this._progress = value;
    this.alpha = value >= 100 ? 1 : 0.5 + value/200;
  }
  get progress() {
    return this._progress;
  }

  static get_type_from_string(str) {
    var types = {
      "WallPanel": WallPanel,
      "Door": Door,
      "Hatch": Hatch,
      "FloorPlate": FloorPlate,
      "Crate": Crate,
      "Barrel": Barrel
    };
    return types[str];
  }
  static createStructure(ship, raw) {
    var type = Structure.get_type_from_string(raw.type);
    return new type(ship, raw);
  }
}
