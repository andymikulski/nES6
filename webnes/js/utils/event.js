

this.Nes = this.Nes || {};

var Test = {};


(function(){
	"use strict";

	var eventArgs = []; // global to prevent memory reallocation


	var Event = function() {

		this.callbacks = [];
	};


	Event.prototype.connect = function( cb ) {

		this.callbacks.push( cb );
	};


	Event.prototype.invoke = function() {
		eventArgs = Array.prototype.slice.call(arguments, 0);
		for ( var i=0; i<this.callbacks.length; ++i ) {
			this.callbacks[i].apply( this, eventArgs );
		}
	};


	var EventBus = function() {

		this.map = {};
	};


	EventBus.prototype._get = function( name ) {
		if ( !this.map[ name ] ) {
			this.map[ name ] = new Event();
		}
		return this.map[ name ];
	};


	EventBus.prototype.connect = function( name, cb ) {
		this.get( name ).connect( cb );
	};


	EventBus.prototype.invoke = function( name ) {

		var event = this.map[ name ];
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
