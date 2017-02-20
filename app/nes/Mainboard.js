'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Event = require('./Event');

var _Memory = require('./Memory');

var _Memory2 = _interopRequireDefault(_Memory);

var _PPU = require('./PPU');

var _PPU2 = _interopRequireDefault(_PPU);

var _RenderBuffer = require('./PPU/RenderBuffer');

var _RenderBuffer2 = _interopRequireDefault(_RenderBuffer);

var _APULegacy = require('./APU/APULegacy');

var _APULegacy2 = _interopRequireDefault(_APULegacy);

var _InputDeviceBus = require('./controls/InputDeviceBus');

var _InputDeviceBus2 = _interopRequireDefault(_InputDeviceBus);

var _Synchroniser = require('./Synchroniser');

var _Synchroniser2 = _interopRequireDefault(_Synchroniser);

var _Cpu = require('./CPU/Cpu6502');

var _Cpu2 = _interopRequireDefault(_Cpu);

var _Trace = require('../utils/Trace');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mainboard = function () {
  function Mainboard(renderSurface) {
    _classCallCheck(this, Mainboard);

    this.running = false;
    this.cart = null;
    this._eventBus = new _Event.EventBus();

    this.memory = new _Memory2.default(this);
    this.ppu = new _PPU2.default(this);
    this.apu = new _APULegacy2.default(this);
    this.inputdevicebus = new _InputDeviceBus2.default();
    this.cpu = new _Cpu2.default(this);

    this.renderBuffer = new _RenderBuffer2.default(this, renderSurface);

    this.synchroniser = new _Synchroniser2.default(this);
    this.synchroniser.connect('frameEnd', this._onFrameEnd.bind(this));
    this.synchroniser.addObject('ppu', this.ppu);
    this.synchroniser.addObject('apu', this.apu);

    this.ppu.hookSyncEvents(this.synchroniser);

    this.enableSound(true);
  }

  _createClass(Mainboard, [{
    key: 'connect',
    value: function connect(name, cb) {
      this._eventBus.connect(name, cb);
    }
  }, {
    key: 'enableSound',
    value: function enableSound(enable) {
      this.apu.enableSound(enable);
      this._eventBus.invoke('soundEnabled', this.apu.soundEnabled(), this.apu.soundSupported());
    }
  }, {
    key: 'setVolume',
    value: function setVolume(val) {
      this.apu.setVolume(val);
    }
  }, {
    key: 'setTraceOption',
    value: function setTraceOption(traceType, checked) {
      if (traceType === _Trace.trace_all || traceType === _Trace.trace_cpuInstructions) {
        this.cpu.enableTrace(checked); // cpu instructions require different code path, needs to be invoked seperately
      }
      (0, _Trace.enableType)(traceType, checked);
    }
  }, {
    key: '_onFrameEnd',
    value: function _onFrameEnd() {
      this.running = false;
      this._eventBus.invoke('frameEnd');
    }
  }, {
    key: 'doFrame',
    value: function doFrame() {
      if (this.cart) {
        this.running = true;
        while (this.running) {
          // keep going until a frame is rendered
          this.synchroniser.runCycle();
        }
      }
    }
  }, {
    key: 'loadCartridge',
    value: function loadCartridge(cart) {
      this.cart = cart;
      this.synchroniser.addObject('mapper', this.cart.memoryMapper);

      this.reset(true);
      this._eventBus.invoke('romLoaded', this.cart);
    }
  }, {
    key: 'powerButton',
    value: function powerButton(on) {
      var isOn = on && this.cart;
      if (isOn) {
        this.reset();
      } else {
        this.running = false;
        this.cart = null;
      }
      this._eventBus.invoke('power', isOn);
    }
  }, {
    key: 'reset',
    value: function reset(cold) {
      cold = cold === undefined ? true : cold;
      if (this.cart) this.cart.reset(cold);
      this._eventBus.invoke('reset', cold);
    }
  }, {
    key: 'saveState',
    value: function saveState() {
      var data = {};
      data.memory = this.memory.saveState();
      data.ppu = this.ppu.saveState();
      data.apu = this.apu.saveState();
      //  data.joypad1 = this.joypad1.saveState();
      data.cpu = this.cpu.saveState();
      data.synchroniser = this.synchroniser.saveState();
      data.renderBuffer = this.renderBuffer.saveState();
      if (this.cart && this.cart.memoryMapper) {
        data.memoryMapper = this.cart.memoryMapper.saveState();
      }
      return data;
    }
  }, {
    key: 'loadState',
    value: function loadState(data) {
      this.memory.loadState(data.memory);
      this.ppu.loadState(data.ppu);
      this.apu.loadState(data.apu);
      //  this.joypad1.loadState( data.joypad1 );
      this.cpu.loadState(data.cpu);
      this.renderBuffer.loadState(data.renderBuffer);
      this.synchroniser.loadState(data.synchroniser);
      if (this.cart && this.cart.memoryMapper) {
        this.cart.memoryMapper.loadState(data.memoryMapper);
      }
    }
  }]);

  return Mainboard;
}();

exports.default = Mainboard;