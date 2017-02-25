const uintArrayCache = {};
export function uintArrayToString(uintArray) {
  if (!(uintArray instanceof Int32Array)) {
    throw new Error('uintArrayToString: Only accepts Int32Array parameter');
  }
  const cacheKey = uintArray.toString();

  if (!uintArrayCache[cacheKey]){
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


const stringCache = {};
export function stringToUintArray(str) {
  if (!stringCache[stringCache]) {
    var buf = new Int32Array(str.length);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
      buf[i] = str.charCodeAt(i) | 0;
    }
    stringCache[stringCache] = buf;
  }

  return stringCache[stringCache];
};

export function blobToString(blob) {
  var url = window.webkitURL || window.URL;
  return url.createObjectURL(blob);
};
