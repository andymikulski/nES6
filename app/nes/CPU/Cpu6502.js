'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // CPU 6502


var _Trace = require('../../utils/Trace');

var _fastInstructions = require('./fastInstructions');

var _fastInstructions2 = _interopRequireDefault(_fastInstructions);

var _switchFastInstructions = require('./switchFastInstructions');

var _switchFastInstructions2 = _interopRequireDefault(_switchFastInstructions);

var _traceInstructions = require('./traceInstructions');

var _cpuTraceString = require('./cpuTraceString.js');

var _cpuTraceString2 = _interopRequireDefault(_cpuTraceString);

var _consts = require('../../config/consts.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var maximumTracesToStoreForLoopDetection = 32;

var Cpu6502 = function () {
	function Cpu6502(mainboard) {
		_classCallCheck(this, Cpu6502);

		this.mainboard = mainboard;
		this.mainboard.connect('reset', this.reset.bind(this));
		this.executeCallback = null;
		this.cmosVersion = false;
		this.isRunning = true;
		this._traceEnabled = false;
		this._previousTraceProgramCounters = new Uint16Array(maximumTracesToStoreForLoopDetection); // used to detect loops in cpu traces
		this._previousTraceProgramCountersIndex = 0;
		this._inTraceLoop = false;
		this._traceLoopCount = 0;

		//var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

		this._useSwitchStatement = false; // isFirefox;
		this._instructionSet = _fastInstructions2.default; // Default to 'fast' versions
		this._instructionSwitch = _switchFastInstructions2.default;
		this.resetVariables();
	}

	_createClass(Cpu6502, [{
		key: 'breakPoint',
		value: function breakPoint(resume) {

			this.isRunning = resume;
		}
	}, {
		key: 'enableTrace',
		value: function enableTrace(enabled) {

			this._traceEnabled = enabled === undefined ? true : enabled;
			if (this._traceEnabled) {
				this._instructionSet = _traceInstructions.cpuInstructionsTrace; // use slow instructions
			} else {
				this._instructionSet = _fastInstructions2.default; // use fast instructions
			}
		}
	}, {
		key: 'resetVariables',
		value: function resetVariables() {
			this.programCounter = 0;
			this.subcycle = 0;

			this.waitOneInstructionAfterCli = false;
			this.resetPending = false;
			this.nmiPending = false;
			this.irqLineLow = 0;
			this.triggerNmiAfterNextInstruction = false;

			this._flagCarry = false;
			this._flagZero = false;
			this._flagInterrupt = false;
			this._flagDecimal = false;
			this._flagBreak = true;
			this._flagUnused = true;
			this._flagOverflow = false;
			this._flagSign = false;

			this.regS = 0;
			this.regX = 0;
			this.regY = 0;
			this.regA = 0;
			this.SAYHighByte = 0;
		}
	}, {
		key: 'incrementSubcycle',
		value: function incrementSubcycle() {
			this.subcycle++;
		}
	}, {
		key: 'getPC',
		value: function getPC() {
			return this.programCounter;
		}
	}, {
		key: 'setPC',
		value: function setPC(pc) {
			this.programCounter = pc;
		}
	}, {
		key: 'getZero',
		value: function getZero() {
			return this._flagZero;
		}
	}, {
		key: 'setZero',
		value: function setZero(zero) {
			this._flagZero = zero;
		}
	}, {
		key: 'getOverflow',
		value: function getOverflow() {
			return this._flagOverflow;
		}
	}, {
		key: 'setOverflow',
		value: function setOverflow(f) {
			this._flagOverflow = f;
		}
	}, {
		key: 'getInterrupt',
		value: function getInterrupt() {
			return this._flagInterrupt;
		}
	}, {
		key: 'setInterrupt',
		value: function setInterrupt(f) {
			this._flagInterrupt = f;
		}
	}, {
		key: 'getBreak',
		value: function getBreak() {
			return this._flagBreak;
		}
	}, {
		key: 'setBreak',
		value: function setBreak(f) {
			this._flagBreak = f;
		}
	}, {
		key: 'getDecimal',
		value: function getDecimal() {
			return this._flagDecimal;
		}
	}, {
		key: 'setDecimal',
		value: function setDecimal(f) {
			this._flagDecimal = f;
		}
	}, {
		key: 'getUnused',
		value: function getUnused() {
			return this._flagUnused;
		}
	}, {
		key: 'setUnused',
		value: function setUnused(f) {
			this._flagUnused = f;
		}
	}, {
		key: 'getCarry',
		value: function getCarry() {
			return this._flagCarry;
		}
	}, {
		key: 'setCarry',
		value: function setCarry(f) {
			this._flagCarry = f;
		}
	}, {
		key: 'getSign',
		value: function getSign() {
			return this._flagSign;
		}
	}, {
		key: 'setSign',
		value: function setSign(f) {
			this._flagSign = f;
		}
	}, {
		key: 'getRegA',
		value: function getRegA() {
			return this.regA;
		}
	}, {
		key: 'setRegA',
		value: function setRegA(f) {
			this.regA = f;
		}
	}, {
		key: 'getRegX',
		value: function getRegX() {
			return this.regX;
		}
	}, {
		key: 'setRegX',
		value: function setRegX(f) {
			this.regX = f;
		}
	}, {
		key: 'getRegY',
		value: function getRegY() {
			return this.regY;
		}
	}, {
		key: 'setRegY',
		value: function setRegY(f) {
			this.regY = f;
		}
	}, {
		key: 'setExecuteCallback',
		value: function setExecuteCallback(cb) {
			this.executeCallback = cb;
		}
	}, {
		key: 'getSubCycle',
		value: function getSubCycle() {
			return this.subcycle;
		}
	}, {
		key: 'handlePendingInterrupts',
		value: function handlePendingInterrupts() {

			// TODO: if an NMI interrupt is interrupted by a BRK, dont execute the BRK (6502 bug - fixed in the CMOS version)
			if (this.resetPending) {
				for (var i = 0; i < 3; ++i) {
					this.incrementStackReg();
				} // increment stack pointer but dont write to memory

				this.setBreak(false);
				this.setInterrupt(true);

				if (this.cmosVersion) this._flagDecimal = false;

				this.programCounter = this.mainboard.memory.read16NoZeroPageWrap(_consts.CPU_RESET_ADDRESS);
				//this.programCounter = 0xC000;
				this.resetPending = false;
				return 0;
			}

			if (this.nmiPending) {
				if (this.triggerNmiAfterNextInstruction) {
					this.triggerNmiAfterNextInstruction = false;
					return 0;
				}

				// NMI interrupt
				this.pushStack(this.programCounter >> 8 & 0xFF);
				this.incrementStackReg();
				this.pushStack(this.programCounter & 0xFF);
				this.incrementStackReg();

				this._flagBreak = false;

				this.pushStack(this.statusRegToByte());
				this.incrementStackReg();

				this._flagInterrupt = true;
				if (this.cmosVersion) this._flagDecimal = false;
				this.programCounter = this.mainboard.memory.read16NoZeroPageWrap(_consts.CPU_NMI_ADDRESS);
				this.nmiPending = false;
				return 7;
			}

			if (this.irqLineLow > 0 && !this.waitOneInstructionAfterCli && !this._flagInterrupt) {
				// IRQ interrupt
				this.pushStack(this.programCounter >> 8 & 0xFF);
				this.incrementStackReg();
				this.pushStack(this.programCounter & 0xFF);
				this.incrementStackReg();

				this._flagBreak = false;

				this.pushStack(this.statusRegToByte());
				this.incrementStackReg();

				this._flagInterrupt = true;
				if (this.cmosVersion) this._flagDecimal = false;
				this.programCounter = this.mainboard.memory.read16NoZeroPageWrap(_consts.CPU_IRQ_ADDRESS);
				return 7;
			}
			return 0;
		}
	}, {
		key: 'nonMaskableInterrupt',
		value: function nonMaskableInterrupt(ppuMasterTickCount) {
			(0, _Trace.writeLine)(_Trace.trace_cpu, 'NMI triggered');
			this.nmiPending = true;
			if (this.mainboard.synchroniser.isPpuTickOnLastCycleOfCpuInstruction(ppuMasterTickCount)) {
				// CPU is *always* either ahead or equal to the PPU master tick count.
				// Perform 1-instruction delay if NMI is triggered in the last cycle of an instruction
				this.triggerNmiAfterNextInstruction = true;
			}
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.resetVariables();
			this.resetPending = true;
		}
	}, {
		key: 'holdIrqLineLow',
		value: function holdIrqLineLow(low) {
			if (low) {
				this.irqLineLow++;
			} else {
				if (this.irqLineLow > 0) {
					this.irqLineLow--;
				}
			}
		}
	}, {
		key: 'statusRegToByte',
		value: function statusRegToByte() {
			var b = 0;
			b |= this._flagCarry ? 0x1 : 0;
			b |= this._flagZero ? 0x2 : 0;
			b |= this._flagInterrupt ? 0x4 : 0;
			b |= this._flagDecimal ? 0x8 : 0;
			b |= this._flagBreak ? 0x10 : 0;
			b |= this._flagUnused ? 0x20 : 0;
			b |= this._flagOverflow ? 0x40 : 0;
			b |= this._flagSign ? 0x80 : 0;
			return b;
		}
	}, {
		key: 'statusRegFromByte',
		value: function statusRegFromByte(b) {
			this._flagCarry = (b & 0x1) > 0;
			this._flagZero = (b & 0x2) > 0;
			this._flagInterrupt = (b & 0x4) > 0;
			this._flagDecimal = (b & 0x8) > 0;
			this._flagBreak = (b & 0x10) > 0;
			this._flagUnused = (b & 0x20) > 0;
			this._flagOverflow = (b & 0x40) > 0;
			this._flagSign = (b & 0x80) > 0;
		}
	}, {
		key: 'incrementStackReg',
		value: function incrementStackReg() {
			this.regS--;
			if (this.regS < 0) this.regS = 0xFF;
		}
	}, {
		key: 'decrementStackReg',
		value: function decrementStackReg() {
			this.regS++;
			if (this.regS > 0xFF) this.regS = 0;
		}
	}, {
		key: 'pushStack',
		value: function pushStack(value) {
			this.mainboard.memory.write8(0x100 + this.regS, value & 0xFF);
		}
	}, {
		key: 'popStack',
		value: function popStack(value) {
			return this.mainboard.memory.read8(0x100 + this.regS);
		}
	}, {
		key: 'read16FromMemNoWrap',
		value: function read16FromMemNoWrap(offsetAddress) {

			this.incrementSubcycle();
			var ret = this.mainboard.memory.read8(offsetAddress) & 0xFF;
			this.incrementSubcycle();
			var secondByte = this.mainboard.memory.read8(offsetAddress + 1 & 0xFFFF);
			ret |= (secondByte & 0xFF) << 8;
			return ret & 0xFFFF;
		}
	}, {
		key: 'read16FromMemWithWrap',
		value: function read16FromMemWithWrap(offsetAddress) {

			this.incrementSubcycle();
			var ret = this.mainboard.memory.read8(offsetAddress);
			var newoffset;
			if ((offsetAddress & 0xFF) === 0xFF) {
				newoffset = offsetAddress & 0xFF00;
			} else {
				newoffset = offsetAddress + 1;
			}
			this.incrementSubcycle();
			var secondByte = this.mainboard.memory.read8(newoffset & 0xFFFF);
			ret |= (secondByte & 0xFF) << 8;
			return ret & 0xFFFF;
		}
	}, {
		key: 'calculateRelativeDifference',
		value: function calculateRelativeDifference(pc, b) {
			var isSigned = (b & 0x80) > 0;
			if (isSigned) {
				var inverse = (b ^ 0xFF) + 1 & 0xFF;
				return pc - inverse;
			} else return pc + b;
		}
	}, {
		key: 'execute',
		value: function execute() {
			this.subcycle = 0;
			if (this.waitOneInstructionAfterCli) this.waitOneInstructionAfterCli = false;

			var opcode = this.mainboard.memory.read8(this.programCounter);
			var cyclesTaken = 0;
			// if (!this._useSwitchStatement) {
			cyclesTaken = this._instructionSet[opcode](this, this.mainboard.memory);
			// } else {
			// 	cyclesTaken = this._instructionSwitch(opcode, this, this.mainboard.memory);
			// }
			// if (this._traceEnabled) {
			// 	this._doTrace();
			// }
			this.subcycle = 0;
			return cyclesTaken;
		}
	}, {
		key: '_hasProgramCounterBeenSeenBefore',
		value: function _hasProgramCounterBeenSeenBefore(pg) {

			for (var i = 0; i < this._previousTraceProgramCounters.length; ++i) {
				if (this._previousTraceProgramCounters[i] === pg) {
					return i;
				}
			}
			return -1;
		}
	}, {
		key: '_doTrace',
		value: function _doTrace() {
			var instructionData = _traceInstructions.cpuTrace;
			// check previous instructions for the same program counter
			var prevIndex = this._hasProgramCounterBeenSeenBefore(instructionData.programCounter);
			if (prevIndex >= 0) {
				// if it's the same loop as the one that's already detected, don't report.
				if (!this._inTraceLoop) {
					this._inTraceLoop = true;
					this._traceLoopCount = 0;
				}
				this._traceLoopCount++;
			} else {
				if (this._inTraceLoop) {
					this._inTraceLoop = false;
					(0, _Trace.writeLine)(_Trace.trace_cpuInstructions, "LOOP " + this._traceLoopCount + " TIMES");
					this._traceLoopCount = 0;
				}
			}

			if (!this._inTraceLoop) {
				this._previousTraceProgramCounters[this._previousTraceProgramCountersIndex] = instructionData.programCounter;
				this._previousTraceProgramCountersIndex = this._previousTraceProgramCountersIndex + 1 & 0x1F;
				(0, _Trace.writeLine)(_Trace.trace_cpuInstructions, _cpuTraceString2.default[instructionData.opcode](instructionData));
				//$.extend( true, {}, instructionData );
			}
		}
	}, {
		key: 'saveState',
		value: function saveState() {

			var data = {};
			data.programCounter = this.programCounter;
			data.subcycle = this.subcycle;
			data.waitOneInstructionAfterCli = this.waitOneInstructionAfterCli;
			data.resetPending = this.resetPending;
			data.nmiPending = this.nmiPending;
			data.irqLineLow = this.irqLineLow;
			data.triggerNmiAfterNextInstruction = this.triggerNmiAfterNextInstruction;

			data._flagCarry = this._flagCarry;
			data._flagZero = this._flagZero;
			data._flagInterrupt = this._flagInterrupt;
			data._flagDecimal = this._flagDecimal;
			data._flagBreak = this._flagBreak;
			data._flagUnused = this._flagUnused;
			data._flagOverflow = this._flagOverflow;
			data._flagSign = this._flagSign;

			data.regS = this.regS;
			data.regX = this.regX;
			data.regY = this.regY;
			data.regA = this.regA;
			data.SAYHighByte = this.SAYHighByte;
			return data;
		}
	}, {
		key: 'loadState',
		value: function loadState(state) {

			this.programCounter = state.programCounter;
			this.subcycle = state.subcycle;
			this.waitOneInstructionAfterCli = state.waitOneInstructionAfterCli;
			this.resetPending = state.resetPending;
			this.nmiPending = state.nmiPending;
			this.irqLineLow = state.irqLineLow;
			this.triggerNmiAfterNextInstruction = state.triggerNmiAfterNextInstruction;

			this._flagCarry = state._flagCarry;
			this._flagZero = state._flagZero;
			this._flagInterrupt = state._flagInterrupt;
			this._flagDecimal = state._flagDecimal;
			this._flagBreak = state._flagBreak;
			this._flagUnused = state._flagUnused;
			this._flagOverflow = state._flagOverflow;
			this._flagSign = state._flagSign;

			this.regS = state.regS;
			this.regX = state.regX;
			this.regY = state.regY;
			this.regA = state.regA;
			this.SAYHighByte = state.SAYHighByte;
		}
	}]);

	return Cpu6502;
}();

exports.default = Cpu6502;