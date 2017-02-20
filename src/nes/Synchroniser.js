import { EventBus } from './Event';

import {
	MASTER_CYCLES_PER_PPU,
	COLOUR_ENCODING_FRAME_MTC,
	COLOUR_ENCODING_MTC_PER_CPU,
} from '../config/consts';

class SyncEvent {
	constructor( name, tickCount, callback ) {
		this.name = name;
		this.tickCount = tickCount;
		this.callback = callback;

	}
}

export default class Synchroniser {
	constructor( mainboard ) {
		this.mainboard = mainboard;
		this.mainboard.connect( 'reset', ::this.reset);
		this.cpu = mainboard.cpu;
		this.cpuMtc = 0;
		this._lastSynchronisedMtc = 0;
		this._isSynchronising = false;
		this._newEventInserted = false;
		this._eventBus = new EventBus();
		this._cpuMTCatEndOfInstruction = new Int32Array( 8 ); // Array of ppu MTC counts which the last X instructions have ended on.
		this._cpuMTCatEndOfInstructionIndex = 0; // This is for determining if an NMI trigger should delay by an instruction or not.

		this._events = [];
		this._objects = [];
	}


	reset( cold ) {
		this.cpuMtc = 0;
		this._lastSynchronisedMtc = 0;
		this._cpuMTCatEndOfInstructionIndex = 0;
		this._isSynchronising = false;
		this._newEventInserted = false;
	}


	connect( name, callback ) {
		this._eventBus.connect( name, callback );
	}


	changeEventTime( eventId, tickCount ) {

		var obj = this._getEvent( eventId );
		obj.tickCount = tickCount;
		this._executeCallbackIfSynchronising( obj );
		this._newEventInserted = true;
	}


	_removeEvent( name ) {

		for ( var i=0; i<this._events.length; ++i ) {
			var ev = this._events[i];
			if ( ev.name === name ) {
				return this._events.splice( i, 1 )[0];
			}
		}
		return null;
	}


	_getEvent( eventId ) {

		return this._events[ eventId ];
	}


	addEvent( name, tickCount, callback ) {

		this._removeEvent( name );
		var obj = new SyncEvent( name, tickCount, callback );
		this._executeCallbackIfSynchronising( obj );
		this._events.push( obj );
		this._newEventInserted = true;
		return this._events.length - 1;
	}


	_executeCallbackIfSynchronising( event ) {
		if ( this._isSynchronising && event.tickCount >= 0 ) {
			// if a new event has been added during synchronisation, execute it immediately if it is due
			if ( this._lastSynchronisedMtc < event.tickCount && this._currentSyncValue >= event.tickCount ) {
				event.callback( event.tickCount );
			}
		}
	}


	addObject( name, obj ) {

		this._objects.push( { name: name, object: obj, lastSynchronisedTickCount: 0 } );
	}


	synchronise() {

		var frameEnd = COLOUR_ENCODING_FRAME_MTC;

		if ( this._isSynchronising ) {
			//debugger;
			throw new Error( "Cannot call synchronise synchronisation phase" );
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

			if ( this._lastSynchronisedMtc >= syncTo ) {
				return;
			}

			this._isSynchronising = true;
			this._currentSyncValue = syncTo;

			for ( objIndex=0; objIndex<this._objects.length; ++objIndex ) {
				// TODO: Objects should be forbidden from calling synchroniser.synchronise() whilst in the synchronise phase - if they
				// want to force a synchronise they should do so using an event
				var obj = this._objects[ objIndex ];
				if ( obj.lastSynchronisedTickCount < syncTo ) {
					obj.object.synchronise( obj.lastSynchronisedTickCount, syncTo );
					obj.lastSynchronisedTickCount = syncTo;
				}
			}
			this._isSynchronising = false;

			this._executeEvents( this._lastSynchronisedMtc, syncTo );
			this._lastSynchronisedMtc = syncTo;

			// TODO: this should be an event: do end frame stuff if that time has come
			if ( syncTo >= frameEnd ) {
				for ( objIndex=0; objIndex<this._objects.length; ++objIndex ) {
					this._objects[ objIndex ].object.onEndFrame( syncTo );
					this._objects[ objIndex ].lastSynchronisedTickCount = 0;
				}

				this.cpuMtc -= frameEnd;
				this._lastSynchronisedMtc = 0;
				this._eventBus.invoke( 'frameEnd' );
			}
		}
	}


	getNextEventTime( currentTime ) {

		var frameEnd = COLOUR_ENCODING_FRAME_MTC;
		currentTime = currentTime || this._lastSynchronisedMtc;
		var closestObj = null;
		for ( var eventIndex=0; eventIndex<this._events.length; ++eventIndex ) {
			var ev = this._events[ eventIndex ];
			if ( ev.tickCount >= 0 && ev.tickCount > currentTime ) {
				if ( closestObj === null || ev.tickCount < closestObj.tickCount ) {
					closestObj = ev;
				}
			}
		}
		return closestObj !== null ? closestObj.tickCount : frameEnd;
	}


	_executeEvents( startTime, endTime ) {

		for ( var eventIndex=0; eventIndex<this._events.length; ++eventIndex ) {
			var ev = this._events[ eventIndex ];
			if ( ev.tickCount >= 0 && ev.tickCount > startTime && ev.tickCount <= endTime ) {
				ev.callback( ev.tickCount );
			}
		}
	}


	runCycle() {

		var nextEventTime = this.getNextEventTime();

		// run cpu
		while ( this.cpuMtc < nextEventTime ) {
			var cpuTicks = this.cpu.handlePendingInterrupts();
			if ( cpuTicks === 0 ) {
				cpuTicks = this.cpu.execute();
			}
			this.mainboard.ppu.handleSpriteTransfer();
			this.cpuMtc += cpuTicks * COLOUR_ENCODING_MTC_PER_CPU;
			this._cpuMTCatEndOfInstruction[this._cpuMTCatEndOfInstructionIndex] = this.cpuMtc;
			this._cpuMTCatEndOfInstructionIndex = ( this._cpuMTCatEndOfInstructionIndex + 1 ) & 0x7;

			if ( this._newEventInserted ) {
				this._newEventInserted = false;
				nextEventTime = this.getNextEventTime();
			}
		}

		// run all other components to the cpu mtc
		this.synchronise( this.cpuMtc );
	}


	isPpuTickOnLastCycleOfCpuInstruction( ppuCount ) {

		for ( var i=0; i<this._cpuMTCatEndOfInstruction.length; ++i ) {
			var cpuCount = this._cpuMTCatEndOfInstruction[ i ];
			if ( cpuCount - COLOUR_ENCODING_MTC_PER_CPU <= ppuCount && cpuCount + MASTER_CYCLES_PER_PPU >= ppuCount ) {
				return true;
			}
		}
		return false;
	}


	advanceCpuMTC( advance ) {
		this.cpuMtc += advance;
	}


	getCpuMTC() {
		return ( this.cpuMtc + this.cpu.getSubCycle() * COLOUR_ENCODING_MTC_PER_CPU ) | 0;
	}


	saveState() {
		// TODO: save event data in state, maybe not necessary as save state is done on the end of a frame?
		var data = {};
		data.cpuMtc = this.cpuMtc;
		data._lastSynchronisedMtc = this._lastSynchronisedMtc;
		return data;
	}


	loadState( state ) {
		this.cpuMtc = state.cpuMtc;
		this._lastSynchronisedMtc = state._lastSynchronisedMtc;
	}
}
