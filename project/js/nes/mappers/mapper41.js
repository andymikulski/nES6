

this.Nes = this.Nes || {};

"use strict";


var mapper41 = function() {
};

mapper41.prototype = Object.create( Nes.basemapper.prototype );

mapper41.prototype.reset = function() {

	this._prgBank = 0;
	this._chrOuter = 0;
	this._chrInner = 0;
	this.mainboard.ppu.changeMirroringMethod( this.mirroringMethod );
	this._sync();
};


mapper41.prototype.write8SRam = function( offset, data ) {

	if ( ( offset & 0xF800 ) === 0x6000 ) {

		this.mainboard.synchroniser.synchronise();
		this._prgBank = offset & 0x7;
		this._chrOuter = ( offset & 0x18 ) >> 1;

		if ( ( offset & 0x20 ) === 0 ) {
			this.mainboard.ppu.changeMirroringMethod( PPU_MIRRORING_VERTICAL );
		} else {
			this.mainboard.ppu.changeMirroringMethod( PPU_MIRRORING_HORIZONTAL );
		}

		this._sync();
	}
};


mapper41.prototype.write8PrgRom = function( offset, data ) {

	this.mainboard.synchroniser.synchronise();
	if ( ( this._prgBank & 0x4 ) > 0 ) {
		// enable inner chr bank select if bit 0x4 is set in prg bank id
		this._chrInner = data & 0x3;
	}
	this._sync();
};


mapper41.prototype._sync = function() {

	this.switch32kPrgBank( this._prgBank );
	var chr8kBank = this._chrOuter | this._chrInner;
	this.switch8kChrBank( chr8kBank );
};


Nes.mappers[41] = mapper41;

