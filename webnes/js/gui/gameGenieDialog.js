

this.Gui = this.Gui || {};

(function(){
	"use strict";

	var _open = null;


	var GameGenieDialog = function( app ) {

		var that = this;
		this.app = app;
		this.contentsDiv = $( "#gameGenieDialog_contents" );

		this.app.connect( 'cartLoaded', function( cart ) { that._onCartLoaded( cart ); } );

		this.dialog = $( "#gameGenieDialog" ).dialog({
			'autoOpen': false,
			'title': 'Game Genie Codes',
			'height': 400,
			'width': 900,
			'modal': true,
			'buttons': {
				'Close': function() {
					that._dialog.dialog( "close" );
				}
			},
			'close': function() {
				that._onClose();
			}
		});
	};


	GameGenieDialog.prototype.show = function() {

		_open = this;
		this.app.pause( true );
		this.dialog.dialog( "open" );
	};


	GameGenieDialog.prototype._onClose = function() {

		this.app.pause( false );
	};


	GameGenieDialog.prototype._onCartLoaded = function( cart ) {

		var html = '';
		var that = this;
		if ( cart && cart._dbData && cart._dbData['gameGenieCodes'] ) {
			var codesArray = cart._dbData['gameGenieCodes'];

			for ( var i=0; i<codesArray.length; ++i ) {

				var gg = codesArray[i];
				var checkboxId = "gg_cb_" + i;

				html += '<div id="gg_' + i + '">';
				html += "<input type='checkbox' id='" + checkboxId + "' value='" + i + "' onclick='Gui.gameGenieDialog_onclick( " + i + " );'><span>" + gg.name + "</span>";
				html += '</div>';
			}
		}

		this.contentsDiv[0].innerHTML = html;
	};



	var gameGenieDialog_onclick = function( gameCodeId ) {

		if ( _open ) {
			var cart = _open._app._mainboard.cart;
			var codesArray = cart._dbData['gameGenieCodes'];

			var jqElement = $( "#gg_cb_" + gameCodeId );
			var isChecked = jqElement[0].checked;
			var code = codesArray[ gameCodeId ];
			//console.log( "Checked " + jqElement.id + " = " + isChecked );
			var selectedSubCodeIndex = 0;
			for ( var j=0; j<code['codes'][ selectedSubCodeIndex ].length; ++j ) {
				Nes.processGameGenieCode( _open._app._mainboard, code['codes'][ selectedSubCodeIndex ][j], isChecked );
			}
		}
	};


	Gui.GameGenieDialog = GameGenieDialog;
	Gui['gameGenieDialog_onclick'] = gameGenieDialog_onclick;

}());
