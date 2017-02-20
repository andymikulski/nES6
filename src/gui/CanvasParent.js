import { SCREEN_WIDTH, SCREEN_HEIGHT } from '../config/consts';
import { EventBus } from '../nes/Event';

export default class CanvasParent {
	constructor( renderSurface ) {
		var that = this;

		this._eventBus = new EventBus();
		this._parent = document.createElement('div');
		this._parent.style.cssText = 'position: absolute; height: 100%; width: 100%; top: 0px; bottom: 0px;';
		this._element = document.createElement('div');
		this._parent.appendChild( this._element );

		this._canvasElement = document.createElement('canvas');
		this._element.appendChild( this._canvasElement );

		document.body.appendChild(this._parent);

		this._setSize();

		window.addEventListener('resize', ()=>{
			this._setSize();
			this._setPosition();
		}, true);

		this._setPosition();
	}


	connect( name, cb ) {
		this._eventBus.connect( name, cb );
	}


	getCanvasElement() {
		return this._canvasElement;
	}

	_setSize() {

		const parentBounds = this._parent.getBoundingClientRect();
		var parentWidth = parentBounds.width;
		var parentHeight = parentBounds.height;

		var resizeType = 'keepAspectRatio';

		if ( resizeType === 'keepAspectRatio' ) {

			var aspectRatio = SCREEN_WIDTH / SCREEN_HEIGHT;
			var newWidth = aspectRatio * parentHeight;

			this._canvasElement.width = Math.floor( newWidth );
			this._canvasElement.height = parentHeight;

			this._eventBus.invoke( 'resize' );
		}
	}

	_setPosition() {
		this._element.style.cssText = `transform: translate(-50%, -50%); position: absolute; left: 50%; top: 50%;`;
	}
}
