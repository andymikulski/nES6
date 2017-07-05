


this.Gui = this.Gui || {};


(function(){
	"use strict";


	var SaveStateManager = function( app, createGuiComponents ) {

		this.app = app;
		this.mainboard = this.app._mainboard;
		this.renderSurface = this.app._renderSurface;

		this.loadPending = '';
		this.loadStatePending = false;
		this.saveStatePending = false;
		if ( createGuiComponents ) {
			this.lsDialog = new Gui.LoadStateDialog( app );
		}
	};


	SaveStateManager.prototype.quickSaveState = function() {
		this.saveStatePending = true;
	};


	SaveStateManager.prototype.quickLoadState = function() {
		this.loadState( 'quicksave' );
	};


	SaveStateManager.prototype.loadState = function( slotName ) {
		this.loadPending = slotName;
		this.loadStatePending = true;
	};


	SaveStateManager.prototype._doQuickSave = function() {
		// push back previous quicksaves by renaming them, pushing them back in the queue
		var hash = this.mainboard.cart.getHash();
		Gui.renameQuickSaveStates( "quicksave", hash, 3 );
		var screen = this.renderSurface.screenshotToString();
		var state = this.mainboard.saveState();
		Gui.saveState( "quicksave", hash, state, screen );
	};


	SaveStateManager.prototype._doQuickLoad = function() {
		var state = Gui.loadState( this.loadPending, this.mainboard.cart.getHash() );
		if ( state ) {
			this.mainboard.loadState( state );
		}
	};

	SaveStateManager.prototype.onFrame = function() {

		var that = this;
		if ( this.mainboard.cart ) {
			if ( this.saveStatePending ) {
				this.saveStatePending = false;
				this.doQuickSave();
			} else if ( this.loadStatePending ) {
				this.loadStatePending = false;
				this.doQuickLoad();
			}
		}
	};


	Gui.SaveStateManager = SaveStateManager;

}());

