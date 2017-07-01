import BaseMapper from './BaseMapper.js';
import {
	COLOUR_ENCODING_VBLANK_SCANLINES,
	MASTER_CYCLES_PER_SCANLINE,
	COLOUR_ENCODING_FRAME_SCANLINES,
	MASTER_CYCLES_PER_PPU,
	PPU_MIRRORING_VERTICAL,
	PPU_MIRRORING_HORIZONTAL,
	IS_INT_BETWEEN,
} from '../../config/consts.js';

import {
	uintArrayToString,
	stringToUintArray,
} from '../../utils/serialisation';

export default class Mapper9 extends BaseMapper {
  init() {
    this._banks = new Int32Array(4);
  }

  mapperSaveState(state) {
    state._banks = uintArrayToString(this._banks);
    state._latches = this._latches.slice(0);
  }

  mapperLoadState(state) {
    this._banks = stringToUintArray(state._banks);
    this._latches = state._latches.slice(0);
  }

  reset() {
    this._latches = [true, false];
    for (var i = 0; i < this._banks.length; ++i) {
      this._banks[i] = 0;
    }

    this.switch32kPrgBank(this.get32kPrgBankCount() - 1);
    for (var i = 0; i < 8; ++i) {
      this.switch1kChrBank(0, i);
    }
	//	this.switch8kChrBank( 0 );
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod);
  }

  _syncChrBanks(performSync) {
    if (performSync === undefined ? true : performSync) {
      this.mainboard.synchroniser.synchronise();
    }
    const lowerBankId = this._latches[0] ? 1 : 0;
    this.switch4kChrBank(this._banks[lowerBankId], true);
    const upperBankId = this._latches[1] ? 3 : 2;
    this.switch4kChrBank(this._banks[upperBankId], false);
  }

  MMC2Latch(ppuReadAddress) {
		// http://wiki.nesdev.com/w/index.php/MMC2
    if (ppuReadAddress === 0xFD8) {
      this._latches[0] = false;
      this._syncChrBanks(false);
    } else if (ppuReadAddress === 0xFE8) {
      this._latches[0] = true;
      this._syncChrBanks(false);
    } else if (ppuReadAddress >= 0x1FD8 && ppuReadAddress <= 0x1FDF) {
      this._latches[1] = false;
      this._syncChrBanks(false);
    } else if (ppuReadAddress >= 0x1FE8 && ppuReadAddress <= 0x1FEF) {
      this._latches[1] = true;
      this._syncChrBanks(false);
    }
		// var latchId = ( ppuReadAddress & 0x1000 ) > 0 ? 1 : 0;
		// var tilenum = ( ppuReadAddress >> 4 ) & 0xFF;
		// var isFE = tilenum === 0xFE;
		// if ( tilenum === 0xFD || isFE ) {
			// this._latches[ latchId ] = isFE;
			// this._syncChrBanks();
		// }
  }

  write8PrgRom(offset, data) {
    const top4Bits = offset & 0xF000;
    switch (top4Bits) {
      case 0xA000:
        this.mainboard.synchroniser.synchronise();
        this.switch8kPrgBank(data & 0xf, 0);
        break;
      case 0xB000:
        this._banks[0] = data & 0x1F;
        this._syncChrBanks();
        break;
      case 0xC000:
        this._banks[1] = data & 0x1F;
        this._syncChrBanks();
        break;
      case 0xD000:
        this._banks[2] = data & 0x1F;
        this._syncChrBanks();
        break;
      case 0xE000:
        this._banks[3] = data & 0x1F;
        this._syncChrBanks();
        break;
      case 0xF000:
        this.mainboard.synchroniser.synchronise();
        this.mainboard.ppu.changeMirroringMethod(((data & 0x1) > 0) ? PPU_MIRRORING_HORIZONTAL : PPU_MIRRORING_VERTICAL);
        break;
      default:
        Nes.basemapper.prototype.write8PrgRom.call(this, offset, data);
        break;
    }
  }
}
