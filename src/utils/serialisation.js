import Rusha from 'rusha';
import root from 'window-or-global';

export const rusha = new Rusha();

export function uintArrayToString(uintArray) {
  let str = '';
  for (let i = 0, strLen = uintArray.length; i < strLen; i++) {
    const saveValue = uintArray[i];
    if (saveValue > 0xFFFF) {
      throw new Error('Invalid value attempted to be serialised');
    }
    str += String.fromCharCode(saveValue);
  }

  return str;
}

export function stringToUintArray(str) {
  const buf = new Int32Array(str.length);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    buf[i] = str.charCodeAt(i) | 0;
  }

  return buf;
}

export function blobToString(blob) {
  const url = root.webkitURL || root.URL;
  return url.createObjectURL(blob);
}
