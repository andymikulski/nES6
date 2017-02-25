

this.Nes = this.Nes || {};

(function(){
	"use strict";

	Nes.trace_cpu = 0;
	Nes.trace_cpuInstructions = 1;
	Nes.trace_ppu = 2;
	Nes.trace_mapper = 3;
	Nes.trace_apu = 4;
	Nes.trace_all = 5;


	var Trace = function( ) {

		this._lines = [];
		this._running = false;
		this._enabledTypes = new Array( Nes.trace_all + 1 );
		for ( var i=0; i<this._enabledTypes.length; ++i ) {
			this._enabledTypes[ i ] = 0;
		}
	};


	Trace.prototype.enabled = function() {

		return this._running;
	};


	Trace.prototype.enableType = function( traceType, checked ) {

		this._enabledTypes[ traceType ] = checked ? 1 : 0;
	};


	Trace.prototype.writeLine = function( traceType, line ) {

		if ( this._running ) {
			if ( this._enabledTypes[ traceType ] === 1 ) {
				this._lines.push( line + '\r\n' );
			}
		}
	};


	Trace.prototype.start = function() {

		this._running = true;
	};


	Trace.prototype.stop = function() {

		this._running = false;

		// save to file
		if ( this._lines.length > 0 ) {
			var blob = new Blob( this._lines, {type: "text/plain;charset=utf-8"} );
			saveAs( blob, "trace.txt" );
			this._lines.length = 0;
		}
	};


	Nes.Trace = new Trace();

}());
