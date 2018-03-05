class BuildCard extends Card {
  constructor(button) {

    var items = [
      {"name":"wall", "grid":"wall", "type":WallPanel},
      {"name":"floor", "grid":"cell", "type":FloorPlate},
      {"name":"door", "grid":"wall", "type":Door},
      {"name":"hatch", "grid":"cell", "type":Hatch},
      {"name":"barrel", "grid":"cell", "type":Barrel},
      {"name":"crate", "grid":"cell", "type":Crate},
      {"name":"destroy", "type":true}
    ];

    var item_width = 48;
    var item_margin = 6;

    var width = item_width*2 + item_margin*3;
    var height = Math.ceil(items.length/2) * (item_width + item_margin) + item_margin;
    var name = "Build";
    super(name, button, width, height);

    this.x = 10;
    this.y = 300;
    this.name = name;

    this.items = items;

    this.item_width = item_width;
    this.item_margin = item_margin;

    for(var i = 0; i < this.items.length; i++) {
      var x = (i%2) * (this.item_width + this.item_margin) + this.item_margin + this.item_width/2;
      var y = Math.floor(i/2) * (this.item_width + this.item_margin) + this.item_margin;

      var button_config = {
        "width": this.item_width,
        "height": this.item_width,
        "text": this.items[i].name,
        "text_hight": 14,
        "on_click": function() {
          this.button.parent.item_selected(this, this.button.active);
        }.bind(this.items[i])
      };

      var button = new Button(button_config);
      button.x = x;
      button.y = y;
      this.addChild(button);

      this.items[i].button = button;
    }
  }

  item_selected(item, activating) {
    for(var i = 0; i < this.items.length; i++) {
      if(this.items[i] !== item) {
        this.items[i].button.active = false;
      }
    }
    game.cell_cursor = false;
    game.wall_cursor = false;
    if(!item) return;

    if(activating) {

      var build_callback = function(pos) {
        construct_structure(item.type, pos);
      };

      if(item.grid == "wall") {
        game.wall_cursor = build_callback;
      } else {
        game.cell_cursor = build_callback;
      }
    }
  }

  deactivate() {
    this.item_selected(null, false);
  }
}
