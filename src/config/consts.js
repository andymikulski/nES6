export const PPU_TICKS_PER_SCANLINE = 341;
export const MASTER_CYCLES_PER_PPU = 5;
export const MASTER_CYCLES_PER_SCANLINE = PPU_TICKS_PER_SCANLINE * MASTER_CYCLES_PER_PPU;

export const CPU_RESET_ADDRESS = 0xFFFC;
export const CPU_IRQ_ADDRESS = 0xFFFE;
export const CPU_NMI_ADDRESS = 0xFFFA;

export const SCREEN_WIDTH = 256;
export const SCREEN_HEIGHT = 240;

export let TRACE_ENABLED = false;

export const IS_INT_BETWEEN = function( offset, min, max ) {
	return min <= offset && offset < max;
};


const zeroPadCache = {};
export const ZERO_PAD = function(n, width, z) {
	const cacheKey = `${n} ${width} ${z}`;
	if (!zeroPadCache[cacheKey]) {
		z = z || '0';
		n = n + '';
		zeroPadCache[cacheKey] = n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	}
	return zeroPadCache[cacheKey];
};


export const ZERO_PAD_HEX = function(n, width, z) {
	return ZERO_PAD( n.toString( 16 ), width, z );
};

export const g_DefaultColourEncoding = 'NTSC';

export let COLOUR_ENCODING_NAME = "";
export let COLOUR_ENCODING_REFRESHRATE = 0.0;
export let COLOUR_ENCODING_MTC_PER_CPU = 0;
export let COLOUR_ENCODING_VBLANK_SCANLINES = 0;
export let COLOUR_ENCODING_FRAME_SCANLINES = 0;
export let COLOUR_ENCODING_VBLANK_MTC = 0;
export let COLOUR_ENCODING_FRAME_MTC = 0;


export const setColourEncodingType = function( name ) {

	if ( name === 'PAL' ) {
		COLOUR_ENCODING_NAME = "PAL";
		COLOUR_ENCODING_REFRESHRATE = 50.0;
		COLOUR_ENCODING_MTC_PER_CPU = 16;
		COLOUR_ENCODING_VBLANK_SCANLINES = 70;
		COLOUR_ENCODING_FRAME_SCANLINES = 312;
	} else {
		COLOUR_ENCODING_NAME = "NTSC";
		COLOUR_ENCODING_REFRESHRATE = 60.1;
		COLOUR_ENCODING_MTC_PER_CPU = 15;
		COLOUR_ENCODING_VBLANK_SCANLINES = 20;
		COLOUR_ENCODING_FRAME_SCANLINES = 262;
	}

	COLOUR_ENCODING_VBLANK_MTC = COLOUR_ENCODING_VBLANK_SCANLINES * MASTER_CYCLES_PER_SCANLINE;
	COLOUR_ENCODING_FRAME_MTC = COLOUR_ENCODING_FRAME_SCANLINES * MASTER_CYCLES_PER_SCANLINE;
};


setColourEncodingType( g_DefaultColourEncoding );

export const PPU_MIRRORING_HORIZONTAL = 0;
export const PPU_MIRRORING_VERTICAL = 1;
export const PPU_MIRRORING_FOURSCREEN = 2;
export const PPU_MIRRORING_SINGLESCREEN_NT0 = 3;
export const PPU_MIRRORING_SINGLESCREEN_NT1 = 4;


export function mirroringMethodToString( method ) {
	switch ( method ) {
		case PPU_MIRRORING_HORIZONTAL: // default
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


export const JOYPAD_A = 0;
export const JOYPAD_B = 1;
export const JOYPAD_SELECT = 2;
export const JOYPAD_START = 3;
export const JOYPAD_UP = 4;
export const JOYPAD_DOWN = 5;
export const JOYPAD_LEFT = 6;
export const JOYPAD_RIGHT = 7;

export const JOYPAD_NAME_TO_ID = function( name ) {
	if ( name === 'UP' ) { return JOYPAD_UP; }
	else if ( name === 'DOWN' ) { return JOYPAD_DOWN; }
	else if ( name === 'LEFT' ) { return JOYPAD_LEFT; }
	else if ( name === 'RIGHT' ) { return JOYPAD_RIGHT; }
	else if ( name === 'A' ) { return JOYPAD_A; }
	else if ( name === 'B' ) { return JOYPAD_B; }
	else if ( name === 'SELECT' ) { return JOYPAD_SELECT; }
	else if ( name === 'START' ) { return JOYPAD_START; }
	else { throw new Error( "JOYPAD_NAME_TO_ID: Invalid parameter" ); }
};


export const JOYPAD_ID_TO_NAME = function( id ) {
	if ( id === JOYPAD_UP ) { return 'UP'; }
	else if ( id === JOYPAD_DOWN ) { return 'DOWN'; }
	else if ( id === JOYPAD_LEFT ) { return 'LEFT'; }
	else if ( id === JOYPAD_RIGHT ) { return 'RIGHT'; }
	else if ( id === JOYPAD_A ) { return 'A'; }
	else if ( id === JOYPAD_B ) { return 'B'; }
	else if ( id === JOYPAD_SELECT ) { return 'SELECT'; }
	else if ( id === JOYPAD_START ) { return 'START'; }
	else { throw new Error( "JOYPAD_ID_TO_NAME: Invalid parameter " + id ); }
};

export const g_ClearScreenArray = (new Int32Array( SCREEN_WIDTH * SCREEN_HEIGHT )).fill(0);
