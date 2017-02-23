/* Estimated number of games with mapper (other mappers had <10 games)
Mapper 004: 569
Mapper 001: 481
Mapper 000: 260
Mapper 002: 200
Mapper 003: 145
Mapper 007: 56
Mapper 011: 35
Mapper 019: 32
Mapper 016: 26
Mapper 099: 25
Mapper 005: 24
Mapper 018: 16
Mapper 066: 16
Mapper 033: 15
Mapper 079: 15
Mapper 045: 14
Mapper 071: 14
Mapper 113: 12
Mapper 245: 11
Mapper 023: 11
Mapper 069: 11
*/

import {
	uintArrayToString,
	stringToUintArray,
} from '../../utils/serialisation';

export class BaseMapper {
	constructor( mainboard, mirroringMethod ) {

		this.mainboard = mainboard;
		this.mirroringMethod = mirroringMethod;
		this.prgPagesMap = new Int32Array( 4 );
		this._prgData = null;
		this._prgPageCount = 0;

		this.chrPages = [];
		this.chrPagesMap = new Int32Array( 8 );
		this._chrData = null;
		this._chrPageCount = 0;
		this._usingChrVram = false;

		this._gameGenieActive = false;
		this._gameGeniePokes = {};

		this.sram = new Int32Array( 0x2000 );
		this.expansionRam = new Int32Array( 0x1FE0 );
	}


	onEndFrame() {
	}


	getNextEvent() {
		return -1;
	}


	synchronise( startTicks, endTicks ) {
	}

	// MMC3 specific functions
	spriteScreenEnabledUpdate( spriteEnabled, screenEnabled ) { };
	renderingEnabledChanged( enabled ) { };


	setPrgData( array, prg8kPageCount ) {

		this._prgData = array;
		this._prgPageCount = prg8kPageCount;
	}


	setChrData( array, chr1kPageCount ) {

		this._chrData = array;
		this._chrPageCount = chr1kPageCount;
	}


	////// PRG switching


	get1kChrBankCount() {
		return this._chrPageCount;
	}


	get2kChrBankCount() {
		return this._chrPageCount >> 1; // Math.floor( this.chrPages.length / 2 );
	}


	get4kChrBankCount() {
		return this._chrPageCount >> 2; // Math.floor( this.chrPages.length / 4 );
	}


	get8kChrBankCount() {
		return this._chrPageCount >> 3; // Math.floor( this.chrPages.length / 8 );
	}


	get8kPrgBankCount() {
		return this._prgPageCount;
	}


	get16kPrgBankCount() {
		return this._prgPageCount >> 1; // Math.floor( this.prgPages.length / 2 );
	}


	get32kPrgBankCount() {
		return this._prgPageCount >> 2; // Math.floor( this.prgPages.length / 4 );
	}


	switch8kPrgBank( id, pos ) {
		//Nes.Trace.writeLine( 'mapper', 'switch8kPrgBank:' + id );
		this.setPrgPage( id % this._prgPageCount, pos );
	}


	switch16kPrgBank( id, low ) {
		if ( this.get16kPrgBankCount() > 0 )
		{
			//Nes.Trace.writeLine( 'mapper', 'switch16kPrgBank:' + id );
			var aid = ( id * 2 ) % this._prgPageCount;
			for ( var i=0; i<2; ++i )
				this.setPrgPage( aid + i, i + (low ? 0 : 2) );
		}
	}


	switch32kPrgBank( id ) {
		if ( this.get32kPrgBankCount() > 0 )
		{
			//Nes.Trace.writeLine( 'mapper', 'switch32kPrgBank:' + id );
			var aid = ( id * 4 ) % this._prgPageCount;
			for ( var i=0; i<4; ++i )
				this.setPrgPage( aid + i, i );
		}
	}


	setPrgPage( id, pos ) {
		if ( this.prgPagesMap[pos] !== id ) {
			this.prgPagesMap[pos] = id * 0x2000;
		}
	}


	setChrPage( id, pos ) {
		this.chrPagesMap[pos] = id * 0x400;
	}


	switch1kChrBank( id, pos ) {
		this.setChrPage( id % this._chrPageCount, pos );
	}


	switch2kChrBank( id, pos ) {
		if ( this.get2kChrBankCount() > 0 )
		{
			var aid = ( id * 2 ) % this._chrPageCount;
			for ( var i=0; i<2; ++i )
				this.setChrPage( aid + i, ( pos * 2 ) + i );
		}
	}


	switch4kChrBank( id, low ) {
		if ( this.get4kChrBankCount() > 0 )
		{
			var aid = ( id * 4 ) % this._chrPageCount;
			for ( var i=0; i<4; ++i )
				this.setChrPage( aid + i, i + (low ? 0 : 4) );
		}
	}


	switch8kChrBank( id ) {
		if ( this.get8kChrBankCount() > 0 )
		{
			var aid = ( id * 8 ) % this._chrPageCount;
			for ( var i=0; i<8; ++i )
				this.setChrPage( aid + i, i );
		}
	}


	useVRAM( numBanks ) {

		numBanks = numBanks || 8;
		this._usingChrVram = true;
		this._chrData = new Int32Array( 0x400 * numBanks );

		this._chrPageCount = numBanks;
		for ( var i=0; i< Math.min( 8, numBanks ); ++i ) {
			this.setChrPage( i, i );
		}
	}


	// 0x8000 -> 0xFFFF
	write8PrgRom( offset, data ) {
	}


	read8PrgRom( offset ) {

		var pageid = ( offset & 0x6000 ) >> 13; // Math.floor( ( prgOffset ) / 0x2000 );
		var pagepos = this.prgPagesMap[pageid];
		var aid = offset & 0x1FFF;
		var readValue = this._prgData[pagepos + aid];

		if ( this._gameGenieActive ) {
			if ( this._gameGeniePokes.hasOwnProperty( offset ) ) {
				return this._checkGameGenieCode( readValue, offset );
			}
		}
		return readValue;
	}


	_checkGameGenieCode( readValue, offset ) {
		// Game genie override
		var gg = this._gameGeniePokes[ offset ];
		if ( gg.compare === -1 || gg.compare === readValue ) {
			return gg.value;
		}
		return readValue | 0;
	}


	// VRAM 0x0000 -> 0x2000
	write8ChrRom( offset, data ) {
		if ( this._usingChrVram ) {
			var pageid = ( offset & 0x1C00 ) >> 10; // Math.floor( offset / 0x400 );
			var pagepos = this.chrPagesMap[pageid];
			var writeOffset = pagepos + ( offset & 0x3FF );
			this._chrData[writeOffset] = data;
		}
	}


	read8ChrRom( offset, renderingSprites, readType ) {
		var pageid = ( offset & 0x1C00 ) >> 10; // Math.floor( offset / 0x400 );
		var pagepos = this.chrPagesMap[pageid]
		var readOffset = pagepos + ( offset & 0x3FF );
		return this._chrData[readOffset] | 0;
	}


	write8SRam( offset, data ) {
		this.sram[offset & 0x1FFF] = data;
	}


	read8SRam( offset ) {
		return this.sram[offset & 0x1FFF] | 0;
	}


	write8EXRam( offset, data ) {
		this.expansionRam[offset - 0x4020] = data;
	}


	read8EXRam( offset ) {
		return this.expansionRam[offset - 0x4020] | 0;
	}


	reset() {}

	// Called from gameGenie.js - modified the PRG at given value
	gameGeniePoke( codeName, address, value, compareValue ) {

		this._gameGenieActive = true;
		this._gameGeniePokes[ address ] = { name: codeName, value: value, compare: compareValue };
	}

	removeGameGeniePoke( codeName ) {

		var keyArray = Object.keys( this._gameGeniePokes );
		for ( var i=0; i<keyArray.length; ++i ) {
			var prop = keyArray[i];
			if ( this._gameGeniePokes.hasOwnProperty( prop ) ) {
				var gg = this._gameGeniePokes[ prop ];
				if ( gg && gg.name === codeName ) {
					delete this._gameGeniePokes[ prop ];
				}
			}
		}

		var codesActive = Object.keys( this._gameGeniePokes ).length;
		this._gameGenieActive = codesActive > 0;
	}


	saveState() {
		var data = {};

		data.mirroringMethod = this.mirroringMethod;
		data._usingChrVram = this._usingChrVram;
		//data.prgPagesMap = Object.assign( {}, this.prgPagesMap );
		//data.chrPagesMap = Object.assign( {}, this.chrPagesMap ); // TODO: restore
		data.sram = uintArrayToString( this.sram );
		data.expansionRam = uintArrayToString( this.expansionRam );
		data._gameGeniePokes = Object.assign( {}, this._gameGeniePokes );
		if ( this._usingChrVram ) {
			//data.chrPages = this.chrPages.map( function( page ) { return uintArrayToString( page ); } );
			data._chrData = uintArrayToString( this._chrData );
		}
		if ( this.mapperSaveState ) {
			this.mapperSaveState( data );
		}
		return data;
	}


	loadState( state ) {
		this.mirroringMethod = state.mirroringMethod;
		this._usingChrVram = state._usingChrVram;
		//this.prgPagesMap = Object.assign( {}, state.prgPagesMap );
		// this.chrPagesMap = Object.assign( {}, state.chrPagesMap ); // TODO: restore
		this.sram = stringToUintArray( state.sram );
		this.expansionRam = stringToUintArray( state.expansionRam );
		this._gameGeniePokes = Object.assign( {}, state._gameGeniePokes );
		if ( this._usingChrVram ) {
			this._chrData = stringToUintArray( state._chrData );
		}
		if ( this.mapperLoadState ) {
			this.mapperLoadState( state );
		}
	}
};

export class Mapper0 extends BaseMapper {
	reset() {
		if (this.get32kPrgBankCount() >= 1) {
			this.switch32kPrgBank(0);
		} else if (this.get16kPrgBankCount() == 1) {
			this.switch16kPrgBank(0, true);
			this.switch16kPrgBank(0, false);
		}

		if (this.get1kChrBankCount() === 0) {
			this.useVRAM();
		} else {
			this.switch8kChrBank(0);
		}

		this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod);
	}
}

export function mapperFactory( mapperId, mainboard, mirroringMethod ) {
	var MapperClass = Mapper0; // Nes.mappers[ mapperId ];
	if ( !!!MapperClass ) {
		throw new Error( 'Mapper id ' + mapperId + ' is not supported' );
	}
	var mapper = new MapperClass(mainboard, mirroringMethod);
	return mapper;
}
