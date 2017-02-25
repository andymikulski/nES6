

this.Test = this.Test || {};

(function(){
	"use strict";


	var TestRenderSurface = function( canvasParent ) {

		this._buffer = new Uint32Array( SCREEN_WIDTH * SCREEN_HEIGHT );
	};


	TestRenderSurface.prototype.writeToBuffer = function( bufferIndex, insertIndex, colour ) {

		this._buffer[ insertIndex ] = 0xFF000000 | colour;
	};


	TestRenderSurface.prototype.clearBuffers = function( backgroundColour ) {

		for ( var i=0; i<this._buffer.length; ++i ) {
			this._buffer[i] = 0xFF000000 | backgroundColour;
		}
	};


	TestRenderSurface.prototype.render = function( mainboard ) {

	};


	TestRenderSurface.prototype.getRenderBufferHash = function() {

		var rusha = new Rusha();
		return rusha.digestFromArrayBuffer( this._buffer ).toUpperCase();
	};


	TestRenderSurface.prototype.screenshot = function() {
	};


	Test.TestRenderSurface = TestRenderSurface;

}());
