// CPU 6502
import {
	writeLine,
	trace_cpu,
	trace_cpuInstructions
} from '../../utils/Trace';

import fastInstructions from './fastInstructions';
import cpuInstructionsSwitch from './switchFastInstructions';

import {
	cpuInstructionsTrace as traceInstructions,
	cpuTrace
} from './traceInstructions';

import formatCpuTraceString from './cpuTraceString.js';

import {
	CPU_RESET_ADDRESS,
	CPU_NMI_ADDRESS,
	CPU_IRQ_ADDRESS,
} from '../../config/consts.js';

const maximumTracesToStoreForLoopDetection = 32;

export default class Cpu6502 {
	constructor(mainboard) {
		this.mainboard = mainboard;
		this.mainboard.connect('reset', ::this.reset);
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
		this._instructionSet = fastInstructions; // Default to 'fast' versions
		this._instructionSwitch = cpuInstructionsSwitch;
		this.resetVariables();
	}


	breakPoint(resume) {

		this.isRunning = resume;
	}


	enableTrace(enabled) {

		this._traceEnabled = enabled === undefined ? true : enabled;
		if (this._traceEnabled) {
			this._instructionSet = traceInstructions; // use slow instructions
		} else {
			this._instructionSet = fastInstructions; // use fast instructions
		}
	}


	resetVariables() {
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


	incrementSubcycle() {
		this.subcycle++;
	}


	getPC() {
		return this.programCounter;
	}

	setPC(pc) {
		this.programCounter = pc;
	}


	getZero() {
		return this._flagZero;
	}

	setZero(zero) {
		this._flagZero = zero;
	}

	getOverflow() {
		return this._flagOverflow;
	}

	setOverflow(f) {
		this._flagOverflow = f;
	}

	getInterrupt() {
		return this._flagInterrupt;
	}

	setInterrupt(f) {
		this._flagInterrupt = f;
	}

	getBreak() {
		return this._flagBreak;
	}

	setBreak(f) {
		this._flagBreak = f;
	}

	getDecimal() {
		return this._flagDecimal;
	}

	setDecimal(f) {
		this._flagDecimal = f;
	}

	getUnused() {
		return this._flagUnused;
	}

	setUnused(f) {
		this._flagUnused = f;
	}

	getCarry() {
		return this._flagCarry;
	}

	setCarry(f) {
		this._flagCarry = f;
	}


	getSign() {
		return this._flagSign;
	}

	setSign(f) {
		this._flagSign = f;
	}


	getRegA() {
		return this.regA;
	}

	setRegA(f) {
		this.regA = f;
	}


	getRegX() {
		return this.regX;
	}

	setRegX(f) {
		this.regX = f;
	}


	getRegY() {
		return this.regY;
	}

	setRegY(f) {
		this.regY = f;
	}


	setExecuteCallback(cb) {
		this.executeCallback = cb;
	}


	getSubCycle() {
		return this.subcycle;
	}


	handlePendingInterrupts() {

		// TODO: if an NMI interrupt is interrupted by a BRK, dont execute the BRK (6502 bug - fixed in the CMOS version)
		if (this.resetPending) {
			for (var i = 0; i < 3; ++i)
				this.incrementStackReg(); // increment stack pointer but dont write to memory

			this.setBreak(false);
			this.setInterrupt(true);

			if (this.cmosVersion)
				this._flagDecimal = false;

			this.programCounter = this.mainboard.memory.read16NoZeroPageWrap(CPU_RESET_ADDRESS);
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
			this.pushStack((this.programCounter >> 8) & 0xFF);
			this.incrementStackReg();
			this.pushStack(this.programCounter & 0xFF);
			this.incrementStackReg();

			this._flagBreak = false;

			this.pushStack(this.statusRegToByte());
			this.incrementStackReg();

			this._flagInterrupt = true;
			if (this.cmosVersion)
				this._flagDecimal = false;
			this.programCounter = this.mainboard.memory.read16NoZeroPageWrap(CPU_NMI_ADDRESS);
			this.nmiPending = false;
			return 7;
		}

		if (this.irqLineLow > 0 && !this.waitOneInstructionAfterCli && !this._flagInterrupt) {
			// IRQ interrupt
			this.pushStack((this.programCounter >> 8) & 0xFF);
			this.incrementStackReg();
			this.pushStack(this.programCounter & 0xFF);
			this.incrementStackReg();

			this._flagBreak = false;

			this.pushStack(this.statusRegToByte());
			this.incrementStackReg();

			this._flagInterrupt = true;
			if (this.cmosVersion)
				this._flagDecimal = false;
			this.programCounter = this.mainboard.memory.read16NoZeroPageWrap(CPU_IRQ_ADDRESS);
			return 7;
		}
		return 0;
	}


	nonMaskableInterrupt(ppuMasterTickCount) {
		writeLine(trace_cpu, 'NMI triggered');
		this.nmiPending = true;
		if (this.mainboard.synchroniser.isPpuTickOnLastCycleOfCpuInstruction(ppuMasterTickCount)) {
			// CPU is *always* either ahead or equal to the PPU master tick count.
			// Perform 1-instruction delay if NMI is triggered in the last cycle of an instruction
			this.triggerNmiAfterNextInstruction = true;
		}
	}


	reset() {
		this.resetVariables();
		this.resetPending = true;
	}


	holdIrqLineLow(low) {
		if (low) {
			this.irqLineLow++;
		} else {
			if (this.irqLineLow > 0) {
				this.irqLineLow--;
			}
		}
	}


	statusRegToByte() {
		var b = 0;
		b |= (this._flagCarry ? 0x1 : 0);
		b |= (this._flagZero ? 0x2 : 0);
		b |= (this._flagInterrupt ? 0x4 : 0);
		b |= (this._flagDecimal ? 0x8 : 0);
		b |= (this._flagBreak ? 0x10 : 0);
		b |= (this._flagUnused ? 0x20 : 0);
		b |= (this._flagOverflow ? 0x40 : 0);
		b |= (this._flagSign ? 0x80 : 0);
		return b;
	}


	statusRegFromByte(b) {
		this._flagCarry = (b & 0x1) > 0;
		this._flagZero = (b & 0x2) > 0;
		this._flagInterrupt = (b & 0x4) > 0;
		this._flagDecimal = (b & 0x8) > 0;
		this._flagBreak = (b & 0x10) > 0;
		this._flagUnused = (b & 0x20) > 0;
		this._flagOverflow = (b & 0x40) > 0;
		this._flagSign = (b & 0x80) > 0;
	}


	incrementStackReg() {
		this.regS--;
		if (this.regS < 0)
			this.regS = 0xFF;
	}


	decrementStackReg() {
		this.regS++;
		if (this.regS > 0xFF)
			this.regS = 0;
	}


	pushStack(value) {
		this.mainboard.memory.write8(0x100 + this.regS, value & 0xFF);
	}


	popStack(value) {
		return this.mainboard.memory.read8(0x100 + this.regS);
	}


	read16FromMemNoWrap(offsetAddress) {

		this.incrementSubcycle();
		var ret = this.mainboard.memory.read8(offsetAddress) & 0xFF;
		this.incrementSubcycle();
		var secondByte = this.mainboard.memory.read8((offsetAddress + 1) & 0xFFFF);
		ret |= ((secondByte & 0xFF) << 8);
		return ret & 0xFFFF;
	}


	read16FromMemWithWrap(offsetAddress) {

		this.incrementSubcycle();
		var ret = this.mainboard.memory.read8(offsetAddress);
		var newoffset;
		if ((offsetAddress & 0xFF) === 0xFF) {
			newoffset = (offsetAddress & 0xFF00);
		} else {
			newoffset = offsetAddress + 1;
		}
		this.incrementSubcycle();
		var secondByte = this.mainboard.memory.read8(newoffset & 0xFFFF);
		ret |= ((secondByte & 0xFF) << 8);
		return ret & 0xFFFF;
	}


	calculateRelativeDifference(pc, b) {
		var isSigned = (b & 0x80) > 0;
		if (isSigned) {
			var inverse = ((b ^ 0xFF) + 1) & 0xFF;
			return pc - inverse;
		} else
			return pc + b;
	}


	execute() {
		this.subcycle = 0;
		if (this.waitOneInstructionAfterCli)
			this.waitOneInstructionAfterCli = false;

		var opcode = this.mainboard.memory.read8(this.programCounter);
		var cyclesTaken = 0;
		if (!this._useSwitchStatement) {
			cyclesTaken = this._instructionSet[opcode](this, this.mainboard.memory);
		} else {
			cyclesTaken = this._instructionSwitch(opcode, this, this.mainboard.memory);
		}
		if (this._traceEnabled) {
			this._doTrace();
		}
		this.subcycle = 0;
		return cyclesTaken;
	}


	_hasProgramCounterBeenSeenBefore(pg) {

		for (var i = 0; i < this._previousTraceProgramCounters.length; ++i) {
			if (this._previousTraceProgramCounters[i] === pg) {
				return i;
			}
		}
		return -1;
	}


	_doTrace() {
		var instructionData = cpuTrace;
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
				writeLine(trace_cpuInstructions, "LOOP " + this._traceLoopCount + " TIMES");
				this._traceLoopCount = 0;
			}
		}

		if (!this._inTraceLoop) {
			this._previousTraceProgramCounters[this._previousTraceProgramCountersIndex] = instructionData.programCounter;
			this._previousTraceProgramCountersIndex = (this._previousTraceProgramCountersIndex + 1) & 0x1F;
			writeLine(trace_cpuInstructions, formatCpuTraceString[instructionData.opcode](instructionData));
			//$.extend( true, {}, instructionData );
		}
	}


	saveState() {

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


	loadState(state) {

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
}
