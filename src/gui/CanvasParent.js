import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../config/consts';
import { EventBus } from '../nes/Event';

export default class CanvasParent extends EventBus {
	constructor( renderSurface ) {
    	super();

		this._canvasElement = document.createElement('canvas');
		this._canvasElement.classList.add('nes6-player');

		document.body.appendChild(this._canvasElement);

		this._setSize();

		window.addEventListener('resize', ()=>{
			this._setSize();
		}, true);
	}


	getCanvasElement() {
		return this._canvasElement;
	}

	_setSize() {
		const parentBounds = this._canvasElement.parentElement.getBoundingClientRect();
		var parentWidth = parentBounds.width;
		var parentHeight = parentBounds.height;

		var aspectRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
		var newWidth = aspectRatio * parentHeight;

		this._canvasElement.width = Math.floor( newWidth );
		this._canvasElement.height = parentHeight;

		this.invoke( 'resize' );
	}
}
