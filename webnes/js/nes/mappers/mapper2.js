

this.Nes = this.Nes || {};

"use strict";


var mapper2 = function() {
};

mapper2.prototype = Object.create( Nes.basemapper.prototype );

mapper2.prototype.reset = function() {
	this.switch16kPrgBank( 0, true );
	this.switch16kPrgBank( this.get16kPrgBankCount() - 1, false );
	this.useVRAM();
	this.mainboard.ppu.changeMirroringMethod( this.mirroringMethod );
};

mapper2.prototype.write8PrgRom = function( offset, data ) {
//	this.mainboard.synchroniser.synchronise();
	this.switch16kPrgBank( data, true );
};

Nes.mappers[2] = mapper2;

