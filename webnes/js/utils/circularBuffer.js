


this.Nes = this.Nes || {};

(function(){
	"use strict";

	// autoExtendsMode: 'none', 'exact', 'double'
	var CircularBuffer = function( bufferSize, autoExtendsMode, arrayBufferType ) {

		this.arrayBufferType = arrayBufferType || Int16Array;
		this.autoExtendsMode = autoExtendsMode || 'double';

		this.buffer = null;
		this.readIndex = 0;
		this.writeIndex = 0;
		this.createBufferIfRequired( bufferSize || 65536 );
	};


	CircularBuffer.prototype.sizeOccupied = function() {
		if ( this.readIndex <= this.writeIndex ) {
			return this.writeIndex - this.readIndex;
		} else {
			return ( this.buffer.length - this.readIndex ) + this.writeIndex;
		}
	};


	CircularBuffer.prototype.sizeRemaining = function() {
		return this.buffer.length - this.sizeOccupied();
	};


	CircularBuffer.prototype._createBufferIfRequired = function( spaceRequired ) {

		var bufferSize;
		var recreate = false;
		if ( !this.buffer ) {
			bufferSize = spaceRequired;
			recreate = true;
		} else {
			var minRequired = spaceRequired + this.sizeOccupied();
			var needsNewBuffer = minRequired > this.buffer.length;
			if ( needsNewBuffer ) {
				if ( this.autoExtendsMode === 'none' ) {
					throw new Error( "Buffer has overrun, required size " + minRequired + " current size " + this.buffer.length );
				} else if ( this.autoExtendsMode === 'exact' ) {
					recreate = true;
					bufferSize = minRequired;
				} else { // defaults to 'double'
					recreate = true;
					bufferSize = this.buffer.length;
					do {
						bufferSize = bufferSize * 2;
					} while ( bufferSize < minRequired );
				}
			}
		}

		if ( recreate ) {
			var newBuffer = new this.arrayBufferType( bufferSize );
			if ( this.buffer ) {
				// copy existing buffer data into newly created buffer
				if ( this.readIndex < this.writeIndex ) {
					var dataLen = this.writeIndex - this.readIndex;
					newBuffer.set( this.buffer.subarray( this.readIndex, this.readIndex + dataLen ), 0 );
					this.readIndex = 0;
					this.writeIndex = dataLen;
				} else if ( this.readIndex > this.writeIndex ) {
					var endOfBufferDataLength = this.buffer.length - this.readIndex;
					newBuffer.set( this.buffer.subarray( this.readIndex ), 0 );
					newBuffer.set( this.buffer.subarray( 0, this.writeIndex ), endOfBufferDataLength );
					this.writeIndex = this.writeIndex + endOfBufferDataLength;
					this.readIndex = 0;
				}
			}
			this.buffer = newBuffer;
		}
	};


	CircularBuffer.prototype._isArrayBuffer = function( buffer ) {

		return buffer instanceof this.arrayBufferType;
	};


	CircularBuffer.prototype._copyArray = function( src, srcIndex, dest, destIndex, length ) {

		if ( this.isArrayBuffer( src ) && this.isArrayBuffer( dest ) ) {
			dest.set( src.subarray( srcIndex, srcIndex + length ), destIndex );
		} else {
			for ( var i=0; i<length; ++i ) {
				var d = src[ srcIndex + i ];
				dest[ destIndex + i ] = d;
			//	dest[ destIndex + i ] = ( ( d & 0xFF ) << 8 ) | ( ( d & 0xFF00 ) >> 8 );
			}
		}
	};


	CircularBuffer.prototype.push = function( arrayBuffer, length, sourceIndex ) {
		sourceIndex = sourceIndex || 0;

		this.createBufferIfRequired( length );
		if ( this.writeIndex >= this.readIndex ) {
			var endOfBufferAvailable = this.buffer.length - this.writeIndex;
			if ( endOfBufferAvailable >= length ) {
				this.copyArray( arrayBuffer, sourceIndex, this.buffer, this.writeIndex, length );
			//	console.log( "push1 this.writeIndex=" + this.writeIndex );
				this.writeIndex += length;
			} else {
				var remainingData = length - endOfBufferAvailable;
				this.copyArray( arrayBuffer, sourceIndex, this.buffer, this.writeIndex, endOfBufferAvailable );
				this.copyArray( arrayBuffer, sourceIndex + endOfBufferAvailable, this.buffer, 0, remainingData );
			//	console.log( "push2 this.writeIndex=" + this.writeIndex );
				this.writeIndex = remainingData;
			}
		} else {
			this.copyArray( arrayBuffer, sourceIndex, this.buffer, this.writeIndex, length );
		//	console.log( "push3 this.writeIndex=" + this.writeIndex );
			this.writeIndex += length;
		}
	};


	CircularBuffer.prototype.pop = function( arrayBuffer, length, destIndex ) {
		destIndex = destIndex || 0;

		var readCount = Math.min( length, this.sizeOccupied() );

		if ( readCount > 0 ) {
			//console.log( "readCount wi=" + this.writeIndex + " ri=" + this.readIndex );
			if ( this.writeIndex >= this.readIndex ) {
				this.copyArray( this.buffer, this.readIndex, arrayBuffer, destIndex, readCount );
			//	console.log( "1 readindex=" + this.readIndex );
				this.readIndex += readCount;
			} else {
				var endOfBufferAvailable = this.buffer.length - this.readIndex;
				if ( endOfBufferAvailable >= readCount ) {
					this.copyArray( this.buffer, this.readIndex, arrayBuffer, destIndex, readCount );
			//		console.log( "2 readindex=" + this.readIndex );
					this.readIndex += readCount;
				} else {
					var remainingData = readCount - endOfBufferAvailable;
					this.copyArray( this.buffer, this.readIndex, arrayBuffer, destIndex, endOfBufferAvailable );
					this.copyArray( this.buffer, this.readIndex + endOfBufferAvailable, arrayBuffer, destIndex + endOfBufferAvailable, remainingData );
			//		console.log( "3 readindex=" + this.readIndex );
					this.readIndex = remainingData;
				}
			}
		}

		return readCount;
	};


	CircularBuffer.prototype.setElement = function( offset, data ) {

		this.buffer[ ( this.writeIndex + offset ) % this.buffer.length ] = data;
	};


	CircularBuffer.prototype.getElement = function( offset ) {

		return this.buffer[ ( this.readIndex + offset ) % this.buffer.length ];
	};


	CircularBuffer.prototype.reset = function() {

		this.writeIndex = 0;
		this.readIndex = 0;
	};


	CircularBuffer.prototype.advanceRead = function( amount ) {

		amount = Math.min( amount, this.sizeOccupied() );
		this.readIndex = ( this.readIndex + amount ) % this.buffer.length;
	};


	Nes.CircularBuffer = CircularBuffer;

}());
