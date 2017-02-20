export function decompressIfNecessary(name, binaryString, completeCallback) {
	if (name.match(/\.nes$/i)) {
		// uncompressed file
		completeCallback(null, binaryString);
	} else {
		throw new Error("Unsupported file extension for file " + name);
	}
}

export function getRomNameFromUrl(url) {
	var slashIndex = url.lastIndexOf('/');
	if (slashIndex >= 0) {
		return url.slice(slashIndex + 1);
	}
	return url;
}

export function loadRomFromUrl(url, callback) {
	// Load using a bog standard XHR request as then we can load as binary
	var that = this;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.responseType = 'arraybuffer';
	xhr.overrideMimeType("application/octet-stream");
	xhr.onerror = function(err) {
		callback(err);
	};
	xhr.onload = function(err) {
		if (xhr.status === 200) {
			var binaryString = new Uint8Array(this.response);
			callback(null, getRomNameFromUrl(url), binaryString);
		} else {
			callback(`Error loading rom file from URL: ${url} HTTP code: ${xhr.status}`);
		}
	};

	xhr.send();
}
