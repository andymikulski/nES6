import { EventBus } from './Event';
import Memory from './Memory';
import PPU from './PPU';
import RenderBuffer from './PPU/RenderBuffer';
import APULegacy from './APU/APULegacy';
import InputDeviceBus from './controls/InputDeviceBus';
import Synchroniser from './Synchroniser';
import CPU from './CPU/Cpu6502';

import { enableType, trace_all, trace_cpuInstructions } from '../utils/Trace';

export default class Mainboard extends EventBus {
  constructor(renderSurface) {
    super();

    this.running = false;
    this.cart = null;

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


  enableSound(enable) {
    this.apu.enableSound(enable);
    this.invoke('soundEnabled', this.apu.soundEnabled(), this.apu.soundSupported());
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
    this.invoke('frameEnd');
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
    this.invoke('romLoaded', this.cart);
  }

  powerButton(on) {
    var isOn = on && this.cart;
    if (isOn) {
      this.reset();
    } else {
      this.running = false;
      this.cart = null;
    }
    this.invoke('power', isOn);
  }

  reset(cold) {
    cold = cold === undefined ? true : cold;
    if (this.cart) {
      this.cart.reset(cold);
    }
    this.invoke('reset', cold);
  }

  saveState(fullSave) {
    var data = {};
    data.memory = this.memory.saveState();
    data.cpu = this.cpu.saveState();
    data.ppu = this.ppu.saveState();

    if (fullSave) {
      data.apu = this.apu.saveState();
      data.joypad1 = this.joypad1.saveState();
      data.synchroniser = this.synchroniser.saveState();
      data.renderBuffer = this.renderBuffer.saveState();
    }

    if (this.cart && this.cart.memoryMapper) {
      data.memoryMapper = this.cart.memoryMapper.saveState();
    }
    return data;
  }

  loadState(data) {
    for(const prop in data) {
      if(this[prop] && this[prop].loadState){
        this[prop].loadState(data[prop]);
      }
    }

    if (data.memoryMapper && this.cart && this.cart.memoryMapper) {
      this.cart.memoryMapper.loadState(data.memoryMapper);
    }
  }
}
