

this.Nes = this.Nes || {};

"use strict";


var mapper65 = function() {
};

mapper65.prototype = Object.create( Nes.basemapper.prototype );

mapper65.prototype.reset = function() {

	this.irqEnabled = false;
	this.irqCounter = 0;
	this.irqReload = 0;
	this.nextIrqRaise = -1;

	this.switch8kPrgBank( 0, 0 );
	this.switch8kPrgBank( 1, 1 );
	this.switch8kPrgBank( 0xFE, 2 );
	this.switch8kPrgBank( this.get8kPrgBankCount() - 1, 3 );
	this.switch8kChrBank( this.get8kChrBankCount() - 1 );

	this.mainboard.ppu.changeMirroringMethod( this.mirroringMethod );

	// TODO: Need to remove this event on mapper unload
	var that = this;
	this.irqEventId = this.mainboard.synchroniser.addEvent( 'mapper65 irq', -1, function() {} );
};

mapper65.prototype.write8PrgRom = function( offset, data ) {

	this.mainboard.synchroniser.synchronise();

	switch ( offset & 0xF000 ) {
		case 0x8000: // prg select
			this.switch8kPrgBank( data, 0 );
		break;
		case 0x9000: // irq / mirroring registers
		{
			switch ( offset ) {
			case 0x9001: //Mirroring
				if ( ( data & 0x80 ) === 0 ) {
					this.mainboard.ppu.changeMirroringMethod( PPU_MIRRORING_VERTICAL );
				} else {
					this.mainboard.ppu.changeMirroringMethod( PPU_MIRRORING_HORIZONTAL );
				}
				break;
			case 0x9003: //IRQ Enable
				this.irqEnabled = ( data & 0x80 ) > 0;
				this.mainboard.cpu.holdIrqLineLow( false );
				break;
			case 0x9004: //IRQ Reload
				this.irqCounter = this.irqReload * COLOUR_ENCODING_MTC_PER_CPU;
				this.mainboard.cpu.holdIrqLineLow( false );
				var nextIrqRaise = -1;
				if ( this.irqEnabled ) {
					nextIrqRaise = this.mainboard.synchroniser.getCpuMTC() + this.irqCounter;
				}
				if ( nextIrqRaise !== this.nextIrqRaise ) {
					this.mainboard.synchroniser.changeEventTime( this.irqEventId, nextIrqRaise );
					this.nextIrqRaise = nextIrqRaise;
				}
				break;
			case 0x9005: //High 8 bits of IRQ Reload
				this.irqReload = ( this.irqReload & 0xFF ) | ( data << 8 );
				break;
			case 0x9006: //Low 8 bits of IRQ Reload
				this.irqReload = ( this.irqReload & 0xFF00 ) | data;
				break;
			}
		}
		break;
		case 0xA000: // prg select
			this.switch8kPrgBank( data, 1 );
		break;
		case 0xB000: // chr registers
		{
			var chrBank = offset & 0x7;
			this.switch1kChrBank( data, chrBank );
		}
		break;
		case 0xC000: // prg select
			this.switch8kPrgBank( data, 2 );
		break;
	}
};


mapper65.prototype.synchronise = function( startTicks, endTicks ) {

	if ( this.irqEnabled ) {
		this.irqCounter -= ( endTicks - startTicks );
		if ( this.irqCounter <= 0 ) {
			this.mainboard.synchroniser.changeEventTime( this.irqEventId, -1 );
			this.mainboard.cpu.holdIrqLineLow( true );
			this.irqCounter = 0;
			this.irqEnabled = false;
		}
	}
};


Nes.mappers[65] = mapper65;

