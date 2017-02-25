

this.Nes = this.Nes || {};

(function(){
	"use strict";



	var mapper78 = function() {
	};

	mapper78.prototype = Object.create( Nes.basemapper.prototype );

	mapper78.prototype.reset = function() {

		this.switch16kPrgBank( 0, true );
		this.switch16kPrgBank( this.get16kPrgBankCount() - 1, false );
	//     "   - The first 8K VROM bank may or may not be swapped into $0000 when
    //       the cart is reset. I have no ROM images to test."
		this.switch8kChrBank( 0 );
		this.mainboard.ppu.changeMirroringMethod( this.mirroringMethod );
	};

	mapper78.prototype.write8PrgRom = function( offset, data ) {

		this.mainboard.synchroniser.synchronise();
		this.switch16kPrgBank( data & 0xF, true );
		this.switch8kChrBank( ( data & 0xF0 ) >> 4 );
	};

	Nes.mappers[78] = mapper78;



}());
