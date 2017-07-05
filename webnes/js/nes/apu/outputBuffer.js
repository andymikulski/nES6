

this.Nes = this.Nes || {};


// You aren't handling odd clock jitter properly. It's really simple, if the APU is on an odd clock on the $4017 write, act as if the write was one clock later.

var ApuOutputBuffer = function( webAudioBuffer, size, sampleRate ) {

	this.buffer = webAudioBuffer;
	this.array = new Float32Array( size );
	this.sampleRate = sampleRate;
	this.framesWorthOfDataSize = Math.floor( this.sampleRate / COLOUR_ENCODING_REFRESHRATE ); // sample rate is number of samples consumed in a second.
	if ( this.array.length < this.framesWorthOfDataSize ) {
		throw new Error( "Could not contain a frames worth of audio data in the provided audio buffer!" );
	}
	this.clear();
};


ApuOutputBuffer.prototype._ticksToBufferPosition = function( ticks ) {

	var pos = Math.floor( ( ticks / COLOUR_ENCODING_FRAME_MTC ) * this.framesWorthOfDataSize );
	return pos;
};


ApuOutputBuffer.prototype.clear = function() {

	for ( var i=0; i<this.array.length; ++i ) {
		this.array[i] = 0;
	}
};


ApuOutputBuffer.prototype.write = function( startTicks, lengthTicks, val ) {

	var startBytes = this.ticksToBufferPosition( startTicks );
	var endBytes = Math.min( this.array.length, this.ticksToBufferPosition( startTicks + lengthTicks ) );
	for ( var i=startBytes; i<endBytes; ++i ) {
		this.array[ i ] = val;
	}
};


ApuOutputBuffer.prototype.commit = function() {

	// commit to web audio api
	var dest = this.buffer.lockBuffer();
	for ( var i=0; i<this.array.length; ++i ) {
		dest[i] = this.array[i];
	}
	this.buffer.unlockBuffer();
};

Nes.ApuOutputBuffer = ApuOutputBuffer;
