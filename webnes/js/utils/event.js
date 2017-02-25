

this.Nes = this.Nes || {};

var Test = {};


(function(){
	"use strict";

	var eventArgs = []; // global to prevent memory reallocation


	var Event = function() {

		this._callbacks = [];
	};


	Event.prototype.connect = function( cb ) {

		this._callbacks.push( cb );
	};


	Event.prototype.invoke = function() {
		eventArgs = Array.prototype.slice.call(arguments, 0);
		for ( var i=0; i<this._callbacks.length; ++i ) {
			this._callbacks[i].apply( this, eventArgs );
		}
	};


	var EventBus = function() {

		this._map = {};
	};


	EventBus.prototype._get = function( name ) {
		if ( !this._map[ name ] ) {
			this._map[ name ] = new Event();
		}
		return this._map[ name ];
	};


	EventBus.prototype.connect = function( name, cb ) {
		this._get( name ).connect( cb );
	};


	EventBus.prototype.invoke = function( name ) {

		var event = this._map[ name ];
		if ( event ) {
			if ( arguments.length > 1 ) {
				eventArgs = Array.prototype.slice.call(arguments, 1);
			} else {
				eventArgs.length = 0;
			}
			event.invoke.apply( event, eventArgs );
		}
	};


	Nes.Event = Event;
	Nes.EventBus = EventBus;

}());
