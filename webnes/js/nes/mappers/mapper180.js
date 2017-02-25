

this.Nes = this.Nes || {};

"use strict";


var mapper180 = function() {
};

mapper180.prototype = Object.create( Nes.basemapper.prototype );

mapper180.prototype.reset = function() {
	this.switch16kPrgBank( 0, true );
	this.switch16kPrgBank( this.get16kPrgBankCount() - 1, false );
	this.useVRAM();
	this.mainboard.ppu.changeMirroringMethod( this.mirroringMethod );
};

mapper180.prototype.write8PrgRom = function( offset, data ) {
//	this.mainboard.synchroniser.synchronise();
	this.switch16kPrgBank( data, false );
};

Nes.mappers[180] = mapper180;

