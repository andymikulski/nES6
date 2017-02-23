import { EventBus } from './Event';
import Memory from './Memory';
import PPU from './PPU';
import RenderBuffer from './PPU/RenderBuffer';
import APULegacy from './APU/APULegacy';
import InputDeviceBus from './controls/InputDeviceBus';
import Synchroniser from './Synchroniser';
import CPU from './CPU/Cpu6502';

import { enableType, trace_all, trace_cpuInstructions } from '../utils/Trace';

export default class Mainboard {
  constructor(renderSurface) {
    this.running = false;
    this.cart = null;
    this._eventBus = new EventBus();

    this.memory = new Memory(this);
    this.ppu = new PPU(this);
    this.apu = new APULegacy(this);
    this.inputdevicebus = new InputDeviceBus();
    this.cpu = new CPU(this);

    this.renderBuffer = new RenderBuffer(this, renderSurface);

    this.synchroniser = new Synchroniser(this);
    this.synchroniser.connect('frameEnd', ::this._onFrameEnd);
    this.synchroniser.addObject('ppu', this.ppu);
    this.synchroniser.addObject('apu', this.apu);

    this.ppu.hookSyncEvents(this.synchroniser);

    this.enableSound(true);
  }


  connect(name, cb) {
    this._eventBus.connect(name, cb);
  }


  enableSound(enable) {
    this.apu.enableSound(enable);
    this._eventBus.invoke('soundEnabled', this.apu.soundEnabled(), this.apu.soundSupported());
  }

  setVolume(val) {
    this.apu.setVolume(val);
  }

  setTraceOption(traceType, checked) {
    if (traceType === trace_all || traceType === trace_cpuInstructions) {
      this.cpu.enableTrace(checked); // cpu instructions require different code path, needs to be invoked seperately
    }
    enableType(traceType, checked);
  }

  _onFrameEnd() {
    this.running = false;
    this._eventBus.invoke('frameEnd');
  }

  doFrame() {
    if (this.cart) {
      this.running = true;
      while (this.running) { // keep going until a frame is rendered
        this.synchroniser.runCycle();
      }
    }
  }

  loadCartridge(cart) {
    this.cart = cart;
    this.synchroniser.addObject('mapper', this.cart.memoryMapper);

    this.reset(true);
    this._eventBus.invoke('romLoaded', this.cart);
  }

  powerButton(on) {
    var isOn = on && this.cart;
    if (isOn) {
      this.reset();
    } else {
      this.running = false;
      this.cart = null;
    }
    this._eventBus.invoke('power', isOn);
  }

  reset(cold) {
    cold = cold === undefined ? true : cold;
    if (this.cart)
      this.cart.reset(cold);
    this._eventBus.invoke('reset', cold);
  }

  saveState() {
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

  loadState(data) {
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
}
