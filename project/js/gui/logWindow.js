

this.Gui = this.Gui || {};

(function(){
	"use strict";

	var globalInstance = null;

	var LogWindow = function( mainboard, divElement ) {

		globalInstance = this;
		var that = this;
		this._strArray = [];
		this._dataArray = [];
		this._element = document.createElement('textarea');
		this._element.rows = 15;
		this._element.cols = 80;
		divElement.appendChild( this._element );
		this._mainboard = mainboard;

		setInterval( function() { that._onTextRefresh(); }, 1000 );
	};


	LogWindow.prototype._onLog = function( log ) {
		//console.log( log );
		//this._addData( log );
	};


	LogWindow.prototype._addData = function( obj ) {
		this._dataArray.push( obj );
		if ( this._dataArray.length > 80 ) {
			this._dataArray.shift();
		}
	};


	LogWindow.prototype._onTextRefresh = function( consoleToo ) {

		var tot = '';
		for ( var i=0; i<this._dataArray.length; ++i ) {
			var str = this._dataArray[i];
			tot += str + "\r\n";
		}
		this._element.innerHTML = tot;
		if ( consoleToo ) {
			console.log( tot );
		}
	};


	Gui.LogWindow = LogWindow;


	Gui.log = function( module, str ) {
		if ( globalInstance ) {
			globalInstance._onLog( module + " " + str );
		}
	};

}());
