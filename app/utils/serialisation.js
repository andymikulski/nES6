'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uintArrayToString = uintArrayToString;
exports.stringToUintArray = stringToUintArray;
exports.blobToString = blobToString;
function uintArrayToString(uintArray) {
  if (!(uintArray instanceof Int32Array)) {
    throw new Error('uintArrayToString: Only accepts Int32Array parameter');
  }
  var str = '';
  for (var i = 0, strLen = uintArray.length; i < strLen; i++) {
    var saveValue = uintArray[i];
    if (saveValue > 0xFFFF) {
      throw new Error("Invalid value attempted to be serialised");
    }
    str += String.fromCharCode(saveValue);
  }
  return str;
};

function stringToUintArray(str) {
  var buf = new Int32Array(str.length);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    buf[i] = str.charCodeAt(i) | 0;
  }
  return buf;
};

function blobToString(blob) {
  var url = window.webkitURL || window.URL;
  return url.createObjectURL(blob);
};