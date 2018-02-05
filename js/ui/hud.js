class HUD extends createjs.Container {
  constructor() {
    super();
    this.width = 0;
    this.height = 0;

    this.addChild(new TopBar());
    this.addChild(new BottomBar());


    return;
  }

  tick(width, height) {

    if(this.width != width || this.height != height) {
      this.width = width;
      this.height = height;

      this.children.forEach(function(child) {
        child.tick(width, height);
      });
    }
  }
}
