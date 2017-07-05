/* Copyright (C) 2003-2005 Shay Green. This module is free software; you
can redistribute it and/or modify it under the terms of the GNU Lesser
General Public License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version. This
module is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for
more details. You should have received a copy of the GNU Lesser General
Public License along with this module; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA */

this.Nes = this.Nes || {};


(function(){
	"use strict";

	var header_size = 0x2C;
	var bufferSize = 32768 * 200;
	var sampleSize = 2; // 16 bit samples


	var Wave_Writer = function( sampleRate ) {

		this.buffer = new Int16Array( bufferSize );
		this.sampleCount = 0;
		this.active = false;
		this.sample_rate = sampleRate || 44100;
		this.chan_count = 1;
		this.header = new Uint8Array( header_size );
	};


	Wave_Writer.prototype.activate = function() {

		this.active = true;
	};


	Wave_Writer.prototype.write = function( dataArray, count ) {

		if ( this.active ) {
			var toCopy = Math.min( count, bufferSize - this.sampleCount );

			var dataIndex = 0;
			for ( var i=0; i<toCopy; ++i ) {
				// In original code they swapped low/high bytes - not required for this (for some reason??)
				var d = dataArray[ i ];
				//this.buffer[ this.sampleCount++ ] = ( ( d & 0xFF ) << 8 ) | ( ( d & 0xFF00 ) >> 8 );
				this.buffer[ this.sampleCount++ ] = d;
			}

			if ( this.sampleCount >= bufferSize ) {
				this.createFile();
				this.sampleCount = 0;
				this.active = false;
			}
		}
	};


	Wave_Writer.prototype._buildHeader = function( sampleCount ) {
		var ds = sampleCount * sampleSize;
		var rs = header_size - 8 + ds;
		var frame_size = this.chan_count * sampleSize;
		var bps = this.sample_rate * frame_size;

		var bufIndex = 0;
		var writeToBuffer = function( buffer, array ) {
			for ( var i=0; i<array.length; ++i ) {
				buffer[ bufIndex++ ] = array[i];
			}
		};

		writeToBuffer( this.header, [ 82, 73, 70, 70 ] ); // RIFF
		writeToBuffer( this.header, [ rs, rs>>8, rs>>16, rs>>24 ] ); // length of rest of file
		writeToBuffer( this.header, [ 87, 65, 86, 69, 102, 109, 116, 32 ] ); // WAVE fmt [space]
		writeToBuffer( this.header, [ 0x10, 0, 0, 0 ] ); // size of fmt chunk
		writeToBuffer( this.header, [ 1, 0 ] ); // uncompressed format
		writeToBuffer( this.header, [ this.chan_count, 0 ] ); // channel count
		writeToBuffer( this.header, [ this.sample_rate, this.sample_rate >> 8, this.sample_rate >> 16, this.sample_rate >> 24 ] ); // sample rate
		writeToBuffer( this.header, [ bps, bps >> 8, bps >> 16, bps >> 24 ] ); // bytes per second
		writeToBuffer( this.header, [ frame_size, 0 ] ); // bytes per sample frame
		writeToBuffer( this.header, [ sampleSize * 8, 0 ] ); // bits per sample
		writeToBuffer( this.header, [ 100, 97, 116, 97 ] ); // 'd','a','t','a',
		writeToBuffer( this.header, [ ds, ds>>8, ds>>16, ds>>24 ] ); // size of sample data
	};


	Wave_Writer.prototype._createFile = function() {

		console.log( "Saving sound.wav..." );
		this.buildHeader( this.sampleCount );
		var blob = new Blob( [ this.header, this.buffer ], { type: "application/octet-stream" } );
		saveAs( blob, "sound.wav" );
	};


	Nes.Wave_Writer = Wave_Writer;
}());

