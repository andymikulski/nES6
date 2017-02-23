import sha1 from 'sha1';

import {
	g_DefaultColourEncoding,
	PPU_MIRRORING_VERTICAL,
	setColourEncodingType,
	mirroringMethodToString,
} from '../config/consts';

import {
	mapperFactory
} from './mappers/BaseMapper';



var dbLookup = function( shaString, callback ) {
	if ( shaString.length !== 40 ) {
		throw new Error( "dbLookup : SHA1 must be 40 characters long! [" + shaString + "]" );
	}

	var path = 'js/db/' + shaString + '.js';
	var data;
	// $.getScript( path ).always(function() {
		callback( null, window['NesDb'] ? window['NesDb'][ shaString ] : null );
	// } );
};

export default class Cartridge {
	constructor(mainboard) {
		this.mainboard = mainboard;
		this.memoryMapper = null;
		this._sha1 = '';
		this._name = '';
		this._dbData = null;
		this._colourEncodingType = g_DefaultColourEncoding;
	}

	getHighestFrequencyElement(map) {
		var mostFrequent = null;
		var frequency = 0;
		for (var mapperId in map) {
			if (map.hasOwnProperty(mapperId)) {
				if (map[mapperId] > frequency) {
					frequency = map[mapperId];
					mostFrequent = mapperId;
				}
			}
		}
		return mostFrequent;
	}

	_getMapperFromDatabase(mapperIdFromInes) {

		var mapperIdFrequency = {};
		if (this._dbData && this._dbData['cartridge']) {
			var foundInesMapper = false;
			this._dbData['cartridge'].forEach(function(cart) {
				if (cart['board']) {
					cart['board'].forEach(function(board) {
						if (board['$']['mapper'] === mapperIdFromInes) {
							// Mapper ID in iNes file has been found in database - use that
							foundInesMapper = true;
						} else {
							mapperIdFrequency[board['$']['mapper']] = (mapperIdFrequency[board['$']['mapper']] + 1) || 1;
						}
					});
				}
			});
			if (foundInesMapper) {
				return mapperIdFromInes;
			}

			// iNes mapper was not found in DB - use the most likely mapper ID found
			var mostFrequentMapperId = getHighestFrequencyElement(mapperIdFrequency);
			if (mostFrequentMapperId !== null) {
				return parseInt(mostFrequentMapperId);
			} else {
				return null;
			}
		}
		return null;
	}

	_workOutColourEncodingFromFilename(filename) {

		if (filename.match(/[\[\(][E][\]\)]/i)) {
			return 'PAL';
		} else if (filename.match(/[\[\(][JU][\]\)]/i)) {
			return 'NTSC';
		} else {
			return g_DefaultColourEncoding;
		}
	}

	_determineColourEncodingType(filename) {

		// look in database
		var stringStartsWith = function(str, test) {
			return str.slice(0, test.length) === test;
		}

		var systemFrequency = {};
		if (this._dbData && this._dbData['cartridge']) {
			this._dbData['cartridge'].forEach(function(cart) {
				if (cart['$']['system']) {
					var lower = cart['$']['system'].toLowerCase();

					if (stringStartsWith(lower, 'nes-pal')) {
						systemFrequency['PAL'] = systemFrequency['PAL'] || 0;
						systemFrequency['PAL']++;
					} else {
						systemFrequency['NTSC'] = systemFrequency['NTSC'] || 0;
						systemFrequency['NTSC']++;
					}
				}
			});

			var mostFrequentType = getHighestFrequencyElement(systemFrequency);
			if (mostFrequentType !== null) {
				this._colourEncodingType = mostFrequentType;
				return;
			}
		}

		this._colourEncodingType = this._workOutColourEncodingFromFilename(filename);
	}

	getName() {
		return this._name;
	}

	getHash() {
		return this._sha1;
	}


	create32IntArray(array, length) {
		var a = new Int32Array(length);
		for (var i = 0; i < length; ++i) {
			a[i] = array[i] | 0;
		}
		return a;
	}

	loadRom(name, binaryString, completeCallback) {
		var that = this;
		try {
			this._name = name;

			var stringIndex = 0;
			var correctHeader = [78, 69, 83, 26];

			for (var i = 0; i < correctHeader.length; ++i) {
				if (correctHeader[i] !== binaryString[stringIndex++])
					throw new Error('Invalid NES header for file!');
			}

			var prgPageCount = binaryString[stringIndex++];
			var chrPageCount = binaryString[stringIndex++];
			var controlByte1 = binaryString[stringIndex++];
			var controlByte2 = binaryString[stringIndex++];

			if (prgPageCount === 0) {
				prgPageCount = 1; // 0 means 1
			}

			var horizontalMirroring = (controlByte1 & 0x01) === 0;
			var sramEnabled = (controlByte1 & 0x02) > 0;
			var hasTrainer = (controlByte1 & 0x04) > 0;
			var fourScreenRamLayout = (controlByte1 & 0x08) > 0;

			var mirroringMethod = 0;
			if (fourScreenRamLayout)
				mirroringMethod = PPU_MIRRORING_FOURSCREEN;
			else if (!horizontalMirroring)
				mirroringMethod = PPU_MIRRORING_VERTICAL;
			else
				mirroringMethod = PPU_MIRRORING_HORIZONTAL;

			var mapperId = ((controlByte1 & 0xF0) >> 4) | (controlByte2 & 0xF0);

			stringIndex = 16;
			if (hasTrainer)
				stringIndex += 512;

			// calculate SHA1 on PRG and CHR data, look it up in the db, then load it
			this._sha1 = sha1(binaryString, stringIndex);
			console.log("SHA1: " + this._sha1);

			dbLookup(this._sha1, (err, data)=>{
				if (err) {
					completeCallback(err);
					return;
				}
				try {
					that._dbData = data;

					if (that._dbData) {
						that._name = that._dbData['$']['name'];
						console.log("Game found in database: " + that._name);
					} else {
						console.log("Game not found in database");
					}

					var mapperFromDb = that._getMapperFromDatabase(mapperId);

					if (mapperFromDb !== null && mapperFromDb !== mapperId) {
						console.log("Game has different mapper in database [" + mapperFromDb + "] from the iNes file [" + mapperId + "]. Using value from database...");
						mapperId = mapperFromDb;
					}

					that.memoryMapper = mapperFactory(mapperId, that.mainboard, mirroringMethod);

					// read in program code
					var prg8kChunkCount = prgPageCount * 2; // read in 8k chunks, prgPageCount is 16k chunks
					var prgSize = 0x2000 * prg8kChunkCount;
					that.memoryMapper.setPrgData(this.create32IntArray(binaryString.subarray(stringIndex, stringIndex + prgSize), prgSize), prg8kChunkCount);
					stringIndex += prgSize;

					// read in character maps
					var chr1kChunkCount = chrPageCount * 8; // 1kb per pattern table, chrPageCount is the 8kb count
					var chrSize = 0x400 * chr1kChunkCount;
					that.memoryMapper.setChrData(this.create32IntArray(binaryString.subarray(stringIndex, stringIndex + chrSize), chrSize), chr1kChunkCount);
					stringIndex += chrSize;

					// determine NTSC or PAL
					that._determineColourEncodingType(name);
					setColourEncodingType(that._colourEncodingType);
					var prgKb = prg8kChunkCount * 8;
					console.log('Cartridge \'' + name + '\' loaded. Mapper ' + mapperId + ', ' + mirroringMethodToString(mirroringMethod) + ' mirroring, ' + prgKb + 'kb PRG, ' + chr1kChunkCount + 'kb CHR');
					console.log('Encoding: ' + that._colourEncodingType);

					completeCallback();
				} catch (err2) {
					completeCallback(err2);
				}
			});
		} catch (err) {
			completeCallback(err);
		}
	}

	reset() {
		this.memoryMapper.reset();
	}
}
