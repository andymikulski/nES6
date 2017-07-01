import LZString from 'lz-string';

import {
	ZERO_PAD,
} from '../../config/consts.js';

import {
	uintArrayToString,
	stringToUintArray,
} from '../../utils/serialisation';


const compressCache = {};
function compress(rawString) {
  if (!compressCache[rawString]) {
    compressCache[rawString] = LZString.compress(rawString);
  }
  return compressCache[rawString];
}

const decompressCache = {};
function decompress(rawString) {
  if (!decompressCache[rawString]) {
    compressCache[rawString] = LZString.decompress(rawString);
  }
  return compressCache[rawString];
}


export function getCartName(slotName, cartName) {
  return `${slotName}:${cartName}`;
}


export function getMetaName(cartName) {
  return `meta:${cartName}`;
}


export function getMetaObject(cartName) {
  let obj = loadFromLocalStorage(getMetaName(cartName));
  if (!obj) {
    obj = {
      slots: {},
    };
  }
  return obj;
}


export function setMetaObject(cartName, obj) {
  return saveToLocalStorage(getMetaName(cartName), obj);
}


export function saveState(slotName, cartName, data, screenData) {
	// add to meta data object
  const meta = getMetaObject(cartName);
  const slotMeta = {};
  if (screenData) {
    slotMeta.screen = compress(screenData);
  }
  slotMeta.date = Date.now();
  meta.slots[slotName] = slotMeta;
  return setMetaObject(cartName, meta);
}


export function loadState(slotName, cartName) {
  if (localStorage) {
    const compressed = localStorage.getItem(getCartName(slotName, cartName));
    if (compressed) {
      const compressedLength = compressed.length;
      const decompressed = decompress(compressed);
      const obj = JSON.parse(decompressed);
      console.log(`Loaded data size: ${compressedLength} (uncompressed: ${decompressed.length})`);
      return obj;
    }
  } else {
		// ( 'Browser does not support local storage' );
  }
  return null;
}


export function getStateMetaData(cartName, decompressScreenData) {
  const meta = getMetaObject(cartName);
	// decompress all image data before passing it back
  if (decompressScreenData) {
    const keyNames = Object.keys(meta.slots);
    for (let keyIndex = 0; keyIndex < keyNames.length; ++keyIndex) {
      const slotName = keyNames[keyIndex];
      const slot = meta.slots[slotName];
      if (slot.screen) {
        slot.screen = decompress(slot.screen);
      }
    }
  }
  return meta;
}


export function renameState(meta, slotName, newSlotName, cartName) {
	// rename data object
  const itemName = getCartName(slotName, cartName);
  const data = localStorage.getItem(itemName);
  if (data) {
    localStorage.removeItem(itemName);

    if (newSlotName) {
      const newItemName = getCartName(newSlotName, cartName);
      localStorage.setItem(newItemName, data);
    }

		// rename it in meta object
    if (newSlotName) {
      meta.slots[newSlotName] = meta.slots[slotName];
    }
    delete meta.slots[slotName];
  }
}


export function renameQuickSaveStates(slotName, cartName, limitCount) {
  const meta = getMetaObject(cartName);

	// remove last quicksave.
  renameState(meta, slotName + ZERO_PAD(limitCount - 1, 2, 0), null, cartName);

	// rename any others, moving each one down. We go backwards so we don't overwrite
  for (let i = limitCount - 2; i > 0; --i) {
    renameState(meta, slotName + ZERO_PAD(i, 2, 0), slotName + ZERO_PAD(i + 1, 2, 0), cartName);
  }

	// rename main 'quicksave' slot
  renameState(meta, slotName, slotName + ZERO_PAD(1, 2, 0), cartName);

  setMetaObject(cartName, meta);
}


export function saveStateSupported() {
  return !!localStorage;
}


export function saveToLocalStorage(name, data) {
  const raw = JSON.stringify(data);
  const compressed = compress(raw);
  localStorage.setItem(name, compressed);

  return compressed;
}


export function loadFromLocalStorage(name) {
  if (localStorage) {
    const compressed = localStorage.getItem(name);
    if (compressed) {
      const compressedLength = compressed.length;
      const decompressed = decompress(compressed);
      const obj = JSON.parse(decompressed);
      return obj;
    }
  }
  return null;
}
