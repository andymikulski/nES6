

this.Nes = this.Nes || {};

"use strict";




var mapper15 = function() {
};

mapper15.prototype = Object.create( Nes.basemapper.prototype );

mapper15.prototype.reset = function() {

	this.switch32kPrgBank( 0 );
	this.useVRAM();
	this.mainboard.ppu.changeMirroringMethod( this.mirroringMethod );
};

mapper15.prototype.write8PrgRom = function( offset, data ) {

	this.mainboard.synchroniser.synchronise();

	var mirroringMethod;
	if ( ( data & 0x40 ) > 0 )
		mirroringMethod = PPU_MIRRORING_HORIZONTAL;
	else
		mirroringMethod = PPU_MIRRORING_VERTICAL;
	this.mainboard.ppu.changeMirroringMethod( mirroringMethod );

	var upper8k = ( data & 0x80 ) > 0;
	var prgBank = data & 0x3F;

	switch ( offset & 0x3 )
	{
	case 2: // 8k mode ( 1 8k bank mirrored )
		for ( var i=0; i<4; ++i )
			this.switch8kPrgBank( prgBank * 2 + ( upper8k ? 1 : 0 ), i );
		break;
	case 3: // 16k mode ( 1 16k bank mirrored )
		this.switch16kPrgBank( prgBank, true );
		this.switch16kPrgBank( prgBank, false );
		break;
	case 0: // 32k mode ( 1 32k bank, or if odd number, same as 16k mode )
		this.switch16kPrgBank( prgBank, true );
		this.switch16kPrgBank( prgBank | 1, false );
		break;
	case 1: // 128k mode ( 1 16k bank, last 16k bank fixed at 0xC00 )
		this.switch16kPrgBank( prgBank, true );
		this.switch16kPrgBank( this.get16kPrgBankCount() - 1, false );
		break;
	}
};

Nes.mappers[15] = mapper15;

