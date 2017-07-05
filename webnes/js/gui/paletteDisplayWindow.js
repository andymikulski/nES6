

this.Gui = this.Gui || {};

(function(){
	"use strict";

	var pixelColoursAcross = 16;
	var pixelColoursDown = 2;

	var pixelColourWidth = 30;
	var pixelColourHeight = 30;

	var canvasWidth = pixelColourWidth * pixelColoursAcross;
	var canvasHeight = pixelColoursDown * pixelColourHeight;


	var PaletteDisplayWindow = function( mainboard, divElement ) {

		this.mainboard = mainboard;

		// add canvas for rendering all sprites on
		this.offscreenElement = document.createElement('canvas');
		this.offscreenElement.width = pixelColoursAcross;
		this.offscreenElement.height = pixelColoursDown;
		this.offscreenCanvas = this.offscreenElement.getContext( "2d" );
		this.offscreenCanvas.imageSmoothingEnabled = false;
		this.offscreenData = this.offscreenCanvas.getImageData( 0, 0, pixelColoursAcross, pixelColoursDown );
		this.offscreen32BitView = new Uint32Array( this.offscreenData.data.buffer );

		this.element = document.createElement('canvas');
		this.element.width = canvasWidth;
		this.element.height = canvasHeight;
		this.canvas = this.element.getContext("2d");
		this.canvas.imageSmoothingEnabled = false;

		divElement.appendChild( this.element );

		this.infoElement = document.createElement('p');
		divElement.appendChild( this.infoElement );

		this.loadPaletteData();
	};


	PaletteDisplayWindow.prototype._loadPaletteData = function() {

		if ( this.mainboard.cart ) {

			var info = '';

			for ( var index=0; index<32; ++index ) {
				var paletteIndex = this.mainboard.ppu.paletteTables[ Math.floor( index / 16 ) ][ index % 16 ];
				var colour = this.mainboard.renderBuffer.defaultPalette32BitVals[ paletteIndex || 0 ] || 0;
				this.offscreen32BitView[ index ] = colour;

		//		info += ( 0x3F00 + index ).toString(16) + "=" + paletteIndex.toString( 16 ) + "</br>";
			}

			this.infoElement.innerHTML = info;
		}

		this.updateCanvas();
		var that = this;
		setTimeout( function() { that._loadPaletteData(); }, 1000 );
	};


	PaletteDisplayWindow.prototype._updateCanvas = function() {

		this.offscreenCanvas.putImageData( this.offscreenData, 0, 0 );
		// Draw offscreen canvas onto front buffer, resizing it in the process
		this.canvas.drawImage( this.offscreenElement, 0, 0, this.element.clientWidth, this.element.clientHeight );
	};


	Gui.PaletteDisplayWindow = PaletteDisplayWindow;

}());
