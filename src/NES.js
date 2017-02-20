import Stats from 'stats.js';

import { EventBus } from './nes/Event';
import TestRenderSurface from './utils/TestRenderSurface';
import Mainboard from './nes/Mainboard';
import Cartridge from './nes/Cartridge';
import Trace from './utils/Trace';
import { loadRomFromUrl } from './utils/loadRom';
import { processGenieCode } from './utils/gameGenie';

import CanvasParent from './gui/CanvasParent';
import WebGlRenderSurface from './gui/webgl/WebGlRenderSurface';
import { webGlSupported } from './gui/webgl/utils';
import CanvasRenderSurface from './gui/canvas/CanvasRenderSurface';

import StateManager from './gui/StateManager';

import Input from './gui/input/Input';

import {
  COLOUR_ENCODING_REFRESHRATE,
} from './config/consts.js';

export default class NES {
  constructor() {
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
    this._eventBus = new EventBus();

    this._frameTimeTarget = 0;
    this._lastFrameTime = 0;
    this._gameSpeed = 100; // 100% normal speed

    this._isPaused = 0;
    this._pauseNextFrame = false;
    this._pauseOnFrame = -1;

    this._options = {};

    this.animate = ::this._animate;

    window.onerror = ::this._showError;
  }

  connect(name, cb) {
    this._eventBus.connect(name, cb);
  }

  setColourEncodingType(encodingType) {
    this._encodingTypeToSet = encodingType;
  }

  _loadRomCallback(name, binaryString) {
    this._newRomWaiting = true;
    this._newRomLoaded = {
      name: name,
      binaryString: binaryString
    };
  }

  start(options) {
    this._options = options || {};
    this._options.triggerFrameRenderedEvent = this._options.triggerFrameRenderedEvent === undefined ? false : this._options.triggerFrameRenderedEvent;
    this._options.createGuiComponents = !!this._options.createGuiComponents;

    var that = this;

    // window.addEventListener('contextmenu', function(event) {
    //   event.preventDefault();
    // }, false);
    //
    //

    this._fpsMeter = new Stats();
    this._fpsMeter.showPanel( 1 );
    document.body.appendChild( this._fpsMeter.dom );
    // this._fpsMeter.hide();



    this._canvasParent = new CanvasParent();
    this._renderSurface = null;
    if (webGlSupported()) {
      this._renderSurface = new WebGlRenderSurface(this._canvasParent);
    } else {
      this._renderSurface = new CanvasRenderSurface(this._canvasParent);
    }

    this._mainboard = new Mainboard(this._renderSurface);
    this._mainboard.connect('reset', ::this._onReset);

    // if (this._options.createGuiComponents) {
      // this._ggDialog = new Gui.GameGenieDialog(this);
      // this._controlBar = new Gui.ControlBar(this);
      // this._controlBar.connect('romLoaded', function(name, binaryString) {
        // that._loadRomCallback(name, binaryString);
      // });
      // this._keyboardRemapDialog = new Gui.KeyboardRemapper(this);
    // }
    this._input = new Input(this._mainboard);

    this._stateManager = new StateManager(this, this._options.createGuiComponents);

    this.animate();
  }


  pause(isPaused) {
    const changed = isPaused !== this._isPaused;
    this._isPaused = isPaused;

    if (changed) {
      this._eventBus.invoke('isPausedChange', isPaused);
    }
  }


  isPaused() {
    return this._isPaused;
  }


  _onReset() {
    this._calculateFrameTimeTarget();
  }

  _calculateFrameTimeTarget() {
    if (this._gameSpeed > 0) {
      const base = (100000 / this._gameSpeed); // 100000 = 1000 * 100 ( 1000 milliseconds, multiplied by 100 as gameSpeed is a %)
      this._frameTimeTarget = (base / COLOUR_ENCODING_REFRESHRATE);
    }
  }


  reset() {
    this._mainboard.reset();
  }


  playOneFrame() {
    this.pause(false);
    this._pauseNextFrame = true;
  }


  playUntilFrame(frameNum) {
    this.pause(false);
    this._pauseOnFrame = frameNum;
  }


  enableSound(enable) {
    this._mainboard.enableSound(enable);
  }


  soundEnabled() {
    return this._mainboard.apu.soundEnabled();
  }


  soundSupported() {
    return this._mainboard.apu.soundSupported();
  }


  setVolume(val) {
    this._mainboard.setVolume(val);
  }


  setGameSpeed(gameSpeed) {
    this._gameSpeed = gameSpeed;
    this._calculateFrameTimeTarget();
  }


  setTraceOption(traceType, checked) {
    this._mainboard.setTraceOption(traceType, checked);
  }


  _readyToRender() {
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


  showFpsMeter(show) {
    if (show) {
      // this._fpsMeter.show();
    } else {
      // this._fpsMeter.hide();
    }
  }


  startTrace() {
    this._eventBus.invoke('traceRunning', true);
    // if ( traceType === 'cpuInstructions' ) {
    this._mainboard.cpu.enableTrace(true);
    // }
    Trace.start();
  }


  stopTrace() {
    Trace.stop();
    this._mainboard.cpu.enableTrace(false);
    this._eventBus.invoke('traceRunning', false);
  }


  screenshot() {
    this._renderSurface.screenshotToFile();
  }

  _animate() {
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

  _doRomLoad(name, binaryString) {
    var that = this;
    this._cart = new Cartridge(this._mainboard);
    this._cart.loadRom(name, binaryString, function(err) {
      if (!err) {
        that._romLoaded = true;
      } else {
        that._showError(err);
      }
    });
  }

  loadRomFromUrl(url) {
    var that = this;
    loadRomFromUrl(url, function(err, name, binary) {
      if (!err) {
        that._loadRomCallback(name, binary);
      } else {
        that._showError(err);
      }
    });
  }

  _showError(err) {
    console.log(err);
    var errorType = typeof err;
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

  enterGameGenieCode(code) {
    processGenieCode(this._mainboard, code, true);
  }

  loadShaderFromUrl(url) {
    if (this._renderSurface.loadShaderFromUrl) {
      this._renderSurface.loadShaderFromUrl(url);
    }
  }
}
