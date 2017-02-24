'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _consts = require('../../config/consts');

var _serialisation = require('../../utils/serialisation');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RenderBuffer = function () {
	function RenderBuffer(mainboard, renderSurface) {
		_classCallCheck(this, RenderBuffer);

		this._mainboard = mainboard;
		this._renderSurface = renderSurface;

		var paletteArray = [0x808080, 0xA63D00, 0xB01200, 0x960044, 0x5E00A1, 0x2800C7, 0x0006BA, 0x00178C, 0x002F5C, 0x004510, 0x004A05, 0x2E4700, 0x664100, 0x000000, 0x050505, 0x050505, 0xC7C7C7, 0xFF7700, 0xFF5521, 0xFA3782, 0xB52FEB, 0x5029FF, 0x0022FF, 0x0032D6, 0x0062C4, 0x008035, 0x008F05, 0x558A00, 0xCC9900, 0x212121, 0x090909, 0x090909, 0xFFFFFF, 0xFFD70F, 0xFFA269, 0xFF80D4, 0xF345FF, 0x8B61FF, 0x3388FF, 0x129CFF, 0x20BCFA, 0x0EE39F, 0x35F02B, 0xA4F00C, 0xFFFB05, 0x5E5E5E, 0x0D0D0D, 0x0D0D0D, 0xFFFFFF, 0xFFFCA6, 0xFFECB3, 0xEBABDA, 0xF9A8FF, 0xB3ABFF, 0xB0D2FF, 0xA6EFFF, 0x9CF7FF, 0x95E8D7, 0xAFEDA6, 0xDAF2A2, 0xFCFF99, 0xDDDDDD, 0x111111, 0x111111, 0x000000];

		this.defaultPalette32BitVals = new Uint32Array(paletteArray.length);

		for (var i = 0; i < paletteArray.length; ++i) {
			this.defaultPalette32BitVals[i] = paletteArray[i];
		}

		var that = this;
		this._clipTopAndBottomY = false;
		this._mainboard.connect('reset', function (cold) {
			that._reset(cold);
		});
		this.priorityBuffer = new Int32Array(_consts.SCREEN_WIDTH * _consts.SCREEN_HEIGHT);
		this.clearBuffer();
	}

	_createClass(RenderBuffer, [{
		key: '_reset',
		value: function _reset(cold) {

			this._clipTopAndBottomY = _consts.COLOUR_ENCODING_NAME === "NTSC";
		}
	}, {
		key: 'clearBuffer',
		value: function clearBuffer() {

			this.priorityBuffer.set(_consts.g_ClearScreenArray);
		}
	}, {
		key: 'pickColour',
		value: function pickColour(paletteIndex) {
			this.colorHash = this.colorHash || {};
			if (this.colorHash[paletteIndex]) {
				return this.colorHash[paletteIndex];
			}

			var pindex = 0;
			if (paletteIndex < 64) {
				pindex = paletteIndex;
			} else {
				pindex = 64;
			}
			this.colorHash[paletteIndex] = new Uint32Array(this.defaultPalette32BitVals)[pindex];

			return this.colorHash[paletteIndex];
		}
	}, {
		key: '_renderPixel',
		value: function _renderPixel(bufferIndex, insertIndex, y, paletteIndex) {

			if (this._clipTopAndBottomY && (y < 8 || y > 231)) {
				return;
			}

			var colour = this.pickColour(paletteIndex | 0);
			this._renderSurface.writeToBuffer(bufferIndex, insertIndex, colour);
		}
	}, {
		key: 'renderSpritePixelDebug',
		value: function renderSpritePixelDebug(spritenum, x, y) {

			//this._renderSurface.writeToBuffer( 2, x, y, 0xFFE92BFF );
		}
	}, {
		key: 'renderSpritePixel',
		value: function renderSpritePixel(spritenum, isBehind, x, y, paletteIndex) {
			var index = y * _consts.SCREEN_WIDTH + x;
			var bufferIndex = isBehind ? 0 : 2;
			if (this.priorityBuffer[index] === 0) {
				this.priorityBuffer[index] = spritenum + 1;
				this._renderPixel(bufferIndex, index, y, paletteIndex);
			}
		}
	}, {
		key: 'renderPixel',
		value: function renderPixel(x, y, paletteIndex) {
			var hitzero = false;
			var index = y * _consts.SCREEN_WIDTH + x;
			if (this.priorityBuffer[index] === 1 && x < _consts.SCREEN_WIDTH - 1) {
				hitzero = true;
			}
			this._renderPixel(1, index, y, paletteIndex);
			return hitzero;
		}
	}, {
		key: 'saveState',
		value: function saveState() {

			return {
				priorityBuffer: (0, _serialisation.uintArrayToString)(this.priorityBuffer)
			};
		}
	}, {
		key: 'loadState',
		value: function loadState(state) {

			this.priorityBuffer = (0, _serialisation.stringToUintArray)(state.priorityBuffer);
		}
	}]);

	return RenderBuffer;
}();

exports.default = RenderBuffer;