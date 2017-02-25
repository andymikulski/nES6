

this.Nes = this.Nes || {};

"use strict";


var mapper6 = function() {
};

mapper6.prototype = Object.create( Nes.basemapper.prototype );

mapper6.prototype.reset = function() {

	this.switch16kPrgBank( 0, true );
	this.switch16kPrgBank( 7, false );
	this.switch8kChrBank( 0 );
	this.mainboard.ppu.changeMirroringMethod( this.mirroringMethod );
};

mapper6.prototype.write8PrgRom = function( offset, data ) {

	this.mainboard.synchroniser.synchronise();
	this.switch8kChrBank( data & 0x3 );
	this.switch16kPrgBank( ( data & 0x3C ) >> 2, true );
};

Nes.mappers[6] = mapper6;

