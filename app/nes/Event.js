"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Event = exports.Event = function () {
  function Event() {
    _classCallCheck(this, Event);

    this._callbacks = [];
  }

  _createClass(Event, [{
    key: "addCallback",
    value: function addCallback(cb) {
      this._callbacks.push(cb);
    }
  }, {
    key: "invoke",
    value: function invoke() {
      var eventArgs = Array.prototype.slice.call(arguments, 0);
      for (var i = 0; i < this._callbacks.length; ++i) {
        this._callbacks[i].apply(this, eventArgs);
      }
    }
  }]);

  return Event;
}();

var EventBus = exports.EventBus = function () {
  function EventBus() {
    _classCallCheck(this, EventBus);

    this._map = {};
  }

  _createClass(EventBus, [{
    key: "getEvent",
    value: function getEvent(name) {
      if (!this._map[name]) {
        this._map[name] = new Event();
      }
      return this._map[name];
    }
  }, {
    key: "connect",
    value: function connect(name, cb) {
      this.getEvent(name).addCallback(cb);
    }
  }, {
    key: "invoke",
    value: function invoke(name) {
      var event = this._map[name];
      var eventArgs = [];

      if (event) {
        if (arguments.length > 1) {
          eventArgs = Array.prototype.slice.call(arguments, 1);
        }

        event.invoke.apply(event, eventArgs);
      }
    }
  }]);

  return EventBus;
}();