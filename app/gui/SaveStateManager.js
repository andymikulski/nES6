'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SaveStateManager = function () {
	function SaveStateManager(app, createGuiComponents) {
		_classCallCheck(this, SaveStateManager);

		this._app = app;
		this._mainboard = this._app._mainboard;
		this._renderSurface = this._app._renderSurface;

		this._loadPending = '';
		this._loadStatePending = false;
		this._saveStatePending = false;
	}

	_createClass(SaveStateManager, [{
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
			Gui.renameQuickSaveStates("quicksave", hash, 3);
			var screen = this._renderSurface.screenshotToString();
			var state = this._mainboard.saveState();
			Gui.saveState("quicksave", hash, state, screen);
		}
	}, {
		key: '_doQuickLoad',
		value: function _doQuickLoad() {
			var state = Gui.loadState(this._loadPending, this._mainboard.cart.getHash());
			if (state) {
				this._mainboard.loadState(state);
			}
		}
	}, {
		key: 'onFrame',
		value: function onFrame() {

			var that = this;
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

	return SaveStateManager;
}();

exports.default = SaveStateManager;