

this.Nes = this.Nes || {};

"use strict";

var mapper3 = function() {
};

mapper3.prototype = Object.create( Nes.basemapper.prototype );

mapper3.prototype.reset = function() {

	if ( this.get16kPrgBankCount() === 1 )
	{
		this.switch16kPrgBank( 0, true );
		this.switch16kPrgBank( 0, false );
	}
	else
	{
		this.switch32kPrgBank( 0 );
	}
	this.switch8kChrBank( 0 /* this.get8kChrBankCount() - 1 */ );
	this.mainboard.ppu.changeMirroringMethod( this.mirroringMethod );
};

mapper3.prototype.write8PrgRom = function( offset, data ) {
	this.mainboard.synchroniser.synchronise();
	this.switch8kChrBank( data );
};

mapper3.prototype.write8ChrRom = function( offset, data ) {
	// do nothing - CHR rom not writable
};


Nes.mappers[3] = mapper3;

