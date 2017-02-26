import { saveAs } from 'file-saver';
import { rusha } from '../../utils/serialisation';
import {
	g_ClearScreenArray,
	SCREEN_WIDTH,
	SCREEN_HEIGHT,
} from '../../config/consts';

export default class CanvasRenderSurface {
	constructor( canvasParent ) {
		this._clearArray = new Uint32Array( SCREEN_WIDTH * SCREEN_HEIGHT );
		this._clearArrayColour = this._clearArray[0];

		this._bufferIndexArray = new Int32Array( SCREEN_WIDTH * SCREEN_HEIGHT );

		this._offscreenElement = document.createElement('canvas');
		this._offscreenElement.width = SCREEN_WIDTH;
		this._offscreenElement.height = SCREEN_HEIGHT;
		this._offscreenCanvas = this._offscreenElement.getContext( "2d" );
		//this._offscreenCanvas.imageSmoothingEnabled = false;
		this._offscreenData = this._offscreenCanvas.getImageData( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );

		if ( !this._offscreenData.data.buffer ) {
			throw new Error( "Browser does not support canvas image buffers. Cannot run emulator" );
		}
		// Chrome & Firefox support passing the underlying image data buffer to Uint32Array(). IE does not.
		this._offscreen32BitView = new Uint32Array( this._offscreenData.data.buffer );
		if ( this._offscreen32BitView.length !== this._clearArray.length ) {
			throw new Error( "Unexpected canvas buffer size (actual=" + this._offscreen32BitView.length + ")" );
		}

		this._element = canvasParent.getCanvasElement();
		this._canvas = this._element.getContext("2d");
		//this._canvas.imageSmoothingEnabled = false;
	}


	writeToBuffer( bufferIndex, insertIndex, colour ) {
		var existingIndex = this._bufferIndexArray[insertIndex];
		if ( existingIndex <= bufferIndex ) {
			this._offscreen32BitView[insertIndex] = 0xFF000000 | colour;
			this._bufferIndexArray[insertIndex] = bufferIndex;
		}
	}


	getRenderBufferHash() {
		return rusha.digestFromArrayBuffer( this._offscreen32BitView ).toUpperCase();
	}


	clearBuffers( backgroundColour ) {

		var i=0;
		// update clear array if background colour changes
		if ( backgroundColour !== this._clearArrayColour ) {
			for ( i=0; i<this._clearArray.length; ++i ) {
				this._clearArray[ i ] = 0xFF000000 | backgroundColour;
			}
			this._clearArrayColour = backgroundColour;
		}

		// set background colour
		this._offscreen32BitView.set( this._clearArray );

		// Nes.ClearScreenArray is a quicker way of clearing this array
		this._bufferIndexArray.set( g_ClearScreenArray );
	}


	render( mainboard ) {

		this._offscreenCanvas.putImageData( this._offscreenData, 0, 0 );
		// Draw offscreen canvas onto front buffer, resizing it in the process
		this._canvas.drawImage( this._offscreenElement, 0, 0, this._element.clientWidth, this._element.clientHeight );
	}


	screenshotToFile() {

		this._offscreenElement.toBlob( function( blob ) {
			saveAs( blob, "screenshot.png" );
		});
	}


	screenshotToString() {

		return this._offscreenElement.toDataURL("image/png");
	}
}
