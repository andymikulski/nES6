import {
  renameQuickSaveStates,
  saveState,
  loadState,
} from './utils';

export default class StateManager {
  constructor(app, createGuiComponents) {
    this.app = app;
    this.mainboard = this.app.mainboard;
    this.renderSurface = this.app.renderSurface;

    this.loadPending = '';
    this.loadStatePending = false;
    this.saveStatePending = false;
  }

  quickSaveState() {
    this.saveStatePending = true;
  }

  quickLoadState() {
    this.loadState('quicksave');
  }

  loadState(slotName) {
    this.loadPending = slotName;
    this.loadStatePending = true;
  }


  doQuickSave() {
    // push back previous quicksaves by renaming them, pushing them back in the queue
    const hash = this.mainboard.cart.getHash();
    renameQuickSaveStates('quicksave', hash, 3);
    const screen = this.renderSurface.screenshotToString();
    const state = this.mainboard.saveState();
    saveState('quicksave', hash, state, screen);
  }


  doQuickLoad() {
    const state = loadState(this.loadPending, this.mainboard.cart.getHash());
    if (state) {
      this.mainboard.loadState(state);
    }
  }

  onFrame() {
    if (this.mainboard.cart) {
      if (this.saveStatePending) {
        this.saveStatePending = false;
        this.doQuickSave();
      } else if (this.loadStatePending) {
        this.loadStatePending = false;
        this.doQuickLoad();
      }
    }
  }
}
