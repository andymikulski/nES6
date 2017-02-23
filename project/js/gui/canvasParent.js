

this.Gui = this.Gui || {};

(function(){
	"use strict";


	var CanvasParent = function( renderSurface ) {

		var that = this;

		this._eventBus = new Nes.EventBus();
		this._parent = $( "#content" );
		this._element = $( "#canvasWrapper" );

		this._canvasElement = document.createElement('canvas');
		this._element[0].appendChild( this._canvasElement );

		this._setSize();

		$(window).resize(function(){
			that._setSize();
			that._setPosition();
		});
		this._setPosition();
	};


	CanvasParent.prototype.connect = function( name, cb ) {

		this._eventBus.connect( name, cb );
	};


	CanvasParent.prototype.getCanvasElement = function() {
		return this._canvasElement;
	};


	CanvasParent.prototype._setSize = function() {

		var parentWidth = this._parent.width();
		var parentHeight = this._parent.height();

		var resizeType = 'keepAspectRatio';

		if ( resizeType === 'keepAspectRatio' ) {

			var aspectRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
			var newWidth = aspectRatio * parentHeight;

			this._canvasElement.width = Math.floor( newWidth );
			this._canvasElement.height = parentHeight;

			this._eventBus.invoke( 'resize' );
		}
	};


	CanvasParent.prototype._setPosition = function() {
		this._element.position( { 'of': this._parent, 'my': "center center", 'at': "center center" } );
	};


	Gui.CanvasParent = CanvasParent;

}());
