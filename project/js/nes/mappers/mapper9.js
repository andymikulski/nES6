

this.Nes = this.Nes || {};

"use strict";


var mapper9 = function() {

	this._banks = new Int32Array( 4 );
};

mapper9.prototype = Object.create( Nes.basemapper.prototype );


mapper9.prototype.mapperSaveState = function( state ) {

	state._banks = Nes.uintArrayToString( this._banks );
	state._latches = this._latches.slice( 0 );
};

mapper9.prototype.mapperLoadState = function( state ) {

	this._banks = Nes.stringToUintArray( state._banks );
	this._latches = state._latches.slice( 0 );
};

mapper9.prototype.reset = function() {

	this._latches = [ true, false ];
	for ( var i=0; i<this._banks.length; ++i ) {
		this._banks[i] = 0;
	}

	this.switch32kPrgBank( this.get32kPrgBankCount() - 1 );
	for ( var i=0; i<8; ++i ) {
		this.switch1kChrBank( 0, i );
	}
//	this.switch8kChrBank( 0 );
	this.mainboard.ppu.changeMirroringMethod( this.mirroringMethod );
};

mapper9.prototype._syncChrBanks = function( performSync ) {

	if ( performSync === undefined ? true : performSync ) {
		this.mainboard.synchroniser.synchronise();
	}
	var lowerBankId = this._latches[ 0 ] ? 1 : 0;
	this.switch4kChrBank( this._banks[ lowerBankId ], true );
	var upperBankId = this._latches[ 1 ] ? 3 : 2;
	this.switch4kChrBank( this._banks[ upperBankId ], false );
};

mapper9.prototype.MMC2Latch = function( ppuReadAddress ) {

	// http://wiki.nesdev.com/w/index.php/MMC2
	if ( ppuReadAddress === 0xFD8 ) {
		this._latches[ 0 ] = false;
		this._syncChrBanks( false );
	} else if ( ppuReadAddress === 0xFE8 ) {
		this._latches[ 0 ] = true;
		this._syncChrBanks( false );
	} else if ( ppuReadAddress >= 0x1FD8 && ppuReadAddress <= 0x1FDF ) {
		this._latches[ 1 ] = false;
		this._syncChrBanks( false );
	} else if ( ppuReadAddress >= 0x1FE8 && ppuReadAddress <= 0x1FEF ) {
		this._latches[ 1 ] = true;
		this._syncChrBanks( false );
	}
	// var latchId = ( ppuReadAddress & 0x1000 ) > 0 ? 1 : 0;
	// var tilenum = ( ppuReadAddress >> 4 ) & 0xFF;
	// var isFE = tilenum === 0xFE;
	// if ( tilenum === 0xFD || isFE ) {
		// this._latches[ latchId ] = isFE;
		// this._syncChrBanks();
	// }
};

mapper9.prototype.write8PrgRom = function( offset, data ) {

	var top4Bits = offset & 0xF000;
	switch ( top4Bits ) {
	case 0xA000:
		this.mainboard.synchroniser.synchronise();
		this.switch8kPrgBank( data & 0xf, 0 );
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
		this.mainboard.ppu.changeMirroringMethod( ( ( data & 0x1 ) > 0 ) ? PPU_MIRRORING_HORIZONTAL : PPU_MIRRORING_VERTICAL );
	break;
	default:
		Nes.basemapper.prototype.write8PrgRom.call( this, offset, data );
	break;
	}
};

Nes.mappers[9] = mapper9;

