

this.Gui = this.Gui || {};

"use strict";


var WebAudioBuffer = function( audioContext, masterVolNode, size ) {

	this.locked = false;
	this.audioContext = audioContext;

	this.audioNode = null;
	this.gainNode = this.audioContext['createGain']();
	this.gainNode['connect']( masterVolNode );

	this.audioBuffer = this.audioContext['createBuffer']( 1, size, this.audioContext['sampleRate'] );

};


WebAudioBuffer.prototype.lockBuffer = function() {

	this.locked = true;
	return this.audioBuffer['getChannelData']( 0 );
};


WebAudioBuffer.prototype.unlockBuffer = function() {

	this.locked = false;

	// Alternative method using audio node buffer instead of onaudioprocess
	if ( this.audioNode ) {
		 this.audioNode['disconnect']();
		 this.audioNode = null;
	}
	this.audioNode = this.audioContext['createBufferSource']();
	this.audioNode['buffer'] = this.audioBuffer;

	this.audioNode['connect'](this.gainNode);
	this.audioNode['start'](0);
};


////////////////////////////////////////////////////////////////////////////////////////


var WebAudioRenderer = function( bufferSize, sampleRate ) {

	window.AudioContext = window.AudioContext || window.webkitAudioContext;
	if ( window.AudioContext === undefined ) {
		throw new Error( "WebAudio not supported in this browser" );
	}
	this.audioContext = new window.AudioContext();
	this.gainNode = this.audioContext['createGain']();
	this.gainNode['connect']( this.audioContext['destination'] );
};


WebAudioRenderer.prototype.setVolume = function( val ) {
	if ( this.gainNode ) {
		this.gainNode['gain']['value'] = val / 100;
	}
};


WebAudioRenderer.prototype.getSampleRate = function() {
	return this.audioContext['sampleRate'];
};


WebAudioRenderer.prototype.createBuffer = function( size ) {
	return new WebAudioBuffer( this.audioContext, this.gainNode, size );
};


Gui.WebAudioRenderer = WebAudioRenderer;

