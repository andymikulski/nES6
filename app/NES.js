'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stats = require('stats.js');

var _stats2 = _interopRequireDefault(_stats);

var _Event = require('./nes/Event');

var _TestRenderSurface = require('./utils/TestRenderSurface');

var _TestRenderSurface2 = _interopRequireDefault(_TestRenderSurface);

var _Mainboard = require('./nes/Mainboard');

var _Mainboard2 = _interopRequireDefault(_Mainboard);

var _Cartridge = require('./nes/Cartridge');

var _Cartridge2 = _interopRequireDefault(_Cartridge);

var _Trace = require('./utils/Trace');

var _Trace2 = _interopRequireDefault(_Trace);

var _loadRom = require('./utils/loadRom');

var _gameGenie = require('./utils/gameGenie');

var _CanvasParent = require('./gui/CanvasParent');

var _CanvasParent2 = _interopRequireDefault(_CanvasParent);

var _WebGlRenderSurface = require('./gui/webgl/WebGlRenderSurface');

var _WebGlRenderSurface2 = _interopRequireDefault(_WebGlRenderSurface);

var _utils = require('./gui/webgl/utils');

var _CanvasRenderSurface = require('./gui/canvas/CanvasRenderSurface');

var _CanvasRenderSurface2 = _interopRequireDefault(_CanvasRenderSurface);

var _StateManager = require('./gui/StateManager');

var _StateManager2 = _interopRequireDefault(_StateManager);

var _Input = require('./gui/input/Input');

var _Input2 = _interopRequireDefault(_Input);

var _consts = require('./config/consts.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var NES = function () {
  function NES() {
    _classCallCheck(this, NES);

    this._cart = null;
    this._romLoaded = false;
    this._mainboard = null;
    this._renderSurface = null;
    this._fpsMeter = null;
    this._spriteDisplay = null;
    this._paletteDisplay = null;
    this._logWindow = null;
    this._input = null;
    this._encodingTypeToSet = '';
    this._newRomWaiting = false;
    this._newRomLoaded = {
      name: '',
      binaryString: null
    };
    this._eventBus = new _Event.EventBus();

    this._frameTimeTarget = 0;
    this._lastFrameTime = 0;
    this._gameSpeed = 100; // 100% normal speed

    this._isPaused = 0;
    this._pauseNextFrame = false;
    this._pauseOnFrame = -1;

    this._options = {};

    this.animate = this._animate.bind(this);

    window.onerror = this._showError.bind(this);
  }

  _createClass(NES, [{
    key: 'connect',
    value: function connect(name, cb) {
      this._eventBus.connect(name, cb);
    }
  }, {
    key: 'setColourEncodingType',
    value: function setColourEncodingType(encodingType) {
      this._encodingTypeToSet = encodingType;
    }
  }, {
    key: '_loadRomCallback',
    value: function _loadRomCallback(name, binaryString) {
      this._newRomWaiting = true;
      this._newRomLoaded = {
        name: name,
        binaryString: binaryString
      };
    }
  }, {
    key: 'start',
    value: function start(options) {
      this._options = options || {};
      this._options.triggerFrameRenderedEvent = this._options.triggerFrameRenderedEvent === undefined ? false : this._options.triggerFrameRenderedEvent;
      this._options.createGuiComponents = !!this._options.createGuiComponents;

      var that = this;

      // window.addEventListener('contextmenu', function(event) {
      //   event.preventDefault();
      // }, false);
      //
      //

      this._fpsMeter = new _stats2.default();
      this._fpsMeter.showPanel(1);
      document.body.appendChild(this._fpsMeter.dom);
      // this._fpsMeter.hide();


      this._canvasParent = new _CanvasParent2.default();
      this._renderSurface = null;
      if ((0, _utils.webGlSupported)()) {
        this._renderSurface = new _WebGlRenderSurface2.default(this._canvasParent);
      } else {
        this._renderSurface = new _CanvasRenderSurface2.default(this._canvasParent);
      }

      this._mainboard = new _Mainboard2.default(this._renderSurface);
      this._mainboard.connect('reset', this._onReset.bind(this));

      // if (this._options.createGuiComponents) {
      // this._ggDialog = new Gui.GameGenieDialog(this);
      // this._controlBar = new Gui.ControlBar(this);
      // this._controlBar.connect('romLoaded', function(name, binaryString) {
      // that._loadRomCallback(name, binaryString);
      // });
      // this._keyboardRemapDialog = new Gui.KeyboardRemapper(this);
      // }
      this._input = new _Input2.default(this._mainboard);

      this._stateManager = new _StateManager2.default(this, this._options.createGuiComponents);

      this.animate();
    }
  }, {
    key: 'pause',
    value: function pause(isPaused) {
      var changed = isPaused !== this._isPaused;
      this._isPaused = isPaused;

      if (changed) {
        this._eventBus.invoke('isPausedChange', isPaused);
      }
    }
  }, {
    key: 'isPaused',
    value: function isPaused() {
      return this._isPaused;
    }
  }, {
    key: '_onReset',
    value: function _onReset() {
      this._calculateFrameTimeTarget();
    }
  }, {
    key: '_calculateFrameTimeTarget',
    value: function _calculateFrameTimeTarget() {
      if (this._gameSpeed > 0) {
        var base = 100000 / this._gameSpeed; // 100000 = 1000 * 100 ( 1000 milliseconds, multiplied by 100 as gameSpeed is a %)
        this._frameTimeTarget = base / _consts.COLOUR_ENCODING_REFRESHRATE;
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      this._mainboard.reset();
    }
  }, {
    key: 'playOneFrame',
    value: function playOneFrame() {
      this.pause(false);
      this._pauseNextFrame = true;
    }
  }, {
    key: 'playUntilFrame',
    value: function playUntilFrame(frameNum) {
      this.pause(false);
      this._pauseOnFrame = frameNum;
    }
  }, {
    key: 'enableSound',
    value: function enableSound(enable) {
      this._mainboard.enableSound(enable);
    }
  }, {
    key: 'soundEnabled',
    value: function soundEnabled() {
      return this._mainboard.apu.soundEnabled();
    }
  }, {
    key: 'soundSupported',
    value: function soundSupported() {
      return this._mainboard.apu.soundSupported();
    }
  }, {
    key: 'setVolume',
    value: function setVolume(val) {
      this._mainboard.setVolume(val);
    }
  }, {
    key: 'setGameSpeed',
    value: function setGameSpeed(gameSpeed) {
      this._gameSpeed = gameSpeed;
      this._calculateFrameTimeTarget();
    }
  }, {
    key: 'setTraceOption',
    value: function setTraceOption(traceType, checked) {
      this._mainboard.setTraceOption(traceType, checked);
    }
  }, {
    key: '_readyToRender',
    value: function _readyToRender() {
      if (this._gameSpeed <= 0) {
        return true;
      }
      var now = performance ? performance.now() : Date.now(); // Date.now() in unsupported browsers
      var diff = now - this._lastFrameTime;
      if (diff >= this._frameTimeTarget) {
        this._lastFrameTime = now;
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: 'showFpsMeter',
    value: function showFpsMeter(show) {
      if (show) {
        // this._fpsMeter.show();
      } else {
          // this._fpsMeter.hide();
        }
    }
  }, {
    key: 'startTrace',
    value: function startTrace() {
      this._eventBus.invoke('traceRunning', true);
      // if ( traceType === 'cpuInstructions' ) {
      this._mainboard.cpu.enableTrace(true);
      // }
      _Trace2.default.start();
    }
  }, {
    key: 'stopTrace',
    value: function stopTrace() {
      _Trace2.default.stop();
      this._mainboard.cpu.enableTrace(false);
      this._eventBus.invoke('traceRunning', false);
    }
  }, {
    key: 'screenshot',
    value: function screenshot() {
      this._renderSurface.screenshotToFile();
    }
  }, {
    key: '_animate',
    value: function _animate() {
      var that = this;

      if (this._fpsMeter) {
        this._fpsMeter.begin();
      }

      if (this._newRomWaiting) {
        this._doRomLoad(this._newRomLoaded.name, this._newRomLoaded.binaryString);
        this._newRomWaiting = false;
      }

      if (this._romLoaded) {
        this._romLoaded = false;
        this._mainboard.loadCartridge(this._cart);
        this._eventBus.invoke('cartLoaded', this._cart);
      }

      if (this._encodingTypeToSet.length > 0) {
        setColourEncodingType(this._encodingTypeToSet);
        this._encodingTypeToSet = '';
      }

      if (this._isPaused) {
        setTimeout(this.animate, 300);
        return;
      }

      if (this._readyToRender()) {

        if (this._input) {
          this._input.poll();
        }

        var bgColour = this._mainboard.renderBuffer.pickColour(this._mainboard.ppu.getBackgroundPaletteIndex());
        this._renderSurface.clearBuffers(bgColour);
        this._mainboard.renderBuffer.clearBuffer();

        this._mainboard.doFrame();
        this._renderSurface.render(this._mainboard);

        if (this._options.triggerFrameRenderedEvent) {
          this._eventBus.invoke('frameRendered', this._renderSurface, this._mainboard.ppu.frameCounter);
        }
      }

      if (this._pauseNextFrame) {
        this._pauseNextFrame = false;
        this.pause(true);
      }

      if (this._pauseOnFrame >= 0 && this._pauseOnFrame === this._mainboard.ppu.frameCounter) {
        this._pauseOnFrame = -1;
        this.pause(true);
      }

      this._stateManager.onFrame();

      if (this._fpsMeter) {
        this._fpsMeter.end();
      }

      setImmediate(this.animate);
    }
  }, {
    key: '_doRomLoad',
    value: function _doRomLoad(name, binaryString) {
      var that = this;
      this._cart = new _Cartridge2.default(this._mainboard);
      this._cart.loadRom(name, binaryString, function (err) {
        if (!err) {
          that._romLoaded = true;
        } else {
          that._showError(err);
        }
      });
    }
  }, {
    key: 'loadRomFromUrl',
    value: function loadRomFromUrl(url) {
      var that = this;
      (0, _loadRom.loadRomFromUrl)(url, function (err, name, binary) {
        if (!err) {
          that._loadRomCallback(name, binary);
        } else {
          that._showError(err);
        }
      });
    }
  }, {
    key: '_showError',
    value: function _showError(err) {
      console.log(err);
      var errorType = typeof err === 'undefined' ? 'undefined' : _typeof(err);
      var msg = '';
      if (errorType === 'string') {
        msg = err;
      } else if (errorType === 'object') {
        if (err.message) {
          msg = err.message;
        } else {
          msg = err.toString();
        }
      } else {
        msg = err.toString();
      }
      this._eventBus.invoke('romLoadFailure', msg);
    }
  }, {
    key: 'enterGameGenieCode',
    value: function enterGameGenieCode(code) {
      (0, _gameGenie.processGenieCode)(this._mainboard, code, true);
    }
  }, {
    key: 'loadShaderFromUrl',
    value: function loadShaderFromUrl(url) {
      if (this._renderSurface.loadShaderFromUrl) {
        this._renderSurface.loadShaderFromUrl(url);
      }
    }
  }]);

  return NES;
}();

exports.default = NES;