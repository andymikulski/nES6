

this.Nes = this.Nes || {};

(function(){
	"use strict";

	Nes.traceCpu = 0;
	Nes.traceCpuInstructions = 1;
	Nes.tracePpu = 2;
	Nes.traceMapper = 3;
	Nes.traceApu = 4;
	Nes.traceAll = 5;


	var Trace = function( ) {

		this.lines = [];
		this.running = false;
		this.enabledTypes = new Array( Nes.traceAll + 1 );
		for ( var i=0; i<this.enabledTypes.length; ++i ) {
			this.enabledTypes[ i ] = 0;
		}
	};


	Trace.prototype.enabled = function() {

		return this.running;
	};


	Trace.prototype.enableType = function( traceType, checked ) {

		this.enabledTypes[ traceType ] = checked ? 1 : 0;
	};


	Trace.prototype.writeLine = function( traceType, line ) {

		if ( this.running ) {
			if ( this.enabledTypes[ traceType ] === 1 ) {
				this.lines.push( line + '\r\n' );
			}
		}
	};


	Trace.prototype.start = function() {

		this.running = true;
	};


	Trace.prototype.stop = function() {

		this.running = false;

		// save to file
		if ( this.lines.length > 0 ) {
			var blob = new Blob( this.lines, {type: "text/plain;charset=utf-8"} );
			saveAs( blob, "trace.txt" );
			this.lines.length = 0;
		}
	};


	Nes.Trace = new Trace();

}());
