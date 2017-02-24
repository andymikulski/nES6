'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Event = require('./Event');

var _consts = require('../config/consts');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SyncEvent = function SyncEvent(name, tickCount, callback) {
	_classCallCheck(this, SyncEvent);

	this.name = name;
	this.tickCount = tickCount;
	this.callback = callback;
};

var Synchroniser = function () {
	function Synchroniser(mainboard) {
		_classCallCheck(this, Synchroniser);

		this.mainboard = mainboard;
		this.mainboard.connect('reset', this.reset.bind(this));
		this.cpu = mainboard.cpu;
		this.cpuMtc = 0;
		this._lastSynchronisedMtc = 0;
		this._isSynchronising = false;
		this._newEventInserted = false;
		this._eventBus = new _Event.EventBus();
		this._cpuMTCatEndOfInstruction = new Int32Array(8); // Array of ppu MTC counts which the last X instructions have ended on.
		this._cpuMTCatEndOfInstructionIndex = 0; // This is for determining if an NMI trigger should delay by an instruction or not.

		this._events = [];
		this._objects = [];
	}

	_createClass(Synchroniser, [{
		key: 'reset',
		value: function reset(cold) {
			this.cpuMtc = 0;
			this._lastSynchronisedMtc = 0;
			this._cpuMTCatEndOfInstructionIndex = 0;
			this._isSynchronising = false;
			this._newEventInserted = false;
		}
	}, {
		key: 'connect',
		value: function connect(name, callback) {
			this._eventBus.connect(name, callback);
		}
	}, {
		key: 'changeEventTime',
		value: function changeEventTime(eventId, tickCount) {

			var obj = this._getEvent(eventId);
			obj.tickCount = tickCount;
			this._executeCallbackIfSynchronising(obj);
			this._newEventInserted = true;
		}
	}, {
		key: '_removeEvent',
		value: function _removeEvent(name) {

			for (var i = 0; i < this._events.length; ++i) {
				var ev = this._events[i];
				if (ev.name === name) {
					return this._events.splice(i, 1)[0];
				}
			}
			return null;
		}
	}, {
		key: '_getEvent',
		value: function _getEvent(eventId) {

			return this._events[eventId];
		}
	}, {
		key: 'addEvent',
		value: function addEvent(name, tickCount, callback) {

			this._removeEvent(name);
			var obj = new SyncEvent(name, tickCount, callback);
			this._executeCallbackIfSynchronising(obj);
			this._events.push(obj);
			this._newEventInserted = true;
			return this._events.length - 1;
		}
	}, {
		key: '_executeCallbackIfSynchronising',
		value: function _executeCallbackIfSynchronising(event) {
			if (this._isSynchronising && event.tickCount >= 0) {
				// if a new event has been added during synchronisation, execute it immediately if it is due
				if (this._lastSynchronisedMtc < event.tickCount && this._currentSyncValue >= event.tickCount) {
					event.callback(event.tickCount);
				}
			}
		}
	}, {
		key: 'addObject',
		value: function addObject(name, obj) {

			this._objects.push({ name: name, object: obj, lastSynchronisedTickCount: 0 });
		}
	}, {
		key: 'synchronise',
		value: function synchronise() {

			var frameEnd = _consts.COLOUR_ENCODING_FRAME_MTC;

			if (this._isSynchronising) {
				//debugger;
				throw new Error("Cannot call synchronise synchronisation phase");
			}

			var syncTo = this.getCpuMTC();

			// work out when the next scheduled event is to occur. Then synchronise all objects to that event, then execute the event.
			// Then move onto the next one.
			var objIndex = 0;
			var keepRunning = true;
			// while ( keepRunning ) {
			var nextEventTime = this.getNextEventTime();
			if (nextEventTime <= syncTo && nextEventTime < frameEnd) {
				syncTo = nextEventTime;
			} else {
				keepRunning = false; // no more events until requested syncTo value: we can finish the sync loop
				syncTo = Math.min(syncTo, frameEnd);
			}

			if (this._lastSynchronisedMtc >= syncTo) {
				return;
			}

			this._isSynchronising = true;
			this._currentSyncValue = syncTo;

			for (objIndex = 0; objIndex < this._objects.length; ++objIndex) {
				// TODO: Objects should be forbidden from calling synchroniser.synchronise() whilst in the synchronise phase - if they
				// want to force a synchronise they should do so using an event
				var obj = this._objects[objIndex];
				if (obj.lastSynchronisedTickCount < syncTo) {
					obj.object.synchronise(obj.lastSynchronisedTickCount, syncTo);
					obj.lastSynchronisedTickCount = syncTo;
				}
			}
			this._isSynchronising = false;

			this._executeEvents(this._lastSynchronisedMtc, syncTo);
			this._lastSynchronisedMtc = syncTo;

			// TODO: this should be an event: do end frame stuff if that time has come
			if (syncTo >= frameEnd) {
				for (objIndex = 0; objIndex < this._objects.length; ++objIndex) {
					this._objects[objIndex].object.onEndFrame(syncTo);
					this._objects[objIndex].lastSynchronisedTickCount = 0;
				}

				this.cpuMtc -= frameEnd;
				this._lastSynchronisedMtc = 0;
				this._eventBus.invoke('frameEnd');
			}
			// }
		}
	}, {
		key: 'getNextEventTime',
		value: function getNextEventTime(currentTime) {

			var frameEnd = _consts.COLOUR_ENCODING_FRAME_MTC;
			currentTime = currentTime || this._lastSynchronisedMtc;
			var closestObj = null;
			for (var eventIndex = 0; eventIndex < this._events.length; ++eventIndex) {
				var ev = this._events[eventIndex];
				if (ev.tickCount >= 0 && ev.tickCount > currentTime) {
					if (closestObj === null || ev.tickCount < closestObj.tickCount) {
						closestObj = ev;
					}
				}
			}
			return closestObj !== null ? closestObj.tickCount : frameEnd;
		}
	}, {
		key: '_executeEvents',
		value: function _executeEvents(startTime, endTime) {

			for (var eventIndex = 0; eventIndex < this._events.length; ++eventIndex) {
				var ev = this._events[eventIndex];
				if (ev.tickCount >= 0 && ev.tickCount > startTime && ev.tickCount <= endTime) {
					ev.callback(ev.tickCount);
				}
			}
		}
	}, {
		key: 'runCycle',
		value: function runCycle() {

			var nextEventTime = this.getNextEventTime();

			// run cpu
			while (this.cpuMtc < nextEventTime) {
				var cpuTicks = this.cpu.handlePendingInterrupts();
				if (cpuTicks === 0) {
					cpuTicks = this.cpu.execute();
				}
				this.mainboard.ppu.handleSpriteTransfer();
				this.cpuMtc += cpuTicks * _consts.COLOUR_ENCODING_MTC_PER_CPU;
				this._cpuMTCatEndOfInstruction[this._cpuMTCatEndOfInstructionIndex] = this.cpuMtc;
				this._cpuMTCatEndOfInstructionIndex = this._cpuMTCatEndOfInstructionIndex + 1 & 0x7;

				if (this._newEventInserted) {
					this._newEventInserted = false;
					nextEventTime = this.getNextEventTime();
				}
			}

			// run all other components to the cpu mtc
			this.synchronise(this.cpuMtc);
		}
	}, {
		key: 'isPpuTickOnLastCycleOfCpuInstruction',
		value: function isPpuTickOnLastCycleOfCpuInstruction(ppuCount) {

			for (var i = 0; i < this._cpuMTCatEndOfInstruction.length; ++i) {
				var cpuCount = this._cpuMTCatEndOfInstruction[i];
				if (cpuCount - _consts.COLOUR_ENCODING_MTC_PER_CPU <= ppuCount && cpuCount + _consts.MASTER_CYCLES_PER_PPU >= ppuCount) {
					return true;
				}
			}
			return false;
		}
	}, {
		key: 'advanceCpuMTC',
		value: function advanceCpuMTC(advance) {
			this.cpuMtc += advance;
		}
	}, {
		key: 'getCpuMTC',
		value: function getCpuMTC() {
			return this.cpuMtc + this.cpu.getSubCycle() * _consts.COLOUR_ENCODING_MTC_PER_CPU | 0;
		}
	}, {
		key: 'saveState',
		value: function saveState() {
			// TODO: save event data in state, maybe not necessary as save state is done on the end of a frame?
			var data = {};
			data.cpuMtc = this.cpuMtc;
			data._lastSynchronisedMtc = this._lastSynchronisedMtc;
			return data;
		}
	}, {
		key: 'loadState',
		value: function loadState(state) {
			this.cpuMtc = state.cpuMtc;
			this._lastSynchronisedMtc = state._lastSynchronisedMtc;
		}
	}]);

	return Synchroniser;
}();

exports.default = Synchroniser;