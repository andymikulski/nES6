

this.Nes = this.Nes || {};

"use strict";


var mapper66 = function() {
};

mapper66.prototype = Object.create( Nes.basemapper.prototype );

mapper66.prototype.reset = function() {

	this.switch32kPrgBank( this.get32kPrgBankCount() - 1 );
	this.switch8kChrBank( this.get8kChrBankCount() - 1 );
	this.mainboard.ppu.changeMirroringMethod( this.mirroringMethod );
};

mapper66.prototype.write8PrgRom = function( offset, data ) {

	this.mainboard.synchroniser.synchronise();
	this.switch8kChrBank( data & 0x3 );
	this.switch32kPrgBank( ( data & 0x30 ) >> 4 );
};

Nes.mappers[66] = mapper66;

