import BaseMapper from './BaseMapper.js';
import {
  uintArrayToString,
  stringToUintArray,
} from '../../utils/serialisation';

export default class Mapper5 extends BaseMapper {
  init() {
    this.mRenderingEnabled = false;

    this.chrMode = 0;
    this.prgMode = 0;
    this.exRamMode = 0;
    this.prgRegisters = new Int32Array(4);
    this.nameTableFill = new Int32Array(1024);
    this.internalExRam = new Int32Array(1024);
    this.prgRam = new Int32Array(0x10000); // 64kb
    this.prgRamPage = 0;
    this.bigSpritesEnabled = false;

    this.writeProtectA = false;
    this.writeProtectB = false;
    this.currentScanline = 0;
    this.irqEnabled = false;
    this.irqActive = false;
    this.irqScanlineTrigger = 0;
    this.triggerMtc = -1;
    this.multiplier1 = 0;
    this.multiplier2 = 0;

    this.prgRamMap = new Int32Array(4); // 8k ram banks that map to 0x8000 -> 0x10000
    this.prgRamIsActive = new Int32Array(4);
    this.nameTableMap = new Int32Array(4);

    this.chrRegsA = new Int32Array(8);
    this.chrRegsB = new Int32Array(4);
    this.chrUseBMap = false;
    this.chrMapA = new Int32Array(8);
    this.chrMapB = new Int32Array(4);
    this.chrHighBits = 0;
  }

  mapperSaveState(state) {
    state.mRenderingEnabled = this.mRenderingEnabled;
    state.chrMode = this.chrMode;
    state.prgMode = this.prgMode;
    state.exRamMode = this.exRamMode;

    state.prgRegisters = uintArrayToString(this.prgRegisters);
    state.nameTableFill = uintArrayToString(this.nameTableFill);
    state.internalExRam = uintArrayToString(this.internalExRam);
    state.prgRam = uintArrayToString(this.prgRam);

    state.prgRamPage = this.prgRamPage;
    state.bigSpritesEnabled = this.bigSpritesEnabled;

    state.writeProtectA = this.writeProtectA;
    state.writeProtectB = this.writeProtectB;
    state.currentScanline = this.currentScanline;
    state.irqEnabled = this.irqEnabled;
    state.irqActive = this.irqActive;
    state.irqScanlineTrigger = this.irqScanlineTrigger;
    state.triggerMtc = this.triggerMtc;
    state.multiplier1 = this.multiplier1;
    state.multiplier2 = this.multiplier2;

    state.prgRamMap = uintArrayToString(this.prgRamMap);
    state.prgRamIsActive = uintArrayToString(this.prgRamIsActive);
    state.nameTableMap = uintArrayToString(this.nameTableMap);

    state.chrRegsA = uintArrayToString(this.chrRegsA);
    state.chrRegsB = uintArrayToString(this.chrRegsB);

    state.chrUseBMap = this.chrUseBMap;
    state.chrMapA = uintArrayToString(this.chrMapA);
    state.chrMapB = uintArrayToString(this.chrMapB);
    state.chrHighBits = this.chrHighBits;
  }

  mapperLoadState(state) {
    this.mRenderingEnabled = state.mRenderingEnabled;
    this.chrMode = state.chrMode;
    this.prgMode = state.prgMode;
    this.exRamMode = state.exRamMode;

    this.prgRegisters = stringToUintArray(state.prgRegisters);
    this.nameTableFill = stringToUintArray(state.nameTableFill);
    this.internalExRam = stringToUintArray(state.internalExRam);
    this.prgRam = stringToUintArray(state.prgRam);

    this.prgRamPage = state.prgRamPage;
    this.bigSpritesEnabled = state.bigSpritesEnabled;

    this.writeProtectA = state.writeProtectA;
    this.writeProtectB = state.writeProtectB;
    this.currentScanline = state.currentScanline;
    this.irqEnabled = state.irqEnabled;
    this.irqActive = state.irqActive;
    this.irqScanlineTrigger = state.irqScanlineTrigger;
    this.triggerMtc = state.triggerMtc;
    this.multiplier1 = state.multiplier1;
    this.multiplier2 = state.multiplier2;

    this.prgRamMap = stringToUintArray(state.prgRamMap);
    this.prgRamIsActive = stringToUintArray(state.prgRamIsActive);
    this.nameTableMap = stringToUintArray(state.nameTableMap);

    this.chrRegsA = stringToUintArray(state.chrRegsA);
    this.chrRegsB = stringToUintArray(state.chrRegsB);

    this.chrUseBMap = state.chrUseBMap;
    this.chrMapA = stringToUintArray(state.chrMapA);
    this.chrMapB = stringToUintArray(state.chrMapB);
    this.chrHighBits = state.chrHighBits;
  }


  reset() {
    this.mRenderingEnabled = false;
    this.chrMode = 0;
    this.prgMode = 3;
    this.exRamMode = 0;
    this.chrHighBits = 0;
    this.prgRamPage = 0;
    this.writeProtectA = false;
    this.writeProtectB = false;
    this.irqEnabled = false;
    this.irqScanlineTrigger = 0;
    this.irqActive = false;
    this.multiplier1 = 0;
    this.multiplier2 = 0;
    this.currentScanline = 0;
    this.triggerMtc = -1;
    this.chrUseBMap = false;
    this.bigSpritesEnabled = false;

    for (var i = 0; i < this.prgRamMap.length; ++i) {
      this.prgRamMap[i] = 0;
      this.prgRamIsActive[i] = 0;
    }
    for (var i = 0; i < this.nameTableMap.length; ++i) {
      this.nameTableMap[i] = 0;
    }

    for (var i = 0; i < this.prgRegisters.length; ++i) {
      this.prgRegisters[i] = this.get8kPrgBankCount() - 4 + i;
    }
    for (var i = 0; i < this.chrRegsA.length; ++i) {
      this.chrRegsA[i] = 0;
    }
    for (var i = 0; i < this.chrRegsB.length; ++i) {
      this.chrRegsB[i] = 0;
    }
    for (var i = 0; i < this.chrMapA.length; ++i) {
      this.chrMapA[i] = 0;
    }
    for (var i = 0; i < this.chrMapB.length; ++i) {
      this.chrMapB[i] = 0;
    }
    this.syncPrg();
    this.syncChr();
    this.switch8kChrBank(0);

    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod);

    // TODO: Need to remove this event on mapper unload
    const that = this;
    this.irqEventId = this.mainboard.synchroniser.addEvent('mmc5 irq', -1, (eventTime) => { that.irqEvent(eventTime); });
  }

  renderingEnabledChanged(enabled) {
    this.mRenderingEnabled = enabled;
    this.predictIrq(this.mainboard.synchroniser.getCpuMTC());
  }

  irqEvent(eventTime) {
    if (this.mRenderingEnabled && !this.irqActive && this.irqEnabled && this.irqScanlineTrigger > 0) {
      this.irqActive = true;
      this.mainboard.cpu.holdIrqLineLow(true);
    }
    this.predictIrq(eventTime);
  }

  syncPrg() {
    this.mainboard.synchroniser.synchronise();

    for (let i = 0; i < this.prgRamMap.length; ++i) {
      this.prgRamMap[i] = 0;
      this.prgRamIsActive[i] = 0;
    }

    switch (this.prgMode) {
      default:
      case 0:
        // 32k bank at 0x8000
        this.switch32kPrgBank((this.prgRegisters[3] & 0x7f) >> 2);
        break;
      case 1:
        // 16k bank at 0x8000
        if ((this.prgRegisters[1] & 0x80) === 0) {
          this.prgRamIsActive[0] = 1;
          this.prgRamIsActive[1] = 1;
          this.prgRamMap[0] = ((this.prgRegisters[1] & 0xE) >> 1) * 2;
          this.prgRamMap[1] = this.prgRamMap[0] + 1;
        } else {
          this.switch16kPrgBank((this.prgRegisters[1] & 0x7f) >> 1, true);
        }
        // 16k bank at 0xC000
        this.switch16kPrgBank((this.prgRegisters[3] & 0x7f) >> 1, false);
        break;
      case 2:
        // 8k bank at 0xE000
        this.switch8kPrgBank((this.prgRegisters[3] & 0x7f), 3);

        // 8k bank at 0xC000
        if ((this.prgRegisters[2] & 0x80) === 0) {
          this.prgRamIsActive[2] = 1;
          this.prgRamMap[2] = (this.prgRegisters[2] & 0x7);
        } else {
          this.switch8kPrgBank((this.prgRegisters[2] & 0x7f), 2);
        }

        // 16k bank at 0x8000
        if ((this.prgRegisters[1] & 0x80) === 0) {
          this.prgRamIsActive[0] = 1;
          this.prgRamIsActive[1] = 1;
          this.prgRamMap[0] = ((this.prgRegisters[1] & 0xE) >> 1) * 2;
          this.prgRamMap[1] = this.prgRamMap[0] + 1;
        } else {
          this.switch16kPrgBank((this.prgRegisters[1] & 0x7f) >> 1, true);
        }
        break;
      case 3:
        // 8k bank at 0xE000
        this.switch8kPrgBank((this.prgRegisters[3] & 0x7f), 3);
        // 8k bank at 0xC000
        if ((this.prgRegisters[2] & 0x80) === 0) {
          this.prgRamIsActive[2] = 1;
          this.prgRamMap[2] = this.prgRegisters[2] & 0x7;
        } else {
          this.switch8kPrgBank((this.prgRegisters[2] & 0x7f), 2);
        }
        // 8k bank at 0xA000
        if ((this.prgRegisters[1] & 0x80) === 0) {
          this.prgRamIsActive[1] = 1;
          this.prgRamMap[1] = this.prgRegisters[1] & 0x7;
        } else {
          this.switch8kPrgBank((this.prgRegisters[1] & 0x7f), 1);
        }
        // 8k bank at 0x8000
        if ((this.prgRegisters[0] & 0x80) === 0) {
          this.prgRamIsActive[0] = 1;
          this.prgRamMap[0] = this.prgRegisters[0] & 0x7;
        } else {
          this.switch8kPrgBank((this.prgRegisters[0] & 0x7f), 0);
        }
        break;
    }
  }


  chrBank(chrMap, banksize, bankpos, banknum) {
    for (let i = 0; i < banksize; ++i) {
      chrMap[i + bankpos] = (banknum + i) % this.get1kChrBankCount();
    }
  }


  syncChr() {
    this.mainboard.synchroniser.synchronise();

    switch (this.chrMode) {
      default:
      case 0:
        this.chrBank(this.chrMapA, 8, 0, this.chrRegsA[7]);
        this.chrBank(this.chrMapB, 4, 0, this.chrRegsB[3]);
        break;
      case 1:
        this.chrBank(this.chrMapA, 4, 0, this.chrRegsA[3]);
        this.chrBank(this.chrMapA, 4, 4, this.chrRegsA[7]);
        this.chrBank(this.chrMapB, 4, 0, this.chrRegsB[3]);
        break;
      case 2:
        this.chrBank(this.chrMapA, 2, 0, this.chrRegsA[1]);
        this.chrBank(this.chrMapA, 2, 2, this.chrRegsA[3]);
        this.chrBank(this.chrMapA, 2, 4, this.chrRegsA[5]);
        this.chrBank(this.chrMapA, 2, 6, this.chrRegsA[7]);
        this.chrBank(this.chrMapB, 2, 0, this.chrRegsB[1]);
        this.chrBank(this.chrMapB, 2, 2, this.chrRegsB[3]);
        break;
      case 3:
        for (var i = 0; i < 8; ++i) {
          this.chrBank(this.chrMapA, 1, i, this.chrRegsA[i]);
        }
        for (var i = 0; i < 4; ++i) {
          this.chrBank(this.chrMapB, 1, i, this.chrRegsB[i]);
        }
        break;
    }
  }

  write8PrgRom(offset, data) {
    if (this.writeProtectA && this.writeProtectB) {
      const top3Bits = (offset & 0xE000) >> 13;
      if (this.prgRamIsActive[top3Bits] === 1) {
        this.prgRam[(this.prgRamMap[top3Bits] << 13) | (offset & 0x1FFF)] = data;
      } else {
        BaseMapper.prototype.write8PrgRom.call(this, offset, data);
      }
    }
  }

  read8PrgRom(offset) {
    const top3Bits = (offset & 0xE000) >> 13;
    if (this.prgRamIsActive[top3Bits] === 1) {
      return this.prgRam[(this.prgRamMap[top3Bits] << 13) | (offset & 0x1FFF)]; // this.prgRamMap[0] * 0x2000 + ( offset % 0x2000 ) ];
    }
    return BaseMapper.prototype.read8PrgRom.call(this, offset);
  }

  onEndFrame() {
    this.predictIrq(0);
  }

  predictIrq(cpuMTC) {
    // TODO: Check if MMC5 counter includes pre-render scanline
    if (this.mRenderingEnabled && !this.irqActive && this.irqEnabled && this.irqScanlineTrigger > 0) {
      const targetScanline = this.irqScanlineTrigger;
      const triggerMtc = this.mainboard.ppu.screenCoordinatesToTicks(0, targetScanline);
      if (triggerMtc > cpuMTC) {
        if (this.triggerMtc !== triggerMtc) {
          // var pos = this.mainboard.ppu.ticksToScreenCoordinates( triggerMtc );
          this.mainboard.synchroniser.changeEventTime(this.irqEventId, triggerMtc);
          this.triggerMtc = triggerMtc;
        }
      }
      return;
    }

    if (this.triggerMtc !== -1) {
      this.triggerMtc = -1;
      this.mainboard.synchroniser.changeEventTime(this.irqEventId, -1);
    }
  }

  write8EXRam(offset, data) {
    // 0x4018 -> 0x6000
    switch (offset) {
      case 0x5100: // PRG mode
        this.prgMode = data & 0x3;
        this.syncPrg();
        break;
      case 0x5101: // CHR mode
        this.chrMode = data & 0x3;
        this.syncChr();
        break;
      case 0x5102: // PRG RAM write protect 1
        this.writeProtectA = (data & 0x3) === 0x2;
        break;
      case 0x5103: // PRG RAM write protect 2
        this.writeProtectB = (data & 0x3) === 0x1;
        break;
      case 0x5104: // extended RAM mode
        this.mainboard.synchroniser.synchronise();
        this.exRamMode = data & 0x3;
        break;
      case 0x5105: // nametable mode
        this.mainboard.synchroniser.synchronise();
        this.setNametableMirroring(data);
        break;
      case 0x5106: // fill mode tile number
        this.mainboard.synchroniser.synchronise();
        for (var i = 0; i < (32 * 30); ++i) {
          this.nameTableFill[i] = data;
        }
        break;
      case 0x5107: // fill mode colour
        this.mainboard.synchroniser.synchronise();
        var attribute = data & 0x3 + (data & 3) << 2 + (data & 3) << 4 + (data & 3) << 6;
        for (var i = (32 * 30); i < this.nameTableFill.length; ++i) {
          this.nameTableFill[i] = attribute;
        }
        break;
      case 0x5113: // prg ram bank
        this.prgRamPage = data & 0x7;
        break;
      case 0x5114: // prg bank 0
        this.prgRegisters[0] = data;
        this.syncPrg();
        break;
      case 0x5115: // prg bank 1
        this.prgRegisters[1] = data;
        this.syncPrg();
        break;
      case 0x5116: // prg bank 2
        this.prgRegisters[2] = data;
        this.syncPrg();
        break;
      case 0x5117: // prg bank 3
        this.prgRegisters[3] = data;
        this.syncPrg();
        break;
      case 0x5120: // chr registers A
        this.chrRegsA[0] = data | this.chrHighBits;
        this.chrUseBMap = false;
        this.syncChr();
        break;
      case 0x5121:
        this.chrRegsA[1] = data | this.chrHighBits;
        this.chrUseBMap = false;
        this.syncChr();
        break;
      case 0x5122:
        this.chrRegsA[2] = data | this.chrHighBits;
        this.chrUseBMap = false;
        this.syncChr();
        break;
      case 0x5123:
        this.chrRegsA[3] = data | this.chrHighBits;
        this.chrUseBMap = false;
        this.syncChr();
        break;
      case 0x5124:
        this.chrRegsA[4] = data | this.chrHighBits;
        this.chrUseBMap = false;
        this.syncChr();
        break;
      case 0x5125:
        this.chrRegsA[5] = data | this.chrHighBits;
        this.chrUseBMap = false;
        this.syncChr();
        break;
      case 0x5126:
        this.chrRegsA[6] = data | this.chrHighBits;
        this.chrUseBMap = false;
        this.syncChr();
        break;
      case 0x5127:
        this.chrRegsA[7] = data | this.chrHighBits;
        this.chrUseBMap = false;
        this.syncChr();
        break;
      case 0x5128: // Chr registers B
        this.chrRegsB[0] = data | this.chrHighBits;
        this.chrUseBMap = true;
        this.syncChr();
        break;
      case 0x5129:
        this.chrRegsB[1] = data | this.chrHighBits;
        this.chrUseBMap = true;
        this.syncChr();
        break;
      case 0x512A:
        this.chrRegsB[2] = data | this.chrHighBits;
        this.chrUseBMap = true;
        this.syncChr();
        break;
      case 0x512B:
        this.chrRegsB[3] = data | this.chrHighBits;
        this.chrUseBMap = true;
        this.syncChr();
        break;
      case 0x5130: // CHR bank high bits
        this.mainboard.synchroniser.synchronise();
        this.chrHighBits = (data & 0x3) << 8;
        break;
      case 0x5200: // vertical split mode
        // dont bother with vertical mode as it was only used once in commercial games, for the intro sequence
        break;
      case 0x5201: // vertical split scroll
        break;
      case 0x5202: // vertical split chr page
        break;
      case 0x5203: // irq scanline number trigger
        this.mainboard.synchroniser.synchronise();
        this.irqScanlineTrigger = data;
        this.predictIrq(this.mainboard.synchroniser.getCpuMTC());
        break;
      case 0x5204: // irq enable (different behaviour on read)
        this.mainboard.synchroniser.synchronise();
        this.irqEnabled = (data & 0x80) > 0;
        this.predictIrq(this.mainboard.synchroniser.getCpuMTC());
        break;
      case 0x5205: //  Writes specify the eight-bit multiplicand; reads return the lower eight bits of the product
        this.multiplier1 = data;
        break;
      case 0x5206: // Writes specify the eight-bit multiplier; reads return the upper eight bits of the product
        this.multiplier2 = data;
        break;
    }

    if (offset >= 0x5C00) {
      // TODO: Remove synchronise and work out isRendering by mtc
      this.mainboard.synchroniser.synchronise();
      if (this.exRamMode === 0 || this.exRamMode === 1) {
        // only allow writing during rendering, otherwise write 0
        if (this.mainboard.ppu.isRendering(this.mainboard.synchroniser.getCpuMTC(), false)) {
          this.internalExRam[offset - 0x5C00] = data;
        } else {
          this.internalExRam[offset - 0x5C00] = 0;
        }
      } else if (this.exRamMode === 2) {
        // always write
        this.internalExRam[offset - 0x5C00] = data;
      }
    }

    // BaseMapper.prototype.write8EXRam.call( this, offset, data );
  }

  read8EXRam(offset) {
    // 0x4018 -> 0x6000
    switch (offset) {
      case 0x5015:
        // sound status
        //			return soundchip.status();
        break;
      case 0x5204:
        // irq status
        this.mainboard.synchroniser.synchronise();
        var scan = this.mainboard.ppu.ticksToScreenCoordinates(this.mainboard.synchroniser.getCpuMTC());
        var stat = (this.irqActive ? 0x80 : 0) + (scan.y >= 0 && scan.y < 240 ? 0x40 : 0);
        if (this.irqActive) {
          this.irqActive = false;
          this.mainboard.cpu.holdIrqLineLow(false);
        }
        this.predictIrq(this.mainboard.synchroniser.getCpuMTC());
        return stat;
      case 0x5205: //  Writes specify the eight-bit multiplicand; reads return the lower eight bits of the product
        return (this.multiplier1 * this.multiplier2) & 0xff;
        break;
      case 0x5206: // Writes specify the eight-bit multiplier; reads return the upper eight bits of the product
        return ((this.multiplier1 * this.multiplier2) >> 8) & 0xff;
        break;
    }

    if (offset >= 0x5C00) {
      if (this.exRamMode === 2 || this.exRamMode === 3) {
        return this.internalExRam[offset - 0x5C00];
      }
    }

    return 0; // supposed to be open bus
  }

  write8SRam(offset, data) {
    // 0x6000 -> 0x8000
    this.prgRam[(this.prgRamPage << 13) | (offset & 0x1FFF)] = data; // this.prgRamPage * 0x2000 + ( offset % 0x2000 ) ] = data;
  }

  read8SRam(offset) {
    // 0x6000 -> 0x8000
    return this.prgRam[(this.prgRamPage << 13) | (offset & 0x1FFF)];
  }

  setNametableMirroring(data) {
    for (let nt = 0; nt < 4; ++nt) {
      this.nameTableMap[nt] = data & 0x3;
      data >>= 2;
    }
  }

  read8ChrRom(offset, renderingSprites, readType) {
    this.int32ChrData = this.int32ChrData || new Int32Array(this.chrData);
    // Pattern table read < 0x2000
    if (renderingSprites) {
      var pageid = (offset & 0x1C00) >> 10; // Math.floor( offset / 0x400 );
      var pagepos = this.chrMapA[pageid & 0x7];
      var chrOffset = (pagepos * 0x400) + (offset & 0x3FF);
      return this.int32ChrData[chrOffset];
    }

    let useMapB = false;

    if (this.bigSpritesEnabled) {
      useMapB = !renderingSprites;
    } else {
      useMapB = this.chrUseBMap;
    }

    var pageid = (offset & 0x1C00) >> 10; // Math.floor( offset / 0x400 );
    var pagepos = useMapB ? this.chrMapB[pageid & 0x3] : this.chrMapA[pageid & 0x7];
    var chrOffset = (pagepos * 0x400) + (offset & 0x3FF);
    return this.int32ChrData[chrOffset];
  }

  nameTableRead(nameTables, pageId, pageOffset) {
    switch (this.nameTableMap[pageId]) {
      default:
      case 0:
        return nameTables[0][pageOffset];
      case 1:
        return nameTables[1][pageOffset];
      case 2:
        if (this.exRamMode === 0 || this.exRamMode === 1) {
          return this.internalExRam[pageOffset];
        }
        return 0;

      case 3:
        return this.nameTableFill[pageOffset];
    }
  }

  nameTableWrite(nameTables, pageId, pageOffset, data) {
    switch (this.nameTableMap[pageId]) {
      default:
      case 0:
        nameTables[0][pageOffset] = data;
        break;
      case 1:
        nameTables[1][pageOffset] = data;
        break;
      case 2:
        if (this.exRamMode === 0 || this.exRamMode === 1) {
          this.internalExRam[pageOffset] = data;
        }
        break;
      case 3:
        this.nameTableFill[pageOffset] = data;
        break;
    }
  }

  spriteSizeChanged(bigSprites) {
    this.bigSpritesEnabled = bigSprites;
  }
}
