


this.Gui = this.Gui || {};


(function(){
	"use strict";


	var SaveStateManager = function( app, createGuiComponents ) {

		this._app = app;
		this._mainboard = this._app._mainboard;
		this._renderSurface = this._app._renderSurface;

		this._loadPending = '';
		this._loadStatePending = false;
		this._saveStatePending = false;
		if ( createGuiComponents ) {
			this._lsDialog = new Gui.LoadStateDialog( app );
		}
	};


	SaveStateManager.prototype.quickSaveState = function() {
		this._saveStatePending = true;
	};


	SaveStateManager.prototype.quickLoadState = function() {
		this.loadState( 'quicksave' );
	};


	SaveStateManager.prototype.loadState = function( slotName ) {
		this._loadPending = slotName;
		this._loadStatePending = true;
	};


	SaveStateManager.prototype._doQuickSave = function() {
		// push back previous quicksaves by renaming them, pushing them back in the queue
		var hash = this._mainboard.cart.getHash();
		Gui.renameQuickSaveStates( "quicksave", hash, 3 );
		var screen = this._renderSurface.screenshotToString();
		var state = this._mainboard.saveState();
		Gui.saveState( "quicksave", hash, state, screen );
	};


	SaveStateManager.prototype._doQuickLoad = function() {
		var state = Gui.loadState( this._loadPending, this._mainboard.cart.getHash() );
		if ( state ) {
			this._mainboard.loadState( state );
		}
	};

	SaveStateManager.prototype.onFrame = function() {

		var that = this;
		if ( this._mainboard.cart ) {
			if ( this._saveStatePending ) {
				this._saveStatePending = false;
				this._doQuickSave();
			} else if ( this._loadStatePending ) {
				this._loadStatePending = false;
				this._doQuickLoad();
			}
		}
	};


	Gui.SaveStateManager = SaveStateManager;

}());

