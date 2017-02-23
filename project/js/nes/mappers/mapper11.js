

this.Nes = this.Nes || {};

"use strict";


var mapper11 = function() {
};

mapper11.prototype = Object.create( Nes.basemapper.prototype );

mapper11.prototype.reset = function() {

	this.switch32kPrgBank( this.get32kPrgBankCount() - 1 );
	//this.switch8kChrBank( this.get8kChrBankCount() - 1 );
	this.switch8kChrBank( 0 );
	this.mainboard.ppu.changeMirroringMethod( this.mirroringMethod );
};

mapper11.prototype.write8PrgRom = function( offset, data ) {

	this.mainboard.synchroniser.synchronise();
	this.switch32kPrgBank( data & 0x3 );
	this.switch8kChrBank( ( data & 0xF0 ) >> 4 );
};

Nes.mappers[11] = mapper11;

