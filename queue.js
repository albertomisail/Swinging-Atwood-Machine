class Queue {
  constructor() {
    this.inq = [];
    this.outq = [];
  }
  push(item) {
    this.inq.push(item)
  }
  pre() {
    if(this.outq.length != 0) {
      return true;
    }
    if(this.outq.length == 0 && this.inq.length != 0) {
      while(this.inq.length != 0) {
        this.outq.push(this.inq.pop());
      }
      return true;
    }
    return false;
  }
  front() {
    if(this.pre()) {
      return this.outq.back();
    }
    return null;
  }
  pop() {
    if(this.pre()) {
      return this.outq.pop();
    }
    return null;
  }
  size() {
    return this.outq.length + this.inq.length;
  }
  clear() {
    this.outq = [];
    this.inq = [];
  }
  runOn(func) {
    for(let i=this.outq.length-1; i>=0; --i) {
      func(this.outq[i]);
    }
    for(let i=0; i<this.inq.length; ++i) {
      func(this.inq[i]);
    }
  }
}
