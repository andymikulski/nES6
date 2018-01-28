import root from 'window-or-global';
import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../config/consts';
import { EventBus } from '../nes/Event';

export default class CanvasParent extends EventBus {
  constructor() {
    super();

    this.canvasElement = root.document.createElement('canvas');
    this.canvasElement.classList.add('nes6-player');

    root.document.body.appendChild(this.canvasElement);

    this.setSize();

    root.addEventListener('resize', () => {
      this.setSize();
    }, true);
  }


  getCanvasElement() {
    return this.canvasElement;
  }

  setSize() {
    const parentBounds = this.canvasElement.parentElement.getBoundingClientRect();
    const parentHeight = parentBounds.height;

    const aspectRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
    const newWidth = aspectRatio * parentHeight;

    this.canvasElement.width = Math.floor(newWidth);
    this.canvasElement.height = parentHeight;

    this.invoke('resize');
  }
}
