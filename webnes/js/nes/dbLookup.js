

this.Nes = this.Nes || {};

"use strict";


var calculateSha1 = function( binaryArray, startIndex ) {

	try {
		startIndex = startIndex || 0;
		var r = new Rusha( binaryArray.length - startIndex );
		// Using a subarray doesn't work. Need to copy contents into a new array (bit shit but it works)
	//	var sha1 = r.digestFromArrayBuffer( binaryArray.subarray( startIndex ).buffer ).toUpperCase();
		var buf = [];
		for ( var i=startIndex; i<binaryArray.length; ++i ) {
			buf.push( binaryArray[i] );
		}
		var sha1 = r.digestFromBuffer( buf ).toUpperCase();
		while ( sha1.length < 40 ) {
			sha1 = '0' + sha1;
		}
		return sha1;
	}
	catch ( err ) {
		console.error( err );
		console.log( err.stack );
	}
};

Nes.calculateSha1 = calculateSha1;



var dbLookup = function( shaString, callback ) {

	if ( shaString.length !== 40 ) {
		throw new Error( "dbLookup : SHA1 must be 40 characters long! [" + shaString + "]" );
	}

	var path = 'js/db/' + shaString + '.js';
	var data;
	$.getScript( path ).always(function() {
		callback( null, window['NesDb'] ? window['NesDb'][ shaString ] : null );
	} );
};


Nes.dbLookup = dbLookup;

