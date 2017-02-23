

this.Nes = this.Nes || {};

"use strict";


var mapper7 = function() {
};

mapper7.prototype = Object.create( Nes.basemapper.prototype );

mapper7.prototype.reset = function() {

	this.switch32kPrgBank( 0 );

	if ( this.get8kChrBankCount() === 0 )
		this.useVRAM();
	else
		this.switch8kChrBank( 0 );

	this.mirroringMethod = PPU_MIRRORING_SINGLESCREEN_NT0;
	this.mainboard.ppu.changeMirroringMethod( this.mirroringMethod );
};

mapper7.prototype.write8PrgRom = function( offset, data ) {

	this.mainboard.synchroniser.synchronise();
	this.switch32kPrgBank( data & 0xFF );

	var mirroringMethod;
	if ( ( data & 0x10 ) > 0 )
		mirroringMethod = PPU_MIRRORING_SINGLESCREEN_NT1;
	else
		mirroringMethod = PPU_MIRRORING_SINGLESCREEN_NT0;
	this.mainboard.ppu.changeMirroringMethod( mirroringMethod );
};

Nes.mappers[7] = mapper7;
