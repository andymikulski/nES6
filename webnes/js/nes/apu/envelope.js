

this.Nes = this.Nes || {};

//////////////////////////////////////////////////////////////////////////


var ApuEnvelope = function() {
	this.envelopeCounter = 0; // number of ticks every time the envelope volume is decremented.
	this.envelopeVolume = 0;
	this.doEnvelopeReloadOnNextClock = false;
};


ApuEnvelope.prototype.reset = function() {
	this.envelopeCounter = 0;
	this.envelopeVolume = 0;
	this.doEnvelopeReloadOnNextClock = false;
};


ApuEnvelope.prototype.reloadOnNextClock = function() {
	this.doEnvelopeReloadOnNextClock = true;
};

// Called every time the envelope is clocked by the divider
ApuEnvelope.prototype.decrementCounter = function( envelopeNotLooped ) {

	if ( this.doEnvelopeReloadOnNextClock ) {
		this.doEnvelopeReloadOnNextClock = false;
		this.envelopeCounter = this.volumeValue;
		this.envelopeVolume = 15;
	} else {
		this.envelopeCounter--;
		if ( this.envelopeCounter < 0 ) {
			this.envelopeCounter = this.volumeValue;
			if ( this.envelopeVolume > 0 || !envelopeNotLooped ) {
				this.envelopeVolume--;
				if ( this.envelopeVolume < 0 ) {
					this.envelopeVolume = 15;
				}
			}
		}
	}
};


ApuEnvelope.prototype.getEnvelopeVolume = function() {
	return this.envelopeVolume;
};


Nes.ApuEnvelope = ApuEnvelope;

