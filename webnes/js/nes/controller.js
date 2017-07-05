

this.Nes = this.Nes || {};

"use strict";

////////////////////

var joypad = function() {
	this.currentState = 0;
	this.strobedState = 0;
	this.strobeByte = 0;
	this.readCount = 0;
};


joypad.prototype.writeToRegister = function( offset, data ) {

	var firstBit = data & 1;
	if ( this.strobeByte === 1 || firstBit === 1 ) {
		this.strobeByte = firstBit | 0;
		this.strobedState = this.currentState;
		this.readCount = 0;
	}
};


joypad.prototype.readFromRegister = function( offset ) {

	var ret = 0;
	if ( this.strobeByte === 1 ) {
		this.strobedState = this.currentState;
		this.readCount = 0;
		ret = ( this.strobedState & 1 ) | 0;
	} else {
		ret = ( ( this.strobedState >> this.readCount ) & 1 ) | 0;
		this.readCount++;
		ret |= 0x40;
	}
	return ret | 0;
};


joypad.prototype._getDuplicateMask = function( buttonIndex ) {

	// disallow pressing up+down and left+right at the same time - always keep the button that is already pressed
	switch ( buttonIndex ) {
		case 4: // UP
			return 0xDF; // ~( 0x20 );
		case 5: // DOWN
			return 0xEF; // ~( 0x10 );
		case 6: // LEFT
			return 0x7F; // ~( 0x80 );
		case 7: // RIGHT
			return 0xBF; // ~( 0x40 );
	}
	return 0xFF;
};


joypad.prototype.pressButton = function( buttonIndex, pressed ) {

	if ( pressed ) {
		this.currentState |= ( 1 << buttonIndex );
		this.currentState &= this.getDuplicateMask( buttonIndex ); // this prevents up+down and left+right being pressed
	} else {
		this.currentState &= 0xFF ^ ( 1 << buttonIndex );
	}
};


joypad.prototype.saveState = function() {
	var data = {};
	data._currentState = this.currentState;
	data._strobedState = this.strobedState;
	data._strobeByte = this.strobeByte;
	data._readCount = this.readCount;
	return data;
};


joypad.prototype.loadState = function( state ) {
	this.currentState = state._currentState;
	this.strobedState = state._strobedState;
	this.readCount = state._readCount;
	this.strobeByte = state._strobeByte;
};

Nes.joypad = joypad;






var inputdevicebus = function() {
	//this.devices = new Array( 2 );

	this.j1 = new Nes.joypad();
	this.j2 = new Nes.joypad();
};


inputdevicebus.prototype.getJoypad = function( index ) {

	switch ( index ) {
	case 0:
		return this.j1;
	case 1:
		return this.j2;
	default:
		return null;
	}
};


inputdevicebus.prototype.writeToRegister = function( offset, data ) {
	switch ( offset )
	{
	case 0x4016:
		this.j1.writeToRegister( offset, data );
		break;
	case 0x4017:
		this.j2.writeToRegister( offset, data );
		break;
	}
};


inputdevicebus.prototype.readFromRegister = function( offset ) {
	var ret = 0;
	switch ( offset )
	{
	case 0x4016:
		ret = this.j1.readFromRegister( offset ) | 0;
		break;
	case 0x4017:
		ret = this.j2.readFromRegister( offset ) | 0;
		break;
	}
	return ret;
};


Nes.inputdevicebus = inputdevicebus;

