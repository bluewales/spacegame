"use strict";

class Structure extends createjs.Container {
 constructor(raw) {
   super();
   this.progress = raw.progress;
   if(raw.progress === undefined)
    this.progress = 0;
   this.raw = raw;
   this.pos = raw.location;
 }
 set progress(value) {
   this._progress = value;
   this.alpha = value >= 100 ? 1 : 0.5;

 }
 get progress() {
   return this._progress;
 }
}
