class BuildCard extends Card {
  constructor(button) {

    var items = [
      {"name":"wall", "type":"wall", "target":WallPanel},
      {"name":"floor", "type":"floor", "target":FloorPlate},
      {"name":"door", "type":"wall", "target":Door},
      {"name":"hatch", "type":"floor", "target":Hatch},
      {"name":"barrel", "type":"furniture", "target":true},
      {"name":"crate", "type":"furniture", "target":true},
      {"name":"destroy", "target":true}
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
    game.build_cell_cursor = false;
    game.build_wall_cursor = false;
    if(!item) return;

    if(activating) {
      if(item.type == "wall") {
        game.build_wall_cursor = item.target;
      } else {
        game.build_cell_cursor = item.target;
      }
    }
  }

  deactivate() {
    this.item_selected(null, false);
  }
}
