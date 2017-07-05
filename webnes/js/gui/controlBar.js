

this.Gui = this.Gui || {};

(function(){
	"use strict";


	var ControlBar = function( app ) {

		var that = this;
		this.debugEnabled = false;
		this.isLimitOn = true;
		this.traceRunning = false;
		this.isPaused = false;
		this.encodingIgnoreNextClick = false;
		this.app = app;
		this.eventBus = new Nes.EventBus();

		this.app.connect( 'cartLoaded', ::this.onCartLoaded);
		this.app._mainboard.connect( 'soundEnabled', ::this.onSoundEnabled);
		this.app.connect( 'traceRunning', ::this.onTraceRunning);
		this.app.connect( 'frameLimit', ::this.onFrameLimitSet);
		this.app.connect( 'isPausedChange', ::this.onPauseChange);
		this.app.connect( 'romLoadFailure', ::this.onRomLoadFailure);

		this.element = $( "#controlBar" );

		this.debugBar = $( "#debugBar" );
		this.debugBar.hide();

		this.buttons = [];

		// primary buttons
		this.addButton( "controlBar_loadRomButton", { primary: { label: "Open ROM", icon: "ui-icon-folder-open" }, click: function() { that._loadRomButtonClick(); } } );
		this.addButton( "controlBar_resetButton", { enabledWhenRomIsLoaded: true, primary: { label: "Reset", icon: "ui-icon-refresh" }, click: function() { that._onResetButtonClick(); } } );
		this.playButton = this.addButton( "controlBar_playButton", { primary: { label: "Pause", icon: "ui-icon-pause" }, toggle: { label: "Play", icon: 'ui-icon-play' }, click: function() { that._onPlayButtonClick(); } } );
		this.gameGenieButton = this.addButton( "controlBar_gameGenieButton", { enabledWhenRomIsLoaded: true, primary: { label: "Game Genie", icon: "ui-icon-star" }, click: function() { that._onGameGenieButtonClick(); } } );
		this.addButton( "controlBar_quickSaveButton", { enabledWhenRomIsLoaded: true, primary: { label: "Quick save", icon: "ui-icon-disk" }, click: function() { that._onSaveButtonClick(); } } );
		this.addButton( "controlBar_quickLoadButton", { enabledWhenRomIsLoaded: true, primary: { label: "Quick load", icon: "ui-icon-folder-collapsed" }, click: function() { that._onLoadButtonClick(); } } );
		this.addButton( "controlBar_screenshotButton", { enabledWhenRomIsLoaded: true, primary: { label: "Screenshot", icon: "ui-icon-image" }, click: function() { that._onScreenshotButtonClick(); } } );
		this.debugButton = this.addButton( "controlBar_debugButton", { primary: { label: "Debug panel", icon: "ui-icon-wrench" }, click: function() { that._onDebugButtonClick(); } } );
		this.keyboardRemapperButton = this.addButton( "controlBar_keyboardRemap", { primary: { label: "Remap controls", icon: "ui-icon-calculator" }, click: function() { that._onKeyboardRemapButtonClick(); } } );

		this.soundButton = this.addButton( "controlBar_soundButton", { primary: { label: "Volume", icon: "ui-icon-volume-on" }, toggle: { label: "Volume", icon: 'ui-icon-volume-off' }, click: function() { that._onSoundButtonClick(); return false; } } );
		this.soundSlider = new Gui.ControlBarSlider( "controlBar_volumeSlider", this.soundButton, {
				minValue: 0,
				maxValue: 100,
				defaultValueIndex: 100,
				change: function( val ) {
					that._onVolumeSliderChange( val );
				}
			} );
		this.errorDisplayButton = this.addButton( "controlBar_errorDisplay", { primary: { label: "Alerts", icon: "ui-icon-alert" }, click: function() { that._errorDisplayButtonClick(); } } );
		this.errorDisplayMessage = new Gui.ControlBarMessage( "controlBar_alertMessage", this.errorDisplayButton );

		// debug buttons
		this.addButton( "debugControlBar_playOneFrameButton", { primary: { label: "Play one frame", icon: "ui-icon-seek-next" }, click: function() { that._onPlayOneFrameButtonClick(); } } );
		this.gameSpeedButton = this.addButton( "debugControlBar_gameSpeedButton", { primary: { label: "Game Speed", icon: "ui-icon-transferthick-e-w" }, click: function() { that._onGameSpeedClick(); return false; } } );
		this.addButton( "debugControlBar_getFrameHashButton", { primary: { label: "Display frame information", icon: "ui-icon-locked" }, click: function() { that._getFrameHashButtonClick(); } } );
		this.traceButton = this.addButton( "debugControlBar_traceButton", { primary: { label: "Start Trace", icon: "ui-icon-arrowthickstop-1-s" }, toggle: { label: "Stop Trace", icon: "ui-icon-stop" }, click: function() { that._startTrace(); } } );

		// NTSC / PAL encoding selection
		this.encodingSelection = $( "#debugControlBar_encoding" ).buttonset();
		this.encodingNTSC = $( "#debugControlBar_encodingNTSC" ).click( function() { return that._encodingClick( "NTSC" ); } );
		this.encodingPAL = $( "#debugControlBar_encodingPAL" ).click( function() { return that._encodingClick( "PAL" ); } );

		// trace menu
		this.selectTraceButton = this.addButton( "debugControlBar_selectTraceButton", { primary: { label: "Trace Options..", icon: "ui-icon-triangle-1-n" }, click: function() { that._traceMenu.toggleShow(); return false; } } );
		this.traceMenu = new Gui.ControlBarMenu( "debugControlBar_traceMenu", this.selectTraceButton,
				{ checkBoxes: [
					{ parentId: 'controlBar_cpuTraceParent', 				checkBoxSelector: $( "#controlBar_cpuTraceButton" ), 				change: function( event ) { that._onTraceOption( Nes.traceCpu, event ); } },
					{ parentId: 'controlBar_cpuInstructionsTraceParent', 	checkBoxSelector: $( "#controlBar_cpuInstructionsTraceButton" ), 	change: function( event ) { that._onTraceOption( Nes.traceCpuInstructions, event ); } },
					{ parentId: 'controlBar_ppuTraceParent', 				checkBoxSelector: $( "#controlBar_ppuTraceButton" ), 				change: function( event ) { that._onTraceOption( Nes.tracePpu, event ); } },
					{ parentId: 'controlBar_mapperTraceParent', 			checkBoxSelector: $( "#controlBar_mapperTraceButton" ), 			change: function( event ) { that._onTraceOption( Nes.traceMapper, event ); } },
					{ parentId: 'controlBar_allTraceParent', 				checkBoxSelector: $( "#controlBar_allTraceButton" ), 				change: function( event ) { that._onTraceOption( Nes.traceAll, event ); } }
				] }
			);

		// game speed slider
		this.gameSpeedSlider = new Gui.ControlBarSlider( "debugControlBar_gameSpeedSlider", this.gameSpeedButton, {
				values: [
					{ text: '25% Speed', value: 25 },
					{ text: '50% Speed', value: 50 },
					{ text: '75% Speed', value: 75 },
					{ text: '100% Speed', value: 100 },
					{ text: '125% Speed', value: 125 },
					{ text: '150% Speed', value: 150 },
					{ text: '175% Speed', value: 175 },
					{ text: '200% Speed', value: 200 },
					{ text: 'Unlimited', value: -1 }
				],
				defaultValueIndex: 3,
				change: function( speedVal ) {
					that._onGameSpeedSliderChange( speedVal );
				}
			} );

		this.element.css( 'visibility', 'visible' );
		$(window).resize(function(){
			that._setPosition();
		});
		this.setPosition();
	};


	ControlBar.prototype._onKeyboardRemapButtonClick = function() {

		this.app._keyboardRemapDialog.show();
	};


	ControlBar.prototype._errorDisplayButtonClick = function() {
		this.errorDisplayButton.alert( false );
	};


	ControlBar.prototype._onRomLoadFailure = function( reason ) {

		this.errorDisplayMessage.setText( reason );
		this.errorDisplayMessage.show();
	};


	ControlBar.prototype._onTraceOption = function( traceType, event ) {

		this.app.setTraceOption( traceType, event.currentTarget.checked );
	};


	ControlBar.prototype._onGameSpeedSliderChange = function( speedVal ) {

		this.app.setGameSpeed( speedVal );
	};


	ControlBar.prototype._onVolumeSliderChange = function( val ) {

		var muted = val === 0;
		if ( this.app.soundSupported() ) {
			this.soundButton.toggleIcon( muted );
			this.app.enableSound( !muted );
			this.app.setVolume( val );
		}
	};


	ControlBar.prototype._addButton = function( jqId, options ) {

		var but = new Gui.ControlBarButton( this.app._mainboard, jqId, options );
		this.buttons.push( but );
		return but;
	};


	ControlBar.prototype.connect = function( name, cb ) {

		this.eventBus.connect( name, cb );
	};


	ControlBar.prototype._encodingClick = function( encodingType ) {
		if ( this.encodingIgnoreNextClick ) {
			this.encodingIgnoreNextClick = false;
			return true;
		}
		this.app.setColourEncodingType( encodingType );
	//	this.onEncodingChanged( encodingType );
		return true;
	};


	ControlBar.prototype._onEncodingChanged = function( encodingType ) {

		this.encodingIgnoreNextClick = true;
		if ( encodingType === "PAL" ) {
			this.encodingPAL.click();
		} else {
			this.encodingNTSC.click();
		}
	};


	ControlBar.prototype._onPauseChange = function( isPaused ) {

		this.playButton.toggleIcon( isPaused );
	};


	ControlBar.prototype._onTraceRunning = function( on ) {
		this.traceRunning = on;
		this.traceButton.highlight( this.traceRunning );
		this.traceButton.toggleIcon( this.traceRunning );
	};


	ControlBar.prototype._startTrace = function() {

		if ( !this.traceRunning ) {
			this.app.startTrace();
		} else {
			this.app.stopTrace();
		}
	};


	ControlBar.prototype._onScreenshotButtonClick = function() {

		this.app.screenshot();
	};


	ControlBar.prototype._onCartLoaded = function( cart ) {

		this.gameGenieButton.highlight( cart.areGameGenieCodesAvailable() );
		this.onEncodingChanged( cart._colourEncodingType );
		// if ( !this.element.is(":visible") ) {
			// this.element.show( "slide", { direction: "down" }, 1000 );
		// }
	};


	ControlBar.prototype._onSoundEnabled = function( enabled, supported ) {

		if ( supported ) {
			this.soundButton.enable( true );
			this.soundButton.toggleIcon( !enabled );
		} else {
			this.soundButton.enable( false );
			this.soundButton.toggleIcon( true );
		}
	};


	ControlBar.prototype._onSaveButtonClick = function() {
		this.app._saveStateManager.quickSaveState();
	};


	ControlBar.prototype._onLoadButtonClick = function() {
		this.app._saveStateManager.quickLoadState();
		// this.app._saveStateManager.showLoadStateDialog();
	};


	ControlBar.prototype._getFrameHashButtonClick = function() {

		console.log( "{ frame: " + this.app._mainboard.ppu.frameCounter + ', expectedHash: "' + this.app._renderSurface.getRenderBufferHash() + '" }' );
	};


	ControlBar.prototype._onDebugButtonClick = function() {

		this.debugEnabled = !this.debugEnabled;
		this.debugButton.highlight( this.debugEnabled );
		if ( this.debugEnabled ) {
			this.debugBar.show();
			this.app.showFpsMeter( true );
		} else {
			this.debugBar.hide();
			this.app.showFpsMeter( false );
		}
	};


	ControlBar.prototype._onPlayOneFrameButtonClick = function() {

		this.app.playOneFrame();
	};


	ControlBar.prototype._onResetButtonClick = function() {

		this.app.reset();
	};


	ControlBar.prototype._loadRomButtonClick = function() {

		var that = this;

		var handleFileSelect = function( evt ) {

			var file = evt.target.files[0];
			var reader = new FileReader();

			// If we use onloadend, we need to check the readyState.
			reader.onloadend = function( loadEvent ) {
				if ( loadEvent.target.readyState === FileReader.DONE ) {
					that._eventBus.invoke( 'romLoaded', file.name, loadEvent.target.result );
				}
			};

			reader.readAsArrayBuffer( file );
		};

		var input = $( document.createElement( 'input' ) );
		input.attr( "type", "file" );
		input.on( 'change', handleFileSelect );
		input.trigger( 'click' ); // open dialog
	};


	ControlBar.prototype._onGameSpeedClick = function() {

		if ( this.gameSpeedSlider.isVisible() ) {
			this.gameSpeedSlider.hide();
		} else {
			this.gameSpeedSlider.show();
		}
	};


	ControlBar.prototype._onFrameLimitSet = function( limitOn ) {

		this.isLimitOn = limitOn;
	//	this.frameLimitButton.toggleIcon( !this.isLimitOn );
	};


	ControlBar.prototype._onPlayButtonClick = function() {

		this.isPaused = !this.isPaused;
		this.app.pause( this.isPaused );
	};


	ControlBar.prototype._onSoundButtonClick = function() {

		if ( this.soundSlider.isVisible() ) {
			this.soundSlider.hide();
		} else {
			this.soundSlider.show();
		}
	};


	ControlBar.prototype._onGameGenieButtonClick = function() {

		if ( this.app._mainboard.cart ) {
			this.app._ggDialog.show();
		}
	};


	ControlBar.prototype._setPosition = function() {
		this.element.position( { 'of': $( window ), 'my': "bottom", 'at': "bottom" } );
	};


	Gui.ControlBar = ControlBar;

}());
