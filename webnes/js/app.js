

this.Gui = this.Gui || {};
var animateFunction;


(function(){
	"use strict";


	var App = function() {
		var that = this;

		this.cart = null;
		this.romLoaded = false;
		this.mainboard = null;
		this.renderSurface = null;
		this.fpsMeter = null;
		this.spriteDisplay = null;
		this.paletteDisplay = null;
		this.logWindow = null;
		this.cpuInstructionsWindow = null;
		this.input = null;
		this.encodingTypeToSet = '';
		this.newRomWaiting = false;
		this.newRomLoaded = { name: '', binaryString: null };
		this.eventBus = new Nes.EventBus();

		this.frameTimeTarget = 0;
		this.lastFrameTime = 0;
		this.gameSpeed = 100; // 100% normal speed

		this.isPaused = 0;
		this.pauseNextFrame = false;
		this.pauseOnFrame = -1;

		this.options = {};

		window.onerror = function(e) { that._showError( e ); };
	};


	App.prototype.connect = function( name, cb ) {

		this.eventBus.connect( name, cb );
	};


	App.prototype.setColourEncodingType = function( encodingType ) {

		this.encodingTypeToSet = encodingType;
	};


	App.prototype._loadRomCallback = function( name, binaryString ) {

		this.newRomWaiting = true;
		this.newRomLoaded = { name: name, binaryString: binaryString };
	};


	App.prototype.start = function( options ) {

		this.options = options || {};
		this.options.triggerFrameRenderedEvent = this.options.triggerFrameRenderedEvent === undefined ? false : this.options.triggerFrameRenderedEvent;
		this.options.createGuiComponents = !!this.options.createGuiComponents;

		var that = this;

		if ( this.options.createGuiComponents ) {
			window.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

			this.fpsMeter = new FPSMeter( null, { top: '10%', left: '80%' } );
			this.fpsMeter.hide();
			Gui.hookDragDropEvents( function( name, binaryString ) { that._loadRomCallback( name, binaryString ); } );

			this.canvasParent = new Gui.CanvasParent();
			this.renderSurface = null;
			if ( WebGl.webGlSupported() ) {
				console.log( "Using WebGL for rendering..." );
				this.renderSurface = new Gui.WebGlRenderSurface( this.canvasParent );
				$('#postProcessingDiv').css( 'display', 'block' ); // Show shader drop list
			} else {
				console.log( "WebGL not supported. Using canvas for rendering..." );
				this.renderSurface = new Gui.CanvasRenderSurface( this.canvasParent );
			}
		} else {
			this.renderSurface = new Test.TestRenderSurface();
		}

		this.mainboard = new Nes.mainboard( this.renderSurface );
		this.mainboard.connect( 'reset', function() { that._onReset(); } );

		if ( this.options.createGuiComponents ) {
			this.ggDialog = new Gui.GameGenieDialog( this );
			this.controlBar = new Gui.ControlBar( this );
			this.controlBar.connect( 'romLoaded', function( name, binaryString ) { that._loadRomCallback( name, binaryString ); } );
			this.input = new Gui.Input( this.mainboard );
			this.keyboardRemapDialog = new Gui.KeyboardRemapper( this );
		}

		this.saveStateManager = new Gui.SaveStateManager( this, this.options.createGuiComponents );

		// var sde = $( ".spriteDisplay" );
		// if ( sde.length > 0 ) {
			// this.spriteDisplay = new Gui.SpriteDisplayWindow( this.mainboard, sde[0] );
		// }
		// var pde = $( ".paletteDisplay" );
		// if ( pde.length > 0 ) {
			// this.paletteDisplay = new Gui.PaletteDisplayWindow( this.mainboard, pde[0] );
		// }
		// var cpu = $( ".cpuInstructions" );
		// if ( cpu.length > 0 ) {
			// this.cpuInstructionsWindow = new Nes.CpuInstructionsWindow( this.mainboard, cpu[0] );
		// }
		// var log = $( ".logWindow" );
		// if ( log.length > 0  ) {
			// this.logWindow = new Nes.LogWindow( this.mainboard, log[0] );
		// }

		window.setFastTimeout( animateFunction );
		if ( this.options.loadUrl ) {
			this.loadRomFromUrl( this.options.loadUrl );
		}
		this.animate();
	};


	App.prototype.pause = function( isPaused ) {
		const changed = isPaused !== this.isPaused;
		this.isPaused = isPaused;

		if ( changed ) {
			this.eventBus.invoke( 'isPausedChange', isPaused );
		}
	};


	App.prototype.isPaused = function() {
		return this.isPaused;
	};


	App.prototype._onReset = function() {

		this.calculateFrameTimeTarget();
	};


	App.prototype._calculateFrameTimeTarget = function() {
		if ( this.gameSpeed > 0 ) {
			var base = ( 100000 / this.gameSpeed ); // 100000 = 1000 * 100 ( 1000 milliseconds, multiplied by 100 as gameSpeed is a %)
			this.frameTimeTarget = ( base / COLOUR_ENCODING_REFRESHRATE );
		}
	};


	App.prototype.reset = function() {

		this.mainboard.reset();
	};


	App.prototype.playOneFrame = function() {
		this.pause( false );
		this.pauseNextFrame = true;
	};


	App.prototype.playUntilFrame = function( frameNum ) {
		this.pause( false );
		this.pauseOnFrame = frameNum;
	};


	App.prototype.enableSound = function( enable ) {
		this.mainboard.enableSound( enable );
	};


	App.prototype.soundEnabled = function() {
		return this.mainboard.apu.soundEnabled();
	};


	App.prototype.soundSupported = function() {
		return this.mainboard.apu.soundSupported();
	};


	App.prototype.setVolume = function( val ) {
		this.mainboard.setVolume( val );
	};


	App.prototype.setGameSpeed = function( gameSpeed ) {

		this.gameSpeed = gameSpeed;
		this.calculateFrameTimeTarget();
	};


	App.prototype.setTraceOption = function( traceType, checked ) {

		this.mainboard.setTraceOption( traceType, checked );
	};


	App.prototype._readyToRender = function() {
		if ( this.gameSpeed <= 0 ) {
			return true;
		}
		var now = performance ? performance.now() : Date.now(); // Date.now() in unsupported browsers
		var diff = now - this.lastFrameTime;
		if ( diff >= this.frameTimeTarget ) {
			this.lastFrameTime = now;
			return true;
		} else {
			return false;
		}
	};


	App.prototype.showFpsMeter = function( show ) {
		if ( show ) {
			this.fpsMeter.show();
		} else {
			this.fpsMeter.hide();
		}
	};


	App.prototype.startTrace = function() {

		this.eventBus.invoke( 'traceRunning', true );
		// if ( traceType === 'cpuInstructions' ) {
		this.mainboard.cpu.enableTrace( true );
		// }
		Nes.Trace.start();
	};


	App.prototype.stopTrace = function() {

		Nes.Trace.stop();
		this.mainboard.cpu.enableTrace( false );
		this.eventBus.invoke( 'traceRunning', false );
	};


	App.prototype.screenshot = function() {

		this.renderSurface.screenshotToFile();
	};


	App.prototype._animate = function() {

		var that = this;

		if ( this.newRomWaiting ) {
			this.doRomLoad( this.newRomLoaded.name, this.newRomLoaded.binaryString );
			this.newRomWaiting = false;
		}

		if ( this.romLoaded ) {
			this.romLoaded = false;
			this.mainboard.loadCartridge( this.cart );
			this.eventBus.invoke( 'cartLoaded', this.cart );
		}

		if ( this.encodingTypeToSet.length > 0 ) {
			setColourEncodingType( this.encodingTypeToSet );
			this.encodingTypeToSet = '';
		}

		if ( this.isPaused ) {
			setTimeout( animateFunction, 300 );
			return;
		}

		if ( this.readyToRender() ) {

			if ( this.input ) {
				this.input.poll();
			}

			var bgColour = this.mainboard.renderBuffer.pickColour( this.mainboard.ppu.getBackgroundPaletteIndex() );
			this.renderSurface.clearBuffers( bgColour );
			this.mainboard.renderBuffer.clearBuffer();

			this.mainboard.doFrame();
			this.renderSurface.render( this.mainboard );

			if ( this.options.triggerFrameRenderedEvent ) {
				this.eventBus.invoke( 'frameRendered', this.renderSurface, this.mainboard.ppu.frameCounter );
			}

			if ( this.fpsMeter ) {
				this.fpsMeter.tick();
			}
		}

		if ( this.pauseNextFrame ) {
			this.pauseNextFrame = false;
			this.pause( true );
		}

		if ( this.pauseOnFrame >= 0 && this.pauseOnFrame === this.mainboard.ppu.frameCounter ) {
			this.pauseOnFrame = -1;
			this.pause( true );
		}

		this.saveStateManager.onFrame();
		setImmediate( animateFunction );
	};


	App.prototype._doRomLoad = function( name, binaryString ) {
		var that = this;
		this.cart = new Nes.cartridge( this.mainboard );
		this.cart.loadRom( name, binaryString, function( err ) {
			if ( !err ) {
				that._romLoaded = true;
			} else {
				that._showError( err );
			}
		} );
	};


	App.prototype.loadRomFromUrl = function( url ) {

		var that = this;
		Nes.loadRomFromUrl( url, function( err, name, binary ) {
			if ( !err ) {
				that._loadRomCallback( name, binary );
			} else {
				that._showError( err );
			}
		} );
	};


	App.prototype._showError = function( err ) {

		console.log( err );
		var errorType = typeof err;
		var msg = '';
		if ( errorType === 'string' ) {
			msg = err;
		} else if ( errorType === 'object' ) {
			if ( err.message ) {
				msg = err.message;
			} else {
				msg = err.toString();
			}
		} else {
			msg = err.toString();
		}
		this.eventBus.invoke( 'romLoadFailure', msg );
	};


	App.prototype.gameGenieCode = function( code ) {

		Nes.processGameGenieCode( this.mainboard, code, true );
	};


	App.prototype.loadShaderFromUrl = function( url ) {

		if ( this.renderSurface.loadShaderFromUrl ) {
			this.renderSurface.loadShaderFromUrl( url );
		}
	};


	Gui.App = new App();

}());


animateFunction = function() {
	Gui.App._animate();
};
