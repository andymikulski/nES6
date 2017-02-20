'use strict';

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

var ZERO_PAD = exports.ZERO_PAD = function ZERO_PAD(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
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