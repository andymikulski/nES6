

this.Nes = this.Nes || {};

//////////////////////////////////////////////////////////////////////////
// 7456 cycles after init, triggers quarter frame
// 14912 cycles after init, triggers quarter+half frames
// 22370 cycles after init, triggers quarter frame
// mode 0 - 29828 cycles after init, triggers quarter+half frames, checks IRQ
// 29829 and 30 - checks IRQ
// 37280 cycles after init, triggers quarter+half frames

var APU_BASE_UNIT = 15; // Number of ticks to use as the base unit MTC timer. This is the NTSC MTC per cpu
var APU_FRAME_COUNTER_INTERVAL = 7456 * APU_BASE_UNIT;
var APU_IRQ_FRAME_EVENT = 29828 * APU_BASE_UNIT;
var APU_FRAME_MODE0_TOTAL = 29830 * APU_BASE_UNIT;
var APU_FRAME_MODE1_TOTAL = 37282 * APU_BASE_UNIT;

// Note: Writing to $4017 with bit 7 set will immediately generate a clock for both the quarter frame and the half frame units, regardless of what the sequencer is doing.

// mode 0:    mode 1:       function
// ---------  -----------  -----------------------------
 // - - - f    - - - - -    IRQ (if bit 6 is clear)
 // - l - l    l - l - -    Length counter and sweep
 // e e e e    e e e e -    Envelope and linear counter


var ApuFrameCounter = function( mainboard ) {
	this.mainboard = mainboard;
	this.mode = 0;
	this.lastFrameStartMtc = 0;
	this.sequenceStage = 0; // either 0,1,2,3 or 4 (if mode 1 enabled) to indicate where in the sequence the frame counter is
	this.irqEventId = -1;
	this.interruptInProgress = false;
};


// This is used by the APU to determine when to decrement the length counters
// Doesn't use the main app's synchroniser as frame clocks don't effect cpu or ppu, but irq does
ApuFrameCounter.prototype.getNextFrameClock = function( ticks ) {

	// work out when next frame count is
	var nextFrameTicks = this.lastFrameStartMtc + ( ( this.sequenceStage + 1 ) * APU_FRAME_COUNTER_INTERVAL );
	if ( nextFrameTicks >= COLOUR_ENCODING_FRAME_MTC ) {
		nextFrameTicks -= COLOUR_ENCODING_FRAME_MTC;
	}
	return nextFrameTicks;
};


ApuFrameCounter.prototype._getNextIrqClock = function( ticks ) {

	var nextIrqTicks = this.lastFrameStartMtc + APU_IRQ_FRAME_EVENT;
	if ( nextIrqTicks >= COLOUR_ENCODING_FRAME_MTC ) {
		nextIrqTicks -= COLOUR_ENCODING_FRAME_MTC;
	}
	return nextIrqTicks;
};


ApuFrameCounter.prototype.acknowledgeClock = function( ticks ) {
	this.sequenceStage++;
	var endOfApuFrame = false;
	var frameSize = 0;
	switch ( this.mode ) {
		case 0:
			endOfApuFrame = this.sequenceStage >= 4;
			frameSize = APU_FRAME_MODE0_TOTAL;
			break;
		case 1:
			endOfApuFrame = this.sequenceStage >= 5;
			frameSize = APU_FRAME_MODE1_TOTAL;
			break;
	}
	if ( endOfApuFrame ) {
		// end of the apu frame - the apu frame is slightly longer than simply the clock interval * sequence count
		this.sequenceStage = 0;
		this.lastFrameStartMtc += frameSize;
		if ( this.lastFrameStartMtc >= COLOUR_ENCODING_FRAME_MTC ) {
			this.lastFrameStartMtc -= COLOUR_ENCODING_FRAME_MTC;
		}
		// Update IRQ time
		this.mainboard.synchroniser.changeEventTime( this.irqEventId, this.getNextIrqClock() );
	}
};


ApuFrameCounter.prototype.onEndFrame = function() {

};


ApuFrameCounter.prototype.reset = function() {
	var that = this;
	this.irqEventId = this.mainboard.synchroniser.addEvent( 'apu irq', -1, function( eventTime ) { that._eventApuIrq( eventTime ); } );
};


ApuFrameCounter.prototype._eventApuIrq = function( eventTime ) {
	if ( !this.interruptInProgress ) {
		this.interruptInProgress = true;
		this.mainboard.cpu.holdIrqLineLow( true );
	}
};


ApuFrameCounter.prototype.acknowledgeIrq = function() {
	if ( this.interruptInProgress ) {
		this.mainboard.cpu.holdIrqLineLow( false );
		this.interruptInProgress = false;
	}
};


Nes.ApuFrameCounter = ApuFrameCounter;

