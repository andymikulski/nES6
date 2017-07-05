

this.Nes = this.Nes || {};

"use strict";


var mapper41 = function() {
};

mapper41.prototype = Object.create( Nes.basemapper.prototype );

mapper41.prototype.reset = function() {

	this.prgBank = 0;
	this.chrOuter = 0;
	this.chrInner = 0;
	this.mainboard.ppu.changeMirroringMethod( this.mirroringMethod );
	this.sync();
};


mapper41.prototype.write8SRam = function( offset, data ) {

	if ( ( offset & 0xF800 ) === 0x6000 ) {

		this.mainboard.synchroniser.synchronise();
		this.prgBank = offset & 0x7;
		this.chrOuter = ( offset & 0x18 ) >> 1;

		if ( ( offset & 0x20 ) === 0 ) {
			this.mainboard.ppu.changeMirroringMethod( PPU_MIRRORING_VERTICAL );
		} else {
			this.mainboard.ppu.changeMirroringMethod( PPU_MIRRORING_HORIZONTAL );
		}

		this.sync();
	}
};


mapper41.prototype.write8PrgRom = function( offset, data ) {

	this.mainboard.synchroniser.synchronise();
	if ( ( this.prgBank & 0x4 ) > 0 ) {
		// enable inner chr bank select if bit 0x4 is set in prg bank id
		this.chrInner = data & 0x3;
	}
	this.sync();
};


mapper41.prototype._sync = function() {

	this.switch32kPrgBank( this.prgBank );
	var chr8kBank = this.chrOuter | this.chrInner;
	this.switch8kChrBank( chr8kBank );
};


Nes.mappers[41] = mapper41;

