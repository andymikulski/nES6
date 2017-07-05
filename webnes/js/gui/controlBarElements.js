

this.Gui = this.Gui || {};

(function(){
	"use strict";


	var isClickWithinElementBounds = function( element, clickX, clickY ) {
		// look for a click outside the menu, then close the menu if it's outside of the menu's bounds
		var margin = 40;
		var pos = element.offset();
		var width = element.width();
		var height = element.height();
		var inBounds = ( pos.left - margin <= clickX && pos.left + width + margin >= clickX && pos.top - margin <= clickY && pos.top + height + margin >= clickY );
		return inBounds;
	};


	var ControlBarButton = function( mainboard, jqId, options ) {

		var that = this;
		this.options = options;
		this.toggleState = false;
		this.button = $( "#" + jqId ).button( { 'text': false, 'label': this.options.primary.label, 'icons': { 'primary': this.options.primary.icon } } );

		if ( this.options.toggleIcon || this.options.click ) {
			this.button.click( function() { var ret = that._onClick(); return ret === undefined ? true : ret; } );
		}

		if ( this.options.enabledWhenRomIsLoaded ) {
			this.enable( false );
			mainboard.connect( 'romLoaded', function( cart ) { that._onRomLoaded( cart ); } );
		}
	};


	ControlBarButton.prototype._onClick = function() {

		if ( this.options.click ) {
			return this.options.click();
		}
		return true;
	};


	ControlBarButton.prototype._onRomLoaded = function( cart ) {

		if ( this.options.enabledWhenRomIsLoaded ) {
			this.enable( true );
		}
	};


	ControlBarButton.prototype.toggleIcon = function( forceToggle ) {

		if ( forceToggle === undefined ) {
			this.toggleState = !this.toggleState;
		} else {
			this.toggleState = forceToggle;
		}
		if ( this.options.toggle ) {
			var opts;
			if ( this.toggleState ) {
				opts = { 'label': ( this.options.toggle.label || this.options.primary.label ), 'icons': { 'primary': ( this.options.toggle.icon || this.options.primary.icon ) } };
			} else {
				opts = { 'label': this.options.primary.label, 'icons': { 'primary': this.options.primary.icon } };
			}
			this.button.button( "option", opts );
		}
	};


	ControlBarButton.prototype.highlight = function( hl ) {

		if ( hl === true || hl === undefined ) {
			this.button.addClass( 'ui-state-highlight' );
		} else {
			this.button.removeClass( 'ui-state-highlight' );
		}
	};


	ControlBarButton.prototype.alert = function( hl ) {

		if ( hl === true || hl === undefined ) {
			this.button.addClass( 'ui-state-error' );
		} else {
			this.button.removeClass( 'ui-state-error' );
		}
	};


	ControlBarButton.prototype.enable = function( enable ) {
		var txt = ( enable === undefined || enable ) ? 'enable' : 'disable';
		this.button.button( txt );
	};



	var ControlBarMenu = function( menuJqId, buttonObject, options ) {

		var that = this;

		this.buttonObject = buttonObject;
		this.options = options || {};
		this.menu = $( "#" + menuJqId ).menu();
		this.menu.hide();

		$( document ).on( "click", function( e ) {
			that._onDocClick( e );
		});

		// Connect checkbox change events
		if ( this.options.checkBoxes && Array.isArray( this.options.checkBoxes ) ) {
			for ( var i=0; i<this.options.checkBoxes.length; ++i ) {
				var obj = this.options.checkBoxes[i];
				if ( obj.change ) {
					obj.checkBoxSelector.change( obj.change );
				}
			}
		}
	};


	ControlBarMenu.prototype._onDocClick = function( e ) {
		// hide menu when clicked somewhere else
		// HACK: cx and cy will be zero on a forced (manual) click event invoked by .click(). So we ignore these
		if ( e.clientX === 0 && e.clientY === 0 ) {
			return;
		}
		if ( this.isVisible() ) {
			if ( !isClickWithinElementBounds( this.menu, e.clientX, e.clientY ) ) {
				this.hide();
			} else {
				// click was inside the menu. check the options object for specified behaviour
				if ( this.options.checkBoxes && Array.isArray( this.options.checkBoxes ) ) {
					for ( var i=0; i<this.options.checkBoxes.length; ++i ) {
						var obj = this.options.checkBoxes[i];
						// if we clicked on the li element, check the checkbox (this way user doesnt have to click checkbox exactly)
						if ( e.target.id === obj.parentId ) {
							obj.checkBoxSelector.click();
						}
					}
				}
			}
		}
	};


	ControlBarMenu.prototype.toggleShow = function() {

		if ( this.isVisible() ) {
			this.hide();
		} else {
			this.show();
		}
	};


	ControlBarMenu.prototype.show = function() {
		this.menu.show().position( {
				'my': "left bottom",
				'at': "left top",
				'of': this.buttonObject._button
			});
	};


	ControlBarMenu.prototype.hide = function() {
		if ( this.menu.is(':visible') ) {
			this.menu.hide();
		}
	};


	ControlBarMenu.prototype.isVisible = function() {
		return this.menu.is(':visible');
	};




	var ControlBarSlider = function( jqId, buttonObject, options ) {

		var that = this;
		this.buttonObject = buttonObject;
		this.options = options;
		this.options.defaultValueIndex = this.options.defaultValueIndex === undefined ? 0 : this.options.defaultValueIndex;
		this.currentIndex = this.options.defaultValueIndex;
		this.tooltipCreated = false;

		this.dialog = $( "#" + jqId ).dialog({
				'dialogClass': "no-close controlBarSlider",
				'draggable': false,
				'autoOpen': false,
				'height': 130,
				'minHeight': 130,
				'width': 40,
				'minWidth': 40,
				'modal': false,
				'resizable': false,
				'buttons': {
				},
				'close': function() {
				}
			} );

		var sliderElement = document.createElement( 'div' );
		this.dialog[0].appendChild( sliderElement );

		var isRangeSlider = this.options.values === undefined;

		if ( isRangeSlider ) {
			this.slider = $( sliderElement ).slider( {
				'value': this.options.defaultValueIndex,
				'min': this.options.minValue,
				'max': this.options.maxValue,
				'orientation': "vertical",
				'change': function( event, ui ) {
					that._updateTooltip( ui.handle, ui.value );
				}
			} );
		} else {
			this.slider = $( sliderElement ).slider( {
				'value': this.options.defaultValueIndex,
				'min': 0,
				'max': this.options.values.length-1,
				'step': 1,
				'orientation': "vertical",
				'slide': function( event, ui ) {
					that._updateTooltip( ui.handle, ui.value );
				},
				'change': function( event, ui ) {
					that._updateTooltip( ui.handle, ui.value );
				}
			} );
		}
		this.slider.addClass( 'controlBarSliderContents' );
		this.createTooltip();

		$( document ).on( "click", function( e ) {
			that._onDocClick( e );
		});
	};


	ControlBarSlider.prototype._getTooltipText = function( val ) {
		if ( this.options.values && val >= 0 && val < this.options.values.length ) {
			return this.options.values[ val ].text;
		} else {
			return val.toString();
		}
	};


	ControlBarSlider.prototype._createTooltip = function() {
		var handleElement = $('.ui-slider-handle', this.slider);
		handleElement.qtip( {
			'content': this.getTooltipText( this.options.defaultValueIndex ),
			'position': {
				'corner':{'target':'leftMiddle','tooltip':'rightMiddle'}, //instead of corner:{target:'rightMiddle',tooltip:'leftMiddle'},
				'adjust':{'screen':true, 'resize':true}
			},
			'hide': {
				'delay': 100
			}
		} );
	};


	ControlBarSlider.prototype._updateTooltip = function( handle, val ) {
		if ( this.currentIndex !== val ) {
			this.currentIndex = val;
			$(handle).qtip( "option", 'content.text', this.getTooltipText( val ) );
			if ( this.options.change ) {
				this.options.change( this.options.values ? this.options.values[ this.currentIndex ].value : val );
			}
		}
	};


	ControlBarSlider.prototype._onDocClick = function( e ) {
		// HACK: cx and cy will be zero on a forced (manual) click event invoked by .click(). So we ignore these
		if ( e.clientX === 0 && e.clientY === 0 ) {
			return;
		}
		// hide menu when clicked somewhere else
		if ( this.isVisible() ) {
			if ( !isClickWithinElementBounds( this.dialog, e.clientX, e.clientY ) ) {
				this.hide();
			}
		}
	};


	ControlBarSlider.prototype.show = function() {
		this.dialog.dialog( "option", "position", {
				'my': "left bottom",
				'at': "left top",
				'of': this.buttonObject._button
			} );
		this.dialog.dialog( "open" );
	};


	ControlBarSlider.prototype.hide = function() {
		if ( this.dialog.is(':visible') ) {
			this.dialog.dialog( "close" );
		}
	};


	ControlBarSlider.prototype.isVisible = function() {
		return this.dialog.is(':visible');
	};





	var ControlBarMessage = function( jqId, buttonObject, options ) {

		var that = this;
		this.buttonObject = buttonObject;
		this.options = options;
		this.allowAutoHide = false;

		this.dialog = $( "#" + jqId ).dialog({
				'dialogClass': "no-close controlBarSlider",
				'draggable': false,
				'autoOpen': false,
				'height': 'auto',
				'minHeight': 50,
				'width': 'auto',
				'minWidth': 100,
				'modal': false,
				'resizable': false,
				'buttons': {
				},
				'close': function() {
				}
			} );

		this.textElement = document.createElement( 'div' );
		this.dialog[0].appendChild( this.textElement );

		$( document ).on( "click", function( e ) {
			that._onDocClick( e );
		});
	};


	ControlBarMessage.prototype.setText = function( text ) {

		this.textElement.innerHTML = '<p>' + text + '</p>';
	};


	ControlBarMessage.prototype._onDocClick = function( e ) {
		// HACK: cx and cy will be zero on a forced (manual) click event invoked by .click(). So we ignore these
		if ( e.clientX === 0 && e.clientY === 0 ) {
			return;
		}
		// hide menu when clicked somewhere else
		if ( this.isVisible() ) {
			if ( !isClickWithinElementBounds( this.dialog, e.clientX, e.clientY ) ) {
				if ( this.allowAutoHide ) {
					this.hide();
				}
			}
		}
	};


	ControlBarMessage.prototype.show = function() {
		var that = this;
		this.dialog.dialog( "option", "position", {
				'my': "right top",
				'at': "right bottom",
				'of': this.buttonObject._button
			} );
		this.dialog.dialog( "open" );
		this.buttonObject.alert( true );
		this.allowAutoHide = false;
		setTimeout( function() {
			that._allowAutoHide = true;
		}, 300 );
	};


	ControlBarMessage.prototype.hide = function() {
		if ( this.dialog.is(':visible') ) {
			this.dialog.dialog( "close" );
		}
		this.buttonObject.alert( false );
	};


	ControlBarMessage.prototype.isVisible = function() {
		return this.dialog.is(':visible');
	};





	Gui.ControlBarButton = ControlBarButton;
	Gui.ControlBarMenu = ControlBarMenu;
	Gui.ControlBarSlider = ControlBarSlider;
	Gui.ControlBarMessage = ControlBarMessage;
}());



