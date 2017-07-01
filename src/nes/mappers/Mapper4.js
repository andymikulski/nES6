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

export default class Mapper4 extends BaseMapper {
  init() {
    this.bankSwapByte = 0;
    this.prgRamDisableWrite = false;
    this.chipEnable = this.interruptsEnabled = true;
    this.irqCounter = this.irqLatch = 0;
    this.mReloadFlag = false;
    this._isMMC6 = false;
    this._mmc6PrgRamWriteByte = 0;

    this.lastA12Raise = 0;
    this.mSpriteAddress = this.mScreenAddress = false;
    this.mRenderingEnabled = false;

    this.banks = new Int32Array(8);
    this.banks[0] = 0;
    this.banks[1] = 2;
    this.banks[2] = 4;
    this.banks[3] = 5;
    this.banks[4] = 6;
    this.banks[5] = 7;

    this.banks[6] = 0;
    this.banks[7] = 1;
  }

  _eventIrq() {
		// don't do anything - call to synchronise() will trigger the irq
    this.mainboard.synchroniser.changeEventTime(this._irqEventId, -1);
  }

  mapperSaveState(state) {
    state.bankSwapByte = this.bankSwapByte;
    state.prgRamDisableWrite = this.prgRamDisableWrite;
    state.chipEnable = this.chipEnable;
    state.interruptsEnabled = this.interruptsEnabled;
    state.irqCounter = this.irqCounter;
    state.irqLatch = this.irqLatch;
    state.mReloadFlag = this.mReloadFlag;
    state._isMMC6 = this._isMMC6;
    state._mmc6PrgRamWriteByte = this._mmc6PrgRamWriteByte;
    state.lastA12Raise = this.lastA12Raise;
    state.mSpriteAddress = this.mSpriteAddress;
    state.mScreenAddress = this.mScreenAddress;
    state.mRenderingEnabled = this.mRenderingEnabled;
    state.banks = uintArrayToString(this.banks);
    state._interruptInProgress = this._interruptInProgress;
  }

  mapperLoadState(state) {
    this.bankSwapByte = state.bankSwapByte;
    this.prgRamDisableWrite = state.prgRamDisableWrite;
    this.chipEnable = state.chipEnable;
    this.interruptsEnabled = state.interruptsEnabled;
    this.irqCounter = state.irqCounter;
    this.irqLatch = state.irqLatch;
    this.mReloadFlag = state.mReloadFlag;
    this._isMMC6 = state._isMMC6;
    this._mmc6PrgRamWriteByte = state._mmc6PrgRamWriteByte;
    this.lastA12Raise = state.lastA12Raise;
    this.mSpriteAddress = state.mSpriteAddress;
    this.mScreenAddress = state.mScreenAddress;
    this.mRenderingEnabled = state.mRenderingEnabled;
    this.banks = stringToUintArray(state.banks);
    this._interruptInProgress = state._interruptInProgress;
  }

  syncBanks(doPrg, doChr) {
    if (doPrg) {
      this.switch8kPrgBank(this.banks[7], 1);
      this.switch8kPrgBank(this.get8kPrgBankCount() - 1, 3);

      if ((this.bankSwapByte & 0x40) > 0) {
        this.switch8kPrgBank(this.get8kPrgBankCount() - 2, 0);
        this.switch8kPrgBank(this.banks[6], 2);
      } else {
        this.switch8kPrgBank(this.banks[6], 0);
        this.switch8kPrgBank(this.get8kPrgBankCount() - 2, 2);
      }
    }
		/*
				   0: Select 2 KB CHR bank at PPU $0000-$07FF (or $1000-$17FF);
				   1: Select 2 KB CHR bank at PPU $0800-$0FFF (or $1800-$1FFF);
				   2: Select 1 KB CHR bank at PPU $1000-$13FF (or $0000-$03FF);
				   3: Select 1 KB CHR bank at PPU $1400-$17FF (or $0400-$07FF);
				   4: Select 1 KB CHR bank at PPU $1800-$1BFF (or $0800-$0BFF);
				   5: Select 1 KB CHR bank at PPU $1C00-$1FFF (or $0C00-$0FFF);
		*/
    if (doChr) {
      this.mainboard.synchroniser.synchronise();

      const bank0 = this.banks[0] & 0xFE;
      const bank1 = this.banks[1] & 0xFE;
      if ((this.bankSwapByte & 0x80) > 0) {
        this.switch1kChrBank(this.banks[2], 0);
        this.switch1kChrBank(this.banks[3], 1);
        this.switch1kChrBank(this.banks[4], 2);
        this.switch1kChrBank(this.banks[5], 3);

        this.switch1kChrBank(bank0, 4);
        this.switch1kChrBank(bank0 + 1, 5);
        this.switch1kChrBank(bank1, 6);
        this.switch1kChrBank(bank1 + 1, 7);
      } else {
        this.switch1kChrBank(bank0, 0);
        this.switch1kChrBank(bank0 + 1, 1);
        this.switch1kChrBank(bank1, 2);
        this.switch1kChrBank(bank1 + 1, 3);

        this.switch1kChrBank(this.banks[2], 4);
        this.switch1kChrBank(this.banks[3], 5);
        this.switch1kChrBank(this.banks[4], 6);
        this.switch1kChrBank(this.banks[5], 7);
      }
    }
  }


  _lookInDbForMMC6() {
    if (this.mainboard.cart && this.mainboard.cart._dbData) {
      const db = this.mainboard.cart._dbData;
      if (db.cartridge && db.cartridge[0].board && db.cartridge[0].board[0]) {
        const board = db.cartridge[0].board[0];
        if (board.chip && board.chip[0]) {
          const chip = board.chip[0];
          if (chip.$ && chip.$.type) {
            return chip.$.type === 'MMC6B';
          }
        }
      }
    }
    return false;
  }


  reset() {
    this.prgRamDisableWrite = false;
    this.chipEnable = this.interruptsEnabled = true;
    this._interruptInProgress = false;

    this._A12LowerLimit = (COLOUR_ENCODING_VBLANK_SCANLINES) * MASTER_CYCLES_PER_SCANLINE;
    this._A12UpperLimit = (COLOUR_ENCODING_FRAME_SCANLINES - 1) * MASTER_CYCLES_PER_SCANLINE;


    this.lastA12Raise = 0;

    this.mSpriteAddress = this.mScreenAddress = false;
    this.mRenderingEnabled = false;
    this.irqCounter = 0xFF;
    this.irqLatch = 0xFF;
    this.mReloadFlag = false;
    this.lastA12Raise = 0;
    this._isMMC6 = this._lookInDbForMMC6();
    this._mmc6PrgRamWriteByte = 0;
    this.bankSwapByte = 0;
    this.banks[0] = 0;
    this.banks[1] = 2;
    this.banks[2] = 4;
    this.banks[3] = 5;
    this.banks[4] = 6;
    this.banks[5] = 7;

    this.banks[6] = 0;
    this.banks[7] = 1;

    if (this.get1kChrBankCount() === 0) {
      this.useVRAM(8);
    }

    const that = this;
		// TODO: Need to remove this event on mapper unload
    this._irqEventId = this.mainboard.synchroniser.addEvent('mmc3 irq', -1, () => {
      that._eventIrq();
    });

    this.syncBanks(true, true);
    this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod);
  }

  write8PrgRom(offset, data) {
    const top3Bits = offset & 0xE000;
    switch (top3Bits) {
      case 0x8000:
        if ((offset & 0x1) === 0) { // even
          if (this.bankSwapByte !== data & 0xFF) {
            this.bankSwapByte = data & 0xFF;

            if (this._isMMC6) {
              var prgRamEnabled = (this.bankSwapByte & 0x20) > 0;
              if (!prgRamEnabled) {
                this._mmc6PrgRamWriteByte = 0;
              }
            }

            this.syncBanks(true, true);
          }
        } else { // odd
          const swapByte = this.bankSwapByte & 0x7;
          if (this.banks[swapByte] !== data & 0xFF) {
            this.banks[swapByte] = data & 0xFF;
            this.syncBanks(swapByte >= 6, swapByte <= 5);
          }
        }
        break;
      case 0xA000:
        if ((offset & 0x1) === 0) { // even
          const mirroringMethod = (data & 0x1) > 0 ? PPU_MIRRORING_HORIZONTAL : PPU_MIRRORING_VERTICAL;
          if (mirroringMethod !== this.mainboard.ppu.getMirroringMethod()) {
            this.mainboard.synchroniser.synchronise();
            this.mainboard.ppu.changeMirroringMethod(mirroringMethod);
          }
        } else { // odd
          if (this._isMMC6) {
            var prgRamEnabled = (this.bankSwapByte & 0x20) > 0;
            if (prgRamEnabled) {
              this._mmc6PrgRamWriteByte = data;
            }
          } else {
            this.prgRamDisableWrite = (data & 0x40) > 0;
            this.chipEnable = (data & 0x80) > 0;
          }
        }
        break;
      case 0xC000:
        if ((offset & 0x1) === 0) { // even
          if (this.irqLatch !== data) {
            this.mainboard.synchroniser.synchronise();
          }
          this.irqLatch = data;
        } else { // odd
          if (!this.mReloadFlag) {
            this.mainboard.synchroniser.synchronise();
          }
          this.mReloadFlag = true;
        }
        this.updateIRQTime(this.mainboard.synchroniser.getCpuMTC(), true);
        break;
      case 0xE000:
        if ((offset & 0x1) === 0) { // even - "Writing any value to this register will disable MMC3 interrupts AND acknowledge any pending interrupts."
          this.interruptsEnabled = false;
          if (this._interruptInProgress) {
            this.mainboard.cpu.holdIrqLineLow(false);
            this._interruptInProgress = false;
          }
					//				Log::Write( LOG_MAPPER, ( boost::format( "Interrupts disabled on mapper" ) ).str() );
        } else { // odd
          if (!this.interruptsEnabled) {
            this.mainboard.synchroniser.synchronise();
          }
          this.interruptsEnabled = true;
					//				Log::Write( LOG_MAPPER, ( boost::format( "Interrupts enabled on mapper" ) ).str() );
        }
        this.updateIRQTime(this.mainboard.synchroniser.getCpuMTC(), true);
        break;
    }
  }

  decrementIrqCounter(tickCount) {
		// var pos = this.mainboard.ppu.ticksToScreenCoordinates( tickCount );
		// var cpupos = this.mainboard.ppu.ticksToScreenCoordinates( this.mainboard.synchroniser.getCpuMTC() );

    this.lastA12Raise = tickCount;
    let doIrq = false;

		// console.log( "[" + this.mainboard.ppu.frameCounter + "] Doing decrement at " + pos.x + "x" + pos.y + " cpu: " + cpupos.x + "x" + cpupos.y + " : " + this.irqCounter );

    if (this.mReloadFlag) {
      doIrq = this.irqLatch === 0; // MMC3 revA behaviour
      this.irqCounter = this.irqLatch;
      this.mReloadFlag = false;
    } else if (this.irqCounter === 0) {
      this.irqCounter = this.irqLatch;
      if (this._isMMC6) {
        doIrq = false;
      } else if (this.irqCounter === 0) { doIrq = true; }
    } else {
      if (this.irqCounter > 0) { this.irqCounter--; }
      doIrq = this.irqCounter === 0;
    }

    if (doIrq && this.interruptsEnabled && !this._interruptInProgress) {
			//	if ( this.mainboard.ppu.frameCounter === 43 && pos.x === 260 && pos.y === 0 ) {
			//				debugger;
			//		}
			// console.log( "[" + this.mainboard.ppu.frameCounter + "]" + pos.x + "x" + pos.y + " IRQ cpu: " + cpupos.x + "x" + cpupos.y );
      this._interruptInProgress = true;
      this.mainboard.cpu.holdIrqLineLow(true);
    }
  }

  ppuA12Latch() {
    this.mainboard.synchroniser.synchronise();
    const cpuMtc = this.mainboard.synchroniser.getCpuMTC();
    if (this.lastA12Raise > 0 && cpuMtc - this.lastA12Raise <= 16 * MASTER_CYCLES_PER_PPU) {
      return; // Required for Bill & Ted to work: Ignore A12 raises that are too close together
    }
    this.decrementIrqCounter(cpuMtc);
    this.updateIRQTime(cpuMtc, true);
  }


  calculateNextA12Raise(cpuMTC) {
		// TODO: refactor this - could be more efficient
    let pixelEvent = -1;
    let firstScanline = 0;
    if (this.mRenderingEnabled) {
      if (this.mSpriteAddress && !this.mScreenAddress) {
        pixelEvent = 265; // 260
        firstScanline = 0;
      }
			// else if ( this.mSpriteAddress && this.mScreenAddress )
			// {
			// pixelEvent = 340;//324;
			// firstScanline = -1;
			// }
      else // if ( this.mScreenAddress && !this.mSpriteAddress )
			{
        pixelEvent = 9; // 324; // 9;
        firstScanline = 0; // -1;
      }
    }

    if (cpuMTC >= this._A12UpperLimit || pixelEvent < 0) {
      return -1;
    }

    const modmtc = cpuMTC % MASTER_CYCLES_PER_SCANLINE; // ticks from the start of the current scanline
    const scanlineEvent = MASTER_CYCLES_PER_PPU * pixelEvent; // ticks from the start of the scanline when IRQ is decremented

    let startMtc = cpuMTC - modmtc + scanlineEvent; // ticks till next irq decrement event

    if (startMtc <= cpuMTC) { startMtc += MASTER_CYCLES_PER_SCANLINE; } // if we have already passed the irq event, move onto next scanline
    if (this._A12UpperLimit <= startMtc) { return -1; }

    if (startMtc < this._A12LowerLimit) { startMtc = this._A12LowerLimit + scanlineEvent; }

    return startMtc;
  }


  updateIRQTime(cpuTime, doSync) {
    if (doSync) {
      this.mainboard.synchroniser.synchronise();
    }

		// tickLimit is the start of the rendering frame - only started being clocked when rendering
    let newEvent = -1;
    let nextRaise = 0;
    let scanlines = 0;
    if (this.interruptsEnabled) {
      nextRaise = this.calculateNextA12Raise(cpuTime);
      if (nextRaise === -1) {
        newEvent = -1;
      } else {
        scanlines = this.mReloadFlag ? 0 : Math.max(this.irqCounter - 1, 0);
        newEvent = nextRaise + (scanlines * MASTER_CYCLES_PER_SCANLINE);
        if (newEvent > this._A12UpperLimit) {
          newEvent = -1;
        } else {
					// var pos = this.mainboard.ppu.ticksToScreenCoordinates( newEvent );
					// var cpupos = this.mainboard.ppu.ticksToScreenCoordinates( this.mainboard.synchroniser.getCpuMTC() );
					// if ( this.mainboard.ppu.frameCounter === 43 && pos.x === 260 && pos.y === 0 ) {
					// debugger;
					// }
					// console.log( "Predicting next IRQ at " + pos.x + "x" + pos.y + " cpu: " + cpupos.x + "x" + cpupos.y );
        }
      }
    }
    this.mainboard.synchroniser.changeEventTime(this._irqEventId, newEvent);
  }


  spriteScreenEnabledUpdate(spriteAddress, screenAddress) {
    this.mSpriteAddress = spriteAddress;
    this.mScreenAddress = screenAddress;
    this.updateIRQTime(this.mainboard.synchroniser.getCpuMTC(), true);
  }

  renderingEnabledChanged(enabled) {
    this.mRenderingEnabled = enabled;
    this.updateIRQTime(this.mainboard.synchroniser.getCpuMTC(), true);
  }

  synchronise(startTicks, endTicks) {
		/*
	The heart of the MMC3. The PPU will cause A12 to rise when it fetches CHR from the right pattern table ($1xxx).
	In "normal" conditions (BG uses $0xxx, all sprites use $1xxx), this will occur 8 times per scanline (once for each sprite).
	However the BG could also be the culprit (if BG uses $1xxx and all sprites use $0xxx -- ?as seen in Armadillo?), in which case A12 will rise 34 times.
	These 42 times per scanline are key times which I call "rise points":

	BG rise points: 4, 12, 20, ... , 244, 252
	Sp rise points: 260, 268, ..., 308, 316
	BG rise points: 324, 332

	If sprites are set to $1000-1FFF and the background is set to $0000-0FFF, then A12 will change from 0 to 1 at cycle 260 of each scanline, then change from 1 to 0 at cycle 320 of each scanline.

	If sprites are set to $0000-0FFF and the background is set to $1000-1FFF, then A12 will change from 1 to 0 at cycle 256 of each scanline, then change from 0 to 1 at cycle 324 of each scanline.
	*/
		// tickLimit is the start of the rendering frame - only started being clocked when rendering
    const startMtc = this.calculateNextA12Raise(startTicks + 1);
    if (startMtc >= 0) {
      for (let mtc = startMtc; mtc <= Math.min(this._A12UpperLimit, endTicks); mtc += MASTER_CYCLES_PER_SCANLINE) {
        this.decrementIrqCounter(mtc);
      }
    }
    this.updateIRQTime(endTicks, false);
  }

  onEndFrame() {
    this.lastA12Raise = 0;
  }

  write8SRam(offset, data) {
    if (this._isMMC6) {
      if (offset >= 0x7000) {
        const mirroredOffset = offset & 0x3FF;
        const lowHalf = (mirroredOffset & 0x200) === 0;
        const offsetMask = lowHalf ? 0x30 : 0xC0; // writing requires both the write and read bits set
        if ((this._mmc6PrgRamWriteByte & offsetMask) === offsetMask) {
          BaseMapper.prototype.write8SRam.call(this, mirroredOffset, data);
        }
      }
    } else if (this.chipEnable && !this.prgRamDisableWrite) {
      BaseMapper.prototype.write8SRam.call(this, offset, data);
    }
  }

  read8SRam(offset) {
    if (this._isMMC6 && offset >= 0x7000) {
      if (offset >= 0x7000) {
        const mirroredOffset = offset & 0x3FF;
        const lowHalf = (mirroredOffset & 0x200) === 0;
        const offsetMask = lowHalf ? 0x20 : 0x80;
        if ((this._mmc6PrgRamWriteByte & offsetMask) > 0) {
          return BaseMapper.prototype.read8SRam.call(this, mirroredOffset);
        }
      }
    } else if (this.chipEnable) {
      return BaseMapper.prototype.read8SRam.call(this, offset);
    }
    return 0;
  }
}
