export class BussedEvent {
  constructor() {
    this.callbacks = [];
  }

  addCallback(cb) {
    this.callbacks.push(cb);
  }

  invoke() {
    const eventArgs = Array.prototype.slice.call(arguments, 0);
    const callbacks = this.callbacks || [];
    const numCalls = callbacks.length - 1;
    let i = numCalls;
    for (i; i > 0; i--) {
      callbacks[i].apply(this, eventArgs);
    }
  }
}

export class EventBus {
  constructor() {
    this.map = {};
    this.connect = this.connect.bind(this);
    this.getEvent = this.getEvent.bind(this);
    this.invoke = this.invoke.bind(this);
  }

  getEvent(name) {
    if (!this.map.hasOwnProperty(name)) {
      this.map[name] = new BussedEvent();
    }
    return this.map[name];
  }

  connect(name, cb) {
    if (!this.map.hasOwnProperty(name)) {
      this.map[name] = new BussedEvent();
    }
    // this.getEvent(name).addCallback(cb);
    this.map[name].addCallback(cb);
  }

  invoke(name) {
    const event = this.map[name];
    let eventArgs = [];

    if (event) {
      if (arguments.length > 1) {
        eventArgs = Array.prototype.slice.call(arguments, 1);
      }

      event.invoke(...eventArgs);
    }
  }
}
