

this.Nes = this.Nes || {};

"use strict";

var maximumTracesToStoreForLoopDetection = 32;

var cpu6502 = function( mainboard ) {
	var that = this;
	this.mainboard = mainboard;
	this.mainboard.connect( 'reset', function( cold ) { that.reset( cold ); } );
	this.executeCallback = null;
	this.cmosVersion = false;
	this.isRunning = true;
	this.traceEnabled = false;
	this.previousTraceProgramCounters = new Uint16Array( maximumTracesToStoreForLoopDetection ); // used to detect loops in cpu traces
	this.previousTraceProgramCountersIndex = 0;
	this.inTraceLoop = false;
	this.traceLoopCount = 0;

	//var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

	this.useSwitchStatement = false;// isFirefox;
	this.instructionSet = Nes.cpuInstructions; // Default to 'fast' versions
	this.instructionSwitch = Nes.cpuInstructionsSwitch;
	this.resetVariables();
};


cpu6502.prototype.breakPoint = function( resume ) {

	this.isRunning = resume;
};


cpu6502.prototype.enableTrace = function( enabled ) {

	this.traceEnabled = enabled === undefined ? true : enabled;
	if ( this.traceEnabled ) {
		this.instructionSet = Nes.cpuInstructionsTrace; // use slow instructions
	} else {
		this.instructionSet = Nes.cpuInstructions; // use fast instructions
	}
};


cpu6502.prototype.resetVariables = function() {
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
};


cpu6502.prototype.incrementSubcycle = function() {
	this.subcycle++;
};


cpu6502.prototype.getPC = function() {
	return this.programCounter;
};

cpu6502.prototype.setPC = function( pc ) {
	this.programCounter = pc;
};


cpu6502.prototype.getZero = function() {
	return this.flagZero;
};

cpu6502.prototype.setZero = function( zero ) {
	this.flagZero = zero;
};

cpu6502.prototype.getOverflow = function() {
	return this.flagOverflow;
};

cpu6502.prototype.setOverflow = function( f ) {
	this.flagOverflow = f;
};

cpu6502.prototype.getInterrupt = function() {
	return this.flagInterrupt;
};

cpu6502.prototype.setInterrupt = function( f ) {
	this.flagInterrupt = f;
};

cpu6502.prototype.getBreak = function() {
	return this.flagBreak;
};

cpu6502.prototype.setBreak = function( f ) {
	this.flagBreak = f;
};

cpu6502.prototype.getDecimal = function() {
	return this.flagDecimal;
};

cpu6502.prototype.setDecimal = function( f ) {
	this.flagDecimal = f;
};

cpu6502.prototype.getUnused = function() {
	return this.flagUnused;
};

cpu6502.prototype.setUnused = function( f ) {
	this.flagUnused = f;
};

cpu6502.prototype.getCarry = function() {
	return this.flagCarry;
};

cpu6502.prototype.setCarry = function( f ) {
	this.flagCarry = f;
};


cpu6502.prototype.getSign = function() {
	return this.flagSign;
};

cpu6502.prototype.setSign = function( f ) {
	this.flagSign = f;
};


cpu6502.prototype.getRegA = function() {
	return this.regA;
};

cpu6502.prototype.setRegA = function( f ) {
	this.regA = f;
};


cpu6502.prototype.getRegX = function() {
	return this.regX;
};

cpu6502.prototype.setRegX = function( f ) {
	this.regX = f;
};


cpu6502.prototype.getRegY = function() {
	return this.regY;
};

cpu6502.prototype.setRegY = function( f ) {
	this.regY = f;
};


cpu6502.prototype.setExecuteCallback = function( cb ) {
	this.executeCallback = cb;
};


cpu6502.prototype.getSubCycle = function() {
	return this.subcycle;
};


cpu6502.prototype.handlePendingInterrupts = function() {

	// TODO: if an NMI interrupt is interrupted by a BRK, dont execute the BRK (6502 bug - fixed in the CMOS version)
	if ( this.resetPending )
	{
		for ( var i=0; i<3; ++i )
			this.incrementStackReg(); // increment stack pointer but dont write to memory

		this.setBreak( false );
		this.setInterrupt( true );

		if ( this.cmosVersion )
			this.flagDecimal = false;

		this.programCounter = this.mainboard.memory.read16NoZeroPageWrap( CPU_RESET_ADDRESS );
		//this.programCounter = 0xC000;
		this.resetPending = false;
		return 0;
	}

	if ( this.nmiPending )
	{
		if ( this.triggerNmiAfterNextInstruction )
		{
			this.triggerNmiAfterNextInstruction = false;
			return 0;
		}

		// NMI interrupt
		this.pushStack( ( this.programCounter >> 8 ) & 0xFF );
		this.incrementStackReg();
		this.pushStack( this.programCounter & 0xFF );
		this.incrementStackReg();

		this.flagBreak = false;

		this.pushStack( this.statusRegToByte() );
		this.incrementStackReg();

		this.flagInterrupt = true;
		if ( this.cmosVersion )
			this.flagDecimal = false;
		this.programCounter = this.mainboard.memory.read16NoZeroPageWrap( CPU_NMI_ADDRESS );
		this.nmiPending = false;
		return 7;
	}

	if ( this.irqLineLow > 0 && !this.waitOneInstructionAfterCli && !this.flagInterrupt )
	{
		// IRQ interrupt
		this.pushStack( ( this.programCounter >> 8 ) & 0xFF );
		this.incrementStackReg();
		this.pushStack( this.programCounter & 0xFF );
		this.incrementStackReg();

		this.flagBreak = false;

		this.pushStack( this.statusRegToByte() );
		this.incrementStackReg();

		this.flagInterrupt = true;
		if ( this.cmosVersion )
			this.flagDecimal = false;
		this.programCounter = this.mainboard.memory.read16NoZeroPageWrap( CPU_IRQ_ADDRESS );
		return 7;
	}
	return 0;
};


cpu6502.prototype.nonMaskableInterrupt = function( ppuMasterTickCount ) {
	Nes.Trace.writeLine( Nes.traceCpu, 'NMI triggered' );
	this.nmiPending = true;
	if ( this.mainboard.synchroniser.isPpuTickOnLastCycleOfCpuInstruction( ppuMasterTickCount ) ) {
		// CPU is *always* either ahead or equal to the PPU master tick count.
		// Perform 1-instruction delay if NMI is triggered in the last cycle of an instruction
		this.triggerNmiAfterNextInstruction = true;
	}
};


cpu6502.prototype.reset = function() {
	this.resetVariables();
	this.resetPending = true;
};


cpu6502.prototype.holdIrqLineLow = function( low ) {
	if ( low ) {
		this.irqLineLow++;
	} else {
		if ( this.irqLineLow > 0 ) {
			this.irqLineLow--;
		}
	}
};


cpu6502.prototype.statusRegToByte = function() {
	var b = 0;
	b |= ( this.flagCarry ? 0x1 : 0 );
	b |= ( this.flagZero ? 0x2 : 0 );
	b |= ( this.flagInterrupt ? 0x4 : 0 );
	b |= ( this.flagDecimal ? 0x8 : 0 );
	b |= ( this.flagBreak ? 0x10 : 0 );
	b |= ( this.flagUnused ? 0x20 : 0 );
	b |= ( this.flagOverflow ? 0x40 : 0 );
	b |= ( this.flagSign ? 0x80 : 0 );
	return b;
};


cpu6502.prototype.statusRegFromByte = function( b ) {
	this.flagCarry = ( b & 0x1 ) > 0;
	this.flagZero = ( b & 0x2 ) > 0;
	this.flagInterrupt = ( b & 0x4 ) > 0;
	this.flagDecimal = ( b & 0x8 ) > 0;
	this.flagBreak = ( b & 0x10 ) > 0;
	this.flagUnused = ( b & 0x20 ) > 0;
	this.flagOverflow = ( b & 0x40 ) > 0;
	this.flagSign = ( b & 0x80 ) > 0;
};


cpu6502.prototype.incrementStackReg = function() {
	this.regS--;
	if ( this.regS < 0 )
		this.regS = 0xFF;
};


cpu6502.prototype.decrementStackReg = function() {
	this.regS++;
	if ( this.regS > 0xFF )
		this.regS = 0;
};


cpu6502.prototype.pushStack = function( value ) {
	this.mainboard.memory.write8( 0x100 + this.regS, value & 0xFF );
};


cpu6502.prototype.popStack = function( value ) {
	return this.mainboard.memory.read8( 0x100 + this.regS );
};


cpu6502.prototype.read16FromMemNoWrap = function( offsetAddress ) {

	this.incrementSubcycle();
	var ret = this.mainboard.memory.read8( offsetAddress ) & 0xFF;
	this.incrementSubcycle();
	var secondByte = this.mainboard.memory.read8( ( offsetAddress + 1 ) & 0xFFFF );
	ret |= ( ( secondByte & 0xFF ) << 8 );
	return ret & 0xFFFF;
};


cpu6502.prototype.read16FromMemWithWrap = function( offsetAddress ) {

	this.incrementSubcycle();
	var ret = this.mainboard.memory.read8( offsetAddress );
	var newoffset;
	if ( ( offsetAddress & 0xFF ) === 0xFF ) {
		newoffset = ( offsetAddress & 0xFF00 );
	} else {
		newoffset = offsetAddress + 1;
	}
	this.incrementSubcycle();
	var secondByte = this.mainboard.memory.read8( newoffset & 0xFFFF );
	ret |= ( ( secondByte & 0xFF ) << 8 );
	return ret & 0xFFFF;
};


cpu6502.prototype.calculateRelativeDifference = function( pc, b ) {
	var isSigned = (b & 0x80) > 0;
	if ( isSigned )
	{
		var inverse = ( ( b ^ 0xFF) + 1 ) & 0xFF;
		return pc - inverse;
	}
	else
		return pc + b;
};


cpu6502.prototype.execute = function() {
	this.subcycle = 0;
	if ( this.waitOneInstructionAfterCli )
		this.waitOneInstructionAfterCli = false;

	var opcode = this.mainboard.memory.read8( this.programCounter );
	var cyclesTaken = 0;
	if ( !this.useSwitchStatement ) {
		cyclesTaken = this.instructionSet[ opcode ]( this, this.mainboard.memory );
	} else {
		cyclesTaken = this.instructionSwitch( opcode, this, this.mainboard.memory );
	}
	if ( this.traceEnabled ) {
		this.doTrace();
	}
	this.subcycle = 0;
	return cyclesTaken;
};


cpu6502.prototype._hasProgramCounterBeenSeenBefore = function( pg ) {

	for ( var i=0; i<this.previousTraceProgramCounters.length; ++i ) {
		if ( this.previousTraceProgramCounters[ i ] === pg ) {
			return i;
		}
	}
	return -1;
};


cpu6502.prototype._doTrace = function() {

	var instructionData = Nes.cpuTrace;
	// check previous instructions for the same program counter
	var prevIndex = this.hasProgramCounterBeenSeenBefore( instructionData.programCounter );
	if ( prevIndex >= 0 ) {
		// if it's the same loop as the one that's already detected, don't report.
		if ( !this.inTraceLoop ) {
			this.inTraceLoop = true;
			this.traceLoopCount = 0;
		}
		this.traceLoopCount++;
	} else {
		if ( this.inTraceLoop ) {
			this.inTraceLoop = false;
			Nes.Trace.writeLine( Nes.traceCpuInstructions, "LOOP " + this.traceLoopCount + " TIMES" );
			this.traceLoopCount = 0;
		}
	}

	if ( !this.inTraceLoop ) {
		this.previousTraceProgramCounters[ this.previousTraceProgramCountersIndex ] = instructionData.programCounter;
		this.previousTraceProgramCountersIndex = ( this.previousTraceProgramCountersIndex + 1 ) & 0x1F;
		Nes.Trace.writeLine( Nes.traceCpuInstructions, Nes.formatCpuTraceString[ instructionData.opcode ]( instructionData ) );
		//$.extend( true, {}, instructionData );
	}
};


cpu6502.prototype.saveState = function() {

	var data = {};
	data.programCounter = this.programCounter;
	data.subcycle = this.subcycle;
	data.waitOneInstructionAfterCli = this.waitOneInstructionAfterCli;
	data.resetPending = this.resetPending;
	data.nmiPending = this.nmiPending;
	data.irqLineLow = this.irqLineLow;
	data.triggerNmiAfterNextInstruction = this.triggerNmiAfterNextInstruction;

	data._flagCarry = this.flagCarry;
	data._flagZero = this.flagZero;
	data._flagInterrupt = this.flagInterrupt;
	data._flagDecimal = this.flagDecimal;
	data._flagBreak = this.flagBreak;
	data._flagUnused = this.flagUnused;
	data._flagOverflow = this.flagOverflow;
	data._flagSign = this.flagSign;

	data.regS = this.regS;
	data.regX = this.regX;
	data.regY = this.regY;
	data.regA = this.regA;
	data.SAYHighByte = this.SAYHighByte;
	return data;
};


cpu6502.prototype.loadState = function( state ) {

	this.programCounter = state.programCounter;
	this.subcycle = state.subcycle;
	this.waitOneInstructionAfterCli = state.waitOneInstructionAfterCli;
	this.resetPending = state.resetPending;
	this.nmiPending = state.nmiPending;
	this.irqLineLow = state.irqLineLow;
	this.triggerNmiAfterNextInstruction = state.triggerNmiAfterNextInstruction;

	this.flagCarry = state._flagCarry;
	this.flagZero = state._flagZero;
	this.flagInterrupt = state._flagInterrupt;
	this.flagDecimal = state._flagDecimal;
	this.flagBreak = state._flagBreak;
	this.flagUnused = state._flagUnused;
	this.flagOverflow = state._flagOverflow;
	this.flagSign = state._flagSign;

	this.regS = state.regS;
	this.regX = state.regX;
	this.regY = state.regY;
	this.regA = state.regA;
	this.SAYHighByte = state.SAYHighByte;
};



Nes.cpu6502 = cpu6502;
