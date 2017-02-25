

this.Nes = this.Nes || {};

"use strict";


var mapper0 = function() {
};

mapper0.prototype = Object.create( Nes.basemapper.prototype );

mapper0.prototype.reset = function() {

	if ( this.get32kPrgBankCount() >= 1 )
	{
		this.switch32kPrgBank( 0 );
	}
	else if ( this.get16kPrgBankCount() == 1 )
	{
		this.switch16kPrgBank( 0, true );
		this.switch16kPrgBank( 0, false );
	}

	if ( this.get1kChrBankCount() === 0 )
	{
		this.useVRAM();
	}
	else
	{
		this.switch8kChrBank( 0 );
	}

	this.mainboard.ppu.changeMirroringMethod( this.mirroringMethod );
};

Nes.mappers[0] = mapper0;

