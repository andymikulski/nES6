

this.Gui = this.Gui || {};

(function(){
	"use strict";

	var spriteWidth = 8;
	var spriteHeight = 8;
	var canvasWidth = spriteWidth * 8;
	var canvasHeight = spriteHeight * 8;
	var displayMultiplier = 4;

	var SpriteDisplayWindow = function( mainboard, divElement ) {

		this.mainboard = mainboard;

		// add canvas for rendering all sprites on
		this.offscreenElement = document.createElement('canvas');
		this.offscreenElement.width = canvasWidth;
		this.offscreenElement.height = canvasHeight;
		this.offscreenCanvas = this.offscreenElement.getContext( "2d" );
		this.offscreenCanvas.imageSmoothingEnabled = false;
		this.offscreenData = this.offscreenCanvas.getImageData( 0, 0, canvasWidth, canvasHeight );
		this.offscreen32BitView = new Uint32Array( this.offscreenData.data.buffer );

		this.element = document.createElement('canvas');
		this.element.width = canvasWidth * displayMultiplier;
		this.element.height = canvasHeight * displayMultiplier;
		this.canvas = this.element.getContext("2d");
		this.canvas.imageSmoothingEnabled = false;

		divElement.appendChild( this.element );

		this.infoElement = document.createElement( 'p' );

		divElement.appendChild( this.infoElement );

		this.loadSpriteData();
	};


	SpriteDisplayWindow.prototype._loadSpriteData = function() {

		// copy of renderSprite function in ppu.js
		// TODO: tidy up
		if ( this.mainboard.cart ) {

			var innerHtmlText = '';
			var spriteMemory = this.mainboard.ppu.spriteMemory;

			for ( var spriteIndex=0; spriteIndex<64; ++spriteIndex ) {

				var memIndex = spriteIndex * 4;

				var sy = spriteMemory[ memIndex + 0 ] + 1;
				var patternnum = spriteMemory[ memIndex + 1 ];
				var attribs = spriteMemory[ memIndex + 2 ];
				var sx = spriteMemory[ memIndex + 3 ];

		//		innerHtmlText += spriteIndex + ": " + sx + "x" + sy + "</br>";

				var flipHorz = ( attribs & 0x40 ) > 0;
				var flipVert = ( attribs & 0x80 ) > 0;

				for ( var y=0; y<8; ++y ) {
					var ppuAddress = 0;

					if ( ( this.mainboard.ppu.control1 & 0x20 ) === 0 /*!ppuControl1.spriteSize*/ )
					{
						ppuAddress = ( patternnum * 16 ) + ( ( flipVert ? 7 - y : y ) & 0x7 ) + ( ( this.mainboard.ppu.control1 & 0x8 ) > 0 /*ppuControl1.spritePatternTableAddress*/ ? 0x1000 : 0 );
					}
					else // big sprites - if sprite num is even, use 0x0 else use 0x1000
					{
						ppuAddress = ((patternnum & 0xFE) * 16) + ((patternnum & 0x01) * 0x1000);

						// var topsprite = IS_INT_BETWEEN( scanline, sy, sy + 8 );

						// if ( !topsprite )
						// { // on flipped, put top sprite on bottom & vis versa
							// if ( flipVert )
								// ppuAddress += 15 - y;
							// else
								// ppuAddress += 8 + y;
						// }
						// else
						// {
							// if ( flipVert )
								// ppuAddress += 23 - y;
							// else
								// ppuAddress += y;
						// }
					}

					var firstByte = this.mainboard.ppu.read8( ppuAddress );
					var secondByte = this.mainboard.ppu.read8( ppuAddress + 8 );
					var paletteMergeByte = (attribs & 3) << 2;

					for ( var x=0; x<8; ++x )
					{
						var mask = 0x80 >> ( flipHorz ? 7 - x : x );

						// get 2 lower bits from the pattern table for the colour index
						var paletteindex = ( firstByte & mask ) > 0 ? 1 : 0; // first bit
						paletteindex |= ( secondByte & mask ) > 0 ? 2 : 0; // second bit

						var colour;
						// add 2 upper bits
						if ( paletteindex > 0 ) {
							paletteindex |= paletteMergeByte;
							var paletteIndex = this.mainboard.ppu.paletteTables[ 1 ][ paletteindex ];
							colour = this.mainboard.renderBuffer.defaultPalette32BitVals[ paletteIndex || 0 ] || 0;
						} else {
							var paletteIndex = this.mainboard.ppu.paletteTables[ 1 ][ 0 ];
							colour = this.mainboard.renderBuffer.defaultPalette32BitVals[ paletteIndex ];
						}

						var screenIndex = ( ( spriteIndex % 8 ) * 8 + y ) * 64 + ( Math.floor( spriteIndex / 8 ) * 8 ) + x
						this.offscreen32BitView[ screenIndex ] = colour;
					}
				}
			}

			this.infoElement.innerHTML = innerHtmlText;
		}

		this.updateCanvas();
		var that = this;
		setTimeout( function() { that._loadSpriteData(); }, 1000 );
	};


	SpriteDisplayWindow.prototype._updateCanvas = function() {

		this.offscreenCanvas.putImageData( this.offscreenData, 0, 0 );
		// Draw offscreen canvas onto front buffer, resizing it in the process
		this.canvas.drawImage( this.offscreenElement, 0, 0, this.element.clientWidth, this.element.clientHeight );
	};


	Gui.SpriteDisplayWindow = SpriteDisplayWindow;

}());
