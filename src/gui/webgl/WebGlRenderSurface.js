import {
	SCREEN_WIDTH,
	SCREEN_HEIGHT,
	g_ClearScreenArray
} from '../../config/consts';

import { saveAs } from 'file-saver';

import { rusha } from '../../utils/serialisation';

import {
	getGlContext,
	OrthoCamera,
	FillableTexture,
	ShaderProgram,
	VertexBuffer,
	IndexBuffer,
} from './utils';

// Must be power of 2
const TEXTURE_WIDTH = 256;
const TEXTURE_HEIGHT = 256;


export default class WebGlRenderSurface {
	constructor( canvasParent ) {
		this._ready = false;

		this._clearArray = new Uint32Array( SCREEN_WIDTH * SCREEN_HEIGHT );
		this._clearArrayColour = this._clearArray[0];

		this._bufferIndexArray = new Int32Array( SCREEN_WIDTH * SCREEN_HEIGHT );
		this._offscreen32BitView = new Uint32Array( TEXTURE_WIDTH * TEXTURE_HEIGHT );
		this._offscreen8BitView = new Uint8Array( this._offscreen32BitView.buffer );

		this._element = canvasParent.getCanvasElement();
		this._glContext = getGlContext( this._element );

		this._camera = new OrthoCamera( this._glContext );
		this._camera.setup( SCREEN_WIDTH, SCREEN_HEIGHT );

		this._initBuffers();

		this._texture = new FillableTexture( this._glContext, TEXTURE_WIDTH, TEXTURE_HEIGHT );

		canvasParent.connect( 'resize', ::this._onResize );

		this._inputSizeShaderArray = new Float32Array( [ SCREEN_WIDTH, SCREEN_HEIGHT ] );
		this._outputSizeShaderArray = new Float32Array( [ SCREEN_WIDTH, SCREEN_HEIGHT ] );
		this._textureSizeShaderArray = new Float32Array( [ TEXTURE_WIDTH, TEXTURE_HEIGHT ] );

		this._shader = new ShaderProgram( this._glContext );

		this.loadShader( null, ()=>{
			this._ready = true;
		});
	}


	loadShader( shaderFilename, callback ) {

		var that = this;
		this._shader.loadAndLink( shaderFilename, function() {
			that._shader.use();

			that._glContext.uniform2fv(that._shader.getUniformLocation("rubyInputSize"), that._inputSizeShaderArray );
			that._glContext.uniform2fv(that._shader.getUniformLocation("rubyOutputSize"), that._outputSizeShaderArray );
			that._glContext.uniform2fv(that._shader.getUniformLocation("rubyTextureSize"), that._textureSizeShaderArray );

			that._glContext.uniformMatrix4fv( that._shader.getUniformLocation("aModelViewProjectionMatrix"), false, that._camera.getMVPMatrix() );

			that._vertexBuffer.bind( that._shader.getAttrib( "aVertexPosition" ) );
			that._textureCoordBuffer.bind( that._shader.getAttrib( "aTextureCoord" ) );
			that._indexBuffer.bind();
			that._texture.bind();

			that._glContext.uniform1i(that._shader.getUniformLocation("rubyTexture"), 0); //Texture unit 0 is for base images.

			callback();
		}  );
	}


	_initBuffers() {
		var t = SCREEN_WIDTH / TEXTURE_WIDTH;
		var u = SCREEN_HEIGHT / TEXTURE_HEIGHT;

		var vertices = new Float32Array( [
				0, 0,							0.0, 1.0,
				SCREEN_WIDTH,	0,				0.0, 1.0,
				SCREEN_WIDTH,	SCREEN_HEIGHT,	0.0, 1.0,
				0,				SCREEN_HEIGHT,	0.0, 1.0
			] );
		var texCoords = new Float32Array( [
				0.0,	0.0,
				t,		0.0,
				t,		u,
				0.0,	u
			] );
		var indices = new Uint16Array( [ 0, 1, 2,	0, 2, 3 ] );

		this._vertexBuffer = new VertexBuffer( this._glContext );
		this._vertexBuffer.setData( vertices, 4, 4 );

		this._textureCoordBuffer = new VertexBuffer( this._glContext );
		this._textureCoordBuffer.setData( texCoords, 2, 4 );

		this._indexBuffer = new IndexBuffer( this._glContext );
		this._indexBuffer.setData( indices, 6 );
	}


	_onResize() {
		this._glContext.viewport(0, 0, this._element.width, this._element.height);
		this._glContext.clearColor(0.0, 0.0, 0.0, 1.0);
	}


	writeToBuffer( bufferIndex, insertIndex, colour ) {

		var existingIndex = this._bufferIndexArray[insertIndex];
		if ( existingIndex <= bufferIndex ) {
			this._offscreen32BitView[insertIndex] = 0xFF000000 | colour;
			this._bufferIndexArray[insertIndex] = bufferIndex;
		}
	}


	getRenderBufferHash() {
		return rusha.digestFromArrayBuffer( this._offscreen32BitView ).toUpperCase();
	}


	clearBuffers( backgroundColour ) {

		// update clear array if background colour changes
		if ( backgroundColour !== this._clearArrayColour ) {
			for ( var i=0; i<this._clearArray.length; ++i ) {
				this._clearArray[ i ] = 0xFF000000 | backgroundColour;
			}
			this._clearArrayColour = backgroundColour;
		}

		// set background colour
		this._offscreen32BitView.set( this._clearArray );

		// Nes.ClearScreenArray is a quicker way of clearing this array
		this._bufferIndexArray.set( g_ClearScreenArray );
	}


	render( mainboard ) {

		if ( !this._ready ) {
			return;
		}
		this._glContext.clear(this._glContext.COLOR_BUFFER_BIT);
		this._texture.fill( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, this._offscreen8BitView );
		this._glContext.uniform1i(this._shader.getUniformLocation("rubyFrameCount"), mainboard.ppu.frameCounter );
		this._indexBuffer.draw();
	}


	_createCanvasWithScreenshotOn() {

		// create copy of offscreen buffer into a new canvas element
		var element = document.createElement('canvas');
		element.width = SCREEN_WIDTH;
		element.height = SCREEN_HEIGHT;
		var canvas = element.getContext( "2d" );
		var imgData = canvas.getImageData( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
		imgData.data.set( this._offscreen8BitView.subarray( 0, SCREEN_WIDTH * SCREEN_HEIGHT * 4 ) );
		canvas.putImageData( imgData, 0, 0 );
		return element;
	}


	screenshotToFile() {
		var element = this._createCanvasWithScreenshotOn();
		element.toBlob( function( blob ) {
			saveAs( blob, "screenshot.png" );
		});
	}


	screenshotToString() {
		var element = this._createCanvasWithScreenshotOn();
		return element.toDataURL("image/png");
	}


	loadShaderFromUrl( url ) {
		this.loadShader( url, function() {} );
	}
}
