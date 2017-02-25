

this.Nes = this.Nes || {};

"use strict";


var mapper8 = function() {
};

mapper8.prototype = Object.create( Nes.basemapper.prototype );

mapper8.prototype.reset = function() {

	this.switch16kPrgBank( 0, true );
	this.switch16kPrgBank( 1, false );
	this.switch8kChrBank( 0 );
	this.mainboard.ppu.changeMirroringMethod( this.mirroringMethod );
};

mapper8.prototype.write8PrgRom = function( offset, data ) {

	this.mainboard.synchroniser.synchronise();
	this.switch8kChrBank( data & 0x7 );
	this.switch16kPrgBank( ( data & 0xF8 ) >> 3, true );
};

Nes.mappers[8] = mapper8;

