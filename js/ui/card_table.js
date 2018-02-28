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
}
