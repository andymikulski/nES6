

this.Nes = this.Nes || {};

"use strict";


var mapper34 = function() {
};

mapper34.prototype = Object.create( Nes.basemapper.prototype );

mapper34.prototype.reset = function() {

	var isImpossibleMission2 = this.mainboard.cart.getHash() === "68315AFB344108CB0D43E119BA0353D5A44BD489";
	this.isNinaBoard = isImpossibleMission2;
	this.switch32kPrgBank( 0 );
	if ( this.get8kChrBankCount() === 0 )
	{
		this.useVRAM();
	}
	else
	{
		this.switch8kChrBank( 0 );
	}
	this.mainboard.ppu.changeMirroringMethod( this.mirroringMethod );
};


mapper34.prototype.write8SRam = function( offset, data ) {
	if ( this.isNinaBoard ) {
		this.mainboard.synchroniser.synchronise();
		if ( offset === 0x7FFE ) {
			this.switch4kChrBank( data & 0xF, true );
		} else if ( offset === 0x7FFF ) {
			this.switch4kChrBank( data & 0xF, false );
		} else if ( offset === 0x7FFD ) {
			this.switch32kPrgBank( data & 0x1 );
		} else {
			Nes.basemapper.prototype.write8SRam.call( this, offset, data );
		}
	} else {
		Nes.basemapper.prototype.write8SRam.call( this, offset, data );
	}
};

mapper34.prototype.write8PrgRom = function( offset, data ) {
	if ( !this.isNinaBoard ) {
		this.mainboard.synchroniser.synchronise();
		this.switch32kPrgBank( data & 0xFF );
	} else {
		Nes.basemapper.prototype.write8PrgRom.call( this, offset, data );
	}
};

Nes.mappers[34] = mapper34;

