

this.Gui = this.Gui || {};

(function(){
	"use strict";


	var CanvasRenderSurface = function( canvasParent ) {

		this.clearArray = new Uint32Array( SCREEN_WIDTH * SCREEN_HEIGHT );
		this.clearArrayColour = this.clearArray[0];

		this.bufferIndexArray = new Int32Array( SCREEN_WIDTH * SCREEN_HEIGHT );

		this.offscreenElement = document.createElement('canvas');
		this.offscreenElement.width = SCREEN_WIDTH;
		this.offscreenElement.height = SCREEN_HEIGHT;
		this.offscreenCanvas = this.offscreenElement.getContext( "2d" );
		//this.offscreenCanvas.imageSmoothingEnabled = false;
		this.offscreenData = this.offscreenCanvas.getImageData( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );

		if ( !this.offscreenData.data.buffer ) {
			throw new Error( "Browser does not support canvas image buffers. Cannot run emulator" );
		}
		// Chrome & Firefox support passing the underlying image data buffer to Uint32Array(). IE does not.
		this.offscreen32BitView = new Uint32Array( this.offscreenData.data.buffer );
		if ( this.offscreen32BitView.length !== this.clearArray.length ) {
			throw new Error( "Unexpected canvas buffer size (actual=" + this.offscreen32BitView.length + ")" );
		}

		this.element = canvasParent.getCanvasElement();
		this.canvas = this.element.getContext("2d");
		//this.canvas.imageSmoothingEnabled = false;
	};


	CanvasRenderSurface.prototype.writeToBuffer = function( bufferIndex, insertIndex, colour ) {

		//if ( baseIndex < 0 || baseIndex >= this.offscreen32BitView.length ) { throw new Error( "CanvasRenderSurface.prototype.writeToBuffer: Invalid bounds" ); }
		var existingIndex = TYPED_ARRAY_GET_INT32( this.bufferIndexArray, insertIndex );
		if ( existingIndex <= bufferIndex ) {
			TYPED_ARRAY_SET_UINT32( this.offscreen32BitView, insertIndex, 0xFF000000 | colour );
			TYPED_ARRAY_SET_INT32( this.bufferIndexArray, insertIndex, bufferIndex );
		}
	};


	CanvasRenderSurface.prototype.getRenderBufferHash = function() {

		var rusha = new Rusha();
		return rusha.digestFromArrayBuffer( this.offscreen32BitView ).toUpperCase();
	};


	CanvasRenderSurface.prototype.clearBuffers = function( backgroundColour ) {

		var i=0;
		// update clear array if background colour changes
		if ( backgroundColour !== this.clearArrayColour ) {
			for ( i=0; i<this.clearArray.length; ++i ) {
				this.clearArray[ i ] = 0xFF000000 | backgroundColour;
			}
			this.clearArrayColour = backgroundColour;
		}

		// set background colour
		this.offscreen32BitView.set( this.clearArray );

		// Nes.ClearScreenArray is a quicker way of clearing this array
		this.bufferIndexArray.set( gClearScreenArray );

		// for ( var i=0; i<this.bufferIndexArray.length; ++i ) {
			// this.bufferIndexArray[i] = 0;
			// this.offscreen32BitView[i] = backgroundColour;
		// }
	};


	CanvasRenderSurface.prototype.render = function( mainboard ) {

		this.offscreenCanvas.putImageData( this.offscreenData, 0, 0 );
		// Draw offscreen canvas onto front buffer, resizing it in the process
		this.canvas.drawImage( this.offscreenElement, 0, 0, this.element.clientWidth, this.element.clientHeight );
	};


	CanvasRenderSurface.prototype.screenshotToFile = function() {

		this.offscreenElement.toBlob( function( blob ) {
			saveAs( blob, "screenshot.png" );
		});
	};


	CanvasRenderSurface.prototype.screenshotToString = function() {

		return this.offscreenElement.toDataURL("image/png");
	};


	Gui.CanvasRenderSurface = CanvasRenderSurface;

}());
