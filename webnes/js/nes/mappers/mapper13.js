

this.Nes = this.Nes || {};

"use strict";



var mapper13 = function() {
};

mapper13.prototype = Object.create( Nes.basemapper.prototype );

mapper13.prototype.reset = function() {

	this.switch32kPrgBank( 0 );
	this.useVRAM( 16 );
	this.mainboard.ppu.changeMirroringMethod( this.mirroringMethod );
};

mapper13.prototype.write8PrgRom = function( offset, data ) {

	this.mainboard.synchroniser.synchronise();
	this.switch4kChrBank( data, false );
};

Nes.mappers[13] = mapper13;

