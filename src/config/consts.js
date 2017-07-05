export const PPU_TICKS_PER_SCANLINE = 341;
export const MASTER_CYCLES_PER_PPU = 5;
export const MASTER_CYCLES_PER_SCANLINE = PPU_TICKS_PER_SCANLINE * MASTER_CYCLES_PER_PPU;

export const CPU_RESET_ADDRESS = 0xFFFC;
export const CPU_IRQ_ADDRESS = 0xFFFE;
export const CPU_NMI_ADDRESS = 0xFFFA;

export const SCREEN_WIDTH = 256;
export const SCREEN_HEIGHT = 240;

export const TRACE_ENABLED = false;

export const IS_INT_BETWEEN = function (offset, min, max) {
  return min <= offset && offset < max;
};


const zeroPadCache = {};
export const ZERO_PAD = function (n, width, z) {
  const cacheKey = `${n} ${width} ${z}`;
  if (!zeroPadCache[cacheKey]) {
    z = z || '0';
    n = `${n}`;
    zeroPadCache[cacheKey] = n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }
  return zeroPadCache[cacheKey];
};


export const ZERO_PAD_HEX = function (n, width, z) {
  return ZERO_PAD(n.toString(16), width, z);
};

export const g_DefaultColourEncoding = 'NTSC';

export let COLOUR_ENCODING_NAME = '';
export let COLOUR_ENCODING_REFRESHRATE = 0.0;
export let COLOUR_ENCODING_MTC_PER_CPU = 0;
export let COLOUR_ENCODING_VBLANK_SCANLINES = 0;
export let COLOUR_ENCODING_FRAME_SCANLINES = 0;
export let COLOUR_ENCODING_VBLANK_MTC = 0;
export let COLOUR_ENCODING_FRAME_MTC = 0;


export const setColourEncodingType = function (name) {
  if (name === 'PAL') {
    COLOUR_ENCODING_NAME = 'PAL';
    COLOUR_ENCODING_REFRESHRATE = 50.0;
    COLOUR_ENCODING_MTC_PER_CPU = 16;
    COLOUR_ENCODING_VBLANK_SCANLINES = 70;
    COLOUR_ENCODING_FRAME_SCANLINES = 312;
  } else {
    COLOUR_ENCODING_NAME = 'NTSC';
    COLOUR_ENCODING_REFRESHRATE = 60.1;
    COLOUR_ENCODING_MTC_PER_CPU = 15;
    COLOUR_ENCODING_VBLANK_SCANLINES = 20;
    COLOUR_ENCODING_FRAME_SCANLINES = 262;
  }

  COLOUR_ENCODING_VBLANK_MTC = COLOUR_ENCODING_VBLANK_SCANLINES * MASTER_CYCLES_PER_SCANLINE;
  COLOUR_ENCODING_FRAME_MTC = COLOUR_ENCODING_FRAME_SCANLINES * MASTER_CYCLES_PER_SCANLINE;
};


setColourEncodingType(g_DefaultColourEncoding);

export const PPU_MIRRORING_HORIZONTAL = 0;
export const PPU_MIRRORING_VERTICAL = 1;
export const PPU_MIRRORING_FOURSCREEN = 2;
export const PPU_MIRRORING_SINGLESCREEN_NT0 = 3;
export const PPU_MIRRORING_SINGLESCREEN_NT1 = 4;

const mirrorMethods = {
  [PPU_MIRRORING_HORIZONTAL]: 'horizontal',
  [PPU_MIRRORING_VERTICAL]: 'vertical',
  [PPU_MIRRORING_FOURSCREEN]: 'fourscreen',
  [PPU_MIRRORING_SINGLESCREEN_NT0]: 'singlescreen 0',
  [PPU_MIRRORING_SINGLESCREEN_NT1]: 'singlescreen 1',
};

export function mirroringMethodToString(method) {
  return mirrorMethods[method] || '';
}


export const JOYPAD_A = 0;
export const JOYPAD_B = 1;
export const JOYPAD_SELECT = 2;
export const JOYPAD_START = 3;
export const JOYPAD_UP = 4;
export const JOYPAD_DOWN = 5;
export const JOYPAD_LEFT = 6;
export const JOYPAD_RIGHT = 7;

const joypadNameMap = {
  UP: JOYPAD_UP,
  DOWN: JOYPAD_DOWN,
  RIGHT: JOYPAD_RIGHT,
  LEFT: JOYPAD_LEFT,
  A: JOYPAD_A,
  B: JOYPAD_B,
  SELECT: JOYPAD_SELECT,
  START: JOYPAD_START,
};
export const JOYPAD_NAME_TO_ID = (name) => {
  const foundId = joypadNameMap[name];
  if (!joypadNameMap.hasOwnProperty(name)) {
    throw new Error(`Joypad button name not recognized: "${name}"`);
  }

  return foundId;
};

const joypadIdMap = {
  [JOYPAD_UP]: 'UP',
  [JOYPAD_DOWN]: 'DOWN',
  [JOYPAD_LEFT]: 'LEFT',
  [JOYPAD_RIGHT]: 'RIGHT',
  [JOYPAD_SELECT]: 'SELECT',
  [JOYPAD_START]: 'START',
  [JOYPAD_A]: 'A',
  [JOYPAD_B]: 'B',
};
export const JOYPAD_ID_TO_NAME = (id) => {
  const foundId = joypadIdMap[id];
  if (!foundId) {
    throw new Error(`Joypad button ID not recognized: "${id}"`);
  }

  return foundId;
};

export const gClearScreenArray = (new Int32Array(SCREEN_WIDTH * SCREEN_HEIGHT)).fill(0);
