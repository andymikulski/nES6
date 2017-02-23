

this.Nes = this.Nes || {};

//////////////////////////////////////////////////////////////////////////


var ApuEnvelope = function() {
	this._envelopeCounter = 0; // number of ticks every time the envelope volume is decremented.
	this._envelopeVolume = 0;
	this._doEnvelopeReloadOnNextClock = false;
};


ApuEnvelope.prototype.reset = function() {
	this._envelopeCounter = 0;
	this._envelopeVolume = 0;
	this._doEnvelopeReloadOnNextClock = false;
};


ApuEnvelope.prototype.reloadOnNextClock = function() {
	this._doEnvelopeReloadOnNextClock = true;
};

// Called every time the envelope is clocked by the divider
ApuEnvelope.prototype.decrementCounter = function( envelopeNotLooped ) {

	if ( this._doEnvelopeReloadOnNextClock ) {
		this._doEnvelopeReloadOnNextClock = false;
		this._envelopeCounter = this._volumeValue;
		this._envelopeVolume = 15;
	} else {
		this._envelopeCounter--;
		if ( this._envelopeCounter < 0 ) {
			this._envelopeCounter = this._volumeValue;
			if ( this._envelopeVolume > 0 || !envelopeNotLooped ) {
				this._envelopeVolume--;
				if ( this._envelopeVolume < 0 ) {
					this._envelopeVolume = 15;
				}
			}
		}
	}
};


ApuEnvelope.prototype.getEnvelopeVolume = function() {
	return this._envelopeVolume;
};


Nes.ApuEnvelope = ApuEnvelope;

