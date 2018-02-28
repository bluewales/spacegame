class ControlsCard extends Card {
  constructor(button) {
    var width = 300;
    var height = 130;
    var name = "Controls";

    super(name, button, width, height);

    this.x = 10;
    this.y = 100;



    this.line1_1 = new createjs.Text("a,s,d,w", "20px Arial", menu_palette[0]);
    this.line1_1.x = 10;
    this.line1_1.y = 10;

    this.line1_2 = new createjs.Text("scroll", "20px Arial", menu_palette[0]);
    this.line1_2.x = 150;
    this.line1_2.y = 10;

    this.line2_1 = new createjs.Text("q,e", "20px Arial", menu_palette[0]);
    this.line2_1.x = 10;
    this.line2_1.y = 40;

    this.line2_2 = new createjs.Text("change level", "20px Arial", menu_palette[0]);
    this.line2_2.x = 150;
    this.line2_2.y = 40;

    this.line3_1 = new createjs.Text("mouse wheel", "20px Arial", menu_palette[0]);
    this.line3_1.x = 10;
    this.line3_1.y = 70;

    this.line3_2 = new createjs.Text("zoom", "20px Arial", menu_palette[0]);
    this.line3_2.x = 150;
    this.line3_2.y = 70;

    this.line4_1 = new createjs.Text("space", "20px Arial", menu_palette[0]);
    this.line4_1.x = 10;
    this.line4_1.y = 100;

    this.line4_2 = new createjs.Text("return to center", "20px Arial", menu_palette[0]);
    this.line4_2.x = 150;
    this.line4_2.y = 100;


    this.addChild(this.header);
    this.addChild(this.line1_1);
    this.addChild(this.line1_2);
    this.addChild(this.line2_1);
    this.addChild(this.line2_2);
    this.addChild(this.line3_1);
    this.addChild(this.line3_2);
    this.addChild(this.line4_1);
    this.addChild(this.line4_2);
  }
}
