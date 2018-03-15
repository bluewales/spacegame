class CardTable extends createjs.Container {
  constructor() {
    super();
    this.cards = [];
  }
  focus(card) {
    if(card) this.register(card);
    var cards = this.children;
    for(var i = 0; i < cards.length; i++) {
      if(cards[i] !== card) {
        cards[i].focused = false;
      }
      if(!cards[i].pinned && cards[i] !== card) {
        cards[i].active = false;
        this.removeChild(cards[i]);
      }
    }
    if(card !== undefined) {
      game.clear_highlight(false);
      card.focused = true;
      if(this.getChildIndex(card) < 0){
        this.addChild(card);
      }
      this.setChildIndex(card, this.numChildren-1);
    }
  }
  register(card) {
    if(!this.cards.includes(card)) {
      this.cards.push(card);
    }
  }
  tick(width, height) {
    var cards = this.children;
    var margin = 20;
    for(var i = 0; i < cards.length; i++) {
      if(cards[i].x < margin - cards[i].width) {
        cards[i].x = margin - cards[i].width;
      }
      if(cards[i].x > width - margin) {
        cards[i].x = width - margin;
      }
      if(cards[i].y < margin - cards[i].height) {
        cards[i].y = margin - cards[i].height;
      }
      if(cards[i].y > height - margin) {
        cards[i].y = height - margin;
      }
    }
  }
}
