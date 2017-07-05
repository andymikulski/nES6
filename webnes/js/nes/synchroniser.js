

this.Nes = this.Nes || {};

"use strict";

var syncEvent = function( name, tickCount, callback ) {
	this.name = name;
	this.tickCount = tickCount;
	this.callback = callback;
};


var synchroniser = function( mainboard ) {
	var that = this;
	this.mainboard = mainboard;
	this.mainboard.connect( 'reset', function( cold ) { that.reset( cold ); } );
	this.cpu = mainboard.cpu;
	this.cpuMtc = 0;
	this.lastSynchronisedMtc = 0;
	this.isSynchronising = false;
	this.newEventInserted = false;
	this.eventBus = new Nes.EventBus();
	this.cpuMTCatEndOfInstruction = new Int32Array( 8 ); // Array of ppu MTC counts which the last X instructions have ended on.
	this.cpuMTCatEndOfInstructionIndex = 0; // This is for determining if an NMI trigger should delay by an instruction or not.

	this.events = [];
	this.objects = [];
};


synchroniser.prototype.reset = function( cold ) {
	this.cpuMtc = 0;
	this.lastSynchronisedMtc = 0;
	this.cpuMTCatEndOfInstructionIndex = 0;
	this.isSynchronising = false;
	this.newEventInserted = false;
};


synchroniser.prototype.connect = function( name, callback ) {
	this.eventBus.connect( name, callback );
};


synchroniser.prototype.changeEventTime = function( eventId, tickCount ) {

	var obj = this.getEvent( eventId );
	obj.tickCount = tickCount;
	this.executeCallbackIfSynchronising( obj );
	this.newEventInserted = true;
};


synchroniser.prototype._removeEvent = function( name ) {

	for ( var i=0; i<this.events.length; ++i ) {
		var ev = this.events[i];
		if ( ev.name === name ) {
			return this.events.splice( i, 1 )[0];
		}
	}
	return null;
};


synchroniser.prototype._getEvent = function( eventId ) {

	return this.events[ eventId ];
};


synchroniser.prototype.addEvent = function( name, tickCount, callback ) {

	this.removeEvent( name );
	var obj = new syncEvent( name, tickCount, callback );
	this.executeCallbackIfSynchronising( obj );
	this.events.push( obj );
	this.newEventInserted = true;
	return this.events.length - 1;
};


synchroniser.prototype._executeCallbackIfSynchronising = function( event ) {
	if ( this.isSynchronising && event.tickCount >= 0 ) {
		// if a new event has been added during synchronisation, execute it immediately if it is due
		if ( this.lastSynchronisedMtc < event.tickCount && this.currentSyncValue >= event.tickCount ) {
			event.callback( event.tickCount );
		}
	}
};


synchroniser.prototype.addObject = function( name, obj ) {

	this.objects.push( { name: name, object: obj, lastSynchronisedTickCount: 0 } );
};


synchroniser.prototype.synchronise = function() {

	var frameEnd = COLOUR_ENCODING_FRAME_MTC;

	if ( this.isSynchronising ) {
		//debugger;
		throw new Error( "Cannot call synchroniser.prototype.synchronise when in synchronisation phase" );
	}

	var syncTo = this.getCpuMTC();

	// work out when the next scheduled event is to occur. Then synchronise all objects to that event, then execute the event.
	// Then move onto the next one.
	var objIndex = 0;
	var keepRunning = true;
	while ( keepRunning ) {
		var nextEventTime = this.getNextEventTime();
		if ( nextEventTime <= syncTo && nextEventTime < frameEnd ) {
			syncTo = nextEventTime;
		} else {
			keepRunning = false; // no more events until requested syncTo value: we can finish the sync loop
			syncTo = Math.min( syncTo, frameEnd );
		}

		if ( this.lastSynchronisedMtc >= syncTo ) {
			return;
		}

		this.isSynchronising = true;
		this.currentSyncValue = syncTo;

		for ( objIndex=0; objIndex<this.objects.length; ++objIndex ) {
			// TODO: Objects should be forbidden from calling synchroniser.synchronise() whilst in the synchronise phase - if they
			// want to force a synchronise they should do so using an event
			var obj = this.objects[ objIndex ];
			if ( obj.lastSynchronisedTickCount < syncTo ) {
				obj.object.synchronise( obj.lastSynchronisedTickCount, syncTo );
				obj.lastSynchronisedTickCount = syncTo;
			}
		}
		this.isSynchronising = false;

		this.executeEvents( this.lastSynchronisedMtc, syncTo );
		this.lastSynchronisedMtc = syncTo;

		// TODO: this should be an event: do end frame stuff if that time has come
		if ( syncTo >= frameEnd ) {
			for ( objIndex=0; objIndex<this.objects.length; ++objIndex ) {
				this.objects[ objIndex ].object.onEndFrame( syncTo );
				this.objects[ objIndex ].lastSynchronisedTickCount = 0;
			}

			this.cpuMtc -= frameEnd;
			this.lastSynchronisedMtc = 0;
			this.eventBus.invoke( 'frameEnd' );
		}
	}
};


synchroniser.prototype.getNextEventTime = function( currentTime ) {

	var frameEnd = COLOUR_ENCODING_FRAME_MTC;
	currentTime = currentTime || this.lastSynchronisedMtc;
	var closestObj = null;
	for ( var eventIndex=0; eventIndex<this.events.length; ++eventIndex ) {
		var ev = this.events[ eventIndex ];
		if ( ev.tickCount >= 0 && ev.tickCount > currentTime ) {
			if ( closestObj === null || ev.tickCount < closestObj.tickCount ) {
				closestObj = ev;
			}
		}
	}
	return closestObj !== null ? closestObj.tickCount : frameEnd;
};


synchroniser.prototype._executeEvents = function( startTime, endTime ) {

	for ( var eventIndex=0; eventIndex<this.events.length; ++eventIndex ) {
		var ev = this.events[ eventIndex ];
		if ( ev.tickCount >= 0 && ev.tickCount > startTime && ev.tickCount <= endTime ) {
			ev.callback( ev.tickCount );
		}
	}
};


synchroniser.prototype.runCycle = function() {

	var nextEventTime = this.getNextEventTime();

	// run cpu
	while ( this.cpuMtc < nextEventTime ) {
		var cpuTicks = this.cpu.handlePendingInterrupts();
		if ( cpuTicks === 0 ) {
			cpuTicks = this.cpu.execute();
		}
		this.mainboard.ppu.handleSpriteTransfer();
		this.cpuMtc += cpuTicks * COLOUR_ENCODING_MTC_PER_CPU;
		TYPED_ARRAY_SET_INT32( this.cpuMTCatEndOfInstruction, this.cpuMTCatEndOfInstructionIndex, this.cpuMtc );
		this.cpuMTCatEndOfInstructionIndex = ( this.cpuMTCatEndOfInstructionIndex + 1 ) & 0x7;

		if ( this.newEventInserted ) {
			this.newEventInserted = false;
			nextEventTime = this.getNextEventTime();
		}
	}

	// run all other components to the cpu mtc
	this.synchronise( this.cpuMtc );
};


synchroniser.prototype.isPpuTickOnLastCycleOfCpuInstruction = function( ppuCount ) {

	for ( var i=0; i<this.cpuMTCatEndOfInstruction.length; ++i ) {
		var cpuCount = this.cpuMTCatEndOfInstruction[ i ];
		if ( cpuCount - COLOUR_ENCODING_MTC_PER_CPU <= ppuCount && cpuCount + MASTER_CYCLES_PER_PPU >= ppuCount ) {
			return true;
		}
	}
	return false;
};


synchroniser.prototype.advanceCpuMTC = function( advance ) {
	this.cpuMtc += advance;
};


synchroniser.prototype.getCpuMTC = function() {
	return ( this.cpuMtc + this.cpu.getSubCycle() * COLOUR_ENCODING_MTC_PER_CPU ) | 0;
};


synchroniser.prototype.saveState = function() {
	// TODO: save event data in state, maybe not necessary as save state is done on the end of a frame?
	var data = {};
	data.cpuMtc = this.cpuMtc;
	data._lastSynchronisedMtc = this.lastSynchronisedMtc;
	return data;
};


synchroniser.prototype.loadState = function( state ) {
	this.cpuMtc = state.cpuMtc;
	this.lastSynchronisedMtc = state._lastSynchronisedMtc;
};


Nes.synchroniser = synchroniser;

