

this.Nes = this.Nes || {};


//////////////////////////////////////////////////////////////

var lengthCounterTable = [
	0x0A, 0xFE, 0x14, 0x02, 0x28, 0x04, 0x50, 0x06,
	0xA0, 0x08, 0x3C, 0x0A, 0x0E, 0x0C, 0x1A, 0x0E,
	0x0C, 0x10, 0x18, 0x12, 0x30, 0x14, 0x60, 0x16,
	0xC0, 0x18, 0x48, 0x1A, 0x10, 0x1C, 0x20, 0x1E
];


var ApuSquareWaveOscillator = function( buffer ) {

	this.buffer = buffer;
	this.enabled = false;
	this.timer = 0;
	this.lengthCounter = 0;
	this.lengthCounterEnabled = true;
	this.useConstantVolume = false;
	this.volumeValue = 0;
	this.envelope = new Nes.ApuEnvelope();

	this.delay = 0;
};

ApuSquareWaveOscillator.prototype.decrementLengthCounter = function() {
	if ( this.lengthCounter > 0 && this.lengthCounterEnabled ) {
		this.lengthCounter--;
		if ( this.lengthCounter === 0 ) {
			// silence
		}
	}
};

ApuSquareWaveOscillator.prototype._getVolume = function() {
	if ( this.lengthCounter > 0 && this.timer >= 8 ) {
		if ( this.useConstantVolume ) {
			return this.volumeValue;
		} else {
			return this.envelope.getEnvelopeVolume();
		}
	}
	return 0;
};

ApuSquareWaveOscillator.prototype.enable = function( enabled ) {
	this.enabled = enabled;
	this.lengthCounter = 0; // set length counter to zero on enabled/disabled
	// disable irq flag (?)
};

ApuSquareWaveOscillator.prototype.writeEnvelope = function( data ) {
	// DDLC VVVV 	Duty (D), envelope loop / length counter halt (L), constant volume (C), volume/envelope (V)
	this.lengthCounterEnabled = ( data & 0x20 ) === 0;
	this.useConstantVolume = ( data & 0x10 ) === 0x10;
	this.volumeValue = data & 0xF;
};

ApuSquareWaveOscillator.prototype.writeSweep = function( data ) {
	// EPPP NSSS 	Sweep unit: enabled (E), period (P), negate (N), shift (S)
};

ApuSquareWaveOscillator.prototype.writeTimer = function( data ) {
	// TTTT TTTT	Timer low (T) (bottom 8 bits)
	this.timer = ( this.timer & 0x700 ) | data;
};

ApuSquareWaveOscillator.prototype.writeLengthCounter = function( data ) {
	// LLLL LTTT 	Length counter load (L), timer high (T)
	this.timer = ( this.timer & 0xFF ) | ( ( data & 0x7 ) << 8 );
	this.lengthCounter = lengthCounterTable[ (data >> 3) & 0x1f ];
	//  (also resets duty and starts envelope)
	this.envelope.reloadOnNextClock();
};


ApuSquareWaveOscillator.prototype._4bitVolumeToBufferValue = function( vol ) {
	return ( vol / 16 );// * 128.0;
};


ApuSquareWaveOscillator.prototype.synchronise = function( startTicks, endTicks ) {

	if ( !this.enabled ) {
		return;
	}

	var volume = this.getVolume();
	var period = this.timer;

	// TODO: apply sweep shift
	var offset = 0;

	// OPTIMISE: When silent, dont do loop - just calculate next phase
	var timer_period = ( period + 1 ) * 16 * COLOUR_ENCODING_MTC_PER_CPU; // APU cycle is 2* cpu cycle - pulse timer period is 16* cpu cycle due to sequencer having 8 steps
	var timeUp = Math.floor( timer_period / 2 ); // TODO: implement correct duty cycle: this is 50/50 here
	var timeDown = timer_period - timeUp;
	var mtc = startTicks + this.delay;
	var delta = this.4bitVolumeToBufferValue( volume );
	for ( ; mtc<endTicks; mtc += timer_period ) {

		if ( this.lengthCounter === 0 || volume === 0 || ( period + offset ) >= 0x800 ) {
			// silent
		} else {
			this.buffer.write( mtc, timeUp, delta );
			this.buffer.write( mtc + timeUp, timeDown, -delta );
		}
		//this.decrementLengthCounter();
		//this.decrementLengthCounter();
	}
	this.delay = mtc - endTicks;
};


Nes.ApuSquareWaveOscillator = ApuSquareWaveOscillator;

