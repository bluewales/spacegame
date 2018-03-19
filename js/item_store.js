class ItemStore {
  constructor() {
    this.store = {};
    this.by_uid = {};
  }
  add_item(item) {
    if(this.by_uid[item.uid]) {
      return;
    }

    var type = item.type;
    if(!this.store[type]) this.store[type] = [];
    this.store[type].push(item);
    this.by_uid[item.uid] = item;
    
    item.claimed = false;
  }

  claim_item(type, accessible_from) {
    if(this.store[type] && this.store[type].length > 0) {
      var item = this.store[type][0];
      this.store[type].splice(0,1);
      this.by_uid[item.uid] = undefined;

      item.claimed = true;

      return item;
    }
  }
}
