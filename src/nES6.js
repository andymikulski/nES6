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

export default class nES6 extends EventBus {
  constructor(options) {
    super();

    // validate the options object before doing anything
    validateObject({
      plugins: { is: Array, with: Function },
      render: ['auto', 'canvas', 'webgl', 'headless'],
      audio: { is: Boolean },
      forceTimeSync: { is: Boolean },
      fps: { is: Boolean },
    }, options);
    // if we're still here, then the options are all good

    this.options = options || {};

    this.cart = null;
    this.romLoaded = false;
    this.mainboard = null;
    this.renderSurface = null;
    this.fpsMeter = null;
    this.spriteDisplay = null;
    this.paletteDisplay = null;
    this.logWindow = null;
    this.encodingTypeToSet = '';
    this.newRomWaiting = false;
    this.newRomLoaded = {
      name: '',
      binaryString: null
    };

    this.frameTimeTarget = 0;
    this.lastFrameTime = 0;
    this.gameSpeed = 100; // 100% normal speed

    this.isPaused = 0;
    this.pauseNextFrame = false;
    this.pauseOnFrame = -1;

    this.animate = ::this.animate;

    window.onerror = ::this.showError;


    // Apply plugins
    if (this.options.plugins) {
      this.addPlugins(this.options.plugins);
    }
  }

  addPlugins(plugs) {
    const plugins = plugs instanceof Array ? plugs : [plugs];
    // Pass this nES6 instance to each plugin
    plugins.map(plugin=>plugin(this));
  }

  connect(name, cb) {
    this.connect(name, cb);
  }

  setColourEncodingType(encodingType) {
    this.encodingTypeToSet = encodingType;
  }

  _loadRomCallback(name, binaryString) {
    this.newRomWaiting = true;
    this.newRomLoaded = {
      name,
      binaryString: binaryString instanceof Uint8Array
        ? binaryString : new Uint8Array(binaryString),
    };
  }

  start() {
    if (this.options.fps) {
      this.fpsMeter = new Stats();
      this.fpsMeter.showPanel( 1 );
      document.body.appendChild( this.fpsMeter.dom );
    }

    this.renderSurface = this.createRenderSurface();

    this.mainboard = new Mainboard(this.renderSurface);
    this.mainboard.connect('reset', ::this.onReset);

    // disable audio for headless rendering
    if (this.options.render === 'headless'
      || this.options.audio === false) {
      this.mainboard.enableSound(false);
    }

    this.animate();
  }


  pause(isPaused) {
    const changed = isPaused !== this.isPaused;
    this.isPaused = isPaused;

    if (changed) {
      this.invoke('isPausedChange', isPaused);
    }
  }


  isPaused() {
    return this.isPaused;
  }


  _onReset() {
    this.calculateFrameTimeTarget();
  }

  _calculateFrameTimeTarget() {
    if (this.gameSpeed) {
      const base = (100000 / this.gameSpeed); // 100000 = 1000 * 100 ( 1000 milliseconds, multiplied by 100 as gameSpeed is a %)
      this.frameTimeTarget = (base / COLOUR_ENCODING_REFRESHRATE);
    }
  }


  reset() {
    this.mainboard.reset();
  }


  playOneFrame() {
    this.pause(false);
    this.pauseNextFrame = true;
  }


  playUntilFrame(frameNum) {
    this.pause(false);
    this.pauseOnFrame = frameNum;
  }


  enableSound(enable) {
    this.mainboard.enableSound(enable);
  }


  soundEnabled() {
    return this.mainboard.apu.soundEnabled();
  }


  soundSupported() {
    return this.mainboard.apu.soundSupported();
  }


  setVolume(val) {
    this.mainboard.setVolume(val);
  }


  setGameSpeed(gameSpeed) {
    this.gameSpeed = gameSpeed;
    this.calculateFrameTimeTarget();
  }


  setTraceOption(traceType, checked) {
    this.mainboard.setTraceOption(traceType, checked);
  }


  _readyToRender() {
    if (this.gameSpeed <= 0) {
      return true;
    }
    var now = performance ? performance.now() : Date.now(); // Date.now() in unsupported browsers
    var diff = now - (this.lastFrameTime || 0);
    if (diff >= this.frameTimeTarget) {
      this.lastFrameTime = now;
      return true;
    } else {
      return false;
    }
  }


  startTrace() {
    this.invoke('traceRunning', true);
    // if ( traceType === 'cpuInstructions' ) {
    this.mainboard.cpu.enableTrace(true);
    // }
    Trace.start();
  }


  stopTrace() {
    Trace.stop();
    this.mainboard.cpu.enableTrace(false);
    this.invoke('traceRunning', false);
  }


  screenshot() {
    this.renderSurface.screenshotToFile();
  }

  _animate() {
    if ((this.options.forceTimeSync || this.gameSpeed !== 100) && !this.readyToRender()) {
      requestAnimationFrame(this.animate);
      return;
    }

    if (this.fpsMeter) {
      this.fpsMeter.begin();
    }

    if (this.newRomWaiting) {
      this.doRomLoad(this.newRomLoaded);
      this.newRomWaiting = false;
    }

    if (this.romLoaded) {
      this.romLoaded = false;
      this.mainboard.loadCartridge(this.cart);
      this.invoke('cartLoaded', this.cart);
    }

    if (this.isPaused) {
      if (this.fpsMeter) {
        this.fpsMeter.end();
      }
      setTimeout(this.animate, 300);
      return;
    }

    var bgColour = this.mainboard.renderBuffer.pickColour(this.mainboard.ppu.getBackgroundPaletteIndex());
    this.renderSurface.clearBuffers(bgColour);
    this.mainboard.renderBuffer.clearBuffer();

    this.mainboard.doFrame();
    this.renderSurface.render(this.mainboard);

    if (this.fpsMeter) {
      this.fpsMeter.end();
    }

    requestAnimationFrame(this.animate);
  }

  exportState(fullSave){
    return this.mainboard.saveState(fullSave);
  }

  importState(loadedData){
    return this.mainboard.loadState(loadedData);
  }

  _doRomLoad({
    name,
    binaryString
  }) {
    this.cart = new Cartridge(this.mainboard);
    this.cart.loadRom({
      name,
      binaryString,
      fileSize: binaryString.length / 1000 // in KB
    })
    .catch(::this.showError)
    .then(()=>{
      this.romLoaded = true;
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
    this.loadRomCallback(name, binaryString);
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
    this.invoke('romLoadFailure', msg);
  }

  enterGameGenieCode(code) {
    processGenieCode(this.mainboard, code, true);
  }

  loadShaderFromUrl(url) {
    if (this.renderSurface.loadShaderFromUrl) {
      this.renderSurface.loadShaderFromUrl(url);
    }
  }

  pressControllerButton(playerNum, button) {
    var joypad = this.mainboard.inputdevicebus.getJoypad(playerNum);
    const buttonIdPressed = JOYPAD_NAME_TO_ID(button);

    if (typeof buttonIdPressed !== 'undefined') {
      joypad.pressButton( buttonIdPressed, true );
    }
  }

  depressControllerButton(playerNum, button) {
    var joypad = this.mainboard.inputdevicebus.getJoypad(playerNum);
    const buttonIdPressed = JOYPAD_NAME_TO_ID(button);

    if (typeof buttonIdPressed !== 'undefined') {
      joypad.pressButton( buttonIdPressed, false );
    }
  }

  createRenderSurface(type = this.options.render) {
    let surface;

    this.canvasParent = this.canvasParent || new CanvasParent();

    switch (type) {
      // headless render
      case 'headless':
        surface = new HeadlessRenderSurface();
        break;
      // canvas render
      case 'canvas':
        surface = new CanvasRenderSurface(this.canvasParent);
        break;
      // webgl is the same as auto - webgl will run if possible but will
      // fallback to canvas automatically
      case 'webgl':
      case 'auto':
      default:
        if (webGlSupported()) {
          surface = new WebGlRenderSurface(this.canvasParent);
        } else {
          surface = new CanvasRenderSurface(this.canvasParent);
        }
        break;
    }

    return surface;
  }

  setRenderer(type) {
    this.renderSurface = this.createRenderSurface(type);
    this.mainboard.renderBuffer._renderSurface = this.renderSurface;
    // this will come back to haunt me
    this.mainboard.enableSound(type !== 'headless');
  }
}
