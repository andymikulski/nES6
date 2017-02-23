'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _consts = require('../config/consts');

var _Event = require('../nes/Event');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CanvasParent = function () {
	function CanvasParent(renderSurface) {
		var _this = this;

		_classCallCheck(this, CanvasParent);

		var that = this;

		this._eventBus = new _Event.EventBus();
		this._parent = document.createElement('div');
		this._parent.style.cssText = 'position: absolute; height: 100%; width: 100%; top: 0px; bottom: 0px;';
		this._element = document.createElement('div');
		this._parent.appendChild(this._element);

		this._canvasElement = document.createElement('canvas');
		this._element.appendChild(this._canvasElement);

		document.body.appendChild(this._parent);

		this._setSize();

		window.addEventListener('resize', function () {
			_this._setSize();
			_this._setPosition();
		}, true);

		this._setPosition();
	}

	_createClass(CanvasParent, [{
		key: 'connect',
		value: function connect(name, cb) {
			this._eventBus.connect(name, cb);
		}
	}, {
		key: 'getCanvasElement',
		value: function getCanvasElement() {
			return this._canvasElement;
		}
	}, {
		key: '_setSize',
		value: function _setSize() {

			var parentBounds = this._parent.getBoundingClientRect();
			var parentWidth = parentBounds.width;
			var parentHeight = parentBounds.height;

			var resizeType = 'keepAspectRatio';

			if (resizeType === 'keepAspectRatio') {

				var aspectRatio = _consts.SCREEN_WIDTH / _consts.SCREEN_HEIGHT;
				var newWidth = aspectRatio * parentHeight;

				this._canvasElement.width = Math.floor(newWidth);
				this._canvasElement.height = parentHeight;

				this._eventBus.invoke('resize');
			}
		}
	}, {
		key: '_setPosition',
		value: function _setPosition() {
			this._element.style.cssText = 'transform: translate(-50%, -50%); position: absolute; left: 50%; top: 50%;';
		}
	}]);

	return CanvasParent;
}();

exports.default = CanvasParent;