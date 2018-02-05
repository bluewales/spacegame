class Controls extends createjs.Container {
  constructor() {
    super();

    this.x = 500;
    this.y = 100;

    this.frame = new CardFrame(250, 300);

    this.addChild(this.frame);


  }



}
