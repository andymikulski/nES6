import sha1 from 'sha1';

import {
  g_DefaultColourEncoding,
  PPU_MIRRORING_VERTICAL,
  PPU_MIRRORING_HORIZONTAL,
  setColourEncodingType,
  mirroringMethodToString,
  PPU_MIRRORING_FOURSCREEN,
} from '../config/consts.js';

import mapperFactory from './mappers/mapperFactory';

export default class Cartridge {
  constructor(mainboard) {
    this.mainboard = mainboard;
    this.memoryMapper = null;
    this.sha1 = '';
    this.name = '';
    this.colourEncodingType = g_DefaultColourEncoding;
  }

  getHighestFrequencyElement(map) {
    let mostFrequent = null;
    let frequency = 0;
    for (const mapperId in map) {
      if (map.hasOwnProperty(mapperId)) {
        if (map[mapperId] > frequency) {
          frequency = map[mapperId];
          mostFrequent = mapperId;
        }
      }
    }
    return mostFrequent;
  }

  determineColourEncodingType(filename) {
    let value = g_DefaultColourEncoding;

    if (filename.match(/[\[\(][E][\]\)]/i)) {
      value = 'PAL';
    } else if (filename.match(/[\[\(][JU][\]\)]/i)) {
      value = 'NTSC';
    }

    this.colourEncodingType = value;
  }

  getName() {
    return this.name;
  }

  getHash() {
    return this.sha1;
  }


  create32IntArray(array, length) {
    const a = new Int32Array(length);
    for (let i = 0; i < length; ++i) {
      a[i] = array[i] | 0;
    }
    return a;
  }

  async loadRom({
		name,
    binaryString,
    fileSize,
	}) {
    this.name = name;
    let stringIndex = 0;
    const correctHeader = [78, 69, 83, 26];

    for (let i = 0; i < correctHeader.length; ++i) {
      if (correctHeader[i] !== binaryString[stringIndex++]) {
        throw new Error('Invalid NES header for file!');
      }
    }

    const prgPageCount = binaryString[stringIndex++] || 1;
    const chrPageCount = binaryString[stringIndex++];
    const controlByte1 = binaryString[stringIndex++];
    const controlByte2 = binaryString[stringIndex++];

    const horizontalMirroring = (controlByte1 & 0x01) === 0;
    const sramEnabled = (controlByte1 & 0x02) > 0;
    const hasTrainer = (controlByte1 & 0x04) > 0;
    const fourScreenRamLayout = (controlByte1 & 0x08) > 0;

    let mirroringMethod = 0;
    if (fourScreenRamLayout) {
      mirroringMethod = PPU_MIRRORING_FOURSCREEN;
    } else if (!horizontalMirroring) {
      mirroringMethod = PPU_MIRRORING_VERTICAL;
    } else {
      mirroringMethod = PPU_MIRRORING_HORIZONTAL;
    }

    const mapperId = ((controlByte1 & 0xF0) >> 4) | (controlByte2 & 0xF0);

    stringIndex = 16;
    if (hasTrainer) { stringIndex += 512; }

    // calculate SHA1 on PRG and CHR data, look it up in the db, then load it
    this.sha1 = sha1(binaryString, stringIndex);

    // mapper is loaded async so we need to (a)wait for it
    this.memoryMapper = await mapperFactory(mapperId, this.mainboard, mirroringMethod);

    if (!this.memoryMapper) {
      throw new Error(`No memory mapper selected for "${mapperId}"`);
    }

    // read in program code
    const prg8kChunkCount = prgPageCount * 2; // read in 8k chunks, prgPageCount is 16k chunks
    const prgSize = 0x2000 * prg8kChunkCount;
    this.memoryMapper.setPrgData(this.create32IntArray(binaryString.subarray(stringIndex, stringIndex + prgSize), prgSize), prg8kChunkCount);
    stringIndex += prgSize;

    // read in character maps
    const chr1kChunkCount = chrPageCount * 8; // 1kb per pattern table, chrPageCount is the 8kb count
    const chrSize = 0x400 * chr1kChunkCount;
    this.memoryMapper.setChrData(this.create32IntArray(binaryString.subarray(stringIndex, stringIndex + chrSize), chrSize), chr1kChunkCount);
    stringIndex += chrSize;

    // determine NTSC or PAL
    this.determineColourEncodingType(name);
    setColourEncodingType(this.colourEncodingType);
    const prgKb = prg8kChunkCount * 8;
    console.log(`Cartridge '${name}' loaded. \n\nSHA1: \t\t${this.sha1} \nFile Size: \t${fileSize} KB \nMapper:\t\t${mapperId} \nMirroring:\t${mirroringMethodToString(mirroringMethod)} \nPRG:\t\t${prgKb}kb \nCHR:\t\t${chr1kChunkCount}kb \nEncoding:\t${this.colourEncodingType}`);
  }

  reset() {
    this.memoryMapper.reset();
  }
}
