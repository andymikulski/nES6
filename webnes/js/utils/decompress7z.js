

this.Nes = this.Nes || {};

(function(){
	"use strict";

	var decompress7z = function( name, binaryString, completeCallback ) {

		// If lzma_worker.js is in the same directory, you don't need to set the path.
		var my_lzma = new LZMA( /*"../src/lzma_worker.js"*/ );

		my_lzma.decompress( binaryString,
			function( decompressedData ) {
				completeCallback( null, decompressedData );
			},
			function( progressPercent ) {
				if ( progressPercent < 0 ) {
					completeCallback( 'Error decompressing 7z' );
				}
			} );
	};


	Nes.decompress7z = decompress7z;

}());
