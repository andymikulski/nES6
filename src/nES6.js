import Stats from 'stats.js';

import { EventBus } from './nes/Event';
import Mainboard from './nes/Mainboard';
import Cartridge from './nes/Cartridge';
import Trace from './utils/Trace';
import { loadRomFromUrl } from './utils/loadRom';
import { processGenieCode } from './utils/gameGenie';
import validateObject from './utils/validateObject';

import CanvasParent from './gui/CanvasParent';
import HeadlessRenderSurface from './gui/headless/HeadlessRenderSurface';
import WebGlRenderSurface from './gui/webgl/WebGlRenderSurface';
import { webGlSupported } from './gui/webgl/utils';
import CanvasRenderSurface from './gui/canvas/CanvasRenderSurface';

import {
  COLOUR_ENCODING_REFRESHRATE,
  JOYPAD_NAME_TO_ID,
} from './config/consts.js';

export default class nES6 {
  constructor(options) {
    // validate the options object before doing anything
    validateObject({
      plugins: { is: Array, with: Function },
      render: ['auto', 'canvas', 'webgl', 'headless'],
      audio: { is: Boolean },
      fps: { is: Boolean },
    }, options);
    // if we're still here, then the options are all good

    this._options = options || {};

    this._cart = null;
    this._romLoaded = false;
    this._mainboard = null;
    this._renderSurface = null;
    this._fpsMeter = null;
    this._spriteDisplay = null;
    this._paletteDisplay = null;
    this._logWindow = null;
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

    this.animate = ::this._animate;

    window.onerror = ::this._showError;

    // Apply plugins
    if (this._options.plugins) {
      // Pass this nES6 instance to each plugin
      this._options.plugins.map(plugin=>plugin(this));
    }
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
      name,
      binaryString: binaryString instanceof Uint8Array
        ? binaryString : new Uint8Array(binaryString),
    };
  }

  start() {
    if (this._options['fps']) {
      this._fpsMeter = new Stats();
      this._fpsMeter.showPanel( 1 );
      document.body.appendChild( this._fpsMeter.dom );
    }


    this._canvasParent = new CanvasParent();
    this._renderSurface = null;

    switch (this._options['render']) {
      // headless render
      case 'headless':
        this._renderSurface = new HeadlessRenderSurface();
        break;
      // canvas render
      case 'canvas':
        this._renderSurface = new CanvasRenderSurface(this._canvasParent);
        break;
      // webgl is the same as auto - webgl will run if possible but will
      // fallback to canvas automatically
      case 'webgl':
      case 'auto':
      default:
        if (webGlSupported()) {
          this._renderSurface = new WebGlRenderSurface(this._canvasParent);
        } else {
          this._renderSurface = new CanvasRenderSurface(this._canvasParent);
        }
        break;
    }

    this._mainboard = new Mainboard(this._renderSurface);
    this._mainboard.connect('reset', ::this._onReset);

    // disable audio for headless rendering
    if (this._options['render'] === 'headless'
      || this._options['audio'] === false) {
      this._mainboard.enableSound(false);
    }

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
    if (this._gameSpeed) {
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
    var diff = now - (this._lastFrameTime || 0);
    if (diff >= this._frameTimeTarget) {
      this._lastFrameTime = now;
      return true;
    } else {
      return false;
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
    if (this._gameSpeed !== 100 && !this._readyToRender()) {
      requestAnimationFrame(this.animate);
      return;
    }

    if (this._fpsMeter) {
      this._fpsMeter.begin();
    }

    if (this._newRomWaiting) {
      this._doRomLoad(this._newRomLoaded);
      this._newRomWaiting = false;
    }

    if (this._romLoaded) {
      this._romLoaded = false;
      this._mainboard.loadCartridge(this._cart);
      this._eventBus.invoke('cartLoaded', this._cart);
    }

    if (this._isPaused) {
      if (this._fpsMeter) {
        this._fpsMeter.end();
      }
      setTimeout(this.animate, 300);
      return;
    }

    var bgColour = this._mainboard.renderBuffer.pickColour(this._mainboard.ppu.getBackgroundPaletteIndex());
    this._renderSurface.clearBuffers(bgColour);
    this._mainboard.renderBuffer.clearBuffer();

    this._mainboard.doFrame();
    this._renderSurface.render(this._mainboard);

    if (this._fpsMeter) {
      this._fpsMeter.end();
    }

    requestAnimationFrame(this.animate);
  }

  exportState(){
    return this._mainboard.saveState();
  }

  importState(loadedData){
    return this._mainboard.loadState(loadedData);
  }

  _doRomLoad({
    name,
    binaryString
  }) {
    this._cart = new Cartridge(this._mainboard);
    this._cart.loadRom({
      name,
      binaryString,
      fileSize: binaryString.length / 1000 // in KB
    })
    .catch(::this._showError)
    .then(()=>{
      this._romLoaded = true;
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

  /**
   * Given a Binary string (and an optional ROM name), loads the ROM into
   * this nES6 instance's memory. Manages casting the string to the proper
   * format for end developer.
   *
   * @param  {String} binaryString  ROM file as a binary string
   * @param  {String} name?         Optional ROM name (default: 'Game')
   * @return {void}
   */
  loadRomFromBinary(binaryString, name = 'Game') {
    this._loadRomCallback(name, binaryString);
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

  pressControllerButton(playerNum, button) {
    var joypad = this._mainboard.inputdevicebus.getJoypad(playerNum);
    const buttonIdPressed = JOYPAD_NAME_TO_ID(button);

    if (typeof buttonIdPressed !== 'undefined') {
      joypad.pressButton( buttonIdPressed, true );
    }
  }

  depressControllerButton(playerNum, button) {
    var joypad = this._mainboard.inputdevicebus.getJoypad(playerNum);
    const buttonIdPressed = JOYPAD_NAME_TO_ID(button);

    if (typeof buttonIdPressed !== 'undefined') {
      joypad.pressButton( buttonIdPressed, false );
    }
  }
}
