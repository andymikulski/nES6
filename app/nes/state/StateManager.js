'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var StateManager = function () {
	function StateManager(app, createGuiComponents) {
		_classCallCheck(this, StateManager);

		this._app = app;
		this._mainboard = this._app._mainboard;
		this._renderSurface = this._app._renderSurface;

		this._loadPending = '';
		this._loadStatePending = false;
		this._saveStatePending = false;
	}

	_createClass(StateManager, [{
		key: 'quickSaveState',
		value: function quickSaveState() {
			this._saveStatePending = true;
		}
	}, {
		key: 'quickLoadState',
		value: function quickLoadState() {
			this.loadState('quicksave');
		}
	}, {
		key: 'loadState',
		value: function loadState(slotName) {
			this._loadPending = slotName;
			this._loadStatePending = true;
		}
	}, {
		key: '_doQuickSave',
		value: function _doQuickSave() {
			// push back previous quicksaves by renaming them, pushing them back in the queue
			var hash = this._mainboard.cart.getHash();
			(0, _utils.renameQuickSaveStates)("quicksave", hash, 3);
			var screen = this._renderSurface.screenshotToString();
			var state = this._mainboard.saveState();
			(0, _utils.saveState)("quicksave", hash, state, screen);
		}
	}, {
		key: '_doQuickLoad',
		value: function _doQuickLoad() {
			var state = (0, _utils.loadState)(this._loadPending, this._mainboard.cart.getHash());
			if (state) {
				this._mainboard.loadState(state);
			}
		}
	}, {
		key: 'onFrame',
		value: function onFrame() {
			if (this._mainboard.cart) {
				if (this._saveStatePending) {
					this._saveStatePending = false;
					this._doQuickSave();
				} else if (this._loadStatePending) {
					this._loadStatePending = false;
					this._doQuickLoad();
				}
			}
		}
	}]);

	return StateManager;
}();

exports.default = StateManager;