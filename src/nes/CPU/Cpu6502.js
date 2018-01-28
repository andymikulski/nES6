// CPU 6502
import {
	writeLine,
	traceCpu,
	traceCpuInstructions
} from '../../utils/Trace';

import fastInstructions from './fastInstructions';

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
		this.mainboard.connect('reset', :: this.reset);
		this.executeCallback = null;
		this.cmosVersion = false;
		this.isRunning = true;
		this.traceEnabled = false;
		this.previousTraceProgramCounters = new Uint16Array(maximumTracesToStoreForLoopDetection); // used to detect loops in cpu traces
		this.previousTraceProgramCountersIndex = 0;
		this.inTraceLoop = false;
		this.traceLoopCount = 0;

		//var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

		this.useSwitchStatement = false; // isFirefox;
		this.instructionSet = fastInstructions; // Default to 'fast' versions
		this.resetVariables();
	}


	breakPoint(resume) {

		this.isRunning = resume;
	}


	enableTrace(enabled) {

		this.traceEnabled = enabled === undefined ? true : enabled;
		if (this.traceEnabled) {
			this.instructionSet = traceInstructions; // use slow instructions
		} else {
			this.instructionSet = fastInstructions; // use fast instructions
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

		this.flagCarry = false;
		this.flagZero = false;
		this.flagInterrupt = false;
		this.flagDecimal = false;
		this.flagBreak = true;
		this.flagUnused = true;
		this.flagOverflow = false;
		this.flagSign = false;

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
		return this.flagZero;
	}

	setZero(zero) {
		this.flagZero = zero;
	}

	getOverflow() {
		return this.flagOverflow;
	}

	setOverflow(f) {
		this.flagOverflow = f;
	}

	getInterrupt() {
		return this.flagInterrupt;
	}

	setInterrupt(f) {
		this.flagInterrupt = f;
	}

	getBreak() {
		return this.flagBreak;
	}

	setBreak(f) {
		this.flagBreak = f;
	}

	getDecimal() {
		return this.flagDecimal;
	}

	setDecimal(f) {
		this.flagDecimal = f;
	}

	getUnused() {
		return this.flagUnused;
	}

	setUnused(f) {
		this.flagUnused = f;
	}

	getCarry() {
		return this.flagCarry;
	}

	setCarry(f) {
		this.flagCarry = f;
	}


	getSign() {
		return this.flagSign;
	}

	setSign(f) {
		this.flagSign = f;
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
				this.flagDecimal = false;

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

			this.flagBreak = false;

			this.pushStack(this.statusRegToByte());
			this.incrementStackReg();

			this.flagInterrupt = true;
			if (this.cmosVersion)
				this.flagDecimal = false;
			this.programCounter = this.mainboard.memory.read16NoZeroPageWrap(CPU_NMI_ADDRESS);
			this.nmiPending = false;
			return 7;
		}

		if (this.irqLineLow > 0 && !this.waitOneInstructionAfterCli && !this.flagInterrupt) {
			// IRQ interrupt
			this.pushStack((this.programCounter >> 8) & 0xFF);
			this.incrementStackReg();
			this.pushStack(this.programCounter & 0xFF);
			this.incrementStackReg();

			this.flagBreak = false;

			this.pushStack(this.statusRegToByte());
			this.incrementStackReg();

			this.flagInterrupt = true;
			if (this.cmosVersion)
				this.flagDecimal = false;
			this.programCounter = this.mainboard.memory.read16NoZeroPageWrap(CPU_IRQ_ADDRESS);
			return 7;
		}
		return 0;
	}


	nonMaskableInterrupt(ppuMasterTickCount) {
		writeLine(traceCpu, 'NMI triggered');
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
		b |= (this.flagCarry ? 0x1 : 0);
		b |= (this.flagZero ? 0x2 : 0);
		b |= (this.flagInterrupt ? 0x4 : 0);
		b |= (this.flagDecimal ? 0x8 : 0);
		b |= (this.flagBreak ? 0x10 : 0);
		b |= (this.flagUnused ? 0x20 : 0);
		b |= (this.flagOverflow ? 0x40 : 0);
		b |= (this.flagSign ? 0x80 : 0);
		return b;
	}


	statusRegFromByte(b) {
		this.flagCarry = (b & 0x1) > 0;
		this.flagZero = (b & 0x2) > 0;
		this.flagInterrupt = (b & 0x4) > 0;
		this.flagDecimal = (b & 0x8) > 0;
		this.flagBreak = (b & 0x10) > 0;
		this.flagUnused = (b & 0x20) > 0;
		this.flagOverflow = (b & 0x40) > 0;
		this.flagSign = (b & 0x80) > 0;
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
		var cyclesTaken = this.instructionSet[opcode](this, this.mainboard.memory);
		this.subcycle = 0;
		return cyclesTaken;
	}


	hasProgramCounterBeenSeenBefore(pg) {

		for (var i = 0; i < this.previousTraceProgramCounters.length; ++i) {
			if (this.previousTraceProgramCounters[i] === pg) {
				return i;
			}
		}
		return -1;
	}


	doTrace() {
		var instructionData = cpuTrace;
		// check previous instructions for the same program counter
		var prevIndex = this.hasProgramCounterBeenSeenBefore(instructionData.programCounter);
		if (prevIndex >= 0) {
			// if it's the same loop as the one that's already detected, don't report.
			if (!this.inTraceLoop) {
				this.inTraceLoop = true;
				this.traceLoopCount = 0;
			}
			this.traceLoopCount++;
		} else {
			if (this.inTraceLoop) {
				this.inTraceLoop = false;
				writeLine(traceCpuInstructions, "LOOP " + this.traceLoopCount + " TIMES");
				this.traceLoopCount = 0;
			}
		}

		if (!this.inTraceLoop) {
			this.previousTraceProgramCounters[this.previousTraceProgramCountersIndex] = instructionData.programCounter;
			this.previousTraceProgramCountersIndex = (this.previousTraceProgramCountersIndex + 1) & 0x1F;
			writeLine(traceCpuInstructions, formatCpuTraceString[instructionData.opcode](instructionData));
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

		data.flagCarry = this.flagCarry;
		data.flagZero = this.flagZero;
		data.flagInterrupt = this.flagInterrupt;
		data.flagDecimal = this.flagDecimal;
		data.flagBreak = this.flagBreak;
		data.flagUnused = this.flagUnused;
		data.flagOverflow = this.flagOverflow;
		data.flagSign = this.flagSign;

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

		this.flagCarry = state.flagCarry;
		this.flagZero = state.flagZero;
		this.flagInterrupt = state.flagInterrupt;
		this.flagDecimal = state.flagDecimal;
		this.flagBreak = state.flagBreak;
		this.flagUnused = state.flagUnused;
		this.flagOverflow = state.flagOverflow;
		this.flagSign = state.flagSign;

		this.regS = state.regS;
		this.regX = state.regX;
		this.regY = state.regY;
		this.regA = state.regA;
		this.SAYHighByte = state.SAYHighByte;
	}
}
