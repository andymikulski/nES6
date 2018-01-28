import { stringToUintArray, uintArrayToString } from '../../utils/serialisation';
import { writeLine, tracePpu } from '../../utils/Trace';

import {
	MASTER_CYCLES_PER_PPU,
	COLOUR_ENCODING_VBLANK_MTC,
	PPU_MIRRORING_HORIZONTAL,
	PPU_MIRRORING_VERTICAL,
	COLOUR_ENCODING_VBLANK_SCANLINES,
	MASTER_CYCLES_PER_SCANLINE,
	COLOUR_ENCODING_FRAME_MTC,
	COLOUR_ENCODING_MTC_PER_CPU,
	PPU_TICKS_PER_SCANLINE,
	COLOUR_ENCODING_NAME,
	IS_INT_BETWEEN,
	PPU_MIRRORING_FOURSCREEN,
	PPU_MIRRORING_SINGLESCREEN_NT0,
	PPU_MIRRORING_SINGLESCREEN_NT1,
	TRACE_ENABLED,
} from '../../config/consts.js';

import PPURenderBG from './PPURenderBG';
import PPURenderSprites from './PPURenderSprites';

export default class PPU {
	constructor(mainboard) {
		var that = this;
		this.mainboard = mainboard;
		this.mainboard.connect('reset', this.reset.bind(this));
		this.lastTransferredValue = 0;
		this.mirroringMethod = null;
		this.spriteMemory = new Int32Array(0x100);
		this.invokeA12Latch = false;
		this.bitOperationOn2002 = false;

		this.nameTablesMap = new Int32Array(4);
		this.nameTables = [];
		for (var i = 0; i < 4; ++i)
			this.nameTables.push(new Int32Array(0x400));

		this.paletteTables = [new Int32Array(0x10), new Int32Array(0x10)];
		this.frameCounter = 0;
		this.ppuRenderBg = new PPURenderBG(this);
		this.ppuRenderSprites = new PPURenderSprites(this);

		this.resetVariables();
	}

	// Recycles a static return object to save creating an object per call (sloooow...) be warned using this method, dont call more than once at a time
	// else the values will be overwritten
	static screenPos = {
		x: 0,
		y: 0
	};

	reset(cold) {

		this.useMapperNameTableRead = this.mainboard.cart.memoryMapper.nameTableRead !== undefined;
		this.sync = this.mainboard.synchroniser;
		this.resetVariables(cold);
		this.invokeA12Latch = this.mainboard.cart.memoryMapper.ppuA12Latch !== undefined;
		this.ppuRenderBg.reset();
		this.ppuRenderSprites.reset();
	}

	bitOperationHappening() {

		this.bitOperationOn2002 = true;
	}

	resetVariables(cold) {
		if (cold)
			this.control1 = this.control2 = this.status = 0;
		else
			this.control1 &= 0x7F; // ppuControl1.vBlankNmi = false;
		this.status |= 0x80; // vblank

		this.isOddFrame = false;
		this.suppressNmi = this.suppressVblank = false;
		this.forceNmi = false;

		this.doSpriteTransferAfterNextCpuInstruction = false;
		this.spriteTransferArgument = 0;

		this.fineX = 0;
		this.bufferedppuread = 0;
		this.ppuSecondAddressWrite = false;
		this.ppuReadAddress = 0;
		this.ppuLatchAddress = 0;
		this.spriteaddress = 0;

		this.frameCounter = 0;
	}

	hookSyncEvents(synchroniser) {

		var that = this;
		this.clockSkipEventId = synchroniser.addEvent('ppu clockskip', this.getMasterTicksTillClockSkip(), function () {
			that.eventClockskip();
		});
		this.vblankClearEventId = synchroniser.addEvent('ppu vblank clear', COLOUR_ENCODING_VBLANK_MTC, function (eventTime) {
			that.eventVblankClear(eventTime);
		});
		this.ppuNmiEventId = synchroniser.addEvent('ppu NMI', -1, function (eventTime) {
			that.eventNmiTrigger(eventTime);
		});
		this.spriteZeroEventId = synchroniser.addEvent('ppu sprite zero hit', -1, function (eventTime) {
			that.eventSpriteZeroHit(eventTime);
		});
	}

	eventClockskip() {

		// Skip a PPU clock cycle if the background is enabled
		if (this.isOddFrame && (this.control2 & 0x8) > 0 /*ppuControl2.backgroundSwitch*/ && COLOUR_ENCODING_NAME === "NTSC") {
			this.sync.advanceCpuMTC(MASTER_CYCLES_PER_PPU);
		}
	}

	eventVblankClear(eventTime) {

		// clear vblank flags after vblank period (in this emultor, at the start of the frame)
		// clear bits 5,6,7 in 0x2002
		//console.log( "CLEAR VBLANK: " + eventTime );
		this.status &= 0x1F;
	}

	eventNmiTrigger(eventTime) {

		if (((this.control1 & 0x80) > 0 /* ppuControl1.vBlankNmi*/ && (this.status & 0x80) > 0 /* ppuStatus.vBlank*/)) {
			this.mainboard.cpu.nonMaskableInterrupt(eventTime);
		}

		this.sync.changeEventTime(this.ppuNmiEventId, -1);
	}

	eventSpriteZeroHit(eventTime) {

		writeLine(tracePpu, "PPU sprite hit set");
		// var realmtc = this.sync.getCpuMTC();
		// console.log( "[" + this.frameCounter + "] Sprite hit at: " + realmtc + " [" + JSON.stringify( this.ticksToScreenCoordinates( realmtc ) )
		// + " due: " + eventTime + " [" + JSON.stringify( this.ticksToScreenCoordinates( eventTime ) ) + "]" );
		this.status |= 0x40;
		this.sync.changeEventTime(this.spriteZeroEventId, -1);
	}

	eventSpriteOverflow(eventTime) {

		//var realmtc = this.sync.getCpuMTC();
		//console.log( "Sprite overflow at: " + realmtc + " [" + JSON.stringify( this.ticksToScreenCoordinates( realmtc ) )
		//	+ " due: " + eventTime + " [" + JSON.stringify( this.ticksToScreenCoordinates( eventTime ) ) + "]" );
		this.status |= 0x20; /*ppuStatus.spriteOverflow = true;*/
	}

	getMasterTicksTillVBlankClearDue(tickCount) {
		tickCount = tickCount || 0;
		return COLOUR_ENCODING_VBLANK_MTC - tickCount;
	}

	getMasterTicksTillClockSkip(tickCount) {
		tickCount = tickCount || 0;
		return (COLOUR_ENCODING_VBLANK_MTC + (MASTER_CYCLES_PER_PPU * (328 + 9))) - tickCount;
	}

	ticksToScreenCoordinates(tickCount) {
		tickCount = tickCount || this.sync.getCpuMTC();
		tickCount = Math.floor(tickCount / MASTER_CYCLES_PER_PPU) | 0;
		PPU.screenPos.x = tickCount % PPU_TICKS_PER_SCANLINE;
		PPU.screenPos.y = (Math.floor(tickCount / PPU_TICKS_PER_SCANLINE) - COLOUR_ENCODING_VBLANK_SCANLINES - 1) | 0;
		return PPU.screenPos;
	}

	screenCoordinatesToTicks(x, y) {

		return (x * MASTER_CYCLES_PER_PPU) + ((y + COLOUR_ENCODING_VBLANK_SCANLINES + 1) * MASTER_CYCLES_PER_SCANLINE);
	}

	isRenderingEnabled() {
		return (this.control2 & 0x18) > 0;
	}

	isRendering(tickCount, includeHblank) {
		if (this.isRenderingEnabled()) {
			var pos = this.ticksToScreenCoordinates(tickCount);
			return (includeHblank ? IS_INT_BETWEEN(pos.x, 0, 256) : true) && IS_INT_BETWEEN(pos.y, -1, 241);
		} else
			return false;
	}

	updatePPUReadAddress(newAddress, invokedFromRegisterWrite) {
		if (invokedFromRegisterWrite && this.invokeA12Latch) {
			if ((newAddress & 0x1000) > 0) {
				this.mainboard.cart.memoryMapper.ppuA12Latch();
			}
		}
		this.ppuReadAddress = newAddress;
	}

	changeMirroringMethod(method) {

		if (method !== this.mirroringMethod) {
			this.mirroringMethod = method;
			var name = '';
			switch (this.mirroringMethod) {
				default:
				case PPU_MIRRORING_HORIZONTAL: // mirrors 3 & 4 point to the second nametable
					this.nameTablesMap[0] = 0;
					this.nameTablesMap[1] = 0;
					this.nameTablesMap[2] = 1;
					this.nameTablesMap[3] = 1;
					//name = 'horizontal';
					break;
				case PPU_MIRRORING_VERTICAL: // mirrors 2 & 4 point to the second nametable
					this.nameTablesMap[0] = 0;
					this.nameTablesMap[1] = 1;
					this.nameTablesMap[2] = 0;
					this.nameTablesMap[3] = 1;
					//name = 'vertical';
					break;
				case PPU_MIRRORING_FOURSCREEN: // no mirroring done, requires an extra 0x800 of memory kept on cart
					for (var i = 0; i < 4; ++i)
						this.nameTablesMap[i] = i;
					//name = 'four screen';
					break;
				case PPU_MIRRORING_SINGLESCREEN_NT0:
					for (var j = 0; j < 4; ++j)
						this.nameTablesMap[j] = 0;
					//name = 'single 0';
					break;
				case PPU_MIRRORING_SINGLESCREEN_NT1:
					for (var k = 0; k < 4; ++k)
						this.nameTablesMap[k] = 1;
					//name = 'single 1';
					break;
			}
			//console.log( 'PPU nametable mirroring set to ' + name );
		}
	}

	getMirroringMethod() {
		return this.mirroringMethod;
	}

	handleSpriteTransfer() {
		/*
		SPR DMA should take 513 cycles if it starts on an even cycle, 514 if it starts on an odd cycle.

		Remember that SPR DMA only takes place when the instruction has finished executing, and not at the write cycle of the instruction! You can check this behavior by using a RMW instruction with $4014, it will only do one sprite dma at the end of the instruction.

		I m able to pass irq and dma, as well as both spr and dma tests using this implementation.
		*/
		var baseReadAddress = this.spriteTransferArgument * 0x100;
		if (this.doSpriteTransferAfterNextCpuInstruction) {
			this.doSpriteTransferAfterNextCpuInstruction = false;
			this.sync.synchronise();
			// TODO: Optimise
			this.sync.advanceCpuMTC(1 * COLOUR_ENCODING_MTC_PER_CPU);
			this.spriteaddress &= 0xFF
			for (var i = 0; i < 0x100; ++i) {
				var dmaData = this.mainboard.memory.read8(baseReadAddress + i);
				this.sync.advanceCpuMTC(1 * COLOUR_ENCODING_MTC_PER_CPU);
				this.spriteMemory[this.spriteaddress] = dmaData;
				this.spriteaddress = (this.spriteaddress + 1) & 0xFF;
				//this.lastTransferredValue = dmaData;
				this.sync.advanceCpuMTC(1 * COLOUR_ENCODING_MTC_PER_CPU);
			}
			// add extra cycle on odd frame
			if (this.isOddFrame)
				this.sync.advanceCpuMTC(1 * COLOUR_ENCODING_MTC_PER_CPU);
		}
	}

	writeTo2000(offset, data) {
		var cpuMtc = this.sync.getCpuMTC();
		var vblankSetTime = COLOUR_ENCODING_FRAME_MTC;
		var ticksTillSet = vblankSetTime - cpuMtc;

		if ((data & 0x80) === 0) { // vblank nmi cleared
			// special case code for disabling NMI when disabled near vblank set
			// NMI should occur when disabled 2, 3 or 4 PPU clocks after VBL set
			if (ticksTillSet <= -MASTER_CYCLES_PER_PPU * 2 && ticksTillSet >= -MASTER_CYCLES_PER_PPU * 4) {
				this.forceNmi = true;
			} else if (ticksTillSet >= -MASTER_CYCLES_PER_PPU * 1 && ticksTillSet <= MASTER_CYCLES_PER_PPU * 1) {
				this.suppressNmi = true;
			}
		} else {
			// NMI should occur if enabled when VBL already set
			// vblank = true && vblanknmi = false
			if ((this.status & 0x80) > 0 && (this.control1 & 0x80) === 0) { // there be a 1-PPU clock latency for this
				var triggerTime = this.sync.getCpuMTC() + MASTER_CYCLES_PER_PPU * 1;
				//console.log( "NMI trigger due: " + triggerTime );
				this.sync.changeEventTime(this.ppuNmiEventId, triggerTime);
			}
		}

		this.sync.synchronise();

		// update nametable switch
		this.ppuLatchAddress &= 0xF3FF;
		this.ppuLatchAddress |= ((data & 3) << 10);

		var spriteScreenAddressChanged = (this.control1 & 0x18) !== (data & 0x18);
		//var spriteSizeOrSpriteAddressChanged = ( this.control1 & 0x28 ) !== ( data & 0x28 );
		var spriteSizeChanged = (this.control1 & 0x20) !== (data & 0x20);

		this.control1 = data;

		if (spriteScreenAddressChanged) {
			this.mainboard.cart.memoryMapper.spriteScreenEnabledUpdate((this.control1 & 0x8) > 0, (this.control1 & 0x10) > 0);
			this.ppuRenderBg.onControl1Change(this.control1);
		}
		if (spriteSizeChanged && this.mainboard.cart.memoryMapper.spriteSizeChanged) { // used by MMC5
			this.mainboard.cart.memoryMapper.spriteSizeChanged((this.control1 & 0x20) > 0);
		}
	}

	writeTo2001(offset, data) {
		this.sync.synchronise();
		var renderingEnabledChanged = ((this.control2 & 0x18) > 0) !== ((data & 0x18) > 0);
		//var spriteVisibleOrClippingChanged = ( ( this.control2 & 0x14 ) > 0 ) !== ( ( data & 0x14 ) > 0 );

		this.control2 = data;

		if (renderingEnabledChanged)
			this.mainboard.cart.memoryMapper.renderingEnabledChanged((this.control2 & 0x18) > 0);
	}

	writeTo2005(offset, data) {
		this.sync.synchronise();

		/*
		I don't know anything about this game in particular, but bear in mind when examining
		$2005 writes that changes to bits 0-2 take effect immediately, while changes to bits 3-7
		(as well as bit 0 of $2000) don't have any effect until the start of the next H-Blank
		(cycle 257 to be specific).
		Thus, if $2005 were written in the middle of H-Blank, bits 0-2 will affect the next scanline,
		but bits 3-7 won't take effect until the scanline afterwards.
		Emulators that don't use cycle-accurate PPU rendering will not correctly handle this condition.
		*/

		// bottom 3 bits are "fine" scroll value, top 5 are tile number
		// first write is horizontal value, second is vertical
		if (!this.ppuSecondAddressWrite) {
			this.ppuLatchAddress &= 0xFFE0;
			this.ppuLatchAddress |= ((data & 0xF8) >> 3);
			this.fineX = (data & 0x07) | 0;
			//var pos = this.ticksToScreenCoordinates();
			//console.log( "changed fineX at " + pos.x + "x" + pos.y + "=" + this.fineX );
		} else {
			this.ppuLatchAddress &= 0xFC1F;
			this.ppuLatchAddress |= ((data & 0xF8) << 2);
			this.ppuLatchAddress &= 0x8FFF;
			this.ppuLatchAddress |= ((data & 0x07) << 12);
		}

		this.ppuSecondAddressWrite = !this.ppuSecondAddressWrite;

		//writeLine( 'ppu', '2005 write: ' + data.toString( 16 ) );
	}

	writeTo2006(offset, data) {
		// first write is upper byte of address, second is lower
		this.sync.synchronise();

		if (!this.ppuSecondAddressWrite) {
			this.control1 &= 0xFC; // TODO: is this correct?
			this.control1 |= (data & 0x0C) >> 2; // nametable
			this.ppuLatchAddress &= 0x00FF;
			this.ppuLatchAddress |= ((data & 0x3F) << 8);
		} else {
			this.ppuLatchAddress &= 0xFF00;
			this.ppuLatchAddress |= data;

			this.updatePPUReadAddress(this.ppuLatchAddress, true);
		}

		this.ppuSecondAddressWrite = !this.ppuSecondAddressWrite;

		//writeLine( 'ppu', '2006 write: ' + data.toString( 16 ) );
	}

	writeTo2007(offset, data) {
		/*
		$2007 reads and writes:
		Outside of rendering, reads from or writes to $2007 will add either 1 or 32 to v depending on the VRAM increment bit set via $2000.
		During rendering (on the pre-render line and the visible lines 0-239, provided either background or sprite rendering is enabled),
		it will update v in an odd way, triggering a coarse X increment and a Y increment simultaneously (with normal wrapping behaviour).
		Internally, this is caused by the carry inputs to various sections of v being set up for rendering, and the $2007 access triggering a
		"load next value" signal for all of v (when not rendering, the carry inputs are set up to linearly increment v by either 1 or 32).
		This behaviour is not affected by the status of the increment bit. The Young Indiana Jones Chronicles uses this for some effects to adjust
		the Y scroll during rendering. If the $2007 access happens to coincide with a standard VRAM address increment (either horizontal or vertical),
		it will presumably not double-increment the relevant counter.
		*/
		this.sync.synchronise();

		var bufferedAddress = 0;
		var newAddress = 0;

		if (!this.isRendering(this.sync.getCpuMTC(), false)) {
			bufferedAddress = this.ppuReadAddress;

			// increment PPU address as according to bit 2 of 0x2000
			newAddress = this.ppuReadAddress + ((this.control1 & 0x04) > 0 ? 32 : 1); // verticalwrite flag
			this.updatePPUReadAddress(newAddress, true);
			this.write8(bufferedAddress /*& 0x3FFF*/, data);
		} else {
			// TODO: disallow if due to occur this tick anyway
			//	this.background_IncrementXTile();
			//	this.background_IncrementYTile();
		}

		if (this.mainboard.cart.memoryMapper.MMC2Latch) {
			this.mainboard.cart.memoryMapper.MMC2Latch(this.ppuReadAddress);
		}

		//writeLine( 'ppu', '2007 write: ' + data.toString( 16 ) );
	}

	writeToRegister(offset, data) {

		this.lastTransferredValue = data;

		switch (offset) {
			case 0:
				this.writeTo2000(offset, data);
				break;
			case 0x01:
				this.writeTo2001(offset, data);
				break;
			case 0x03: // sprite memory address, no need to synchronise
				this.spriteaddress = data & 0xFF;
				break;
			case 0x04: // sprite memory data
				this.sync.synchronise();
				this.spriteMemory[this.spriteaddress & 0xFF] = data;
				this.spriteaddress = (this.spriteaddress + 1) & 0xFF;
				break;
			case 0x05: // PPU scrolling
				this.writeTo2005(offset, data);
				break;
			case 0x06: // PPU memory address
				this.writeTo2006(offset, data);
				break;
			case 0x07: // PPU memory data
				this.writeTo2007(offset, data);
				break;
		}
	}

	writeToSpriteDMARegister(data) {
		this.doSpriteTransferAfterNextCpuInstruction = true;
		this.spriteTransferArgument = data;
	}

	readFromRegister2002() {
		var cpuMtc = this.sync.getCpuMTC();
		var vblankSetTime = COLOUR_ENCODING_FRAME_MTC;
		var ticksTillSet = vblankSetTime - cpuMtc;
		var suppress = false;

		// check that vblank flag isn't tried to be set 1 PPU clock before VBlank is due
		if (ticksTillSet === MASTER_CYCLES_PER_PPU) {
			this.suppressVblank = true;
			this.suppressNmi = true;
			suppress = true;
		}
		// Suppress NMI on the tick VBlank is read and the one after
		else if (ticksTillSet <= 0 && ticksTillSet >= -MASTER_CYCLES_PER_PPU * 1) {
			this.suppressNmi = true;
		}

		// If we are performing a BIT on 2002, then we can optimise by not needing
		// to synchronise (as it is only looking at the vblank flag, and we always know
		// when that is due to happen)
		//if ( !this.bitOperationOn2002 ) {
		//writeLine( 'ppu', '2002 read sync - pre: ' + cpuMtc );
		this.sync.synchronise();
		//writeLine( 'ppu', '2002 read sync - post ' + cpuMtc );
		// } else {
		// if ( ticksTillSet < MASTER_CYCLES_PER_PPU * 5 ) { // if it's about to clear, synchronise
		// this.sync.synchronise();
		// }
		// this.bitOperationOn2002 = false;
		// }

		var ret = this.status;
		//console.log( "0x2002 read : " + Number( ret ) + " status: " + Number( this.status ) );
		this.ppuSecondAddressWrite = false; // reset latch on read to 0x2002

		// wipe vblank flag from status reg
		if (suppress)
			ret &= 0x7F;
		else
			this.status &= 0x7F;
		return ret;
	}

	readFromRegister2007() {
		var ret = 0;
		// dont buffer reads from palette space
		var bufferedaddress = this.ppuReadAddress;
		var newAddress = 0;

		if (!this.isRendering(this.sync.getCpuMTC(), true)) {
			newAddress = (this.ppuReadAddress + ((this.control1 & 0x4) > 0 /*ppuControl1.verticalWrite*/ ? 32 : 1)) & 0xFFFF;
			this.updatePPUReadAddress(newAddress, true);

			if ((bufferedaddress & 0xFF00) === 0x3F00) //IS_INT_BETWEEN( bufferedaddress, 0x3F00, 0x4000 ) )
			{
				ret = this.read8(bufferedaddress, false, 0);
				this.bufferedppuread = this.read8(bufferedaddress - 0x1000, false, 0);
			} else {
				ret = this.bufferedppuread;
				this.bufferedppuread = this.read8(bufferedaddress, false, 0);
			}
		} else {
			ret = this.bufferedppuread;
			this.bufferedppuread = 0;
		}
		return ret;
	}

	readFromRegister(offset) {
		var ret = 0;

		switch (offset) // offset is 0x2000 -> 0x2008
		{
			case 0x2:
				ret = this.readFromRegister2002();
				break;

			case 0x4: // sprite memory data
				ret = this.spriteMemory[this.spriteaddress & 0xFF] | 0;
				break;

			case 0x7: // PPU memory data
				ret = this.readFromRegister2007();
				break;

			//case 0x2005:
			//	Log::Write( LOG_ERROR, "Read from PPU register 0x2005 - Emulation may be inaccurate and problematic" );
			//	ret = mLastTransferredValue;
			//	throw std::runtime_error( "Read to 0x2005" );
			//case 0x2006:
			//	Log::Write( LOG_ERROR, "Read from PPU register 0x2006 - Emulation may be inaccurate and problematic" );
			//	ret = mLastTransferredValue;
			//	throw std::runtime_error( "Read to 0x2006" );
			default:
				ret = this.lastTransferredValue;
				break;
		}

		this.lastTransferredValue = ret;
		return ret;
	}

	write8(offset, data) {

		if ((offset & 0x2000) === 0) { // IS_INT_BETWEEN( offset, 0, 0x2000 )
			this.mainboard.cart.memoryMapper.write8ChrRom(offset & 0x1FFF, data);
		} else { // IS_INT_BETWEEN( offset, 0x2000, 0x4000 )
			if ((offset & 0x3F00) === 0x3F00) { // IS_INT_BETWEEN( offset, 0x3F00, 0x4000 )
				// image and sprite palettes (both mirror each other)
				var paletteOffset = offset & 0xF;
				var targetPalette = (offset & 0x10) >> 4; // whether its a sprite or background palette
				var newColour = data & 0x3F;

				this.paletteTables[targetPalette][paletteOffset] = newColour;
				if ((paletteOffset & 0x3) === 0) {
					var otherPalette = targetPalette === 1 ? 0 : 1;
					this.paletteTables[otherPalette][paletteOffset] = newColour;
				}
			} else { // IS_INT_BETWEEN( offset, 0x2000, 0x3F00 )
				// name tables
				var pageid = (offset & 0xC00) >> 10;
				if (this.mainboard.cart.memoryMapper.nameTableWrite) {
					this.mainboard.cart.memoryMapper.nameTableWrite(this.nameTables, pageid, offset & 0x3FF, data);
				} else {
					var pagepos = this.nameTablesMap[pageid];
					this.nameTables[pagepos][offset & 0x3FF] = data;
				}
			}
		}
	}

	read8(offset, renderingSprites, readType) {

		var pageid = 0;
		var pagepos = 0;
		var paletteOffset = 0;
		var targetPalette = 0;

		if ((offset & 0x2000) === 0) { // IS_INT_BETWEEN( offset, 0, 0x2000 )
			// pattern tables
			return this.mainboard.cart.memoryMapper.read8ChrRom(offset & 0x1FFF, renderingSprites, readType) | 0;
		} else {
			if ((offset & 0x3F00) === 0x3F00) { // IS_INT_BETWEEN( offset, 0x3F00, 0x4000 )
				// palettes
				paletteOffset = offset & 0xF;
				targetPalette = (offset & 0x10) >> 4;
				return this.paletteTables[targetPalette][paletteOffset] | 0;
			} else { // IS_INT_BETWEEN( offset, 0x2000, 0x3F00 )
				// name tables
				pageid = (offset & 0xC00) >> 10;
				if (this.useMapperNameTableRead) {
					return this.mainboard.cart.memoryMapper.nameTableRead(this.nameTables, pageid, offset & 0x3FF) | 0;
				} else {
					pagepos = this.nameTablesMap[pageid];
					return this.nameTables[pagepos][offset & 0x3FF] | 0;
				}
			}
		}
	}

	synchronise(startTicks, endTicks) {

		if (this.isRenderingEnabled()) {
			this.ppuRenderSprites.renderTo(startTicks, endTicks);
			this.ppuReadAddress = this.ppuRenderBg.renderTo(startTicks, endTicks, this.ppuReadAddress, this.ppuLatchAddress);
		}
	}

	onEndFrame() {

		// start vblank period
		if (!this.suppressVblank) {
			this.status |= 0x80; // set vblank
		}

		if (this.forceNmi || (!this.suppressNmi && (this.control1 & 0x80) > 0)) {
			writeLine(tracePpu, 'this.mainboard.cpu.nonMaskableInterrupt: ' + (COLOUR_ENCODING_FRAME_MTC + MASTER_CYCLES_PER_PPU));
			this.mainboard.cpu.nonMaskableInterrupt(COLOUR_ENCODING_FRAME_MTC + MASTER_CYCLES_PER_PPU);
		}

		this.suppressNmi = false;
		this.suppressVblank = false;
		this.forceNmi = false;
		this.isOddFrame = !this.isOddFrame;
		this.frameCounter++;
		this.ppuRenderBg.onEndFrame();
		this.ppuRenderSprites.onEndFrame();

		if (TRACE_ENABLED) {
			writeLine(tracePpu, '[' + this.frameCounter + '] Frame finished');
		}
	}

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	getBackgroundPaletteIndex() {
		return this.paletteTables[0][0] | 0;
	}

	readNameTable(address, readType) {
		var pageid = (address >> 10) & 3;
		if (this.useMapperNameTableRead) {
			return this.mainboard.cart.memoryMapper.nameTableRead(this.nameTables, pageid, address & 0x3FF, readType) | 0;
		} else {
			var pagepos = this.nameTablesMap[pageid];
			return this.nameTables[pagepos][address & 0x3FF] | 0;
		}
	}

	formatStatusString() {

		var pos = this.ticksToScreenCoordinates();
		var str = "";
		str += "CYC:" + ZERO_PAD(pos.x, 3, ' ') + " SL:" + pos.y + " F:" + this.frameCounter;
		str += " S:" + ZERO_PAD_HEX(this.status, 2) + " C1:" + ZERO_PAD_HEX(this.control1, 2) + " C2:" + ZERO_PAD_HEX(this.control2, 2);
		return str;
	}

	saveState() {

		var data = {};
		data.mirroringMethod = this.mirroringMethod;
		data.isOddFrame = this.isOddFrame;
		data.suppressNmi = this.suppressNmi;
		data.suppressVblank = this.suppressVblank;
		data.forceNmi = this.forceNmi;

		data.control1 = this.control1;
		data.control2 = this.control2;
		data.status = this.status;

		data.bufferedppuread = this.bufferedppuread;
		data.ppuReadAddress = this.ppuReadAddress;
		data.ppuLatchAddress = this.ppuLatchAddress;

		data.spriteaddress = this.spriteaddress;
		data.ppuSecondAddressWrite = this.ppuSecondAddressWrite;

		data.fineX = this.fineX;

		data.lastTransferredValue = this.lastTransferredValue;
		data.frameCounter = this.frameCounter;
		data.invokeA12Latch = this.invokeA12Latch;

		data.doSpriteTransferAfterNextCpuInstruction = this.doSpriteTransferAfterNextCpuInstruction;
		data.spriteTransferArgument = this.spriteTransferArgument;

		data.spriteMemory = uintArrayToString(this.spriteMemory);
		data.nameTables = [];
		for (var i = 0; i < this.nameTables.length; ++i) {
			data.nameTables.push(uintArrayToString(this.nameTables[i]));
		}
		data.paletteTables = [];
		for (var i = 0; i < this.paletteTables.length; ++i) {
			data.paletteTables.push(uintArrayToString(this.paletteTables[i]));
		}
		data.nameTablesMap = uintArrayToString(this.nameTablesMap);

		this.ppuRenderBg.saveState(data);
		this.ppuRenderSprites.saveState(data);
		return data;
	}

	loadState(state) {
		this.mirroringMethod = state.mirroringMethod;
		this.isOddFrame = state.isOddFrame;
		this.suppressNmi = state.suppressNmi;
		this.suppressVblank = state.suppressVblank;
		this.forceNmi = state.forceNmi;

		this.control1 = state.control1;
		this.control2 = state.control2;
		this.status = state.status;

		this.bufferedppuread = state.bufferedppuread;
		this.ppuReadAddress = state.ppuReadAddress;
		this.ppuLatchAddress = state.ppuLatchAddress;

		this.spriteaddress = state.spriteaddress;
		this.ppuSecondAddressWrite = state.ppuSecondAddressWrite;

		this.fineX = state.fineX;

		this.lastTransferredValue = state.lastTransferredValue;
		this.frameCounter = state.frameCounter;

		this.doSpriteTransferAfterNextCpuInstruction = state.doSpriteTransferAfterNextCpuInstruction;
		this.spriteTransferArgument = state.spriteTransferArgument;
		this.invokeA12Latch = state.invokeA12Latch;

		this.spriteMemory = stringToUintArray(state.spriteMemory);
		this.nameTables = [];
		for (var i = 0; i < state.nameTables.length; ++i) {
			this.nameTables.push(stringToUintArray(state.nameTables[i]));
		}
		this.paletteTables = [];
		for (var i = 0; i < state.paletteTables.length; ++i) {
			this.paletteTables.push(stringToUintArray(state.paletteTables[i]));
		}
		this.nameTablesMap = stringToUintArray(state.nameTablesMap);

		this.ppuRenderBg.loadState(state);
		this.ppuRenderSprites.loadState(state);
	}
}
