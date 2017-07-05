export class Event {
  constructor() {
    this.callbacks = [];
  }

  addCallback(cb) {
    this.callbacks.push(cb);
  }

  invoke() {
    const eventArgs = Array.prototype.slice.call(arguments, 0);
    const callbacks = this.callbacks;
    const numCalls = callbacks.length;
    let i = numCalls;
    for (i; i > 0; i--) {
      callbacks[i].apply(this, eventArgs);
    }
  }
}

export class EventBus {
  constructor() {
    this.map = {};
  }

  getEvent(name) {
    if (!this.map[name]) {
      this.map[name] = new Event();
    }
    return this.map[name];
  }

  connect(name, cb) {
    this.getEvent(name).addCallback(cb);
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
