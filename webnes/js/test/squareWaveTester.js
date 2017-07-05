

this.Nes = this.Nes || {};

///////////////////////////////////////////////////////////////////////////////////////////////


var SquareWaveTester = function( mainboard ) {

	var that = this;

	this.enabled = true;
	this.soundRate = 44100;
	this.outBufferSize = 4096;

	try {
		this.renderer = new Gui.WebAudioRenderer( this.outBufferSize );
		this.soundRate = this.renderer.getSampleRate();
	}
	catch ( err ) {
		this.renderer = null;
		this.enabled = false;
		console.log( "WebAudio unsupported in this browser. Sound will be disabled..." );
	}

	this.buffers = [];
	this.square1 = new ApuSquareWaveOscillator( this.addBuffer() );
	this.square1.enable( true );

	this.square1.writeTimer( 128 );
	this.square1.writeLengthCounter( 0x20 );  // writes value of 4 to length counter
	this.square1.writeEnvelope( 0x1F ); // constant volume mode, maximum volume
};


SquareWaveTester.prototype._addBuffer = function() {
	var buffer = new ApuOutputBuffer( this.renderer.createBuffer( this.outBufferSize ), this.outBufferSize, this.soundRate );
	this.buffers.push( buffer );
	return buffer;
};


SquareWaveTester.prototype.synchronise = function( startTicks, endTicks ) {

	if ( this.enabled ) {
		this.square1.synchronise( startTicks, endTicks );
	}
};


SquareWaveTester.prototype.onEndFrame = function( cpuMtc ) {

	if ( this.renderer && this.enabled ) {
		// run a frames worth of sound processing
		this.synchronise( 0, COLOUR_ENCODING_FRAME_MTC );

		for ( var index=0; index<this.buffers.length; ++index ) {
			var buf = this.buffers[index];
			buf.commit();
			buf.clear();
		}
	}
};


Nes.SquareWaveTester = SquareWaveTester;

