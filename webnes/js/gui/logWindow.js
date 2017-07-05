

this.Gui = this.Gui || {};

(function(){
	"use strict";

	var globalInstance = null;

	var LogWindow = function( mainboard, divElement ) {

		globalInstance = this;
		var that = this;
		this.strArray = [];
		this.dataArray = [];
		this.element = document.createElement('textarea');
		this.element.rows = 15;
		this.element.cols = 80;
		divElement.appendChild( this.element );
		this.mainboard = mainboard;

		setInterval( function() { that._onTextRefresh(); }, 1000 );
	};


	LogWindow.prototype._onLog = function( log ) {
		//console.log( log );
		//this.addData( log );
	};


	LogWindow.prototype._addData = function( obj ) {
		this.dataArray.push( obj );
		if ( this.dataArray.length > 80 ) {
			this.dataArray.shift();
		}
	};


	LogWindow.prototype._onTextRefresh = function( consoleToo ) {

		var tot = '';
		for ( var i=0; i<this.dataArray.length; ++i ) {
			var str = this.dataArray[i];
			tot += str + "\r\n";
		}
		this.element.innerHTML = tot;
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
