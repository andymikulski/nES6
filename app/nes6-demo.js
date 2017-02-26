/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 85);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.mirroringMethodToString = mirroringMethodToString;
var PPU_TICKS_PER_SCANLINE = exports.PPU_TICKS_PER_SCANLINE = 341;
var MASTER_CYCLES_PER_PPU = exports.MASTER_CYCLES_PER_PPU = 5;
var MASTER_CYCLES_PER_SCANLINE = exports.MASTER_CYCLES_PER_SCANLINE = PPU_TICKS_PER_SCANLINE * MASTER_CYCLES_PER_PPU;

var CPU_RESET_ADDRESS = exports.CPU_RESET_ADDRESS = 0xFFFC;
var CPU_IRQ_ADDRESS = exports.CPU_IRQ_ADDRESS = 0xFFFE;
var CPU_NMI_ADDRESS = exports.CPU_NMI_ADDRESS = 0xFFFA;

var SCREEN_WIDTH = exports.SCREEN_WIDTH = 256;
var SCREEN_HEIGHT = exports.SCREEN_HEIGHT = 240;

var TRACE_ENABLED = exports.TRACE_ENABLED = false;

var IS_INT_BETWEEN = exports.IS_INT_BETWEEN = function IS_INT_BETWEEN(offset, min, max) {
	return min <= offset && offset < max;
};

var zeroPadCache = {};
var ZERO_PAD = exports.ZERO_PAD = function ZERO_PAD(n, width, z) {
	var cacheKey = n + ' ' + width + ' ' + z;
	if (!zeroPadCache[cacheKey]) {
		z = z || '0';
		n = n + '';
		zeroPadCache[cacheKey] = n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}
	return zeroPadCache[cacheKey];
};

var ZERO_PAD_HEX = exports.ZERO_PAD_HEX = function ZERO_PAD_HEX(n, width, z) {
	return ZERO_PAD(n.toString(16), width, z);
};

var g_DefaultColourEncoding = exports.g_DefaultColourEncoding = 'NTSC';

var COLOUR_ENCODING_NAME = exports.COLOUR_ENCODING_NAME = "";
var COLOUR_ENCODING_REFRESHRATE = exports.COLOUR_ENCODING_REFRESHRATE = 0.0;
var COLOUR_ENCODING_MTC_PER_CPU = exports.COLOUR_ENCODING_MTC_PER_CPU = 0;
var COLOUR_ENCODING_VBLANK_SCANLINES = exports.COLOUR_ENCODING_VBLANK_SCANLINES = 0;
var COLOUR_ENCODING_FRAME_SCANLINES = exports.COLOUR_ENCODING_FRAME_SCANLINES = 0;
var COLOUR_ENCODING_VBLANK_MTC = exports.COLOUR_ENCODING_VBLANK_MTC = 0;
var COLOUR_ENCODING_FRAME_MTC = exports.COLOUR_ENCODING_FRAME_MTC = 0;

var setColourEncodingType = exports.setColourEncodingType = function setColourEncodingType(name) {

	if (name === 'PAL') {
		exports.COLOUR_ENCODING_NAME = COLOUR_ENCODING_NAME = "PAL";
		exports.COLOUR_ENCODING_REFRESHRATE = COLOUR_ENCODING_REFRESHRATE = 50.0;
		exports.COLOUR_ENCODING_MTC_PER_CPU = COLOUR_ENCODING_MTC_PER_CPU = 16;
		exports.COLOUR_ENCODING_VBLANK_SCANLINES = COLOUR_ENCODING_VBLANK_SCANLINES = 70;
		exports.COLOUR_ENCODING_FRAME_SCANLINES = COLOUR_ENCODING_FRAME_SCANLINES = 312;
	} else {
		exports.COLOUR_ENCODING_NAME = COLOUR_ENCODING_NAME = "NTSC";
		exports.COLOUR_ENCODING_REFRESHRATE = COLOUR_ENCODING_REFRESHRATE = 60.1;
		exports.COLOUR_ENCODING_MTC_PER_CPU = COLOUR_ENCODING_MTC_PER_CPU = 15;
		exports.COLOUR_ENCODING_VBLANK_SCANLINES = COLOUR_ENCODING_VBLANK_SCANLINES = 20;
		exports.COLOUR_ENCODING_FRAME_SCANLINES = COLOUR_ENCODING_FRAME_SCANLINES = 262;
	}

	exports.COLOUR_ENCODING_VBLANK_MTC = COLOUR_ENCODING_VBLANK_MTC = COLOUR_ENCODING_VBLANK_SCANLINES * MASTER_CYCLES_PER_SCANLINE;
	exports.COLOUR_ENCODING_FRAME_MTC = COLOUR_ENCODING_FRAME_MTC = COLOUR_ENCODING_FRAME_SCANLINES * MASTER_CYCLES_PER_SCANLINE;
};

setColourEncodingType(g_DefaultColourEncoding);

var PPU_MIRRORING_HORIZONTAL = exports.PPU_MIRRORING_HORIZONTAL = 0;
var PPU_MIRRORING_VERTICAL = exports.PPU_MIRRORING_VERTICAL = 1;
var PPU_MIRRORING_FOURSCREEN = exports.PPU_MIRRORING_FOURSCREEN = 2;
var PPU_MIRRORING_SINGLESCREEN_NT0 = exports.PPU_MIRRORING_SINGLESCREEN_NT0 = 3;
var PPU_MIRRORING_SINGLESCREEN_NT1 = exports.PPU_MIRRORING_SINGLESCREEN_NT1 = 4;

function mirroringMethodToString(method) {
	switch (method) {
		case PPU_MIRRORING_HORIZONTAL:
			// default
			return 'horizontal';
		case PPU_MIRRORING_VERTICAL:
			return 'vertical';
		case PPU_MIRRORING_FOURSCREEN:
			return 'fourscreen';
		case PPU_MIRRORING_SINGLESCREEN_NT0:
			return 'singlescreen 0';
		case PPU_MIRRORING_SINGLESCREEN_NT1:
			return 'singlescreen 1';
	}
	return '';
};

var JOYPAD_A = exports.JOYPAD_A = 0;
var JOYPAD_B = exports.JOYPAD_B = 1;
var JOYPAD_SELECT = exports.JOYPAD_SELECT = 2;
var JOYPAD_START = exports.JOYPAD_START = 3;
var JOYPAD_UP = exports.JOYPAD_UP = 4;
var JOYPAD_DOWN = exports.JOYPAD_DOWN = 5;
var JOYPAD_LEFT = exports.JOYPAD_LEFT = 6;
var JOYPAD_RIGHT = exports.JOYPAD_RIGHT = 7;

var JOYPAD_NAME_TO_ID = exports.JOYPAD_NAME_TO_ID = function JOYPAD_NAME_TO_ID(name) {
	if (name === 'UP') {
		return JOYPAD_UP;
	} else if (name === 'DOWN') {
		return JOYPAD_DOWN;
	} else if (name === 'LEFT') {
		return JOYPAD_LEFT;
	} else if (name === 'RIGHT') {
		return JOYPAD_RIGHT;
	} else if (name === 'A') {
		return JOYPAD_A;
	} else if (name === 'B') {
		return JOYPAD_B;
	} else if (name === 'SELECT') {
		return JOYPAD_SELECT;
	} else if (name === 'START') {
		return JOYPAD_START;
	} else {
		throw new Error("JOYPAD_NAME_TO_ID: Invalid parameter");
	}
};

var JOYPAD_ID_TO_NAME = exports.JOYPAD_ID_TO_NAME = function JOYPAD_ID_TO_NAME(id) {
	if (id === JOYPAD_UP) {
		return 'UP';
	} else if (id === JOYPAD_DOWN) {
		return 'DOWN';
	} else if (id === JOYPAD_LEFT) {
		return 'LEFT';
	} else if (id === JOYPAD_RIGHT) {
		return 'RIGHT';
	} else if (id === JOYPAD_A) {
		return 'A';
	} else if (id === JOYPAD_B) {
		return 'B';
	} else if (id === JOYPAD_SELECT) {
		return 'SELECT';
	} else if (id === JOYPAD_START) {
		return 'START';
	} else {
		throw new Error("JOYPAD_ID_TO_NAME: Invalid parameter " + id);
	}
};

var g_ClearScreenArray = exports.g_ClearScreenArray = new Int32Array(SCREEN_WIDTH * SCREEN_HEIGHT).fill(0);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rusha = undefined;
exports.uintArrayToString = uintArrayToString;
exports.stringToUintArray = stringToUintArray;
exports.blobToString = blobToString;

var _rusha = __webpack_require__(79);

var _rusha2 = _interopRequireDefault(_rusha);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var rusha = exports.rusha = new _rusha2.default();

var uintArrayCache = {};
function uintArrayToString(uintArray) {
  if (!(uintArray instanceof Int32Array)) {
    throw new Error('uintArrayToString: Only accepts Int32Array parameter');
  }
  var cacheKey = uintArray.toString();

  if (!uintArrayCache[cacheKey]) {
    var str = '';
    for (var i = 0, strLen = uintArray.length; i < strLen; i++) {
      var saveValue = uintArray[i];
      if (saveValue > 0xFFFF) {
        throw new Error("Invalid value attempted to be serialised");
      }
      str += String.fromCharCode(saveValue);
    }

    uintArrayCache[cacheKey] = str;
  }

  return uintArrayCache[cacheKey];
};

var stringCache = {};
function stringToUintArray(str) {
  if (!stringCache[stringCache]) {
    var buf = new Int32Array(str.length);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      buf[i] = str.charCodeAt(i) | 0;
    }
    stringCache[stringCache] = buf;
  }

  return stringCache[stringCache];
};

function blobToString(blob) {
  var url = window.webkitURL || window.URL;
  return url.createObjectURL(blob);
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* Estimated number of games with mapper (other mappers had <10 games)
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

var _serialisation = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BaseMapper = function () {
	function BaseMapper(mainboard, mirroringMethod) {
		_classCallCheck(this, BaseMapper);

		this.mainboard = mainboard;
		this.mirroringMethod = mirroringMethod;
		this.prgPagesMap = new Int32Array(4);
		this._prgData = null;
		this._prgPageCount = 0;

		this.chrPages = [];
		this.chrPagesMap = new Int32Array(8);
		this._chrData = null;
		this._chrPageCount = 0;
		this._usingChrVram = false;

		this._gameGenieActive = false;
		this._gameGeniePokes = {};

		this.sram = new Int32Array(0x2000);
		this.expansionRam = new Int32Array(0x1FE0);
	}

	_createClass(BaseMapper, [{
		key: 'onEndFrame',
		value: function onEndFrame() {}
	}, {
		key: 'getNextEvent',
		value: function getNextEvent() {
			return -1;
		}
	}, {
		key: 'synchronise',
		value: function synchronise(startTicks, endTicks) {}

		// MMC3 specific functions

	}, {
		key: 'spriteScreenEnabledUpdate',
		value: function spriteScreenEnabledUpdate(spriteEnabled, screenEnabled) {}
	}, {
		key: 'renderingEnabledChanged',
		value: function renderingEnabledChanged(enabled) {}
	}, {
		key: 'setPrgData',
		value: function setPrgData(array, prg8kPageCount) {

			this._prgData = array;
			this._prgPageCount = prg8kPageCount;
		}
	}, {
		key: 'setChrData',
		value: function setChrData(array, chr1kPageCount) {

			this._chrData = array;
			this._chrPageCount = chr1kPageCount;
		}

		////// PRG switching


	}, {
		key: 'get1kChrBankCount',
		value: function get1kChrBankCount() {
			return this._chrPageCount;
		}
	}, {
		key: 'get2kChrBankCount',
		value: function get2kChrBankCount() {
			return this._chrPageCount >> 1; // Math.floor( this.chrPages.length / 2 );
		}
	}, {
		key: 'get4kChrBankCount',
		value: function get4kChrBankCount() {
			return this._chrPageCount >> 2; // Math.floor( this.chrPages.length / 4 );
		}
	}, {
		key: 'get8kChrBankCount',
		value: function get8kChrBankCount() {
			return this._chrPageCount >> 3; // Math.floor( this.chrPages.length / 8 );
		}
	}, {
		key: 'get8kPrgBankCount',
		value: function get8kPrgBankCount() {
			return this._prgPageCount;
		}
	}, {
		key: 'get16kPrgBankCount',
		value: function get16kPrgBankCount() {
			return this._prgPageCount >> 1; // Math.floor( this.prgPages.length / 2 );
		}
	}, {
		key: 'get32kPrgBankCount',
		value: function get32kPrgBankCount() {
			return this._prgPageCount >> 2; // Math.floor( this.prgPages.length / 4 );
		}
	}, {
		key: 'switch8kPrgBank',
		value: function switch8kPrgBank(id, pos) {
			//Nes.Trace.writeLine( 'mapper', 'switch8kPrgBank:' + id );
			this.setPrgPage(id % this._prgPageCount, pos);
		}
	}, {
		key: 'switch16kPrgBank',
		value: function switch16kPrgBank(id, low) {
			if (this.get16kPrgBankCount() > 0) {
				//Nes.Trace.writeLine( 'mapper', 'switch16kPrgBank:' + id );
				var aid = id * 2 % this._prgPageCount;
				for (var i = 0; i < 2; ++i) {
					this.setPrgPage(aid + i, i + (low ? 0 : 2));
				}
			}
		}
	}, {
		key: 'switch32kPrgBank',
		value: function switch32kPrgBank(id) {
			if (this.get32kPrgBankCount() > 0) {
				//Nes.Trace.writeLine( 'mapper', 'switch32kPrgBank:' + id );
				var aid = id * 4 % this._prgPageCount;
				for (var i = 0; i < 4; ++i) {
					this.setPrgPage(aid + i, i);
				}
			}
		}
	}, {
		key: 'setPrgPage',
		value: function setPrgPage(id, pos) {
			if (this.prgPagesMap[pos] !== id) {
				this.prgPagesMap[pos] = id * 0x2000;
			}
		}
	}, {
		key: 'setChrPage',
		value: function setChrPage(id, pos) {
			this.chrPagesMap[pos] = id * 0x400;
		}
	}, {
		key: 'switch1kChrBank',
		value: function switch1kChrBank(id, pos) {
			this.setChrPage(id % this._chrPageCount, pos);
		}
	}, {
		key: 'switch2kChrBank',
		value: function switch2kChrBank(id, pos) {
			if (this.get2kChrBankCount() > 0) {
				var aid = id * 2 % this._chrPageCount;
				for (var i = 0; i < 2; ++i) {
					this.setChrPage(aid + i, pos * 2 + i);
				}
			}
		}
	}, {
		key: 'switch4kChrBank',
		value: function switch4kChrBank(id, low) {
			if (this.get4kChrBankCount() > 0) {
				var aid = id * 4 % this._chrPageCount;
				for (var i = 0; i < 4; ++i) {
					this.setChrPage(aid + i, i + (low ? 0 : 4));
				}
			}
		}
	}, {
		key: 'switch8kChrBank',
		value: function switch8kChrBank(id) {
			if (this.get8kChrBankCount() > 0) {
				var aid = id * 8 % this._chrPageCount;
				for (var i = 0; i < 8; ++i) {
					this.setChrPage(aid + i, i);
				}
			}
		}
	}, {
		key: 'useVRAM',
		value: function useVRAM(numBanks) {

			numBanks = numBanks || 8;
			this._usingChrVram = true;
			this._chrData = new Int32Array(0x400 * numBanks);

			this._chrPageCount = numBanks;
			for (var i = 0; i < Math.min(8, numBanks); ++i) {
				this.setChrPage(i, i);
			}
		}

		// 0x8000 -> 0xFFFF

	}, {
		key: 'write8PrgRom',
		value: function write8PrgRom(offset, data) {}
	}, {
		key: 'read8PrgRom',
		value: function read8PrgRom(offset) {

			var pageid = (offset & 0x6000) >> 13; // Math.floor( ( prgOffset ) / 0x2000 );
			var pagepos = this.prgPagesMap[pageid];
			var aid = offset & 0x1FFF;
			var readValue = this._prgData[pagepos + aid];

			// if ( this._gameGenieActive ) {
			// 	if ( this._gameGeniePokes.hasOwnProperty( offset ) ) {
			// 		return this._checkGameGenieCode( readValue, offset );
			// 	}
			// }
			return readValue;
		}
	}, {
		key: '_checkGameGenieCode',
		value: function _checkGameGenieCode(readValue, offset) {
			// Game genie override
			var gg = this._gameGeniePokes[offset];
			if (gg.compare === -1 || gg.compare === readValue) {
				return gg.value;
			}
			return readValue | 0;
		}

		// VRAM 0x0000 -> 0x2000

	}, {
		key: 'write8ChrRom',
		value: function write8ChrRom(offset, data) {
			if (this._usingChrVram) {
				var pageid = (offset & 0x1C00) >> 10; // Math.floor( offset / 0x400 );
				var pagepos = this.chrPagesMap[pageid];
				var writeOffset = pagepos + (offset & 0x3FF);
				this._chrData[writeOffset] = data;
			}
		}
	}, {
		key: 'read8ChrRom',
		value: function read8ChrRom(offset, renderingSprites, readType) {
			var pageid = (offset & 0x1C00) >> 10; // Math.floor( offset / 0x400 );
			var pagepos = this.chrPagesMap[pageid];
			var readOffset = pagepos + (offset & 0x3FF);
			return this._chrData[readOffset] | 0;
		}
	}, {
		key: 'write8SRam',
		value: function write8SRam(offset, data) {
			this.sram[offset & 0x1FFF] = data;
		}
	}, {
		key: 'read8SRam',
		value: function read8SRam(offset) {
			return this.sram[offset & 0x1FFF] | 0;
		}
	}, {
		key: 'write8EXRam',
		value: function write8EXRam(offset, data) {
			this.expansionRam[offset - 0x4020] = data;
		}
	}, {
		key: 'read8EXRam',
		value: function read8EXRam(offset) {
			return this.expansionRam[offset - 0x4020] | 0;
		}
	}, {
		key: 'reset',
		value: function reset() {}

		// Called from gameGenie.js - modified the PRG at given value

	}, {
		key: 'gameGeniePoke',
		value: function gameGeniePoke(codeName, address, value, compareValue) {

			this._gameGenieActive = true;
			this._gameGeniePokes[address] = { name: codeName, value: value, compare: compareValue };
		}
	}, {
		key: 'removeGameGeniePoke',
		value: function removeGameGeniePoke(codeName) {

			var keyArray = Object.keys(this._gameGeniePokes);
			for (var i = 0; i < keyArray.length; ++i) {
				var prop = keyArray[i];
				if (this._gameGeniePokes.hasOwnProperty(prop)) {
					var gg = this._gameGeniePokes[prop];
					if (gg && gg.name === codeName) {
						delete this._gameGeniePokes[prop];
					}
				}
			}

			var codesActive = Object.keys(this._gameGeniePokes).length;
			this._gameGenieActive = codesActive > 0;
		}
	}, {
		key: 'saveState',
		value: function saveState() {
			var data = {};

			data.mirroringMethod = this.mirroringMethod;
			data._usingChrVram = this._usingChrVram;
			//data.prgPagesMap = Object.assign( {}, this.prgPagesMap );
			//data.chrPagesMap = Object.assign( {}, this.chrPagesMap ); // TODO: restore
			data.sram = (0, _serialisation.uintArrayToString)(this.sram);
			data.expansionRam = (0, _serialisation.uintArrayToString)(this.expansionRam);
			data._gameGeniePokes = Object.assign({}, this._gameGeniePokes);
			if (this._usingChrVram) {
				//data.chrPages = this.chrPages.map( function( page ) { return uintArrayToString( page ); } );
				data._chrData = (0, _serialisation.uintArrayToString)(this._chrData);
			}
			if (this.mapperSaveState) {
				this.mapperSaveState(data);
			}
			return data;
		}
	}, {
		key: 'loadState',
		value: function loadState(state) {
			this.mirroringMethod = state.mirroringMethod;
			this._usingChrVram = state._usingChrVram;
			//this.prgPagesMap = Object.assign( {}, state.prgPagesMap );
			// this.chrPagesMap = Object.assign( {}, state.chrPagesMap ); // TODO: restore
			this.sram = (0, _serialisation.stringToUintArray)(state.sram);
			this.expansionRam = (0, _serialisation.stringToUintArray)(state.expansionRam);
			this._gameGeniePokes = Object.assign({}, state._gameGeniePokes);
			if (this._usingChrVram) {
				this._chrData = (0, _serialisation.stringToUintArray)(state._chrData);
			}
			if (this.mapperLoadState) {
				this.mapperLoadState(state);
			}
		}
	}]);

	return BaseMapper;
}();

exports.default = BaseMapper;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trace_all = exports.trace_apu = exports.trace_mapper = exports.trace_ppu = exports.trace_cpuInstructions = exports.trace_cpu = undefined;
exports.enabled = enabled;
exports.enableType = enableType;
exports.writeLine = writeLine;
exports.start = start;
exports.stop = stop;

var _fileSaver = __webpack_require__(5);

var trace_cpu = exports.trace_cpu = 0;
var trace_cpuInstructions = exports.trace_cpuInstructions = 1;
var trace_ppu = exports.trace_ppu = 2;
var trace_mapper = exports.trace_mapper = 3;
var trace_apu = exports.trace_apu = 4;
var trace_all = exports.trace_all = 5;

var tracer = {
  lines: [],
  running: false,
  enabledTypes: new Array(trace_all + 1).fill(0)
};

function enabled() {
  return tracer.running;
}

function enableType(traceType, checked) {
  tracer.enabledTypes[traceType] = checked ? 1 : 0;
}

function writeLine(traceType, line) {
  if (tracer.running) {
    if (tracer.enabledTypes[traceType] === 1) {
      tracer.lines.push(line + '\r\n');
    }
  }
}

function start() {
  tracer.running = true;
}

function stop() {
  tracer.running = false;

  // save to file
  if (tracer.lines.length > 0) {
    var blob = new Blob(tracer.lines, {
      type: "text/plain;charset=utf-8"
    });
    (0, _fileSaver.saveAs)(blob, "trace.txt");
    tracer.lines.length = 0;
  }
}

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Event = exports.Event = function () {
  function Event() {
    _classCallCheck(this, Event);

    this._callbacks = [];
  }

  _createClass(Event, [{
    key: "addCallback",
    value: function addCallback(cb) {
      this._callbacks.push(cb);
    }
  }, {
    key: "invoke",
    value: function invoke() {
      var eventArgs = Array.prototype.slice.call(arguments, 0);
      for (var i = 0; i < this._callbacks.length; ++i) {
        this._callbacks[i].apply(this, eventArgs);
      }
    }
  }]);

  return Event;
}();

var EventBus = exports.EventBus = function () {
  function EventBus() {
    _classCallCheck(this, EventBus);

    this._map = {};
  }

  _createClass(EventBus, [{
    key: "getEvent",
    value: function getEvent(name) {
      if (!this._map[name]) {
        this._map[name] = new Event();
      }
      return this._map[name];
    }
  }, {
    key: "connect",
    value: function connect(name, cb) {
      this.getEvent(name).addCallback(cb);
    }
  }, {
    key: "invoke",
    value: function invoke(name) {
      var event = this._map[name];
      var eventArgs = [];

      if (event) {
        if (arguments.length > 1) {
          eventArgs = Array.prototype.slice.call(arguments, 1);
        }

        event.invoke.apply(event, eventArgs);
      }
    }
  }]);

  return EventBus;
}();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if (("function" !== "undefined" && __webpack_require__(82) !== null) && (__webpack_require__(83) !== null)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
    return saveAs;
  }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.OrthoCamera = exports.FillableTexture = exports.ShaderProgram = exports.IndexBuffer = exports.VertexBuffer = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.getGlContext = getGlContext;
exports.webGlSupported = webGlSupported;

var _glMat = __webpack_require__(61);

var _glMat2 = _interopRequireDefault(_glMat);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var defaultVertexShader = 'void main(void) {\n\t\t\tgl_Position = aModelViewProjectionMatrix * aVertexPosition;\n\t\t\tvTextureCoord[0] = aTextureCoord;\n\t\t}';

var defaultFragmentShader = 'uniform sampler2D rubyTexture;\n\t\tvoid main(void) {\n\t\t\tgl_FragColor = texture2D(rubyTexture, vec2(vTextureCoord[0].s, vTextureCoord[0].t));\n\t\t}';

var VertexBuffer = exports.VertexBuffer = function () {
	function VertexBuffer(glContext) {
		_classCallCheck(this, VertexBuffer);

		this._glContext = glContext;
		this._itemSize = 0;
		this._itemCount = 0;
		this._buffer = this._glContext.createBuffer();
	}

	_createClass(VertexBuffer, [{
		key: 'setData',
		value: function setData(vertices, itemSize, itemCount) {

			// ELEMENT_ARRAY_BUFFER is used by index buffer, ARRAY_BUFFER by vertex and tex coord buffers
			this._itemSize = itemSize;
			this._itemCount = itemCount;
			this._glContext.bindBuffer(this._glContext.ARRAY_BUFFER, this._buffer);
			this._glContext.bufferData(this._glContext.ARRAY_BUFFER, vertices, this._glContext.STATIC_DRAW);
		}
	}, {
		key: 'bind',
		value: function bind(positionAttribute) {
			this._glContext.bindBuffer(this._glContext.ARRAY_BUFFER, this._buffer);
			this._glContext.vertexAttribPointer(positionAttribute, this._itemSize, this._glContext.FLOAT, false, 0, 0);
		}
	}]);

	return VertexBuffer;
}();

var IndexBuffer = exports.IndexBuffer = function () {
	function IndexBuffer(glContext) {
		_classCallCheck(this, IndexBuffer);

		this._glContext = glContext;
		this._itemCount = 0;
		this._buffer = this._glContext.createBuffer();
	}

	_createClass(IndexBuffer, [{
		key: 'setData',
		value: function setData(indices, itemCount) {
			this._itemCount = itemCount;
			this._glContext.bindBuffer(this._glContext.ELEMENT_ARRAY_BUFFER, this._buffer);
			this._glContext.bufferData(this._glContext.ELEMENT_ARRAY_BUFFER, indices, this._glContext.STATIC_DRAW);
		}
	}, {
		key: 'bind',
		value: function bind() {
			this._glContext.bindBuffer(this._glContext.ELEMENT_ARRAY_BUFFER, this._buffer);
		}
	}, {
		key: 'draw',
		value: function draw() {
			this._glContext.drawElements(this._glContext.TRIANGLES, this._itemCount, this._glContext.UNSIGNED_SHORT, 0);
		}
	}]);

	return IndexBuffer;
}();

var ShaderProgram = exports.ShaderProgram = function () {
	function ShaderProgram(glContext) {
		_classCallCheck(this, ShaderProgram);

		this._fragment = null;
		this._vertex = null;

		this._glContext = glContext;
		// add some extensions - this enables fwidth() method, see https://www.khronos.org/registry/gles/extensions/OES/OES_standard_derivatives.txt
		this._glContext.getExtension('OES_standard_derivatives');

		this._uniformLocationCache = {};
		this._attribCache = {};
		this._shaderProgram = this._glContext.createProgram();
	}

	_createClass(ShaderProgram, [{
		key: '_compileShader',
		value: function _compileShader(glType, str) {

			var shader = this._glContext.createShader(glType);

			var prepend = '';

			if (str.indexOf('#version') === 0) {
				var versionString = str.substr(0, str.indexOf('\n'));
				str = str.substring(versionString.length);
				prepend += versionString;
			}

			prepend += 'precision mediump float;\n'; // Bodge precision on script
			prepend += '#extension GL_OES_standard_derivatives : enable\n';

			if (glType === this._glContext.VERTEX_SHADER) {
				// Add variables common to all vertex shaders
				prepend += 'uniform mat4 aModelViewProjectionMatrix;\n';
				prepend += 'attribute vec4 aVertexPosition;\n';
				prepend += 'attribute vec4 aTextureCoord;\n';
			}

			prepend += 'varying vec4 vTextureCoord[8];\n';

			str = prepend + str;

			this._glContext.shaderSource(shader, str);
			this._glContext.compileShader(shader);

			if (!this._glContext.getShaderParameter(shader, this._glContext.COMPILE_STATUS)) {
				throw new Error("Error compiling shader script " + this._glContext.getShaderInfoLog(shader));
			}

			return shader;
		}
	}, {
		key: '_shaderLoadSuccess',
		value: function _shaderLoadSuccess(xmlRaw, callback) {

			var fragmentStr, vertexStr;
			var fragmentXml, vertexXml;

			if (xmlRaw) {
				var xmlDoc = $(xmlRaw);
				fragmentXml = xmlDoc.find('fragment')[0];
				vertexXml = xmlDoc.find('vertex')[0];
			}

			if (fragmentXml && fragmentXml.textContent) {
				fragmentStr = fragmentXml.textContent;
			} else {
				fragmentStr = defaultFragmentShader;
			}
			if (vertexXml && vertexXml.textContent) {
				vertexStr = vertexXml.textContent;
			} else {
				vertexStr = defaultVertexShader;
			}

			if (this._fragment) {
				this._glContext.detachShader(this._shaderProgram, this._fragment);
			}
			if (this._vertex) {
				this._glContext.detachShader(this._shaderProgram, this._vertex);
			}

			this._fragment = this._compileShader(this._glContext.FRAGMENT_SHADER, fragmentStr);
			this._vertex = this._compileShader(this._glContext.VERTEX_SHADER, vertexStr);

			this._glContext.attachShader(this._shaderProgram, this._fragment);
			this._glContext.attachShader(this._shaderProgram, this._vertex);

			this._glContext.linkProgram(this._shaderProgram);

			if (!this._glContext.getProgramParameter(this._shaderProgram, this._glContext.LINK_STATUS)) {
				throw new Error(this._glContext.getProgramInfoLog(this._shaderProgram));
			}

			callback(null);
		}
	}, {
		key: 'loadAndLink',
		value: function loadAndLink(shaderFile, callback) {

			this._uniformLocationCache = {};
			this._attribCache = {};

			if (shaderFile && shaderFile.length > 0) {
				var that = this;
				$['ajax']({
					'url': 'shaders/' + shaderFile,
					'success': function success(xmlDoc) {
						that._shaderLoadSuccess(xmlDoc, callback);
					},
					'dataType': 'xml'
				});
			} else {
				this._shaderLoadSuccess(null, callback);
			}
		}
	}, {
		key: 'use',
		value: function use() {

			this._glContext.useProgram(this._shaderProgram);
		}
	}, {
		key: 'getUniformLocation',
		value: function getUniformLocation(name) {

			if (!this._uniformLocationCache.hasOwnProperty(name)) {
				this._uniformLocationCache[name] = this._glContext.getUniformLocation(this._shaderProgram, name);
			}
			return this._uniformLocationCache[name];
		}
	}, {
		key: 'getAttrib',
		value: function getAttrib(name) {

			if (!this._attribCache.hasOwnProperty(name)) {
				this._attribCache[name] = this._glContext.getAttribLocation(this._shaderProgram, name);
				this._glContext.enableVertexAttribArray(this._attribCache[name]);
			}
			return this._attribCache[name];
		}
	}]);

	return ShaderProgram;
}();

var FillableTexture = exports.FillableTexture = function () {
	function FillableTexture(glContext, width, height) {
		_classCallCheck(this, FillableTexture);

		this._glContext = glContext;
		this._texture = this._glContext.createTexture();
		this._glContext.bindTexture(this._glContext.TEXTURE_2D, this._texture);
		this._glContext.pixelStorei(this._glContext.UNPACK_FLIP_Y_WEBGL, true);
		this._glContext.texImage2D(this._glContext.TEXTURE_2D, 0, this._glContext.RGBA, width, height, 0, this._glContext.RGBA, this._glContext.UNSIGNED_BYTE, null);
	}

	_createClass(FillableTexture, [{
		key: 'bind',
		value: function bind() {
			this._glContext.activeTexture(this._glContext.TEXTURE0);
			this._glContext.bindTexture(this._glContext.TEXTURE_2D, this._texture);

			var filtering = this._glContext.LINEAR; // NEAREST for block quality, LINEAR for softer texture

			this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_MAG_FILTER, filtering);
			this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_MIN_FILTER, filtering);
			this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_WRAP_S, this._glContext.CLAMP_TO_EDGE);
			this._glContext.texParameteri(this._glContext.TEXTURE_2D, this._glContext.TEXTURE_WRAP_T, this._glContext.CLAMP_TO_EDGE);
		}
	}, {
		key: 'fill',
		value: function fill(x, y, width, height, array) {
			this._glContext.texSubImage2D(this._glContext.TEXTURE_2D, 0, x, y, width, height, this._glContext.RGBA, this._glContext.UNSIGNED_BYTE, array);
		}
	}]);

	return FillableTexture;
}();

var OrthoCamera = exports.OrthoCamera = function () {
	function OrthoCamera(glContext) {
		_classCallCheck(this, OrthoCamera);

		this._glContext = glContext;
		this._mvMatrix = _glMat2.default.create();
		this._pMatrix = _glMat2.default.create();
	}

	_createClass(OrthoCamera, [{
		key: 'setup',
		value: function setup(width, height) {
			_glMat2.default.ortho(this._pMatrix, 0, width, 0, height, 0.1, 100);
			_glMat2.default.identity(this._mvMatrix);
			_glMat2.default.translate(this._mvMatrix, this._mvMatrix, [0.0, 0.0, -0.1]);
		}
	}, {
		key: 'getMVPMatrix',
		value: function getMVPMatrix() {
			var combined = _glMat2.default.create();
			_glMat2.default.multiply(combined, this._pMatrix, this._mvMatrix);
			return combined;
		}
	}]);

	return OrthoCamera;
}();

function getGlContext(canvas) {
	return canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
}

function webGlSupported() {
	try {
		var canvas = document.createElement('canvas');
		var ctx = getGlContext(canvas);
		return ctx !== null;
	} catch (e) {
		return false;
	}
}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BlipImpulse = __webpack_require__(24);

var _BlipImpulse2 = _interopRequireDefault(_BlipImpulse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

// BlipSynth and Blip_Wave are waveform transition synthesizers for adding
// waveforms to a Blip_Buffer.

var widest_impulse_ = 24;
var blip_res_bits_ = 5;
var BLIP_BUFFER_ACCURACY = 16;
var max_res = 1 << blip_res_bits_;

// BlipSynth is a transition waveform synthesizer which adds band-limited
// offsets (transitions) into a Blip_Buffer. For a simpler interface, use
// Blip_Wave (below).
//
// Range specifies the greatest expected offset that will occur. For a
// waveform that goes between +amp and -amp, range should be amp * 2 (half
// that if it only goes between +amp and 0). When range is large, a higher
// accuracy scheme is used; to force this even when range is small, pass
// the negative of range (i.e. -range).

var BlipSynth = function () {
	function BlipSynth(quality, range) {
		_classCallCheck(this, BlipSynth);

		this.abs_range = range < 0 ? -range : range;
		this.fine_mode = range > 512 || range < 0;
		this.width = quality < 5 ? quality * 4 : widest_impulse_;
		this.res = 1 << blip_res_bits_;
		this.impulse_size = Math.floor(this.width / 2) * (this.fine_mode + 1);
		this.base_impulses_size = Math.floor(this.width / 2) * (Math.floor(this.res / 2) + 1);
		this.fine_bits = this.fine_mode ? BlipSynth.calc_fine_bits(this.abs_range) : 0;

		this.impulses = new Uint32Array(this.impulse_size * this.res * 2 + this.base_impulses_size);
		this.impulse = new _BlipImpulse2.default();

		this.impulse.init(this.impulses, this.width, this.res, this.fine_bits);
	}

	// Quality level. Higher levels are slower, and worse in a few cases.
	// Use blip_good_quality as a starting point.


	_createClass(BlipSynth, [{
		key: 'volume',


		// Set volume of a transition at amplitude 'range' by setting volume_unit
		// to v / range
		value: function volume(v) {
			this.impulse.volume_unit(v * (1.0 / this.abs_range));
		}

		// Set base volume unit of transitions, where 1.0 is a full swing between the
		// positive and negative extremes. Not optimized for real-time control.

	}, {
		key: 'volume_unit',
		value: function volume_unit(unit) {
			this.impulse.volume_unit(unit);
		}
	}, {
		key: 'output',


		// Default Blip_Buffer used for output when none is specified for a given call
		value: function output(buf) {
			if (buf === undefined) {
				return this.impulse.buf;
			} else {
				this.impulse.buf = buf;
			}
		}

		// Add an amplitude offset (transition) with a magnitude of delta * volume_unit
		// into the specified buffer (default buffer if none specified) at the
		// specified source time. Delta can be positive or negative. To increase
		// performance by inlining code at the call site, use offset_inline().

	}, {
		key: 'offset',
		value: function offset(time, delta, buf) {
			buf = buf || this.impulse.buf;
			this.offset_resampled(time * buf.factor_ + buf.offset_, delta, buf);
		}
	}, {
		key: 'offset_resampled',
		value: function offset_resampled(time, delta, blip_buf) {
			blip_buf = blip_buf || this.impulse.buf;

			var sample_index = time >> BLIP_BUFFER_ACCURACY & ~1;
			//	assert(( "BlipSynth/Blip_wave: Went past end of buffer",
			//			sample_index < blip_buf->buffer_size_ ));
			var const_offset = Math.floor(widest_impulse_ / 2) - Math.floor(this.width / 2);

			// original code cast from 16 bit array to 32 bit for this function - we can't do that
			// as it requires to modify on 16 bit boundaries so can't just pass .buffer to Uint32Array
			var buf = new Uint32Array(blip_buf.buffer_.buffer, (const_offset + sample_index) * 2);

			var shift = BLIP_BUFFER_ACCURACY - blip_res_bits_;
			var mask = this.res * 2 - 1;
			var impulsesIndex = (time >> shift & mask) * this.impulse_size;
			var imp = this.impulses.subarray(impulsesIndex);

			var offset = this.impulse.offset * delta;
			var bufIndex = 0;
			var impIndex = 0;

			if (!this.fine_bits) {
				// normal mode
				for (var n = Math.floor(this.width / 4); n > 0; --n) {

					var t0 = buf[bufIndex + 0] - offset;
					var t1 = buf[bufIndex + 1] - offset;

					t0 += imp[impIndex + 0] * delta;
					t1 += imp[impIndex + 1] * delta;
					impIndex += 2;

					buf[bufIndex + 0] = t0;
					buf[bufIndex + 1] = t1;
					bufIndex += 2;
				}
			} else {
				// fine mode
				var sub_range = 1 << this.fine_bits;
				delta += Math.floor(sub_range / 2);
				var delta2 = (delta & sub_range - 1) - Math.floor(sub_range / 2);
				delta >>= this.fine_bits;

				for (var m = Math.floor(this.width / 4); m > 0; --m) {
					var s0 = buf[bufIndex + 0] - offset;
					var s1 = buf[bufIndex + 1] - offset;

					s0 += imp[impIndex + 0] * delta2;
					s0 += imp[impIndex + 1] * delta;

					s1 += imp[impIndex + 2] * delta2;
					s1 += imp[impIndex + 3] * delta;

					impIndex += 4;

					buf[bufIndex + 0] = s0;
					buf[bufIndex + 1] = s1;
					bufIndex += 2;
				}
			}
		}
	}, {
		key: 'offset_inline',
		value: function offset_inline(time, delta, buf) {
			buf = buf || this.impulse.buf;
			this.offset_resampled(time * buf.factor_ + buf.offset_, delta, buf);
		}
	}], [{
		key: 'calc_fine_bits',
		value: function calc_fine_bits(abs_range) {
			return abs_range <= 64 ? 2 : abs_range <= 128 ? 3 : abs_range <= 256 ? 4 : abs_range <= 512 ? 5 : abs_range <= 1024 ? 6 : abs_range <= 2048 ? 7 : 8;
		}
	}]);

	return BlipSynth;
}();

BlipSynth.blip_low_quality = 1;
BlipSynth.blip_med_quality = 2;
BlipSynth.blip_good_quality = 3;
BlipSynth.blip_high_quality = 4;
exports.default = BlipSynth;

/***/ }),
/* 8 */
/***/ (function(module, exports) {

var charenc = {
  // UTF-8 encoding
  utf8: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      return charenc.bin.stringToBytes(unescape(encodeURIComponent(str)));
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      return decodeURIComponent(escape(charenc.bin.bytesToString(bytes)));
    }
  },

  // Binary encoding
  bin: {
    // Convert a string to a byte array
    stringToBytes: function(str) {
      for (var bytes = [], i = 0; i < str.length; i++)
        bytes.push(str.charCodeAt(i) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a string
    bytesToString: function(bytes) {
      for (var str = [], i = 0; i < bytes.length; i++)
        str.push(String.fromCharCode(bytes[i]));
      return str.join('');
    }
  }
};

module.exports = charenc;


/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = identity;

/**
 * Set a mat4 to the identity matrix
 *
 * @param {mat4} out the receiving matrix
 * @returns {mat4} out
 */
function identity(out) {
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _stats = __webpack_require__(81);

var _stats2 = _interopRequireDefault(_stats);

var _Event = __webpack_require__(4);

var _Mainboard = __webpack_require__(31);

var _Mainboard2 = _interopRequireDefault(_Mainboard);

var _Cartridge = __webpack_require__(30);

var _Cartridge2 = _interopRequireDefault(_Cartridge);

var _Trace = __webpack_require__(3);

var _Trace2 = _interopRequireDefault(_Trace);

var _loadRom = __webpack_require__(49);

var _gameGenie = __webpack_require__(48);

var _CanvasParent = __webpack_require__(12);

var _CanvasParent2 = _interopRequireDefault(_CanvasParent);

var _HeadlessRenderSurface = __webpack_require__(16);

var _HeadlessRenderSurface2 = _interopRequireDefault(_HeadlessRenderSurface);

var _WebGlRenderSurface = __webpack_require__(19);

var _WebGlRenderSurface2 = _interopRequireDefault(_WebGlRenderSurface);

var _utils = __webpack_require__(6);

var _CanvasRenderSurface = __webpack_require__(15);

var _CanvasRenderSurface2 = _interopRequireDefault(_CanvasRenderSurface);

var _consts = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var nES6 = function () {
  function nES6(options) {
    var _this = this;

    _classCallCheck(this, nES6);

    this._options = options || {};

    this._cart = null;
    this._romLoaded = false;
    this._mainboard = null;
    this._renderSurface = null;
    this._fpsMeter = null;
    this._spriteDisplay = null;
    this._paletteDisplay = null;
    this._logWindow = null;
    this._encodingTypeToSet = '';
    this._newRomWaiting = false;
    this._newRomLoaded = {
      name: '',
      binaryString: null
    };
    this._eventBus = new _Event.EventBus();

    this._frameTimeTarget = 0;
    this._lastFrameTime = 0;
    this._gameSpeed = 100; // 100% normal speed

    this._isPaused = 0;
    this._pauseNextFrame = false;
    this._pauseOnFrame = -1;

    this.animate = this._animate.bind(this);

    window.onerror = this._showError.bind(this);

    // Apply plugins
    if (this._options.plugins) {
      if (!(this._options.plugins instanceof Array)) {
        throw new Error('nES6 plugins must be an array!');
      }

      // Pass this nES6 instance to each plugin
      this._options.plugins.map(function (plugin) {
        return plugin(_this);
      });
    }
  }

  _createClass(nES6, [{
    key: 'connect',
    value: function connect(name, cb) {
      this._eventBus.connect(name, cb);
    }
  }, {
    key: 'setColourEncodingType',
    value: function setColourEncodingType(encodingType) {
      this._encodingTypeToSet = encodingType;
    }
  }, {
    key: '_loadRomCallback',
    value: function _loadRomCallback(name, binaryString) {
      this._newRomWaiting = true;
      this._newRomLoaded = {
        name: name,
        binaryString: binaryString,
        fileSize: binaryString.length / 1000 // in KB
      };
    }
  }, {
    key: 'start',
    value: function start() {
      this._fpsMeter = new _stats2.default();
      this._fpsMeter.showPanel(1);
      document.body.appendChild(this._fpsMeter.dom);

      this._canvasParent = new _CanvasParent2.default();
      this._renderSurface = null;

      switch (this._options['render']) {
        // headless render
        case 'headless':
          this._renderSurface = new _HeadlessRenderSurface2.default();
          break;
        // canvas render
        case 'canvas':
          this._renderSurface = new _CanvasRenderSurface2.default(this._canvasParent);
          break;
        // webgl is the same as auto - webgl will run if possible but will
        // fallback to canvas automatically
        case 'webgl':
        case 'auto':
        default:
          if ((0, _utils.webGlSupported)()) {
            this._renderSurface = new _WebGlRenderSurface2.default(this._canvasParent);
          } else {
            this._renderSurface = new _CanvasRenderSurface2.default(this._canvasParent);
          }
          break;
      }

      this._mainboard = new _Mainboard2.default(this._renderSurface);
      this._mainboard.connect('reset', this._onReset.bind(this));

      // disable audio for headless rendering
      if (this._options['render'] === 'headless') {
        this._mainboard.enableSound(false);
      }

      this.animate();
    }
  }, {
    key: 'pause',
    value: function pause(isPaused) {
      var changed = isPaused !== this._isPaused;
      this._isPaused = isPaused;

      if (changed) {
        this._eventBus.invoke('isPausedChange', isPaused);
      }
    }
  }, {
    key: 'isPaused',
    value: function isPaused() {
      return this._isPaused;
    }
  }, {
    key: '_onReset',
    value: function _onReset() {
      this._calculateFrameTimeTarget();
    }
  }, {
    key: '_calculateFrameTimeTarget',
    value: function _calculateFrameTimeTarget() {
      if (this._gameSpeed) {
        var base = 100000 / this._gameSpeed; // 100000 = 1000 * 100 ( 1000 milliseconds, multiplied by 100 as gameSpeed is a %)
        this._frameTimeTarget = base / _consts.COLOUR_ENCODING_REFRESHRATE;
      }
    }
  }, {
    key: 'reset',
    value: function reset() {
      this._mainboard.reset();
    }
  }, {
    key: 'playOneFrame',
    value: function playOneFrame() {
      this.pause(false);
      this._pauseNextFrame = true;
    }
  }, {
    key: 'playUntilFrame',
    value: function playUntilFrame(frameNum) {
      this.pause(false);
      this._pauseOnFrame = frameNum;
    }
  }, {
    key: 'enableSound',
    value: function enableSound(enable) {
      this._mainboard.enableSound(enable);
    }
  }, {
    key: 'soundEnabled',
    value: function soundEnabled() {
      return this._mainboard.apu.soundEnabled();
    }
  }, {
    key: 'soundSupported',
    value: function soundSupported() {
      return this._mainboard.apu.soundSupported();
    }
  }, {
    key: 'setVolume',
    value: function setVolume(val) {
      this._mainboard.setVolume(val);
    }
  }, {
    key: 'setGameSpeed',
    value: function setGameSpeed(gameSpeed) {
      this._gameSpeed = gameSpeed;
      this._calculateFrameTimeTarget();
    }
  }, {
    key: 'setTraceOption',
    value: function setTraceOption(traceType, checked) {
      this._mainboard.setTraceOption(traceType, checked);
    }
  }, {
    key: '_readyToRender',
    value: function _readyToRender() {
      if (this._gameSpeed <= 0) {
        return true;
      }
      var now = performance ? performance.now() : Date.now(); // Date.now() in unsupported browsers
      var diff = now - (this._lastFrameTime || 0);
      if (diff >= this._frameTimeTarget) {
        this._lastFrameTime = now;
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: 'showFpsMeter',
    value: function showFpsMeter(show) {
      if (show) {
        // this._fpsMeter.show();
      } else {
          // this._fpsMeter.hide();
        }
    }
  }, {
    key: 'startTrace',
    value: function startTrace() {
      this._eventBus.invoke('traceRunning', true);
      // if ( traceType === 'cpuInstructions' ) {
      this._mainboard.cpu.enableTrace(true);
      // }
      _Trace2.default.start();
    }
  }, {
    key: 'stopTrace',
    value: function stopTrace() {
      _Trace2.default.stop();
      this._mainboard.cpu.enableTrace(false);
      this._eventBus.invoke('traceRunning', false);
    }
  }, {
    key: 'screenshot',
    value: function screenshot() {
      this._renderSurface.screenshotToFile();
    }
  }, {
    key: '_animate',
    value: function _animate() {
      if (this._gameSpeed !== 100 && !this._readyToRender()) {
        requestAnimationFrame(this.animate);
        return;
      }

      if (this._fpsMeter) {
        this._fpsMeter.begin();
      }

      if (this._newRomWaiting) {
        this._doRomLoad(this._newRomLoaded);
        this._newRomWaiting = false;
      }

      if (this._romLoaded) {
        this._romLoaded = false;
        this._mainboard.loadCartridge(this._cart);
        this._eventBus.invoke('cartLoaded', this._cart);
      }

      if (this._isPaused) {
        if (this._fpsMeter) {
          this._fpsMeter.end();
        }
        setTimeout(this.animate, 300);
        return;
      }

      var bgColour = this._mainboard.renderBuffer.pickColour(this._mainboard.ppu.getBackgroundPaletteIndex());
      this._renderSurface.clearBuffers(bgColour);
      this._mainboard.renderBuffer.clearBuffer();

      this._mainboard.doFrame();
      this._renderSurface.render(this._mainboard);

      if (this._fpsMeter) {
        this._fpsMeter.end();
      }

      requestAnimationFrame(this.animate);
    }
  }, {
    key: 'exportState',
    value: function exportState() {
      return this._mainboard.saveState();
    }
  }, {
    key: 'importState',
    value: function importState(loadedData) {
      return this._mainboard.importState(loadedData);
    }
  }, {
    key: '_doRomLoad',
    value: function _doRomLoad(_ref) {
      var _this2 = this;

      var name = _ref.name,
          binaryString = _ref.binaryString,
          fileSize = _ref.fileSize;

      this._cart = new _Cartridge2.default(this._mainboard);
      this._cart.loadRom({
        name: name,
        binaryString: binaryString,
        fileSize: fileSize
      }).catch(this._showError.bind(this)).then(function () {
        _this2._romLoaded = true;
      });
    }
  }, {
    key: 'loadRomFromUrl',
    value: function loadRomFromUrl(url) {
      var that = this;
      (0, _loadRom.loadRomFromUrl)(url, function (err, name, binary) {
        if (!err) {
          that._loadRomCallback(name, binary);
        } else {
          that._showError(err);
        }
      });
    }
  }, {
    key: '_showError',
    value: function _showError(err) {
      console.log(err);
      var errorType = typeof err === 'undefined' ? 'undefined' : _typeof(err);
      var msg = '';
      if (errorType === 'string') {
        msg = err;
      } else if (errorType === 'object') {
        if (err.message) {
          msg = err.message;
        } else {
          msg = err.toString();
        }
      } else {
        msg = err.toString();
      }
      this._eventBus.invoke('romLoadFailure', msg);
    }
  }, {
    key: 'enterGameGenieCode',
    value: function enterGameGenieCode(code) {
      (0, _gameGenie.processGenieCode)(this._mainboard, code, true);
    }
  }, {
    key: 'loadShaderFromUrl',
    value: function loadShaderFromUrl(url) {
      if (this._renderSurface.loadShaderFromUrl) {
        this._renderSurface.loadShaderFromUrl(url);
      }
    }
  }, {
    key: 'pressControllerButton',
    value: function pressControllerButton(playerNum, button) {
      var joypad = this._mainboard.inputdevicebus.getJoypad(playerNum);
      var buttonIdPressed = (0, _consts.JOYPAD_NAME_TO_ID)(button);

      if (typeof buttonIdPressed !== 'undefined') {
        joypad.pressButton(buttonIdPressed, true);
      }
    }
  }, {
    key: 'depressControllerButton',
    value: function depressControllerButton(playerNum, button) {
      var joypad = this._mainboard.inputdevicebus.getJoypad(playerNum);
      var buttonIdPressed = (0, _consts.JOYPAD_NAME_TO_ID)(button);

      if (typeof buttonIdPressed !== 'undefined') {
        joypad.pressButton(buttonIdPressed, false);
      }
    }
  }]);

  return nES6;
}();

exports.default = nES6;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _consts = __webpack_require__(0);

var _Event = __webpack_require__(4);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasParent = function () {
	function CanvasParent(renderSurface) {
		var _this = this;

		_classCallCheck(this, CanvasParent);

		var that = this;

		this._eventBus = new _Event.EventBus();
		this._parent = document.createElement('div');
		this._parent.style.cssText = 'position: absolute; height: 100%; width: 100%; top: 0px; bottom: 0px;';
		this._element = document.createElement('div');
		this._parent.appendChild(this._element);

		this._canvasElement = document.createElement('canvas');
		this._element.appendChild(this._canvasElement);

		document.body.appendChild(this._parent);

		this._setSize();

		window.addEventListener('resize', function () {
			_this._setSize();
			_this._setPosition();
		}, true);

		this._setPosition();
	}

	_createClass(CanvasParent, [{
		key: 'connect',
		value: function connect(name, cb) {
			this._eventBus.connect(name, cb);
		}
	}, {
		key: 'getCanvasElement',
		value: function getCanvasElement() {
			return this._canvasElement;
		}
	}, {
		key: '_setSize',
		value: function _setSize() {

			var parentBounds = this._parent.getBoundingClientRect();
			var parentWidth = parentBounds.width;
			var parentHeight = parentBounds.height;

			var resizeType = 'keepAspectRatio';

			if (resizeType === 'keepAspectRatio') {

				var aspectRatio = _consts.SCREEN_WIDTH / _consts.SCREEN_HEIGHT;
				var newWidth = aspectRatio * parentHeight;

				this._canvasElement.width = Math.floor(newWidth);
				this._canvasElement.height = parentHeight;

				this._eventBus.invoke('resize');
			}
		}
	}, {
		key: '_setPosition',
		value: function _setPosition() {
			this._element.style.cssText = 'transform: translate(-50%, -50%); position: absolute; left: 50%; top: 50%;';
		}
	}]);

	return CanvasParent;
}();

exports.default = CanvasParent;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebAudioBuffer = function () {
	function WebAudioBuffer(audioContext, masterVolNode, size) {
		_classCallCheck(this, WebAudioBuffer);

		this._locked = false;
		this.audioContext = audioContext;

		this.audioNode = null;
		this._gainNode = this.audioContext['createGain']();
		this._gainNode['connect'](masterVolNode);

		this.audioBuffer = this.audioContext['createBuffer'](1, size, this.audioContext['sampleRate']);
	}

	_createClass(WebAudioBuffer, [{
		key: 'lockBuffer',
		value: function lockBuffer() {
			this._locked = true;
			return this.audioBuffer['getChannelData'](0);
		}
	}, {
		key: 'unlockBuffer',
		value: function unlockBuffer() {
			this._locked = false;

			// Alternative method using audio node buffer instead of onaudioprocess
			if (this.audioNode) {
				this.audioNode['disconnect']();
				this.audioNode = null;
			}
			this.audioNode = this.audioContext['createBufferSource']();
			this.audioNode['buffer'] = this.audioBuffer;

			this.audioNode['connect'](this._gainNode);
			this.audioNode['start'](0);
		}
	}]);

	return WebAudioBuffer;
}();

exports.default = WebAudioBuffer;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _WebAudioBuffer = __webpack_require__(13);

var _WebAudioBuffer2 = _interopRequireDefault(_WebAudioBuffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var WebAudioRenderer = function () {
	function WebAudioRenderer(bufferSize, sampleRate) {
		_classCallCheck(this, WebAudioRenderer);

		window.AudioContext = window.AudioContext || window.webkitAudioContext;
		if (window.AudioContext === undefined) {
			throw new Error("WebAudio not supported in this browser");
		}
		this.audioContext = new window.AudioContext();
		this._gainNode = this.audioContext['createGain']();
		this._gainNode['connect'](this.audioContext['destination']);
	}

	_createClass(WebAudioRenderer, [{
		key: 'setVolume',
		value: function setVolume(val) {
			if (this._gainNode) {
				this._gainNode['gain']['value'] = val / 100;
			}
		}
	}, {
		key: 'getSampleRate',
		value: function getSampleRate() {
			return this.audioContext['sampleRate'];
		}
	}, {
		key: 'createBuffer',
		value: function createBuffer(size) {
			return new _WebAudioBuffer2.default(this.audioContext, this._gainNode, size);
		}
	}]);

	return WebAudioRenderer;
}();

exports.default = WebAudioRenderer;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fileSaver = __webpack_require__(5);

var _serialisation = __webpack_require__(1);

var _consts = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasRenderSurface = function () {
	function CanvasRenderSurface(canvasParent) {
		_classCallCheck(this, CanvasRenderSurface);

		this._clearArray = new Uint32Array(_consts.SCREEN_WIDTH * _consts.SCREEN_HEIGHT);
		this._clearArrayColour = this._clearArray[0];

		this._bufferIndexArray = new Int32Array(_consts.SCREEN_WIDTH * _consts.SCREEN_HEIGHT);

		this._offscreenElement = document.createElement('canvas');
		this._offscreenElement.width = _consts.SCREEN_WIDTH;
		this._offscreenElement.height = _consts.SCREEN_HEIGHT;
		this._offscreenCanvas = this._offscreenElement.getContext("2d");
		//this._offscreenCanvas.imageSmoothingEnabled = false;
		this._offscreenData = this._offscreenCanvas.getImageData(0, 0, _consts.SCREEN_WIDTH, _consts.SCREEN_HEIGHT);

		if (!this._offscreenData.data.buffer) {
			throw new Error("Browser does not support canvas image buffers. Cannot run emulator");
		}
		// Chrome & Firefox support passing the underlying image data buffer to Uint32Array(). IE does not.
		this._offscreen32BitView = new Uint32Array(this._offscreenData.data.buffer);
		if (this._offscreen32BitView.length !== this._clearArray.length) {
			throw new Error("Unexpected canvas buffer size (actual=" + this._offscreen32BitView.length + ")");
		}

		this._element = canvasParent.getCanvasElement();
		this._canvas = this._element.getContext("2d");
		//this._canvas.imageSmoothingEnabled = false;
	}

	_createClass(CanvasRenderSurface, [{
		key: 'writeToBuffer',
		value: function writeToBuffer(bufferIndex, insertIndex, colour) {
			var existingIndex = this._bufferIndexArray[insertIndex];
			if (existingIndex <= bufferIndex) {
				this._offscreen32BitView[insertIndex] = 0xFF000000 | colour;
				this._bufferIndexArray[insertIndex] = bufferIndex;
			}
		}
	}, {
		key: 'getRenderBufferHash',
		value: function getRenderBufferHash() {
			return _serialisation.rusha.digestFromArrayBuffer(this._offscreen32BitView).toUpperCase();
		}
	}, {
		key: 'clearBuffers',
		value: function clearBuffers(backgroundColour) {

			var i = 0;
			// update clear array if background colour changes
			if (backgroundColour !== this._clearArrayColour) {
				for (i = 0; i < this._clearArray.length; ++i) {
					this._clearArray[i] = 0xFF000000 | backgroundColour;
				}
				this._clearArrayColour = backgroundColour;
			}

			// set background colour
			this._offscreen32BitView.set(this._clearArray);

			// Nes.ClearScreenArray is a quicker way of clearing this array
			this._bufferIndexArray.set(_consts.g_ClearScreenArray);
		}
	}, {
		key: 'render',
		value: function render(mainboard) {

			this._offscreenCanvas.putImageData(this._offscreenData, 0, 0);
			// Draw offscreen canvas onto front buffer, resizing it in the process
			this._canvas.drawImage(this._offscreenElement, 0, 0, this._element.clientWidth, this._element.clientHeight);
		}
	}, {
		key: 'screenshotToFile',
		value: function screenshotToFile() {

			this._offscreenElement.toBlob(function (blob) {
				(0, _fileSaver.saveAs)(blob, "screenshot.png");
			});
		}
	}, {
		key: 'screenshotToString',
		value: function screenshotToString() {

			return this._offscreenElement.toDataURL("image/png");
		}
	}]);

	return CanvasRenderSurface;
}();

exports.default = CanvasRenderSurface;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _serialisation = __webpack_require__(1);

var _consts = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var HeadlessRenderSurface = function () {
	function HeadlessRenderSurface() {
		_classCallCheck(this, HeadlessRenderSurface);

		this._buffer = new Uint32Array(_consts.SCREEN_WIDTH * _consts.SCREEN_HEIGHT);
	}

	_createClass(HeadlessRenderSurface, [{
		key: 'writeToBuffer',
		value: function writeToBuffer(bufferIndex, insertIndex, colour) {
			this._buffer[insertIndex] = 0xFF000000 | colour;
		}
	}, {
		key: 'clearBuffers',
		value: function clearBuffers(backgroundColour) {
			for (var i = 0; i < this._buffer.length; ++i) {
				this._buffer[i] = 0xFF000000 | backgroundColour;
			}
		}
	}, {
		key: 'getRenderBufferHash',
		value: function getRenderBufferHash() {
			return _serialisation.rusha.digestFromArrayBuffer(this._buffer).toUpperCase();
		}
	}, {
		key: 'render',
		value: function render() {}
	}, {
		key: 'screenshot',
		value: function screenshot() {}
	}, {
		key: 'screenshotToString',
		value: function screenshotToString() {
			return '';
		}
	}]);

	return HeadlessRenderSurface;
}();

exports.default = HeadlessRenderSurface;

/***/ }),
/* 17 */,
/* 18 */,
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _consts = __webpack_require__(0);

var _fileSaver = __webpack_require__(5);

var _serialisation = __webpack_require__(1);

var _utils = __webpack_require__(6);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Must be power of 2
var TEXTURE_WIDTH = 256;
var TEXTURE_HEIGHT = 256;

var WebGlRenderSurface = function () {
	function WebGlRenderSurface(canvasParent) {
		var _this = this;

		_classCallCheck(this, WebGlRenderSurface);

		this._ready = false;

		this._clearArray = new Uint32Array(_consts.SCREEN_WIDTH * _consts.SCREEN_HEIGHT);
		this._clearArrayColour = this._clearArray[0];

		this._bufferIndexArray = new Int32Array(_consts.SCREEN_WIDTH * _consts.SCREEN_HEIGHT);
		this._offscreen32BitView = new Uint32Array(TEXTURE_WIDTH * TEXTURE_HEIGHT);
		this._offscreen8BitView = new Uint8Array(this._offscreen32BitView.buffer);

		this._element = canvasParent.getCanvasElement();
		this._glContext = (0, _utils.getGlContext)(this._element);

		this._camera = new _utils.OrthoCamera(this._glContext);
		this._camera.setup(_consts.SCREEN_WIDTH, _consts.SCREEN_HEIGHT);

		this._initBuffers();

		this._texture = new _utils.FillableTexture(this._glContext, TEXTURE_WIDTH, TEXTURE_HEIGHT);

		canvasParent.connect('resize', this._onResize.bind(this));

		this._inputSizeShaderArray = new Float32Array([_consts.SCREEN_WIDTH, _consts.SCREEN_HEIGHT]);
		this._outputSizeShaderArray = new Float32Array([_consts.SCREEN_WIDTH, _consts.SCREEN_HEIGHT]);
		this._textureSizeShaderArray = new Float32Array([TEXTURE_WIDTH, TEXTURE_HEIGHT]);

		this._shader = new _utils.ShaderProgram(this._glContext);

		this.loadShader(null, function () {
			_this._ready = true;
		});
	}

	_createClass(WebGlRenderSurface, [{
		key: 'loadShader',
		value: function loadShader(shaderFilename, callback) {

			var that = this;
			this._shader.loadAndLink(shaderFilename, function () {
				that._shader.use();

				that._glContext.uniform2fv(that._shader.getUniformLocation("rubyInputSize"), that._inputSizeShaderArray);
				that._glContext.uniform2fv(that._shader.getUniformLocation("rubyOutputSize"), that._outputSizeShaderArray);
				that._glContext.uniform2fv(that._shader.getUniformLocation("rubyTextureSize"), that._textureSizeShaderArray);

				that._glContext.uniformMatrix4fv(that._shader.getUniformLocation("aModelViewProjectionMatrix"), false, that._camera.getMVPMatrix());

				that._vertexBuffer.bind(that._shader.getAttrib("aVertexPosition"));
				that._textureCoordBuffer.bind(that._shader.getAttrib("aTextureCoord"));
				that._indexBuffer.bind();
				that._texture.bind();

				that._glContext.uniform1i(that._shader.getUniformLocation("rubyTexture"), 0); //Texture unit 0 is for base images.

				callback();
			});
		}
	}, {
		key: '_initBuffers',
		value: function _initBuffers() {
			var t = _consts.SCREEN_WIDTH / TEXTURE_WIDTH;
			var u = _consts.SCREEN_HEIGHT / TEXTURE_HEIGHT;

			var vertices = new Float32Array([0, 0, 0.0, 1.0, _consts.SCREEN_WIDTH, 0, 0.0, 1.0, _consts.SCREEN_WIDTH, _consts.SCREEN_HEIGHT, 0.0, 1.0, 0, _consts.SCREEN_HEIGHT, 0.0, 1.0]);
			var texCoords = new Float32Array([0.0, 0.0, t, 0.0, t, u, 0.0, u]);
			var indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

			this._vertexBuffer = new _utils.VertexBuffer(this._glContext);
			this._vertexBuffer.setData(vertices, 4, 4);

			this._textureCoordBuffer = new _utils.VertexBuffer(this._glContext);
			this._textureCoordBuffer.setData(texCoords, 2, 4);

			this._indexBuffer = new _utils.IndexBuffer(this._glContext);
			this._indexBuffer.setData(indices, 6);
		}
	}, {
		key: '_onResize',
		value: function _onResize() {
			this._glContext.viewport(0, 0, this._element.width, this._element.height);
			this._glContext.clearColor(0.0, 0.0, 0.0, 1.0);
		}
	}, {
		key: 'writeToBuffer',
		value: function writeToBuffer(bufferIndex, insertIndex, colour) {

			var existingIndex = this._bufferIndexArray[insertIndex];
			if (existingIndex <= bufferIndex) {
				this._offscreen32BitView[insertIndex] = 0xFF000000 | colour;
				this._bufferIndexArray[insertIndex] = bufferIndex;
			}
		}
	}, {
		key: 'getRenderBufferHash',
		value: function getRenderBufferHash() {
			return _serialisation.rusha.digestFromArrayBuffer(this._offscreen32BitView).toUpperCase();
		}
	}, {
		key: 'clearBuffers',
		value: function clearBuffers(backgroundColour) {

			// update clear array if background colour changes
			if (backgroundColour !== this._clearArrayColour) {
				for (var i = 0; i < this._clearArray.length; ++i) {
					this._clearArray[i] = 0xFF000000 | backgroundColour;
				}
				this._clearArrayColour = backgroundColour;
			}

			// set background colour
			this._offscreen32BitView.set(this._clearArray);

			// Nes.ClearScreenArray is a quicker way of clearing this array
			this._bufferIndexArray.set(_consts.g_ClearScreenArray);
		}
	}, {
		key: 'render',
		value: function render(mainboard) {

			if (!this._ready) {
				return;
			}
			this._glContext.clear(this._glContext.COLOR_BUFFER_BIT);
			this._texture.fill(0, 0, _consts.SCREEN_WIDTH, _consts.SCREEN_HEIGHT, this._offscreen8BitView);
			this._glContext.uniform1i(this._shader.getUniformLocation("rubyFrameCount"), mainboard.ppu.frameCounter);
			this._indexBuffer.draw();
		}
	}, {
		key: '_createCanvasWithScreenshotOn',
		value: function _createCanvasWithScreenshotOn() {

			// create copy of offscreen buffer into a new canvas element
			var element = document.createElement('canvas');
			element.width = _consts.SCREEN_WIDTH;
			element.height = _consts.SCREEN_HEIGHT;
			var canvas = element.getContext("2d");
			var imgData = canvas.getImageData(0, 0, _consts.SCREEN_WIDTH, _consts.SCREEN_HEIGHT);
			imgData.data.set(this._offscreen8BitView.subarray(0, _consts.SCREEN_WIDTH * _consts.SCREEN_HEIGHT * 4));
			canvas.putImageData(imgData, 0, 0);
			return element;
		}
	}, {
		key: 'screenshotToFile',
		value: function screenshotToFile() {
			var element = this._createCanvasWithScreenshotOn();
			element.toBlob(function (blob) {
				(0, _fileSaver.saveAs)(blob, "screenshot.png");
			});
		}
	}, {
		key: 'screenshotToString',
		value: function screenshotToString() {
			var element = this._createCanvasWithScreenshotOn();
			return element.toDataURL("image/png");
		}
	}, {
		key: 'loadShaderFromUrl',
		value: function loadShaderFromUrl(url) {
			this.loadShader(url, function () {});
		}
	}]);

	return WebGlRenderSurface;
}();

exports.default = WebGlRenderSurface;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.irq_waiting = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* Copyright (C) 2003-2005 Shay Green. This module is free software; you
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     can redistribute it and/or modify it under the terms of the GNU Lesser
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     General Public License as published by the Free Software Foundation; either
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     version 2.1 of the License, or (at your option) any later version. This
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     module is distributed in the hope that it will be useful, but WITHOUT ANY
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     more details. You should have received a copy of the GNU Lesser General
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     Public License along with this module; if not, write to the Free Software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA */

// NES 2A03 APU sound chip emulator

// Nes_Snd_Emu 0.1.7. Copyright (C) 2003-2005 Shay Green. GNU LGPL license.

var _Tones = __webpack_require__(25);

var _BlipSynth = __webpack_require__(7);

var _BlipSynth2 = _interopRequireDefault(_BlipSynth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var osc_count = 5;
var start_addr = 0x4000;
var end_addr = 0x4017;
var no_irq = 1073741824;
var irq_waiting = exports.irq_waiting = 0;

// registers
var length_table = [0x0A, 0xFE, 0x14, 0x02, 0x28, 0x04, 0x50, 0x06, 0xA0, 0x08, 0x3C, 0x0A, 0x0E, 0x0C, 0x1A, 0x0E, 0x0C, 0x10, 0x18, 0x12, 0x30, 0x14, 0x60, 0x16, 0xC0, 0x18, 0x48, 0x1A, 0x10, 0x1C, 0x20, 0x1E];

var APU = function () {
	function APU() {
		_classCallCheck(this, APU);

		this.start_addr = start_addr;
		this.end_addr = end_addr;
		this.status_addr = 0x4015;

		this._square1 = new _Tones.Square();
		this._square2 = new _Tones.Square();
		this._triangle = new _Tones.Triangle();
		this._noise = new _Tones.Noise();
		this._dmc = new _Tones.Dmc();
		this.osc = [this._square1, this._square2, this._triangle, this._noise, this._dmc];

		this.last_time = 0; // has been run until this time in current frame
		this.earliest_irq_ = 0;
		this.next_irq = 0;

		this._square_synth = new _BlipSynth2.default(_BlipSynth2.default.blip_good_quality, 15);
		this._irqCallback = null;
		this.frame_mode = 0;
		this.frame = 0;

		this._dmc.apu = this;
		this._dmc.rom_reader = null;
		this._square1.synth = this._square_synth;
		this._square2.synth = this._square_synth;

		this.output(null);
		this.volume(1.0);
		this.reset(false);
	}

	// Reset internal frame counter, registers, and all oscillators.
	// Use PAL timing if pal_timing is true, otherwise use NTSC timing.
	// Set the DMC oscillator's initial DAC value to initial_dmc_dac without
	// any audible click.


	_createClass(APU, [{
		key: 'reset',
		value: function reset(pal_mode, initial_dmc_dac) {
			pal_mode = pal_mode || false;
			initial_dmc_dac = initial_dmc_dac || 0;

			// to do: time pal frame periods exactly
			this.frame_period = pal_mode ? 8314 : 7458;
			this._dmc.pal_mode = pal_mode ? 1 : 0;

			this._square1.reset();
			this._square2.reset();
			this._triangle.reset();
			this._noise.reset();
			this._dmc.reset();

			this.last_time = 0;
			this.osc_enables = 0;
			this.irq_flag = false;
			this.earliest_irq_ = no_irq;
			this.frame_delay = 1; // cycles until frame counter runs next
			this.write_register(0, 0x4017, 0x00);
			this.write_register(0, 0x4015, 0x00);

			for (var addr = start_addr; addr <= 0x4013; addr++) {
				this.write_register(0, addr, addr & 3 ? 0x00 : 0x10);
			}

			this._dmc.dac = initial_dmc_dac;
			if (!this._dmc.nonlinear) {
				this._dmc.last_amp = initial_dmc_dac; // prevent output transition
			}
		}

		// Set buffer to generate all sound into, or disable sound if NULL

	}, {
		key: 'output',
		value: function output(buffer) {
			for (var i = 0; i < osc_count; i++) {
				this.osc_output(i, buffer);
			}
		}

		// Set memory reader callback used by DMC oscillator to fetch samples.
		// When callback is invoked, 'user_data' is passed unchanged as the
		// first parameter.

	}, {
		key: 'dmc_reader',
		value: function dmc_reader(dmcCallback) {
			this._dmc.rom_reader = dmcCallback;
		}

		// All time values are the number of CPU clock cycles relative to the
		// beginning of the current time frame. Before resetting the CPU clock
		// count, call end_frame( last_cpu_time ).
		// Write to register (0x4000-0x4017, except 0x4014 and 0x4016)

	}, {
		key: 'write_register',
		value: function write_register(time, addr, data) {

			//	require( addr > 0x20 ); // addr must be actual address (i.e. 0x40xx)
			//	require( (unsigned) data <= 0xff );

			// Ignore addresses outside range
			if (addr < start_addr || end_addr < addr) {
				return;
			}

			this.run_until(time);

			if (addr < 0x4014) {
				// Write to channel
				var osc_index = addr - start_addr >> 2;
				var osc = this.osc[osc_index];

				var reg = addr & 3;
				osc.regs[reg] = data;
				osc.reg_written[reg] = true;

				if (osc_index === 4) {
					// handle DMC specially
					this._dmc.write_register(reg, data);
				} else if (reg === 3) {
					// load length counter
					if (this.osc_enables >> osc_index & 1) {
						osc.length_counter = length_table[data >> 3 & 0x1f];
					}

					// reset square phase
					if (osc_index < 2) {
						osc.phase = _Tones.Square.phase_range - 1;
					}
				}
			} else if (addr === 0x4015) {
				// Channel enables
				for (var i = 0; i < osc_count; ++i) {
					var enabled = data >> i & 1;
					if (enabled === 0) {
						this.osc[i].length_counter = 0;
					}
				}

				var recalc_irq = this._dmc.irq_flag;
				this._dmc.irq_flag = false;

				var old_enables = this.osc_enables;
				this.osc_enables = data;
				if (!(data & 0x10)) {
					this._dmc.next_irq = no_irq;
					recalc_irq = true;
				} else if (!(old_enables & 0x10)) {
					this._dmc.start(); // dmc just enabled
				}

				if (recalc_irq) {
					this.irq_changed();
				}
			} else if (addr === 0x4017) {
				// Frame mode
				this.frame_mode = data;

				var irq_enabled = !(data & 0x40);
				this.irq_flag &= irq_enabled;
				this.next_irq = no_irq;

				// mode 1
				this.frame_delay = this.frame_delay & 1;
				this.frame = 0;

				if (!(data & 0x80)) {
					// mode 0
					this.frame = 1;
					this.frame_delay += this.frame_period;
					if (irq_enabled) {
						this.next_irq = time + this.frame_delay + this.frame_period * 3;
					}
				}

				this.irq_changed();
			}
		}

		// Read from status register at 0x4015

	}, {
		key: 'read_status',
		value: function read_status(time) {

			this.run_until(time - 1);

			var result = (this._dmc.irq_flag ? 0x80 : 0) | (this.irq_flag ? 0x40 : 0);

			for (var i = 0; i < osc_count; i++) {
				if (this.osc[i].length_counter > 0) {
					result |= 1 << i;
				}
			}

			this.run_until(time);

			if (this.irq_flag) {
				this.irq_flag = false;
				this.irq_changed();
			}

			return result;
		}

		// Run all oscillators up to specified time, end current time frame, then
		// start a new time frame at time 0. Time frames have no effect on emulation
		// and each can be whatever length is convenient.

	}, {
		key: 'end_frame',
		value: function end_frame(end_time) {
			if (end_time > this.last_time) {
				this.run_until(end_time);
			}

			// make times relative to new frame
			this.last_time -= end_time;
			//require( this.last_time >= 0 );

			if (this.next_irq !== no_irq) {
				this.next_irq -= end_time;
				//assert( this.next_irq >= 0 );
			}
			if (this._dmc.next_irq !== no_irq) {
				this._dmc.next_irq -= end_time;
				//assert( this._dmc.next_irq >= 0 );
			}
			if (this.earliest_irq_ !== no_irq) {
				this.earliest_irq_ -= end_time;
				if (this.earliest_irq_ < 0) {
					this.earliest_irq_ = 0;
				}
			}
		}

		// Save/load snapshot of exact emulation state

	}, {
		key: 'save_snapshot',
		value: function save_snapshot(apu_snapshot_t) {}
	}, {
		key: 'load_snapshot',
		value: function load_snapshot(apu_snapshot_t) {}

		// Set overall volume (default is 1.0)

	}, {
		key: 'volume',
		value: function volume(v) {
			v = v || 1.0;
			this._dmc.nonlinear = false;
			this._square_synth.volume(0.1128 * v);
			this._triangle.synth.volume(0.12765 * v);
			this._noise.synth.volume(0.0741 * v);
			this._dmc.synth.volume(0.42545 * v);
		}

		// Set IRQ time callback that is invoked when the time of earliest IRQ
		// may have changed, or NULL to disable. When callback is invoked,
		// 'user_data' is passed unchanged as the first parameter.

	}, {
		key: 'irq_notifier',
		value: function irq_notifier(irqCallback) {

			this._irqCallback = irqCallback;
		}

		// Get time that APU-generated IRQ will occur if no further register reads
		// or writes occur. If IRQ is already pending, returns irq_waiting. If no
		// IRQ will occur, returns no_irq.

	}, {
		key: 'earliest_irq',
		value: function earliest_irq() {
			return this.earliest_irq_;
		}

		// Run APU until specified time, so that any DMC memory reads can be
		// accounted for (i.e. inserting CPU wait states).

	}, {
		key: 'run_until',
		value: function run_until(end_time) {
			//require( end_time >= this.last_time );

			if (end_time === this.last_time) {
				return;
			}

			while (true) {
				// earlier of next frame time or end time
				var time = this.last_time + this.frame_delay;
				if (time > end_time) {
					time = end_time;
				}
				this.frame_delay -= time - this.last_time;

				// run oscs to present
				this._square1.run(this.last_time, time);
				this._square2.run(this.last_time, time);
				this._triangle.run(this.last_time, time);
				this._noise.run(this.last_time, time);
				this._dmc.run(this.last_time, time);
				this.last_time = time;

				if (time === end_time) {
					break; // no more frames to run
				}

				// take frame-specific actions
				this.frame_delay = this.frame_period;
				switch (this.frame++) {
					case 0:
						if (!(this.frame_mode & 0xc0)) {
							this.next_irq = time + this.frame_period * 4 + 1;
							this.irq_flag = true;
						}
					// fall through
					case 2:
						// clock length and sweep on frames 0 and 2
						this._square1.clock_length(0x20);
						this._square2.clock_length(0x20);
						this._noise.clock_length(0x20);
						this._triangle.clock_length(0x80); // different bit for halt flag on triangle

						this._square1.clock_sweep(-1);
						this._square2.clock_sweep(0);
						break;

					case 1:
						// frame 1 is slightly shorter
						this.frame_delay -= 2;
						break;

					case 3:
						this.frame = 0;

						// frame 3 is almost twice as long in mode 1
						if (this.frame_mode & 0x80) {
							this.frame_delay += this.frame_period - 6;
						}
						break;
				}

				// clock envelopes and linear counter every frame
				this._triangle.clock_linear_counter();
				this._square1.clock_envelope();
				this._square2.clock_envelope();
				this._noise.clock_envelope();
			}
		}
	}, {
		key: 'irq_changed',
		value: function irq_changed() {
			var new_irq = this._dmc.next_irq;
			if (this._dmc.irq_flag || this.irq_flag) {
				new_irq = 0;
			} else if (new_irq > this.next_irq) {
				new_irq = this.next_irq;
			}

			if (new_irq !== this.earliest_irq_) {
				this.earliest_irq_ = new_irq;
				if (this._irqCallback) {
					this._irqCallback();
				}
			}
		}
	}, {
		key: 'osc_output',
		value: function osc_output(osc, buf) {
			this.osc[osc].output = buf;
		}
	}, {
		key: 'save_snapshot',
		value: function save_snapshot() {
			return {};
		}
	}, {
		key: 'load_snapshot',
		value: function load_snapshot() {}
	}]);

	return APU;
}();

exports.default = APU;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Trace = __webpack_require__(3);

var _APU = __webpack_require__(20);

var _APU2 = _interopRequireDefault(_APU);

var _BlipBuffer = __webpack_require__(22);

var _BlipBuffer2 = _interopRequireDefault(_BlipBuffer);

var _WebAudioRenderer = __webpack_require__(14);

var _WebAudioRenderer2 = _interopRequireDefault(_WebAudioRenderer);

var _consts = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var APUOutBufferSize = 4096;
var APUBaseRate = 1789773;

var APULegacy = function () {
	function APULegacy(mainboard) {
		_classCallCheck(this, APULegacy);

		this._outBufferSize = 4096;
		this._soundRate = 44100;

		this.mainboard = mainboard;
		this.mainboard.connect('reset', this._onReset.bind(this));
		this.nextIrq = -1;
		this._irqActive = false;
		this.mLastCalculatedNextIrqTime = -1;

		this._enabled = true;
		this._justRenabled = 0;
		var soundRate = 44100;

		this.apu = new _APU2.default();

		try {
			this._renderer = new _WebAudioRenderer2.default(APUOutBufferSize);
			this._outBuffer = this._renderer.createBuffer(this._outBufferSize);
			soundRate = this._renderer.getSampleRate();
			this.buf = new _BlipBuffer2.default();

			this.buf.clock_rate(APUBaseRate);
			this.apu.output(this.buf);
			this.buf.sample_rate(soundRate);
		} catch (err) {
			this._renderer = null;
			this._enabled = false;
			console.log("WebAudio unsupported in this browser. Sound will be disabled...", err);
		}

		this.apu.dmc_reader(function (addr) {
			return mainboard.memory.read8(addr);
		});
		this.apu.irq_notifier(this.CalculateWhenIrqDue.bind(this));
		// called when the next predicted nmi changes
		//that.mainboard.synchroniser.synchronise();
	}

	_createClass(APULegacy, [{
		key: 'enableSound',
		value: function enableSound(enable) {
			enable = enable === undefined ? true : enable;
			if (enable !== this._enabled) {
				if (enable) {
					// after re-enabling sound, fill audio buffer with zeroes to prevent static
					this._justRenabled = 2;
				}
				this._enabled = enable;
			}
		}
	}, {
		key: 'soundEnabled',
		value: function soundEnabled() {
			return this._enabled && this.soundSupported();
		}
	}, {
		key: 'soundSupported',
		value: function soundSupported() {
			return !!this._renderer;
		}
	}, {
		key: 'setVolume',
		value: function setVolume(val) {
			if (this._renderer) {
				this._renderer.setVolume(val);
			}
		}
	}, {
		key: '_onReset',
		value: function _onReset(cold) {

			this.nextIrq = -1;
			this.apu.reset(_consts.COLOUR_ENCODING_NAME !== "NTSC");
		}
	}, {
		key: 'readFromRegister',
		value: function readFromRegister(offset) {
			var ret = 0;
			if (offset === this.apu.status_addr) {
				this.mainboard.synchroniser.synchronise();
				var realTime = Math.floor(this.mainboard.synchroniser.getCpuMTC() / _consts.COLOUR_ENCODING_MTC_PER_CPU);
				if (offset === 0x4015 && this._irqActive) {
					// irq acknowledge
					this._irqActive = false;
					//this.mainboard.cpu.holdIrqLineLow( false );
				}
				ret = this.apu.read_status(realTime);
			}
			return ret;
		}
	}, {
		key: 'writeToRegister',
		value: function writeToRegister(offset, data) {
			if (offset >= this.apu.start_addr && offset <= this.apu.end_addr) {
				this.mainboard.synchroniser.synchronise();
				var realTime = Math.floor(this.mainboard.synchroniser.getCpuMTC() / _consts.COLOUR_ENCODING_MTC_PER_CPU);
				this.apu.write_register(realTime, offset, data);
			}
		}
	}, {
		key: 'synchronise',
		value: function synchronise(startTicks, endTicks) {
			var cpuClocks = Math.floor(startTicks / _consts.COLOUR_ENCODING_MTC_PER_CPU) - 1;
			this.apu.run_until(cpuClocks >= 0 ? cpuClocks : 0);

			if (this.apu.earliest_irq() === _APU2.default.irq_waiting) {
				this._irqActive = true;
			}
		}
	}, {
		key: 'onEndFrame',
		value: function onEndFrame(cpuMtc) {
			var realTime = Math.floor(this.mainboard.synchroniser.getCpuMTC() / _consts.COLOUR_ENCODING_MTC_PER_CPU);
			this.apu.end_frame(realTime);

			if (this._renderer && this._enabled) {
				// Read some samples out of BlipBuffer if there are enough to
				// fill our output buffer
				this.buf.end_frame(realTime);

				var samplesAvailable = this.buf.samples_avail();

				//	if ( g_options->SoundEnabled && g_options->ApplicationSpeed == 0 ) // dont play sound if disabled or not running at normal speed
				if (samplesAvailable >= APUOutBufferSize) {
					//write samples directly to renderer's buffer
					var floatArray = this._outBuffer.lockBuffer();
					this.buf.read_samples(floatArray, APUOutBufferSize);
					this._outBuffer.unlockBuffer();
				}
			}

			this.CalculateWhenIrqDue();
		}
	}, {
		key: '_eventIrqTrigger',
		value: function _eventIrqTrigger(eventTime) {
			// done in the synchronise method
			//	this.mainboard.cpu.holdIrqLineLow();
		}
	}, {
		key: 'CalculateWhenIrqDue',
		value: function CalculateWhenIrqDue() {

			var that = this;
			var earliestIrq = this.apu.earliest_irq();
			if (earliestIrq !== this.apu.no_irq) {
				this.nextIrq = earliestIrq * _consts.COLOUR_ENCODING_MTC_PER_CPU;
				if (this.nextIrq >= 0) {
					(0, _Trace.writeLine)(_Trace.trace_apu, 'IRQ scheduled for: ' + this.nextIrq);
					//this.mainboard.synchroniser.addEvent( 'apu irq', this.nextIrq, function( eventTime ) { that._eventIrqTrigger( eventTime ); } );
				}
			} else {
				this.nextIrq = -1;
				// TODO: change irq event if it changes
			}
		}
	}, {
		key: 'saveState',
		value: function saveState() {
			var data = {};
			data.apu = this.apu.save_snapshot();
			data.nextIrq = this.nextIrq;
			data.mLastCalculatedNextIrqTime = this.mLastCalculatedNextIrqTime;
			return data;
		}
	}, {
		key: 'loadState',
		value: function loadState(state) {

			this.apu.load_snapshot(state.apu);
			this.nextIrq = state.nextIrq;
			this.mLastCalculatedNextIrqTime = state.mLastCalculatedNextIrqTime;
		}
	}]);

	return APULegacy;
}();

exports.default = APULegacy;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

// Buffer of sound samples into which band-limited waveforms can be synthesized
// using Blip_Wave or Blip_Synth.

// Blip_Buffer 0.3.3. Copyright (C) 2003-2005 Shay Green. GNU LGPL license.


var widest_impulse_ = 24;
var blip_res_bits_ = 5;
var BLIP_BUFFER_ACCURACY = 16;
var max_res = 1 << blip_res_bits_;

var Blip_eq_t = function Blip_eq_t(treble, cutoff, samplerate) {
	_classCallCheck(this, Blip_eq_t);

	this.treble = treble || 0;
	this.cutoff = cutoff || 0;
	this.sample_rate = samplerate || 44100;
};

var uintArray_memset = function uintArray_memset(buf, data, len, startIndex) {

	startIndex = startIndex || 0;
	for (var i = 0; i < len; ++i) {
		buf[startIndex + i] = data;
	}
};

var uintArray_memmove = function uintArray_memmove(buf, srcIndex, destIndex, len) {

	var tmpArray = null;
	if (!tmpArray || tmpArray.length < len) {
		tmpArray = new Uint16Array(len);
	}
	tmpArray.set(buf.subarray(srcIndex, srcIndex + len), 0);
	buf.set(tmpArray.subarray(0, len), destIndex);
};

var uintArray_memcpy = function uintArray_memcpy(buf, srcIndex, destIndex, len) {
	buf.set(buf.subarray(srcIndex, srcIndex + len), destIndex);
};

var blip_default_length = 0;
var accum_fract = 15; // less than 16 to give extra sample range
var sample_offset = 0x7F7F; // repeated byte allows memset to clear buffer


var BlipBuffer = function () {
	function BlipBuffer() {
		_classCallCheck(this, BlipBuffer);

		this.samples_per_sec = 44100;
		this.reader_accum = 0;
		this.bass_shift = 0;
		this.eq = new Blip_eq_t();

		// try to cause assertion failure if buffer is used before these are set
		this.clocks_per_sec = 0;
		this.buffer_ = null;
		this.factor_ = ~0;
		this.offset_ = 0;
		this.buffer_size_ = 0;
		this.length_ = 0;

		this.bass_freq_ = 16;
	}

	// Set output sample rate and buffer length in milliseconds (1/1000 sec),
	// If there is insufficient memory for the buffer, sets the buffer length
	// to 0 and returns error string (or propagates exception if compiler supports it).


	_createClass(BlipBuffer, [{
		key: "sample_rate",
		value: function sample_rate(new_rate, msec) {

			if (new_rate === undefined) {
				return this.samples_per_sec;
			} else {
				msec = msec || blip_default_length;

				var new_size = 65448; //(0xFFFFFFFF >> BLIP_BUFFER_ACCURACY) + 1 - widest_impulse_ - 64;
				if (msec !== blip_default_length) {
					var s = Math.floor((new_rate * (msec + 1) + 999) / 1000);
					if (s < new_size) {
						new_size = s;
					} else {
						//		require( false ); // requested buffer length exceeds limit
					}
				}

				if (this.buffer_size_ !== new_size) {
					this.buffer_ = null; // allow for exception in allocation below
					this.buffer_size_ = 0;
					this.offset_ = 0;

					this.buffer_ = new Uint16Array(new_size + widest_impulse_);
				}

				this.buffer_size_ = new_size;
				this.length_ = Math.floor(new_size * 1000 / new_rate) - 1;
				//	if ( msec )
				//		assert( this.length_ == msec ); // ensure length is same as that passed in

				this.samples_per_sec = new_rate;
				if (this.clocks_per_sec) {
					this.clock_rate(this.clocks_per_sec); // recalculate factor
				}

				this.bass_freq(this.bass_freq_); // recalculate shift

				this.clear();
			}
		}

		// Length of buffer, in milliseconds

	}, {
		key: "length",
		value: function length() {
			return this.length_;
		}

		// Number of source time units per second

	}, {
		key: "clock_rate",
		value: function clock_rate(cps) {
			if (cps === undefined) {
				return this.clocks_per_sec;
			} else {
				this.clocks_per_sec = cps;
				this.factor_ = Math.floor(this.samples_per_sec / cps * (1 << BLIP_BUFFER_ACCURACY) + 0.5);
				//	require( this.factor_ > 0 ); // clock_rate/sample_rate ratio is too large
			}
		}

		// Set frequency at which high-pass filter attenuation passes -3dB

	}, {
		key: "bass_freq",
		value: function bass_freq(freq) {
			this.bass_freq_ = freq;
			if (freq === 0) {
				this.bass_shift = 31; // 32 or greater invokes undefined behavior elsewhere
				return;
			}
			this.bass_shift = 1 + Math.floor(1.442695041 * Math.log(0.124 * this.samples_per_sec / freq));
			if (this.bass_shift < 0) {
				this.bass_shift = 0;
			}
			if (this.bass_shift > 24) {
				this.bass_shift = 24;
			}
		}

		// Remove all available samples and clear buffer to silence. If 'entire_buffer' is
		// false, just clear out any samples waiting rather than the entire buffer.

	}, {
		key: "clear",
		value: function clear(entire_buffer) {
			entire_buffer = entire_buffer === undefined ? true : entire_buffer;

			var count = entire_buffer ? this.buffer_size_ : this.samples_avail();
			this.offset_ = 0;
			this.reader_accum = 0;
			uintArray_memset(this.buffer_, sample_offset, count + widest_impulse_);
		}

		// to do:
		// Notify Blip_Buffer that synthesis has been performed until specified time
		//void run_until( blip_time_t );

		// End current time frame of specified duration and make its samples available
		// (along with any still-unread samples) for reading with read_samples(). Begin
		// a new time frame at the end of the current frame. All transitions must have
		// been added before 'time'.

	}, {
		key: "end_frame",
		value: function end_frame(t) {
			this.offset_ += t * this.factor_;
			//	assert(( "Blip_Buffer::end_frame(): Frame went past end of buffer",
			//			samples_avail() <= (long) this.buffer_size_ ));
		}

		// Number of samples available for reading with read_samples()

	}, {
		key: "samples_avail",
		value: function samples_avail() {
			return this.offset_ >> BLIP_BUFFER_ACCURACY;
		}

		// Read at most 'max_samples' out of buffer into 'dest', removing them from from
		// the buffer. Return number of samples actually read and removed. If stereo is
		// true, increment 'dest' one extra time after writing each sample, to allow
		// easy interleving of two channels into a stereo output buffer.

	}, {
		key: "read_samples",
		value: function read_samples(out, max_samples, stereo) {
			//require( this.buffer_ ); // sample rate must have been set

			var count = this.samples_avail();
			if (count > max_samples) {
				count = max_samples;
			}

			if (!count) {
				return 0; // optimization
			}

			var isFloatOutputArray = out instanceof Float32Array;

			var inIndex = 0;
			var outIndex = 0;
			var step = stereo ? 2 : 1;

			for (var n = count; n--;) {

				var s = this.reader_accum >> accum_fract;
				this.reader_accum -= this.reader_accum >> this.bass_shift;
				var inbyte = this.buffer_[inIndex];
				this.reader_accum += inbyte - sample_offset << accum_fract;
				inIndex += 1;

				// clamp sample
				//	if ( s !== ( s & 0xFFFF ) ) {
				if (s < -32767 || s > 32767) {
					// larger than a signed 16 bit value
					s = 0x7FFF - (s >> 24);
				}

				if (isFloatOutputArray) {
					out[outIndex] = s / 32768.0;
				} else {
					out[outIndex] = s;
				}

				outIndex += step;
			}

			this.remove_samples(count);

			return count;
		}

		// Remove 'count' samples from those waiting to be read

	}, {
		key: "remove_samples",
		value: function remove_samples(count) {
			//require( this.buffer_ ); // sample rate must have been set

			if (!count) {
				// optimization
				return;
			}

			this.remove_silence(count);

			// Allows synthesis slightly past time passed to end_frame(), as long as it's
			// not more than an output sample.
			// to do: kind of hacky, could add run_until() which keeps track of extra synthesis
			var copy_extra = 1;

			// copy remaining samples to beginning and clear old samples
			var remain = this.samples_avail() + widest_impulse_ + copy_extra;
			if (count >= remain) {
				uintArray_memmove(this.buffer_, count, 0, remain);
			} else {
				uintArray_memcpy(this.buffer_, count, 0, remain);
			}
			uintArray_memset(this.buffer_, sample_offset, count, remain);
		}

		// Number of samples delay from synthesis to samples read out

	}, {
		key: "output_latency",
		value: function output_latency() {
			return Math.floor(widest_impulse_ / 2);
		}

		// not documented yet

	}, {
		key: "remove_silence",
		value: function remove_silence(count) {
			//assert(( "Blip_Buffer::remove_silence(): Tried to remove more samples than available",
			//		count <= samples_avail() ));
			this.offset_ -= count << BLIP_BUFFER_ACCURACY;
		}
	}, {
		key: "resampled_time",
		value: function resampled_time(t) {
			return t * this.factor_ + this.offset_;
		}
	}, {
		key: "resampled_duration",
		value: function resampled_duration(t) {
			return t * this.factor_;
		}
	}]);

	return BlipBuffer;
}();

exports.default = BlipBuffer;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

// Buffer of sound samples into which band-limited waveforms can be synthesized
// using Blip_Wave or Blip_Synth.

// Blip_Buffer 0.3.3. Copyright (C) 2003-2005 Shay Green. GNU LGPL license.


var BlipEqT = function BlipEqT(treble, cutoff, samplerate) {
	_classCallCheck(this, BlipEqT);

	this.treble = treble || 0;
	this.cutoff = cutoff || 0;
	this.sample_rate = samplerate || 44100;
};

exports.default = BlipEqT;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BlipEqT = __webpack_require__(23);

var _BlipEqT2 = _interopRequireDefault(_BlipEqT);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

// Buffer of sound samples into which band-limited waveforms can be synthesized
// using Blip_Wave or Blip_Synth.

// Blip_Buffer 0.3.3. Copyright (C) 2003-2005 Shay Green. GNU LGPL license.

var impulse_bits = 15;
var impulse_amp = 1 << impulse_bits;
var impulse_offset = Math.floor(impulse_amp / 2);
var widest_impulse_ = 24;
var blip_res_bits_ = 5;
var max_res = 1 << blip_res_bits_;

var uintArray_memcpy = function uintArray_memcpy(buf, srcIndex, destIndex, len) {
	buf.set(buf.subarray(srcIndex, srcIndex + len), destIndex);
};

var BlipImpulse = function () {
	function BlipImpulse() {
		_classCallCheck(this, BlipImpulse);

		this.impulses = null;
		this.impulse = null;
	}

	_createClass(BlipImpulse, [{
		key: 'init',
		value: function init(imps, w, r, fb) {
			this.fine_bits = fb || 0;
			this.width = w;
			this.impulses = new Uint16Array(imps.buffer);
			this.generate = true;
			this.volume_unit_ = -1.0;
			this.res = r;
			this.buf = null;

			this.impulse = new Uint16Array(this.impulses.buffer, this.width * this.res * 2 * (this.fine_bits ? 2 : 1) * 2);
			this.offset = 0;
		}

		// TODO: examine this if there are any problems

	}, {
		key: 'scale_impulse',
		value: function scale_impulse(unit, imp_in) {

			var offset = (unit << impulse_bits) - impulse_offset * unit + (1 << impulse_bits - 1);
			var impIndex = 0;
			var fimpIndex = 0;
			for (var n = Math.floor(this.res / 2) + 1; n--;) {
				var error = unit;
				for (var nn = this.width; nn--;) {
					var a = this.impulse[fimpIndex++] * unit + offset >> impulse_bits;
					error -= a - unit;
					imp_in[impIndex++] = a;
				}

				// add error to middle
				imp_in[impIndex - Math.floor(this.width / 2) - 1] += error;
			}

			if (this.res > 2) {
				// second half is mirror-image
				var revIndex = impIndex - this.width - 1;
				for (var mm = (Math.floor(this.res / 2) - 1) * this.width - 1; mm--;) {
					imp_in[impIndex++] = imp_in[--revIndex];
				}
				imp_in[impIndex++] = unit;
			}

			// copy to odd offset
			imp_in[impIndex++] = unit;
			//memcpy( imp, imp_in, (res * width - 1) * sizeof *imp );
			uintArray_memcpy(imp_in, 0, impIndex, this.res * this.width - 1);
		}
	}, {
		key: 'fine_volume_unit',
		value: function fine_volume_unit() {
			// to do: find way of merging in-place without temporary buffer

			var temp = new Uint16Array(max_res * 2 * widest_impulse_);
			this.scale_impulse((this.offset & 0xffff) << this.fine_bits, temp);
			var imp2 = this.impulse.subarray(this.res * 2 * this.width);
			this.scale_impulse(this.offset & 0xffff, imp2);

			// merge impulses
			var impIndex = 0;
			var imp2Index = 0;
			var src2Index = 0;
			for (var n = Math.floor(this.res / 2) * 2 * this.width; n--;) {
				this.impulses[impIndex++] = imp2[imp2Index++];
				this.impulses[impIndex++] = imp2[imp2Index++];
				this.impulses[impIndex++] = temp[src2Index++];
				this.impulses[impIndex++] = temp[src2Index++];
			}
		}
	}, {
		key: 'volume_unit',
		value: function volume_unit(new_unit) {
			if (new_unit === this.volume_unit_) {
				return;
			}

			if (this.generate) {
				this.treble_eq(new _BlipEqT2.default(-8.87, 8800, 44100));
			}

			this.volume_unit_ = new_unit;

			this.offset = 0x10001 * Math.floor(this.volume_unit_ * 0x10000 + 0.5);

			if (this.fine_bits) {
				this.fine_volume_unit();
			} else {
				this.scale_impulse(this.offset & 0xffff, this.impulses);
			}
		}
	}, {
		key: 'treble_eq',
		value: function treble_eq(new_eq) {

			if (!this.generate && new_eq.treble === this.eq.treble && new_eq.cutoff === this.eq.cutoff && new_eq.sample_rate === this.eq.sample_rate) {
				return; // already calculated with same parameters
			}

			var pi = 3.1415926535897932384626433832795029;

			this.generate = false;
			this.eq = new_eq;

			var treble = Math.pow(10.0, 1.0 / 20 * this.eq.treble); // dB (-6dB = 0.50)
			if (treble < 0.000005) {
				treble = 0.000005;
			}

			var treble_freq = 22050.0; // treble level at 22 kHz harmonic
			var sample_rate = this.eq.sample_rate;
			var pt = treble_freq * 2 / sample_rate;
			var cutoff = this.eq.cutoff * 2 / sample_rate;
			if (cutoff >= pt * 0.95 || cutoff >= 0.95) {
				cutoff = 0.5;
				treble = 1.0;
			}

			// DSF Synthesis (See T. Stilson & J. Smith (1996),
			// Alias-free digital synthesis of classic analog waveforms)

			// reduce adjacent impulse interference by using small part of wide impulse
			var n_harm = 4096;
			var rolloff = Math.pow(treble, 1.0 / (n_harm * pt - n_harm * cutoff));
			var rescale = 1.0 / Math.pow(rolloff, n_harm * cutoff);

			var pow_a_n = rescale * Math.pow(rolloff, n_harm);
			var pow_a_nc = rescale * Math.pow(rolloff, n_harm * cutoff);

			var total = 0.0;
			var to_angle = pi / 2 / n_harm / max_res;

			var buf = [];
			buf.length = Math.floor(max_res * (widest_impulse_ - 2) / 2);
			var size = Math.floor(max_res * (this.width - 2) / 2);
			for (var i = size; i--;) {
				var angle = (i * 2 + 1) * to_angle;

				// equivalent
				//double y =     dsf( angle, n_harm * cutoff, 1.0 );
				//y -= rescale * dsf( angle, n_harm * cutoff, rolloff );
				//y += rescale * dsf( angle, n_harm,          rolloff );

				var cos_angle = Math.cos(angle);
				var cos_nc_angle = Math.cos(n_harm * cutoff * angle);
				var cos_nc1_angle = Math.cos((n_harm * cutoff - 1.0) * angle);

				var b = 2.0 - 2.0 * cos_angle;
				var a = 1.0 - cos_angle - cos_nc_angle + cos_nc1_angle;

				var d = 1.0 + rolloff * (rolloff - 2.0 * cos_angle);
				var c = pow_a_n * rolloff * Math.cos((n_harm - 1.0) * angle) - pow_a_n * Math.cos(n_harm * angle) - pow_a_nc * rolloff * cos_nc1_angle + pow_a_nc * cos_nc_angle;

				// optimization of a / b + c / d
				var y = (a * d + c * b) / (b * d);

				// fixed window which affects wider impulses more
				if (this.width > 12) {
					var windowVar = Math.cos(n_harm / 1.25 / widest_impulse_ * angle);
					y *= windowVar * windowVar;
				}

				total += y;
				buf[i] = y;
			}

			// integrate runs of length 'max_res'
			var factor = impulse_amp * 0.5 / total; // 0.5 accounts for other mirrored half
			var impIndex = 0;
			var step = Math.floor(max_res / this.res);
			var offset = this.res > 1 ? max_res : Math.floor(max_res / 2);
			for (var n = Math.floor(this.res / 2) + 1; n--; offset -= step) {
				for (var w = -Math.floor(this.width / 2); w < Math.floor(this.width / 2); w++) {
					var sum = 0;
					for (var k = max_res; k--;) {
						var index = w * max_res + offset + k;
						if (index < 0) {
							index = -index - 1;
						}
						if (index < size) {
							sum += buf[index];
						}
					}
					this.impulse[impIndex++] = Math.floor(sum * factor + (impulse_offset + 0.5));
				}
			}

			// rescale
			var unit = this.volume_unit_;
			if (unit >= 0) {
				this.volume_unit_ = -1;
				this.volume_unit(unit);
			}
		}
	}]);

	return BlipImpulse;
}();

exports.default = BlipImpulse;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Dmc = exports.Noise = exports.Triangle = exports.Square = exports.Envelope = exports.Osc = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* Copyright (C) 2003-2005 Shay Green. This module is free software; you
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     can redistribute it and/or modify it under the terms of the GNU Lesser
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     General Public License as published by the Free Software Foundation; either
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     version 2.1 of the License, or (at your option) any later version. This
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     module is distributed in the hope that it will be useful, but WITHOUT ANY
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     more details. You should have received a copy of the GNU Lesser General
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     Public License along with this module; if not, write to the Free Software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA */

var _BlipSynth = __webpack_require__(7);

var _BlipSynth2 = _interopRequireDefault(_BlipSynth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var no_irq = 1073741824;

var Osc = exports.Osc = function () {
	function Osc() {
		_classCallCheck(this, Osc);

		this.regs = new Uint8Array(4);
		this.reg_written = [false, false, false, false];
		this.output = null;
		this.length_counter = 0; // length counter (0 if unused by oscillator)
		this.delay = 0; // delay until next (potential) transition
		this.last_amp = 0; // last amplitude oscillator was outputting
	}

	_createClass(Osc, [{
		key: 'clock_length',
		value: function clock_length(halt_mask) {
			if (this.length_counter > 0 && (this.regs[0] & halt_mask) === 0) {
				this.length_counter--;
			}
		}
	}, {
		key: 'period',
		value: function period(halt_mask) {
			return (this.regs[3] & 7) * 0x100 + (this.regs[2] & 0xff);
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.delay = 0;
			this.last_amp = 0;
		}
	}, {
		key: 'update_amp',
		value: function update_amp(amp) {
			var delta = amp - this.last_amp;
			this.last_amp = amp;
			return delta;
		}
	}]);

	return Osc;
}();

var Envelope = exports.Envelope = function (_Osc) {
	_inherits(Envelope, _Osc);

	function Envelope() {
		_classCallCheck(this, Envelope);

		var _this = _possibleConstructorReturn(this, (Envelope.__proto__ || Object.getPrototypeOf(Envelope)).call(this));

		_this.envelope = 0;
		_this.env_delay = 0;
		return _this;
	}

	_createClass(Envelope, [{
		key: 'clock_envelope',
		value: function clock_envelope() {
			var period = this.regs[0] & 15;
			if (this.reg_written[3]) {
				this.reg_written[3] = false;
				this.env_delay = period;
				this.envelope = 15;
			} else if (--this.env_delay < 0) {
				this.env_delay = period;
				if (this.envelope | this.regs[0] & 0x20) {
					this.envelope = this.envelope - 1 & 15;
				}
			}
		}
	}, {
		key: 'volume',
		value: function volume() {
			return this.length_counter === 0 ? 0 : this.regs[0] & 0x10 ? this.regs[0] & 15 : this.envelope;
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.envelope = 0;
			this.env_delay = 0;
			Osc.prototype.reset.call(this);
		}
	}]);

	return Envelope;
}(Osc);

var Square = exports.Square = function (_Envelope) {
	_inherits(Square, _Envelope);

	function Square() {
		_classCallCheck(this, Square);

		var _this2 = _possibleConstructorReturn(this, (Square.__proto__ || Object.getPrototypeOf(Square)).call(this));

		_this2.phase = 0;
		_this2.sweep_delay = 0;
		_this2.synth = null;
		return _this2;
	}

	_createClass(Square, [{
		key: 'clock_sweep',
		value: function clock_sweep(negative_adjust) {
			var sweep = this.regs[1];

			if (--this.sweep_delay < 0) {
				this.reg_written[1] = true;

				var period = this.period();
				var shift = sweep & Square.shift_mask;
				if (shift && sweep & 0x80 && period >= 8) {
					var offset = period >> shift;

					if (sweep & Square.negate_flag) {
						offset = negative_adjust - offset;
					}

					if (period + offset < 0x800) {
						period += offset;
						// rewrite period
						this.regs[2] = period & 0xff;
						this.regs[3] = this.regs[3] & 0xF8 | period >> 8 & 7;
					}
				}
			}

			if (this.reg_written[1]) {
				this.reg_written[1] = false;
				this.sweep_delay = sweep >> 4 & 7;
			}
		}
	}, {
		key: 'run',
		value: function run(time, end_time) {
			if (!this.output) return;

			var volume = this.volume();
			var period = this.period();
			var offset = period >> (this.regs[1] & Square.shift_mask);
			if (this.regs[1] & Square.negate_flag) {
				offset = 0;
			}

			var timer_period = (period + 1) * 2;
			if (volume === 0 || period < 8 || period + offset >= 0x800) {
				if (this.last_amp) {
					this.synth.offset(time, -this.last_amp, this.output);
					this.last_amp = 0;
				}

				time += this.delay;
				if (time < end_time) {
					// maintain proper phase
					var count = Math.floor((end_time - time + timer_period - 1) / timer_period);
					this.phase = this.phase + count & Square.phase_range - 1;
					time += count * timer_period;
				}
			} else {
				// handle duty select
				var duty_select = this.regs[0] >> 6 & 3;
				var duty = 1 << duty_select; // 1, 2, 4, 2
				var amp = 0;
				if (duty_select === 3) {
					duty = 2; // negated 25%
					amp = volume;
				}
				if (this.phase < duty) {
					amp ^= volume;
				}

				var delta = this.update_amp(amp);
				if (delta) {
					this.synth.offset(time, delta, this.output);
				}

				time += this.delay;
				if (time < end_time) {
					delta = amp * 2 - volume;

					do {
						this.phase = this.phase + 1 & Square.phase_range - 1;
						if (this.phase === 0 || this.phase === duty) {
							delta = -delta;
							this.synth.offset_inline(time, delta, this.output);
						}
						time += timer_period;
					} while (time < end_time);

					this.last_amp = delta + volume >> 1;
				}
			}

			this.delay = time - end_time;
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.sweep_delay = 0;
			Envelope.prototype.reset.call(this);
		}
	}]);

	return Square;
}(Envelope);

Square.negate_flag = 0x08;
Square.shift_mask = 0x07;
Square.phase_range = 8;

var Triangle = exports.Triangle = function (_Osc2) {
	_inherits(Triangle, _Osc2);

	function Triangle() {
		_classCallCheck(this, Triangle);

		var _this3 = _possibleConstructorReturn(this, (Triangle.__proto__ || Object.getPrototypeOf(Triangle)).call(this));

		_this3.phase = _this3.phase_range;
		_this3.linear_counter = 0;
		_this3.synth = new _BlipSynth2.default(_BlipSynth2.default.blip_good_quality, 15);
		return _this3;
	}

	_createClass(Triangle, [{
		key: 'reset',
		value: function reset() {
			this.phase = Triangle.phase_range;
			this.linear_counter = 0;
			Osc.prototype.reset.call(this);
		}
	}, {
		key: 'run',
		value: function run(time, end_time) {
			if (!this.output) return;

			// to do: track phase when period < 3
			// to do: Output 7.5 on dac when period < 2? More accurate, but results in more clicks.

			var delta = this.update_amp(this.calc_amp());
			if (delta) {
				this.synth.offset(time, delta, this.output);
			}

			time += this.delay;
			var timer_period = this.period() + 1;
			if (this.length_counter === 0 || this.linear_counter === 0 || timer_period < 3) {
				time = end_time;
			} else if (time < end_time) {
				var volume = 1;
				if (this.phase > Triangle.phase_range) {
					this.phase -= Triangle.phase_range;
					volume = -volume;
				}

				do {
					if (--this.phase === 0) {
						this.phase = Triangle.phase_range;
						volume = -volume;
					} else {
						this.synth.offset_inline(time, volume, this.output);
					}

					time += timer_period;
				} while (time < end_time);

				if (volume < 0) {
					this.phase += Triangle.phase_range;
				}
				this.last_amp = this.calc_amp();
			}
			this.delay = time - end_time;
		}
	}, {
		key: 'clock_linear_counter',
		value: function clock_linear_counter() {
			if (this.reg_written[3]) {
				this.linear_counter = this.regs[0] & 0x7f;
			} else if (this.linear_counter) {
				this.linear_counter--;
			}

			if (!(this.regs[0] & 0x80)) {
				this.reg_written[3] = false;
			}
		}
	}, {
		key: 'calc_amp',
		value: function calc_amp() {
			var amp = Triangle.phase_range - this.phase;
			if (amp < 0) {
				amp = this.phase - (Triangle.phase_range + 1);
			}
			return amp;
		}
	}]);

	return Triangle;
}(Osc);

Triangle.phase_range = 16;


var noise_period_table = [0x004, 0x008, 0x010, 0x020, 0x040, 0x060, 0x080, 0x0A0, 0x0CA, 0x0FE, 0x17C, 0x1FC, 0x2FA, 0x3F8, 0x7F2, 0xFE4];

var Noise = exports.Noise = function (_Envelope2) {
	_inherits(Noise, _Envelope2);

	function Noise() {
		_classCallCheck(this, Noise);

		var _this4 = _possibleConstructorReturn(this, (Noise.__proto__ || Object.getPrototypeOf(Noise)).call(this));

		_this4.noise = 0x4000;
		_this4.synth = new _BlipSynth2.default(_BlipSynth2.default.blip_med_quality, 15);
		return _this4;
	}

	_createClass(Noise, [{
		key: 'run',
		value: function run(time, end_time) {
			if (!this.output) return;

			var volume = this.volume();
			var amp = this.noise & 1 ? volume : 0;
			var delta = this.update_amp(amp);
			if (delta) {
				this.synth.offset(time, delta, this.output);
			}

			time += this.delay;
			if (time < end_time) {
				var mode_flag = 0x80;

				var period = noise_period_table[this.regs[2] & 15];
				if (!volume) {
					// round to next multiple of period
					time += Math.floor((end_time - time + period - 1) / period) * period;

					// approximate noise cycling while muted, by shuffling up noise register
					// to do: precise muted noise cycling?
					if (!(this.regs[2] & mode_flag)) {
						var feedback = this.noise << 13 ^ this.noise << 14;
						this.noise = feedback & 0x4000 | this.noise >> 1;
					}
				} else {
					// using resampled time avoids conversion in synth.offset()
					var rperiod = this.output.resampled_duration(period);
					var rtime = this.output.resampled_time(time);

					delta = amp * 2 - volume;
					var tap = this.regs[2] & mode_flag ? 8 : 13;

					do {
						var feedback2 = this.noise << tap ^ this.noise << 14;
						time += period;

						if (this.noise + 1 & 2) {
							// bits 0 and 1 of noise differ
							delta = -delta;
							this.synth.offset_resampled(rtime, delta, this.output);
						}

						rtime += rperiod;
						this.noise = feedback2 & 0x4000 | this.noise >> 1;
					} while (time < end_time);

					this.last_amp = delta + volume >> 1;
				}
			}

			this.delay = time - end_time;
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.noise = 0x4000;
			Envelope.prototype.reset.call(this);
		}
	}]);

	return Noise;
}(Envelope);

var dmc_period_table = [[0x1ac, 0x17c, 0x154, 0x140, 0x11e, 0x0fe, 0x0e2, 0x0d6, // NTSC
0x0be, 0x0a0, 0x08e, 0x080, 0x06a, 0x054, 0x048, 0x036], [0x18e, 0x161, 0x13c, 0x129, 0x10a, 0x0ec, 0x0d2, 0x0c7, // PAL (totally untested)
0x0b1, 0x095, 0x084, 0x077, 0x062, 0x04e, 0x043, 0x032 // to do: verify PAL periods
]];

var dac_table = [0, 0, 1, 2, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8, 8, 9, 10, 10, 11, 11, 12, 13, 13, 14, 14, 15, 15, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31, 32, 32, 32, 33, 33, 34, 34, 35, 35, 35, 36, 36, 37, 37, 38, 38, 38, 39, 39, 40, 40, 40, 41, 41, 42, 42, 42, 43, 43, 44, 44, 44, 45, 45, 45, 46, 46, 47, 47, 47, 48, 48, 48, 49, 49, 49, 50, 50, 50, 51, 51, 51, 52, 52, 52, 53, 53, 53, 54, 54, 54, 55, 55, 55, 56, 56, 56, 57, 57, 57];

var loop_flag = 0x40;

var Dmc = exports.Dmc = function (_Osc3) {
	_inherits(Dmc, _Osc3);

	function Dmc(apu) {
		_classCallCheck(this, Dmc);

		var _this5 = _possibleConstructorReturn(this, (Dmc.__proto__ || Object.getPrototypeOf(Dmc)).call(this));

		_this5.apu = apu;
		_this5.address = 0;
		_this5.dac = 0;
		_this5.buf = 0;
		_this5.bits_remain = 1;
		_this5.bits = 0;
		_this5.buf_empty = true;
		_this5.silence = true;
		_this5.next_irq = no_irq;
		_this5.irq_flag = false;
		_this5.irq_enabled = false;
		_this5.periodValue = 0;
		_this5.pal_mode = 0;
		_this5.nonlinear = false;

		_this5.rom_reader = null;

		_this5.synth = new _BlipSynth2.default(_BlipSynth2.default.blip_med_quality, 127);
		//Blip_Synth<blip_med_quality,127> synth;
		return _this5;
	}

	_createClass(Dmc, [{
		key: 'run',
		value: function run(time, end_time) {
			if (!this.output) return;

			var delta = this.update_amp(this.dac);
			if (delta) {
				this.synth.offset(time, delta, this.output);
			}

			time += this.delay;
			if (time < end_time) {
				var bits_remain_copy = this.bits_remain;
				if (this.silence && this.buf_empty) {
					var count = Math.floor((end_time - time + this.periodValue - 1) / this.periodValue);
					bits_remain_copy = (bits_remain_copy - 1 + 8 - count % 8) % 8 + 1;
					time += count * this.periodValue;
				} else {
					var bits_copy = this.bits;
					var dac_copy = this.dac;
					do {
						if (!this.silence) {
							var step = (bits_copy & 1) * 4 - 2;
							bits_copy >>= 1;
							var tot_step = dac_copy + step >>> 0; // converts to unsigned, see http://stackoverflow.com/questions/1822350/what-is-the-javascript-operator-and-how-do-you-use-it
							if (tot_step <= 0x7F) {
								dac_copy += step;
								this.synth.offset_inline(time, step, this.output);
							}
						}

						time += this.periodValue;

						if (--bits_remain_copy === 0) {
							bits_remain_copy = 8;
							if (this.buf_empty) {
								this.silence = true;
							} else {
								this.silence = false;
								bits_copy = this.buf;
								this.buf_empty = true;
								this.fill_buffer();
							}
						}
					} while (time < end_time);

					this.last_amp = dac_copy;
					this.dac = dac_copy;
					this.bits = bits_copy;
				}
				this.bits_remain = bits_remain_copy;
			}
			this.delay = time - end_time;
		}
	}, {
		key: 'reset',
		value: function reset() {

			this.address = 0;
			this.dac = 0;
			this.buf = 0;
			this.bits_remain = 1;
			this.bits = 0;
			this.buf_empty = true;
			this.silence = true;
			this.next_irq = no_irq;
			this.irq_flag = false;
			this.irq_enabled = false;
			Osc.prototype.reset.call(this);
			this.periodValue = 0x036;
		}
	}, {
		key: 'start',
		value: function start() {
			this.reload_sample();
			this.fill_buffer();
			this.recalc_irq();
		}
	}, {
		key: 'write_register',
		value: function write_register(addr, data) {
			if (addr === 0) {
				this.periodValue = dmc_period_table[this.pal_mode][data & 15];
				this.irq_enabled = (data & 0xc0) === 0x80; // enabled only if loop disabled
				this.irq_flag = this.irq_flag && this.irq_enabled;
				this.recalc_irq();
			} else if (addr === 1) {
				if (!this.nonlinear) {
					// adjust last_amp so that "pop" amplitude will be properly non-linear
					// with respect to change in dac
					var old_amp = dac_table[this.dac];
					this.dac = data & 0x7F;
					var diff = dac_table[this.dac] - old_amp;
					this.last_amp = this.dac - diff;
				}

				this.dac = data & 0x7F;
			}
		}
	}, {
		key: 'recalc_irq',
		value: function recalc_irq() {
			var irq = no_irq;
			if (this.irq_enabled && this.length_counter) {
				irq = this.apu.last_time + this.delay + ((this.length_counter - 1) * 8 + this.bits_remain - 1) * this.periodValue + 1;
			}
			if (irq !== this.next_irq) {
				this.next_irq = irq;
				this.apu.irq_changed();
			}
		}
	}, {
		key: 'fill_buffer',
		value: function fill_buffer() {
			if (this.buf_empty && this.length_counter) {
				//require( rom_reader ); // rom_reader must be set
				this.buf = this.rom_reader(0x8000 + this.address);
				this.address = this.address + 1 & 0x7FFF;
				this.buf_empty = false;
				if (--this.length_counter === 0) {
					if ((this.regs[0] & loop_flag) > 0) {
						this.reload_sample();
					} else {
						this.apu.osc_enables &= 0xEF;
						this.irq_flag = this.irq_enabled;
						this.next_irq = no_irq;
						this.apu.irq_changed();
					}
				}
			}
		}
	}, {
		key: 'reload_sample',
		value: function reload_sample() {
			this.address = 0x4000 + this.regs[2] * 0x40;
			this.length_counter = this.regs[3] * 0x10 + 1;
		}
	}]);

	return Dmc;
}(Osc);

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); // CPU 6502


var _Trace = __webpack_require__(3);

var _fastInstructions = __webpack_require__(28);

var _fastInstructions2 = _interopRequireDefault(_fastInstructions);

var _traceInstructions = __webpack_require__(29);

var _cpuTraceString = __webpack_require__(27);

var _cpuTraceString2 = _interopRequireDefault(_cpuTraceString);

var _consts = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var maximumTracesToStoreForLoopDetection = 32;

var Cpu6502 = function () {
	function Cpu6502(mainboard) {
		_classCallCheck(this, Cpu6502);

		this.mainboard = mainboard;
		this.mainboard.connect('reset', this.reset.bind(this));
		this.executeCallback = null;
		this.cmosVersion = false;
		this.isRunning = true;
		this._traceEnabled = false;
		this._previousTraceProgramCounters = new Uint16Array(maximumTracesToStoreForLoopDetection); // used to detect loops in cpu traces
		this._previousTraceProgramCountersIndex = 0;
		this._inTraceLoop = false;
		this._traceLoopCount = 0;

		//var isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

		this._useSwitchStatement = false; // isFirefox;
		this._instructionSet = _fastInstructions2.default; // Default to 'fast' versions
		this.resetVariables();
	}

	_createClass(Cpu6502, [{
		key: 'breakPoint',
		value: function breakPoint(resume) {

			this.isRunning = resume;
		}
	}, {
		key: 'enableTrace',
		value: function enableTrace(enabled) {

			this._traceEnabled = enabled === undefined ? true : enabled;
			if (this._traceEnabled) {
				this._instructionSet = _traceInstructions.cpuInstructionsTrace; // use slow instructions
			} else {
				this._instructionSet = _fastInstructions2.default; // use fast instructions
			}
		}
	}, {
		key: 'resetVariables',
		value: function resetVariables() {
			this.programCounter = 0;
			this.subcycle = 0;

			this.waitOneInstructionAfterCli = false;
			this.resetPending = false;
			this.nmiPending = false;
			this.irqLineLow = 0;
			this.triggerNmiAfterNextInstruction = false;

			this._flagCarry = false;
			this._flagZero = false;
			this._flagInterrupt = false;
			this._flagDecimal = false;
			this._flagBreak = true;
			this._flagUnused = true;
			this._flagOverflow = false;
			this._flagSign = false;

			this.regS = 0;
			this.regX = 0;
			this.regY = 0;
			this.regA = 0;
			this.SAYHighByte = 0;
		}
	}, {
		key: 'incrementSubcycle',
		value: function incrementSubcycle() {
			this.subcycle++;
		}
	}, {
		key: 'getPC',
		value: function getPC() {
			return this.programCounter;
		}
	}, {
		key: 'setPC',
		value: function setPC(pc) {
			this.programCounter = pc;
		}
	}, {
		key: 'getZero',
		value: function getZero() {
			return this._flagZero;
		}
	}, {
		key: 'setZero',
		value: function setZero(zero) {
			this._flagZero = zero;
		}
	}, {
		key: 'getOverflow',
		value: function getOverflow() {
			return this._flagOverflow;
		}
	}, {
		key: 'setOverflow',
		value: function setOverflow(f) {
			this._flagOverflow = f;
		}
	}, {
		key: 'getInterrupt',
		value: function getInterrupt() {
			return this._flagInterrupt;
		}
	}, {
		key: 'setInterrupt',
		value: function setInterrupt(f) {
			this._flagInterrupt = f;
		}
	}, {
		key: 'getBreak',
		value: function getBreak() {
			return this._flagBreak;
		}
	}, {
		key: 'setBreak',
		value: function setBreak(f) {
			this._flagBreak = f;
		}
	}, {
		key: 'getDecimal',
		value: function getDecimal() {
			return this._flagDecimal;
		}
	}, {
		key: 'setDecimal',
		value: function setDecimal(f) {
			this._flagDecimal = f;
		}
	}, {
		key: 'getUnused',
		value: function getUnused() {
			return this._flagUnused;
		}
	}, {
		key: 'setUnused',
		value: function setUnused(f) {
			this._flagUnused = f;
		}
	}, {
		key: 'getCarry',
		value: function getCarry() {
			return this._flagCarry;
		}
	}, {
		key: 'setCarry',
		value: function setCarry(f) {
			this._flagCarry = f;
		}
	}, {
		key: 'getSign',
		value: function getSign() {
			return this._flagSign;
		}
	}, {
		key: 'setSign',
		value: function setSign(f) {
			this._flagSign = f;
		}
	}, {
		key: 'getRegA',
		value: function getRegA() {
			return this.regA;
		}
	}, {
		key: 'setRegA',
		value: function setRegA(f) {
			this.regA = f;
		}
	}, {
		key: 'getRegX',
		value: function getRegX() {
			return this.regX;
		}
	}, {
		key: 'setRegX',
		value: function setRegX(f) {
			this.regX = f;
		}
	}, {
		key: 'getRegY',
		value: function getRegY() {
			return this.regY;
		}
	}, {
		key: 'setRegY',
		value: function setRegY(f) {
			this.regY = f;
		}
	}, {
		key: 'setExecuteCallback',
		value: function setExecuteCallback(cb) {
			this.executeCallback = cb;
		}
	}, {
		key: 'getSubCycle',
		value: function getSubCycle() {
			return this.subcycle;
		}
	}, {
		key: 'handlePendingInterrupts',
		value: function handlePendingInterrupts() {

			// TODO: if an NMI interrupt is interrupted by a BRK, dont execute the BRK (6502 bug - fixed in the CMOS version)
			if (this.resetPending) {
				for (var i = 0; i < 3; ++i) {
					this.incrementStackReg();
				} // increment stack pointer but dont write to memory

				this.setBreak(false);
				this.setInterrupt(true);

				if (this.cmosVersion) this._flagDecimal = false;

				this.programCounter = this.mainboard.memory.read16NoZeroPageWrap(_consts.CPU_RESET_ADDRESS);
				//this.programCounter = 0xC000;
				this.resetPending = false;
				return 0;
			}

			if (this.nmiPending) {
				if (this.triggerNmiAfterNextInstruction) {
					this.triggerNmiAfterNextInstruction = false;
					return 0;
				}

				// NMI interrupt
				this.pushStack(this.programCounter >> 8 & 0xFF);
				this.incrementStackReg();
				this.pushStack(this.programCounter & 0xFF);
				this.incrementStackReg();

				this._flagBreak = false;

				this.pushStack(this.statusRegToByte());
				this.incrementStackReg();

				this._flagInterrupt = true;
				if (this.cmosVersion) this._flagDecimal = false;
				this.programCounter = this.mainboard.memory.read16NoZeroPageWrap(_consts.CPU_NMI_ADDRESS);
				this.nmiPending = false;
				return 7;
			}

			if (this.irqLineLow > 0 && !this.waitOneInstructionAfterCli && !this._flagInterrupt) {
				// IRQ interrupt
				this.pushStack(this.programCounter >> 8 & 0xFF);
				this.incrementStackReg();
				this.pushStack(this.programCounter & 0xFF);
				this.incrementStackReg();

				this._flagBreak = false;

				this.pushStack(this.statusRegToByte());
				this.incrementStackReg();

				this._flagInterrupt = true;
				if (this.cmosVersion) this._flagDecimal = false;
				this.programCounter = this.mainboard.memory.read16NoZeroPageWrap(_consts.CPU_IRQ_ADDRESS);
				return 7;
			}
			return 0;
		}
	}, {
		key: 'nonMaskableInterrupt',
		value: function nonMaskableInterrupt(ppuMasterTickCount) {
			(0, _Trace.writeLine)(_Trace.trace_cpu, 'NMI triggered');
			this.nmiPending = true;
			if (this.mainboard.synchroniser.isPpuTickOnLastCycleOfCpuInstruction(ppuMasterTickCount)) {
				// CPU is *always* either ahead or equal to the PPU master tick count.
				// Perform 1-instruction delay if NMI is triggered in the last cycle of an instruction
				this.triggerNmiAfterNextInstruction = true;
			}
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.resetVariables();
			this.resetPending = true;
		}
	}, {
		key: 'holdIrqLineLow',
		value: function holdIrqLineLow(low) {
			if (low) {
				this.irqLineLow++;
			} else {
				if (this.irqLineLow > 0) {
					this.irqLineLow--;
				}
			}
		}
	}, {
		key: 'statusRegToByte',
		value: function statusRegToByte() {
			var b = 0;
			b |= this._flagCarry ? 0x1 : 0;
			b |= this._flagZero ? 0x2 : 0;
			b |= this._flagInterrupt ? 0x4 : 0;
			b |= this._flagDecimal ? 0x8 : 0;
			b |= this._flagBreak ? 0x10 : 0;
			b |= this._flagUnused ? 0x20 : 0;
			b |= this._flagOverflow ? 0x40 : 0;
			b |= this._flagSign ? 0x80 : 0;
			return b;
		}
	}, {
		key: 'statusRegFromByte',
		value: function statusRegFromByte(b) {
			this._flagCarry = (b & 0x1) > 0;
			this._flagZero = (b & 0x2) > 0;
			this._flagInterrupt = (b & 0x4) > 0;
			this._flagDecimal = (b & 0x8) > 0;
			this._flagBreak = (b & 0x10) > 0;
			this._flagUnused = (b & 0x20) > 0;
			this._flagOverflow = (b & 0x40) > 0;
			this._flagSign = (b & 0x80) > 0;
		}
	}, {
		key: 'incrementStackReg',
		value: function incrementStackReg() {
			this.regS--;
			if (this.regS < 0) this.regS = 0xFF;
		}
	}, {
		key: 'decrementStackReg',
		value: function decrementStackReg() {
			this.regS++;
			if (this.regS > 0xFF) this.regS = 0;
		}
	}, {
		key: 'pushStack',
		value: function pushStack(value) {
			this.mainboard.memory.write8(0x100 + this.regS, value & 0xFF);
		}
	}, {
		key: 'popStack',
		value: function popStack(value) {
			return this.mainboard.memory.read8(0x100 + this.regS);
		}
	}, {
		key: 'read16FromMemNoWrap',
		value: function read16FromMemNoWrap(offsetAddress) {

			this.incrementSubcycle();
			var ret = this.mainboard.memory.read8(offsetAddress) & 0xFF;
			this.incrementSubcycle();
			var secondByte = this.mainboard.memory.read8(offsetAddress + 1 & 0xFFFF);
			ret |= (secondByte & 0xFF) << 8;
			return ret & 0xFFFF;
		}
	}, {
		key: 'read16FromMemWithWrap',
		value: function read16FromMemWithWrap(offsetAddress) {
			this.incrementSubcycle();
			var ret = this.mainboard.memory.read8(offsetAddress);
			var newoffset;
			if ((offsetAddress & 0xFF) === 0xFF) {
				newoffset = offsetAddress & 0xFF00;
			} else {
				newoffset = offsetAddress + 1;
			}
			this.incrementSubcycle();
			var secondByte = this.mainboard.memory.read8(newoffset & 0xFFFF);
			ret |= (secondByte & 0xFF) << 8;
			return ret & 0xFFFF;
		}
	}, {
		key: 'calculateRelativeDifference',
		value: function calculateRelativeDifference(pc, b) {
			var isSigned = (b & 0x80) > 0;
			if (isSigned) {
				var inverse = (b ^ 0xFF) + 1 & 0xFF;
				return pc - inverse;
			} else return pc + b;
		}
	}, {
		key: 'execute',
		value: function execute() {
			this.subcycle = 0;
			if (this.waitOneInstructionAfterCli) this.waitOneInstructionAfterCli = false;

			var opcode = this.mainboard.memory.read8(this.programCounter);
			var cyclesTaken = this._instructionSet[opcode](this, this.mainboard.memory);
			this.subcycle = 0;
			return cyclesTaken;
		}
	}, {
		key: '_hasProgramCounterBeenSeenBefore',
		value: function _hasProgramCounterBeenSeenBefore(pg) {

			for (var i = 0; i < this._previousTraceProgramCounters.length; ++i) {
				if (this._previousTraceProgramCounters[i] === pg) {
					return i;
				}
			}
			return -1;
		}
	}, {
		key: '_doTrace',
		value: function _doTrace() {
			var instructionData = _traceInstructions.cpuTrace;
			// check previous instructions for the same program counter
			var prevIndex = this._hasProgramCounterBeenSeenBefore(instructionData.programCounter);
			if (prevIndex >= 0) {
				// if it's the same loop as the one that's already detected, don't report.
				if (!this._inTraceLoop) {
					this._inTraceLoop = true;
					this._traceLoopCount = 0;
				}
				this._traceLoopCount++;
			} else {
				if (this._inTraceLoop) {
					this._inTraceLoop = false;
					(0, _Trace.writeLine)(_Trace.trace_cpuInstructions, "LOOP " + this._traceLoopCount + " TIMES");
					this._traceLoopCount = 0;
				}
			}

			if (!this._inTraceLoop) {
				this._previousTraceProgramCounters[this._previousTraceProgramCountersIndex] = instructionData.programCounter;
				this._previousTraceProgramCountersIndex = this._previousTraceProgramCountersIndex + 1 & 0x1F;
				(0, _Trace.writeLine)(_Trace.trace_cpuInstructions, _cpuTraceString2.default[instructionData.opcode](instructionData));
				//$.extend( true, {}, instructionData );
			}
		}
	}, {
		key: 'saveState',
		value: function saveState() {

			var data = {};
			data.programCounter = this.programCounter;
			data.subcycle = this.subcycle;
			data.waitOneInstructionAfterCli = this.waitOneInstructionAfterCli;
			data.resetPending = this.resetPending;
			data.nmiPending = this.nmiPending;
			data.irqLineLow = this.irqLineLow;
			data.triggerNmiAfterNextInstruction = this.triggerNmiAfterNextInstruction;

			data._flagCarry = this._flagCarry;
			data._flagZero = this._flagZero;
			data._flagInterrupt = this._flagInterrupt;
			data._flagDecimal = this._flagDecimal;
			data._flagBreak = this._flagBreak;
			data._flagUnused = this._flagUnused;
			data._flagOverflow = this._flagOverflow;
			data._flagSign = this._flagSign;

			data.regS = this.regS;
			data.regX = this.regX;
			data.regY = this.regY;
			data.regA = this.regA;
			data.SAYHighByte = this.SAYHighByte;
			return data;
		}
	}, {
		key: 'loadState',
		value: function loadState(state) {

			this.programCounter = state.programCounter;
			this.subcycle = state.subcycle;
			this.waitOneInstructionAfterCli = state.waitOneInstructionAfterCli;
			this.resetPending = state.resetPending;
			this.nmiPending = state.nmiPending;
			this.irqLineLow = state.irqLineLow;
			this.triggerNmiAfterNextInstruction = state.triggerNmiAfterNextInstruction;

			this._flagCarry = state._flagCarry;
			this._flagZero = state._flagZero;
			this._flagInterrupt = state._flagInterrupt;
			this._flagDecimal = state._flagDecimal;
			this._flagBreak = state._flagBreak;
			this._flagUnused = state._flagUnused;
			this._flagOverflow = state._flagOverflow;
			this._flagSign = state._flagSign;

			this.regS = state.regS;
			this.regX = state.regX;
			this.regY = state.regY;
			this.regA = state.regA;
			this.SAYHighByte = state.SAYHighByte;
		}
	}]);

	return Cpu6502;
}();

exports.default = Cpu6502;

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var formatCpuTraceString = [];
var formatStr;
formatCpuTraceString[0] = function (formatData) {
	// BRK NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " BRK ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[1] = function (formatData) {
	// ORA INDIRECTX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ORA ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[2] = function (formatData) {
	// HLT NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " HLT ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[3] = function (formatData) {
	// ASO INDIRECTX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ASO ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[4] = function (formatData) {
	// SKB ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKB ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[5] = function (formatData) {
	// ORA ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ORA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[6] = function (formatData) {
	// ASL ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ASL ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[7] = function (formatData) {
	// ASO ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ASO ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[8] = function (formatData) {
	// PHP NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " PHP ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[9] = function (formatData) {
	// ORA IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ORA ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[10] = function (formatData) {
	// ASL ACCUMULATOR
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ASL ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[11] = function (formatData) {
	// ANC IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ANC ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[12] = function (formatData) {
	// SKW ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKW ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[13] = function (formatData) {
	// ORA ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ORA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[14] = function (formatData) {
	// ASL ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ASL ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[15] = function (formatData) {
	// ASO ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ASO ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[16] = function (formatData) {
	// BPL RELATIVE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " BPL ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.operationParam, 4);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[17] = function (formatData) {
	// ORA INDIRECTY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ORA ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[18] = function (formatData) {
	// HLT NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " HLT ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[19] = function (formatData) {
	// ASO INDIRECTY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ASO ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[20] = function (formatData) {
	// SKB ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKB ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[21] = function (formatData) {
	// ORA ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ORA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[22] = function (formatData) {
	// ASL ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ASL ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[23] = function (formatData) {
	// ASO ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ASO ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[24] = function (formatData) {
	// CLC NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " CLC ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[25] = function (formatData) {
	// ORA ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ORA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[26] = function (formatData) {
	// NOP NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " NOP ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[27] = function (formatData) {
	// ASO ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ASO ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[28] = function (formatData) {
	// SKW ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKW ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[29] = function (formatData) {
	// ORA ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ORA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[30] = function (formatData) {
	// ASL ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ASL ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[31] = function (formatData) {
	// ASO ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ASO ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[32] = function (formatData) {
	// JSR IMMEDIATE16
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " JSR ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[33] = function (formatData) {
	// AND INDIRECTX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " AND ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[34] = function (formatData) {
	// HLT NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " HLT ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[35] = function (formatData) {
	// RLA INDIRECTX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " RLA ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[36] = function (formatData) {
	// BIT ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " BIT ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[37] = function (formatData) {
	// AND ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " AND ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[38] = function (formatData) {
	// ROL ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ROL ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[39] = function (formatData) {
	// RLA ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " RLA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[40] = function (formatData) {
	// PLP NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " PLP ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[41] = function (formatData) {
	// AND IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " AND ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[42] = function (formatData) {
	// ROL ACCUMULATOR
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ROL ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[43] = function (formatData) {
	// ANC IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ANC ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[44] = function (formatData) {
	// BIT ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " BIT ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[45] = function (formatData) {
	// AND ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " AND ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[46] = function (formatData) {
	// ROL ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ROL ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[47] = function (formatData) {
	// RLA ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " RLA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[48] = function (formatData) {
	// BMI RELATIVE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " BMI ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.operationParam, 4);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[49] = function (formatData) {
	// AND INDIRECTY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " AND ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[50] = function (formatData) {
	// HLT NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " HLT ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[51] = function (formatData) {
	// RLA INDIRECTY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " RLA ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[52] = function (formatData) {
	// SKB ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKB ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[53] = function (formatData) {
	// AND ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " AND ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[54] = function (formatData) {
	// ROL ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ROL ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[55] = function (formatData) {
	// RLA ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " RLA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[56] = function (formatData) {
	// SEC NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SEC ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[57] = function (formatData) {
	// AND ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " AND ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[58] = function (formatData) {
	// NOP NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " NOP ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[59] = function (formatData) {
	// RLA ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " RLA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[60] = function (formatData) {
	// SKW ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKW ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[61] = function (formatData) {
	// AND ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " AND ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[62] = function (formatData) {
	// ROL ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ROL ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[63] = function (formatData) {
	// RLA ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " RLA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[64] = function (formatData) {
	// RTI NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " RTI ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[65] = function (formatData) {
	// EOR INDIRECTX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " EOR ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[66] = function (formatData) {
	// HLT NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " HLT ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[67] = function (formatData) {
	// LSE INDIRECTX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LSE ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[68] = function (formatData) {
	// SKB ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKB ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[69] = function (formatData) {
	// EOR ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " EOR ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[70] = function (formatData) {
	// LSR ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LSR ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[71] = function (formatData) {
	// LSE ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LSE ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[72] = function (formatData) {
	// PHA NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " PHA ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[73] = function (formatData) {
	// EOR IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " EOR ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[74] = function (formatData) {
	// LSR ACCUMULATOR
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LSR ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[75] = function (formatData) {
	// ALR IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ALR ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[76] = function (formatData) {
	// JMP IMMEDIATE16
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " JMP ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[77] = function (formatData) {
	// EOR ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " EOR ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[78] = function (formatData) {
	// LSR ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LSR ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[79] = function (formatData) {
	// LSE ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LSE ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[80] = function (formatData) {
	// BVC RELATIVE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " BVC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.operationParam, 4);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[81] = function (formatData) {
	// EOR INDIRECTY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " EOR ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[82] = function (formatData) {
	// HLT NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " HLT ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[83] = function (formatData) {
	// LSE INDIRECTY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LSE ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[84] = function (formatData) {
	// SKB ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKB ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[85] = function (formatData) {
	// EOR ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " EOR ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[86] = function (formatData) {
	// LSR ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LSR ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[87] = function (formatData) {
	// LSE ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LSE ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[88] = function (formatData) {
	// CLI NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " CLI ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[89] = function (formatData) {
	// EOR ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " EOR ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[90] = function (formatData) {
	// NOP NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " NOP ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[91] = function (formatData) {
	// LSE ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LSE ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[92] = function (formatData) {
	// SKW ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKW ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[93] = function (formatData) {
	// EOR ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " EOR ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[94] = function (formatData) {
	// LSR ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LSR ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[95] = function (formatData) {
	// LSE ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LSE ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[96] = function (formatData) {
	// RTS NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " RTS ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[97] = function (formatData) {
	// ADC INDIRECTX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ADC ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[98] = function (formatData) {
	// HLT NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " HLT ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[99] = function (formatData) {
	// RRA INDIRECTX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " RRA ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[100] = function (formatData) {
	// SKB ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKB ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[101] = function (formatData) {
	// ADC ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ADC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[102] = function (formatData) {
	// ROR ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ROR ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[103] = function (formatData) {
	// RRA ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " RRA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[104] = function (formatData) {
	// PLA NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " PLA ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[105] = function (formatData) {
	// ADC IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ADC ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[106] = function (formatData) {
	// ROR ACCUMULATOR
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ROR ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[107] = function (formatData) {
	// ARR IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ARR ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[108] = function (formatData) {
	// JMP INDIRECT
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " JMP ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ") = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[109] = function (formatData) {
	// ADC ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ADC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[110] = function (formatData) {
	// ROR ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ROR ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[111] = function (formatData) {
	// RRA ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " RRA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[112] = function (formatData) {
	// BVS RELATIVE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " BVS ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.operationParam, 4);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[113] = function (formatData) {
	// ADC INDIRECTY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ADC ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[114] = function (formatData) {
	// HLT NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " HLT ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[115] = function (formatData) {
	// RRA INDIRECTY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " RRA ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[116] = function (formatData) {
	// SKB ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKB ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[117] = function (formatData) {
	// ADC ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ADC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[118] = function (formatData) {
	// ROR ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ROR ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[119] = function (formatData) {
	// RRA ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " RRA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[120] = function (formatData) {
	// SEI NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SEI ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[121] = function (formatData) {
	// ADC ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ADC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[122] = function (formatData) {
	// NOP NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " NOP ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[123] = function (formatData) {
	// RRA ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " RRA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[124] = function (formatData) {
	// SKW ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKW ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[125] = function (formatData) {
	// ADC ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ADC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[126] = function (formatData) {
	// ROR ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " ROR ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[127] = function (formatData) {
	// RRA ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " RRA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[128] = function (formatData) {
	// SKB IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKB ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[129] = function (formatData) {
	// STA INDIRECTX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " STA ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[130] = function (formatData) {
	// SKB IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKB ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[131] = function (formatData) {
	// AXS INDIRECTX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " AXS ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[132] = function (formatData) {
	// STY ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " STY ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[133] = function (formatData) {
	// STA ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " STA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[134] = function (formatData) {
	// STX ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " STX ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[135] = function (formatData) {
	// AXS ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " AXS ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[136] = function (formatData) {
	// DEY NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " DEY ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[137] = function (formatData) {
	// SKB IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKB ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[138] = function (formatData) {
	// TXA NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " TXA ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[139] = function (formatData) {
	// XAA IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " XAA ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[140] = function (formatData) {
	// STY ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " STY ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[141] = function (formatData) {
	// STA ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " STA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[142] = function (formatData) {
	// STX ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " STX ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[143] = function (formatData) {
	// AXS ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " AXS ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[144] = function (formatData) {
	// BCC RELATIVE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " BCC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.operationParam, 4);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[145] = function (formatData) {
	// STA INDIRECTY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " STA ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[146] = function (formatData) {
	// HLT NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " HLT ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[147] = function (formatData) {
	// AXA INDIRECTY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " AXA ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[148] = function (formatData) {
	// STY ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " STY ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[149] = function (formatData) {
	// STA ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " STA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[150] = function (formatData) {
	// STX ZEROPAGEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " STX ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[151] = function (formatData) {
	// AXS ZEROPAGEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " AXS ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[152] = function (formatData) {
	// TYA NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " TYA ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[153] = function (formatData) {
	// STA ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " STA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[154] = function (formatData) {
	// TXS NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " TXS ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[155] = function (formatData) {
	// TAS ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " TAS ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[156] = function (formatData) {
	// SAY SAY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SAY ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[157] = function (formatData) {
	// STA ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " STA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[158] = function (formatData) {
	// XAS ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " XAS ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[159] = function (formatData) {
	// AXA ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " AXA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[160] = function (formatData) {
	// LDY IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LDY ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[161] = function (formatData) {
	// LDA INDIRECTX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LDA ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[162] = function (formatData) {
	// LDX IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LDX ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[163] = function (formatData) {
	// LAX INDIRECTX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LAX ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[164] = function (formatData) {
	// LDY ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LDY ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[165] = function (formatData) {
	// LDA ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LDA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[166] = function (formatData) {
	// LDX ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LDX ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[167] = function (formatData) {
	// LAX ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LAX ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[168] = function (formatData) {
	// TAY NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " TAY ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[169] = function (formatData) {
	// LDA IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LDA ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[170] = function (formatData) {
	// TAX NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " TAX ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[171] = function (formatData) {
	// OAL IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " OAL ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[172] = function (formatData) {
	// LDY ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LDY ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[173] = function (formatData) {
	// LDA ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LDA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[174] = function (formatData) {
	// LDX ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LDX ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[175] = function (formatData) {
	// LAX ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LAX ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[176] = function (formatData) {
	// BCS RELATIVE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " BCS ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.operationParam, 4);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[177] = function (formatData) {
	// LDA INDIRECTY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LDA ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[178] = function (formatData) {
	// HLT NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " HLT ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[179] = function (formatData) {
	// LAX INDIRECTY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LAX ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[180] = function (formatData) {
	// LDY ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LDY ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[181] = function (formatData) {
	// LDA ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LDA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[182] = function (formatData) {
	// LDX ZEROPAGEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LDX ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[183] = function (formatData) {
	// LAX ZEROPAGEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LAX ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[184] = function (formatData) {
	// CLV NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " CLV ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[185] = function (formatData) {
	// LDA ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LDA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[186] = function (formatData) {
	// TSX NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " TSX ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[187] = function (formatData) {
	// LAS ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LAS ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[188] = function (formatData) {
	// LDY ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LDY ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[189] = function (formatData) {
	// LDA ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LDA ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[190] = function (formatData) {
	// LDX ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LDX ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[191] = function (formatData) {
	// LAX ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " LAX ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[192] = function (formatData) {
	// CPY IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " CPY ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[193] = function (formatData) {
	// CMP INDIRECTX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " CMP ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[194] = function (formatData) {
	// SKB IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKB ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[195] = function (formatData) {
	// DCM INDIRECTX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " DCM ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[196] = function (formatData) {
	// CPY ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " CPY ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[197] = function (formatData) {
	// CMP ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " CMP ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[198] = function (formatData) {
	// DEC ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " DEC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[199] = function (formatData) {
	// DCM ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " DCM ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[200] = function (formatData) {
	// INY NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " INY ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[201] = function (formatData) {
	// CMP IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " CMP ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[202] = function (formatData) {
	// DEX NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " DEX ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[203] = function (formatData) {
	// SAX IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SAX ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[204] = function (formatData) {
	// CPY ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " CPY ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[205] = function (formatData) {
	// CMP ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " CMP ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[206] = function (formatData) {
	// DEC ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " DEC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[207] = function (formatData) {
	// DCM ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " DCM ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[208] = function (formatData) {
	// BNE RELATIVE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " BNE ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.operationParam, 4);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[209] = function (formatData) {
	// CMP INDIRECTY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " CMP ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[210] = function (formatData) {
	// HLT NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " HLT ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[211] = function (formatData) {
	// DCM INDIRECTY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " DCM ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[212] = function (formatData) {
	// SKB ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKB ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[213] = function (formatData) {
	// CMP ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " CMP ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[214] = function (formatData) {
	// DEC ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " DEC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[215] = function (formatData) {
	// DCM ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " DCM ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[216] = function (formatData) {
	// CLD NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " CLD ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[217] = function (formatData) {
	// CMP ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " CMP ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[218] = function (formatData) {
	// NOP NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " NOP ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[219] = function (formatData) {
	// DCM ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " DCM ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[220] = function (formatData) {
	// SKW ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKW ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[221] = function (formatData) {
	// CMP ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " CMP ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[222] = function (formatData) {
	// DEC ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " DEC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[223] = function (formatData) {
	// DCM ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " DCM ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[224] = function (formatData) {
	// CPX IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " CPX ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[225] = function (formatData) {
	// SBC INDIRECTX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SBC ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[226] = function (formatData) {
	// SKB IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKB ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[227] = function (formatData) {
	// INS INDIRECTX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " INS ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X) = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[228] = function (formatData) {
	// CPX ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " CPX ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[229] = function (formatData) {
	// SBC ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SBC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[230] = function (formatData) {
	// INC ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " INC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[231] = function (formatData) {
	// INS ZEROPAGE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " INS ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[232] = function (formatData) {
	// INX NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " INX ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[233] = function (formatData) {
	// SBC IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SBC ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[234] = function (formatData) {
	// NOP NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " NOP ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[235] = function (formatData) {
	// SBC IMMEDIATE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SBC ";
	formatStr += "#$" + ZERO_PAD_HEX(formatData.opcodeParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[236] = function (formatData) {
	// CPX ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " CPX ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[237] = function (formatData) {
	// SBC ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SBC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[238] = function (formatData) {
	// INC ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " INC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[239] = function (formatData) {
	// INS ABSOLUTE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " INS ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + " = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[240] = function (formatData) {
	// BEQ RELATIVE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " BEQ ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.operationParam, 4);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[241] = function (formatData) {
	// SBC INDIRECTY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SBC ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[242] = function (formatData) {
	// HLT NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " HLT ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[243] = function (formatData) {
	// INS INDIRECTY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " INS ";
	formatStr += "($" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + "), Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[244] = function (formatData) {
	// SKB ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKB ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[245] = function (formatData) {
	// SBC ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SBC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[246] = function (formatData) {
	// INC ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " INC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[247] = function (formatData) {
	// INS ZEROPAGEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " INS ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 2) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[248] = function (formatData) {
	// SED NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SED ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[249] = function (formatData) {
	// SBC ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SBC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[250] = function (formatData) {
	// NOP NONE
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " NOP ";
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[251] = function (formatData) {
	// INS ABSOLUTEY
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " INS ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", Y = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[252] = function (formatData) {
	// SKW ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SKW ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[253] = function (formatData) {
	// SBC ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " SBC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[254] = function (formatData) {
	// INC ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " INC ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};
formatCpuTraceString[255] = function (formatData) {
	// INS ABSOLUTEX
	formatStr = ZERO_PAD_HEX(formatData.programCounter, 4) + " INS ";
	formatStr += "$" + ZERO_PAD_HEX(formatData.opcodeParam, 4) + ", X = " + ZERO_PAD_HEX(formatData.operationParam, 2);
	while (formatStr.length < 47) {
		formatStr += " ";
	}
	formatStr += " A:" + ZERO_PAD_HEX(formatData.regs.a, 2);
	formatStr += " X:" + ZERO_PAD_HEX(formatData.regs.x, 2);
	formatStr += " Y:" + ZERO_PAD_HEX(formatData.regs.y, 2);
	formatStr += " P:" + ZERO_PAD_HEX(formatData.regs.p, 2);
	formatStr += " SP:" + ZERO_PAD_HEX(formatData.regs.sp, 2);
	return formatStr;
};

var traceFunctions = exports.traceFunctions = formatCpuTraceString;

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _consts = __webpack_require__(0);

var instructions = [];

function BRK_NONE_0(cpu, memory) {
	var cyclesTaken = 7;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	// dummy read of opcode after brk
	memory.read8(cpu.getPC());
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	memory.write8(0x100 + cpu.regS, cpu.getPC() >> 8 & 0xFF);
	if (cpu.regS === 0) {
		cpu.regS = 0xFF;
	} else {
		cpu.regS--;
	}
	cpu.incrementSubcycle();
	memory.write8(0x100 + cpu.regS, cpu.programCounter & 0xFF);
	if (cpu.regS === 0) {
		cpu.regS = 0xFF;
	} else {
		cpu.regS--;
	}
	cpu.incrementSubcycle();
	memory.write8(0x100 + cpu.regS, (cpu.statusRegToByte() | 0x30) & 0xFF);
	if (cpu.regS === 0) {
		cpu.regS = 0xFF;
	} else {
		cpu.regS--;
	}
	cpu.setPC(cpu.read16FromMemNoWrap(_consts.CPU_IRQ_ADDRESS));
	cpu.setInterrupt(true);
	return cyclesTaken;
};
instructions[0] = BRK_NONE_0;
function ORA_INDIRECTX_1(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA |= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[1] = ORA_INDIRECTX_1;
function HLT_NONE_2(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("HLT_NONE_2 illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions[2] = HLT_NONE_2;
function ASO_INDIRECTX_3(cpu, memory) {
	var cyclesTaken = 8;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = operationModeData << 1 & 0xFF;
	cpu.regA |= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[3] = ASO_INDIRECTX_3;
function SKB_ZEROPAGE_4(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	return cyclesTaken;
};
instructions[4] = SKB_ZEROPAGE_4;
function ORA_ZEROPAGE_5(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA |= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[5] = ORA_ZEROPAGE_5;
function ASL_ZEROPAGE_6(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = (operationModeData & 0xFF) << 1 & 0xFF;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[6] = ASL_ZEROPAGE_6;
function ASO_ZEROPAGE_7(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = operationModeData << 1 & 0xFF;
	cpu.regA |= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[7] = ASO_ZEROPAGE_7;
function PHP_NONE_8(cpu, memory) {
	var cyclesTaken = 3;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	memory.write8(0x100 + cpu.regS, (cpu.statusRegToByte() | 0x10) & 0xFF);
	if (cpu.regS === 0) {
		cpu.regS = 0xFF;
	} else {
		cpu.regS--;
	}
	return cyclesTaken;
};
instructions[8] = PHP_NONE_8;
function ORA_IMMEDIATE_9(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regA |= readInValue & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[9] = ORA_IMMEDIATE_9;
function ASL_ACCUMULATOR_10(cpu, memory) {
	var cyclesTaken = 2;
	var readInValue = cpu.regA;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.setCarry((readInValue & 0x80) > 0);
	var result = (readInValue & 0xFF) << 1 & 0xFF;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.regA = result & 0xFF;
	return cyclesTaken;
};
instructions[10] = ASL_ACCUMULATOR_10;
function ANC_IMMEDIATE_11(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regA &= readInValue;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.setCarry(cpu.getSign());
	return cyclesTaken;
};
instructions[11] = ANC_IMMEDIATE_11;
function SKW_ABSOLUTE_12(cpu, memory) {
	var cyclesTaken = 4;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	return cyclesTaken;
};
instructions[12] = SKW_ABSOLUTE_12;
function ORA_ABSOLUTE_13(cpu, memory) {
	var cyclesTaken = 4;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA |= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[13] = ORA_ABSOLUTE_13;
function ASL_ABSOLUTE_14(cpu, memory) {
	var cyclesTaken = 6;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = (operationModeData & 0xFF) << 1 & 0xFF;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[14] = ASL_ABSOLUTE_14;
function ASO_ABSOLUTE_15(cpu, memory) {
	var cyclesTaken = 6;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = operationModeData << 1 & 0xFF;
	cpu.regA |= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[15] = ASO_ABSOLUTE_15;
function BPL_RELATIVE_16(cpu, memory) {
	var cyclesTaken = 2;
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
	var branchTaken = !cpu.getSign();
	if (branchTaken) {
		cpu.incrementSubcycle();
		if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
			cyclesTaken += 1;
			cpu.incrementSubcycle();
		}
		cyclesTaken += 1;
		cpu.incrementSubcycle();
		cpu.setPC(readInValue + 2 & 0xFFFF);
	} else {
		cpu.incrementSubcycle();
		memory.read8(cpu.getPC() + 1 & 0xFFFF);
		cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	}
	return cyclesTaken;
};
instructions[16] = BPL_RELATIVE_16;
function ORA_INDIRECTY_17(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA |= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[17] = ORA_INDIRECTY_17;
function HLT_NONE_18(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("HLT_NONE_18 illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions[18] = HLT_NONE_18;
function ASO_INDIRECTY_19(cpu, memory) {
	var cyclesTaken = 8;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = operationModeData << 1 & 0xFF;
	cpu.regA |= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[19] = ASO_INDIRECTY_19;
function SKB_ZEROPAGEX_20(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	return cyclesTaken;
};
instructions[20] = SKB_ZEROPAGEX_20;
function ORA_ZEROPAGEX_21(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA |= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[21] = ORA_ZEROPAGEX_21;
function ASL_ZEROPAGEX_22(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = (operationModeData & 0xFF) << 1 & 0xFF;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[22] = ASL_ZEROPAGEX_22;
function ASO_ZEROPAGEX_23(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = operationModeData << 1 & 0xFF;
	cpu.regA |= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[23] = ASO_ZEROPAGEX_23;
function CLC_NONE_24(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.setCarry(false);
	return cyclesTaken;
};
instructions[24] = CLC_NONE_24;
function ORA_ABSOLUTEY_25(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA |= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[25] = ORA_ABSOLUTEY_25;
function NOP_NONE_26(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	return cyclesTaken;
};
instructions[26] = NOP_NONE_26;
function ASO_ABSOLUTEY_27(cpu, memory) {
	var cyclesTaken = 7;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = operationModeData << 1 & 0xFF;
	cpu.regA |= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[27] = ASO_ABSOLUTEY_27;
function SKW_ABSOLUTEX_28(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	return cyclesTaken;
};
instructions[28] = SKW_ABSOLUTEX_28;
function ORA_ABSOLUTEX_29(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA |= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[29] = ORA_ABSOLUTEX_29;
function ASL_ABSOLUTEX_30(cpu, memory) {
	var cyclesTaken = 7;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = (operationModeData & 0xFF) << 1 & 0xFF;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[30] = ASL_ABSOLUTEX_30;
function ASO_ABSOLUTEX_31(cpu, memory) {
	var cyclesTaken = 7;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = operationModeData << 1 & 0xFF;
	cpu.regA |= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[31] = ASO_ABSOLUTEX_31;
function JSR_IMMEDIATE16_32(cpu, memory) {
	var cyclesTaken = 6;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	var result = cpu.getPC() - 1;
	if (result < 0) result = 0xFFFF;
	cpu.incrementSubcycle();
	memory.write8(0x100 + cpu.regS, result >> 8 & 0xFF);
	if (cpu.regS === 0) {
		cpu.regS = 0xFF;
	} else {
		cpu.regS--;
	}
	cpu.incrementSubcycle();
	memory.write8(0x100 + cpu.regS, result & 0xFF);
	if (cpu.regS === 0) {
		cpu.regS = 0xFF;
	} else {
		cpu.regS--;
	}
	cpu.incrementSubcycle();
	cpu.setPC(readInValue & 0xFFFF);
	return cyclesTaken;
};
instructions[32] = JSR_IMMEDIATE16_32;
function AND_INDIRECTX_33(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA &= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[33] = AND_INDIRECTX_33;
function HLT_NONE_34(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("HLT_NONE_34 illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions[34] = HLT_NONE_34;
function RLA_INDIRECTX_35(cpu, memory) {
	var cyclesTaken = 8;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.regA &= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[35] = RLA_INDIRECTX_35;
function BIT_ZEROPAGE_36(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	if ((readInValue & 0xE007) === 0x2002) {
		cpu.mainboard.ppu.bitOperationHappening();
	} // BIT 2002 optimisation
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.setSign((operationModeData & 0xFF & 0x80) > 0);
	cpu.setZero((cpu.regA & (operationModeData & 0xFF) & 0xFF) === 0);
	cpu.setOverflow((operationModeData & 0x40) > 0); // Copy bit 6 to OVERFLOW flag.
	return cyclesTaken;
};
instructions[36] = BIT_ZEROPAGE_36;
function AND_ZEROPAGE_37(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA &= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[37] = AND_ZEROPAGE_37;
function ROL_ZEROPAGE_38(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = (operationModeData & 0xFF) << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[38] = ROL_ZEROPAGE_38;
function RLA_ZEROPAGE_39(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.regA &= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[39] = RLA_ZEROPAGE_39;
function PLP_NONE_40(cpu, memory) {
	var cyclesTaken = 4;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.waitOneInstructionAfterCli = cpu.getInterrupt() === true;
	cpu.incrementSubcycle();
	memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	if (cpu.regS === 0xFF) {
		cpu.regS = 0;
	} else {
		cpu.regS++;
	}
	cpu.incrementSubcycle();
	var temp = memory.read8(0x100 + cpu.regS);
	cpu.statusRegFromByte(temp);
	cpu.setBreak(true); // TODO: this was true before in original port, put it back for some reason?
	cpu.setUnused(true);
	if (cpu.waitOneInstructionAfterCli) cpu.waitOneInstructionAfterCli = cpu.getInterrupt() === false;
	return cyclesTaken;
};
instructions[40] = PLP_NONE_40;
function AND_IMMEDIATE_41(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regA &= readInValue & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[41] = AND_IMMEDIATE_41;
function ROL_ACCUMULATOR_42(cpu, memory) {
	var cyclesTaken = 2;
	var readInValue = cpu.regA;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	var result = (readInValue & 0xFF) << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.regA = result & 0xFF;
	return cyclesTaken;
};
instructions[42] = ROL_ACCUMULATOR_42;
function ANC_IMMEDIATE_43(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regA &= readInValue;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.setCarry(cpu.getSign());
	return cyclesTaken;
};
instructions[43] = ANC_IMMEDIATE_43;
function BIT_ABSOLUTE_44(cpu, memory) {
	var cyclesTaken = 4;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	if ((readInValue & 0xE007) === 0x2002) {
		cpu.mainboard.ppu.bitOperationHappening();
	} // BIT 2002 optimisation
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.setSign((operationModeData & 0xFF & 0x80) > 0);
	cpu.setZero((cpu.regA & (operationModeData & 0xFF) & 0xFF) === 0);
	cpu.setOverflow((operationModeData & 0x40) > 0); // Copy bit 6 to OVERFLOW flag.
	return cyclesTaken;
};
instructions[44] = BIT_ABSOLUTE_44;
function AND_ABSOLUTE_45(cpu, memory) {
	var cyclesTaken = 4;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA &= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[45] = AND_ABSOLUTE_45;
function ROL_ABSOLUTE_46(cpu, memory) {
	var cyclesTaken = 6;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = (operationModeData & 0xFF) << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[46] = ROL_ABSOLUTE_46;
function RLA_ABSOLUTE_47(cpu, memory) {
	var cyclesTaken = 6;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.regA &= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[47] = RLA_ABSOLUTE_47;
function BMI_RELATIVE_48(cpu, memory) {
	var cyclesTaken = 2;
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
	var branchTaken = cpu.getSign();
	if (branchTaken) {
		cpu.incrementSubcycle();
		if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
			cyclesTaken += 1;
			cpu.incrementSubcycle();
		}
		cyclesTaken += 1;
		cpu.incrementSubcycle();
		cpu.setPC(readInValue + 2 & 0xFFFF);
	} else {
		cpu.incrementSubcycle();
		memory.read8(cpu.getPC() + 1 & 0xFFFF);
		cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	}
	return cyclesTaken;
};
instructions[48] = BMI_RELATIVE_48;
function AND_INDIRECTY_49(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA &= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[49] = AND_INDIRECTY_49;
function HLT_NONE_50(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("HLT_NONE_50 illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions[50] = HLT_NONE_50;
function RLA_INDIRECTY_51(cpu, memory) {
	var cyclesTaken = 8;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.regA &= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[51] = RLA_INDIRECTY_51;
function SKB_ZEROPAGEX_52(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	return cyclesTaken;
};
instructions[52] = SKB_ZEROPAGEX_52;
function AND_ZEROPAGEX_53(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA &= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[53] = AND_ZEROPAGEX_53;
function ROL_ZEROPAGEX_54(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = (operationModeData & 0xFF) << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[54] = ROL_ZEROPAGEX_54;
function RLA_ZEROPAGEX_55(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.regA &= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[55] = RLA_ZEROPAGEX_55;
function SEC_NONE_56(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.setCarry(true);
	return cyclesTaken;
};
instructions[56] = SEC_NONE_56;
function AND_ABSOLUTEY_57(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA &= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[57] = AND_ABSOLUTEY_57;
function NOP_NONE_58(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	return cyclesTaken;
};
instructions[58] = NOP_NONE_58;
function RLA_ABSOLUTEY_59(cpu, memory) {
	var cyclesTaken = 7;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.regA &= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[59] = RLA_ABSOLUTEY_59;
function SKW_ABSOLUTEX_60(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	return cyclesTaken;
};
instructions[60] = SKW_ABSOLUTEX_60;
function AND_ABSOLUTEX_61(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA &= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[61] = AND_ABSOLUTEX_61;
function ROL_ABSOLUTEX_62(cpu, memory) {
	var cyclesTaken = 7;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = (operationModeData & 0xFF) << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[62] = ROL_ABSOLUTEX_62;
function RLA_ABSOLUTEX_63(cpu, memory) {
	var cyclesTaken = 7;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.regA &= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[63] = RLA_ABSOLUTEX_63;
function RTI_NONE_64(cpu, memory) {
	var cyclesTaken = 6;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	// dummy read
	cpu.incrementSubcycle();
	memory.read8(cpu.getPC());
	cpu.incrementSubcycle();
	if (cpu.regS === 0xFF) {
		cpu.regS = 0;
	} else {
		cpu.regS++;
	}
	cpu.incrementSubcycle();
	var temp = memory.read8(0x100 + cpu.regS);
	cpu.statusRegFromByte(temp);
	if (cpu.regS === 0xFF) {
		cpu.regS = 0;
	} else {
		cpu.regS++;
	}
	cpu.incrementSubcycle();
	cpu.programCounter = memory.read8(0x100 + cpu.regS);
	if (cpu.regS === 0xFF) {
		cpu.regS = 0;
	} else {
		cpu.regS++;
	}
	cpu.incrementSubcycle();
	temp = memory.read8(0x100 + cpu.regS);
	cpu.programCounter |= (temp & 0xFF) << 8;
	cpu.setBreak(true);
	cpu.setUnused(true);
	return cyclesTaken;
};
instructions[64] = RTI_NONE_64;
function EOR_INDIRECTX_65(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[65] = EOR_INDIRECTX_65;
function HLT_NONE_66(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("HLT_NONE_66 illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions[66] = HLT_NONE_66;
function LSE_INDIRECTX_67(cpu, memory) {
	var cyclesTaken = 8;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = operationModeData >> 1 & 0xFF;
	cpu.regA ^= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[67] = LSE_INDIRECTX_67;
function SKB_ZEROPAGE_68(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	return cyclesTaken;
};
instructions[68] = SKB_ZEROPAGE_68;
function EOR_ZEROPAGE_69(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[69] = EOR_ZEROPAGE_69;
function LSR_ZEROPAGE_70(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = (operationModeData & 0xFF) >> 1;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[70] = LSR_ZEROPAGE_70;
function LSE_ZEROPAGE_71(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = operationModeData >> 1 & 0xFF;
	cpu.regA ^= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[71] = LSE_ZEROPAGE_71;
function PHA_NONE_72(cpu, memory) {
	var cyclesTaken = 3;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	memory.write8(0x100 + cpu.regS, cpu.regA & 0xFF);
	if (cpu.regS === 0) {
		cpu.regS = 0xFF;
	} else {
		cpu.regS--;
	}
	return cyclesTaken;
};
instructions[72] = PHA_NONE_72;
function EOR_IMMEDIATE_73(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regA = (cpu.regA ^ readInValue & 0xFF) & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[73] = EOR_IMMEDIATE_73;
function LSR_ACCUMULATOR_74(cpu, memory) {
	var cyclesTaken = 2;
	var readInValue = cpu.regA;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.setCarry((readInValue & 0x01) > 0);
	var result = (readInValue & 0xFF) >> 1;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.regA = result & 0xFF;
	return cyclesTaken;
};
instructions[74] = LSR_ACCUMULATOR_74;
function ALR_IMMEDIATE_75(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regA &= readInValue;
	cpu.setCarry((cpu.regA & 0x01) > 0);
	cpu.regA = cpu.regA >> 1 & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[75] = ALR_IMMEDIATE_75;
function JMP_IMMEDIATE16_76(cpu, memory) {
	var cyclesTaken = 3;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.setPC(readInValue & 0xFFFF);
	return cyclesTaken;
};
instructions[76] = JMP_IMMEDIATE16_76;
function EOR_ABSOLUTE_77(cpu, memory) {
	var cyclesTaken = 4;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[77] = EOR_ABSOLUTE_77;
function LSR_ABSOLUTE_78(cpu, memory) {
	var cyclesTaken = 6;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = (operationModeData & 0xFF) >> 1;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[78] = LSR_ABSOLUTE_78;
function LSE_ABSOLUTE_79(cpu, memory) {
	var cyclesTaken = 6;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = operationModeData >> 1 & 0xFF;
	cpu.regA ^= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[79] = LSE_ABSOLUTE_79;
function BVC_RELATIVE_80(cpu, memory) {
	var cyclesTaken = 2;
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
	var branchTaken = !cpu.getOverflow();
	if (branchTaken) {
		cpu.incrementSubcycle();
		if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
			cyclesTaken += 1;
			cpu.incrementSubcycle();
		}
		cyclesTaken += 1;
		cpu.incrementSubcycle();
		cpu.setPC(readInValue + 2 & 0xFFFF);
	} else {
		cpu.incrementSubcycle();
		memory.read8(cpu.getPC() + 1 & 0xFFFF);
		cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	}
	return cyclesTaken;
};
instructions[80] = BVC_RELATIVE_80;
function EOR_INDIRECTY_81(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[81] = EOR_INDIRECTY_81;
function HLT_NONE_82(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("HLT_NONE_82 illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions[82] = HLT_NONE_82;
function LSE_INDIRECTY_83(cpu, memory) {
	var cyclesTaken = 8;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = operationModeData >> 1 & 0xFF;
	cpu.regA ^= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[83] = LSE_INDIRECTY_83;
function SKB_ZEROPAGEX_84(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	return cyclesTaken;
};
instructions[84] = SKB_ZEROPAGEX_84;
function EOR_ZEROPAGEX_85(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[85] = EOR_ZEROPAGEX_85;
function LSR_ZEROPAGEX_86(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = (operationModeData & 0xFF) >> 1;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[86] = LSR_ZEROPAGEX_86;
function LSE_ZEROPAGEX_87(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = operationModeData >> 1 & 0xFF;
	cpu.regA ^= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[87] = LSE_ZEROPAGEX_87;
function CLI_NONE_88(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.waitOneInstructionAfterCli = cpu.getInterrupt() === true;
	cpu.setInterrupt(false);
	return cyclesTaken;
};
instructions[88] = CLI_NONE_88;
function EOR_ABSOLUTEY_89(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[89] = EOR_ABSOLUTEY_89;
function NOP_NONE_90(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	return cyclesTaken;
};
instructions[90] = NOP_NONE_90;
function LSE_ABSOLUTEY_91(cpu, memory) {
	var cyclesTaken = 7;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = operationModeData >> 1 & 0xFF;
	cpu.regA ^= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[91] = LSE_ABSOLUTEY_91;
function SKW_ABSOLUTEX_92(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	return cyclesTaken;
};
instructions[92] = SKW_ABSOLUTEX_92;
function EOR_ABSOLUTEX_93(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[93] = EOR_ABSOLUTEX_93;
function LSR_ABSOLUTEX_94(cpu, memory) {
	var cyclesTaken = 7;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = (operationModeData & 0xFF) >> 1;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[94] = LSR_ABSOLUTEX_94;
function LSE_ABSOLUTEX_95(cpu, memory) {
	var cyclesTaken = 7;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = operationModeData >> 1 & 0xFF;
	cpu.regA ^= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[95] = LSE_ABSOLUTEX_95;
function RTS_NONE_96(cpu, memory) {
	var cyclesTaken = 6;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	// dummy read
	cpu.incrementSubcycle();
	memory.read8(cpu.getPC());
	cpu.incrementSubcycle();
	if (cpu.regS === 0xFF) {
		cpu.regS = 0;
	} else {
		cpu.regS++;
	}
	cpu.incrementSubcycle();
	cpu.programCounter = memory.read8(0x100 + cpu.regS);
	if (cpu.regS === 0xFF) {
		cpu.regS = 0;
	} else {
		cpu.regS++;
	}
	cpu.incrementSubcycle();
	var temp = memory.read8(0x100 + cpu.regS);
	cpu.programCounter |= (temp & 0xFF) << 8;
	cpu.incrementSubcycle();
	cpu.programCounter = cpu.getPC() + 1 & 0xFFFF;
	return cyclesTaken;
};
instructions[96] = RTS_NONE_96;
function ADC_INDIRECTX_97(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions[97] = ADC_INDIRECTX_97;
function HLT_NONE_98(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("HLT_NONE_98 illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions[98] = HLT_NONE_98;
function RRA_INDIRECTX_99(cpu, memory) {
	var cyclesTaken = 8;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry((operationModeData & 0x1) > 0);
	var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	result &= 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[99] = RRA_INDIRECTX_99;
function SKB_ZEROPAGE_100(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	return cyclesTaken;
};
instructions[100] = SKB_ZEROPAGE_100;
function ADC_ZEROPAGE_101(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions[101] = ADC_ZEROPAGE_101;
function ROR_ZEROPAGE_102(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = (operationModeData & 0xFF) >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry(operationModeData & 0x1);
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[102] = ROR_ZEROPAGE_102;
function RRA_ZEROPAGE_103(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry((operationModeData & 0x1) > 0);
	var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	result &= 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[103] = RRA_ZEROPAGE_103;
function PLA_NONE_104(cpu, memory) {
	var cyclesTaken = 4;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	if (cpu.regS === 0xFF) {
		cpu.regS = 0;
	} else {
		cpu.regS++;
	}
	cpu.incrementSubcycle();
	cpu.regA = memory.read8(0x100 + cpu.regS);
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[104] = PLA_NONE_104;
function ADC_IMMEDIATE_105(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var temp = (readInValue & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (readInValue ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions[105] = ADC_IMMEDIATE_105;
function ROR_ACCUMULATOR_106(cpu, memory) {
	var cyclesTaken = 2;
	var readInValue = cpu.regA;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	var result = (readInValue & 0xFF) >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry(readInValue & 0x1);
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.regA = result & 0xFF;
	return cyclesTaken;
};
instructions[106] = ROR_ACCUMULATOR_106;
function ARR_IMMEDIATE_107(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regA &= readInValue & 0xFF;
	cpu.regA = cpu.regA >> 1 & 0xFF | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry((cpu.regA & 0x1) > 0);
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.setOverflow(false);
	cpu.setCarry(false);
	switch (cpu.regA & 0x60) {
		case 0x20:
			cpu.setOverflow(true);break;
		case 0x40:
			cpu.setOverflow(true);
			cpu.setCarry(true);break;
		case 0x60:
			cpu.setCarry(true);break;
	}
	return cyclesTaken;
};
instructions[107] = ARR_IMMEDIATE_107;
function JMP_INDIRECT_108(cpu, memory) {
	var cyclesTaken = 5;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.setPC(readInValue & 0xFFFF);
	return cyclesTaken;
};
instructions[108] = JMP_INDIRECT_108;
function ADC_ABSOLUTE_109(cpu, memory) {
	var cyclesTaken = 4;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions[109] = ADC_ABSOLUTE_109;
function ROR_ABSOLUTE_110(cpu, memory) {
	var cyclesTaken = 6;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = (operationModeData & 0xFF) >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry(operationModeData & 0x1);
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[110] = ROR_ABSOLUTE_110;
function RRA_ABSOLUTE_111(cpu, memory) {
	var cyclesTaken = 6;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry((operationModeData & 0x1) > 0);
	var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	result &= 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[111] = RRA_ABSOLUTE_111;
function BVS_RELATIVE_112(cpu, memory) {
	var cyclesTaken = 2;
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
	var branchTaken = cpu.getOverflow();
	if (branchTaken) {
		cpu.incrementSubcycle();
		if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
			cyclesTaken += 1;
			cpu.incrementSubcycle();
		}
		cyclesTaken += 1;
		cpu.incrementSubcycle();
		cpu.setPC(readInValue + 2 & 0xFFFF);
	} else {
		cpu.incrementSubcycle();
		memory.read8(cpu.getPC() + 1 & 0xFFFF);
		cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	}
	return cyclesTaken;
};
instructions[112] = BVS_RELATIVE_112;
function ADC_INDIRECTY_113(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions[113] = ADC_INDIRECTY_113;
function HLT_NONE_114(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("HLT_NONE_114 illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions[114] = HLT_NONE_114;
function RRA_INDIRECTY_115(cpu, memory) {
	var cyclesTaken = 8;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry((operationModeData & 0x1) > 0);
	var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	result &= 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[115] = RRA_INDIRECTY_115;
function SKB_ZEROPAGEX_116(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	return cyclesTaken;
};
instructions[116] = SKB_ZEROPAGEX_116;
function ADC_ZEROPAGEX_117(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions[117] = ADC_ZEROPAGEX_117;
function ROR_ZEROPAGEX_118(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = (operationModeData & 0xFF) >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry(operationModeData & 0x1);
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[118] = ROR_ZEROPAGEX_118;
function RRA_ZEROPAGEX_119(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry((operationModeData & 0x1) > 0);
	var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	result &= 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[119] = RRA_ZEROPAGEX_119;
function SEI_NONE_120(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.setInterrupt(true);
	return cyclesTaken;
};
instructions[120] = SEI_NONE_120;
function ADC_ABSOLUTEY_121(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions[121] = ADC_ABSOLUTEY_121;
function NOP_NONE_122(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	return cyclesTaken;
};
instructions[122] = NOP_NONE_122;
function RRA_ABSOLUTEY_123(cpu, memory) {
	var cyclesTaken = 7;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry((operationModeData & 0x1) > 0);
	var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	result &= 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[123] = RRA_ABSOLUTEY_123;
function SKW_ABSOLUTEX_124(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	return cyclesTaken;
};
instructions[124] = SKW_ABSOLUTEX_124;
function ADC_ABSOLUTEX_125(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions[125] = ADC_ABSOLUTEX_125;
function ROR_ABSOLUTEX_126(cpu, memory) {
	var cyclesTaken = 7;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = (operationModeData & 0xFF) >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry(operationModeData & 0x1);
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[126] = ROR_ABSOLUTEX_126;
function RRA_ABSOLUTEX_127(cpu, memory) {
	var cyclesTaken = 7;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry((operationModeData & 0x1) > 0);
	var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	result &= 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[127] = RRA_ABSOLUTEX_127;
function SKB_IMMEDIATE_128(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	return cyclesTaken;
};
instructions[128] = SKB_IMMEDIATE_128;
function STA_INDIRECTX_129(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regA;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions[129] = STA_INDIRECTX_129;
function SKB_IMMEDIATE_130(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	return cyclesTaken;
};
instructions[130] = SKB_IMMEDIATE_130;
function AXS_INDIRECTX_131(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regA & cpu.regX;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions[131] = AXS_INDIRECTX_131;
function STY_ZEROPAGE_132(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regY;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions[132] = STY_ZEROPAGE_132;
function STA_ZEROPAGE_133(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regA;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions[133] = STA_ZEROPAGE_133;
function STX_ZEROPAGE_134(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regX;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions[134] = STX_ZEROPAGE_134;
function AXS_ZEROPAGE_135(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regA & cpu.regX;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions[135] = AXS_ZEROPAGE_135;
function DEY_NONE_136(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regY--;
	if (cpu.regY < 0) cpu.regY = 0xFF;
	cpu.setSign((cpu.regY & 0x80) > 0);
	cpu.setZero((cpu.regY & 0xFF) === 0);
	return cyclesTaken;
};
instructions[136] = DEY_NONE_136;
function SKB_IMMEDIATE_137(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	return cyclesTaken;
};
instructions[137] = SKB_IMMEDIATE_137;
function TXA_NONE_138(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regA = cpu.regX;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[138] = TXA_NONE_138;
function XAA_IMMEDIATE_139(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regA = cpu.regX & readInValue;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[139] = XAA_IMMEDIATE_139;
function STY_ABSOLUTE_140(cpu, memory) {
	var cyclesTaken = 4;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	var result = cpu.regY;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions[140] = STY_ABSOLUTE_140;
function STA_ABSOLUTE_141(cpu, memory) {
	var cyclesTaken = 4;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	var result = cpu.regA;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions[141] = STA_ABSOLUTE_141;
function STX_ABSOLUTE_142(cpu, memory) {
	var cyclesTaken = 4;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	var result = cpu.regX;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions[142] = STX_ABSOLUTE_142;
function AXS_ABSOLUTE_143(cpu, memory) {
	var cyclesTaken = 4;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	var result = cpu.regA & cpu.regX;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions[143] = AXS_ABSOLUTE_143;
function BCC_RELATIVE_144(cpu, memory) {
	var cyclesTaken = 2;
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
	var branchTaken = !cpu.getCarry();
	if (branchTaken) {
		cpu.incrementSubcycle();
		if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
			cyclesTaken += 1;
			cpu.incrementSubcycle();
		}
		cyclesTaken += 1;
		cpu.incrementSubcycle();
		cpu.setPC(readInValue + 2 & 0xFFFF);
	} else {
		cpu.incrementSubcycle();
		memory.read8(cpu.getPC() + 1 & 0xFFFF);
		cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	}
	return cyclesTaken;
};
instructions[144] = BCC_RELATIVE_144;
function STA_INDIRECTY_145(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regA;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions[145] = STA_INDIRECTY_145;
function HLT_NONE_146(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("HLT_NONE_146 illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions[146] = HLT_NONE_146;
function AXA_INDIRECTY_147(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regX & cpu.regA & 0x7;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions[147] = AXA_INDIRECTY_147;
function STY_ZEROPAGEX_148(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regY;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions[148] = STY_ZEROPAGEX_148;
function STA_ZEROPAGEX_149(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regA;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions[149] = STA_ZEROPAGEX_149;
function STX_ZEROPAGEY_150(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regX;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions[150] = STX_ZEROPAGEY_150;
function AXS_ZEROPAGEY_151(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regA & cpu.regX;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions[151] = AXS_ZEROPAGEY_151;
function TYA_NONE_152(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regA = cpu.regY;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[152] = TYA_NONE_152;
function STA_ABSOLUTEY_153(cpu, memory) {
	var cyclesTaken = 5;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	var result = cpu.regA;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions[153] = STA_ABSOLUTEY_153;
function TXS_NONE_154(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regS = cpu.regX;
	return cyclesTaken;
};
instructions[154] = TXS_NONE_154;
function TAS_ABSOLUTEY_155(cpu, memory) {
	var cyclesTaken = 5;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.regS = cpu.regX & cpu.regA;
	return cyclesTaken;
};
instructions[155] = TAS_ABSOLUTEY_155;
function SAY_SAY_156(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.SAYHighByte = memory.read8(cpu.getPC() + 2 & 0xFFFF);
	address |= cpu.SAYHighByte << 8;
	var readInValue = address + cpu.regX & 0xFFFF; // SAY writes to absolute X but needs the high byte of the address to operate on
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = cpu.regY & (cpu.SAYHighByte + 1 & 0xFF);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[156] = SAY_SAY_156;
function STA_ABSOLUTEX_157(cpu, memory) {
	var cyclesTaken = 5;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	var result = cpu.regA;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions[157] = STA_ABSOLUTEX_157;
function XAS_ABSOLUTEY_158(cpu, memory) {
	var cyclesTaken = 5;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	var result = 0;
	console.log("illegal instruction XAS not implemented");
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions[158] = XAS_ABSOLUTEY_158;
function AXA_ABSOLUTEY_159(cpu, memory) {
	var cyclesTaken = 5;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = cpu.regX & cpu.regA & 0x7;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[159] = AXA_ABSOLUTEY_159;
function LDY_IMMEDIATE_160(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regY = readInValue & 0xFF;
	cpu.setSign((cpu.regY & 0x80) > 0);
	cpu.setZero((cpu.regY & 0xFF) === 0);
	return cyclesTaken;
};
instructions[160] = LDY_IMMEDIATE_160;
function LDA_INDIRECTX_161(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[161] = LDA_INDIRECTX_161;
function LDX_IMMEDIATE_162(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regX = readInValue & 0xFF;
	cpu.setSign((cpu.regX & 0x80) > 0);
	cpu.setZero((cpu.regX & 0xFF) === 0);
	return cyclesTaken;
};
instructions[162] = LDX_IMMEDIATE_162;
function LAX_INDIRECTX_163(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = operationModeData;
	cpu.regX = operationModeData;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[163] = LAX_INDIRECTX_163;
function LDY_ZEROPAGE_164(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regY = operationModeData & 0xFF;
	cpu.setSign((cpu.regY & 0x80) > 0);
	cpu.setZero((cpu.regY & 0xFF) === 0);
	return cyclesTaken;
};
instructions[164] = LDY_ZEROPAGE_164;
function LDA_ZEROPAGE_165(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[165] = LDA_ZEROPAGE_165;
function LDX_ZEROPAGE_166(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regX = operationModeData & 0xFF;
	cpu.setSign((cpu.regX & 0x80) > 0);
	cpu.setZero((cpu.regX & 0xFF) === 0);
	return cyclesTaken;
};
instructions[166] = LDX_ZEROPAGE_166;
function LAX_ZEROPAGE_167(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = operationModeData;
	cpu.regX = operationModeData;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[167] = LAX_ZEROPAGE_167;
function TAY_NONE_168(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regY = cpu.regA;
	cpu.setSign((cpu.regY & 0x80) > 0);
	cpu.setZero((cpu.regY & 0xFF) === 0);
	return cyclesTaken;
};
instructions[168] = TAY_NONE_168;
function LDA_IMMEDIATE_169(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regA = readInValue & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[169] = LDA_IMMEDIATE_169;
function TAX_NONE_170(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regX = cpu.regA;
	cpu.setSign((cpu.regX & 0x80) > 0);
	cpu.setZero((cpu.regX & 0xFF) === 0);
	return cyclesTaken;
};
instructions[170] = TAX_NONE_170;
function OAL_IMMEDIATE_171(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regX = cpu.regA = readInValue & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[171] = OAL_IMMEDIATE_171;
function LDY_ABSOLUTE_172(cpu, memory) {
	var cyclesTaken = 4;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regY = operationModeData & 0xFF;
	cpu.setSign((cpu.regY & 0x80) > 0);
	cpu.setZero((cpu.regY & 0xFF) === 0);
	return cyclesTaken;
};
instructions[172] = LDY_ABSOLUTE_172;
function LDA_ABSOLUTE_173(cpu, memory) {
	var cyclesTaken = 4;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[173] = LDA_ABSOLUTE_173;
function LDX_ABSOLUTE_174(cpu, memory) {
	var cyclesTaken = 4;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regX = operationModeData & 0xFF;
	cpu.setSign((cpu.regX & 0x80) > 0);
	cpu.setZero((cpu.regX & 0xFF) === 0);
	return cyclesTaken;
};
instructions[174] = LDX_ABSOLUTE_174;
function LAX_ABSOLUTE_175(cpu, memory) {
	var cyclesTaken = 4;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = operationModeData;
	cpu.regX = operationModeData;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[175] = LAX_ABSOLUTE_175;
function BCS_RELATIVE_176(cpu, memory) {
	var cyclesTaken = 2;
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
	var branchTaken = cpu.getCarry();
	if (branchTaken) {
		cpu.incrementSubcycle();
		if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
			cyclesTaken += 1;
			cpu.incrementSubcycle();
		}
		cyclesTaken += 1;
		cpu.incrementSubcycle();
		cpu.setPC(readInValue + 2 & 0xFFFF);
	} else {
		cpu.incrementSubcycle();
		memory.read8(cpu.getPC() + 1 & 0xFFFF);
		cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	}
	return cyclesTaken;
};
instructions[176] = BCS_RELATIVE_176;
function LDA_INDIRECTY_177(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[177] = LDA_INDIRECTY_177;
function HLT_NONE_178(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("HLT_NONE_178 illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions[178] = HLT_NONE_178;
function LAX_INDIRECTY_179(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = operationModeData;
	cpu.regX = operationModeData;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[179] = LAX_INDIRECTY_179;
function LDY_ZEROPAGEX_180(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regY = operationModeData & 0xFF;
	cpu.setSign((cpu.regY & 0x80) > 0);
	cpu.setZero((cpu.regY & 0xFF) === 0);
	return cyclesTaken;
};
instructions[180] = LDY_ZEROPAGEX_180;
function LDA_ZEROPAGEX_181(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[181] = LDA_ZEROPAGEX_181;
function LDX_ZEROPAGEY_182(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regX = operationModeData & 0xFF;
	cpu.setSign((cpu.regX & 0x80) > 0);
	cpu.setZero((cpu.regX & 0xFF) === 0);
	return cyclesTaken;
};
instructions[182] = LDX_ZEROPAGEY_182;
function LAX_ZEROPAGEY_183(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = operationModeData;
	cpu.regX = operationModeData;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[183] = LAX_ZEROPAGEY_183;
function CLV_NONE_184(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.setOverflow(false);
	return cyclesTaken;
};
instructions[184] = CLV_NONE_184;
function LDA_ABSOLUTEY_185(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[185] = LDA_ABSOLUTEY_185;
function TSX_NONE_186(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regX = cpu.regS & 0xFF;
	cpu.setSign((cpu.regX & 0x80) > 0);
	cpu.setZero((cpu.regX & 0xFF) === 0);
	return cyclesTaken;
};
instructions[186] = TSX_NONE_186;
function LAS_ABSOLUTEY_187(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var result = 0;
	console.log("illegal instruction LAS not implemented");
	return cyclesTaken;
};
instructions[187] = LAS_ABSOLUTEY_187;
function LDY_ABSOLUTEX_188(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regY = operationModeData & 0xFF;
	cpu.setSign((cpu.regY & 0x80) > 0);
	cpu.setZero((cpu.regY & 0xFF) === 0);
	return cyclesTaken;
};
instructions[188] = LDY_ABSOLUTEX_188;
function LDA_ABSOLUTEX_189(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[189] = LDA_ABSOLUTEX_189;
function LDX_ABSOLUTEY_190(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regX = operationModeData & 0xFF;
	cpu.setSign((cpu.regX & 0x80) > 0);
	cpu.setZero((cpu.regX & 0xFF) === 0);
	return cyclesTaken;
};
instructions[190] = LDX_ABSOLUTEY_190;
function LAX_ABSOLUTEY_191(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.regA = operationModeData;
	cpu.regX = operationModeData;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions[191] = LAX_ABSOLUTEY_191;
function CPY_IMMEDIATE_192(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var temp = cpu.regY - readInValue; // purposely not wrapped
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions[192] = CPY_IMMEDIATE_192;
function CMP_INDIRECTX_193(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = cpu.regA - operationModeData;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions[193] = CMP_INDIRECTX_193;
function SKB_IMMEDIATE_194(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	return cyclesTaken;
};
instructions[194] = SKB_IMMEDIATE_194;
function DCM_INDIRECTX_195(cpu, memory) {
	var cyclesTaken = 8;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	var temp = cpu.regA - result;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[195] = DCM_INDIRECTX_195;
function CPY_ZEROPAGE_196(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = cpu.regY - operationModeData; // purposely not wrapped
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions[196] = CPY_ZEROPAGE_196;
function CMP_ZEROPAGE_197(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = cpu.regA - operationModeData;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions[197] = CMP_ZEROPAGE_197;
function DEC_ZEROPAGE_198(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[198] = DEC_ZEROPAGE_198;
function DCM_ZEROPAGE_199(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	var temp = cpu.regA - result;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[199] = DCM_ZEROPAGE_199;
function INY_NONE_200(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regY++;
	if (cpu.regY > 0xFF) cpu.regY = 0;
	cpu.setSign((cpu.regY & 0x80) > 0);
	cpu.setZero((cpu.regY & 0xFF) === 0);
	return cyclesTaken;
};
instructions[200] = INY_NONE_200;
function CMP_IMMEDIATE_201(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var temp = cpu.regA - readInValue;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions[201] = CMP_IMMEDIATE_201;
function DEX_NONE_202(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regX--;
	if (cpu.regX < 0) cpu.regX = 0xFF;
	cpu.setSign((cpu.regX & 0x80) > 0);
	cpu.setZero((cpu.regX & 0xFF) === 0);
	return cyclesTaken;
};
instructions[202] = DEX_NONE_202;
function SAX_IMMEDIATE_203(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var temp = (cpu.regA & cpu.regX) - readInValue;
	cpu.regX = temp & 0xFF;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions[203] = SAX_IMMEDIATE_203;
function CPY_ABSOLUTE_204(cpu, memory) {
	var cyclesTaken = 4;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = cpu.regY - operationModeData; // purposely not wrapped
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions[204] = CPY_ABSOLUTE_204;
function CMP_ABSOLUTE_205(cpu, memory) {
	var cyclesTaken = 4;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = cpu.regA - operationModeData;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions[205] = CMP_ABSOLUTE_205;
function DEC_ABSOLUTE_206(cpu, memory) {
	var cyclesTaken = 6;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[206] = DEC_ABSOLUTE_206;
function DCM_ABSOLUTE_207(cpu, memory) {
	var cyclesTaken = 6;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	var temp = cpu.regA - result;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[207] = DCM_ABSOLUTE_207;
function BNE_RELATIVE_208(cpu, memory) {
	var cyclesTaken = 2;
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
	var branchTaken = !cpu.getZero();
	if (branchTaken) {
		cpu.incrementSubcycle();
		if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
			cyclesTaken += 1;
			cpu.incrementSubcycle();
		}
		cyclesTaken += 1;
		cpu.incrementSubcycle();
		cpu.setPC(readInValue + 2 & 0xFFFF);
	} else {
		cpu.incrementSubcycle();
		memory.read8(cpu.getPC() + 1 & 0xFFFF);
		cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	}
	return cyclesTaken;
};
instructions[208] = BNE_RELATIVE_208;
function CMP_INDIRECTY_209(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = cpu.regA - operationModeData;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions[209] = CMP_INDIRECTY_209;
function HLT_NONE_210(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("HLT_NONE_210 illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions[210] = HLT_NONE_210;
function DCM_INDIRECTY_211(cpu, memory) {
	var cyclesTaken = 8;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	var temp = cpu.regA - result;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[211] = DCM_INDIRECTY_211;
function SKB_ZEROPAGEX_212(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	return cyclesTaken;
};
instructions[212] = SKB_ZEROPAGEX_212;
function CMP_ZEROPAGEX_213(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = cpu.regA - operationModeData;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions[213] = CMP_ZEROPAGEX_213;
function DEC_ZEROPAGEX_214(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[214] = DEC_ZEROPAGEX_214;
function DCM_ZEROPAGEX_215(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	var temp = cpu.regA - result;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[215] = DCM_ZEROPAGEX_215;
function CLD_NONE_216(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.setDecimal(false);
	return cyclesTaken;
};
instructions[216] = CLD_NONE_216;
function CMP_ABSOLUTEY_217(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = cpu.regA - operationModeData;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions[217] = CMP_ABSOLUTEY_217;
function NOP_NONE_218(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	return cyclesTaken;
};
instructions[218] = NOP_NONE_218;
function DCM_ABSOLUTEY_219(cpu, memory) {
	var cyclesTaken = 7;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	var temp = cpu.regA - result;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[219] = DCM_ABSOLUTEY_219;
function SKW_ABSOLUTEX_220(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	return cyclesTaken;
};
instructions[220] = SKW_ABSOLUTEX_220;
function CMP_ABSOLUTEX_221(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = cpu.regA - operationModeData;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions[221] = CMP_ABSOLUTEX_221;
function DEC_ABSOLUTEX_222(cpu, memory) {
	var cyclesTaken = 7;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[222] = DEC_ABSOLUTEX_222;
function DCM_ABSOLUTEX_223(cpu, memory) {
	var cyclesTaken = 7;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	var temp = cpu.regA - result;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[223] = DCM_ABSOLUTEX_223;
function CPX_IMMEDIATE_224(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var temp = cpu.regX - readInValue; // purposely not wrapped
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions[224] = CPX_IMMEDIATE_224;
function SBC_INDIRECTX_225(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions[225] = SBC_INDIRECTX_225;
function SKB_IMMEDIATE_226(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	return cyclesTaken;
};
instructions[226] = SKB_IMMEDIATE_226;
function INS_INDIRECTX_227(cpu, memory) {
	var cyclesTaken = 8;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[227] = INS_INDIRECTX_227;
function CPX_ZEROPAGE_228(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = cpu.regX - operationModeData; // purposely not wrapped
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions[228] = CPX_ZEROPAGE_228;
function SBC_ZEROPAGE_229(cpu, memory) {
	var cyclesTaken = 3;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions[229] = SBC_ZEROPAGE_229;
function INC_ZEROPAGE_230(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[230] = INC_ZEROPAGE_230;
function INS_ZEROPAGE_231(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[231] = INS_ZEROPAGE_231;
function INX_NONE_232(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regX++;
	if (cpu.regX > 0xFF) cpu.regX = 0;
	cpu.setSign((cpu.regX & 0x80) > 0);
	cpu.setZero((cpu.regX & 0xFF) === 0);
	return cyclesTaken;
};
instructions[232] = INX_NONE_232;
function SBC_IMMEDIATE_233(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var temp = cpu.regA - readInValue - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ readInValue) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions[233] = SBC_IMMEDIATE_233;
function NOP_NONE_234(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	return cyclesTaken;
};
instructions[234] = NOP_NONE_234;
function SBC_IMMEDIATE_235(cpu, memory) {
	var cyclesTaken = 2;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var temp = cpu.regA - readInValue - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ readInValue) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions[235] = SBC_IMMEDIATE_235;
function CPX_ABSOLUTE_236(cpu, memory) {
	var cyclesTaken = 4;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = cpu.regX - operationModeData; // purposely not wrapped
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions[236] = CPX_ABSOLUTE_236;
function SBC_ABSOLUTE_237(cpu, memory) {
	var cyclesTaken = 4;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions[237] = SBC_ABSOLUTE_237;
function INC_ABSOLUTE_238(cpu, memory) {
	var cyclesTaken = 6;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[238] = INC_ABSOLUTE_238;
function INS_ABSOLUTE_239(cpu, memory) {
	var cyclesTaken = 6;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[239] = INS_ABSOLUTE_239;
function BEQ_RELATIVE_240(cpu, memory) {
	var cyclesTaken = 2;
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
	var branchTaken = cpu.getZero();
	if (branchTaken) {
		cpu.incrementSubcycle();
		if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
			cyclesTaken += 1;
			cpu.incrementSubcycle();
		}
		cyclesTaken += 1;
		cpu.incrementSubcycle();
		cpu.setPC(readInValue + 2 & 0xFFFF);
	} else {
		cpu.incrementSubcycle();
		memory.read8(cpu.getPC() + 1 & 0xFFFF);
		cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	}
	return cyclesTaken;
};
instructions[240] = BEQ_RELATIVE_240;
function SBC_INDIRECTY_241(cpu, memory) {
	var cyclesTaken = 5;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions[241] = SBC_INDIRECTY_241;
function HLT_NONE_242(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("HLT_NONE_242 illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions[242] = HLT_NONE_242;
function INS_INDIRECTY_243(cpu, memory) {
	var cyclesTaken = 8;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[243] = INS_INDIRECTY_243;
function SKB_ZEROPAGEX_244(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	return cyclesTaken;
};
instructions[244] = SKB_ZEROPAGEX_244;
function SBC_ZEROPAGEX_245(cpu, memory) {
	var cyclesTaken = 4;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions[245] = SBC_ZEROPAGEX_245;
function INC_ZEROPAGEX_246(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[246] = INC_ZEROPAGEX_246;
function INS_ZEROPAGEX_247(cpu, memory) {
	var cyclesTaken = 6;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[247] = INS_ZEROPAGEX_247;
function SED_NONE_248(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.setDecimal(true);
	return cyclesTaken;
};
instructions[248] = SED_NONE_248;
function SBC_ABSOLUTEY_249(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions[249] = SBC_ABSOLUTEY_249;
function NOP_NONE_250(cpu, memory) {
	var cyclesTaken = 2;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	return cyclesTaken;
};
instructions[250] = NOP_NONE_250;
function INS_ABSOLUTEY_251(cpu, memory) {
	var cyclesTaken = 7;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[251] = INS_ABSOLUTEY_251;
function SKW_ABSOLUTEX_252(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	return cyclesTaken;
};
instructions[252] = SKW_ABSOLUTEX_252;
function SBC_ABSOLUTEX_253(cpu, memory) {
	var cyclesTaken = 4;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions[253] = SBC_ABSOLUTEX_253;
function INC_ABSOLUTEX_254(cpu, memory) {
	var cyclesTaken = 7;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[254] = INC_ABSOLUTEX_254;
function INS_ABSOLUTEX_255(cpu, memory) {
	var cyclesTaken = 7;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions[255] = INS_ABSOLUTEX_255;

exports.default = instructions;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
var instructions_TRACE = [];
var formatData = { programCounter: 0, opcode: 0, opcodeParam: 0, operationParam: 0, regs: {} };

function BRK_NONE_0_TRACE(cpu, memory) {
	var cyclesTaken = 7;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 0;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	// dummy read of opcode after brk
	memory.read8(cpu.getPC());
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	memory.write8(0x100 + cpu.regS, cpu.getPC() >> 8 & 0xFF);
	if (cpu.regS === 0) {
		cpu.regS = 0xFF;
	} else {
		cpu.regS--;
	}
	cpu.incrementSubcycle();
	memory.write8(0x100 + cpu.regS, cpu.programCounter & 0xFF);
	if (cpu.regS === 0) {
		cpu.regS = 0xFF;
	} else {
		cpu.regS--;
	}
	cpu.incrementSubcycle();
	memory.write8(0x100 + cpu.regS, (cpu.statusRegToByte() | 0x30) & 0xFF);
	if (cpu.regS === 0) {
		cpu.regS = 0xFF;
	} else {
		cpu.regS--;
	}
	cpu.setPC(cpu.read16FromMemNoWrap(CPU_IRQ_ADDRESS));
	cpu.setInterrupt(true);
	return cyclesTaken;
};
instructions_TRACE[0] = BRK_NONE_0_TRACE;
function ORA_INDIRECTX_1_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 1;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA |= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[1] = ORA_INDIRECTX_1_TRACE;
function HLT_NONE_2_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 2;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions_TRACE[2] = HLT_NONE_2_TRACE;
function ASO_INDIRECTX_3_TRACE(cpu, memory) {
	var cyclesTaken = 8;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 3;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = operationModeData << 1 & 0xFF;
	cpu.regA |= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[3] = ASO_INDIRECTX_3_TRACE;
function SKB_ZEROPAGE_4_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 4;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	return cyclesTaken;
};
instructions_TRACE[4] = SKB_ZEROPAGE_4_TRACE;
function ORA_ZEROPAGE_5_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 5;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA |= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[5] = ORA_ZEROPAGE_5_TRACE;
function ASL_ZEROPAGE_6_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 6;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = (operationModeData & 0xFF) << 1 & 0xFF;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[6] = ASL_ZEROPAGE_6_TRACE;
function ASO_ZEROPAGE_7_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 7;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = operationModeData << 1 & 0xFF;
	cpu.regA |= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[7] = ASO_ZEROPAGE_7_TRACE;
function PHP_NONE_8_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 8;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	memory.write8(0x100 + cpu.regS, (cpu.statusRegToByte() | 0x10) & 0xFF);
	if (cpu.regS === 0) {
		cpu.regS = 0xFF;
	} else {
		cpu.regS--;
	}
	return cyclesTaken;
};
instructions_TRACE[8] = PHP_NONE_8_TRACE;
function ORA_IMMEDIATE_9_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 9;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regA |= readInValue & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[9] = ORA_IMMEDIATE_9_TRACE;
function ASL_ACCUMULATOR_10_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 10;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.regA;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.setCarry((readInValue & 0x80) > 0);
	var result = (readInValue & 0xFF) << 1 & 0xFF;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.regA = result & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[10] = ASL_ACCUMULATOR_10_TRACE;
function ANC_IMMEDIATE_11_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 11;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regA &= readInValue;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.setCarry(cpu.getSign());
	return cyclesTaken;
};
instructions_TRACE[11] = ANC_IMMEDIATE_11_TRACE;
function SKW_ABSOLUTE_12_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 12;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	return cyclesTaken;
};
instructions_TRACE[12] = SKW_ABSOLUTE_12_TRACE;
function ORA_ABSOLUTE_13_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 13;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA |= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[13] = ORA_ABSOLUTE_13_TRACE;
function ASL_ABSOLUTE_14_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 14;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = (operationModeData & 0xFF) << 1 & 0xFF;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[14] = ASL_ABSOLUTE_14_TRACE;
function ASO_ABSOLUTE_15_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 15;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = operationModeData << 1 & 0xFF;
	cpu.regA |= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[15] = ASO_ABSOLUTE_15_TRACE;
function BPL_RELATIVE_16_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 16;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
	formatData.opcodeParam = address;
	formatData.operationParam = readInValue + 2 & 0xFFFF;
	var branchTaken = !cpu.getSign();
	if (branchTaken) {
		cpu.incrementSubcycle();
		if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
			cyclesTaken += 1;
			cpu.incrementSubcycle();
		}
		cyclesTaken += 1;
		cpu.incrementSubcycle();
		cpu.setPC(readInValue + 2 & 0xFFFF);
	} else {
		cpu.incrementSubcycle();
		memory.read8(cpu.getPC() + 1 & 0xFFFF);
		cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	}
	return cyclesTaken;
};
instructions_TRACE[16] = BPL_RELATIVE_16_TRACE;
function ORA_INDIRECTY_17_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 17;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA |= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[17] = ORA_INDIRECTY_17_TRACE;
function HLT_NONE_18_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 18;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions_TRACE[18] = HLT_NONE_18_TRACE;
function ASO_INDIRECTY_19_TRACE(cpu, memory) {
	var cyclesTaken = 8;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 19;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = operationModeData << 1 & 0xFF;
	cpu.regA |= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[19] = ASO_INDIRECTY_19_TRACE;
function SKB_ZEROPAGEX_20_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 20;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	return cyclesTaken;
};
instructions_TRACE[20] = SKB_ZEROPAGEX_20_TRACE;
function ORA_ZEROPAGEX_21_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 21;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA |= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[21] = ORA_ZEROPAGEX_21_TRACE;
function ASL_ZEROPAGEX_22_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 22;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = (operationModeData & 0xFF) << 1 & 0xFF;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[22] = ASL_ZEROPAGEX_22_TRACE;
function ASO_ZEROPAGEX_23_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 23;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = operationModeData << 1 & 0xFF;
	cpu.regA |= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[23] = ASO_ZEROPAGEX_23_TRACE;
function CLC_NONE_24_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 24;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.setCarry(false);
	return cyclesTaken;
};
instructions_TRACE[24] = CLC_NONE_24_TRACE;
function ORA_ABSOLUTEY_25_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 25;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA |= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[25] = ORA_ABSOLUTEY_25_TRACE;
function NOP_NONE_26_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 26;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	return cyclesTaken;
};
instructions_TRACE[26] = NOP_NONE_26_TRACE;
function ASO_ABSOLUTEY_27_TRACE(cpu, memory) {
	var cyclesTaken = 7;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 27;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = operationModeData << 1 & 0xFF;
	cpu.regA |= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[27] = ASO_ABSOLUTEY_27_TRACE;
function SKW_ABSOLUTEX_28_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 28;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	return cyclesTaken;
};
instructions_TRACE[28] = SKW_ABSOLUTEX_28_TRACE;
function ORA_ABSOLUTEX_29_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 29;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA |= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[29] = ORA_ABSOLUTEX_29_TRACE;
function ASL_ABSOLUTEX_30_TRACE(cpu, memory) {
	var cyclesTaken = 7;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 30;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = (operationModeData & 0xFF) << 1 & 0xFF;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[30] = ASL_ABSOLUTEX_30_TRACE;
function ASO_ABSOLUTEX_31_TRACE(cpu, memory) {
	var cyclesTaken = 7;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 31;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x80) > 0);
	var result = operationModeData << 1 & 0xFF;
	cpu.regA |= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[31] = ASO_ABSOLUTEX_31_TRACE;
function JSR_IMMEDIATE16_32_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 32;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	var result = cpu.getPC() - 1;
	if (result < 0) result = 0xFFFF;
	cpu.incrementSubcycle();
	memory.write8(0x100 + cpu.regS, result >> 8 & 0xFF);
	if (cpu.regS === 0) {
		cpu.regS = 0xFF;
	} else {
		cpu.regS--;
	}
	cpu.incrementSubcycle();
	memory.write8(0x100 + cpu.regS, result & 0xFF);
	if (cpu.regS === 0) {
		cpu.regS = 0xFF;
	} else {
		cpu.regS--;
	}
	cpu.incrementSubcycle();
	cpu.setPC(readInValue & 0xFFFF);
	return cyclesTaken;
};
instructions_TRACE[32] = JSR_IMMEDIATE16_32_TRACE;
function AND_INDIRECTX_33_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 33;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA &= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[33] = AND_INDIRECTX_33_TRACE;
function HLT_NONE_34_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 34;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions_TRACE[34] = HLT_NONE_34_TRACE;
function RLA_INDIRECTX_35_TRACE(cpu, memory) {
	var cyclesTaken = 8;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 35;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.regA &= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[35] = RLA_INDIRECTX_35_TRACE;
function BIT_ZEROPAGE_36_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 36;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	if ((readInValue & 0xE007) === 0x2002) {
		cpu.mainboard.ppu.bitOperationHappening();
	} // BIT 2002 optimisation
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.setSign((operationModeData & 0xFF & 0x80) > 0);
	cpu.setZero((cpu.regA & (operationModeData & 0xFF) & 0xFF) === 0);
	cpu.setOverflow((operationModeData & 0x40) > 0); // Copy bit 6 to OVERFLOW flag.
	return cyclesTaken;
};
instructions_TRACE[36] = BIT_ZEROPAGE_36_TRACE;
function AND_ZEROPAGE_37_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 37;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA &= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[37] = AND_ZEROPAGE_37_TRACE;
function ROL_ZEROPAGE_38_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 38;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = (operationModeData & 0xFF) << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[38] = ROL_ZEROPAGE_38_TRACE;
function RLA_ZEROPAGE_39_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 39;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.regA &= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[39] = RLA_ZEROPAGE_39_TRACE;
function PLP_NONE_40_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 40;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.waitOneInstructionAfterCli = cpu.getInterrupt() === true;
	cpu.incrementSubcycle();
	memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	if (cpu.regS === 0xFF) {
		cpu.regS = 0;
	} else {
		cpu.regS++;
	}
	cpu.incrementSubcycle();
	var temp = memory.read8(0x100 + cpu.regS);
	cpu.statusRegFromByte(temp);
	cpu.setBreak(true); // TODO: this was true before in original port, put it back for some reason?
	cpu.setUnused(true);
	if (cpu.waitOneInstructionAfterCli) cpu.waitOneInstructionAfterCli = cpu.getInterrupt() === false;
	return cyclesTaken;
};
instructions_TRACE[40] = PLP_NONE_40_TRACE;
function AND_IMMEDIATE_41_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 41;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regA &= readInValue & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[41] = AND_IMMEDIATE_41_TRACE;
function ROL_ACCUMULATOR_42_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 42;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.regA;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	var result = (readInValue & 0xFF) << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.regA = result & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[42] = ROL_ACCUMULATOR_42_TRACE;
function ANC_IMMEDIATE_43_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 43;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regA &= readInValue;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.setCarry(cpu.getSign());
	return cyclesTaken;
};
instructions_TRACE[43] = ANC_IMMEDIATE_43_TRACE;
function BIT_ABSOLUTE_44_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 44;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	if ((readInValue & 0xE007) === 0x2002) {
		cpu.mainboard.ppu.bitOperationHappening();
	} // BIT 2002 optimisation
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.setSign((operationModeData & 0xFF & 0x80) > 0);
	cpu.setZero((cpu.regA & (operationModeData & 0xFF) & 0xFF) === 0);
	cpu.setOverflow((operationModeData & 0x40) > 0); // Copy bit 6 to OVERFLOW flag.
	return cyclesTaken;
};
instructions_TRACE[44] = BIT_ABSOLUTE_44_TRACE;
function AND_ABSOLUTE_45_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 45;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA &= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[45] = AND_ABSOLUTE_45_TRACE;
function ROL_ABSOLUTE_46_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 46;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = (operationModeData & 0xFF) << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[46] = ROL_ABSOLUTE_46_TRACE;
function RLA_ABSOLUTE_47_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 47;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.regA &= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[47] = RLA_ABSOLUTE_47_TRACE;
function BMI_RELATIVE_48_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 48;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
	formatData.opcodeParam = address;
	formatData.operationParam = readInValue + 2 & 0xFFFF;
	var branchTaken = cpu.getSign();
	if (branchTaken) {
		cpu.incrementSubcycle();
		if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
			cyclesTaken += 1;
			cpu.incrementSubcycle();
		}
		cyclesTaken += 1;
		cpu.incrementSubcycle();
		cpu.setPC(readInValue + 2 & 0xFFFF);
	} else {
		cpu.incrementSubcycle();
		memory.read8(cpu.getPC() + 1 & 0xFFFF);
		cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	}
	return cyclesTaken;
};
instructions_TRACE[48] = BMI_RELATIVE_48_TRACE;
function AND_INDIRECTY_49_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 49;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA &= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[49] = AND_INDIRECTY_49_TRACE;
function HLT_NONE_50_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 50;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions_TRACE[50] = HLT_NONE_50_TRACE;
function RLA_INDIRECTY_51_TRACE(cpu, memory) {
	var cyclesTaken = 8;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 51;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.regA &= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[51] = RLA_INDIRECTY_51_TRACE;
function SKB_ZEROPAGEX_52_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 52;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	return cyclesTaken;
};
instructions_TRACE[52] = SKB_ZEROPAGEX_52_TRACE;
function AND_ZEROPAGEX_53_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 53;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA &= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[53] = AND_ZEROPAGEX_53_TRACE;
function ROL_ZEROPAGEX_54_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 54;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = (operationModeData & 0xFF) << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[54] = ROL_ZEROPAGEX_54_TRACE;
function RLA_ZEROPAGEX_55_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 55;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.regA &= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[55] = RLA_ZEROPAGEX_55_TRACE;
function SEC_NONE_56_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 56;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.setCarry(true);
	return cyclesTaken;
};
instructions_TRACE[56] = SEC_NONE_56_TRACE;
function AND_ABSOLUTEY_57_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 57;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA &= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[57] = AND_ABSOLUTEY_57_TRACE;
function NOP_NONE_58_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 58;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	return cyclesTaken;
};
instructions_TRACE[58] = NOP_NONE_58_TRACE;
function RLA_ABSOLUTEY_59_TRACE(cpu, memory) {
	var cyclesTaken = 7;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 59;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.regA &= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[59] = RLA_ABSOLUTEY_59_TRACE;
function SKW_ABSOLUTEX_60_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 60;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	return cyclesTaken;
};
instructions_TRACE[60] = SKW_ABSOLUTEX_60_TRACE;
function AND_ABSOLUTEX_61_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 61;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA &= operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[61] = AND_ABSOLUTEX_61_TRACE;
function ROL_ABSOLUTEX_62_TRACE(cpu, memory) {
	var cyclesTaken = 7;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 62;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = (operationModeData & 0xFF) << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[62] = ROL_ABSOLUTEX_62_TRACE;
function RLA_ABSOLUTEX_63_TRACE(cpu, memory) {
	var cyclesTaken = 7;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 63;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData << 1 | (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(result > 0xFF);
	result &= 0xff;
	cpu.regA &= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[63] = RLA_ABSOLUTEX_63_TRACE;
function RTI_NONE_64_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 64;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	// dummy read
	cpu.incrementSubcycle();
	memory.read8(cpu.getPC());
	cpu.incrementSubcycle();
	if (cpu.regS === 0xFF) {
		cpu.regS = 0;
	} else {
		cpu.regS++;
	}
	cpu.incrementSubcycle();
	var temp = memory.read8(0x100 + cpu.regS);
	cpu.statusRegFromByte(temp);
	if (cpu.regS === 0xFF) {
		cpu.regS = 0;
	} else {
		cpu.regS++;
	}
	cpu.incrementSubcycle();
	cpu.programCounter = memory.read8(0x100 + cpu.regS);
	if (cpu.regS === 0xFF) {
		cpu.regS = 0;
	} else {
		cpu.regS++;
	}
	cpu.incrementSubcycle();
	temp = memory.read8(0x100 + cpu.regS);
	cpu.programCounter |= (temp & 0xFF) << 8;
	cpu.setBreak(true);
	cpu.setUnused(true);
	return cyclesTaken;
};
instructions_TRACE[64] = RTI_NONE_64_TRACE;
function EOR_INDIRECTX_65_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 65;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[65] = EOR_INDIRECTX_65_TRACE;
function HLT_NONE_66_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 66;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions_TRACE[66] = HLT_NONE_66_TRACE;
function LSE_INDIRECTX_67_TRACE(cpu, memory) {
	var cyclesTaken = 8;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 67;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = operationModeData >> 1 & 0xFF;
	cpu.regA ^= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[67] = LSE_INDIRECTX_67_TRACE;
function SKB_ZEROPAGE_68_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 68;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	return cyclesTaken;
};
instructions_TRACE[68] = SKB_ZEROPAGE_68_TRACE;
function EOR_ZEROPAGE_69_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 69;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[69] = EOR_ZEROPAGE_69_TRACE;
function LSR_ZEROPAGE_70_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 70;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = (operationModeData & 0xFF) >> 1;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[70] = LSR_ZEROPAGE_70_TRACE;
function LSE_ZEROPAGE_71_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 71;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = operationModeData >> 1 & 0xFF;
	cpu.regA ^= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[71] = LSE_ZEROPAGE_71_TRACE;
function PHA_NONE_72_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 72;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	memory.write8(0x100 + cpu.regS, cpu.regA & 0xFF);
	if (cpu.regS === 0) {
		cpu.regS = 0xFF;
	} else {
		cpu.regS--;
	}
	return cyclesTaken;
};
instructions_TRACE[72] = PHA_NONE_72_TRACE;
function EOR_IMMEDIATE_73_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 73;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regA = (cpu.regA ^ readInValue & 0xFF) & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[73] = EOR_IMMEDIATE_73_TRACE;
function LSR_ACCUMULATOR_74_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 74;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.regA;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.setCarry((readInValue & 0x01) > 0);
	var result = (readInValue & 0xFF) >> 1;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.regA = result & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[74] = LSR_ACCUMULATOR_74_TRACE;
function ALR_IMMEDIATE_75_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 75;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regA &= readInValue;
	cpu.setCarry((cpu.regA & 0x01) > 0);
	cpu.regA = cpu.regA >> 1 & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[75] = ALR_IMMEDIATE_75_TRACE;
function JMP_IMMEDIATE16_76_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 76;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.setPC(readInValue & 0xFFFF);
	return cyclesTaken;
};
instructions_TRACE[76] = JMP_IMMEDIATE16_76_TRACE;
function EOR_ABSOLUTE_77_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 77;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[77] = EOR_ABSOLUTE_77_TRACE;
function LSR_ABSOLUTE_78_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 78;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = (operationModeData & 0xFF) >> 1;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[78] = LSR_ABSOLUTE_78_TRACE;
function LSE_ABSOLUTE_79_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 79;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = operationModeData >> 1 & 0xFF;
	cpu.regA ^= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[79] = LSE_ABSOLUTE_79_TRACE;
function BVC_RELATIVE_80_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 80;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
	formatData.opcodeParam = address;
	formatData.operationParam = readInValue + 2 & 0xFFFF;
	var branchTaken = !cpu.getOverflow();
	if (branchTaken) {
		cpu.incrementSubcycle();
		if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
			cyclesTaken += 1;
			cpu.incrementSubcycle();
		}
		cyclesTaken += 1;
		cpu.incrementSubcycle();
		cpu.setPC(readInValue + 2 & 0xFFFF);
	} else {
		cpu.incrementSubcycle();
		memory.read8(cpu.getPC() + 1 & 0xFFFF);
		cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	}
	return cyclesTaken;
};
instructions_TRACE[80] = BVC_RELATIVE_80_TRACE;
function EOR_INDIRECTY_81_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 81;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[81] = EOR_INDIRECTY_81_TRACE;
function HLT_NONE_82_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 82;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions_TRACE[82] = HLT_NONE_82_TRACE;
function LSE_INDIRECTY_83_TRACE(cpu, memory) {
	var cyclesTaken = 8;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 83;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = operationModeData >> 1 & 0xFF;
	cpu.regA ^= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[83] = LSE_INDIRECTY_83_TRACE;
function SKB_ZEROPAGEX_84_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 84;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	return cyclesTaken;
};
instructions_TRACE[84] = SKB_ZEROPAGEX_84_TRACE;
function EOR_ZEROPAGEX_85_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 85;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[85] = EOR_ZEROPAGEX_85_TRACE;
function LSR_ZEROPAGEX_86_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 86;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = (operationModeData & 0xFF) >> 1;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[86] = LSR_ZEROPAGEX_86_TRACE;
function LSE_ZEROPAGEX_87_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 87;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = operationModeData >> 1 & 0xFF;
	cpu.regA ^= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[87] = LSE_ZEROPAGEX_87_TRACE;
function CLI_NONE_88_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 88;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.waitOneInstructionAfterCli = cpu.getInterrupt() === true;
	cpu.setInterrupt(false);
	return cyclesTaken;
};
instructions_TRACE[88] = CLI_NONE_88_TRACE;
function EOR_ABSOLUTEY_89_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 89;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[89] = EOR_ABSOLUTEY_89_TRACE;
function NOP_NONE_90_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 90;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	return cyclesTaken;
};
instructions_TRACE[90] = NOP_NONE_90_TRACE;
function LSE_ABSOLUTEY_91_TRACE(cpu, memory) {
	var cyclesTaken = 7;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 91;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = operationModeData >> 1 & 0xFF;
	cpu.regA ^= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[91] = LSE_ABSOLUTEY_91_TRACE;
function SKW_ABSOLUTEX_92_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 92;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	return cyclesTaken;
};
instructions_TRACE[92] = SKW_ABSOLUTEX_92_TRACE;
function EOR_ABSOLUTEX_93_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 93;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = (cpu.regA ^ operationModeData & 0xFF) & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[93] = EOR_ABSOLUTEX_93_TRACE;
function LSR_ABSOLUTEX_94_TRACE(cpu, memory) {
	var cyclesTaken = 7;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 94;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = (operationModeData & 0xFF) >> 1;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[94] = LSR_ABSOLUTEX_94_TRACE;
function LSE_ABSOLUTEX_95_TRACE(cpu, memory) {
	var cyclesTaken = 7;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 95;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	cpu.setCarry((operationModeData & 0x01) > 0);
	var result = operationModeData >> 1 & 0xFF;
	cpu.regA ^= result;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[95] = LSE_ABSOLUTEX_95_TRACE;
function RTS_NONE_96_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 96;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	// dummy read
	cpu.incrementSubcycle();
	memory.read8(cpu.getPC());
	cpu.incrementSubcycle();
	if (cpu.regS === 0xFF) {
		cpu.regS = 0;
	} else {
		cpu.regS++;
	}
	cpu.incrementSubcycle();
	cpu.programCounter = memory.read8(0x100 + cpu.regS);
	if (cpu.regS === 0xFF) {
		cpu.regS = 0;
	} else {
		cpu.regS++;
	}
	cpu.incrementSubcycle();
	var temp = memory.read8(0x100 + cpu.regS);
	cpu.programCounter |= (temp & 0xFF) << 8;
	cpu.incrementSubcycle();
	cpu.programCounter = cpu.getPC() + 1 & 0xFFFF;
	return cyclesTaken;
};
instructions_TRACE[96] = RTS_NONE_96_TRACE;
function ADC_INDIRECTX_97_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 97;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[97] = ADC_INDIRECTX_97_TRACE;
function HLT_NONE_98_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 98;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions_TRACE[98] = HLT_NONE_98_TRACE;
function RRA_INDIRECTX_99_TRACE(cpu, memory) {
	var cyclesTaken = 8;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 99;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry((operationModeData & 0x1) > 0);
	var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	result &= 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[99] = RRA_INDIRECTX_99_TRACE;
function SKB_ZEROPAGE_100_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 100;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	return cyclesTaken;
};
instructions_TRACE[100] = SKB_ZEROPAGE_100_TRACE;
function ADC_ZEROPAGE_101_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 101;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[101] = ADC_ZEROPAGE_101_TRACE;
function ROR_ZEROPAGE_102_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 102;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = (operationModeData & 0xFF) >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry(operationModeData & 0x1);
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[102] = ROR_ZEROPAGE_102_TRACE;
function RRA_ZEROPAGE_103_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 103;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry((operationModeData & 0x1) > 0);
	var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	result &= 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[103] = RRA_ZEROPAGE_103_TRACE;
function PLA_NONE_104_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 104;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	memory.read8(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	if (cpu.regS === 0xFF) {
		cpu.regS = 0;
	} else {
		cpu.regS++;
	}
	cpu.incrementSubcycle();
	cpu.regA = memory.read8(0x100 + cpu.regS);
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[104] = PLA_NONE_104_TRACE;
function ADC_IMMEDIATE_105_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 105;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var temp = (readInValue & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (readInValue ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[105] = ADC_IMMEDIATE_105_TRACE;
function ROR_ACCUMULATOR_106_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 106;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.regA;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	var result = (readInValue & 0xFF) >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry(readInValue & 0x1);
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.regA = result & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[106] = ROR_ACCUMULATOR_106_TRACE;
function ARR_IMMEDIATE_107_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 107;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regA &= readInValue & 0xFF;
	cpu.regA = cpu.regA >> 1 & 0xFF | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry((cpu.regA & 0x1) > 0);
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	cpu.setOverflow(false);
	cpu.setCarry(false);
	switch (cpu.regA & 0x60) {
		case 0x20:
			cpu.setOverflow(true);break;
		case 0x40:
			cpu.setOverflow(true);
			cpu.setCarry(true);break;
		case 0x60:
			cpu.setCarry(true);break;
	}
	return cyclesTaken;
};
instructions_TRACE[107] = ARR_IMMEDIATE_107_TRACE;
function JMP_INDIRECT_108_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 108;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.setPC(readInValue & 0xFFFF);
	return cyclesTaken;
};
instructions_TRACE[108] = JMP_INDIRECT_108_TRACE;
function ADC_ABSOLUTE_109_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 109;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[109] = ADC_ABSOLUTE_109_TRACE;
function ROR_ABSOLUTE_110_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 110;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = (operationModeData & 0xFF) >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry(operationModeData & 0x1);
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[110] = ROR_ABSOLUTE_110_TRACE;
function RRA_ABSOLUTE_111_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 111;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry((operationModeData & 0x1) > 0);
	var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	result &= 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[111] = RRA_ABSOLUTE_111_TRACE;
function BVS_RELATIVE_112_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 112;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
	formatData.opcodeParam = address;
	formatData.operationParam = readInValue + 2 & 0xFFFF;
	var branchTaken = cpu.getOverflow();
	if (branchTaken) {
		cpu.incrementSubcycle();
		if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
			cyclesTaken += 1;
			cpu.incrementSubcycle();
		}
		cyclesTaken += 1;
		cpu.incrementSubcycle();
		cpu.setPC(readInValue + 2 & 0xFFFF);
	} else {
		cpu.incrementSubcycle();
		memory.read8(cpu.getPC() + 1 & 0xFFFF);
		cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	}
	return cyclesTaken;
};
instructions_TRACE[112] = BVS_RELATIVE_112_TRACE;
function ADC_INDIRECTY_113_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 113;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[113] = ADC_INDIRECTY_113_TRACE;
function HLT_NONE_114_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 114;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions_TRACE[114] = HLT_NONE_114_TRACE;
function RRA_INDIRECTY_115_TRACE(cpu, memory) {
	var cyclesTaken = 8;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 115;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry((operationModeData & 0x1) > 0);
	var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	result &= 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[115] = RRA_INDIRECTY_115_TRACE;
function SKB_ZEROPAGEX_116_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 116;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	return cyclesTaken;
};
instructions_TRACE[116] = SKB_ZEROPAGEX_116_TRACE;
function ADC_ZEROPAGEX_117_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 117;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[117] = ADC_ZEROPAGEX_117_TRACE;
function ROR_ZEROPAGEX_118_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 118;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = (operationModeData & 0xFF) >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry(operationModeData & 0x1);
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[118] = ROR_ZEROPAGEX_118_TRACE;
function RRA_ZEROPAGEX_119_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 119;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry((operationModeData & 0x1) > 0);
	var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	result &= 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[119] = RRA_ZEROPAGEX_119_TRACE;
function SEI_NONE_120_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 120;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.setInterrupt(true);
	return cyclesTaken;
};
instructions_TRACE[120] = SEI_NONE_120_TRACE;
function ADC_ABSOLUTEY_121_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 121;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[121] = ADC_ABSOLUTEY_121_TRACE;
function NOP_NONE_122_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 122;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	return cyclesTaken;
};
instructions_TRACE[122] = NOP_NONE_122_TRACE;
function RRA_ABSOLUTEY_123_TRACE(cpu, memory) {
	var cyclesTaken = 7;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 123;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry((operationModeData & 0x1) > 0);
	var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	result &= 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[123] = RRA_ABSOLUTEY_123_TRACE;
function SKW_ABSOLUTEX_124_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 124;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	return cyclesTaken;
};
instructions_TRACE[124] = SKW_ABSOLUTEX_124_TRACE;
function ADC_ABSOLUTEX_125_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 125;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = (operationModeData & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (operationModeData ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[125] = ADC_ABSOLUTEX_125_TRACE;
function ROR_ABSOLUTEX_126_TRACE(cpu, memory) {
	var cyclesTaken = 7;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 126;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = (operationModeData & 0xFF) >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry(operationModeData & 0x1);
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[126] = ROR_ABSOLUTEX_126_TRACE;
function RRA_ABSOLUTEX_127_TRACE(cpu, memory) {
	var cyclesTaken = 7;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 127;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData >> 1 | (cpu.getCarry() ? 0x80 : 0);
	cpu.setCarry((operationModeData & 0x1) > 0);
	var temp = (result & 0xFF) + cpu.regA + (cpu.getCarry() ? 1 : 0);
	cpu.setCarry(temp > 0xFF);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ (result ^ 0xFF)) & 0x80);
	cpu.regA = temp & 0xFF;
	result &= 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[127] = RRA_ABSOLUTEX_127_TRACE;
function SKB_IMMEDIATE_128_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 128;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	return cyclesTaken;
};
instructions_TRACE[128] = SKB_IMMEDIATE_128_TRACE;
function STA_INDIRECTX_129_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 129;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regA;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions_TRACE[129] = STA_INDIRECTX_129_TRACE;
function SKB_IMMEDIATE_130_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 130;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	return cyclesTaken;
};
instructions_TRACE[130] = SKB_IMMEDIATE_130_TRACE;
function AXS_INDIRECTX_131_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 131;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regA & cpu.regX;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions_TRACE[131] = AXS_INDIRECTX_131_TRACE;
function STY_ZEROPAGE_132_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 132;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regY;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions_TRACE[132] = STY_ZEROPAGE_132_TRACE;
function STA_ZEROPAGE_133_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 133;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regA;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions_TRACE[133] = STA_ZEROPAGE_133_TRACE;
function STX_ZEROPAGE_134_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 134;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regX;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions_TRACE[134] = STX_ZEROPAGE_134_TRACE;
function AXS_ZEROPAGE_135_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 135;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regA & cpu.regX;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions_TRACE[135] = AXS_ZEROPAGE_135_TRACE;
function DEY_NONE_136_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 136;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regY--;
	if (cpu.regY < 0) cpu.regY = 0xFF;
	cpu.setSign((cpu.regY & 0x80) > 0);
	cpu.setZero((cpu.regY & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[136] = DEY_NONE_136_TRACE;
function SKB_IMMEDIATE_137_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 137;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	return cyclesTaken;
};
instructions_TRACE[137] = SKB_IMMEDIATE_137_TRACE;
function TXA_NONE_138_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 138;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regA = cpu.regX;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[138] = TXA_NONE_138_TRACE;
function XAA_IMMEDIATE_139_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 139;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regA = cpu.regX & readInValue;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[139] = XAA_IMMEDIATE_139_TRACE;
function STY_ABSOLUTE_140_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 140;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	var result = cpu.regY;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions_TRACE[140] = STY_ABSOLUTE_140_TRACE;
function STA_ABSOLUTE_141_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 141;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	var result = cpu.regA;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions_TRACE[141] = STA_ABSOLUTE_141_TRACE;
function STX_ABSOLUTE_142_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 142;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	var result = cpu.regX;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions_TRACE[142] = STX_ABSOLUTE_142_TRACE;
function AXS_ABSOLUTE_143_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 143;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	var result = cpu.regA & cpu.regX;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions_TRACE[143] = AXS_ABSOLUTE_143_TRACE;
function BCC_RELATIVE_144_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 144;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
	formatData.opcodeParam = address;
	formatData.operationParam = readInValue + 2 & 0xFFFF;
	var branchTaken = !cpu.getCarry();
	if (branchTaken) {
		cpu.incrementSubcycle();
		if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
			cyclesTaken += 1;
			cpu.incrementSubcycle();
		}
		cyclesTaken += 1;
		cpu.incrementSubcycle();
		cpu.setPC(readInValue + 2 & 0xFFFF);
	} else {
		cpu.incrementSubcycle();
		memory.read8(cpu.getPC() + 1 & 0xFFFF);
		cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	}
	return cyclesTaken;
};
instructions_TRACE[144] = BCC_RELATIVE_144_TRACE;
function STA_INDIRECTY_145_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 145;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regA;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions_TRACE[145] = STA_INDIRECTY_145_TRACE;
function HLT_NONE_146_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 146;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions_TRACE[146] = HLT_NONE_146_TRACE;
function AXA_INDIRECTY_147_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 147;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regX & cpu.regA & 0x7;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions_TRACE[147] = AXA_INDIRECTY_147_TRACE;
function STY_ZEROPAGEX_148_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 148;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regY;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions_TRACE[148] = STY_ZEROPAGEX_148_TRACE;
function STA_ZEROPAGEX_149_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 149;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regA;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions_TRACE[149] = STA_ZEROPAGEX_149_TRACE;
function STX_ZEROPAGEY_150_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 150;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regX;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions_TRACE[150] = STX_ZEROPAGEY_150_TRACE;
function AXS_ZEROPAGEY_151_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 151;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var result = cpu.regA & cpu.regX;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions_TRACE[151] = AXS_ZEROPAGEY_151_TRACE;
function TYA_NONE_152_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 152;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regA = cpu.regY;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[152] = TYA_NONE_152_TRACE;
function STA_ABSOLUTEY_153_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 153;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	var result = cpu.regA;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions_TRACE[153] = STA_ABSOLUTEY_153_TRACE;
function TXS_NONE_154_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 154;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regS = cpu.regX;
	return cyclesTaken;
};
instructions_TRACE[154] = TXS_NONE_154_TRACE;
function TAS_ABSOLUTEY_155_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 155;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.regS = cpu.regX & cpu.regA;
	return cyclesTaken;
};
instructions_TRACE[155] = TAS_ABSOLUTEY_155_TRACE;
function SAY_SAY_156_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 156;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	cpu.SAYHighByte = memory.read8(cpu.getPC() + 2 & 0xFFFF);
	address |= cpu.SAYHighByte << 8;
	var readInValue = address + cpu.regX & 0xFFFF; // SAY writes to absolute X but needs the high byte of the address to operate on
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = cpu.regY & (cpu.SAYHighByte + 1 & 0xFF);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[156] = SAY_SAY_156_TRACE;
function STA_ABSOLUTEX_157_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 157;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	var result = cpu.regA;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions_TRACE[157] = STA_ABSOLUTEX_157_TRACE;
function XAS_ABSOLUTEY_158_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 158;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	var result = 0;
	console.log("illegal instruction XAS not implemented");
	cpu.incrementSubcycle();
	memory.write8(readInValue, result);
	return cyclesTaken;
};
instructions_TRACE[158] = XAS_ABSOLUTEY_158_TRACE;
function AXA_ABSOLUTEY_159_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 159;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = cpu.regX & cpu.regA & 0x7;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[159] = AXA_ABSOLUTEY_159_TRACE;
function LDY_IMMEDIATE_160_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 160;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regY = readInValue & 0xFF;
	cpu.setSign((cpu.regY & 0x80) > 0);
	cpu.setZero((cpu.regY & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[160] = LDY_IMMEDIATE_160_TRACE;
function LDA_INDIRECTX_161_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 161;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[161] = LDA_INDIRECTX_161_TRACE;
function LDX_IMMEDIATE_162_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 162;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regX = readInValue & 0xFF;
	cpu.setSign((cpu.regX & 0x80) > 0);
	cpu.setZero((cpu.regX & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[162] = LDX_IMMEDIATE_162_TRACE;
function LAX_INDIRECTX_163_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 163;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = operationModeData;
	cpu.regX = operationModeData;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[163] = LAX_INDIRECTX_163_TRACE;
function LDY_ZEROPAGE_164_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 164;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regY = operationModeData & 0xFF;
	cpu.setSign((cpu.regY & 0x80) > 0);
	cpu.setZero((cpu.regY & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[164] = LDY_ZEROPAGE_164_TRACE;
function LDA_ZEROPAGE_165_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 165;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[165] = LDA_ZEROPAGE_165_TRACE;
function LDX_ZEROPAGE_166_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 166;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regX = operationModeData & 0xFF;
	cpu.setSign((cpu.regX & 0x80) > 0);
	cpu.setZero((cpu.regX & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[166] = LDX_ZEROPAGE_166_TRACE;
function LAX_ZEROPAGE_167_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 167;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = operationModeData;
	cpu.regX = operationModeData;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[167] = LAX_ZEROPAGE_167_TRACE;
function TAY_NONE_168_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 168;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regY = cpu.regA;
	cpu.setSign((cpu.regY & 0x80) > 0);
	cpu.setZero((cpu.regY & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[168] = TAY_NONE_168_TRACE;
function LDA_IMMEDIATE_169_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 169;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regA = readInValue & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[169] = LDA_IMMEDIATE_169_TRACE;
function TAX_NONE_170_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 170;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regX = cpu.regA;
	cpu.setSign((cpu.regX & 0x80) > 0);
	cpu.setZero((cpu.regX & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[170] = TAX_NONE_170_TRACE;
function OAL_IMMEDIATE_171_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 171;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.regX = cpu.regA = readInValue & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[171] = OAL_IMMEDIATE_171_TRACE;
function LDY_ABSOLUTE_172_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 172;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regY = operationModeData & 0xFF;
	cpu.setSign((cpu.regY & 0x80) > 0);
	cpu.setZero((cpu.regY & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[172] = LDY_ABSOLUTE_172_TRACE;
function LDA_ABSOLUTE_173_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 173;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[173] = LDA_ABSOLUTE_173_TRACE;
function LDX_ABSOLUTE_174_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 174;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regX = operationModeData & 0xFF;
	cpu.setSign((cpu.regX & 0x80) > 0);
	cpu.setZero((cpu.regX & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[174] = LDX_ABSOLUTE_174_TRACE;
function LAX_ABSOLUTE_175_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 175;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = operationModeData;
	cpu.regX = operationModeData;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[175] = LAX_ABSOLUTE_175_TRACE;
function BCS_RELATIVE_176_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 176;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
	formatData.opcodeParam = address;
	formatData.operationParam = readInValue + 2 & 0xFFFF;
	var branchTaken = cpu.getCarry();
	if (branchTaken) {
		cpu.incrementSubcycle();
		if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
			cyclesTaken += 1;
			cpu.incrementSubcycle();
		}
		cyclesTaken += 1;
		cpu.incrementSubcycle();
		cpu.setPC(readInValue + 2 & 0xFFFF);
	} else {
		cpu.incrementSubcycle();
		memory.read8(cpu.getPC() + 1 & 0xFFFF);
		cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	}
	return cyclesTaken;
};
instructions_TRACE[176] = BCS_RELATIVE_176_TRACE;
function LDA_INDIRECTY_177_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 177;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[177] = LDA_INDIRECTY_177_TRACE;
function HLT_NONE_178_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 178;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions_TRACE[178] = HLT_NONE_178_TRACE;
function LAX_INDIRECTY_179_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 179;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = operationModeData;
	cpu.regX = operationModeData;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[179] = LAX_INDIRECTY_179_TRACE;
function LDY_ZEROPAGEX_180_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 180;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regY = operationModeData & 0xFF;
	cpu.setSign((cpu.regY & 0x80) > 0);
	cpu.setZero((cpu.regY & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[180] = LDY_ZEROPAGEX_180_TRACE;
function LDA_ZEROPAGEX_181_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 181;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[181] = LDA_ZEROPAGEX_181_TRACE;
function LDX_ZEROPAGEY_182_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 182;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regX = operationModeData & 0xFF;
	cpu.setSign((cpu.regX & 0x80) > 0);
	cpu.setZero((cpu.regX & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[182] = LDX_ZEROPAGEY_182_TRACE;
function LAX_ZEROPAGEY_183_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 183;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = operationModeData;
	cpu.regX = operationModeData;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[183] = LAX_ZEROPAGEY_183_TRACE;
function CLV_NONE_184_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 184;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.setOverflow(false);
	return cyclesTaken;
};
instructions_TRACE[184] = CLV_NONE_184_TRACE;
function LDA_ABSOLUTEY_185_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 185;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[185] = LDA_ABSOLUTEY_185_TRACE;
function TSX_NONE_186_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 186;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regX = cpu.regS & 0xFF;
	cpu.setSign((cpu.regX & 0x80) > 0);
	cpu.setZero((cpu.regX & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[186] = TSX_NONE_186_TRACE;
function LAS_ABSOLUTEY_187_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 187;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var result = 0;
	console.log("illegal instruction LAS not implemented");
	return cyclesTaken;
};
instructions_TRACE[187] = LAS_ABSOLUTEY_187_TRACE;
function LDY_ABSOLUTEX_188_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 188;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regY = operationModeData & 0xFF;
	cpu.setSign((cpu.regY & 0x80) > 0);
	cpu.setZero((cpu.regY & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[188] = LDY_ABSOLUTEX_188_TRACE;
function LDA_ABSOLUTEX_189_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 189;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = operationModeData & 0xFF;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[189] = LDA_ABSOLUTEX_189_TRACE;
function LDX_ABSOLUTEY_190_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 190;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regX = operationModeData & 0xFF;
	cpu.setSign((cpu.regX & 0x80) > 0);
	cpu.setZero((cpu.regX & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[190] = LDX_ABSOLUTEY_190_TRACE;
function LAX_ABSOLUTEY_191_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 191;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.regA = operationModeData;
	cpu.regX = operationModeData;
	cpu.setSign((cpu.regA & 0x80) > 0);
	cpu.setZero((cpu.regA & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[191] = LAX_ABSOLUTEY_191_TRACE;
function CPY_IMMEDIATE_192_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 192;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var temp = cpu.regY - readInValue; // purposely not wrapped
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[192] = CPY_IMMEDIATE_192_TRACE;
function CMP_INDIRECTX_193_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 193;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = cpu.regA - operationModeData;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[193] = CMP_INDIRECTX_193_TRACE;
function SKB_IMMEDIATE_194_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 194;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	return cyclesTaken;
};
instructions_TRACE[194] = SKB_IMMEDIATE_194_TRACE;
function DCM_INDIRECTX_195_TRACE(cpu, memory) {
	var cyclesTaken = 8;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 195;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	var temp = cpu.regA - result;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[195] = DCM_INDIRECTX_195_TRACE;
function CPY_ZEROPAGE_196_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 196;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = cpu.regY - operationModeData; // purposely not wrapped
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[196] = CPY_ZEROPAGE_196_TRACE;
function CMP_ZEROPAGE_197_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 197;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = cpu.regA - operationModeData;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[197] = CMP_ZEROPAGE_197_TRACE;
function DEC_ZEROPAGE_198_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 198;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[198] = DEC_ZEROPAGE_198_TRACE;
function DCM_ZEROPAGE_199_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 199;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	var temp = cpu.regA - result;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[199] = DCM_ZEROPAGE_199_TRACE;
function INY_NONE_200_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 200;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regY++;
	if (cpu.regY > 0xFF) cpu.regY = 0;
	cpu.setSign((cpu.regY & 0x80) > 0);
	cpu.setZero((cpu.regY & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[200] = INY_NONE_200_TRACE;
function CMP_IMMEDIATE_201_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 201;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var temp = cpu.regA - readInValue;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[201] = CMP_IMMEDIATE_201_TRACE;
function DEX_NONE_202_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 202;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regX--;
	if (cpu.regX < 0) cpu.regX = 0xFF;
	cpu.setSign((cpu.regX & 0x80) > 0);
	cpu.setZero((cpu.regX & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[202] = DEX_NONE_202_TRACE;
function SAX_IMMEDIATE_203_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 203;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var temp = (cpu.regA & cpu.regX) - readInValue;
	cpu.regX = temp & 0xFF;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[203] = SAX_IMMEDIATE_203_TRACE;
function CPY_ABSOLUTE_204_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 204;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = cpu.regY - operationModeData; // purposely not wrapped
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[204] = CPY_ABSOLUTE_204_TRACE;
function CMP_ABSOLUTE_205_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 205;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = cpu.regA - operationModeData;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[205] = CMP_ABSOLUTE_205_TRACE;
function DEC_ABSOLUTE_206_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 206;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[206] = DEC_ABSOLUTE_206_TRACE;
function DCM_ABSOLUTE_207_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 207;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	var temp = cpu.regA - result;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[207] = DCM_ABSOLUTE_207_TRACE;
function BNE_RELATIVE_208_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 208;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
	formatData.opcodeParam = address;
	formatData.operationParam = readInValue + 2 & 0xFFFF;
	var branchTaken = !cpu.getZero();
	if (branchTaken) {
		cpu.incrementSubcycle();
		if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
			cyclesTaken += 1;
			cpu.incrementSubcycle();
		}
		cyclesTaken += 1;
		cpu.incrementSubcycle();
		cpu.setPC(readInValue + 2 & 0xFFFF);
	} else {
		cpu.incrementSubcycle();
		memory.read8(cpu.getPC() + 1 & 0xFFFF);
		cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	}
	return cyclesTaken;
};
instructions_TRACE[208] = BNE_RELATIVE_208_TRACE;
function CMP_INDIRECTY_209_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 209;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = cpu.regA - operationModeData;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[209] = CMP_INDIRECTY_209_TRACE;
function HLT_NONE_210_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 210;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions_TRACE[210] = HLT_NONE_210_TRACE;
function DCM_INDIRECTY_211_TRACE(cpu, memory) {
	var cyclesTaken = 8;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 211;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	var temp = cpu.regA - result;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[211] = DCM_INDIRECTY_211_TRACE;
function SKB_ZEROPAGEX_212_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 212;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	return cyclesTaken;
};
instructions_TRACE[212] = SKB_ZEROPAGEX_212_TRACE;
function CMP_ZEROPAGEX_213_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 213;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = cpu.regA - operationModeData;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[213] = CMP_ZEROPAGEX_213_TRACE;
function DEC_ZEROPAGEX_214_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 214;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[214] = DEC_ZEROPAGEX_214_TRACE;
function DCM_ZEROPAGEX_215_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 215;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	var temp = cpu.regA - result;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[215] = DCM_ZEROPAGEX_215_TRACE;
function CLD_NONE_216_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 216;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.setDecimal(false);
	return cyclesTaken;
};
instructions_TRACE[216] = CLD_NONE_216_TRACE;
function CMP_ABSOLUTEY_217_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 217;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = cpu.regA - operationModeData;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[217] = CMP_ABSOLUTEY_217_TRACE;
function NOP_NONE_218_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 218;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	return cyclesTaken;
};
instructions_TRACE[218] = NOP_NONE_218_TRACE;
function DCM_ABSOLUTEY_219_TRACE(cpu, memory) {
	var cyclesTaken = 7;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 219;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	var temp = cpu.regA - result;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[219] = DCM_ABSOLUTEY_219_TRACE;
function SKW_ABSOLUTEX_220_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 220;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	return cyclesTaken;
};
instructions_TRACE[220] = SKW_ABSOLUTEX_220_TRACE;
function CMP_ABSOLUTEX_221_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 221;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = cpu.regA - operationModeData;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[221] = CMP_ABSOLUTEX_221_TRACE;
function DEC_ABSOLUTEX_222_TRACE(cpu, memory) {
	var cyclesTaken = 7;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 222;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[222] = DEC_ABSOLUTEX_222_TRACE;
function DCM_ABSOLUTEX_223_TRACE(cpu, memory) {
	var cyclesTaken = 7;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 223;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData - 1;
	if (result < 0) result = 0xFF;
	var temp = cpu.regA - result;
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[223] = DCM_ABSOLUTEX_223_TRACE;
function CPX_IMMEDIATE_224_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 224;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var temp = cpu.regX - readInValue; // purposely not wrapped
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[224] = CPX_IMMEDIATE_224_TRACE;
function SBC_INDIRECTX_225_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 225;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[225] = SBC_INDIRECTX_225_TRACE;
function SKB_IMMEDIATE_226_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 226;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	return cyclesTaken;
};
instructions_TRACE[226] = SKB_IMMEDIATE_226_TRACE;
function INS_INDIRECTX_227_TRACE(cpu, memory) {
	var cyclesTaken = 8;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 227;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	cpu.incrementSubcycle();
	address = address + cpu.regX & 0xFF;
	var readInValue = cpu.read16FromMemWithWrap(address);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[227] = INS_INDIRECTX_227_TRACE;
function CPX_ZEROPAGE_228_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 228;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = cpu.regX - operationModeData; // purposely not wrapped
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[228] = CPX_ZEROPAGE_228_TRACE;
function SBC_ZEROPAGE_229_TRACE(cpu, memory) {
	var cyclesTaken = 3;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 229;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[229] = SBC_ZEROPAGE_229_TRACE;
function INC_ZEROPAGE_230_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 230;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[230] = INC_ZEROPAGE_230_TRACE;
function INS_ZEROPAGE_231_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 231;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[231] = INS_ZEROPAGE_231_TRACE;
function INX_NONE_232_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 232;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.regX++;
	if (cpu.regX > 0xFF) cpu.regX = 0;
	cpu.setSign((cpu.regX & 0x80) > 0);
	cpu.setZero((cpu.regX & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[232] = INX_NONE_232_TRACE;
function SBC_IMMEDIATE_233_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 233;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var temp = cpu.regA - readInValue - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ readInValue) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[233] = SBC_IMMEDIATE_233_TRACE;
function NOP_NONE_234_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 234;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	return cyclesTaken;
};
instructions_TRACE[234] = NOP_NONE_234_TRACE;
function SBC_IMMEDIATE_235_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 235;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var readInValue = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	var temp = cpu.regA - readInValue - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ readInValue) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[235] = SBC_IMMEDIATE_235_TRACE;
function CPX_ABSOLUTE_236_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 236;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = cpu.regX - operationModeData; // purposely not wrapped
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	return cyclesTaken;
};
instructions_TRACE[236] = CPX_ABSOLUTE_236_TRACE;
function SBC_ABSOLUTE_237_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 237;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[237] = SBC_ABSOLUTE_237_TRACE;
function INC_ABSOLUTE_238_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 238;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[238] = INC_ABSOLUTE_238_TRACE;
function INS_ABSOLUTE_239_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 239;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var readInValue = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = readInValue;
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[239] = INS_ABSOLUTE_239_TRACE;
function BEQ_RELATIVE_240_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 240;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	var readInValue = cpu.calculateRelativeDifference(cpu.getPC() | 0, address | 0);
	formatData.opcodeParam = address;
	formatData.operationParam = readInValue + 2 & 0xFFFF;
	var branchTaken = cpu.getZero();
	if (branchTaken) {
		cpu.incrementSubcycle();
		if ((cpu.getPC() + 2 & 0xff00) !== (readInValue + 2 & 0xff00)) {
			cyclesTaken += 1;
			cpu.incrementSubcycle();
		}
		cyclesTaken += 1;
		cpu.incrementSubcycle();
		cpu.setPC(readInValue + 2 & 0xFFFF);
	} else {
		cpu.incrementSubcycle();
		memory.read8(cpu.getPC() + 1 & 0xFFFF);
		cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	}
	return cyclesTaken;
};
instructions_TRACE[240] = BEQ_RELATIVE_240_TRACE;
function SBC_INDIRECTY_241_TRACE(cpu, memory) {
	var cyclesTaken = 5;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 241;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[241] = SBC_INDIRECTY_241_TRACE;
function HLT_NONE_242_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 242;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	var result = 0;
	console.log("illegal instruction HLT not implemented");
	return cyclesTaken;
};
instructions_TRACE[242] = HLT_NONE_242_TRACE;
function INS_INDIRECTY_243_TRACE(cpu, memory) {
	var cyclesTaken = 8;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 243;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	address = cpu.read16FromMemWithWrap(address);
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[243] = INS_INDIRECTY_243_TRACE;
function SKB_ZEROPAGEX_244_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 244;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	return cyclesTaken;
};
instructions_TRACE[244] = SKB_ZEROPAGEX_244_TRACE;
function SBC_ZEROPAGEX_245_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 245;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[245] = SBC_ZEROPAGEX_245_TRACE;
function INC_ZEROPAGEX_246_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 246;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[246] = INC_ZEROPAGEX_246_TRACE;
function INS_ZEROPAGEX_247_TRACE(cpu, memory) {
	var cyclesTaken = 6;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 247;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.incrementSubcycle();
	var address = memory.read8(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 2 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[247] = INS_ZEROPAGEX_247_TRACE;
function SED_NONE_248_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 248;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	cpu.setDecimal(true);
	return cyclesTaken;
};
instructions_TRACE[248] = SED_NONE_248_TRACE;
function SBC_ABSOLUTEY_249_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 249;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	if ((address + cpu.regY & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[249] = SBC_ABSOLUTEY_249_TRACE;
function NOP_NONE_250_TRACE(cpu, memory) {
	var cyclesTaken = 2;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 250;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	cpu.setPC(cpu.getPC() + 1 & 0xFFFF);
	cpu.incrementSubcycle();
	return cyclesTaken;
};
instructions_TRACE[250] = NOP_NONE_250_TRACE;
function INS_ABSOLUTEY_251_TRACE(cpu, memory) {
	var cyclesTaken = 7;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 251;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regY & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regY & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[251] = INS_ABSOLUTEY_251_TRACE;
function SKW_ABSOLUTEX_252_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 252;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	return cyclesTaken;
};
instructions_TRACE[252] = SKW_ABSOLUTEX_252_TRACE;
function SBC_ABSOLUTEX_253_TRACE(cpu, memory) {
	var cyclesTaken = 4;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 253;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	if ((address + cpu.regX & 0xFF00) !== (address & 0xFF00)) {
		// Only do dummy read if page boundary crossed
		cyclesTaken++;
		cpu.incrementSubcycle();
		memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	}
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	var temp = cpu.regA - operationModeData - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ operationModeData) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	return cyclesTaken;
};
instructions_TRACE[253] = SBC_ABSOLUTEX_253_TRACE;
function INC_ABSOLUTEX_254_TRACE(cpu, memory) {
	var cyclesTaken = 7;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 254;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[254] = INC_ABSOLUTEX_254_TRACE;
function INS_ABSOLUTEX_255_TRACE(cpu, memory) {
	var cyclesTaken = 7;
	formatData.programCounter = cpu.getPC();
	formatData.opcode = 255;
	formatData.regs.a = cpu.regA;
	formatData.regs.x = cpu.regX;
	formatData.regs.y = cpu.regY;
	formatData.regs.p = cpu.statusRegToByte();
	formatData.regs.sp = cpu.regS;
	var address = cpu.read16FromMemNoWrap(cpu.getPC() + 1 & 0xFFFF);
	formatData.opcodeParam = address;
	var readInValue = address + cpu.regX & 0xFFFF;
	cpu.incrementSubcycle();
	memory.read8(address & 0xFF00 | address + cpu.regX & 0xFF);
	cpu.setPC(cpu.getPC() + 3 & 0xFFFF);
	cpu.incrementSubcycle();
	var operationModeData = memory.read8(readInValue);
	formatData.operationParam = operationModeData;
	cpu.incrementSubcycle();
	memory.write8(readInValue, operationModeData);
	var result = operationModeData + 1;
	if (result > 0xFF) result = 0;
	cpu.setSign((result & 0x80) > 0);
	cpu.setZero((result & 0xFF) === 0);
	var temp = cpu.regA - result - (cpu.getCarry() ? 0 : 1);
	cpu.setSign((temp & 0x80) > 0);
	cpu.setZero((temp & 0xFF) === 0);
	cpu.setOverflow((cpu.regA ^ temp) & 0x80 && (cpu.regA ^ result) & 0x80);
	cpu.setCarry(temp >= 0 && temp < 0x100);
	cpu.regA = temp & 0xFF;
	cpu.incrementSubcycle();
	memory.write8(readInValue, result & 0xFF);
	return cyclesTaken;
};
instructions_TRACE[255] = INS_ABSOLUTEX_255_TRACE;

var cpuInstructionsTrace = exports.cpuInstructionsTrace = instructions_TRACE;
var cpuTrace = exports.cpuTrace = formatData;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _sha = __webpack_require__(80);

var _sha2 = _interopRequireDefault(_sha);

var _consts = __webpack_require__(0);

var _mapperFactory = __webpack_require__(46);

var _mapperFactory2 = _interopRequireDefault(_mapperFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cartridge = function () {
	function Cartridge(mainboard) {
		_classCallCheck(this, Cartridge);

		this.mainboard = mainboard;
		this.memoryMapper = null;
		this._sha1 = '';
		this._name = '';
		this._colourEncodingType = _consts.g_DefaultColourEncoding;
	}

	_createClass(Cartridge, [{
		key: 'getHighestFrequencyElement',
		value: function getHighestFrequencyElement(map) {
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
	}, {
		key: '_determineColourEncodingType',
		value: function _determineColourEncodingType(filename) {
			var value = _consts.g_DefaultColourEncoding;

			if (filename.match(/[\[\(][E][\]\)]/i)) {
				value = 'PAL';
			} else if (filename.match(/[\[\(][JU][\]\)]/i)) {
				value = 'NTSC';
			}

			this._colourEncodingType = value;
		}
	}, {
		key: 'getName',
		value: function getName() {
			return this._name;
		}
	}, {
		key: 'getHash',
		value: function getHash() {
			return this._sha1;
		}
	}, {
		key: 'create32IntArray',
		value: function create32IntArray(array, length) {
			var a = new Int32Array(length);
			for (var i = 0; i < length; ++i) {
				a[i] = array[i] | 0;
			}
			return a;
		}
	}, {
		key: 'loadRom',
		value: function loadRom(_ref) {
			var _this = this;

			var name = _ref.name,
			    binaryString = _ref.binaryString,
			    fileSize = _ref.fileSize;

			return new Promise(function (resolve, reject) {
				_this._name = name;
				var stringIndex = 0;
				var correctHeader = [78, 69, 83, 26];

				for (var i = 0; i < correctHeader.length; ++i) {
					if (correctHeader[i] !== binaryString[stringIndex++]) {
						throw new Error('Invalid NES header for file!');
					}
				}

				var prgPageCount = binaryString[stringIndex++] || 1;
				var chrPageCount = binaryString[stringIndex++];
				var controlByte1 = binaryString[stringIndex++];
				var controlByte2 = binaryString[stringIndex++];

				var horizontalMirroring = (controlByte1 & 0x01) === 0;
				var sramEnabled = (controlByte1 & 0x02) > 0;
				var hasTrainer = (controlByte1 & 0x04) > 0;
				var fourScreenRamLayout = (controlByte1 & 0x08) > 0;

				var mirroringMethod = 0;
				if (fourScreenRamLayout) {
					mirroringMethod = PPU_MIRRORING_FOURSCREEN;
				} else if (!horizontalMirroring) {
					mirroringMethod = _consts.PPU_MIRRORING_VERTICAL;
				} else {
					mirroringMethod = _consts.PPU_MIRRORING_HORIZONTAL;
				}

				var mapperId = (controlByte1 & 0xF0) >> 4 | controlByte2 & 0xF0;

				stringIndex = 16;
				if (hasTrainer) stringIndex += 512;

				// calculate SHA1 on PRG and CHR data, look it up in the db, then load it
				_this._sha1 = (0, _sha2.default)(binaryString, stringIndex);
				console.log("SHA1: " + _this._sha1);

				_this.memoryMapper = (0, _mapperFactory2.default)(mapperId, _this.mainboard, mirroringMethod);

				// read in program code
				var prg8kChunkCount = prgPageCount * 2; // read in 8k chunks, prgPageCount is 16k chunks
				var prgSize = 0x2000 * prg8kChunkCount;
				_this.memoryMapper.setPrgData(_this.create32IntArray(binaryString.subarray(stringIndex, stringIndex + prgSize), prgSize), prg8kChunkCount);
				stringIndex += prgSize;

				// read in character maps
				var chr1kChunkCount = chrPageCount * 8; // 1kb per pattern table, chrPageCount is the 8kb count
				var chrSize = 0x400 * chr1kChunkCount;
				_this.memoryMapper.setChrData(_this.create32IntArray(binaryString.subarray(stringIndex, stringIndex + chrSize), chrSize), chr1kChunkCount);
				stringIndex += chrSize;

				// determine NTSC or PAL
				_this._determineColourEncodingType(name);
				(0, _consts.setColourEncodingType)(_this._colourEncodingType);
				var prgKb = prg8kChunkCount * 8;
				console.log('Cartridge \'' + name + '\' loaded. \nFile Size: \t' + fileSize + ' KB \nMapper:\t\t' + mapperId + ' \nMirroring:\t' + (0, _consts.mirroringMethodToString)(mirroringMethod) + ' \nPRG:\t\t' + prgKb + 'kb \nCHR:\t\t' + chr1kChunkCount + 'kb \nEncoding:\t' + _this._colourEncodingType);

				resolve();
			});
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.memoryMapper.reset();
		}
	}]);

	return Cartridge;
}();

exports.default = Cartridge;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Event = __webpack_require__(4);

var _Memory = __webpack_require__(32);

var _Memory2 = _interopRequireDefault(_Memory);

var _PPU = __webpack_require__(36);

var _PPU2 = _interopRequireDefault(_PPU);

var _RenderBuffer = __webpack_require__(35);

var _RenderBuffer2 = _interopRequireDefault(_RenderBuffer);

var _APULegacy = __webpack_require__(21);

var _APULegacy2 = _interopRequireDefault(_APULegacy);

var _InputDeviceBus = __webpack_require__(38);

var _InputDeviceBus2 = _interopRequireDefault(_InputDeviceBus);

var _Synchroniser = __webpack_require__(37);

var _Synchroniser2 = _interopRequireDefault(_Synchroniser);

var _Cpu = __webpack_require__(26);

var _Cpu2 = _interopRequireDefault(_Cpu);

var _Trace = __webpack_require__(3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Mainboard = function () {
  function Mainboard(renderSurface) {
    _classCallCheck(this, Mainboard);

    this.running = false;
    this.cart = null;
    this._eventBus = new _Event.EventBus();

    this.memory = new _Memory2.default(this);
    this.ppu = new _PPU2.default(this);
    this.apu = new _APULegacy2.default(this);
    this.inputdevicebus = new _InputDeviceBus2.default();
    this.cpu = new _Cpu2.default(this);

    this.renderBuffer = new _RenderBuffer2.default(this, renderSurface);

    this.synchroniser = new _Synchroniser2.default(this);
    this.synchroniser.connect('frameEnd', this._onFrameEnd.bind(this));
    this.synchroniser.addObject('ppu', this.ppu);
    this.synchroniser.addObject('apu', this.apu);

    this.ppu.hookSyncEvents(this.synchroniser);

    this.enableSound(true);
  }

  _createClass(Mainboard, [{
    key: 'connect',
    value: function connect(name, cb) {
      this._eventBus.connect(name, cb);
    }
  }, {
    key: 'enableSound',
    value: function enableSound(enable) {
      this.apu.enableSound(enable);
      this._eventBus.invoke('soundEnabled', this.apu.soundEnabled(), this.apu.soundSupported());
    }
  }, {
    key: 'setVolume',
    value: function setVolume(val) {
      this.apu.setVolume(val);
    }
  }, {
    key: 'setTraceOption',
    value: function setTraceOption(traceType, checked) {
      if (traceType === _Trace.trace_all || traceType === _Trace.trace_cpuInstructions) {
        this.cpu.enableTrace(checked); // cpu instructions require different code path, needs to be invoked seperately
      }
      (0, _Trace.enableType)(traceType, checked);
    }
  }, {
    key: '_onFrameEnd',
    value: function _onFrameEnd() {
      this.running = false;
      this._eventBus.invoke('frameEnd');
    }
  }, {
    key: 'doFrame',
    value: function doFrame() {
      if (this.cart) {
        this.running = true;
        while (this.running) {
          // keep going until a frame is rendered
          this.synchroniser.runCycle();
        }
      }
    }
  }, {
    key: 'loadCartridge',
    value: function loadCartridge(cart) {
      this.cart = cart;
      this.synchroniser.addObject('mapper', this.cart.memoryMapper);

      this.reset(true);
      this._eventBus.invoke('romLoaded', this.cart);
    }
  }, {
    key: 'powerButton',
    value: function powerButton(on) {
      var isOn = on && this.cart;
      if (isOn) {
        this.reset();
      } else {
        this.running = false;
        this.cart = null;
      }
      this._eventBus.invoke('power', isOn);
    }
  }, {
    key: 'reset',
    value: function reset(cold) {
      cold = cold === undefined ? true : cold;
      if (this.cart) this.cart.reset(cold);
      this._eventBus.invoke('reset', cold);
    }
  }, {
    key: 'saveState',
    value: function saveState() {
      var data = {};
      data.memory = this.memory.saveState();
      data.ppu = this.ppu.saveState();
      data.apu = this.apu.saveState();
      //  data.joypad1 = this.joypad1.saveState();
      data.cpu = this.cpu.saveState();
      data.synchroniser = this.synchroniser.saveState();
      data.renderBuffer = this.renderBuffer.saveState();
      if (this.cart && this.cart.memoryMapper) {
        data.memoryMapper = this.cart.memoryMapper.saveState();
      }
      return data;
    }
  }, {
    key: 'loadState',
    value: function loadState(data) {
      this.memory.loadState(data.memory);
      this.ppu.loadState(data.ppu);
      this.apu.loadState(data.apu);
      //  this.joypad1.loadState( data.joypad1 );
      this.cpu.loadState(data.cpu);
      this.renderBuffer.loadState(data.renderBuffer);
      this.synchroniser.loadState(data.synchroniser);
      if (this.cart && this.cart.memoryMapper) {
        this.cart.memoryMapper.loadState(data.memoryMapper);
      }
    }
  }]);

  return Mainboard;
}();

exports.default = Mainboard;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _serialisation = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Memory = function () {
	function Memory(mainboard) {
		_classCallCheck(this, Memory);

		this.mainboard = mainboard;
		this.mainboard.connect('reset', this.reset.bind(this));
		this.ramPage = new Int32Array(0x800);
		this.gppu = null;
		this.gmapper = null;
		this.ginput = null;
		this.gapu = null;
	}

	_createClass(Memory, [{
		key: 'reset',
		value: function reset(cold) {
			if (cold) {
				// these memory locations are set to various values on power-up
				for (var i = 0; i < this.ramPage.length; ++i) {
					this.ramPage[i] = 0xFF;
				}
				this.ramPage[0x0008] = 0xF7;
				this.ramPage[0x0009] = 0xEF;
				this.ramPage[0x000a] = 0xDF;
				this.ramPage[0x000f] = 0xBF;
			}
			this.gppu = this.mainboard.ppu;
			this.gmapper = this.mainboard.cart.memoryMapper;
			this.ginput = this.mainboard.inputdevicebus;
			this.gapu = this.mainboard.apu;
		}
	}, {
		key: 'read8',
		value: function read8(offset) {
			return this._properRead8(offset & 0xFFFF) & 0xFF;
		}
	}, {
		key: '_readRegister4000',
		value: function _readRegister4000(offset) {
			var offset4000 = offset & 0x1FE0;
			if (offset4000 === 0) {
				// testing top 11 bits - if it's zero it's between 4000 -> 4020
				if (offset === 0x4016 || offset === 0x4017) {
					//				return 0;
					return this.ginput.readFromRegister(offset);
				} else {
					return 0;
					//			return gapu.readFromRegister( offset ) | 0;
				}
			} else {
				return this.gmapper.read8EXRam(offset);
				//			return 0;
			}
			return 0;
		}
	}, {
		key: '_properRead8',
		value: function _properRead8(offset) {
			// Faster: Top 3 bits are equal to 0x2000 for inbetween 2000 -> 4000, equal to 0 for < 2000 and so on
			var topbits = offset & 0xE000;
			var bot3 = offset & 0x7;
			var rampageOffset = offset & 0x7FF;
			switch (topbits) {
				case 0:
					// address is within RAM boundaries, account for 4x mirroring
					return this.ramPage[rampageOffset];
				case 0x2000:
					// IS_INT_BETWEEN( offset, 0x2000, 0x4000 )
					return this.gppu.readFromRegister(bot3);
				case 0x4000:
					return this._readRegister4000(offset);
				case 0x6000:
					// IS_INT_BETWEEN( offset, 0x6000, 0x8000 )
					return this.gmapper.read8SRam(offset);
				default:
					// IS_INT_BETWEEN( offset, 0x8000, 0x10000 )
					return this.gmapper.read8PrgRom(offset);
			}
			return 0;
		}
	}, {
		key: 'read16NoZeroPageWrap',
		value: function read16NoZeroPageWrap(offset) {
			return this.read8(offset) | this.read8(offset + 1) << 8;
		}
	}, {
		key: 'write8',
		value: function write8(offset, data) {
			switch (offset & 0xE000) {
				case 0:
					// IS_INT_BETWEEN( offset, 0, 0x2000 ) address is within RAM boundaries, account for 4x mirroring
					this.ramPage[offset & 0x7FF] = data;
					break;
				case 0x2000:
					// IS_INT_BETWEEN( offset, 0x2000, 0x4000 )
					this.mainboard.ppu.writeToRegister(offset & 0x07, data);
					break;
				case 0x4000:
					{
						if ((offset & 0x1FE0) === 0) {
							// testing top 11 bits - if it's zero it's between 4000 -> 4020
							switch (offset) {
								case 0x4014:
									// sprite DMA access
									this.mainboard.ppu.writeToSpriteDMARegister(data);
									break;
								case 0x4016: // input
								case 0x4017:
									this.mainboard.inputdevicebus.writeToRegister(offset, data);
									break;
							}
							// APU (write input 4016 + 4017 to APU as well) <-- is that right??
							this.mainboard.apu.writeToRegister(offset, data);
						} else {
							// IS_INT_BETWEEN( offset, 0x4020, 0x6000 )
							this.mainboard.cart.memoryMapper.write8EXRam(offset, data);
						}
					}
					break;
				case 0x6000:
					// IS_INT_BETWEEN( offset, 0x6000, 0x8000 )
					this.mainboard.cart.memoryMapper.write8SRam(offset, data);
					break;
				default:
				case 0x8000:
					// IS_INT_BETWEEN( offset, 0x8000, 0x10000 )
					this.mainboard.cart.memoryMapper.write8PrgRom(offset, data);
					break;
			}
		}
	}, {
		key: 'saveState',
		value: function saveState() {
			return {
				ramPage: (0, _serialisation.uintArrayToString)(this.ramPage)
			};
		}
	}, {
		key: 'loadState',
		value: function loadState(state) {
			this.ramPage = (0, _serialisation.stringToUintArray)(state.ramPage);
		}
	}]);

	return Memory;
}();

exports.default = Memory;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Trace = __webpack_require__(3);

var _consts = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// consts use by renderPartialScanline
var ScrollReloadTime = 304; // pre-render SL only
var XReloadTime = 257;
var SecondLastTileReloadTime = 324;
var LastTileReloadTime = 332;

var ticksPerTile = 8;
var ticksFirstTile = 3;
var ticksLastTile = ticksFirstTile + 31 * ticksPerTile;

var YIncrementTime = 251;
var YIncrementTimeRendering = (YIncrementTime + 17) * _consts.MASTER_CYCLES_PER_PPU;
var XReloadTimeRendering = (XReloadTime + 17) * _consts.MASTER_CYCLES_PER_PPU;

var backgroundRenderingStart = 0;
var backgroundRenderingEnd = 0;
var backgroundScrollReloadTime = 0;
var backgroundTileCount = 34;

var PPURenderBG = function () {
	function PPURenderBG(ppu) {
		_classCallCheck(this, PPURenderBG);

		this.ppu = ppu;
		this._spriteZeroHit = false;
		this._useMMC2Latch = false;
	}

	_createClass(PPURenderBG, [{
		key: 'reset',
		value: function reset() {
			backgroundRenderingStart = this.ppu.screenCoordinatesToTicks(ScrollReloadTime - 1, -1);
			backgroundRenderingEnd = this.ppu.screenCoordinatesToTicks(SecondLastTileReloadTime - 1, 239);
			backgroundScrollReloadTime = this.ppu.screenCoordinatesToTicks(ScrollReloadTime, -1);

			this._bgTableAddress = 0;
			this._spriteZeroHit = false;
			this._renderBuffer = this.ppu.mainboard.renderBuffer;
			this._useMMC2Latch = this.ppu.mainboard.cart.memoryMapper.MMC2Latch !== undefined;
		}
	}, {
		key: 'onControl1Change',
		value: function onControl1Change(control1) {
			this._bgTableAddress = (control1 & 0x10) > 0 ? 0x1000 : 0;
		}
	}, {
		key: 'onEndFrame',
		value: function onEndFrame() {
			this._spriteZeroHit = false;
		}
	}, {
		key: 'saveState',
		value: function saveState(data) {
			data._spriteZeroHit = this._spriteZeroHit;
		}
	}, {
		key: 'loadState',
		value: function loadState(state) {
			this._spriteZeroHit = state._spriteZeroHit;
		}
	}, {
		key: '_renderTile',
		value: function _renderTile(ppuReadAddress, tilenum, posy, clippingEnabled) {
			var triggerTime = 0;
			var renderScanline = posy | 0; // ( tilenum <= 2 ? posy + 1 : posy );
			var startXRendering = clippingEnabled ? 8 : 0;
			var baseindex = (tilenum | 0) * 8;

			var htile = ppuReadAddress & 0x001F;
			var vtile = (ppuReadAddress & 0x03E0) >> 5;
			//var finey = ((this.ppu.ppuReadAddress & 0x7000) >> 12);

			var nameTableAddress = 0x2000 + (ppuReadAddress & 0x0FFF) & 0xFFFF;
			var tileNumber = this.ppu.readNameTable(nameTableAddress, 0);

			// (screen address) + (tilenumber * 16) + finey
			var tileAddress = this._bgTableAddress + tileNumber * 16 + ((ppuReadAddress & 0x7000) >> 12);
			var attributeByte = this.ppu.readNameTable(0x23C0 | ppuReadAddress & 0x0C00 | (vtile & 0x1C) << 1 | htile >> 2 & 0x7, 1);

			var mergeByte = 0;
			if ((htile & 0x2) === 0) {
				if ((vtile & 0x2) === 0) {
					mergeByte = (attributeByte & 0x3) << 2;
				} else {
					mergeByte = (attributeByte & 0x30) >> 2;
				}
			} else {
				if ((vtile & 0x2) === 0) {
					mergeByte = attributeByte & 0xC;
				} else {
					mergeByte = (attributeByte & 0xC0) >> 4;
				}
			}

			// pattern table reads
			var firstByte = this.ppu.read8(tileAddress, false, 2);
			var secondByte = this.ppu.read8(tileAddress + 8, false, 3);

			if (this._useMMC2Latch) {
				this.ppu.mainboard.cart.memoryMapper.MMC2Latch(tileAddress + 8);
			}

			// render tiles from right-most pixel first - allows us to shift the first & second pattern table byte to get the palette
			// index we want.

			var startPixel = baseindex - this.ppu.fineX;
			var endPixel = startPixel + 7;
			var realStartPixel = Math.max(startPixel, 0);
			var startPixelIndex = realStartPixel - startPixel;
			var paletteIndex = 0;
			var byteMask = 0x80 >> startPixelIndex;
			var x = realStartPixel;
			for (; x <= endPixel; ++x) {
				paletteIndex = (firstByte & byteMask) > 0 ? 0x1 : 0;
				paletteIndex |= (secondByte & byteMask) > 0 ? 0x2 : 0;

				byteMask >>= 1;

				if (x >= startXRendering && x < _consts.SCREEN_WIDTH) {
					if (paletteIndex > 0) {
						paletteIndex |= mergeByte;

						if ((paletteIndex & 0x3) === 0) paletteIndex = 0;

						if (this._renderBuffer.renderPixel(x, renderScanline, this.ppu.paletteTables[0][paletteIndex & 0xF] | 0)) {
							// Sprite zero hit - will happen in the future as this is the prefetch
							if (!this._spriteZeroHit) {
								triggerTime = this.ppu.screenCoordinatesToTicks(x, renderScanline);
								(0, _Trace.writeLine)(_Trace.trace_ppu, "[" + this.ppu.frameCounter + "] PPU sprite hit scheduled for @ " + x + "x" + renderScanline + " (" + triggerTime + ")");
								this._spriteZeroHit = true;
								this.ppu.mainboard.synchroniser.changeEventTime(this.ppu._spriteZeroEventId, triggerTime);
							}
						}
					}
				}
			}
		}
	}, {
		key: '_incrementY',
		value: function _incrementY(ppuReadAddress) {
			/*
   	Y increment
   	At dot 256 of each scanline, fine Y is incremented, overflowing to coarse Y, and finally adjusted to wrap among the nametables vertically.
   	Bits 12-14 are fine Y. Bits 5-9 are coarse Y. Bit 11 selects the vertical nametable.
   		if ((v & 0x7000) != 0x7000)        // if fine Y < 7
   			v += 0x1000                      // increment fine Y
   		else
   			v &= ~0x7000                     // fine Y = 0
   			int y = (v & 0x03E0) >> 5        // let y = coarse Y
   			if y == 29
   				y = 0                          // coarse Y = 0
   				v ^= 0x0800                    // switch vertical nametable
   			else if y == 31
   				y = 0                          // coarse Y = 0, nametable not switched
   			else
   				y += 1                         // increment coarse Y
   			v = (v & ~0x03E0) | (y << 5)     // put coarse Y back into v
   */
			// INCREMENT Y LOGIC
			if ((ppuReadAddress & 0x7000) === 0x7000) {
				// wrap when tile y offset = 7
				//ppuReadAddress &= ~0x7000;
				ppuReadAddress &= 0x8FFF;

				if ((ppuReadAddress & 0x03E0) === 0x03A0) {
					// wrap tile y and switch name table bit 11, if tile y is 29
					ppuReadAddress ^= 0x0800;
					ppuReadAddress &= 0xFC1F;
				} else if ((ppuReadAddress & 0x03E0) === 0x03E0) {
					// wrap tile y if it is 31
					ppuReadAddress &= 0xFC1F;
				} else {
					// just increment tile y
					ppuReadAddress += 0x0020;
				}
			} else {
				// increment tile y offset
				ppuReadAddress += 0x1000;
			}
			return ppuReadAddress;
		}
	}, {
		key: '_incrementX',
		value: function _incrementX(ppuReadAddress) {
			/*
   The coarse X component of v needs to be incremented when the next tile is reached. Bits 0-4 are incremented, with overflow toggling bit 10. This means that bits 0-4 count from 0 to 31 across a single nametable, and bit 10 selects the current nametable horizontally.
   if ((v & 0x001F) == 31) // if coarse X == 31
     v &= ~0x001F          // coarse X = 0
     v ^= 0x0400           // switch horizontal nametable
   else
     v += 1                // increment coarse X
   */
			// INCREMENT X LOGIC
			if ((ppuReadAddress & 0x001F) === 0x001F) {
				// switch name tables (bit 10) and reset tile x to 0
				ppuReadAddress = (ppuReadAddress ^ 0x0400) & 0xFFE0;
			} else {
				// next tile
				ppuReadAddress = ppuReadAddress + 1 & 0xFFFF;
			}
			return ppuReadAddress;
		}
	}, {
		key: 'renderTo',
		value: function renderTo(startTicks, endTicks, ppuReadAddress, ppuLatchAddress) {
			(0, _Trace.writeLine)(_Trace.trace_ppu, 'sync: startTicks=' + startTicks + ' endTicks=' + endTicks);

			var ticksInFirstLine = 0;
			var ticksAtFirstScanline = 0;
			var tileTickPosition = 0;
			var tilenum = 0;
			var ticksAtFirstRenderingScanline = 0;
			var ticksAtFirstRenderingScanlineEnd = 0;
			var scanlineStart = 0;
			var posy = 0;
			var clippingEnabled = (this.ppu.control2 & 0x2) === 0 /*ppuControl2.backgroundClipping*/;
			var backgroundRenderingEnabled = (this.ppu.control2 & 0x8) > 0 /* ppuControl2.backgroundSwitch */;
			var reloadTime = 0;
			var incrementYTime = 0;
			var scanline = 0;

			if (startTicks < backgroundRenderingStart) {
				startTicks = backgroundRenderingStart;
			}
			if (endTicks > backgroundRenderingEnd) {
				endTicks = backgroundRenderingEnd;
			}
			if (endTicks <= startTicks) {
				return ppuReadAddress;
			}

			ticksInFirstLine = startTicks % _consts.MASTER_CYCLES_PER_SCANLINE;
			ticksAtFirstScanline = startTicks - ticksInFirstLine;
			ticksAtFirstRenderingScanline = ticksAtFirstScanline - _consts.MASTER_CYCLES_PER_SCANLINE + SecondLastTileReloadTime * _consts.MASTER_CYCLES_PER_PPU;
			ticksAtFirstRenderingScanlineEnd = ticksAtFirstRenderingScanline + _consts.MASTER_CYCLES_PER_SCANLINE; // ( 34 * 8 * MASTER_CYCLES_PER_PPU );

			while (ticksAtFirstRenderingScanlineEnd < startTicks || ticksAtFirstRenderingScanline < backgroundRenderingStart) {
				ticksAtFirstRenderingScanline += _consts.MASTER_CYCLES_PER_SCANLINE;
				ticksAtFirstRenderingScanlineEnd += _consts.MASTER_CYCLES_PER_SCANLINE;
			}

			if (backgroundScrollReloadTime > startTicks && backgroundScrollReloadTime <= endTicks) {
				// reset ppu address on cycle 304 of pre-render scanline
				ppuReadAddress = ppuReadAddress & 0x41F | ppuLatchAddress & 0x7BE0;
			}

			scanlineStart = ticksAtFirstRenderingScanline;
			scanline = Math.floor((ticksAtFirstRenderingScanline - backgroundRenderingStart) / _consts.MASTER_CYCLES_PER_SCANLINE) | 0;

			// tile prefetches between SecondLastTileReloadTime (previous line) for 34 tiles
			while (scanlineStart <= endTicks) {
				incrementYTime = scanlineStart + YIncrementTimeRendering;
				reloadTime = scanlineStart + XReloadTimeRendering;

				for (tilenum = 0; tilenum < backgroundTileCount; ++tilenum) {
					tileTickPosition = scanlineStart + tilenum * 8 * _consts.MASTER_CYCLES_PER_PPU;

					if (tileTickPosition > endTicks || tileTickPosition > backgroundRenderingEnd) {
						break;
					}
					if (tileTickPosition <= startTicks) {
						continue;
					}

					if (backgroundRenderingEnabled) {
						this._renderTile(ppuReadAddress, tilenum, scanline, clippingEnabled);
					}
					ppuReadAddress = this._incrementX(ppuReadAddress);
				}

				// render last tile on screen, increment Y
				if (incrementYTime < backgroundRenderingEnd && incrementYTime > startTicks && incrementYTime <= endTicks) {
					ppuReadAddress = this._incrementY(ppuReadAddress);
				}

				if (reloadTime < backgroundRenderingEnd && reloadTime > startTicks && reloadTime <= endTicks) {
					ppuReadAddress = ppuReadAddress & 0xFBE0 | ppuLatchAddress & 0x041F;
				}

				scanlineStart += _consts.MASTER_CYCLES_PER_SCANLINE;
				scanline++;
			}
			return ppuReadAddress;
		}
	}]);

	return PPURenderBG;
}();

exports.default = PPURenderBG;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _consts = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PPURenderSprites = function () {
	function PPURenderSprites(ppu) {
		_classCallCheck(this, PPURenderSprites);

		this.ppu = ppu;
		this._overflowSet = false;
		this._useMMC2Latch = false;
	}

	_createClass(PPURenderSprites, [{
		key: 'reset',
		value: function reset() {
			this._overflowSet = false;
			this._useMMC2Latch = this.ppu.mainboard.cart.memoryMapper.MMC2Latch !== undefined;
		}
	}, {
		key: 'onEndFrame',
		value: function onEndFrame() {
			this._overflowSet = false;
		}
	}, {
		key: 'saveState',
		value: function saveState(data) {
			data._overflowSet = this._overflowSet;
		}
	}, {
		key: 'loadState',
		value: function loadState(state) {
			this._overflowSet = state._overflowSet;
		}
	}, {
		key: 'isRangeOverlapping',
		value: function isRangeOverlapping(a1, a2, b1, b2) {
			// http://stackoverflow.com/questions/3269434/whats-the-most-efficient-way-to-test-two-integer-ranges-for-overlap
			return a2 >= b1 && a1 <= b2;
		}
	}, {
		key: '_renderSprite',
		value: function _renderSprite(spriteHeight, spritenum, startline, endline, spritey) {
			var spriteIndex = spritenum * 4;
			var patternnum = this.ppu.spriteMemory[spriteIndex + 1];
			var attribs = this.ppu.spriteMemory[spriteIndex + 2];
			var sx = this.ppu.spriteMemory[spriteIndex + 3];

			var behindBackground = (attribs & 0x20) > 0;
			var flipHorz = (attribs & 0x40) > 0;
			var flipVert = (attribs & 0x80) > 0;

			var renderScanlineStart = Math.max(spritey, startline);
			var renderScanlineEnd = Math.min(spritey + spriteHeight - 1, endline);
			var ppuAddress = 0;
			var absSy = 0;
			var mask = 0;
			var topsprite = false;
			var firstByte = 0;
			var secondByte = 0;
			var paletteMergeByte = 0;
			var absx = 0;
			var x = 0;

			for (var scanline = renderScanlineStart; scanline <= renderScanlineEnd; ++scanline) {
				ppuAddress = 0;
				absSy = scanline - spritey;

				if (spriteHeight === 8 /*!ppuControl1.spriteSize*/) {
						ppuAddress = patternnum * 16 + ((flipVert ? 7 - absSy : absSy) & 0x7) + ((this.ppu.control1 & 0x8) > 0 /*ppuControl1.spritePatternTableAddress*/ ? 0x1000 : 0);
					} else // big sprites - if sprite num is even, use 0x0 else use 0x1000
					{
						ppuAddress = (patternnum & 0xFE) * 16 + (patternnum & 0x01) * 0x1000;

						topsprite = (0, _consts.IS_INT_BETWEEN)(scanline, spritey, spritey + 8);

						if (!topsprite) {
							// on flipped, put top sprite on bottom & vis versa
							if (flipVert) ppuAddress += 15 - scanline + spritey;else ppuAddress += 8 + absSy;
						} else {
							if (flipVert) ppuAddress += 23 - scanline + spritey;else ppuAddress += absSy;
						}
					}

				firstByte = this.ppu.read8(ppuAddress, true, 0);
				secondByte = this.ppu.read8(ppuAddress + 8, true, 0);
				paletteMergeByte = (attribs & 3) << 2;

				if (this._useMMC2Latch) {
					this.ppu.mainboard.cart.memoryMapper.MMC2Latch(ppuAddress + 8);
				}

				for (x = 0; x < 8; ++x) {
					absx = x + sx;

					// check sprite clipping
					if ((this.ppu.control2 & 0x4) === 0 && absx < 8) {
						continue;
					}
					if (absx > 255) {
						break;
					}

					mask = 0x80 >> (flipHorz ? 7 - x : x);

					// get 2 lower bits from the pattern table for the colour index
					var paletteindex = (firstByte & mask) > 0 ? 1 : 0; // first bit
					paletteindex |= (secondByte & mask) > 0 ? 2 : 0; // second bit

					// add 2 upper bits
					if (paletteindex > 0) {
						paletteindex |= paletteMergeByte;
						this.ppu.mainboard.renderBuffer.renderSpritePixel(spritenum, behindBackground, absx, scanline, this.ppu.paletteTables[1][paletteindex & 0xF] | 0);
					}
				}
			}
		}

		//*** Cycles 0-63: Secondary OAM (32-byte buffer for current sprites on scanline) is initialized to $FF - attempting to read $2004 will return $FF
		//*** Cycles 64-255: Sprite evaluation
		//* On even cycles, data is read from (primary) OAM
		//* On odd cycles, data is written to secondary OAM (unless writes are inhibited, in which case it will read the value in secondary OAM instead)
		//1. Starting at n = 0, read a sprite's Y-coordinate (OAM[n][0], copying it to the next open slot in secondary OAM (unless 8 sprites have been found, in which case the write is ignored).
		//1a. If Y-coordinate is in range, copy remaining bytes of sprite data (OAM[n][1] thru OAM[n][3]) into secondary OAM.
		//2. Increment n
		//2a. If n has overflowed back to zero (all 64 sprites evaluated), go to 4
		//2b. If less than 8 sprites have been found, go to 1
		//2c. If exactly 8 sprites have been found, disable writes to secondary OAM
		//3. Starting at m = 0, evaluate OAM[n][m] as a Y-coordinate.
		//3a. If the value is in range, set the sprite overflow flag in $2002 and read the next 3 entries of OAM (incrementing 'm' after each byte and incrementing 'n' when 'm' overflows); if m = 3, increment n
		//3b. If the value is not in range, increment n AND m (without carry). If n overflows to 0, go to 4; otherwise go to 3
		//4. Attempt (and fail) to copy OAM[n][0] into the next free slot in secondary OAM, and increment n (repeat until HBLANK is reached)
		//*** Cycles 256-319: Sprite fetches (8 sprites total, 8 cycles per sprite)
		//1-4: Read the Y-coordinate, tile number, attributes, and X-coordinate of the selected sprite
		//5-8: Read the X-coordinate of the selected sprite 4 times.
		//* On the first empty sprite slot, read the Y-coordinate of sprite #63 followed by $FF for the remaining 7 cycles
		//* On all subsequent empty sprite slots, read $FF for all 8 reads
		//*** Cycles 320-340: Background render pipeline initialization
		//* Read the first byte in secondary OAM (the Y-coordinate of the first sprite found, sprite #63 if no sprites were found)

	}, {
		key: 'renderTo',
		value: function renderTo(startTicks, endTicks) {
			// Further optimisations can be made: Keep list of visible sprites, update on memory changes -
			// don't need to iterate over 64 of them each time then
			// (dont think this'll work as you need to go over 64 sprites anyway for overflow check)
			var spriteEvaluationStart = 64;

			var firstSpriteEvaluation = this.ppu.screenCoordinatesToTicks(spriteEvaluationStart - 1, -1);
			var lastSpriteEvaluation = this.ppu.screenCoordinatesToTicks(spriteEvaluationStart, 238);
			var spritesVisible = (this.ppu.control2 & 0x10) > 0;
			var ticksIntoCurrentLine = startTicks % _consts.MASTER_CYCLES_PER_SCANLINE;
			var nextSpriteEval = startTicks - ticksIntoCurrentLine + spriteEvaluationStart * _consts.MASTER_CYCLES_PER_PPU;
			var startline = 0;
			var endline = 0;
			var spriteHeight = (this.ppu.control1 & 0x20) > 0 ? 16 : 8;
			var nextScanlineSpritesCount = 0;
			var readFromY = 0;
			var spritenum = 0;
			var spritey = 0;
			var that = this;

			if (!spritesVisible) {
				return;
			}

			if (startTicks < firstSpriteEvaluation) {
				startTicks = firstSpriteEvaluation;
			}
			if (endTicks > lastSpriteEvaluation) {
				endTicks = lastSpriteEvaluation;
			}

			if (endTicks <= startTicks) {
				return;
			}

			// work out when sprites are next due to be evaluated
			while (nextSpriteEval <= startTicks) {
				nextSpriteEval += _consts.MASTER_CYCLES_PER_SCANLINE;
			}

			if (nextSpriteEval > endTicks) {
				return; // not yet time for the next evaluation period
			}

			startline = this.ppu.ticksToScreenCoordinates(nextSpriteEval).y + 1;
			endline = startline;
			while (nextSpriteEval <= endTicks) {
				nextSpriteEval += _consts.MASTER_CYCLES_PER_SCANLINE;
				endline++;
			}
			endline = Math.min(endline, 239);

			// check each sprite to see which fall within the area to check.
			for (spritenum = 0; spritenum < 64; ++spritenum) {
				spritey = this.ppu.spriteMemory[spritenum * 4] + 1;

				if (spritey > 0 && spritey < _consts.SCREEN_HEIGHT) {
					if (this.isRangeOverlapping(startline, endline, spritey, spritey + spriteHeight)) {
						this._renderSprite(spriteHeight, spritenum, startline, endline, spritey);
					}
				}
			}
		}
	}]);

	return PPURenderSprites;
}();

exports.default = PPURenderSprites;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _consts = __webpack_require__(0);

var _serialisation = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RenderBuffer = function () {
	function RenderBuffer(mainboard, renderSurface) {
		_classCallCheck(this, RenderBuffer);

		this._mainboard = mainboard;
		this._renderSurface = renderSurface;

		var paletteArray = [0x808080, 0xA63D00, 0xB01200, 0x960044, 0x5E00A1, 0x2800C7, 0x0006BA, 0x00178C, 0x002F5C, 0x004510, 0x004A05, 0x2E4700, 0x664100, 0x000000, 0x050505, 0x050505, 0xC7C7C7, 0xFF7700, 0xFF5521, 0xFA3782, 0xB52FEB, 0x5029FF, 0x0022FF, 0x0032D6, 0x0062C4, 0x008035, 0x008F05, 0x558A00, 0xCC9900, 0x212121, 0x090909, 0x090909, 0xFFFFFF, 0xFFD70F, 0xFFA269, 0xFF80D4, 0xF345FF, 0x8B61FF, 0x3388FF, 0x129CFF, 0x20BCFA, 0x0EE39F, 0x35F02B, 0xA4F00C, 0xFFFB05, 0x5E5E5E, 0x0D0D0D, 0x0D0D0D, 0xFFFFFF, 0xFFFCA6, 0xFFECB3, 0xEBABDA, 0xF9A8FF, 0xB3ABFF, 0xB0D2FF, 0xA6EFFF, 0x9CF7FF, 0x95E8D7, 0xAFEDA6, 0xDAF2A2, 0xFCFF99, 0xDDDDDD, 0x111111, 0x111111, 0x000000];

		this.defaultPalette32BitVals = new Uint32Array(paletteArray.length);

		for (var i = 0; i < paletteArray.length; ++i) {
			this.defaultPalette32BitVals[i] = paletteArray[i];
		}

		var that = this;
		this._clipTopAndBottomY = false;
		this._mainboard.connect('reset', function (cold) {
			that._reset(cold);
		});
		this.priorityBuffer = new Int32Array(_consts.SCREEN_WIDTH * _consts.SCREEN_HEIGHT);
		this.clearBuffer();
	}

	_createClass(RenderBuffer, [{
		key: '_reset',
		value: function _reset(cold) {

			this._clipTopAndBottomY = _consts.COLOUR_ENCODING_NAME === "NTSC";
		}
	}, {
		key: 'clearBuffer',
		value: function clearBuffer() {

			this.priorityBuffer.set(_consts.g_ClearScreenArray);
		}
	}, {
		key: 'pickColour',
		value: function pickColour(paletteIndex) {
			this.colorHash = this.colorHash || {};
			if (this.colorHash[paletteIndex]) {
				return this.colorHash[paletteIndex];
			}
			this.uintPalette = this.uintPalette || new Uint32Array(this.defaultPalette32BitVals);

			var pindex = 0;
			if (paletteIndex < 64) {
				pindex = paletteIndex;
			} else {
				pindex = 64;
			}
			this.colorHash[paletteIndex] = this.uintPalette[pindex];

			return this.colorHash[paletteIndex];
		}
	}, {
		key: '_renderPixel',
		value: function _renderPixel(bufferIndex, insertIndex, y, paletteIndex) {

			if (this._clipTopAndBottomY && (y < 8 || y > 231)) {
				return;
			}

			var colour = this.pickColour(paletteIndex | 0);
			this._renderSurface.writeToBuffer(bufferIndex, insertIndex, colour);
		}
	}, {
		key: 'renderSpritePixelDebug',
		value: function renderSpritePixelDebug(spritenum, x, y) {

			//this._renderSurface.writeToBuffer( 2, x, y, 0xFFE92BFF );
		}
	}, {
		key: 'renderSpritePixel',
		value: function renderSpritePixel(spritenum, isBehind, x, y, paletteIndex) {
			var index = y * _consts.SCREEN_WIDTH + x;
			var bufferIndex = isBehind ? 0 : 2;
			if (this.priorityBuffer[index] === 0) {
				this.priorityBuffer[index] = spritenum + 1;
				this._renderPixel(bufferIndex, index, y, paletteIndex);
			}
		}
	}, {
		key: 'renderPixel',
		value: function renderPixel(x, y, paletteIndex) {
			var hitzero = false;
			var index = y * _consts.SCREEN_WIDTH + x;
			if (this.priorityBuffer[index] === 1 && x < _consts.SCREEN_WIDTH - 1) {
				hitzero = true;
			}
			this._renderPixel(1, index, y, paletteIndex);
			return hitzero;
		}
	}, {
		key: 'saveState',
		value: function saveState() {

			return {
				priorityBuffer: (0, _serialisation.uintArrayToString)(this.priorityBuffer)
			};
		}
	}, {
		key: 'loadState',
		value: function loadState(state) {

			this.priorityBuffer = (0, _serialisation.stringToUintArray)(state.priorityBuffer);
		}
	}]);

	return RenderBuffer;
}();

exports.default = RenderBuffer;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _serialisation = __webpack_require__(1);

var _Trace = __webpack_require__(3);

var _consts = __webpack_require__(0);

var _PPURenderBG = __webpack_require__(33);

var _PPURenderBG2 = _interopRequireDefault(_PPURenderBG);

var _PPURenderSprites = __webpack_require__(34);

var _PPURenderSprites2 = _interopRequireDefault(_PPURenderSprites);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PPU = function () {
	function PPU(mainboard) {
		_classCallCheck(this, PPU);

		var that = this;
		this.mainboard = mainboard;
		this.mainboard.connect('reset', this.reset.bind(this));
		this.lastTransferredValue = 0;
		this.mirroringMethod = null;
		this.spriteMemory = new Int32Array(0x100);
		this._invokeA12Latch = false;
		this._bitOperationOn2002 = false;

		this.nameTablesMap = new Int32Array(4);
		this.nameTables = [];
		for (var i = 0; i < 4; ++i) {
			this.nameTables.push(new Int32Array(0x400));
		}this.paletteTables = [new Int32Array(0x10), new Int32Array(0x10)];
		this.frameCounter = 0;
		this._ppuRenderBg = new _PPURenderBG2.default(this);
		this._ppuRenderSprites = new _PPURenderSprites2.default(this);

		this.resetVariables();
	}

	// Recycles a static return object to save creating an object per call (sloooow...) be warned using this method, dont call more than once at a time
	// else the values will be overwritten


	_createClass(PPU, [{
		key: 'reset',
		value: function reset(cold) {

			this._useMapperNameTableRead = this.mainboard.cart.memoryMapper.nameTableRead !== undefined;
			this._sync = this.mainboard.synchroniser;
			this.resetVariables(cold);
			this._invokeA12Latch = this.mainboard.cart.memoryMapper.ppuA12Latch !== undefined;
			this._ppuRenderBg.reset();
			this._ppuRenderSprites.reset();
		}
	}, {
		key: 'bitOperationHappening',
		value: function bitOperationHappening() {

			this._bitOperationOn2002 = true;
		}
	}, {
		key: 'resetVariables',
		value: function resetVariables(cold) {
			if (cold) this.control1 = this.control2 = this.status = 0;else this.control1 &= 0x7F; // ppuControl1.vBlankNmi = false;
			this.status |= 0x80; // vblank

			this.isOddFrame = false;
			this.suppressNmi = this.suppressVblank = false;
			this.forceNmi = false;

			this.doSpriteTransferAfterNextCpuInstruction = false;
			this.spriteTransferArgument = 0;

			this.fineX = 0;
			this.bufferedppuread = 0;
			this.ppuSecondAddressWrite = false;
			this.ppuReadAddress = 0;
			this.ppuLatchAddress = 0;
			this.spriteaddress = 0;

			this.frameCounter = 0;
		}
	}, {
		key: 'hookSyncEvents',
		value: function hookSyncEvents(synchroniser) {

			var that = this;
			this._clockSkipEventId = synchroniser.addEvent('ppu clockskip', this.getMasterTicksTillClockSkip(), function () {
				that._eventClockskip();
			});
			this._vblankClearEventId = synchroniser.addEvent('ppu vblank clear', _consts.COLOUR_ENCODING_VBLANK_MTC, function (eventTime) {
				that._eventVblankClear(eventTime);
			});
			this._ppuNmiEventId = synchroniser.addEvent('ppu NMI', -1, function (eventTime) {
				that._eventNmiTrigger(eventTime);
			});
			this._spriteZeroEventId = synchroniser.addEvent('ppu sprite zero hit', -1, function (eventTime) {
				that._eventSpriteZeroHit(eventTime);
			});
		}
	}, {
		key: '_eventClockskip',
		value: function _eventClockskip() {

			// Skip a PPU clock cycle if the background is enabled
			if (this.isOddFrame && (this.control2 & 0x8) > 0 /*ppuControl2.backgroundSwitch*/ && _consts.COLOUR_ENCODING_NAME === "NTSC") {
				this._sync.advanceCpuMTC(_consts.MASTER_CYCLES_PER_PPU);
			}
		}
	}, {
		key: '_eventVblankClear',
		value: function _eventVblankClear(eventTime) {

			// clear vblank flags after vblank period (in this emultor, at the start of the frame)
			// clear bits 5,6,7 in 0x2002
			//console.log( "CLEAR VBLANK: " + eventTime );
			this.status &= 0x1F;
		}
	}, {
		key: '_eventNmiTrigger',
		value: function _eventNmiTrigger(eventTime) {

			if ((this.control1 & 0x80) > 0 /* ppuControl1.vBlankNmi*/ && (this.status & 0x80) > 0 /* ppuStatus.vBlank*/) {
					this.mainboard.cpu.nonMaskableInterrupt(eventTime);
				}

			this._sync.changeEventTime(this._ppuNmiEventId, -1);
		}
	}, {
		key: '_eventSpriteZeroHit',
		value: function _eventSpriteZeroHit(eventTime) {

			(0, _Trace.writeLine)(_Trace.trace_ppu, "PPU sprite hit set");
			// var realmtc = this._sync.getCpuMTC();
			// console.log( "[" + this.frameCounter + "] Sprite hit at: " + realmtc + " [" + JSON.stringify( this.ticksToScreenCoordinates( realmtc ) )
			// + " due: " + eventTime + " [" + JSON.stringify( this.ticksToScreenCoordinates( eventTime ) ) + "]" );
			this.status |= 0x40;
			this._sync.changeEventTime(this._spriteZeroEventId, -1);
		}
	}, {
		key: '_eventSpriteOverflow',
		value: function _eventSpriteOverflow(eventTime) {

			//var realmtc = this._sync.getCpuMTC();
			//console.log( "Sprite overflow at: " + realmtc + " [" + JSON.stringify( this.ticksToScreenCoordinates( realmtc ) )
			//	+ " due: " + eventTime + " [" + JSON.stringify( this.ticksToScreenCoordinates( eventTime ) ) + "]" );
			this.status |= 0x20; /*ppuStatus.spriteOverflow = true;*/
		}
	}, {
		key: 'getMasterTicksTillVBlankClearDue',
		value: function getMasterTicksTillVBlankClearDue(tickCount) {
			tickCount = tickCount || 0;
			return _consts.COLOUR_ENCODING_VBLANK_MTC - tickCount;
		}
	}, {
		key: 'getMasterTicksTillClockSkip',
		value: function getMasterTicksTillClockSkip(tickCount) {
			tickCount = tickCount || 0;
			return _consts.COLOUR_ENCODING_VBLANK_MTC + _consts.MASTER_CYCLES_PER_PPU * (328 + 9) - tickCount;
		}
	}, {
		key: 'ticksToScreenCoordinates',
		value: function ticksToScreenCoordinates(tickCount) {
			tickCount = tickCount || this._sync.getCpuMTC();
			tickCount = Math.floor(tickCount / _consts.MASTER_CYCLES_PER_PPU) | 0;
			PPU.screenPos.x = tickCount % _consts.PPU_TICKS_PER_SCANLINE;
			PPU.screenPos.y = Math.floor(tickCount / _consts.PPU_TICKS_PER_SCANLINE) - _consts.COLOUR_ENCODING_VBLANK_SCANLINES - 1 | 0;
			return PPU.screenPos;
		}
	}, {
		key: 'screenCoordinatesToTicks',
		value: function screenCoordinatesToTicks(x, y) {

			return x * _consts.MASTER_CYCLES_PER_PPU + (y + _consts.COLOUR_ENCODING_VBLANK_SCANLINES + 1) * _consts.MASTER_CYCLES_PER_SCANLINE;
		}
	}, {
		key: 'isRenderingEnabled',
		value: function isRenderingEnabled() {
			return (this.control2 & 0x18) > 0;
		}
	}, {
		key: 'isRendering',
		value: function isRendering(tickCount, includeHblank) {
			if (this.isRenderingEnabled()) {
				var pos = this.ticksToScreenCoordinates(tickCount);
				return (includeHblank ? (0, _consts.IS_INT_BETWEEN)(pos.x, 0, 256) : true) && (0, _consts.IS_INT_BETWEEN)(pos.y, -1, 241);
			} else return false;
		}
	}, {
		key: 'updatePPUReadAddress',
		value: function updatePPUReadAddress(newAddress, invokedFromRegisterWrite) {
			if (invokedFromRegisterWrite && this._invokeA12Latch) {
				if ((newAddress & 0x1000) > 0) {
					this.mainboard.cart.memoryMapper.ppuA12Latch();
				}
			}
			this.ppuReadAddress = newAddress;
		}
	}, {
		key: 'changeMirroringMethod',
		value: function changeMirroringMethod(method) {

			if (method !== this.mirroringMethod) {
				this.mirroringMethod = method;
				var name = '';
				switch (this.mirroringMethod) {
					default:
					case _consts.PPU_MIRRORING_HORIZONTAL:
						// mirrors 3 & 4 point to the second nametable
						this.nameTablesMap[0] = 0;
						this.nameTablesMap[1] = 0;
						this.nameTablesMap[2] = 1;
						this.nameTablesMap[3] = 1;
						//name = 'horizontal';
						break;
					case _consts.PPU_MIRRORING_VERTICAL:
						// mirrors 2 & 4 point to the second nametable
						this.nameTablesMap[0] = 0;
						this.nameTablesMap[1] = 1;
						this.nameTablesMap[2] = 0;
						this.nameTablesMap[3] = 1;
						//name = 'vertical';
						break;
					case PPU_MIRRORING_FOURSCREEN:
						// no mirroring done, requires an extra 0x800 of memory kept on cart
						for (var i = 0; i < 4; ++i) {
							this.nameTablesMap[i] = i;
						} //name = 'four screen';
						break;
					case PPU_MIRRORING_SINGLESCREEN_NT0:
						for (var j = 0; j < 4; ++j) {
							this.nameTablesMap[j] = 0;
						} //name = 'single 0';
						break;
					case PPU_MIRRORING_SINGLESCREEN_NT1:
						for (var k = 0; k < 4; ++k) {
							this.nameTablesMap[k] = 1;
						} //name = 'single 1';
						break;
				}
				//console.log( 'PPU nametable mirroring set to ' + name );
			}
		}
	}, {
		key: 'getMirroringMethod',
		value: function getMirroringMethod() {
			return this.mirroringMethod;
		}
	}, {
		key: 'handleSpriteTransfer',
		value: function handleSpriteTransfer() {
			/*
   SPR DMA should take 513 cycles if it starts on an even cycle, 514 if it starts on an odd cycle.
   	Remember that SPR DMA only takes place when the instruction has finished executing, and not at the write cycle of the instruction! You can check this behavior by using a RMW instruction with $4014, it will only do one sprite dma at the end of the instruction.
   	I m able to pass irq and dma, as well as both spr and dma tests using this implementation.
   */
			var baseReadAddress = this.spriteTransferArgument * 0x100;
			if (this.doSpriteTransferAfterNextCpuInstruction) {
				this.doSpriteTransferAfterNextCpuInstruction = false;
				this._sync.synchronise();
				// TODO: Optimise
				this._sync.advanceCpuMTC(1 * _consts.COLOUR_ENCODING_MTC_PER_CPU);
				this.spriteaddress &= 0xFF;
				for (var i = 0; i < 0x100; ++i) {
					var dmaData = this.mainboard.memory.read8(baseReadAddress + i);
					this._sync.advanceCpuMTC(1 * _consts.COLOUR_ENCODING_MTC_PER_CPU);
					this.spriteMemory[this.spriteaddress] = dmaData;
					this.spriteaddress = this.spriteaddress + 1 & 0xFF;
					//this.lastTransferredValue = dmaData;
					this._sync.advanceCpuMTC(1 * _consts.COLOUR_ENCODING_MTC_PER_CPU);
				}
				// add extra cycle on odd frame
				if (this.isOddFrame) this._sync.advanceCpuMTC(1 * _consts.COLOUR_ENCODING_MTC_PER_CPU);
			}
		}
	}, {
		key: '_writeTo2000',
		value: function _writeTo2000(offset, data) {
			var cpuMtc = this._sync.getCpuMTC();
			var vblankSetTime = _consts.COLOUR_ENCODING_FRAME_MTC;
			var ticksTillSet = vblankSetTime - cpuMtc;

			if ((data & 0x80) === 0) {
				// vblank nmi cleared
				// special case code for disabling NMI when disabled near vblank set
				// NMI should occur when disabled 2, 3 or 4 PPU clocks after VBL set
				if (ticksTillSet <= -_consts.MASTER_CYCLES_PER_PPU * 2 && ticksTillSet >= -_consts.MASTER_CYCLES_PER_PPU * 4) {
					this.forceNmi = true;
				} else if (ticksTillSet >= -_consts.MASTER_CYCLES_PER_PPU * 1 && ticksTillSet <= _consts.MASTER_CYCLES_PER_PPU * 1) {
					this.suppressNmi = true;
				}
			} else {
				// NMI should occur if enabled when VBL already set
				// vblank = true && vblanknmi = false
				if ((this.status & 0x80) > 0 && (this.control1 & 0x80) === 0) {
					// there be a 1-PPU clock latency for this
					var triggerTime = this._sync.getCpuMTC() + _consts.MASTER_CYCLES_PER_PPU * 1;
					//console.log( "NMI trigger due: " + triggerTime );
					this._sync.changeEventTime(this._ppuNmiEventId, triggerTime);
				}
			}

			this._sync.synchronise();

			// update nametable switch
			this.ppuLatchAddress &= 0xF3FF;
			this.ppuLatchAddress |= (data & 3) << 10;

			var spriteScreenAddressChanged = (this.control1 & 0x18) !== (data & 0x18);
			//var spriteSizeOrSpriteAddressChanged = ( this.control1 & 0x28 ) !== ( data & 0x28 );
			var spriteSizeChanged = (this.control1 & 0x20) !== (data & 0x20);

			this.control1 = data;

			if (spriteScreenAddressChanged) {
				this.mainboard.cart.memoryMapper.spriteScreenEnabledUpdate((this.control1 & 0x8) > 0, (this.control1 & 0x10) > 0);
				this._ppuRenderBg.onControl1Change(this.control1);
			}
			if (spriteSizeChanged && this.mainboard.cart.memoryMapper.spriteSizeChanged) {
				// used by MMC5
				this.mainboard.cart.memoryMapper.spriteSizeChanged((this.control1 & 0x20) > 0);
			}
		}
	}, {
		key: '_writeTo2001',
		value: function _writeTo2001(offset, data) {
			this._sync.synchronise();
			var renderingEnabledChanged = (this.control2 & 0x18) > 0 !== (data & 0x18) > 0;
			//var spriteVisibleOrClippingChanged = ( ( this.control2 & 0x14 ) > 0 ) !== ( ( data & 0x14 ) > 0 );

			this.control2 = data;

			if (renderingEnabledChanged) this.mainboard.cart.memoryMapper.renderingEnabledChanged((this.control2 & 0x18) > 0);
		}
	}, {
		key: '_writeTo2005',
		value: function _writeTo2005(offset, data) {
			this._sync.synchronise();

			/*
   I don't know anything about this game in particular, but bear in mind when examining
   $2005 writes that changes to bits 0-2 take effect immediately, while changes to bits 3-7
   (as well as bit 0 of $2000) don't have any effect until the start of the next H-Blank
   (cycle 257 to be specific).
   Thus, if $2005 were written in the middle of H-Blank, bits 0-2 will affect the next scanline,
   but bits 3-7 won't take effect until the scanline afterwards.
   Emulators that don't use cycle-accurate PPU rendering will not correctly handle this condition.
   */

			// bottom 3 bits are "fine" scroll value, top 5 are tile number
			// first write is horizontal value, second is vertical
			if (!this.ppuSecondAddressWrite) {
				this.ppuLatchAddress &= 0xFFE0;
				this.ppuLatchAddress |= (data & 0xF8) >> 3;
				this.fineX = data & 0x07 | 0;
				//var pos = this.ticksToScreenCoordinates();
				//console.log( "changed fineX at " + pos.x + "x" + pos.y + "=" + this.fineX );
			} else {
				this.ppuLatchAddress &= 0xFC1F;
				this.ppuLatchAddress |= (data & 0xF8) << 2;
				this.ppuLatchAddress &= 0x8FFF;
				this.ppuLatchAddress |= (data & 0x07) << 12;
			}

			this.ppuSecondAddressWrite = !this.ppuSecondAddressWrite;

			//writeLine( 'ppu', '2005 write: ' + data.toString( 16 ) );
		}
	}, {
		key: '_writeTo2006',
		value: function _writeTo2006(offset, data) {
			// first write is upper byte of address, second is lower
			this._sync.synchronise();

			if (!this.ppuSecondAddressWrite) {
				this.control1 &= 0xFC; // TODO: is this correct?
				this.control1 |= (data & 0x0C) >> 2; // nametable
				this.ppuLatchAddress &= 0x00FF;
				this.ppuLatchAddress |= (data & 0x3F) << 8;
			} else {
				this.ppuLatchAddress &= 0xFF00;
				this.ppuLatchAddress |= data;

				this.updatePPUReadAddress(this.ppuLatchAddress, true);
			}

			this.ppuSecondAddressWrite = !this.ppuSecondAddressWrite;

			//writeLine( 'ppu', '2006 write: ' + data.toString( 16 ) );
		}
	}, {
		key: '_writeTo2007',
		value: function _writeTo2007(offset, data) {
			/*
   $2007 reads and writes:
   Outside of rendering, reads from or writes to $2007 will add either 1 or 32 to v depending on the VRAM increment bit set via $2000.
   During rendering (on the pre-render line and the visible lines 0-239, provided either background or sprite rendering is enabled),
   it will update v in an odd way, triggering a coarse X increment and a Y increment simultaneously (with normal wrapping behaviour).
   Internally, this is caused by the carry inputs to various sections of v being set up for rendering, and the $2007 access triggering a
   "load next value" signal for all of v (when not rendering, the carry inputs are set up to linearly increment v by either 1 or 32).
   This behaviour is not affected by the status of the increment bit. The Young Indiana Jones Chronicles uses this for some effects to adjust
   the Y scroll during rendering. If the $2007 access happens to coincide with a standard VRAM address increment (either horizontal or vertical),
   it will presumably not double-increment the relevant counter.
   */
			this._sync.synchronise();

			var bufferedAddress = 0;
			var newAddress = 0;

			if (!this.isRendering(this._sync.getCpuMTC(), false)) {
				bufferedAddress = this.ppuReadAddress;

				// increment PPU address as according to bit 2 of 0x2000
				newAddress = this.ppuReadAddress + ((this.control1 & 0x04) > 0 ? 32 : 1); // verticalwrite flag
				this.updatePPUReadAddress(newAddress, true);
				this.write8(bufferedAddress /*& 0x3FFF*/, data);
			} else {
				// TODO: disallow if due to occur this tick anyway
				//	this.background_IncrementXTile();
				//	this.background_IncrementYTile();
			}

			if (this.mainboard.cart.memoryMapper.MMC2Latch) {
				this.mainboard.cart.memoryMapper.MMC2Latch(this.ppuReadAddress);
			}

			//writeLine( 'ppu', '2007 write: ' + data.toString( 16 ) );
		}
	}, {
		key: 'writeToRegister',
		value: function writeToRegister(offset, data) {

			this.lastTransferredValue = data;

			switch (offset) {
				case 0:
					this._writeTo2000(offset, data);
					break;
				case 0x01:
					this._writeTo2001(offset, data);
					break;
				case 0x03:
					// sprite memory address, no need to synchronise
					this.spriteaddress = data & 0xFF;
					break;
				case 0x04:
					// sprite memory data
					this._sync.synchronise();
					this.spriteMemory[this.spriteaddress & 0xFF] = data;
					this.spriteaddress = this.spriteaddress + 1 & 0xFF;
					break;
				case 0x05:
					// PPU scrolling
					this._writeTo2005(offset, data);
					break;
				case 0x06:
					// PPU memory address
					this._writeTo2006(offset, data);
					break;
				case 0x07:
					// PPU memory data
					this._writeTo2007(offset, data);
					break;
			}
		}
	}, {
		key: 'writeToSpriteDMARegister',
		value: function writeToSpriteDMARegister(data) {
			this.doSpriteTransferAfterNextCpuInstruction = true;
			this.spriteTransferArgument = data;
		}
	}, {
		key: '_readFromRegister2002',
		value: function _readFromRegister2002() {
			var cpuMtc = this._sync.getCpuMTC();
			var vblankSetTime = _consts.COLOUR_ENCODING_FRAME_MTC;
			var ticksTillSet = vblankSetTime - cpuMtc;
			var suppress = false;

			// check that vblank flag isn't tried to be set 1 PPU clock before VBlank is due
			if (ticksTillSet === _consts.MASTER_CYCLES_PER_PPU) {
				this.suppressVblank = true;
				this.suppressNmi = true;
				suppress = true;
			}
			// Suppress NMI on the tick VBlank is read and the one after
			else if (ticksTillSet <= 0 && ticksTillSet >= -_consts.MASTER_CYCLES_PER_PPU * 1) {
					this.suppressNmi = true;
				}

			// If we are performing a BIT on 2002, then we can optimise by not needing
			// to synchronise (as it is only looking at the vblank flag, and we always know
			// when that is due to happen)
			//if ( !this._bitOperationOn2002 ) {
			//writeLine( 'ppu', '2002 read sync - pre: ' + cpuMtc );
			this._sync.synchronise();
			//writeLine( 'ppu', '2002 read sync - post ' + cpuMtc );
			// } else {
			// if ( ticksTillSet < MASTER_CYCLES_PER_PPU * 5 ) { // if it's about to clear, synchronise
			// this._sync.synchronise();
			// }
			// this._bitOperationOn2002 = false;
			// }

			var ret = this.status;
			//console.log( "0x2002 read : " + Number( ret ) + " status: " + Number( this.status ) );
			this.ppuSecondAddressWrite = false; // reset latch on read to 0x2002

			// wipe vblank flag from status reg
			if (suppress) ret &= 0x7F;else this.status &= 0x7F;
			return ret;
		}
	}, {
		key: '_readFromRegister2007',
		value: function _readFromRegister2007() {
			var ret = 0;
			// dont buffer reads from palette space
			var bufferedaddress = this.ppuReadAddress;
			var newAddress = 0;

			if (!this.isRendering(this._sync.getCpuMTC(), true)) {
				newAddress = this.ppuReadAddress + ((this.control1 & 0x4) > 0 /*ppuControl1.verticalWrite*/ ? 32 : 1) & 0xFFFF;
				this.updatePPUReadAddress(newAddress, true);

				if ((bufferedaddress & 0xFF00) === 0x3F00) //IS_INT_BETWEEN( bufferedaddress, 0x3F00, 0x4000 ) )
					{
						ret = this.read8(bufferedaddress, false, 0);
						this.bufferedppuread = this.read8(bufferedaddress - 0x1000, false, 0);
					} else {
					ret = this.bufferedppuread;
					this.bufferedppuread = this.read8(bufferedaddress, false, 0);
				}
			} else {
				ret = this.bufferedppuread;
				this.bufferedppuread = 0;
			}
			return ret;
		}
	}, {
		key: 'readFromRegister',
		value: function readFromRegister(offset) {
			var ret = 0;

			switch (offset) {// offset is 0x2000 -> 0x2008
				case 0x2:
					ret = this._readFromRegister2002();
					break;

				case 0x4:
					// sprite memory data
					ret = this.spriteMemory[this.spriteaddress & 0xFF] | 0;
					break;

				case 0x7:
					// PPU memory data
					ret = this._readFromRegister2007();
					break;

				//case 0x2005:
				//	Log::Write( LOG_ERROR, "Read from PPU register 0x2005 - Emulation may be inaccurate and problematic" );
				//	ret = mLastTransferredValue;
				//	throw std::runtime_error( "Read to 0x2005" );
				//case 0x2006:
				//	Log::Write( LOG_ERROR, "Read from PPU register 0x2006 - Emulation may be inaccurate and problematic" );
				//	ret = mLastTransferredValue;
				//	throw std::runtime_error( "Read to 0x2006" );
				default:
					ret = this.lastTransferredValue;
					break;
			}

			this.lastTransferredValue = ret;
			return ret;
		}
	}, {
		key: 'write8',
		value: function write8(offset, data) {

			if ((offset & 0x2000) === 0) {
				// IS_INT_BETWEEN( offset, 0, 0x2000 )
				this.mainboard.cart.memoryMapper.write8ChrRom(offset & 0x1FFF, data);
			} else {
				// IS_INT_BETWEEN( offset, 0x2000, 0x4000 )
				if ((offset & 0x3F00) === 0x3F00) {
					// IS_INT_BETWEEN( offset, 0x3F00, 0x4000 )
					// image and sprite palettes (both mirror each other)
					var paletteOffset = offset & 0xF;
					var targetPalette = (offset & 0x10) >> 4; // whether its a sprite or background palette
					var newColour = data & 0x3F;

					this.paletteTables[targetPalette][paletteOffset] = newColour;
					if ((paletteOffset & 0x3) === 0) {
						var otherPalette = targetPalette === 1 ? 0 : 1;
						this.paletteTables[otherPalette][paletteOffset] = newColour;
					}
				} else {
					// IS_INT_BETWEEN( offset, 0x2000, 0x3F00 )
					// name tables
					var pageid = (offset & 0xC00) >> 10;
					if (this.mainboard.cart.memoryMapper.nameTableWrite) {
						this.mainboard.cart.memoryMapper.nameTableWrite(this.nameTables, pageid, offset & 0x3FF, data);
					} else {
						var pagepos = this.nameTablesMap[pageid];
						this.nameTables[pagepos][offset & 0x3FF] = data;
					}
				}
			}
		}
	}, {
		key: 'read8',
		value: function read8(offset, renderingSprites, readType) {

			var pageid = 0;
			var pagepos = 0;
			var paletteOffset = 0;
			var targetPalette = 0;

			if ((offset & 0x2000) === 0) {
				// IS_INT_BETWEEN( offset, 0, 0x2000 )
				// pattern tables
				return this.mainboard.cart.memoryMapper.read8ChrRom(offset & 0x1FFF, renderingSprites, readType) | 0;
			} else {
				if ((offset & 0x3F00) === 0x3F00) {
					// IS_INT_BETWEEN( offset, 0x3F00, 0x4000 )
					// palettes
					paletteOffset = offset & 0xF;
					targetPalette = (offset & 0x10) >> 4;
					return this.paletteTables[targetPalette][paletteOffset] | 0;
				} else {
					// IS_INT_BETWEEN( offset, 0x2000, 0x3F00 )
					// name tables
					pageid = (offset & 0xC00) >> 10;
					if (this._useMapperNameTableRead) {
						return this.mainboard.cart.memoryMapper.nameTableRead(this.nameTables, pageid, offset & 0x3FF) | 0;
					} else {
						pagepos = this.nameTablesMap[pageid];
						return this.nameTables[pagepos][offset & 0x3FF] | 0;
					}
				}
			}
		}
	}, {
		key: 'synchronise',
		value: function synchronise(startTicks, endTicks) {

			if (this.isRenderingEnabled()) {
				this._ppuRenderSprites.renderTo(startTicks, endTicks);
				this.ppuReadAddress = this._ppuRenderBg.renderTo(startTicks, endTicks, this.ppuReadAddress, this.ppuLatchAddress);
			}
		}
	}, {
		key: 'onEndFrame',
		value: function onEndFrame() {

			// start vblank period
			if (!this.suppressVblank) {
				this.status |= 0x80; // set vblank
			}

			if (this.forceNmi || !this.suppressNmi && (this.control1 & 0x80) > 0) {
				(0, _Trace.writeLine)(_Trace.trace_ppu, 'this.mainboard.cpu.nonMaskableInterrupt: ' + (_consts.COLOUR_ENCODING_FRAME_MTC + _consts.MASTER_CYCLES_PER_PPU));
				this.mainboard.cpu.nonMaskableInterrupt(_consts.COLOUR_ENCODING_FRAME_MTC + _consts.MASTER_CYCLES_PER_PPU);
			}

			this.suppressNmi = false;
			this.suppressVblank = false;
			this.forceNmi = false;
			this.isOddFrame = !this.isOddFrame;
			this.frameCounter++;
			this._ppuRenderBg.onEndFrame();
			this._ppuRenderSprites.onEndFrame();

			if (_consts.TRACE_ENABLED) {
				(0, _Trace.writeLine)(_Trace.trace_ppu, '[' + this.frameCounter + '] Frame finished');
			}
		}

		////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

	}, {
		key: 'getBackgroundPaletteIndex',
		value: function getBackgroundPaletteIndex() {
			return this.paletteTables[0][0] | 0;
		}
	}, {
		key: 'readNameTable',
		value: function readNameTable(address, readType) {
			var pageid = address >> 10 & 3;
			if (this._useMapperNameTableRead) {
				return this.mainboard.cart.memoryMapper.nameTableRead(this.nameTables, pageid, address & 0x3FF, readType) | 0;
			} else {
				var pagepos = this.nameTablesMap[pageid];
				return this.nameTables[pagepos][address & 0x3FF] | 0;
			}
		}
	}, {
		key: 'formatStatusString',
		value: function formatStatusString() {

			var pos = this.ticksToScreenCoordinates();
			var str = "";
			str += "CYC:" + ZERO_PAD(pos.x, 3, ' ') + " SL:" + pos.y + " F:" + this.frameCounter;
			str += " S:" + ZERO_PAD_HEX(this.status, 2) + " C1:" + ZERO_PAD_HEX(this.control1, 2) + " C2:" + ZERO_PAD_HEX(this.control2, 2);
			return str;
		}
	}, {
		key: 'saveState',
		value: function saveState() {

			var data = {};
			data.mirroringMethod = this.mirroringMethod;
			data.isOddFrame = this.isOddFrame;
			data.suppressNmi = this.suppressNmi;
			data.suppressVblank = this.suppressVblank;
			data.forceNmi = this.forceNmi;

			data.control1 = this.control1;
			data.control2 = this.control2;
			data.status = this.status;

			data.bufferedppuread = this.bufferedppuread;
			data.ppuReadAddress = this.ppuReadAddress;
			data.ppuLatchAddress = this.ppuLatchAddress;

			data.spriteaddress = this.spriteaddress;
			data.ppuSecondAddressWrite = this.ppuSecondAddressWrite;

			data.fineX = this.fineX;

			data.lastTransferredValue = this.lastTransferredValue;
			data.frameCounter = this.frameCounter;
			data._invokeA12Latch = this._invokeA12Latch;

			data.doSpriteTransferAfterNextCpuInstruction = this.doSpriteTransferAfterNextCpuInstruction;
			data.spriteTransferArgument = this.spriteTransferArgument;

			data.spriteMemory = (0, _serialisation.uintArrayToString)(this.spriteMemory);
			data.nameTables = [];
			for (var i = 0; i < this.nameTables.length; ++i) {
				data.nameTables.push((0, _serialisation.uintArrayToString)(this.nameTables[i]));
			}
			data.paletteTables = [];
			for (var i = 0; i < this.paletteTables.length; ++i) {
				data.paletteTables.push((0, _serialisation.uintArrayToString)(this.paletteTables[i]));
			}
			data.nameTablesMap = (0, _serialisation.uintArrayToString)(this.nameTablesMap);

			this._ppuRenderBg.saveState(data);
			this._ppuRenderSprites.saveState(data);
			return data;
		}
	}, {
		key: 'loadState',
		value: function loadState(state) {
			this.mirroringMethod = state.mirroringMethod;
			this.isOddFrame = state.isOddFrame;
			this.suppressNmi = state.suppressNmi;
			this.suppressVblank = state.suppressVblank;
			this.forceNmi = state.forceNmi;

			this.control1 = state.control1;
			this.control2 = state.control2;
			this.status = state.status;

			this.bufferedppuread = state.bufferedppuread;
			this.ppuReadAddress = state.ppuReadAddress;
			this.ppuLatchAddress = state.ppuLatchAddress;

			this.spriteaddress = state.spriteaddress;
			this.ppuSecondAddressWrite = state.ppuSecondAddressWrite;

			this.fineX = state.fineX;

			this.lastTransferredValue = state.lastTransferredValue;
			this.frameCounter = state.frameCounter;

			this.doSpriteTransferAfterNextCpuInstruction = state.doSpriteTransferAfterNextCpuInstruction;
			this.spriteTransferArgument = state.spriteTransferArgument;
			this._invokeA12Latch = state._invokeA12Latch;

			this.spriteMemory = (0, _serialisation.stringToUintArray)(state.spriteMemory);
			this.nameTables = [];
			for (var i = 0; i < state.nameTables.length; ++i) {
				this.nameTables.push((0, _serialisation.stringToUintArray)(state.nameTables[i]));
			}
			this.paletteTables = [];
			for (var i = 0; i < state.paletteTables.length; ++i) {
				this.paletteTables.push((0, _serialisation.stringToUintArray)(state.paletteTables[i]));
			}
			this.nameTablesMap = (0, _serialisation.stringToUintArray)(state.nameTablesMap);

			this._ppuRenderBg.loadState(state);
			this._ppuRenderSprites.loadState(state);
		}
	}]);

	return PPU;
}();

PPU.screenPos = {
	x: 0,
	y: 0
};
exports.default = PPU;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Event = __webpack_require__(4);

var _consts = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SyncEvent = function SyncEvent(name, tickCount, callback) {
	_classCallCheck(this, SyncEvent);

	this.name = name;
	this.tickCount = tickCount;
	this.callback = callback;
};

var Synchroniser = function () {
	function Synchroniser(mainboard) {
		_classCallCheck(this, Synchroniser);

		this.mainboard = mainboard;
		this.mainboard.connect('reset', this.reset.bind(this));
		this.cpu = mainboard.cpu;
		this.cpuMtc = 0;
		this._lastSynchronisedMtc = 0;
		this._isSynchronising = false;
		this._newEventInserted = false;
		this._eventBus = new _Event.EventBus();
		this._cpuMTCatEndOfInstruction = new Int32Array(8); // Array of ppu MTC counts which the last X instructions have ended on.
		this._cpuMTCatEndOfInstructionIndex = 0; // This is for determining if an NMI trigger should delay by an instruction or not.

		this._events = [];
		this._objects = [];
	}

	_createClass(Synchroniser, [{
		key: 'reset',
		value: function reset(cold) {
			this.cpuMtc = 0;
			this._lastSynchronisedMtc = 0;
			this._cpuMTCatEndOfInstructionIndex = 0;
			this._isSynchronising = false;
			this._newEventInserted = false;
		}
	}, {
		key: 'connect',
		value: function connect(name, callback) {
			this._eventBus.connect(name, callback);
		}
	}, {
		key: 'changeEventTime',
		value: function changeEventTime(eventId, tickCount) {

			var obj = this._getEvent(eventId);
			obj.tickCount = tickCount;
			this._executeCallbackIfSynchronising(obj);
			this._newEventInserted = true;
		}
	}, {
		key: '_removeEvent',
		value: function _removeEvent(name) {

			for (var i = 0; i < this._events.length; ++i) {
				var ev = this._events[i];
				if (ev.name === name) {
					return this._events.splice(i, 1)[0];
				}
			}
			return null;
		}
	}, {
		key: '_getEvent',
		value: function _getEvent(eventId) {

			return this._events[eventId];
		}
	}, {
		key: 'addEvent',
		value: function addEvent(name, tickCount, callback) {

			this._removeEvent(name);
			var obj = new SyncEvent(name, tickCount, callback);
			this._executeCallbackIfSynchronising(obj);
			this._events.push(obj);
			this._newEventInserted = true;
			return this._events.length - 1;
		}
	}, {
		key: '_executeCallbackIfSynchronising',
		value: function _executeCallbackIfSynchronising(event) {
			if (this._isSynchronising && event.tickCount >= 0) {
				// if a new event has been added during synchronisation, execute it immediately if it is due
				if (this._lastSynchronisedMtc < event.tickCount && this._currentSyncValue >= event.tickCount) {
					event.callback(event.tickCount);
				}
			}
		}
	}, {
		key: 'addObject',
		value: function addObject(name, obj) {

			this._objects.push({ name: name, object: obj, lastSynchronisedTickCount: 0 });
		}
	}, {
		key: 'synchronise',
		value: function synchronise() {

			var frameEnd = _consts.COLOUR_ENCODING_FRAME_MTC;

			if (this._isSynchronising) {
				//debugger;
				throw new Error("Cannot call synchronise synchronisation phase");
			}

			var syncTo = this.getCpuMTC();

			// work out when the next scheduled event is to occur. Then synchronise all objects to that event, then execute the event.
			// Then move onto the next one.
			var objIndex = 0;
			var keepRunning = true;
			while (keepRunning) {
				var nextEventTime = this.getNextEventTime();
				if (nextEventTime <= syncTo && nextEventTime < frameEnd) {
					syncTo = nextEventTime;
				} else {
					keepRunning = false; // no more events until requested syncTo value: we can finish the sync loop
					syncTo = Math.min(syncTo, frameEnd);
				}

				if (this._lastSynchronisedMtc >= syncTo) {
					return;
				}

				this._isSynchronising = true;
				this._currentSyncValue = syncTo;

				for (objIndex = 0; objIndex < this._objects.length; ++objIndex) {
					// TODO: Objects should be forbidden from calling synchroniser.synchronise() whilst in the synchronise phase - if they
					// want to force a synchronise they should do so using an event
					var obj = this._objects[objIndex];
					if (obj.lastSynchronisedTickCount < syncTo) {
						obj.object.synchronise(obj.lastSynchronisedTickCount, syncTo);
						obj.lastSynchronisedTickCount = syncTo;
					}
				}
				this._isSynchronising = false;

				this._executeEvents(this._lastSynchronisedMtc, syncTo);
				this._lastSynchronisedMtc = syncTo;

				// TODO: this should be an event: do end frame stuff if that time has come
				if (syncTo >= frameEnd) {
					for (objIndex = 0; objIndex < this._objects.length; ++objIndex) {
						this._objects[objIndex].object.onEndFrame(syncTo);
						this._objects[objIndex].lastSynchronisedTickCount = 0;
					}

					this.cpuMtc -= frameEnd;
					this._lastSynchronisedMtc = 0;
					this._eventBus.invoke('frameEnd');
				}
			}
		}
	}, {
		key: 'getNextEventTime',
		value: function getNextEventTime(currentTime) {

			var frameEnd = _consts.COLOUR_ENCODING_FRAME_MTC;
			currentTime = currentTime || this._lastSynchronisedMtc;
			var closestObj = null;
			for (var eventIndex = 0; eventIndex < this._events.length; ++eventIndex) {
				var ev = this._events[eventIndex];
				if (ev.tickCount >= 0 && ev.tickCount > currentTime) {
					if (closestObj === null || ev.tickCount < closestObj.tickCount) {
						closestObj = ev;
					}
				}
			}
			return closestObj !== null ? closestObj.tickCount : frameEnd;
		}
	}, {
		key: '_executeEvents',
		value: function _executeEvents(startTime, endTime) {

			for (var eventIndex = 0; eventIndex < this._events.length; ++eventIndex) {
				var ev = this._events[eventIndex];
				if (ev.tickCount >= 0 && ev.tickCount > startTime && ev.tickCount <= endTime) {
					ev.callback(ev.tickCount);
				}
			}
		}
	}, {
		key: 'runCycle',
		value: function runCycle() {

			var nextEventTime = this.getNextEventTime();

			// run cpu
			while (this.cpuMtc < nextEventTime) {
				var cpuTicks = this.cpu.handlePendingInterrupts();
				if (cpuTicks === 0) {
					cpuTicks = this.cpu.execute();
				}
				this.mainboard.ppu.handleSpriteTransfer();
				this.cpuMtc += cpuTicks * _consts.COLOUR_ENCODING_MTC_PER_CPU;
				this._cpuMTCatEndOfInstruction[this._cpuMTCatEndOfInstructionIndex] = this.cpuMtc;
				this._cpuMTCatEndOfInstructionIndex = this._cpuMTCatEndOfInstructionIndex + 1 & 0x7;

				if (this._newEventInserted) {
					this._newEventInserted = false;
					nextEventTime = this.getNextEventTime();
				}
			}

			// run all other components to the cpu mtc
			this.synchronise(this.cpuMtc);
		}
	}, {
		key: 'isPpuTickOnLastCycleOfCpuInstruction',
		value: function isPpuTickOnLastCycleOfCpuInstruction(ppuCount) {

			for (var i = 0; i < this._cpuMTCatEndOfInstruction.length; ++i) {
				var cpuCount = this._cpuMTCatEndOfInstruction[i];
				if (cpuCount - _consts.COLOUR_ENCODING_MTC_PER_CPU <= ppuCount && cpuCount + _consts.MASTER_CYCLES_PER_PPU >= ppuCount) {
					return true;
				}
			}
			return false;
		}
	}, {
		key: 'advanceCpuMTC',
		value: function advanceCpuMTC(advance) {
			this.cpuMtc += advance;
		}
	}, {
		key: 'getCpuMTC',
		value: function getCpuMTC() {
			return this.cpuMtc + this.cpu.getSubCycle() * _consts.COLOUR_ENCODING_MTC_PER_CPU | 0;
		}
	}, {
		key: 'saveState',
		value: function saveState() {
			// TODO: save event data in state, maybe not necessary as save state is done on the end of a frame?
			var data = {};
			data.cpuMtc = this.cpuMtc;
			data._lastSynchronisedMtc = this._lastSynchronisedMtc;
			return data;
		}
	}, {
		key: 'loadState',
		value: function loadState(state) {
			this.cpuMtc = state.cpuMtc;
			this._lastSynchronisedMtc = state._lastSynchronisedMtc;
		}
	}]);

	return Synchroniser;
}();

exports.default = Synchroniser;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Joypad = __webpack_require__(39);

var _Joypad2 = _interopRequireDefault(_Joypad);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var InputDeviceBus = function () {
  function InputDeviceBus() {
    _classCallCheck(this, InputDeviceBus);

    this.j1 = new _Joypad2.default();
    this.j2 = new _Joypad2.default();
  }

  _createClass(InputDeviceBus, [{
    key: 'getJoypad',
    value: function getJoypad(index) {
      switch (index) {
        case 0:
          return this.j1;
        case 1:
          return this.j2;
        default:
          return null;
      }
    }
  }, {
    key: 'writeToRegister',
    value: function writeToRegister(offset, data) {
      switch (offset) {
        case 0x4016:
          this.j1.writeToRegister(offset, data);
          break;
        case 0x4017:
          this.j2.writeToRegister(offset, data);
          break;
      }
    }
  }, {
    key: 'readFromRegister',
    value: function readFromRegister(offset) {
      var ret = 0;
      switch (offset) {
        case 0x4016:
          ret = this.j1.readFromRegister(offset) | 0;
          break;
        case 0x4017:
          ret = this.j2.readFromRegister(offset) | 0;
          break;
      }
      return ret;
    }
  }]);

  return InputDeviceBus;
}();

exports.default = InputDeviceBus;

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Joypad = function () {
  function Joypad() {
    _classCallCheck(this, Joypad);

    this._currentState = 0;
    this._strobedState = 0;
    this._strobeByte = 0;
    this._readCount = 0;
  }

  _createClass(Joypad, [{
    key: "writeToRegister",
    value: function writeToRegister(offset, data) {
      var firstBit = data & 1;
      if (this._strobeByte === 1 || firstBit === 1) {
        this._strobeByte = firstBit | 0;
        this._strobedState = this._currentState;
        this._readCount = 0;
      }
    }
  }, {
    key: "readFromRegister",
    value: function readFromRegister(offset) {

      var ret = 0;
      if (this._strobeByte === 1) {
        this._strobedState = this._currentState;
        this._readCount = 0;
        ret = this._strobedState & 1 | 0;
      } else {
        ret = this._strobedState >> this._readCount & 1 | 0;
        this._readCount++;
        ret |= 0x40;
      }
      return ret | 0;
    }
  }, {
    key: "_getDuplicateMask",
    value: function _getDuplicateMask(buttonIndex) {

      // disallow pressing up+down and left+right at the same time - always keep the button that is already pressed
      switch (buttonIndex) {
        case 4:
          // UP
          return 0xDF; // ~( 0x20 );
        case 5:
          // DOWN
          return 0xEF; // ~( 0x10 );
        case 6:
          // LEFT
          return 0x7F; // ~( 0x80 );
        case 7:
          // RIGHT
          return 0xBF; // ~( 0x40 );
      }
      return 0xFF;
    }
  }, {
    key: "pressButton",
    value: function pressButton(buttonIndex, pressed) {

      if (pressed) {
        this._currentState |= 1 << buttonIndex;
        this._currentState &= this._getDuplicateMask(buttonIndex); // this prevents up+down and left+right being pressed
      } else {
        this._currentState &= 0xFF ^ 1 << buttonIndex;
      }
    }
  }, {
    key: "saveState",
    value: function saveState() {
      return {
        _currentState: this._currentState,
        _strobedState: this._strobedState,
        _strobeByte: this._strobeByte,
        _readCount: this._readCount
      };
    }
  }, {
    key: "loadState",
    value: function loadState(state) {
      this._currentState = state._currentState;
      this._strobedState = state._strobedState;
      this._readCount = state._readCount;
      this._strobeByte = state._strobeByte;
    }
  }]);

  return Joypad;
}();

exports.default = Joypad;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseMapper2 = __webpack_require__(2);

var _BaseMapper3 = _interopRequireDefault(_BaseMapper2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mapper0 = function (_BaseMapper) {
	_inherits(Mapper0, _BaseMapper);

	function Mapper0() {
		_classCallCheck(this, Mapper0);

		return _possibleConstructorReturn(this, (Mapper0.__proto__ || Object.getPrototypeOf(Mapper0)).apply(this, arguments));
	}

	_createClass(Mapper0, [{
		key: 'reset',
		value: function reset() {
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
	}]);

	return Mapper0;
}(_BaseMapper3.default);

exports.default = Mapper0;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseMapper2 = __webpack_require__(2);

var _BaseMapper3 = _interopRequireDefault(_BaseMapper2);

var _consts = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mapper1 = function (_BaseMapper) {
  _inherits(Mapper1, _BaseMapper);

  function Mapper1(mainboard, mirroringMethod) {
    _classCallCheck(this, Mapper1);

    var _this = _possibleConstructorReturn(this, (Mapper1.__proto__ || Object.getPrototypeOf(Mapper1)).call(this, mainboard, mirroringMethod));

    _this.registers = new Int32Array(4); // size 4
    _this.registers[0] = 0x0C;
    _this.registers[1] = _this.registers[2] = _this.registers[3] = 0;

    // below might be needed here, not sure -prater
    // this.val = 0;
    // this.count = 0;
    // this.lastWriteMTC = -1;
    //
    // this.wRamEnabled = true;
    // this.soromlatch = false;
    //
    return _this;
  }

  _createClass(Mapper1, [{
    key: 'mapperSaveState',
    value: function mapperSaveState(state) {
      state.val = this.val;
      state.count = this.count;
      state.lastWriteMTC = this.lastWriteMTC;
      state.registers = Nes.uintArrayToString(this.registers);
      state.wRamEnabled = this.wRamEnabled;
      state.soromlatch = this.soromlatch;
    }
  }, {
    key: 'mapperLoadState',
    value: function mapperLoadState(state) {
      this.val = state.val;
      this.count = state.count;
      this.lastWriteMTC = state.lastWriteMTC;
      this.registers = Nes.stringToUintArray(state.registers);
      this.wRamEnabled = state.wRamEnabled;
      this.soromlatch = state.soromlatch;
    }
  }, {
    key: 'onEndFrame',
    value: function onEndFrame() {
      this.lastWriteMTC = -1;
    }
  }, {
    key: 'reset',
    value: function reset() {
      this.switch16kPrgBank(0, true);
      this.switch16kPrgBank(this.get16kPrgBankCount() - 1, false);

      if (this.get8kChrBankCount() === 0) {
        this.useVRAM();
      } else {
        this.switch8kChrBank(0);
      }

      this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod);
    }
  }, {
    key: 'syncChrMirrors',
    value: function syncChrMirrors() {
      if ((this.registers[0] & 0x10) > 0) {
        this.switch4kChrBank(this.registers[1] & 0x1F, true);
        this.switch4kChrBank(this.registers[2] & 0x1F, false);
      } else {
        this.switch8kChrBank((this.registers[1] & 0x1F) >> 1);
      }
    }
  }, {
    key: 'syncPrgMirrors',
    value: function syncPrgMirrors() {
      var offset = this.soromlatch ? 16 : 0; //if more than 256k ROM AND SOROM latch is on
      var reg = this.registers[3];
      if ((this.registers[0] & 0x8) > 0) {
        // 16k / 32k prg switch
        if ((this.registers[0] & 0x4) > 0) {
          // high/low prg switch
          var last = Math.min(this.get16kPrgBankCount() - 1, 15); // this.get16kPrgBankCount() - 1;
          this.switch16kPrgBank(reg + offset, true);
          this.switch16kPrgBank(last + offset, false);
        } else {
          this.switch16kPrgBank(0 + offset, true);
          this.switch16kPrgBank(reg + offset, false);
        }
      } else {
        this.switch32kPrgBank((reg >> 1) + (this.soromlatch ? 8 : 0));
      }
    }
  }, {
    key: 'write8PrgRom',
    value: function write8PrgRom(offset, data) {
      // To get Bill&Ted to work, we need to ignore calls that are less than 2 cpu calls from each other.
      // see http://wiki.nesdev.com/w/index.php/INES_Mapper_001
      var currTime = this.mainboard.synchroniser.getCpuMTC();
      var minTime = this.lastWriteMTC + _consts.COLOUR_ENCODING_MTC_PER_CPU * 2;
      var valid = this.lastWriteMTC >= 0;
      this.lastWriteMTC = currTime;
      if (valid && minTime >= currTime) {
        return;
      }

      if ((data & 0x80) > 0) {
        this.val = 0;
        this.count = 0;
        this.registers[0] |= 0x0C;
        //this.syncChrMirrors();
        //this.syncPrgMirrors();
        return;
      }

      this.val |= (data & 0x01) << this.count;
      this.count = this.count + 1;

      if (this.count >= 5) {
        this.mainboard.synchroniser.synchronise();
        var top3Bits = offset & 0xE000;
        switch (top3Bits) {
          case 0x8000:
            // IS_INT_BETWEEN( offset, 0x8000, 0xA000 )
            this.registers[0] = this.val & 0x1F;

            // bit 0 - Horizontal / vertical mirror switch
            var mirroringMethod;
            switch (this.val & 0x3) {
              case 0:
                mirroringMethod = PPU_MIRRORING_SINGLESCREEN_NT0;
                break;
              case 1:
                mirroringMethod = PPU_MIRRORING_SINGLESCREEN_NT1;
                break;
              case 2:
                mirroringMethod = _consts.PPU_MIRRORING_VERTICAL;
                break;
              case 3:
                mirroringMethod = PPU_MIRRORING_HORIZONTAL;
                break;
            }

            this.mainboard.ppu.changeMirroringMethod(mirroringMethod);
            break;
          case 0xA000:
            this.registers[1] = this.val & 0x1F;
            //SOROM boards use the high bit of CHR to switch between 1st and last
            //256k of the PRG ROM
            if (this.get16kPrgBankCount() > 16) {
              this.soromlatch = (this.val & 0x10) > 0;
              this.syncPrgMirrors();
            }
            break;
          case 0xC000:
            this.registers[2] = this.val & 0x1F;
            if (this.get16kPrgBankCount() > 16) {
              this.registers[2] &= 0xF;
            }
            break;
          case 0xE000:
            this.registers[3] = this.val & 0xF;
            this.wRamEnabled = (this.val & 0x10) === 0;
            break;
        }

        this.syncChrMirrors();
        this.syncPrgMirrors();

        this.count = 0;
        this.val = 0;
      }
    }
  }]);

  return Mapper1;
}(_BaseMapper3.default);

exports.default = Mapper1;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseMapper2 = __webpack_require__(2);

var _BaseMapper3 = _interopRequireDefault(_BaseMapper2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mapper2 = function (_BaseMapper) {
	_inherits(Mapper2, _BaseMapper);

	function Mapper2() {
		_classCallCheck(this, Mapper2);

		return _possibleConstructorReturn(this, (Mapper2.__proto__ || Object.getPrototypeOf(Mapper2)).apply(this, arguments));
	}

	_createClass(Mapper2, [{
		key: 'reset',
		value: function reset() {
			this.switch16kPrgBank(0, true);
			this.switch16kPrgBank(this.get16kPrgBankCount() - 1, false);
			this.useVRAM();
			this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod);
		}
	}, {
		key: 'write8PrgRom',
		value: function write8PrgRom(offset, data) {
			//	this.mainboard.synchroniser.synchronise();
			this.switch16kPrgBank(data, true);
		}
	}]);

	return Mapper2;
}(_BaseMapper3.default);

exports.default = Mapper2;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseMapper2 = __webpack_require__(2);

var _BaseMapper3 = _interopRequireDefault(_BaseMapper2);

var _consts = __webpack_require__(0);

var _serialisation = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mapper4 = function (_BaseMapper) {
	_inherits(Mapper4, _BaseMapper);

	function Mapper4() {
		_classCallCheck(this, Mapper4);

		return _possibleConstructorReturn(this, (Mapper4.__proto__ || Object.getPrototypeOf(Mapper4)).apply(this, arguments));
	}

	_createClass(Mapper4, [{
		key: 'init',
		value: function init() {
			this.bankSwapByte = 0;
			this.prgRamDisableWrite = false;
			this.chipEnable = this.interruptsEnabled = true;
			this.irqCounter = this.irqLatch = 0;
			this.mReloadFlag = false;
			this._isMMC6 = false;
			this._mmc6PrgRamWriteByte = 0;

			this.lastA12Raise = 0;
			this.mSpriteAddress = this.mScreenAddress = false;
			this.mRenderingEnabled = false;

			this.banks = new Int32Array(8);
			this.banks[0] = 0;
			this.banks[1] = 2;
			this.banks[2] = 4;
			this.banks[3] = 5;
			this.banks[4] = 6;
			this.banks[5] = 7;

			this.banks[6] = 0;
			this.banks[7] = 1;
		}
	}, {
		key: '_eventIrq',
		value: function _eventIrq() {
			// don't do anything - call to synchronise() will trigger the irq
			this.mainboard.synchroniser.changeEventTime(this._irqEventId, -1);
		}
	}, {
		key: 'mapperSaveState',
		value: function mapperSaveState(state) {
			state.bankSwapByte = this.bankSwapByte;
			state.prgRamDisableWrite = this.prgRamDisableWrite;
			state.chipEnable = this.chipEnable;
			state.interruptsEnabled = this.interruptsEnabled;
			state.irqCounter = this.irqCounter;
			state.irqLatch = this.irqLatch;
			state.mReloadFlag = this.mReloadFlag;
			state._isMMC6 = this._isMMC6;
			state._mmc6PrgRamWriteByte = this._mmc6PrgRamWriteByte;
			state.lastA12Raise = this.lastA12Raise;
			state.mSpriteAddress = this.mSpriteAddress;
			state.mScreenAddress = this.mScreenAddress;
			state.mRenderingEnabled = this.mRenderingEnabled;
			state.banks = (0, _serialisation.uintArrayToString)(this.banks);
			state._interruptInProgress = this._interruptInProgress;
		}
	}, {
		key: 'mapperLoadState',
		value: function mapperLoadState(state) {

			this.bankSwapByte = state.bankSwapByte;
			this.prgRamDisableWrite = state.prgRamDisableWrite;
			this.chipEnable = state.chipEnable;
			this.interruptsEnabled = state.interruptsEnabled;
			this.irqCounter = state.irqCounter;
			this.irqLatch = state.irqLatch;
			this.mReloadFlag = state.mReloadFlag;
			this._isMMC6 = state._isMMC6;
			this._mmc6PrgRamWriteByte = state._mmc6PrgRamWriteByte;
			this.lastA12Raise = state.lastA12Raise;
			this.mSpriteAddress = state.mSpriteAddress;
			this.mScreenAddress = state.mScreenAddress;
			this.mRenderingEnabled = state.mRenderingEnabled;
			this.banks = (0, _serialisation.stringToUintArray)(state.banks);
			this._interruptInProgress = state._interruptInProgress;
		}
	}, {
		key: 'syncBanks',
		value: function syncBanks(doPrg, doChr) {

			if (doPrg) {
				this.switch8kPrgBank(this.banks[7], 1);
				this.switch8kPrgBank(this.get8kPrgBankCount() - 1, 3);

				if ((this.bankSwapByte & 0x40) > 0) {
					this.switch8kPrgBank(this.get8kPrgBankCount() - 2, 0);
					this.switch8kPrgBank(this.banks[6], 2);
				} else {
					this.switch8kPrgBank(this.banks[6], 0);
					this.switch8kPrgBank(this.get8kPrgBankCount() - 2, 2);
				}
			}
			/*
   		   0: Select 2 KB CHR bank at PPU $0000-$07FF (or $1000-$17FF);
   		   1: Select 2 KB CHR bank at PPU $0800-$0FFF (or $1800-$1FFF);
   		   2: Select 1 KB CHR bank at PPU $1000-$13FF (or $0000-$03FF);
   		   3: Select 1 KB CHR bank at PPU $1400-$17FF (or $0400-$07FF);
   		   4: Select 1 KB CHR bank at PPU $1800-$1BFF (or $0800-$0BFF);
   		   5: Select 1 KB CHR bank at PPU $1C00-$1FFF (or $0C00-$0FFF);
   */
			if (doChr) {
				this.mainboard.synchroniser.synchronise();

				var bank0 = this.banks[0] & 0xFE;
				var bank1 = this.banks[1] & 0xFE;
				if ((this.bankSwapByte & 0x80) > 0) {
					this.switch1kChrBank(this.banks[2], 0);
					this.switch1kChrBank(this.banks[3], 1);
					this.switch1kChrBank(this.banks[4], 2);
					this.switch1kChrBank(this.banks[5], 3);

					this.switch1kChrBank(bank0, 4);
					this.switch1kChrBank(bank0 + 1, 5);
					this.switch1kChrBank(bank1, 6);
					this.switch1kChrBank(bank1 + 1, 7);
				} else {
					this.switch1kChrBank(bank0, 0);
					this.switch1kChrBank(bank0 + 1, 1);
					this.switch1kChrBank(bank1, 2);
					this.switch1kChrBank(bank1 + 1, 3);

					this.switch1kChrBank(this.banks[2], 4);
					this.switch1kChrBank(this.banks[3], 5);
					this.switch1kChrBank(this.banks[4], 6);
					this.switch1kChrBank(this.banks[5], 7);
				}
			}
		}
	}, {
		key: '_lookInDbForMMC6',
		value: function _lookInDbForMMC6() {

			if (this.mainboard.cart && this.mainboard.cart._dbData) {
				var db = this.mainboard.cart._dbData;
				if (db['cartridge'] && db['cartridge'][0]['board'] && db['cartridge'][0]['board'][0]) {
					var board = db['cartridge'][0]['board'][0];
					if (board['chip'] && board['chip'][0]) {
						var chip = board['chip'][0];
						if (chip['$'] && chip['$']['type']) {
							return chip['$']['type'] === "MMC6B";
						}
					}
				}
			}
			return false;
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.prgRamDisableWrite = false;
			this.chipEnable = this.interruptsEnabled = true;
			this._interruptInProgress = false;

			this._A12LowerLimit = _consts.COLOUR_ENCODING_VBLANK_SCANLINES * _consts.MASTER_CYCLES_PER_SCANLINE;
			this._A12UpperLimit = (_consts.COLOUR_ENCODING_FRAME_SCANLINES - 1) * _consts.MASTER_CYCLES_PER_SCANLINE;

			this.lastA12Raise = 0;

			this.mSpriteAddress = this.mScreenAddress = false;
			this.mRenderingEnabled = false;
			this.irqCounter = 0xFF;
			this.irqLatch = 0xFF;
			this.mReloadFlag = false;
			this.lastA12Raise = 0;
			this._isMMC6 = this._lookInDbForMMC6();
			this._mmc6PrgRamWriteByte = 0;
			this.bankSwapByte = 0;
			this.banks[0] = 0;
			this.banks[1] = 2;
			this.banks[2] = 4;
			this.banks[3] = 5;
			this.banks[4] = 6;
			this.banks[5] = 7;

			this.banks[6] = 0;
			this.banks[7] = 1;

			if (this.get1kChrBankCount() === 0) {
				this.useVRAM(8);
			}

			var that = this;
			// TODO: Need to remove this event on mapper unload
			this._irqEventId = this.mainboard.synchroniser.addEvent('mmc3 irq', -1, function () {
				that._eventIrq();
			});

			this.syncBanks(true, true);
			this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod);
		}
	}, {
		key: 'write8PrgRom',
		value: function write8PrgRom(offset, data) {

			var top3Bits = offset & 0xE000;
			switch (top3Bits) {
				case 0x8000:
					if ((offset & 0x1) === 0) {
						// even
						if (this.bankSwapByte !== data & 0xFF) {
							this.bankSwapByte = data & 0xFF;

							if (this._isMMC6) {
								var prgRamEnabled = (this.bankSwapByte & 0x20) > 0;
								if (!prgRamEnabled) {
									this._mmc6PrgRamWriteByte = 0;
								}
							}

							this.syncBanks(true, true);
						}
					} else {
						// odd
						var swapByte = this.bankSwapByte & 0x7;
						if (this.banks[swapByte] !== data & 0xFF) {
							this.banks[swapByte] = data & 0xFF;
							this.syncBanks(swapByte >= 6, swapByte <= 5);
						}
					}
					break;
				case 0xA000:
					if ((offset & 0x1) === 0) {
						// even
						var mirroringMethod = (data & 0x1) > 0 ? _consts.PPU_MIRRORING_HORIZONTAL : _consts.PPU_MIRRORING_VERTICAL;
						if (mirroringMethod !== this.mainboard.ppu.getMirroringMethod()) {
							this.mainboard.synchroniser.synchronise();
							this.mainboard.ppu.changeMirroringMethod(mirroringMethod);
						}
					} else {
						// odd
						if (this._isMMC6) {
							var prgRamEnabled = (this.bankSwapByte & 0x20) > 0;
							if (prgRamEnabled) {
								this._mmc6PrgRamWriteByte = data;
							}
						} else {
							this.prgRamDisableWrite = (data & 0x40) > 0;
							this.chipEnable = (data & 0x80) > 0;
						}
					}
					break;
				case 0xC000:
					if ((offset & 0x1) === 0) {
						// even
						if (this.irqLatch !== data) {
							this.mainboard.synchroniser.synchronise();
						}
						this.irqLatch = data;
					} else {
						// odd
						if (!this.mReloadFlag) {
							this.mainboard.synchroniser.synchronise();
						}
						this.mReloadFlag = true;
					}
					this.updateIRQTime(this.mainboard.synchroniser.getCpuMTC(), true);
					break;
				case 0xE000:
					if ((offset & 0x1) === 0) {
						// even - "Writing any value to this register will disable MMC3 interrupts AND acknowledge any pending interrupts."
						this.interruptsEnabled = false;
						if (this._interruptInProgress) {
							this.mainboard.cpu.holdIrqLineLow(false);
							this._interruptInProgress = false;
						}
						//				Log::Write( LOG_MAPPER, ( boost::format( "Interrupts disabled on mapper" ) ).str() );
					} else {
						// odd
						if (!this.interruptsEnabled) {
							this.mainboard.synchroniser.synchronise();
						}
						this.interruptsEnabled = true;
						//				Log::Write( LOG_MAPPER, ( boost::format( "Interrupts enabled on mapper" ) ).str() );
					}
					this.updateIRQTime(this.mainboard.synchroniser.getCpuMTC(), true);
					break;
			}
		}
	}, {
		key: 'decrementIrqCounter',
		value: function decrementIrqCounter(tickCount) {

			//var pos = this.mainboard.ppu.ticksToScreenCoordinates( tickCount );
			//var cpupos = this.mainboard.ppu.ticksToScreenCoordinates( this.mainboard.synchroniser.getCpuMTC() );

			this.lastA12Raise = tickCount;
			var doIrq = false;

			//console.log( "[" + this.mainboard.ppu.frameCounter + "] Doing decrement at " + pos.x + "x" + pos.y + " cpu: " + cpupos.x + "x" + cpupos.y + " : " + this.irqCounter );

			if (this.mReloadFlag) {
				doIrq = this.irqLatch === 0; // MMC3 revA behaviour
				this.irqCounter = this.irqLatch;
				this.mReloadFlag = false;
			} else if (this.irqCounter === 0) {
				this.irqCounter = this.irqLatch;
				if (this._isMMC6) {
					doIrq = false;
				} else {
					if (this.irqCounter === 0) doIrq = true;
				}
			} else {
				if (this.irqCounter > 0) this.irqCounter--;
				doIrq = this.irqCounter === 0;
			}

			if (doIrq && this.interruptsEnabled && !this._interruptInProgress) {
				//	if ( this.mainboard.ppu.frameCounter === 43 && pos.x === 260 && pos.y === 0 ) {
				//				debugger;
				//		}
				//console.log( "[" + this.mainboard.ppu.frameCounter + "]" + pos.x + "x" + pos.y + " IRQ cpu: " + cpupos.x + "x" + cpupos.y );
				this._interruptInProgress = true;
				this.mainboard.cpu.holdIrqLineLow(true);
			}
		}
	}, {
		key: 'ppuA12Latch',
		value: function ppuA12Latch() {
			this.mainboard.synchroniser.synchronise();
			var cpuMtc = this.mainboard.synchroniser.getCpuMTC();
			if (this.lastA12Raise > 0 && cpuMtc - this.lastA12Raise <= 16 * _consts.MASTER_CYCLES_PER_PPU) {
				return; // Required for Bill & Ted to work: Ignore A12 raises that are too close together
			}
			this.decrementIrqCounter(cpuMtc);
			this.updateIRQTime(cpuMtc, true);
		}
	}, {
		key: 'calculateNextA12Raise',
		value: function calculateNextA12Raise(cpuMTC) {

			// TODO: refactor this - could be more efficient
			var pixelEvent = -1;
			var firstScanline = 0;
			if (this.mRenderingEnabled) {
				if (this.mSpriteAddress && !this.mScreenAddress) {
					pixelEvent = 265; // 260
					firstScanline = 0;
				}
				// else if ( this.mSpriteAddress && this.mScreenAddress )
				// {
				// pixelEvent = 340;//324;
				// firstScanline = -1;
				// }
				else //if ( this.mScreenAddress && !this.mSpriteAddress )
					{
						pixelEvent = 9; // 324; // 9;
						firstScanline = 0; // -1;
					}
			}

			if (cpuMTC >= this._A12UpperLimit || pixelEvent < 0) {
				return -1;
			}

			var modmtc = cpuMTC % _consts.MASTER_CYCLES_PER_SCANLINE; // ticks from the start of the current scanline
			var scanlineEvent = _consts.MASTER_CYCLES_PER_PPU * pixelEvent; // ticks from the start of the scanline when IRQ is decremented

			var startMtc = cpuMTC - modmtc + scanlineEvent; // ticks till next irq decrement event

			if (startMtc <= cpuMTC) startMtc += _consts.MASTER_CYCLES_PER_SCANLINE; // if we have already passed the irq event, move onto next scanline
			if (this._A12UpperLimit <= startMtc) return -1;

			if (startMtc < this._A12LowerLimit) startMtc = this._A12LowerLimit + scanlineEvent;

			return startMtc;
		}
	}, {
		key: 'updateIRQTime',
		value: function updateIRQTime(cpuTime, doSync) {

			if (doSync) {
				this.mainboard.synchroniser.synchronise();
			}

			// tickLimit is the start of the rendering frame - only started being clocked when rendering
			var newEvent = -1;
			var nextRaise = 0;
			var scanlines = 0;
			if (this.interruptsEnabled) {
				nextRaise = this.calculateNextA12Raise(cpuTime);
				if (nextRaise === -1) {
					newEvent = -1;
				} else {
					scanlines = this.mReloadFlag ? 0 : Math.max(this.irqCounter - 1, 0);
					newEvent = nextRaise + scanlines * _consts.MASTER_CYCLES_PER_SCANLINE;
					if (newEvent > this._A12UpperLimit) {
						newEvent = -1;
					} else {
						//var pos = this.mainboard.ppu.ticksToScreenCoordinates( newEvent );
						//var cpupos = this.mainboard.ppu.ticksToScreenCoordinates( this.mainboard.synchroniser.getCpuMTC() );
						// if ( this.mainboard.ppu.frameCounter === 43 && pos.x === 260 && pos.y === 0 ) {
						// debugger;
						// }
						//console.log( "Predicting next IRQ at " + pos.x + "x" + pos.y + " cpu: " + cpupos.x + "x" + cpupos.y );
					}
				}
			}
			this.mainboard.synchroniser.changeEventTime(this._irqEventId, newEvent);
		}
	}, {
		key: 'spriteScreenEnabledUpdate',
		value: function spriteScreenEnabledUpdate(spriteAddress, screenAddress) {
			this.mSpriteAddress = spriteAddress;
			this.mScreenAddress = screenAddress;
			this.updateIRQTime(this.mainboard.synchroniser.getCpuMTC(), true);
		}
	}, {
		key: 'renderingEnabledChanged',
		value: function renderingEnabledChanged(enabled) {
			this.mRenderingEnabled = enabled;
			this.updateIRQTime(this.mainboard.synchroniser.getCpuMTC(), true);
		}
	}, {
		key: 'synchronise',
		value: function synchronise(startTicks, endTicks) {
			/*
   The heart of the MMC3. The PPU will cause A12 to rise when it fetches CHR from the right pattern table ($1xxx).
   In "normal" conditions (BG uses $0xxx, all sprites use $1xxx), this will occur 8 times per scanline (once for each sprite).
   However the BG could also be the culprit (if BG uses $1xxx and all sprites use $0xxx -- ?as seen in Armadillo?), in which case A12 will rise 34 times.
   These 42 times per scanline are key times which I call "rise points":
   BG rise points: 4, 12, 20, ... , 244, 252
   Sp rise points: 260, 268, ..., 308, 316
   BG rise points: 324, 332
   If sprites are set to $1000-1FFF and the background is set to $0000-0FFF, then A12 will change from 0 to 1 at cycle 260 of each scanline, then change from 1 to 0 at cycle 320 of each scanline.
   If sprites are set to $0000-0FFF and the background is set to $1000-1FFF, then A12 will change from 1 to 0 at cycle 256 of each scanline, then change from 0 to 1 at cycle 324 of each scanline.
   */
			// tickLimit is the start of the rendering frame - only started being clocked when rendering
			var startMtc = this.calculateNextA12Raise(startTicks + 1);
			if (startMtc >= 0) {
				for (var mtc = startMtc; mtc <= Math.min(this._A12UpperLimit, endTicks); mtc += _consts.MASTER_CYCLES_PER_SCANLINE) {
					this.decrementIrqCounter(mtc);
				}
			}
			this.updateIRQTime(endTicks, false);
		}
	}, {
		key: 'onEndFrame',
		value: function onEndFrame() {
			this.lastA12Raise = 0;
		}
	}, {
		key: 'write8SRam',
		value: function write8SRam(offset, data) {

			if (this._isMMC6) {
				if (offset >= 0x7000) {
					var mirroredOffset = offset & 0x3FF;
					var lowHalf = (mirroredOffset & 0x200) === 0;
					var offsetMask = lowHalf ? 0x30 : 0xC0; // writing requires both the write and read bits set
					if ((this._mmc6PrgRamWriteByte & offsetMask) === offsetMask) {
						_BaseMapper3.default.prototype.write8SRam.call(this, mirroredOffset, data);
					}
				}
			} else {
				if (this.chipEnable && !this.prgRamDisableWrite) {
					_BaseMapper3.default.prototype.write8SRam.call(this, offset, data);
				}
			}
		}
	}, {
		key: 'read8SRam',
		value: function read8SRam(offset) {

			if (this._isMMC6 && offset >= 0x7000) {
				if (offset >= 0x7000) {
					var mirroredOffset = offset & 0x3FF;
					var lowHalf = (mirroredOffset & 0x200) === 0;
					var offsetMask = lowHalf ? 0x20 : 0x80;
					if ((this._mmc6PrgRamWriteByte & offsetMask) > 0) {
						return _BaseMapper3.default.prototype.read8SRam.call(this, mirroredOffset);
					}
				}
			} else {
				if (this.chipEnable) {
					return _BaseMapper3.default.prototype.read8SRam.call(this, offset);
				}
			}
			return 0;
		}
	}]);

	return Mapper4;
}(_BaseMapper3.default);

exports.default = Mapper4;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseMapper2 = __webpack_require__(2);

var _BaseMapper3 = _interopRequireDefault(_BaseMapper2);

var _serialisation = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mapper5 = function (_BaseMapper) {
	_inherits(Mapper5, _BaseMapper);

	function Mapper5() {
		_classCallCheck(this, Mapper5);

		return _possibleConstructorReturn(this, (Mapper5.__proto__ || Object.getPrototypeOf(Mapper5)).apply(this, arguments));
	}

	_createClass(Mapper5, [{
		key: 'init',
		value: function init() {
			this.mRenderingEnabled = false;

			this._chrMode = 0;
			this._prgMode = 0;
			this._exRamMode = 0;
			this._prgRegisters = new Int32Array(4);
			this._nameTableFill = new Int32Array(1024);
			this._internalExRam = new Int32Array(1024);
			this._prgRam = new Int32Array(0x10000); // 64kb
			this._prgRamPage = 0;
			this._bigSpritesEnabled = false;

			this._writeProtectA = false;
			this._writeProtectB = false;
			this._currentScanline = 0;
			this._irqEnabled = false;
			this._irqActive = false;
			this._irqScanlineTrigger = 0;
			this._triggerMtc = -1;
			this._multiplier1 = 0;
			this._multiplier2 = 0;

			this._prgRamMap = new Int32Array(4); // 8k ram banks that map to 0x8000 -> 0x10000
			this._prgRamIsActive = new Int32Array(4);
			this._nameTableMap = new Int32Array(4);

			this._chrRegsA = new Int32Array(8);
			this._chrRegsB = new Int32Array(4);
			this._chrUseBMap = false;
			this._chrMapA = new Int32Array(8);
			this._chrMapB = new Int32Array(4);
			this._chrHighBits = 0;
		}
	}, {
		key: 'mapperSaveState',
		value: function mapperSaveState(state) {

			state.mRenderingEnabled = this.mRenderingEnabled;
			state._chrMode = this._chrMode;
			state._prgMode = this._prgMode;
			state._exRamMode = this._exRamMode;

			state._prgRegisters = (0, _serialisation.uintArrayToString)(this._prgRegisters);
			state._nameTableFill = (0, _serialisation.uintArrayToString)(this._nameTableFill);
			state._internalExRam = (0, _serialisation.uintArrayToString)(this._internalExRam);
			state._prgRam = (0, _serialisation.uintArrayToString)(this._prgRam);

			state._prgRamPage = this._prgRamPage;
			state._bigSpritesEnabled = this._bigSpritesEnabled;

			state._writeProtectA = this._writeProtectA;
			state._writeProtectB = this._writeProtectB;
			state._currentScanline = this._currentScanline;
			state._irqEnabled = this._irqEnabled;
			state._irqActive = this._irqActive;
			state._irqScanlineTrigger = this._irqScanlineTrigger;
			state._triggerMtc = this._triggerMtc;
			state._multiplier1 = this._multiplier1;
			state._multiplier2 = this._multiplier2;

			state._prgRamMap = (0, _serialisation.uintArrayToString)(this._prgRamMap);
			state._prgRamIsActive = (0, _serialisation.uintArrayToString)(this._prgRamIsActive);
			state._nameTableMap = (0, _serialisation.uintArrayToString)(this._nameTableMap);

			state._chrRegsA = (0, _serialisation.uintArrayToString)(this._chrRegsA);
			state._chrRegsB = (0, _serialisation.uintArrayToString)(this._chrRegsB);

			state._chrUseBMap = this._chrUseBMap;
			state._chrMapA = (0, _serialisation.uintArrayToString)(this._chrMapA);
			state._chrMapB = (0, _serialisation.uintArrayToString)(this._chrMapB);
			state._chrHighBits = this._chrHighBits;
		}
	}, {
		key: 'mapperLoadState',
		value: function mapperLoadState(state) {

			this.mRenderingEnabled = state.mRenderingEnabled;
			this._chrMode = state._chrMode;
			this._prgMode = state._prgMode;
			this._exRamMode = state._exRamMode;

			this._prgRegisters = (0, _serialisation.stringToUintArray)(state._prgRegisters);
			this._nameTableFill = (0, _serialisation.stringToUintArray)(state._nameTableFill);
			this._internalExRam = (0, _serialisation.stringToUintArray)(state._internalExRam);
			this._prgRam = (0, _serialisation.stringToUintArray)(state._prgRam);

			this._prgRamPage = state._prgRamPage;
			this._bigSpritesEnabled = state._bigSpritesEnabled;

			this._writeProtectA = state._writeProtectA;
			this._writeProtectB = state._writeProtectB;
			this._currentScanline = state._currentScanline;
			this._irqEnabled = state._irqEnabled;
			this._irqActive = state._irqActive;
			this._irqScanlineTrigger = state._irqScanlineTrigger;
			this._triggerMtc = state._triggerMtc;
			this._multiplier1 = state._multiplier1;
			this._multiplier2 = state._multiplier2;

			this._prgRamMap = (0, _serialisation.stringToUintArray)(state._prgRamMap);
			this._prgRamIsActive = (0, _serialisation.stringToUintArray)(state._prgRamIsActive);
			this._nameTableMap = (0, _serialisation.stringToUintArray)(state._nameTableMap);

			this._chrRegsA = (0, _serialisation.stringToUintArray)(state._chrRegsA);
			this._chrRegsB = (0, _serialisation.stringToUintArray)(state._chrRegsB);

			this._chrUseBMap = state._chrUseBMap;
			this._chrMapA = (0, _serialisation.stringToUintArray)(state._chrMapA);
			this._chrMapB = (0, _serialisation.stringToUintArray)(state._chrMapB);
			this._chrHighBits = state._chrHighBits;
		}
	}, {
		key: 'reset',
		value: function reset() {

			this.mRenderingEnabled = false;
			this._chrMode = 0;
			this._prgMode = 3;
			this._exRamMode = 0;
			this._chrHighBits = 0;
			this._prgRamPage = 0;
			this._writeProtectA = false;
			this._writeProtectB = false;
			this._irqEnabled = false;
			this._irqScanlineTrigger = 0;
			this._irqActive = false;
			this._multiplier1 = 0;
			this._multiplier2 = 0;
			this._currentScanline = 0;
			this._triggerMtc = -1;
			this._chrUseBMap = false;
			this._bigSpritesEnabled = false;

			for (var i = 0; i < this._prgRamMap.length; ++i) {
				this._prgRamMap[i] = 0;
				this._prgRamIsActive[i] = 0;
			}
			for (var i = 0; i < this._nameTableMap.length; ++i) {
				this._nameTableMap[i] = 0;
			}

			for (var i = 0; i < this._prgRegisters.length; ++i) {
				this._prgRegisters[i] = this.get8kPrgBankCount() - 4 + i;
			}
			for (var i = 0; i < this._chrRegsA.length; ++i) {
				this._chrRegsA[i] = 0;
			}
			for (var i = 0; i < this._chrRegsB.length; ++i) {
				this._chrRegsB[i] = 0;
			}
			for (var i = 0; i < this._chrMapA.length; ++i) {
				this._chrMapA[i] = 0;
			}
			for (var i = 0; i < this._chrMapB.length; ++i) {
				this._chrMapB[i] = 0;
			}
			this._syncPrg();
			this._syncChr();
			this.switch8kChrBank(0);

			this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod);

			// TODO: Need to remove this event on mapper unload
			var that = this;
			this._irqEventId = this.mainboard.synchroniser.addEvent('mmc5 irq', -1, function (eventTime) {
				that._irqEvent(eventTime);
			});
		}
	}, {
		key: 'renderingEnabledChanged',
		value: function renderingEnabledChanged(enabled) {
			this.mRenderingEnabled = enabled;
			this._predictIrq(this.mainboard.synchroniser.getCpuMTC());
		}
	}, {
		key: '_irqEvent',
		value: function _irqEvent(eventTime) {

			if (this.mRenderingEnabled && !this._irqActive && this._irqEnabled && this._irqScanlineTrigger > 0) {
				this._irqActive = true;
				this.mainboard.cpu.holdIrqLineLow(true);
			}
			this._predictIrq(eventTime);
		}
	}, {
		key: '_syncPrg',
		value: function _syncPrg() {

			this.mainboard.synchroniser.synchronise();

			for (var i = 0; i < this._prgRamMap.length; ++i) {
				this._prgRamMap[i] = 0;
				this._prgRamIsActive[i] = 0;
			}

			switch (this._prgMode) {
				default:
				case 0:
					// 32k bank at 0x8000
					this.switch32kPrgBank((this._prgRegisters[3] & 0x7f) >> 2);
					break;
				case 1:
					// 16k bank at 0x8000
					if ((this._prgRegisters[1] & 0x80) === 0) {
						this._prgRamIsActive[0] = 1;
						this._prgRamIsActive[1] = 1;
						this._prgRamMap[0] = ((this._prgRegisters[1] & 0xE) >> 1) * 2;
						this._prgRamMap[1] = this._prgRamMap[0] + 1;
					} else {
						this.switch16kPrgBank((this._prgRegisters[1] & 0x7f) >> 1, true);
					}
					// 16k bank at 0xC000
					this.switch16kPrgBank((this._prgRegisters[3] & 0x7f) >> 1, false);
					break;
				case 2:
					// 8k bank at 0xE000
					this.switch8kPrgBank(this._prgRegisters[3] & 0x7f, 3);

					// 8k bank at 0xC000
					if ((this._prgRegisters[2] & 0x80) === 0) {
						this._prgRamIsActive[2] = 1;
						this._prgRamMap[2] = this._prgRegisters[2] & 0x7;
					} else {
						this.switch8kPrgBank(this._prgRegisters[2] & 0x7f, 2);
					}

					// 16k bank at 0x8000
					if ((this._prgRegisters[1] & 0x80) === 0) {
						this._prgRamIsActive[0] = 1;
						this._prgRamIsActive[1] = 1;
						this._prgRamMap[0] = ((this._prgRegisters[1] & 0xE) >> 1) * 2;
						this._prgRamMap[1] = this._prgRamMap[0] + 1;
					} else {
						this.switch16kPrgBank((this._prgRegisters[1] & 0x7f) >> 1, true);
					}
					break;
				case 3:
					// 8k bank at 0xE000
					this.switch8kPrgBank(this._prgRegisters[3] & 0x7f, 3);
					// 8k bank at 0xC000
					if ((this._prgRegisters[2] & 0x80) === 0) {
						this._prgRamIsActive[2] = 1;
						this._prgRamMap[2] = this._prgRegisters[2] & 0x7;
					} else {
						this.switch8kPrgBank(this._prgRegisters[2] & 0x7f, 2);
					}
					// 8k bank at 0xA000
					if ((this._prgRegisters[1] & 0x80) === 0) {
						this._prgRamIsActive[1] = 1;
						this._prgRamMap[1] = this._prgRegisters[1] & 0x7;
					} else {
						this.switch8kPrgBank(this._prgRegisters[1] & 0x7f, 1);
					}
					// 8k bank at 0x8000
					if ((this._prgRegisters[0] & 0x80) === 0) {
						this._prgRamIsActive[0] = 1;
						this._prgRamMap[0] = this._prgRegisters[0] & 0x7;
					} else {
						this.switch8kPrgBank(this._prgRegisters[0] & 0x7f, 0);
					}
					break;
			}
		}
	}, {
		key: '_chrBank',
		value: function _chrBank(chrMap, banksize, bankpos, banknum) {

			for (var i = 0; i < banksize; ++i) {
				chrMap[i + bankpos] = (banknum + i) % this.get1kChrBankCount();
			}
		}
	}, {
		key: '_syncChr',
		value: function _syncChr() {

			this.mainboard.synchroniser.synchronise();

			switch (this._chrMode) {
				default:
				case 0:
					this._chrBank(this._chrMapA, 8, 0, this._chrRegsA[7]);
					this._chrBank(this._chrMapB, 4, 0, this._chrRegsB[3]);
					break;
				case 1:
					this._chrBank(this._chrMapA, 4, 0, this._chrRegsA[3]);
					this._chrBank(this._chrMapA, 4, 4, this._chrRegsA[7]);
					this._chrBank(this._chrMapB, 4, 0, this._chrRegsB[3]);
					break;
				case 2:
					this._chrBank(this._chrMapA, 2, 0, this._chrRegsA[1]);
					this._chrBank(this._chrMapA, 2, 2, this._chrRegsA[3]);
					this._chrBank(this._chrMapA, 2, 4, this._chrRegsA[5]);
					this._chrBank(this._chrMapA, 2, 6, this._chrRegsA[7]);
					this._chrBank(this._chrMapB, 2, 0, this._chrRegsB[1]);
					this._chrBank(this._chrMapB, 2, 2, this._chrRegsB[3]);
					break;
				case 3:
					for (var i = 0; i < 8; ++i) {
						this._chrBank(this._chrMapA, 1, i, this._chrRegsA[i]);
					}
					for (var i = 0; i < 4; ++i) {
						this._chrBank(this._chrMapB, 1, i, this._chrRegsB[i]);
					}
					break;
			}
		}
	}, {
		key: 'write8PrgRom',
		value: function write8PrgRom(offset, data) {
			if (this._writeProtectA && this._writeProtectB) {
				var top3Bits = (offset & 0xE000) >> 13;
				if (this._prgRamIsActive[top3Bits] === 1) {
					this._prgRam[this._prgRamMap[top3Bits] << 13 | offset & 0x1FFF] = data;
				} else {
					_BaseMapper3.default.prototype.write8PrgRom.call(this, offset, data);
				}
			}
		}
	}, {
		key: 'read8PrgRom',
		value: function read8PrgRom(offset) {
			var top3Bits = (offset & 0xE000) >> 13;
			if (this._prgRamIsActive[top3Bits] === 1) {
				return this._prgRam[this._prgRamMap[top3Bits] << 13 | offset & 0x1FFF]; // this._prgRamMap[0] * 0x2000 + ( offset % 0x2000 ) ];
			}
			return _BaseMapper3.default.prototype.read8PrgRom.call(this, offset);
		}
	}, {
		key: 'onEndFrame',
		value: function onEndFrame() {
			this._predictIrq(0);
		}
	}, {
		key: '_predictIrq',
		value: function _predictIrq(cpuMTC) {

			// TODO: Check if MMC5 counter includes pre-render scanline
			if (this.mRenderingEnabled && !this._irqActive && this._irqEnabled && this._irqScanlineTrigger > 0) {
				var targetScanline = this._irqScanlineTrigger;
				var triggerMtc = this.mainboard.ppu.screenCoordinatesToTicks(0, targetScanline);
				if (triggerMtc > cpuMTC) {
					if (this._triggerMtc !== triggerMtc) {
						//var pos = this.mainboard.ppu.ticksToScreenCoordinates( triggerMtc );
						this.mainboard.synchroniser.changeEventTime(this._irqEventId, triggerMtc);
						this._triggerMtc = triggerMtc;
					}
				}
				return;
			}

			if (this._triggerMtc !== -1) {
				this._triggerMtc = -1;
				this.mainboard.synchroniser.changeEventTime(this._irqEventId, -1);
			}
		}
	}, {
		key: 'write8EXRam',
		value: function write8EXRam(offset, data) {
			// 0x4018 -> 0x6000
			switch (offset) {
				case 0x5100:
					// PRG mode
					this._prgMode = data & 0x3;
					this._syncPrg();
					break;
				case 0x5101:
					// CHR mode
					this._chrMode = data & 0x3;
					this._syncChr();
					break;
				case 0x5102:
					// PRG RAM write protect 1
					this._writeProtectA = (data & 0x3) === 0x2;
					break;
				case 0x5103:
					// PRG RAM write protect 2
					this._writeProtectB = (data & 0x3) === 0x1;
					break;
				case 0x5104:
					// extended RAM mode
					this.mainboard.synchroniser.synchronise();
					this._exRamMode = data & 0x3;
					break;
				case 0x5105:
					// nametable mode
					this.mainboard.synchroniser.synchronise();
					this._setNametableMirroring(data);
					break;
				case 0x5106:
					// fill mode tile number
					this.mainboard.synchroniser.synchronise();
					for (var i = 0; i < 32 * 30; ++i) {
						this._nameTableFill[i] = data;
					}
					break;
				case 0x5107:
					// fill mode colour
					this.mainboard.synchroniser.synchronise();
					var attribute = data & 0x3 + (data & 3) << 2 + (data & 3) << 4 + (data & 3) << 6;
					for (var i = 32 * 30; i < this._nameTableFill.length; ++i) {
						this._nameTableFill[i] = attribute;
					}
					break;
				case 0x5113:
					// prg ram bank
					this._prgRamPage = data & 0x7;
					break;
				case 0x5114:
					// prg bank 0
					this._prgRegisters[0] = data;
					this._syncPrg();
					break;
				case 0x5115:
					// prg bank 1
					this._prgRegisters[1] = data;
					this._syncPrg();
					break;
				case 0x5116:
					// prg bank 2
					this._prgRegisters[2] = data;
					this._syncPrg();
					break;
				case 0x5117:
					// prg bank 3
					this._prgRegisters[3] = data;
					this._syncPrg();
					break;
				case 0x5120:
					// chr registers A
					this._chrRegsA[0] = data | this._chrHighBits;
					this._chrUseBMap = false;
					this._syncChr();
					break;
				case 0x5121:
					this._chrRegsA[1] = data | this._chrHighBits;
					this._chrUseBMap = false;
					this._syncChr();
					break;
				case 0x5122:
					this._chrRegsA[2] = data | this._chrHighBits;
					this._chrUseBMap = false;
					this._syncChr();
					break;
				case 0x5123:
					this._chrRegsA[3] = data | this._chrHighBits;
					this._chrUseBMap = false;
					this._syncChr();
					break;
				case 0x5124:
					this._chrRegsA[4] = data | this._chrHighBits;
					this._chrUseBMap = false;
					this._syncChr();
					break;
				case 0x5125:
					this._chrRegsA[5] = data | this._chrHighBits;
					this._chrUseBMap = false;
					this._syncChr();
					break;
				case 0x5126:
					this._chrRegsA[6] = data | this._chrHighBits;
					this._chrUseBMap = false;
					this._syncChr();
					break;
				case 0x5127:
					this._chrRegsA[7] = data | this._chrHighBits;
					this._chrUseBMap = false;
					this._syncChr();
					break;
				case 0x5128:
					// Chr registers B
					this._chrRegsB[0] = data | this._chrHighBits;
					this._chrUseBMap = true;
					this._syncChr();
					break;
				case 0x5129:
					this._chrRegsB[1] = data | this._chrHighBits;
					this._chrUseBMap = true;
					this._syncChr();
					break;
				case 0x512A:
					this._chrRegsB[2] = data | this._chrHighBits;
					this._chrUseBMap = true;
					this._syncChr();
					break;
				case 0x512B:
					this._chrRegsB[3] = data | this._chrHighBits;
					this._chrUseBMap = true;
					this._syncChr();
					break;
				case 0x5130:
					// CHR bank high bits
					this.mainboard.synchroniser.synchronise();
					this._chrHighBits = (data & 0x3) << 8;
					break;
				case 0x5200:
					// vertical split mode
					// dont bother with vertical mode as it was only used once in commercial games, for the intro sequence
					break;
				case 0x5201:
					// vertical split scroll
					break;
				case 0x5202:
					// vertical split chr page
					break;
				case 0x5203:
					// irq scanline number trigger
					this.mainboard.synchroniser.synchronise();
					this._irqScanlineTrigger = data;
					this._predictIrq(this.mainboard.synchroniser.getCpuMTC());
					break;
				case 0x5204:
					// irq enable (different behaviour on read)
					this.mainboard.synchroniser.synchronise();
					this._irqEnabled = (data & 0x80) > 0;
					this._predictIrq(this.mainboard.synchroniser.getCpuMTC());
					break;
				case 0x5205:
					//  Writes specify the eight-bit multiplicand; reads return the lower eight bits of the product
					this._multiplier1 = data;
					break;
				case 0x5206:
					// Writes specify the eight-bit multiplier; reads return the upper eight bits of the product
					this._multiplier2 = data;
					break;
			}

			if (offset >= 0x5C00) {
				// TODO: Remove synchronise and work out isRendering by mtc
				this.mainboard.synchroniser.synchronise();
				if (this._exRamMode === 0 || this._exRamMode === 1) {
					// only allow writing during rendering, otherwise write 0
					if (this.mainboard.ppu.isRendering(this.mainboard.synchroniser.getCpuMTC(), false)) {
						this._internalExRam[offset - 0x5C00] = data;
					} else {
						this._internalExRam[offset - 0x5C00] = 0;
					}
				} else if (this._exRamMode === 2) {
					// always write
					this._internalExRam[offset - 0x5C00] = data;
				}
			}

			//BaseMapper.prototype.write8EXRam.call( this, offset, data );
		}
	}, {
		key: 'read8EXRam',
		value: function read8EXRam(offset) {
			// 0x4018 -> 0x6000
			switch (offset) {
				case 0x5015:
					//sound status
					//			return soundchip.status();
					break;
				case 0x5204:
					//irq status
					this.mainboard.synchroniser.synchronise();
					var scan = this.mainboard.ppu.ticksToScreenCoordinates(this.mainboard.synchroniser.getCpuMTC());
					var stat = (this._irqActive ? 0x80 : 0) + (scan.y >= 0 && scan.y < 240 ? 0x40 : 0);
					if (this._irqActive) {
						this._irqActive = false;
						this.mainboard.cpu.holdIrqLineLow(false);
					}
					this._predictIrq(this.mainboard.synchroniser.getCpuMTC());
					return stat;
				case 0x5205:
					//  Writes specify the eight-bit multiplicand; reads return the lower eight bits of the product
					return this._multiplier1 * this._multiplier2 & 0xff;
					break;
				case 0x5206:
					// Writes specify the eight-bit multiplier; reads return the upper eight bits of the product
					return this._multiplier1 * this._multiplier2 >> 8 & 0xff;
					break;
			}

			if (offset >= 0x5C00) {
				if (this._exRamMode === 2 || this._exRamMode === 3) {
					return this._internalExRam[offset - 0x5C00];
				}
			}

			return 0; // supposed to be open bus
		}
	}, {
		key: 'write8SRam',
		value: function write8SRam(offset, data) {
			// 0x6000 -> 0x8000
			this._prgRam[this._prgRamPage << 13 | offset & 0x1FFF] = data; // this._prgRamPage * 0x2000 + ( offset % 0x2000 ) ] = data;
		}
	}, {
		key: 'read8SRam',
		value: function read8SRam(offset) {
			// 0x6000 -> 0x8000
			return this._prgRam[this._prgRamPage << 13 | offset & 0x1FFF];
		}
	}, {
		key: '_setNametableMirroring',
		value: function _setNametableMirroring(data) {

			for (var nt = 0; nt < 4; ++nt) {
				this._nameTableMap[nt] = data & 0x3;
				data >>= 2;
			}
		}
	}, {
		key: 'read8ChrRom',
		value: function read8ChrRom(offset, renderingSprites, readType) {
			this.int32ChrData = this.int32ChrData || new Int32Array(this._chrData);
			// Pattern table read < 0x2000
			if (renderingSprites) {
				var pageid = (offset & 0x1C00) >> 10; // Math.floor( offset / 0x400 );
				var pagepos = this._chrMapA[pageid & 0x7];
				var chrOffset = pagepos * 0x400 + (offset & 0x3FF);
				return this.int32ChrData[chrOffset];
			}

			var useMapB = false;

			if (this._bigSpritesEnabled) {
				useMapB = !renderingSprites;
			} else {
				useMapB = this._chrUseBMap;
			}

			var pageid = (offset & 0x1C00) >> 10; // Math.floor( offset / 0x400 );
			var pagepos = useMapB ? this._chrMapB[pageid & 0x3] : this._chrMapA[pageid & 0x7];
			var chrOffset = pagepos * 0x400 + (offset & 0x3FF);
			return this.int32ChrData[chrOffset];
		}
	}, {
		key: 'nameTableRead',
		value: function nameTableRead(nameTables, pageId, pageOffset) {

			switch (this._nameTableMap[pageId]) {
				default:
				case 0:
					return nameTables[0][pageOffset];
				case 1:
					return nameTables[1][pageOffset];
				case 2:
					if (this._exRamMode === 0 || this._exRamMode === 1) {
						return this._internalExRam[pageOffset];
					} else {
						return 0;
					}
				case 3:
					return this._nameTableFill[pageOffset];
			}
		}
	}, {
		key: 'nameTableWrite',
		value: function nameTableWrite(nameTables, pageId, pageOffset, data) {

			switch (this._nameTableMap[pageId]) {
				default:
				case 0:
					nameTables[0][pageOffset] = data;
					break;
				case 1:
					nameTables[1][pageOffset] = data;
					break;
				case 2:
					if (this._exRamMode === 0 || this._exRamMode === 1) {
						this._internalExRam[pageOffset] = data;
					}
					break;
				case 3:
					this._nameTableFill[pageOffset] = data;
					break;
			}
		}
	}, {
		key: 'spriteSizeChanged',
		value: function spriteSizeChanged(bigSprites) {

			this._bigSpritesEnabled = bigSprites;
		}
	}]);

	return Mapper5;
}(_BaseMapper3.default);

exports.default = Mapper5;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BaseMapper2 = __webpack_require__(2);

var _BaseMapper3 = _interopRequireDefault(_BaseMapper2);

var _consts = __webpack_require__(0);

var _serialisation = __webpack_require__(1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Mapper9 = function (_BaseMapper) {
	_inherits(Mapper9, _BaseMapper);

	function Mapper9() {
		_classCallCheck(this, Mapper9);

		return _possibleConstructorReturn(this, (Mapper9.__proto__ || Object.getPrototypeOf(Mapper9)).apply(this, arguments));
	}

	_createClass(Mapper9, [{
		key: 'init',
		value: function init() {
			this._banks = new Int32Array(4);
		}
	}, {
		key: 'mapperSaveState',
		value: function mapperSaveState(state) {

			state._banks = Nes.uintArrayToString(this._banks);
			state._latches = this._latches.slice(0);
		}
	}, {
		key: 'mapperLoadState',
		value: function mapperLoadState(state) {

			this._banks = Nes.stringToUintArray(state._banks);
			this._latches = state._latches.slice(0);
		}
	}, {
		key: 'reset',
		value: function reset() {

			this._latches = [true, false];
			for (var i = 0; i < this._banks.length; ++i) {
				this._banks[i] = 0;
			}

			this.switch32kPrgBank(this.get32kPrgBankCount() - 1);
			for (var i = 0; i < 8; ++i) {
				this.switch1kChrBank(0, i);
			}
			//	this.switch8kChrBank( 0 );
			this.mainboard.ppu.changeMirroringMethod(this.mirroringMethod);
		}
	}, {
		key: '_syncChrBanks',
		value: function _syncChrBanks(performSync) {

			if (performSync === undefined ? true : performSync) {
				this.mainboard.synchroniser.synchronise();
			}
			var lowerBankId = this._latches[0] ? 1 : 0;
			this.switch4kChrBank(this._banks[lowerBankId], true);
			var upperBankId = this._latches[1] ? 3 : 2;
			this.switch4kChrBank(this._banks[upperBankId], false);
		}
	}, {
		key: 'MMC2Latch',
		value: function MMC2Latch(ppuReadAddress) {

			// http://wiki.nesdev.com/w/index.php/MMC2
			if (ppuReadAddress === 0xFD8) {
				this._latches[0] = false;
				this._syncChrBanks(false);
			} else if (ppuReadAddress === 0xFE8) {
				this._latches[0] = true;
				this._syncChrBanks(false);
			} else if (ppuReadAddress >= 0x1FD8 && ppuReadAddress <= 0x1FDF) {
				this._latches[1] = false;
				this._syncChrBanks(false);
			} else if (ppuReadAddress >= 0x1FE8 && ppuReadAddress <= 0x1FEF) {
				this._latches[1] = true;
				this._syncChrBanks(false);
			}
			// var latchId = ( ppuReadAddress & 0x1000 ) > 0 ? 1 : 0;
			// var tilenum = ( ppuReadAddress >> 4 ) & 0xFF;
			// var isFE = tilenum === 0xFE;
			// if ( tilenum === 0xFD || isFE ) {
			// this._latches[ latchId ] = isFE;
			// this._syncChrBanks();
			// }
		}
	}, {
		key: 'write8PrgRom',
		value: function write8PrgRom(offset, data) {

			var top4Bits = offset & 0xF000;
			switch (top4Bits) {
				case 0xA000:
					this.mainboard.synchroniser.synchronise();
					this.switch8kPrgBank(data & 0xf, 0);
					break;
				case 0xB000:
					this._banks[0] = data & 0x1F;
					this._syncChrBanks();
					break;
				case 0xC000:
					this._banks[1] = data & 0x1F;
					this._syncChrBanks();
					break;
				case 0xD000:
					this._banks[2] = data & 0x1F;
					this._syncChrBanks();
					break;
				case 0xE000:
					this._banks[3] = data & 0x1F;
					this._syncChrBanks();
					break;
				case 0xF000:
					this.mainboard.synchroniser.synchronise();
					this.mainboard.ppu.changeMirroringMethod((data & 0x1) > 0 ? _consts.PPU_MIRRORING_HORIZONTAL : _consts.PPU_MIRRORING_VERTICAL);
					break;
				default:
					Nes.basemapper.prototype.write8PrgRom.call(this, offset, data);
					break;
			}
		}
	}]);

	return Mapper9;
}(_BaseMapper3.default);

exports.default = Mapper9;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = mapperFactory;

var _Mapper = __webpack_require__(40);

var _Mapper2 = _interopRequireDefault(_Mapper);

var _Mapper3 = __webpack_require__(41);

var _Mapper4 = _interopRequireDefault(_Mapper3);

var _Mapper5 = __webpack_require__(42);

var _Mapper6 = _interopRequireDefault(_Mapper5);

var _Mapper7 = __webpack_require__(43);

var _Mapper8 = _interopRequireDefault(_Mapper7);

var _Mapper9 = __webpack_require__(44);

var _Mapper10 = _interopRequireDefault(_Mapper9);

var _Mapper11 = __webpack_require__(45);

var _Mapper12 = _interopRequireDefault(_Mapper11);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var mapperDict = {
	0: _Mapper2.default,
	1: _Mapper4.default,
	2: _Mapper6.default,
	4: _Mapper8.default,
	5: _Mapper10.default,
	9: _Mapper12.default
};

function mapperFactory(mapperId, mainboard, mirroringMethod) {
	var MapperClass = mapperDict[mapperId];
	if (!mapperDict.hasOwnProperty(mapperId) || !MapperClass) {
		throw new Error('Mapper id ' + mapperId + ' is not supported');
	}
	var mapper = new MapperClass(mainboard, mirroringMethod);
	if (mapper.init) {
		mapper.init();
	}
	return mapper;
}

/***/ }),
/* 47 */,
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.stringToCodeArray = stringToCodeArray;
exports.processGenieCode = processGenieCode;
var codes = {
	'A': 0x00, // 0000
	'P': 0x01, // 0001
	'Z': 0x02, // 0010
	'L': 0x03, // 0011
	'G': 0x04, // 0100
	'I': 0x05, // 0101
	'T': 0x06, // 0110
	'Y': 0x07, // 0111
	'E': 0x08, // 1000
	'O': 0x09, // 1001
	'X': 0x0A, // 1010
	'U': 0x0B, // 1011
	'K': 0x0C, // 1100
	'S': 0x0D, // 1101
	'V': 0x0E, // 1110
	'N': 0x0F // 1111
};

var ggcodeArray = new Int32Array(8);

function stringToCodeArray(codeString) {
	for (var i = 0; i < codeString.length; ++i) {
		var code = codes[codeString[i]];
		if (code === undefined) {
			throw new Error("Invalid character in game genie code");
		}
		ggcodeArray[i] = code;
	}
	return ggcodeArray;
}

function processGenieCode(mainboard, codeString, enable) {
	if (codeString.length !== 6 && codeString.length !== 8) {
		throw new Error("Invalid game genie code entered '" + codeString + "'");
	}

	if (enable) {
		var code = GameGenie.stringToCodeArray(codeString);

		// Char # |   0   |   1   |   2   |   3   |   4   |   5   |
		// Bit  # |3|2|1|0|3|2|1|0|3|2|1|0|3|2|1|0|3|2|1|0|3|2|1|0|
		// maps to|1|6|7|8|H|2|3|4|-|I|J|K|L|A|B|C|D|M|N|O|5|E|F|G|
		if (codeString.length === 6) {
			var value = code[0] & 0x7; // 678
			value |= code[5] & 0x8; // 5
			value |= (code[1] & 0x7) << 4; // 234
			value |= (code[0] & 0x8) << 4; // 1

			var address = code[4] & 0x7; // MNO
			address |= code[3] & 0x8; // L
			address |= (code[2] & 0x7) << 4; // IJK
			address |= (code[1] & 0x8) << 4; // H
			address |= (code[5] & 0x7) << 8; // EFG
			address |= (code[4] & 0x8) << 8; // D
			address |= (code[3] & 0x7) << 12; // ABC

			mainboard.cart.memoryMapper.gameGeniePoke(codeString, address + 0x8000, value, -1);
		} else if (codeString.length === 8) {
			// Note: Similar to 6 character code but '5' is in different place
			// Char # |   0   |   1   |   2   |   3   |   4   |   5   |   6   |   7   |
			// Bit  # |3|2|1|0|3|2|1|0|3|2|1|0|3|2|1|0|3|2|1|0|3|2|1|0|3|2|1|0|3|2|1|0|
			// maps to|1|6|7|8|H|2|3|4|-|I|J|K|L|A|B|C|D|M|N|O|%|E|F|G|!|^|&|*|5|@|#|$|
			// compareValue = !@#$%^&*
			var value = code[0] & 0x7; // 678
			value |= code[7] & 0x8; // 5
			value |= (code[1] & 0x7) << 4; // 234
			value |= (code[0] & 0x8) << 4; // 1

			var address = code[4] & 0x7; // MNO
			address |= code[3] & 0x8; // L
			address |= (code[2] & 0x7) << 4; // IJK
			address |= (code[1] & 0x8) << 4; // H
			address |= (code[5] & 0x7) << 8; // EFG
			address |= (code[4] & 0x8) << 8; // D
			address |= (code[3] & 0x7) << 12; // ABC

			var compareValue = code[6] & 0x7; // ^&*
			compareValue |= code[5] & 0x8; // %
			compareValue |= (code[7] & 0x7) << 4; // @#$
			compareValue |= (code[6] & 0x8) << 4; // !

			// It then checks the value to be replaced with the compare
			// value, if they are the same it replaces the original value with the new
			// value if not the value remains the same.
			mainboard.cart.memoryMapper.gameGeniePoke(codeString, address + 0x8000, value, compareValue);
		}
	} else {
		mainboard.cart.memoryMapper.removeGameGeniePoke(codeString);
	}
}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.decompressIfNecessary = decompressIfNecessary;
exports.getRomNameFromUrl = getRomNameFromUrl;
exports.loadRomFromUrl = loadRomFromUrl;
function decompressIfNecessary(name, binaryString, completeCallback) {
	if (name.match(/\.nes$/i)) {
		// uncompressed file
		completeCallback(null, binaryString);
	} else {
		throw new Error("Unsupported file extension for file " + name);
	}
}

function getRomNameFromUrl(url) {
	var slashIndex = url.lastIndexOf('/');
	if (slashIndex >= 0) {
		return url.slice(slashIndex + 1);
	}
	return url;
}

function loadRomFromUrl(url, callback) {
	// Load using a bog standard XHR request as then we can load as binary
	var that = this;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'arraybuffer';
	xhr.overrideMimeType("application/octet-stream");
	xhr.onerror = function (err) {
		callback(err);
	};
	xhr.onload = function (err) {
		if (xhr.status === 200) {
			var binaryString = new Uint8Array(this.response);
			callback(null, getRomNameFromUrl(url), binaryString);
		} else {
			callback('Error loading rom file from URL: ' + url + ' HTTP code: ' + xhr.status);
		}
	};

	xhr.send();
}

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */



var base64 = __webpack_require__(50)
var ieee754 = __webpack_require__(76)
var isArray = __webpack_require__(77)

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),
/* 52 */
/***/ (function(module, exports) {

(function() {
  var base64map
      = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',

  crypt = {
    // Bit-wise rotation left
    rotl: function(n, b) {
      return (n << b) | (n >>> (32 - b));
    },

    // Bit-wise rotation right
    rotr: function(n, b) {
      return (n << (32 - b)) | (n >>> b);
    },

    // Swap big-endian to little-endian and vice versa
    endian: function(n) {
      // If number given, swap endian
      if (n.constructor == Number) {
        return crypt.rotl(n, 8) & 0x00FF00FF | crypt.rotl(n, 24) & 0xFF00FF00;
      }

      // Else, assume array and swap all items
      for (var i = 0; i < n.length; i++)
        n[i] = crypt.endian(n[i]);
      return n;
    },

    // Generate an array of any length of random bytes
    randomBytes: function(n) {
      for (var bytes = []; n > 0; n--)
        bytes.push(Math.floor(Math.random() * 256));
      return bytes;
    },

    // Convert a byte array to big-endian 32-bit words
    bytesToWords: function(bytes) {
      for (var words = [], i = 0, b = 0; i < bytes.length; i++, b += 8)
        words[b >>> 5] |= bytes[i] << (24 - b % 32);
      return words;
    },

    // Convert big-endian 32-bit words to a byte array
    wordsToBytes: function(words) {
      for (var bytes = [], b = 0; b < words.length * 32; b += 8)
        bytes.push((words[b >>> 5] >>> (24 - b % 32)) & 0xFF);
      return bytes;
    },

    // Convert a byte array to a hex string
    bytesToHex: function(bytes) {
      for (var hex = [], i = 0; i < bytes.length; i++) {
        hex.push((bytes[i] >>> 4).toString(16));
        hex.push((bytes[i] & 0xF).toString(16));
      }
      return hex.join('');
    },

    // Convert a hex string to a byte array
    hexToBytes: function(hex) {
      for (var bytes = [], c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
      return bytes;
    },

    // Convert a byte array to a base-64 string
    bytesToBase64: function(bytes) {
      for (var base64 = [], i = 0; i < bytes.length; i += 3) {
        var triplet = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
        for (var j = 0; j < 4; j++)
          if (i * 8 + j * 6 <= bytes.length * 8)
            base64.push(base64map.charAt((triplet >>> 6 * (3 - j)) & 0x3F));
          else
            base64.push('=');
      }
      return base64.join('');
    },

    // Convert a base-64 string to a byte array
    base64ToBytes: function(base64) {
      // Remove non-base-64 characters
      base64 = base64.replace(/[^A-Z0-9+\/]/ig, '');

      for (var bytes = [], i = 0, imod4 = 0; i < base64.length;
          imod4 = ++i % 4) {
        if (imod4 == 0) continue;
        bytes.push(((base64map.indexOf(base64.charAt(i - 1))
            & (Math.pow(2, -2 * imod4 + 8) - 1)) << (imod4 * 2))
            | (base64map.indexOf(base64.charAt(i)) >>> (6 - imod4 * 2)));
      }
      return bytes;
    }
  };

  module.exports = crypt;
})();


/***/ }),
/* 53 */
/***/ (function(module, exports) {

module.exports = adjoint;

/**
 * Calculates the adjugate of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function adjoint(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    out[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22));
    out[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22));
    out[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12));
    out[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12));
    out[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22));
    out[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22));
    out[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12));
    out[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12));
    out[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21));
    out[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21));
    out[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11));
    out[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11));
    out[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21));
    out[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21));
    out[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11));
    out[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11));
    return out;
};

/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = clone;

/**
 * Creates a new mat4 initialized with values from an existing matrix
 *
 * @param {mat4} a matrix to clone
 * @returns {mat4} a new 4x4 matrix
 */
function clone(a) {
    var out = new Float32Array(16);
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/***/ }),
/* 55 */
/***/ (function(module, exports) {

module.exports = copy;

/**
 * Copy the values from one mat4 to another
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function copy(out, a) {
    out[0] = a[0];
    out[1] = a[1];
    out[2] = a[2];
    out[3] = a[3];
    out[4] = a[4];
    out[5] = a[5];
    out[6] = a[6];
    out[7] = a[7];
    out[8] = a[8];
    out[9] = a[9];
    out[10] = a[10];
    out[11] = a[11];
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/***/ }),
/* 56 */
/***/ (function(module, exports) {

module.exports = create;

/**
 * Creates a new identity mat4
 *
 * @returns {mat4} a new 4x4 matrix
 */
function create() {
    var out = new Float32Array(16);
    out[0] = 1;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 1;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 1;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;
    return out;
};

/***/ }),
/* 57 */
/***/ (function(module, exports) {

module.exports = determinant;

/**
 * Calculates the determinant of a mat4
 *
 * @param {mat4} a the source matrix
 * @returns {Number} determinant of a
 */
function determinant(a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32;

    // Calculate the determinant
    return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
};

/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = fromQuat;

/**
 * Creates a matrix from a quaternion rotation.
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @returns {mat4} out
 */
function fromQuat(out, q) {
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        yx = y * x2,
        yy = y * y2,
        zx = z * x2,
        zy = z * y2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 1;

    return out;
};

/***/ }),
/* 59 */
/***/ (function(module, exports) {

module.exports = fromRotationTranslation;

/**
 * Creates a matrix from a quaternion rotation and vector translation
 * This is equivalent to (but much faster than):
 *
 *     mat4.identity(dest);
 *     mat4.translate(dest, vec);
 *     var quatMat = mat4.create();
 *     quat4.toMat4(quat, quatMat);
 *     mat4.multiply(dest, quatMat);
 *
 * @param {mat4} out mat4 receiving operation result
 * @param {quat4} q Rotation quaternion
 * @param {vec3} v Translation vector
 * @returns {mat4} out
 */
function fromRotationTranslation(out, q, v) {
    // Quaternion math
    var x = q[0], y = q[1], z = q[2], w = q[3],
        x2 = x + x,
        y2 = y + y,
        z2 = z + z,

        xx = x * x2,
        xy = x * y2,
        xz = x * z2,
        yy = y * y2,
        yz = y * z2,
        zz = z * z2,
        wx = w * x2,
        wy = w * y2,
        wz = w * z2;

    out[0] = 1 - (yy + zz);
    out[1] = xy + wz;
    out[2] = xz - wy;
    out[3] = 0;
    out[4] = xy - wz;
    out[5] = 1 - (xx + zz);
    out[6] = yz + wx;
    out[7] = 0;
    out[8] = xz + wy;
    out[9] = yz - wx;
    out[10] = 1 - (xx + yy);
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    
    return out;
};

/***/ }),
/* 60 */
/***/ (function(module, exports) {

module.exports = frustum;

/**
 * Generates a frustum matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {Number} left Left bound of the frustum
 * @param {Number} right Right bound of the frustum
 * @param {Number} bottom Bottom bound of the frustum
 * @param {Number} top Top bound of the frustum
 * @param {Number} near Near bound of the frustum
 * @param {Number} far Far bound of the frustum
 * @returns {mat4} out
 */
function frustum(out, left, right, bottom, top, near, far) {
    var rl = 1 / (right - left),
        tb = 1 / (top - bottom),
        nf = 1 / (near - far);
    out[0] = (near * 2) * rl;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = (near * 2) * tb;
    out[6] = 0;
    out[7] = 0;
    out[8] = (right + left) * rl;
    out[9] = (top + bottom) * tb;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (far * near * 2) * nf;
    out[15] = 0;
    return out;
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  create: __webpack_require__(56)
  , clone: __webpack_require__(54)
  , copy: __webpack_require__(55)
  , identity: __webpack_require__(9)
  , transpose: __webpack_require__(75)
  , invert: __webpack_require__(62)
  , adjoint: __webpack_require__(53)
  , determinant: __webpack_require__(57)
  , multiply: __webpack_require__(64)
  , translate: __webpack_require__(74)
  , scale: __webpack_require__(72)
  , rotate: __webpack_require__(68)
  , rotateX: __webpack_require__(69)
  , rotateY: __webpack_require__(70)
  , rotateZ: __webpack_require__(71)
  , fromRotationTranslation: __webpack_require__(59)
  , fromQuat: __webpack_require__(58)
  , frustum: __webpack_require__(60)
  , perspective: __webpack_require__(66)
  , perspectiveFromFieldOfView: __webpack_require__(67)
  , ortho: __webpack_require__(65)
  , lookAt: __webpack_require__(63)
  , str: __webpack_require__(73)
}

/***/ }),
/* 62 */
/***/ (function(module, exports) {

module.exports = invert;

/**
 * Inverts a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function invert(out, a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

        b00 = a00 * a11 - a01 * a10,
        b01 = a00 * a12 - a02 * a10,
        b02 = a00 * a13 - a03 * a10,
        b03 = a01 * a12 - a02 * a11,
        b04 = a01 * a13 - a03 * a11,
        b05 = a02 * a13 - a03 * a12,
        b06 = a20 * a31 - a21 * a30,
        b07 = a20 * a32 - a22 * a30,
        b08 = a20 * a33 - a23 * a30,
        b09 = a21 * a32 - a22 * a31,
        b10 = a21 * a33 - a23 * a31,
        b11 = a22 * a33 - a23 * a32,

        // Calculate the determinant
        det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (!det) { 
        return null; 
    }
    det = 1.0 / det;

    out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
    out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
    out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
    out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
    out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
    out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
    out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
    out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
    out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
    out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
    out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
    out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
    out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
    out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
    out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
    out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;

    return out;
};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var identity = __webpack_require__(9);

module.exports = lookAt;

/**
 * Generates a look-at matrix with the given eye position, focal point, and up axis
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {vec3} eye Position of the viewer
 * @param {vec3} center Point the viewer is looking at
 * @param {vec3} up vec3 pointing up
 * @returns {mat4} out
 */
function lookAt(out, eye, center, up) {
    var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
        eyex = eye[0],
        eyey = eye[1],
        eyez = eye[2],
        upx = up[0],
        upy = up[1],
        upz = up[2],
        centerx = center[0],
        centery = center[1],
        centerz = center[2];

    if (Math.abs(eyex - centerx) < 0.000001 &&
        Math.abs(eyey - centery) < 0.000001 &&
        Math.abs(eyez - centerz) < 0.000001) {
        return identity(out);
    }

    z0 = eyex - centerx;
    z1 = eyey - centery;
    z2 = eyez - centerz;

    len = 1 / Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    x0 = upy * z2 - upz * z1;
    x1 = upz * z0 - upx * z2;
    x2 = upx * z1 - upy * z0;
    len = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (!len) {
        x0 = 0;
        x1 = 0;
        x2 = 0;
    } else {
        len = 1 / len;
        x0 *= len;
        x1 *= len;
        x2 *= len;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;

    len = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (!len) {
        y0 = 0;
        y1 = 0;
        y2 = 0;
    } else {
        len = 1 / len;
        y0 *= len;
        y1 *= len;
        y2 *= len;
    }

    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0;
    out[12] = -(x0 * eyex + x1 * eyey + x2 * eyez);
    out[13] = -(y0 * eyex + y1 * eyey + y2 * eyez);
    out[14] = -(z0 * eyex + z1 * eyey + z2 * eyez);
    out[15] = 1;

    return out;
};

/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = multiply;

/**
 * Multiplies two mat4's
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the first operand
 * @param {mat4} b the second operand
 * @returns {mat4} out
 */
function multiply(out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
        a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
        a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
        a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];

    // Cache only the current line of the second matrix
    var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
    out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
    out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
    out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
    out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;
    return out;
};

/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = ortho;

/**
 * Generates a orthogonal projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} left Left bound of the frustum
 * @param {number} right Right bound of the frustum
 * @param {number} bottom Bottom bound of the frustum
 * @param {number} top Top bound of the frustum
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function ortho(out, left, right, bottom, top, near, far) {
    var lr = 1 / (left - right),
        bt = 1 / (bottom - top),
        nf = 1 / (near - far);
    out[0] = -2 * lr;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = -2 * bt;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 2 * nf;
    out[11] = 0;
    out[12] = (left + right) * lr;
    out[13] = (top + bottom) * bt;
    out[14] = (far + near) * nf;
    out[15] = 1;
    return out;
};

/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = perspective;

/**
 * Generates a perspective projection matrix with the given bounds
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fovy Vertical field of view in radians
 * @param {number} aspect Aspect ratio. typically viewport width/height
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspective(out, fovy, aspect, near, far) {
    var f = 1.0 / Math.tan(fovy / 2),
        nf = 1 / (near - far);
    out[0] = f / aspect;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = f;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[12] = 0;
    out[13] = 0;
    out[14] = (2 * far * near) * nf;
    out[15] = 0;
    return out;
};

/***/ }),
/* 67 */
/***/ (function(module, exports) {

module.exports = perspectiveFromFieldOfView;

/**
 * Generates a perspective projection matrix with the given field of view.
 * This is primarily useful for generating projection matrices to be used
 * with the still experiemental WebVR API.
 *
 * @param {mat4} out mat4 frustum matrix will be written into
 * @param {number} fov Object containing the following values: upDegrees, downDegrees, leftDegrees, rightDegrees
 * @param {number} near Near bound of the frustum
 * @param {number} far Far bound of the frustum
 * @returns {mat4} out
 */
function perspectiveFromFieldOfView(out, fov, near, far) {
    var upTan = Math.tan(fov.upDegrees * Math.PI/180.0),
        downTan = Math.tan(fov.downDegrees * Math.PI/180.0),
        leftTan = Math.tan(fov.leftDegrees * Math.PI/180.0),
        rightTan = Math.tan(fov.rightDegrees * Math.PI/180.0),
        xScale = 2.0 / (leftTan + rightTan),
        yScale = 2.0 / (upTan + downTan);

    out[0] = xScale;
    out[1] = 0.0;
    out[2] = 0.0;
    out[3] = 0.0;
    out[4] = 0.0;
    out[5] = yScale;
    out[6] = 0.0;
    out[7] = 0.0;
    out[8] = -((leftTan - rightTan) * xScale * 0.5);
    out[9] = ((upTan - downTan) * yScale * 0.5);
    out[10] = far / (near - far);
    out[11] = -1.0;
    out[12] = 0.0;
    out[13] = 0.0;
    out[14] = (far * near) / (near - far);
    out[15] = 0.0;
    return out;
}



/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = rotate;

/**
 * Rotates a mat4 by the given angle
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @param {vec3} axis the axis to rotate around
 * @returns {mat4} out
 */
function rotate(out, a, rad, axis) {
    var x = axis[0], y = axis[1], z = axis[2],
        len = Math.sqrt(x * x + y * y + z * z),
        s, c, t,
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23,
        b00, b01, b02,
        b10, b11, b12,
        b20, b21, b22;

    if (Math.abs(len) < 0.000001) { return null; }
    
    len = 1 / len;
    x *= len;
    y *= len;
    z *= len;

    s = Math.sin(rad);
    c = Math.cos(rad);
    t = 1 - c;

    a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
    a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
    a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

    // Construct the elements of the rotation matrix
    b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
    b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
    b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

    // Perform rotation-specific matrix multiplication
    out[0] = a00 * b00 + a10 * b01 + a20 * b02;
    out[1] = a01 * b00 + a11 * b01 + a21 * b02;
    out[2] = a02 * b00 + a12 * b01 + a22 * b02;
    out[3] = a03 * b00 + a13 * b01 + a23 * b02;
    out[4] = a00 * b10 + a10 * b11 + a20 * b12;
    out[5] = a01 * b10 + a11 * b11 + a21 * b12;
    out[6] = a02 * b10 + a12 * b11 + a22 * b12;
    out[7] = a03 * b10 + a13 * b11 + a23 * b12;
    out[8] = a00 * b20 + a10 * b21 + a20 * b22;
    out[9] = a01 * b20 + a11 * b21 + a21 * b22;
    out[10] = a02 * b20 + a12 * b21 + a22 * b22;
    out[11] = a03 * b20 + a13 * b21 + a23 * b22;

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }
    return out;
};

/***/ }),
/* 69 */
/***/ (function(module, exports) {

module.exports = rotateX;

/**
 * Rotates a matrix by the given angle around the X axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateX(out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[0]  = a[0];
        out[1]  = a[1];
        out[2]  = a[2];
        out[3]  = a[3];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[4] = a10 * c + a20 * s;
    out[5] = a11 * c + a21 * s;
    out[6] = a12 * c + a22 * s;
    out[7] = a13 * c + a23 * s;
    out[8] = a20 * c - a10 * s;
    out[9] = a21 * c - a11 * s;
    out[10] = a22 * c - a12 * s;
    out[11] = a23 * c - a13 * s;
    return out;
};

/***/ }),
/* 70 */
/***/ (function(module, exports) {

module.exports = rotateY;

/**
 * Rotates a matrix by the given angle around the Y axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateY(out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a20 = a[8],
        a21 = a[9],
        a22 = a[10],
        a23 = a[11];

    if (a !== out) { // If the source and destination differ, copy the unchanged rows
        out[4]  = a[4];
        out[5]  = a[5];
        out[6]  = a[6];
        out[7]  = a[7];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c - a20 * s;
    out[1] = a01 * c - a21 * s;
    out[2] = a02 * c - a22 * s;
    out[3] = a03 * c - a23 * s;
    out[8] = a00 * s + a20 * c;
    out[9] = a01 * s + a21 * c;
    out[10] = a02 * s + a22 * c;
    out[11] = a03 * s + a23 * c;
    return out;
};

/***/ }),
/* 71 */
/***/ (function(module, exports) {

module.exports = rotateZ;

/**
 * Rotates a matrix by the given angle around the Z axis
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to rotate
 * @param {Number} rad the angle to rotate the matrix by
 * @returns {mat4} out
 */
function rotateZ(out, a, rad) {
    var s = Math.sin(rad),
        c = Math.cos(rad),
        a00 = a[0],
        a01 = a[1],
        a02 = a[2],
        a03 = a[3],
        a10 = a[4],
        a11 = a[5],
        a12 = a[6],
        a13 = a[7];

    if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[8]  = a[8];
        out[9]  = a[9];
        out[10] = a[10];
        out[11] = a[11];
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
    }

    // Perform axis-specific matrix multiplication
    out[0] = a00 * c + a10 * s;
    out[1] = a01 * c + a11 * s;
    out[2] = a02 * c + a12 * s;
    out[3] = a03 * c + a13 * s;
    out[4] = a10 * c - a00 * s;
    out[5] = a11 * c - a01 * s;
    out[6] = a12 * c - a02 * s;
    out[7] = a13 * c - a03 * s;
    return out;
};

/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = scale;

/**
 * Scales the mat4 by the dimensions in the given vec3
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to scale
 * @param {vec3} v the vec3 to scale the matrix by
 * @returns {mat4} out
 **/
function scale(out, a, v) {
    var x = v[0], y = v[1], z = v[2];

    out[0] = a[0] * x;
    out[1] = a[1] * x;
    out[2] = a[2] * x;
    out[3] = a[3] * x;
    out[4] = a[4] * y;
    out[5] = a[5] * y;
    out[6] = a[6] * y;
    out[7] = a[7] * y;
    out[8] = a[8] * z;
    out[9] = a[9] * z;
    out[10] = a[10] * z;
    out[11] = a[11] * z;
    out[12] = a[12];
    out[13] = a[13];
    out[14] = a[14];
    out[15] = a[15];
    return out;
};

/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = str;

/**
 * Returns a string representation of a mat4
 *
 * @param {mat4} mat matrix to represent as a string
 * @returns {String} string representation of the matrix
 */
function str(a) {
    return 'mat4(' + a[0] + ', ' + a[1] + ', ' + a[2] + ', ' + a[3] + ', ' +
                    a[4] + ', ' + a[5] + ', ' + a[6] + ', ' + a[7] + ', ' +
                    a[8] + ', ' + a[9] + ', ' + a[10] + ', ' + a[11] + ', ' + 
                    a[12] + ', ' + a[13] + ', ' + a[14] + ', ' + a[15] + ')';
};

/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = translate;

/**
 * Translate a mat4 by the given vector
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the matrix to translate
 * @param {vec3} v vector to translate by
 * @returns {mat4} out
 */
function translate(out, a, v) {
    var x = v[0], y = v[1], z = v[2],
        a00, a01, a02, a03,
        a10, a11, a12, a13,
        a20, a21, a22, a23;

    if (a === out) {
        out[12] = a[0] * x + a[4] * y + a[8] * z + a[12];
        out[13] = a[1] * x + a[5] * y + a[9] * z + a[13];
        out[14] = a[2] * x + a[6] * y + a[10] * z + a[14];
        out[15] = a[3] * x + a[7] * y + a[11] * z + a[15];
    } else {
        a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
        a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
        a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

        out[0] = a00; out[1] = a01; out[2] = a02; out[3] = a03;
        out[4] = a10; out[5] = a11; out[6] = a12; out[7] = a13;
        out[8] = a20; out[9] = a21; out[10] = a22; out[11] = a23;

        out[12] = a00 * x + a10 * y + a20 * z + a[12];
        out[13] = a01 * x + a11 * y + a21 * z + a[13];
        out[14] = a02 * x + a12 * y + a22 * z + a[14];
        out[15] = a03 * x + a13 * y + a23 * z + a[15];
    }

    return out;
};

/***/ }),
/* 75 */
/***/ (function(module, exports) {

module.exports = transpose;

/**
 * Transpose the values of a mat4
 *
 * @param {mat4} out the receiving matrix
 * @param {mat4} a the source matrix
 * @returns {mat4} out
 */
function transpose(out, a) {
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (out === a) {
        var a01 = a[1], a02 = a[2], a03 = a[3],
            a12 = a[6], a13 = a[7],
            a23 = a[11];

        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a01;
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a02;
        out[9] = a12;
        out[11] = a[14];
        out[12] = a03;
        out[13] = a13;
        out[14] = a23;
    } else {
        out[0] = a[0];
        out[1] = a[4];
        out[2] = a[8];
        out[3] = a[12];
        out[4] = a[1];
        out[5] = a[5];
        out[6] = a[9];
        out[7] = a[13];
        out[8] = a[2];
        out[9] = a[6];
        out[10] = a[10];
        out[11] = a[14];
        out[12] = a[3];
        out[13] = a[7];
        out[14] = a[11];
        out[15] = a[15];
    }
    
    return out;
};

/***/ }),
/* 76 */
/***/ (function(module, exports) {

exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}


/***/ }),
/* 77 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};


/***/ }),
/* 78 */,
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {(function () {
    var /*
 * Rusha, a JavaScript implementation of the Secure Hash Algorithm, SHA-1,
 * as defined in FIPS PUB 180-1, tuned for high performance with large inputs.
 * (http://github.com/srijs/rusha)
 *
 * Inspired by Paul Johnstons implementation (http://pajhome.org.uk/crypt/md5).
 *
 * Copyright (c) 2013 Sam Rijs (http://awesam.de).
 * Released under the terms of the MIT license as follows:
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
    util = {
        getDataType: function (data) {
            if (typeof data === 'string') {
                return 'string';
            }
            if (data instanceof Array) {
                return 'array';
            }
            if (typeof global !== 'undefined' && global.Buffer && global.Buffer.isBuffer(data)) {
                return 'buffer';
            }
            if (data instanceof ArrayBuffer) {
                return 'arraybuffer';
            }
            if (data.buffer instanceof ArrayBuffer) {
                return 'view';
            }
            if (data instanceof Blob) {
                return 'blob';
            }
            throw new Error('Unsupported data type.');
        }
    };
    function Rusha(chunkSize) {
        'use strict';
        var // Private object structure.
        self$2 = { fill: 0 };
        var // Calculate the length of buffer that the sha1 routine uses
        // including the padding.
        padlen = function (len) {
            for (len += 9; len % 64 > 0; len += 1);
            return len;
        };
        var padZeroes = function (bin, len) {
            var h8 = new Uint8Array(bin.buffer);
            var om = len % 4, align = len - om;
            switch (om) {
            case 0:
                h8[align + 3] = 0;
            case 1:
                h8[align + 2] = 0;
            case 2:
                h8[align + 1] = 0;
            case 3:
                h8[align + 0] = 0;
            }
            for (var i$2 = (len >> 2) + 1; i$2 < bin.length; i$2++)
                bin[i$2] = 0;
        };
        var padData = function (bin, chunkLen, msgLen) {
            bin[chunkLen >> 2] |= 128 << 24 - (chunkLen % 4 << 3);
            // To support msgLen >= 2 GiB, use a float division when computing the
            // high 32-bits of the big-endian message length in bits.
            bin[((chunkLen >> 2) + 2 & ~15) + 14] = msgLen / (1 << 29) | 0;
            bin[((chunkLen >> 2) + 2 & ~15) + 15] = msgLen << 3;
        };
        var // Convert a binary string and write it to the heap.
        // A binary string is expected to only contain char codes < 256.
        convStr = function (H8, H32, start, len, off) {
            var str = this, i$2, om = off % 4, lm = (len + om) % 4, j = len - lm;
            switch (om) {
            case 0:
                H8[off] = str.charCodeAt(start + 3);
            case 1:
                H8[off + 1 - (om << 1) | 0] = str.charCodeAt(start + 2);
            case 2:
                H8[off + 2 - (om << 1) | 0] = str.charCodeAt(start + 1);
            case 3:
                H8[off + 3 - (om << 1) | 0] = str.charCodeAt(start);
            }
            if (len < lm + om) {
                return;
            }
            for (i$2 = 4 - om; i$2 < j; i$2 = i$2 + 4 | 0) {
                H32[off + i$2 >> 2] = str.charCodeAt(start + i$2) << 24 | str.charCodeAt(start + i$2 + 1) << 16 | str.charCodeAt(start + i$2 + 2) << 8 | str.charCodeAt(start + i$2 + 3);
            }
            switch (lm) {
            case 3:
                H8[off + j + 1 | 0] = str.charCodeAt(start + j + 2);
            case 2:
                H8[off + j + 2 | 0] = str.charCodeAt(start + j + 1);
            case 1:
                H8[off + j + 3 | 0] = str.charCodeAt(start + j);
            }
        };
        var // Convert a buffer or array and write it to the heap.
        // The buffer or array is expected to only contain elements < 256.
        convBuf = function (H8, H32, start, len, off) {
            var buf = this, i$2, om = off % 4, lm = (len + om) % 4, j = len - lm;
            switch (om) {
            case 0:
                H8[off] = buf[start + 3];
            case 1:
                H8[off + 1 - (om << 1) | 0] = buf[start + 2];
            case 2:
                H8[off + 2 - (om << 1) | 0] = buf[start + 1];
            case 3:
                H8[off + 3 - (om << 1) | 0] = buf[start];
            }
            if (len < lm + om) {
                return;
            }
            for (i$2 = 4 - om; i$2 < j; i$2 = i$2 + 4 | 0) {
                H32[off + i$2 >> 2 | 0] = buf[start + i$2] << 24 | buf[start + i$2 + 1] << 16 | buf[start + i$2 + 2] << 8 | buf[start + i$2 + 3];
            }
            switch (lm) {
            case 3:
                H8[off + j + 1 | 0] = buf[start + j + 2];
            case 2:
                H8[off + j + 2 | 0] = buf[start + j + 1];
            case 1:
                H8[off + j + 3 | 0] = buf[start + j];
            }
        };
        var convBlob = function (H8, H32, start, len, off) {
            var blob = this, i$2, om = off % 4, lm = (len + om) % 4, j = len - lm;
            var buf = new Uint8Array(reader.readAsArrayBuffer(blob.slice(start, start + len)));
            switch (om) {
            case 0:
                H8[off] = buf[3];
            case 1:
                H8[off + 1 - (om << 1) | 0] = buf[2];
            case 2:
                H8[off + 2 - (om << 1) | 0] = buf[1];
            case 3:
                H8[off + 3 - (om << 1) | 0] = buf[0];
            }
            if (len < lm + om) {
                return;
            }
            for (i$2 = 4 - om; i$2 < j; i$2 = i$2 + 4 | 0) {
                H32[off + i$2 >> 2 | 0] = buf[i$2] << 24 | buf[i$2 + 1] << 16 | buf[i$2 + 2] << 8 | buf[i$2 + 3];
            }
            switch (lm) {
            case 3:
                H8[off + j + 1 | 0] = buf[j + 2];
            case 2:
                H8[off + j + 2 | 0] = buf[j + 1];
            case 1:
                H8[off + j + 3 | 0] = buf[j];
            }
        };
        var convFn = function (data) {
            switch (util.getDataType(data)) {
            case 'string':
                return convStr.bind(data);
            case 'array':
                return convBuf.bind(data);
            case 'buffer':
                return convBuf.bind(data);
            case 'arraybuffer':
                return convBuf.bind(new Uint8Array(data));
            case 'view':
                return convBuf.bind(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
            case 'blob':
                return convBlob.bind(data);
            }
        };
        var slice = function (data, offset) {
            switch (util.getDataType(data)) {
            case 'string':
                return data.slice(offset);
            case 'array':
                return data.slice(offset);
            case 'buffer':
                return data.slice(offset);
            case 'arraybuffer':
                return data.slice(offset);
            case 'view':
                return data.buffer.slice(offset);
            }
        };
        var // Precompute 00 - ff strings
        precomputedHex = new Array(256);
        for (var i = 0; i < 256; i++) {
            precomputedHex[i] = (i < 16 ? '0' : '') + i.toString(16);
        }
        var // Convert an ArrayBuffer into its hexadecimal string representation.
        hex = function (arrayBuffer) {
            var binarray = new Uint8Array(arrayBuffer);
            var res = new Array(arrayBuffer.byteLength);
            for (var i$2 = 0; i$2 < res.length; i$2++) {
                res[i$2] = precomputedHex[binarray[i$2]];
            }
            return res.join('');
        };
        var ceilHeapSize = function (v) {
            // The asm.js spec says:
            // The heap object's byteLength must be either
            // 2^n for n in [12, 24) or 2^24 * n for n ≥ 1.
            // Also, byteLengths smaller than 2^16 are deprecated.
            var p;
            if (// If v is smaller than 2^16, the smallest possible solution
                // is 2^16.
                v <= 65536)
                return 65536;
            if (// If v < 2^24, we round up to 2^n,
                // otherwise we round up to 2^24 * n.
                v < 16777216) {
                for (p = 1; p < v; p = p << 1);
            } else {
                for (p = 16777216; p < v; p += 16777216);
            }
            return p;
        };
        var // Initialize the internal data structures to a new capacity.
        init = function (size) {
            if (size % 64 > 0) {
                throw new Error('Chunk size must be a multiple of 128 bit');
            }
            self$2.offset = 0;
            self$2.maxChunkLen = size;
            self$2.padMaxChunkLen = padlen(size);
            // The size of the heap is the sum of:
            // 1. The padded input message size
            // 2. The extended space the algorithm needs (320 byte)
            // 3. The 160 bit state the algoritm uses
            self$2.heap = new ArrayBuffer(ceilHeapSize(self$2.padMaxChunkLen + 320 + 20));
            self$2.h32 = new Int32Array(self$2.heap);
            self$2.h8 = new Int8Array(self$2.heap);
            self$2.core = new Rusha._core({
                Int32Array: Int32Array,
                DataView: DataView
            }, {}, self$2.heap);
            self$2.buffer = null;
        };
        // Iinitializethe datastructures according
        // to a chunk siyze.
        init(chunkSize || 64 * 1024);
        var initState = function (heap, padMsgLen) {
            self$2.offset = 0;
            var io = new Int32Array(heap, padMsgLen + 320, 5);
            io[0] = 1732584193;
            io[1] = -271733879;
            io[2] = -1732584194;
            io[3] = 271733878;
            io[4] = -1009589776;
        };
        var padChunk = function (chunkLen, msgLen) {
            var padChunkLen = padlen(chunkLen);
            var view = new Int32Array(self$2.heap, 0, padChunkLen >> 2);
            padZeroes(view, chunkLen);
            padData(view, chunkLen, msgLen);
            return padChunkLen;
        };
        var // Write data to the heap.
        write = function (data, chunkOffset, chunkLen, off) {
            convFn(data)(self$2.h8, self$2.h32, chunkOffset, chunkLen, off || 0);
        };
        var // Initialize and call the RushaCore,
        // assuming an input buffer of length len * 4.
        coreCall = function (data, chunkOffset, chunkLen, msgLen, finalize) {
            var padChunkLen = chunkLen;
            write(data, chunkOffset, chunkLen);
            if (finalize) {
                padChunkLen = padChunk(chunkLen, msgLen);
            }
            self$2.core.hash(padChunkLen, self$2.padMaxChunkLen);
        };
        var getRawDigest = function (heap, padMaxChunkLen) {
            var io = new Int32Array(heap, padMaxChunkLen + 320, 5);
            var out = new Int32Array(5);
            var arr = new DataView(out.buffer);
            arr.setInt32(0, io[0], false);
            arr.setInt32(4, io[1], false);
            arr.setInt32(8, io[2], false);
            arr.setInt32(12, io[3], false);
            arr.setInt32(16, io[4], false);
            return out;
        };
        var // Calculate the hash digest as an array of 5 32bit integers.
        rawDigest = this.rawDigest = function (str) {
            var msgLen = str.byteLength || str.length || str.size || 0;
            initState(self$2.heap, self$2.padMaxChunkLen);
            var chunkOffset = 0, chunkLen = self$2.maxChunkLen, last;
            for (chunkOffset = 0; msgLen > chunkOffset + chunkLen; chunkOffset += chunkLen) {
                coreCall(str, chunkOffset, chunkLen, msgLen, false);
            }
            coreCall(str, chunkOffset, msgLen - chunkOffset, msgLen, true);
            return getRawDigest(self$2.heap, self$2.padMaxChunkLen);
        };
        // The digest and digestFrom* interface returns the hash digest
        // as a hex string.
        this.digest = this.digestFromString = this.digestFromBuffer = this.digestFromArrayBuffer = function (str) {
            return hex(rawDigest(str).buffer);
        };
        this.resetState = function () {
            initState(self$2.heap, self$2.padMaxChunkLen);
            return this;
        };
        this.append = function (chunk) {
            var chunkOffset = 0;
            var chunkLen = chunk.byteLength || chunk.length || chunk.size || 0;
            var turnOffset = self$2.offset % self$2.maxChunkLen;
            var inputLen;
            self$2.offset += chunkLen;
            while (chunkOffset < chunkLen) {
                inputLen = Math.min(chunkLen - chunkOffset, self$2.maxChunkLen - turnOffset);
                write(chunk, chunkOffset, inputLen, turnOffset);
                turnOffset += inputLen;
                chunkOffset += inputLen;
                if (turnOffset === self$2.maxChunkLen) {
                    self$2.core.hash(self$2.maxChunkLen, self$2.padMaxChunkLen);
                    turnOffset = 0;
                }
            }
            return this;
        };
        this.getState = function () {
            var turnOffset = self$2.offset % self$2.maxChunkLen;
            var heap;
            if (!turnOffset) {
                var io = new Int32Array(self$2.heap, self$2.padMaxChunkLen + 320, 5);
                heap = io.buffer.slice(io.byteOffset, io.byteOffset + io.byteLength);
            } else {
                heap = self$2.heap.slice(0);
            }
            return {
                offset: self$2.offset,
                heap: heap
            };
        };
        this.setState = function (state) {
            self$2.offset = state.offset;
            if (state.heap.byteLength === 20) {
                var io = new Int32Array(self$2.heap, self$2.padMaxChunkLen + 320, 5);
                io.set(new Int32Array(state.heap));
            } else {
                self$2.h32.set(new Int32Array(state.heap));
            }
            return this;
        };
        var rawEnd = this.rawEnd = function () {
            var msgLen = self$2.offset;
            var chunkLen = msgLen % self$2.maxChunkLen;
            var padChunkLen = padChunk(chunkLen, msgLen);
            self$2.core.hash(padChunkLen, self$2.padMaxChunkLen);
            var result = getRawDigest(self$2.heap, self$2.padMaxChunkLen);
            initState(self$2.heap, self$2.padMaxChunkLen);
            return result;
        };
        this.end = function () {
            return hex(rawEnd().buffer);
        };
    }
    ;
    // The low-level RushCore module provides the heart of Rusha,
    // a high-speed sha1 implementation working on an Int32Array heap.
    // At first glance, the implementation seems complicated, however
    // with the SHA1 spec at hand, it is obvious this almost a textbook
    // implementation that has a few functions hand-inlined and a few loops
    // hand-unrolled.
    Rusha._core = function RushaCore(stdlib, foreign, heap) {
        'use asm';
        var H = new stdlib.Int32Array(heap);
        function hash(k, x) {
            // k in bytes
            k = k | 0;
            x = x | 0;
            var i = 0, j = 0, y0 = 0, z0 = 0, y1 = 0, z1 = 0, y2 = 0, z2 = 0, y3 = 0, z3 = 0, y4 = 0, z4 = 0, t0 = 0, t1 = 0;
            y0 = H[x + 320 >> 2] | 0;
            y1 = H[x + 324 >> 2] | 0;
            y2 = H[x + 328 >> 2] | 0;
            y3 = H[x + 332 >> 2] | 0;
            y4 = H[x + 336 >> 2] | 0;
            for (i = 0; (i | 0) < (k | 0); i = i + 64 | 0) {
                z0 = y0;
                z1 = y1;
                z2 = y2;
                z3 = y3;
                z4 = y4;
                for (j = 0; (j | 0) < 64; j = j + 4 | 0) {
                    t1 = H[i + j >> 2] | 0;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 & y2 | ~y1 & y3) | 0) + ((t1 + y4 | 0) + 1518500249 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    H[k + j >> 2] = t1;
                }
                for (j = k + 64 | 0; (j | 0) < (k + 80 | 0); j = j + 4 | 0) {
                    t1 = (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) << 1 | (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) >>> 31;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 & y2 | ~y1 & y3) | 0) + ((t1 + y4 | 0) + 1518500249 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    H[j >> 2] = t1;
                }
                for (j = k + 80 | 0; (j | 0) < (k + 160 | 0); j = j + 4 | 0) {
                    t1 = (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) << 1 | (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) >>> 31;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 ^ y2 ^ y3) | 0) + ((t1 + y4 | 0) + 1859775393 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    H[j >> 2] = t1;
                }
                for (j = k + 160 | 0; (j | 0) < (k + 240 | 0); j = j + 4 | 0) {
                    t1 = (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) << 1 | (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) >>> 31;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 & y2 | y1 & y3 | y2 & y3) | 0) + ((t1 + y4 | 0) - 1894007588 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    H[j >> 2] = t1;
                }
                for (j = k + 240 | 0; (j | 0) < (k + 320 | 0); j = j + 4 | 0) {
                    t1 = (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) << 1 | (H[j - 12 >> 2] ^ H[j - 32 >> 2] ^ H[j - 56 >> 2] ^ H[j - 64 >> 2]) >>> 31;
                    t0 = ((y0 << 5 | y0 >>> 27) + (y1 ^ y2 ^ y3) | 0) + ((t1 + y4 | 0) - 899497514 | 0) | 0;
                    y4 = y3;
                    y3 = y2;
                    y2 = y1 << 30 | y1 >>> 2;
                    y1 = y0;
                    y0 = t0;
                    H[j >> 2] = t1;
                }
                y0 = y0 + z0 | 0;
                y1 = y1 + z1 | 0;
                y2 = y2 + z2 | 0;
                y3 = y3 + z3 | 0;
                y4 = y4 + z4 | 0;
            }
            H[x + 320 >> 2] = y0;
            H[x + 324 >> 2] = y1;
            H[x + 328 >> 2] = y2;
            H[x + 332 >> 2] = y3;
            H[x + 336 >> 2] = y4;
        }
        return { hash: hash };
    };
    if (// If we'e running in Node.JS, export a module.
        true) {
        module.exports = Rusha;
    } else if (// If we're running in a DOM context, export
        // the Rusha object to toplevel.
        typeof window !== 'undefined') {
        window.Rusha = Rusha;
    }
    if (// If we're running in a webworker, accept
        // messages containing a jobid and a buffer
        // or blob object, and return the hash result.
        typeof FileReaderSync !== 'undefined') {
        var reader = new FileReaderSync(), hasher = new Rusha(4 * 1024 * 1024);
        self.onmessage = function onMessage(event) {
            var hash, data = event.data.data;
            try {
                hash = hasher.digest(data);
                self.postMessage({
                    id: event.data.id,
                    hash: hash
                });
            } catch (e) {
                self.postMessage({
                    id: event.data.id,
                    error: e.name
                });
            }
        };
    }
}());
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(10)))

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(Buffer) {(function() {
  var crypt = __webpack_require__(52),
      utf8 = __webpack_require__(8).utf8,
      bin = __webpack_require__(8).bin,

  // The core
  sha1 = function (message) {
    // Convert to byte array
    if (message.constructor == String)
      message = utf8.stringToBytes(message);
    else if (typeof Buffer !== 'undefined' && typeof Buffer.isBuffer == 'function' && Buffer.isBuffer(message))
      message = Array.prototype.slice.call(message, 0);
    else if (!Array.isArray(message))
      message = message.toString();

    // otherwise assume byte array

    var m  = crypt.bytesToWords(message),
        l  = message.length * 8,
        w  = [],
        H0 =  1732584193,
        H1 = -271733879,
        H2 = -1732584194,
        H3 =  271733878,
        H4 = -1009589776;

    // Padding
    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >>> 9) << 4) + 15] = l;

    for (var i = 0; i < m.length; i += 16) {
      var a = H0,
          b = H1,
          c = H2,
          d = H3,
          e = H4;

      for (var j = 0; j < 80; j++) {

        if (j < 16)
          w[j] = m[i + j];
        else {
          var n = w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16];
          w[j] = (n << 1) | (n >>> 31);
        }

        var t = ((H0 << 5) | (H0 >>> 27)) + H4 + (w[j] >>> 0) + (
                j < 20 ? (H1 & H2 | ~H1 & H3) + 1518500249 :
                j < 40 ? (H1 ^ H2 ^ H3) + 1859775393 :
                j < 60 ? (H1 & H2 | H1 & H3 | H2 & H3) - 1894007588 :
                         (H1 ^ H2 ^ H3) - 899497514);

        H4 = H3;
        H3 = H2;
        H2 = (H1 << 30) | (H1 >>> 2);
        H1 = H0;
        H0 = t;
      }

      H0 += a;
      H1 += b;
      H2 += c;
      H3 += d;
      H4 += e;
    }

    return [H0, H1, H2, H3, H4];
  },

  // Public API
  api = function (message, options) {
    var digestbytes = crypt.wordsToBytes(sha1(message));
    return options && options.asBytes ? digestbytes :
        options && options.asString ? bin.bytesToString(digestbytes) :
        crypt.bytesToHex(digestbytes);
  };

  api._blocksize = 16;
  api._digestsize = 20;

  module.exports = api;
})();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(51).Buffer))

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

// stats.js - http://github.com/mrdoob/stats.js
(function(f,e){ true?module.exports=e():"function"===typeof define&&define.amd?define(e):f.Stats=e()})(this,function(){var f=function(){function e(a){c.appendChild(a.dom);return a}function u(a){for(var d=0;d<c.children.length;d++)c.children[d].style.display=d===a?"block":"none";l=a}var l=0,c=document.createElement("div");c.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000";c.addEventListener("click",function(a){a.preventDefault();
u(++l%c.children.length)},!1);var k=(performance||Date).now(),g=k,a=0,r=e(new f.Panel("FPS","#0ff","#002")),h=e(new f.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var t=e(new f.Panel("MB","#f08","#201"));u(0);return{REVISION:16,dom:c,addPanel:e,showPanel:u,begin:function(){k=(performance||Date).now()},end:function(){a++;var c=(performance||Date).now();h.update(c-k,200);if(c>g+1E3&&(r.update(1E3*a/(c-g),100),g=c,a=0,t)){var d=performance.memory;t.update(d.usedJSHeapSize/
1048576,d.jsHeapSizeLimit/1048576)}return c},update:function(){k=this.end()},domElement:c,setMode:u}};f.Panel=function(e,f,l){var c=Infinity,k=0,g=Math.round,a=g(window.devicePixelRatio||1),r=80*a,h=48*a,t=3*a,v=2*a,d=3*a,m=15*a,n=74*a,p=30*a,q=document.createElement("canvas");q.width=r;q.height=h;q.style.cssText="width:80px;height:48px";var b=q.getContext("2d");b.font="bold "+9*a+"px Helvetica,Arial,sans-serif";b.textBaseline="top";b.fillStyle=l;b.fillRect(0,0,r,h);b.fillStyle=f;b.fillText(e,t,v);
b.fillRect(d,m,n,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d,m,n,p);return{dom:q,update:function(h,w){c=Math.min(c,h);k=Math.max(k,h);b.fillStyle=l;b.globalAlpha=1;b.fillRect(0,0,r,m);b.fillStyle=f;b.fillText(g(h)+" "+e+" ("+g(c)+"-"+g(k)+")",t,v);b.drawImage(q,d+a,m,n-a,p,d,m,n-a,p);b.fillRect(d+n-a,m,a,p);b.fillStyle=l;b.globalAlpha=.9;b.fillRect(d+n-a,m,a,g((1-h/w)*p))}}};return f});


/***/ }),
/* 82 */
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),
/* 83 */
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _nES = __webpack_require__(11);

var _nES2 = _interopRequireDefault(_nES);

var _bindKeyboard = __webpack_require__(88);

var _bindKeyboard2 = _interopRequireDefault(_bindKeyboard);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = new _nES2.default({
	render: 'auto', // 'auto', 'canvas', 'webgl', 'headless'
	plugins: [_bindKeyboard2.default]
});
App.start();

// ROM courtesy of TecmoBowl.org!
var romToLoad = 'TecmoSuperBowl2k17';
App.loadRomFromUrl('/roms/' + romToLoad + '.nes');

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(84);


/***/ }),
/* 86 */,
/* 87 */,
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (nesInstance) {
	window.addEventListener('keydown', function (event) {
		if (keyMap[event.keyCode]) {
			event.preventDefault();
			nesInstance.pressControllerButton(event.shiftKey ? 1 : 0, keyMap[event.keyCode]);
		}
	}, false);

	window.addEventListener('keyup', function (_ref) {
		var keyCode = _ref.keyCode;

		if (keyMap[keyCode]) {
			event.preventDefault();
			nesInstance.depressControllerButton(event.shiftKey ? 1 : 0, keyMap[keyCode]);
		}
	}, false);

	// Return the nES6 instance for chaining.
	return nesInstance;
};

/**
 * KeyboardEvent keyCodes and their corresponding gamepad button.
 * @type {Object}
 */
var keyMapDefaults = exports.keyMapDefaults = {
	90: 'A', // Z
	88: 'B', // X
	67: 'SELECT', // C
	13: 'START', // Enter
	37: 'LEFT',
	38: 'UP',
	39: 'RIGHT',
	40: 'DOWN'
};

/**
 * Configurable keyboard mapping object, based on keyMapDefaults.
 * @type {Object}
 */
var keyMap = exports.keyMap = _extends({}, keyMapDefaults);

/**
 * Binding function for bindKeyboard plugin. Given an nES6 instance,
 * event bindings are added to the window, which 'presses' a gamepad controller
 * inside of nES6. Refers to `keyMap` for bindings - which can be overridden.
 *
 * @param  {nES6} 	nesInstance 	Active nES6 instance to bind to.
 * @return {void}
 */

/***/ })
/******/ ]);