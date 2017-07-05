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

export default class BaseMapper {
  constructor(mainboard, mirroringMethod) {
    this.mainboard = mainboard;
    this.mirroringMethod = mirroringMethod;
    this.prgPagesMap = new Int32Array(4);
    this.prgData = null;
    this.prgPageCount = 0;

    this.chrPages = [];
    this.chrPagesMap = new Int32Array(8);
    this.chrData = null;
    this.chrPageCount = 0;
    this.usingChrVram = false;

    this.gameGenieActive = false;
    this.gameGeniePokes = {};

    this.sram = new Int32Array(0x2000);
    this.expansionRam = new Int32Array(0x1FE0);
  }


  onEndFrame() {
  }


  getNextEvent() {
    return -1;
  }


  synchronise(startTicks, endTicks) {
  }

	// MMC3 specific functions
  spriteScreenEnabledUpdate(spriteEnabled, screenEnabled) { }
  renderingEnabledChanged(enabled) { }


  setPrgData(array, prg8kPageCount) {
    this.prgData = array;
    this.prgPageCount = prg8kPageCount;
  }


  setChrData(array, chr1kPageCount) {
    this.chrData = array;
    this.chrPageCount = chr1kPageCount;
  }


	// //// PRG switching


  get1kChrBankCount() {
    return this.chrPageCount;
  }


  get2kChrBankCount() {
    return this.chrPageCount >> 1; // Math.floor( this.chrPages.length / 2 );
  }


  get4kChrBankCount() {
    return this.chrPageCount >> 2; // Math.floor( this.chrPages.length / 4 );
  }


  get8kChrBankCount() {
    return this.chrPageCount >> 3; // Math.floor( this.chrPages.length / 8 );
  }


  get8kPrgBankCount() {
    return this.prgPageCount;
  }


  get16kPrgBankCount() {
    return this.prgPageCount >> 1; // Math.floor( this.prgPages.length / 2 );
  }


  get32kPrgBankCount() {
    return this.prgPageCount >> 2; // Math.floor( this.prgPages.length / 4 );
  }


  switch8kPrgBank(id, pos) {
		// Nes.Trace.writeLine( 'mapper', 'switch8kPrgBank:' + id );
    this.setPrgPage(id % this.prgPageCount, pos);
  }


  switch16kPrgBank(id, low) {
    if (this.get16kPrgBankCount() > 0)		{
			// Nes.Trace.writeLine( 'mapper', 'switch16kPrgBank:' + id );
      const aid = (id * 2) % this.prgPageCount;
      for (let i = 0; i < 2; ++i) { this.setPrgPage(aid + i, i + (low ? 0 : 2)); }
    }
  }


  switch32kPrgBank(id) {
    if (this.get32kPrgBankCount() > 0)		{
			// Nes.Trace.writeLine( 'mapper', 'switch32kPrgBank:' + id );
      const aid = (id * 4) % this.prgPageCount;
      for (let i = 0; i < 4; ++i) { this.setPrgPage(aid + i, i); }
    }
  }


  setPrgPage(id, pos) {
    if (this.prgPagesMap[pos] !== id) {
      this.prgPagesMap[pos] = id * 0x2000;
    }
  }


  setChrPage(id, pos) {
    this.chrPagesMap[pos] = id * 0x400;
  }


  switch1kChrBank(id, pos) {
    this.setChrPage(id % this.chrPageCount, pos);
  }


  switch2kChrBank(id, pos) {
    if (this.get2kChrBankCount() > 0)		{
      const aid = (id * 2) % this.chrPageCount;
      for (let i = 0; i < 2; ++i) { this.setChrPage(aid + i, (pos * 2) + i); }
    }
  }


  switch4kChrBank(id, low) {
    if (this.get4kChrBankCount() > 0)		{
      const aid = (id * 4) % this.chrPageCount;
      for (let i = 0; i < 4; ++i) { this.setChrPage(aid + i, i + (low ? 0 : 4)); }
    }
  }


  switch8kChrBank(id) {
    if (this.get8kChrBankCount() > 0)		{
      const aid = (id * 8) % this.chrPageCount;
      for (let i = 0; i < 8; ++i) { this.setChrPage(aid + i, i); }
    }
  }


  useVRAM(numBanks) {
    numBanks = numBanks || 8;
    this.usingChrVram = true;
    this.chrData = new Int32Array(0x400 * numBanks);

    this.chrPageCount = numBanks;
    for (let i = 0; i < Math.min(8, numBanks); ++i) {
      this.setChrPage(i, i);
    }
  }


	// 0x8000 -> 0xFFFF
  write8PrgRom(offset, data) {}


  read8PrgRom(offset) {
    const pageid = (offset & 0x6000) >> 13; // Math.floor( ( prgOffset ) / 0x2000 );
    const pagepos = this.prgPagesMap[pageid];
    const aid = offset & 0x1FFF;
    const readValue = this.prgData[pagepos + aid];

		// if ( this.gameGenieActive ) {
		// 	if ( this.gameGeniePokes.hasOwnProperty( offset ) ) {
		// 		return this.checkGameGenieCode( readValue, offset );
		// 	}
		// }
    return readValue;
  }


  _checkGameGenieCode(readValue, offset) {
		// Game genie override
    const gg = this.gameGeniePokes[offset];
    if (gg.compare === -1 || gg.compare === readValue) {
      return gg.value;
    }
    return readValue | 0;
  }


	// VRAM 0x0000 -> 0x2000
  write8ChrRom(offset, data) {
    if (this.usingChrVram) {
      const pageid = (offset & 0x1C00) >> 10; // Math.floor( offset / 0x400 );
      const pagepos = this.chrPagesMap[pageid];
      const writeOffset = pagepos + (offset & 0x3FF);
      this.chrData[writeOffset] = data;
    }
  }


  read8ChrRom(offset, renderingSprites, readType) {
    const pageid = (offset & 0x1C00) >> 10; // Math.floor( offset / 0x400 );
    const pagepos = this.chrPagesMap[pageid];
    const readOffset = pagepos + (offset & 0x3FF);
    return this.chrData[readOffset] | 0;
  }


  write8SRam(offset, data) {
    this.sram[offset & 0x1FFF] = data;
  }


  read8SRam(offset) {
    return this.sram[offset & 0x1FFF] | 0;
  }


  write8EXRam(offset, data) {
    this.expansionRam[offset - 0x4020] = data;
  }


  read8EXRam(offset) {
    return this.expansionRam[offset - 0x4020] | 0;
  }


  reset() {}

	// Called from gameGenie.js - modified the PRG at given value
  gameGeniePoke(codeName, address, value, compareValue) {
    this.gameGenieActive = true;
    this.gameGeniePokes[address] = { name: codeName, value, compare: compareValue };
  }

  removeGameGeniePoke(codeName) {
    const keyArray = Object.keys(this.gameGeniePokes);
    for (let i = 0; i < keyArray.length; ++i) {
      const prop = keyArray[i];
      if (this.gameGeniePokes.hasOwnProperty(prop)) {
        const gg = this.gameGeniePokes[prop];
        if (gg && gg.name === codeName) {
          delete this.gameGeniePokes[prop];
        }
      }
    }

    const codesActive = Object.keys(this.gameGeniePokes).length;
    this.gameGenieActive = codesActive > 0;
  }


  saveState() {
    const data = {};

    data.mirroringMethod = this.mirroringMethod;
    data._usingChrVram = this.usingChrVram;
		// data.prgPagesMap = Object.assign( {}, this.prgPagesMap );
		// data.chrPagesMap = Object.assign( {}, this.chrPagesMap ); // TODO: restore
    data.sram = uintArrayToString(this.sram);
    data.expansionRam = uintArrayToString(this.expansionRam);
    data._gameGeniePokes = Object.assign({}, this.gameGeniePokes);
    if (this.usingChrVram) {
			// data.chrPages = this.chrPages.map( function( page ) { return uintArrayToString( page ); } );
      data._chrData = uintArrayToString(this.chrData);
    }
    if (this.mapperSaveState) {
      this.mapperSaveState(data);
    }
    return data;
  }


  loadState(state) {
    this.mirroringMethod = state.mirroringMethod;
    this.usingChrVram = state._usingChrVram;
		// this.prgPagesMap = Object.assign( {}, state.prgPagesMap );
		// this.chrPagesMap = Object.assign( {}, state.chrPagesMap ); // TODO: restore
    this.sram = stringToUintArray(state.sram);
    this.expansionRam = stringToUintArray(state.expansionRam);
    this.gameGeniePokes = Object.assign({}, state._gameGeniePokes);
    if (this.usingChrVram) {
      this.chrData = stringToUintArray(state._chrData);
    }
    if (this.mapperLoadState) {
      this.mapperLoadState(state);
    }
  }
}
