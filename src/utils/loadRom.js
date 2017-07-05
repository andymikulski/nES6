/* global XMLHttpRequest*/

export function decompressIfNecessary(name, binaryString, completeCallback) {
  if (name.match(/\.nes$/i)) {
    // uncompressed file
    completeCallback(null, binaryString);
  } else {
    throw new Error(`Unsupported file extension for file ${name}`);
  }
}

export function getRomNameFromUrl(url) {
  const slashIndex = url.lastIndexOf('/');
  if (slashIndex >= 0) {
    return url.slice(slashIndex + 1);
  }
  return url;
}

export function loadRomFromUrl(url, callback) {
  // Load using a bog standard XHR request as then we can load as binary
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.overrideMimeType('application/octet-stream');
  xhr.onerror = function onLoadRomError(err) {
    callback(err);
  };
  xhr.onload = function onLoadRomSuccess() {
    if (xhr.status === 200) {
      // The raw response is cast appropriately later
      // #TODO change `this.response` to something that doesn't refer to `this`
      callback(null, getRomNameFromUrl(url), this.response);
    } else {
      callback(`Error loading rom file from URL: ${url} HTTP code: ${xhr.status}`);
    }
  };

  xhr.send();
}
