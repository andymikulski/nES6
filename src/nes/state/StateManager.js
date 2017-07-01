import {
	renameQuickSaveStates,
	saveState,
	loadState,
} from './utils';

export default class StateManager {
  constructor(app, createGuiComponents) {
    this._app = app;
    this._mainboard = this._app._mainboard;
    this._renderSurface = this._app._renderSurface;

    this._loadPending = '';
    this._loadStatePending = false;
    this._saveStatePending = false;
  }

  quickSaveState() {
    this._saveStatePending = true;
  }

  quickLoadState() {
    this.loadState('quicksave');
  }

  loadState(slotName) {
    this._loadPending = slotName;
    this._loadStatePending = true;
  }


  _doQuickSave() {
		// push back previous quicksaves by renaming them, pushing them back in the queue
    const hash = this._mainboard.cart.getHash();
    renameQuickSaveStates('quicksave', hash, 3);
    const screen = this._renderSurface.screenshotToString();
    const state = this._mainboard.saveState();
    saveState('quicksave', hash, state, screen);
  }


  _doQuickLoad() {
    const state = loadState(this._loadPending, this._mainboard.cart.getHash());
    if (state) {
      this._mainboard.loadState(state);
    }
  }

  onFrame() {
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
}
