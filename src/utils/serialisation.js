import Rusha from 'rusha';

export const rusha = new Rusha();

const uintArrayCache = {};
export function uintArrayToString(uintArray) {
  // if (!(uintArray instanceof Int32Array)) {
    // throw new Error('uintArrayToString: Only accepts Int32Array parameter');
  // }
  // const cacheKey = uintArray.toString();

  // if (!uintArrayCache[cacheKey]){
  let str = '';
  for (let i = 0, strLen = uintArray.length; i < strLen; i++) {
    const saveValue = uintArray[i];
    if (saveValue > 0xFFFF) {
      throw new Error('Invalid value attempted to be serialised');
    }
    str += String.fromCharCode(saveValue);
  }

    // uintArrayCache[cacheKey] = str;
  // }
  return str;

  // return uintArrayCache[cacheKey];
}


// const stringCache = {};
export function stringToUintArray(str) {
  // if (!stringCache[stringCache]) {
  const buf = new Int32Array(str.length);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    buf[i] = str.charCodeAt(i) | 0;
  }
    // stringCache[stringCache] = buf;
  // }
  return buf;
  // return stringCache[stringCache];
}

export function blobToString(blob) {
  const url = window.webkitURL || window.URL;
  return url.createObjectURL(blob);
}
