

this.Gui = this.Gui || {};

(function(){
	"use strict";

	// Keyboard key map taken from http://stackoverflow.com/questions/1772179/get-character-value-from-keycode-in-javascript-then-trim
	var keyboardMap = ["","","","CANCEL","","","HELP","","BACK_SPACE","TAB","","","CLEAR","ENTER","RETURN","","SHIFT","CONTROL","ALT","PAUSE","CAPS_LOCK","KANA","EISU","JUNJA","FINAL","HANJA","","ESCAPE","CONVERT","NONCONVERT","ACCEPT","MODECHANGE","SPACE","PAGE_UP","PAGE_DOWN","END","HOME","LEFT","UP","RIGHT","DOWN","SELECT","PRINT","EXECUTE","PRINTSCREEN","INSERT","DELETE","","0","1","2","3","4","5","6","7","8","9","COLON","SEMICOLON","LESS_THAN","EQUALS","GREATER_THAN","QUESTION_MARK","AT","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","WIN","","CONTEXT_MENU","","SLEEP","NUMPAD0","NUMPAD1","NUMPAD2","NUMPAD3","NUMPAD4","NUMPAD5","NUMPAD6","NUMPAD7","NUMPAD8","NUMPAD9","MULTIPLY","ADD","SEPARATOR","SUBTRACT","DECIMAL","DIVIDE","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","","","","","","","","","NUM_LOCK","SCROLL_LOCK","WIN_OEM_FJ_JISHO","WIN_OEM_FJ_MASSHOU","WIN_OEM_FJ_TOUROKU","WIN_OEM_FJ_LOYA","WIN_OEM_FJ_ROYA","","","","","","","","","","CIRCUMFLEX","EXCLAMATION","DOUBLE_QUOTE","HASH","DOLLAR","PERCENT","AMPERSAND","UNDERSCORE","OPEN_PAREN","CLOSE_PAREN","ASTERISK","PLUS","PIPE","HYPHEN_MINUS","OPEN_CURLY_BRACKET","CLOSE_CURLY_BRACKET","TILDE","","","","","VOLUME_MUTE","VOLUME_DOWN","VOLUME_UP","","","SEMICOLON","EQUALS","COMMA","MINUS","PERIOD","SLASH","BACK_QUOTE","","","","","","","","","","","","","","","","","","","","","","","","","","","OPEN_BRACKET","BACK_SLASH","CLOSE_BRACKET","QUOTE","","META","ALTGR","","WIN_ICO_HELP","WIN_ICO_00","","WIN_ICO_CLEAR","","","WIN_OEM_RESET","WIN_OEM_JUMP","WIN_OEM_PA1","WIN_OEM_PA2","WIN_OEM_PA3","WIN_OEM_WSCTRL","WIN_OEM_CUSEL","WIN_OEM_ATTN","WIN_OEM_FINISH","WIN_OEM_COPY","WIN_OEM_AUTO","WIN_OEM_ENLW","WIN_OEM_BACKTAB","ATTN","CRSEL","EXSEL","EREOF","PLAY","ZOOM","","PA1","WIN_OEM_CLEAR",""];
	var _open = null;


	var keyCodeToName = function( kc ) {
		if ( kc < keyboardMap.length ) {
			return keyboardMap[ kc ];
		}
		return '';
	};


	var KeyboardRemapper = function( app ) {

		var that = this;
		this.app = app;
		this.keysAssigned = [];
		this.waitingPress = false;
		this.waitingPlayerId = 0;
		this.waitingPressKey = '';
		this.contentsDiv = $( "#keyboardRemapperDialog_contents" );
		this.existingKeysContents = $( "#keyboardRemapperSetKeyDialog_existingKeysContents" );

		this.dialog = $( "#keyboardRemapperDialog" ).dialog({
			'autoOpen': false,
			'title': 'Control mapping',
			'height': 450,
			'width': 325,
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

		this.setKeyDialog = $( "#keyboardRemapperSetKeyDialog" ).dialog({
			'dialogClass': "no-close",
			'draggable': false,
			'autoOpen': false,
			'height': 200,
			'minHeight': 200,
			'width': 400,
			'minWidth': 400,
			'modal': true,
			'resizable': false,
			'buttons': {
				'OK': function() {
					that._onKeySetApplyClick();
				},
				'Close': function() {
					that._setKeyDialog.dialog( "close" );
				}
			},
			'close': function() {
				that._waitingPress = false;
			}
		});

		this.setKeyDialogContents = $( "#keyboardRemapperSetKeyDialog_contents" );

		$('.keyboardMap')['maphilight']();

		window.addEventListener( 'keydown', function( event ) { that._onDocumentKeypress( event, true ); }, false );
		window.addEventListener( 'keyup', function( event ) { that._onDocumentKeypress( event, false ); }, false );
	};

	KeyboardRemapper.prototype._keyArrayToHtml = function( keysArray ) {

		var str = keysArray.map( function( kc ) { return keyCodeToName( kc ); } ).join( ' ' );
		if ( str.length === 0 ) {
			str = '&lt;NONE&gt;';
		}
		return str;
	};


	KeyboardRemapper.prototype._onDocumentKeypress = function( event, pressed ) {

		if ( this.waitingPress ) {
			if ( pressed ) {
				var kc = Number( event.keyCode );
				if ( this.keysAssigned.indexOf( kc ) < 0 ) {
					this.keysAssigned.push( kc );
					this.setKeyDialogContents[0].innerHTML = '<p>New keys: ' + this.keyArrayToHtml( this.keysAssigned ) + '</p>';
				}
			}
		}
	};


	KeyboardRemapper.prototype._keyCodeToString = function( keyCode ) {
		return keyCode.toString();
	};


	KeyboardRemapper.prototype.show = function() {

		_open = this;
		this.app.pause( true );
		this.dialog.dialog( "open" );
	};


	KeyboardRemapper.prototype._onClose = function() {

		this.app.pause( false );
	};


	KeyboardRemapper.prototype._onSetKeyClick = function( playerId, keyName ) {

		var id = JOYPAD_NAME_TO_ID( keyName );
		this.waitingPressKey = id;
		this.waitingPress = true;
		this.waitingPlayerId = playerId;
		this.keysAssigned.length = 0;
		this.setKeyDialogContents[0].innerHTML = '<p>New keys:</p>';
		var existingKeys = this.app._input.getKeyBindings( playerId, id );

		this.existingKeysContents[0].innerHTML = '<p>Current keys: ' + this.keyArrayToHtml( existingKeys ) + '</p>';
		this.setKeyDialog.dialog('option', 'title', 'Player ' + ( playerId + 1 ) + ': Press keys to assign to ' + keyName );
		this.setKeyDialog.dialog( "open" );
	};


	KeyboardRemapper.prototype._onKeySetApplyClick = function() {

		this.app._input.saveKeyBindings( this.waitingPlayerId, this.waitingPressKey, this.keysAssigned );
		this.setKeyDialog.dialog( "close" );
	};


	var keyboardRemapperDialog_onsetkeyclick = function( playerId, keyName ) {

		_open._onSetKeyClick( playerId, keyName );
	};



	Gui.KeyboardRemapper = KeyboardRemapper;
	Gui[ 'keyboardRemapperDialog_onsetkeyclick' ] = keyboardRemapperDialog_onsetkeyclick;

}());
