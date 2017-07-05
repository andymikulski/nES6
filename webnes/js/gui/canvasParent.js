

this.Gui = this.Gui || {};

(function(){
	"use strict";


	var CanvasParent = function( renderSurface ) {

		var that = this;

		this.eventBus = new Nes.EventBus();
		this.parent = $( "#content" );
		this.element = $( "#canvasWrapper" );

		this.canvasElement = document.createElement('canvas');
		this.element[0].appendChild( this.canvasElement );

		this.setSize();

		$(window).resize(function(){
			that._setSize();
			that._setPosition();
		});
		this.setPosition();
	};


	CanvasParent.prototype.connect = function( name, cb ) {

		this.eventBus.connect( name, cb );
	};


	CanvasParent.prototype.getCanvasElement = function() {
		return this.canvasElement;
	};


	CanvasParent.prototype._setSize = function() {

		var parentWidth = this.parent.width();
		var parentHeight = this.parent.height();

		var resizeType = 'keepAspectRatio';

		if ( resizeType === 'keepAspectRatio' ) {

			var aspectRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
			var newWidth = aspectRatio * parentHeight;

			this.canvasElement.width = Math.floor( newWidth );
			this.canvasElement.height = parentHeight;

			this.eventBus.invoke( 'resize' );
		}
	};


	CanvasParent.prototype._setPosition = function() {
		this.element.position( { 'of': this.parent, 'my': "center center", 'at': "center center" } );
	};


	Gui.CanvasParent = CanvasParent;

}());
