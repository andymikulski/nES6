


(function() {
  try {
    var a = new Uint8Array(1);
    return; //no need
	console.log( "Using TypedArrays polyfill. Performance will be drastically reduced" );
  } catch(e) { }

  function subarray(start, end) {
    return this.slice(start, end);
  }

  function set_(array, offset) {
    if (arguments.length < 2) offset = 0;
    for (var i = 0, n = array.length; i < n; ++i, ++offset)
      this[offset] = array[i] & 0xFF;
  }

  // we need typed arrays
  function TypedArray(arg1) {
    var result;
    if (typeof arg1 === "number") {
       result = new Array(arg1);
       for (var i = 0; i < arg1; ++i)
         result[i] = 0;
    } else
       result = arg1.slice(0);
    result.subarray = subarray;
    result.buffer = result;
    result.byteLength = result.length;
    result.set = set_;
    if (typeof arg1 === "object" && arg1.buffer)
      result.buffer = arg1.buffer;

    return result;
  }

  window.Uint8Array = TypedArray;
  window.Uint32Array = TypedArray;
  window.Int32Array = TypedArray;
})();


// ArrayBuffer.slice polyfill http://stackoverflow.com/questions/10100798/whats-the-most-straightforward-way-to-copy-an-arraybuffer-object
if (!ArrayBuffer.prototype.slice) {
	ArrayBuffer.prototype.slice = function (start, end) {
		var that = new Uint8Array(this);
		if (end == undefined) end = that.length;
		var result = new ArrayBuffer(end - start);
		var resultArray = new Uint8Array(result);
		for (var i = 0; i < resultArray.length; i++)
		   resultArray[i] = that[i + start];
		return result;
	}
}
