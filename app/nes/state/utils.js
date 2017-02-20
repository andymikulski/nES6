"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.getCartName = getCartName;
exports.getMetaName = getMetaName;
exports.getMetaObject = getMetaObject;
exports.setMetaObject = setMetaObject;
exports.saveState = saveState;
exports.loadState = loadState;
exports.getStateMetaData = getStateMetaData;
exports.renameState = renameState;
exports.renameQuickSaveStates = renameQuickSaveStates;
exports.saveStateSupported = saveStateSupported;
exports.saveToLocalStorage = saveToLocalStorage;
exports.loadFromLocalStorage = loadFromLocalStorage;
function compress(rawString) {

	var compressed;
	// LZString is way too slow and gives pretty much the same result, use jz.algos instead
	//compressed = LZString.compress( raw );
	var int32Array = Nes.stringToUintArray(rawString);
	compressed = Nes.uintArrayToString(new Int32Array(jz.algos.deflate(new Uint8Array(int32Array))));
	return compressed;
}

function decompress(rawString) {
	var decompressed;
	//decompressed = LZString.decompress( compressed );
	var int32Array = Nes.stringToUintArray(rawString);
	decompressed = Nes.uintArrayToString(new Int32Array(jz.algos.inflate(new Uint8Array(int32Array))));
	return decompressed;
}

function getCartName(slotName, cartName) {
	return slotName + ":" + cartName;
}

function getMetaName(cartName) {
	return "meta:" + cartName;
}

function getMetaObject(cartName) {
	var obj = loadFromLocalStorage(getMetaName(cartName));
	if (!obj) {
		obj = {
			slots: {}
		};
	}
	return obj;
}

function setMetaObject(cartName, obj) {
	saveToLocalStorage(getMetaName(cartName), obj);
}

function saveState(slotName, cartName, data, screenData) {

	if (localStorage) {
		// save state data as it's own local storage object
		saveToLocalStorage(getCartName(slotName, cartName), data);

		// add to meta data object
		var meta = getMetaObject(cartName);
		var slotMeta = {};
		if (screenData) {
			slotMeta.screen = compress(screenData);
			console.log("Saved screenshot size: " + slotMeta.screen.length + " (uncompressed: " + screenData.length + ")");
		}
		slotMeta.date = Date.now();
		meta.slots[slotName] = slotMeta;
		setMetaObject(cartName, meta);
	}
}

function loadState(slotName, cartName) {

	if (localStorage) {
		var compressed = localStorage.getItem(getCartName(slotName, cartName));
		if (compressed) {
			var compressedLength = compressed.length;
			var decompressed = decompress(compressed);
			var obj = JSON.parse(decompressed);
			console.log("Loaded data size: " + compressedLength + " (uncompressed: " + decompressed.length + ")");
			return obj;
		}
	} else {
		//( 'Browser does not support local storage' );
	}
	return null;
}

function getStateMetaData(cartName, decompressScreenData) {
	var meta = getMetaObject(cartName);
	// decompress all image data before passing it back
	if (decompressScreenData) {
		var keyNames = Object.keys(meta.slots);
		for (var keyIndex = 0; keyIndex < keyNames.length; ++keyIndex) {
			var slotName = keyNames[keyIndex];
			var slot = meta.slots[slotName];
			if (slot.screen) {
				slot.screen = decompress(slot.screen);
			}
		}
	}
	return meta;
}

function renameState(meta, slotName, newSlotName, cartName) {

	// rename data object
	var itemName = getCartName(slotName, cartName);
	var data = localStorage.getItem(itemName);
	if (data) {
		localStorage.removeItem(itemName);

		if (newSlotName) {
			var newItemName = getCartName(newSlotName, cartName);
			localStorage.setItem(newItemName, data);
		}

		// rename it in meta object
		if (newSlotName) {
			meta.slots[newSlotName] = meta.slots[slotName];
		}
		delete meta.slots[slotName];
	}
}

function renameQuickSaveStates(slotName, cartName, limitCount) {

	var meta = getMetaObject(cartName);

	// remove last quicksave.
	renameState(meta, slotName + ZERO_PAD(limitCount - 1, 2, 0), null, cartName);

	// rename any others, moving each one down. We go backwards so we don't overwrite
	for (var i = limitCount - 2; i > 0; --i) {
		renameState(meta, slotName + ZERO_PAD(i, 2, 0), slotName + ZERO_PAD(i + 1, 2, 0), cartName);
	}

	// rename main 'quicksave' slot
	renameState(meta, slotName, slotName + ZERO_PAD(1, 2, 0), cartName);

	setMetaObject(cartName, meta);
}

function saveStateSupported() {

	return !!localStorage;
}

function saveToLocalStorage(name, data) {
	if (localStorage) {
		var raw = JSON.stringify(data);
		var compressed = compress(raw);
		localStorage.setItem(name, compressed);
	}
}

function loadFromLocalStorage(name) {
	if (localStorage) {
		var compressed = localStorage.getItem(name);
		if (compressed) {
			var compressedLength = compressed.length;
			var decompressed = decompress(compressed);
			var obj = JSON.parse(decompressed);
			return obj;
		}
	}
	return null;
}