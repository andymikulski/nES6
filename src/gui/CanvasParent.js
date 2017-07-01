import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../config/consts';
import { EventBus } from '../nes/Event';

export default class CanvasParent extends EventBus {
  constructor(renderSurface) {
    	super();

    this._canvasElement = document.createElement('canvas');
    this._canvasElement.classList.add('nes6-player');

    document.body.appendChild(this._canvasElement);

    this._setSize();

    window.addEventListener('resize', () => {
      this._setSize();
    }, true);
  }


  getCanvasElement() {
    return this._canvasElement;
  }

  _setSize() {
    const parentBounds = this._canvasElement.parentElement.getBoundingClientRect();
    const parentWidth = parentBounds.width;
    const parentHeight = parentBounds.height;

    const aspectRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
    const newWidth = aspectRatio * parentHeight;

    this._canvasElement.width = Math.floor(newWidth);
    this._canvasElement.height = parentHeight;

    this.invoke('resize');
  }
}
