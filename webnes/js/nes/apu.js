

this.Nes = this.Nes || {};

///////////////////////////////////////////////////////////////////////////////////////////////


var Apu = function( mainboard ) {

	var that = this;

	this.mainboard = mainboard;
	this.mainboard.connect( 'reset', function( cold ) { that._onReset( cold ); } );

	this.enabled = true;
	this.soundRate = 44100;
	this.outBufferSize = 4096;

	try {
		this.renderer = new Gui.WebAudioRenderer( this.outBufferSize );
		this.soundRate = this.renderer.getSampleRate();
		//this.triangle = new ApuWaveOscillator( 'triangle' );
		// noise
		// dmc
	}
	catch ( err ) {
		this.renderer = null;
		this.enabled = false;
		console.log( "WebAudio unsupported in this browser. Sound will be disabled..." );
	}

	this.frameCounter = new Nes.ApuFrameCounter( this.mainboard );
	this.buffers = [];
	this.square1 = new ApuSquareWaveOscillator( this.addBuffer() );
	this.square2 = new ApuSquareWaveOscillator( this.addBuffer() );

	//this.squareTest = new Nes.SquareWaveTester();
};


Apu.prototype._addBuffer = function() {
	var buffer = new ApuOutputBuffer( this.renderer.createBuffer( this.outBufferSize ), this.outBufferSize, this.soundRate );
	this.buffers.push( buffer );
	return buffer;
};


Apu.prototype.enableSound = function( enable ) {
	this.enabled = enable;
};


Apu.prototype.soundEnabled = function() {
	return this.enabled && this.soundSupported();
};


Apu.prototype.soundSupported = function() {
	return !!this.renderer;
};


Apu.prototype.setVolume = function( val ) {
	if ( this.renderer ) {
		this.renderer.setVolume( val );
	}
};


Apu.prototype._onReset = function( cold ) {

	this.frameCounter.reset();
};


Apu.prototype.readFromRegister = function( offset ) {
	var ret = 0;

	return ret;
};


Apu.prototype.writeToRegister = function( offset, data ) {

	switch ( offset ) {
	case 0x4000: // square 1
		this.square1.writeEnvelope( data );
		break;
	case 0x4001:
		this.square1.writeSweep( data );
		break;
	case 0x4002:
		this.square1.writeTimer( data );
		break;
	case 0x4003:
		this.square1.writeLengthCounter( data );
		break;
	case 0x4004: // square 2
		this.square2.writeEnvelope( data );
		break;
	case 0x4005:
		this.square2.writeSweep( data );
		break;
	case 0x4006:
		this.square2.writeTimer( data );
		break;
	case 0x4007:
		this.square2.writeLengthCounter( data );
		break;

	// The status register is used to enable and disable individual channels,
	// control the DMC, and can read the status of length counters and APU interrupts.
	case 0x4015:
		this.square1.enable( ( data & 0x1 ) > 0 );
		this.square2.enable( ( data & 0x2 ) > 0 );
		//this.triangle.enable( ( data & 0x4 ) > 0 );
		//this.noise.enable( ( data & 0x8 ) > 0 );
		//this.dmc.enable( ( data & 0x10 ) > 0 );
		break;
	}

};


Apu.prototype.synchronise = function( startTicks, endTicks ) {

	if ( this.enabled ) {

		while ( startTicks < endTicks ) {
			var nextFrameTick = this.frameCounter.getNextFrameClock( startTicks );

			var syncEnd = Math.min( endTicks, nextFrameTick );

			this.square1.synchronise( startTicks, syncEnd );
			this.square2.synchronise( startTicks, syncEnd );

			if ( syncEnd === nextFrameTick ) {
				this.square1.decrementLengthCounter();
				this.square2.decrementLengthCounter();
				this.frameCounter.acknowledgeClock( nextFrameTick );
			}

			startTicks = syncEnd;
		}
	}
};


Apu.prototype.onEndFrame = function( cpuMtc ) {

//	this.squareTest.onEndFrame();
	this.frameCounter.onEndFrame();

	if ( this.renderer && this.enabled ) {

		for ( var index=0; index<this.buffers.length; ++index ) {
			var buf = this.buffers[index];
			buf.commit();
			buf.clear();
		}

		// //	if ( g_options->SoundEnabled && g_options->ApplicationSpeed == 0 ) // dont play sound if disabled or not running at normal speed
		// if ( samplesAvailable >= APUOutBufferSize ) {
			// //write samples directly to renderer's buffer
			// var buffer = this.renderer.lockBuffer();
			// if ( this.justRenabled > 0 ) {
				// for ( var i=0; i<APUOutBufferSize; ++i ) {
					// buffer[i] = 0;
				// }
				// this.justRenabled--;
			// } else {
				// this.buf.read_samples( buffer, APUOutBufferSize );
			// }
		// //	this.writer.write( buffer, count );
			// this.renderer.unlockBuffer();
		// }
	}
};



Apu.prototype.saveState = function() {
	var data = {};
	return data;
};


Apu.prototype.loadState = function( state ) {

};


Nes.Apu = Apu;

