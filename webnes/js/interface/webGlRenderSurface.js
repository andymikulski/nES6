

this.Gui = this.Gui || {};
this.WebGl = this.WebGl || {};

(function(){
	"use strict";

	// Must be power of 2
	var TEXTURE_WIDTH = 256;
	var TEXTURE_HEIGHT = 256;


	var WebGlRenderSurface = function( canvasParent ) {

		var that = this;
		this.ready = false;

		this.clearArray = new Uint32Array( SCREEN_WIDTH * SCREEN_HEIGHT );
		this.clearArrayColour = this.clearArray[0];

		this.bufferIndexArray = new Int32Array( SCREEN_WIDTH * SCREEN_HEIGHT );
		this.offscreen32BitView = new Uint32Array( TEXTURE_WIDTH * TEXTURE_HEIGHT );
		this.offscreen8BitView = new Uint8Array( this.offscreen32BitView.buffer );

		this.element = canvasParent.getCanvasElement();
		this.glContext = WebGl.getGlContext( this.element );

		this.camera = new WebGl.OrthoCamera( this.glContext );
		this.camera.setup( SCREEN_WIDTH, SCREEN_HEIGHT );

		this.initBuffers();

		this.texture = new WebGl.FillableTexture( this.glContext, TEXTURE_WIDTH, TEXTURE_HEIGHT );

		canvasParent.connect( 'resize', function() { that._onResize(); } );

		this.inputSizeShaderArray = new Float32Array( [ SCREEN_WIDTH, SCREEN_HEIGHT ] );
		this.outputSizeShaderArray = new Float32Array( [ SCREEN_WIDTH, SCREEN_HEIGHT ] );
		this.textureSizeShaderArray = new Float32Array( [ TEXTURE_WIDTH, TEXTURE_HEIGHT ] );

		this.shader = new WebGl.ShaderProgram( this.glContext );

		this.loadShader( null, function() {
			that._ready = true;
		} );
	};


	WebGlRenderSurface.prototype.loadShader = function( shaderFilename, callback ) {

		var that = this;
		this.shader.loadAndLink( shaderFilename, function() {
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
	};


	WebGlRenderSurface.prototype._initBuffers = function() {
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

		this.vertexBuffer = new WebGl.VertexBuffer( this.glContext );
		this.vertexBuffer.setData( vertices, 4, 4 );

		this.textureCoordBuffer = new WebGl.VertexBuffer( this.glContext );
		this.textureCoordBuffer.setData( texCoords, 2, 4 );

		this.indexBuffer = new WebGl.IndexBuffer( this.glContext );
		this.indexBuffer.setData( indices, 6 );
	};


	WebGlRenderSurface.prototype._onResize = function() {
		this.glContext.viewport(0, 0, this.element.width, this.element.height);
		this.glContext.clearColor(0.0, 0.0, 0.0, 1.0);
	};


	WebGlRenderSurface.prototype.writeToBuffer = function( bufferIndex, insertIndex, colour ) {

		//if ( baseIndex < 0 || baseIndex >= this.offscreen32BitView.length ) { throw new Error( "WebGlRenderSurface.prototype.writeToBuffer: Invalid bounds" ); }
		var existingIndex = TYPED_ARRAY_GET_INT32( this.bufferIndexArray, insertIndex );
		if ( existingIndex <= bufferIndex ) {
			TYPED_ARRAY_SET_UINT32( this.offscreen32BitView, insertIndex, 0xFF000000 | colour );
			TYPED_ARRAY_SET_INT32( this.bufferIndexArray, insertIndex, bufferIndex );
		}
	};


	WebGlRenderSurface.prototype.getRenderBufferHash = function() {

		var rusha = new Rusha();
		return rusha.digestFromArrayBuffer( this.offscreen32BitView ).toUpperCase();
	};


	WebGlRenderSurface.prototype.clearBuffers = function( backgroundColour ) {

		// update clear array if background colour changes
		if ( backgroundColour !== this.clearArrayColour ) {
			for ( var i=0; i<this.clearArray.length; ++i ) {
				this.clearArray[ i ] = 0xFF000000 | backgroundColour;
			}
			this.clearArrayColour = backgroundColour;
		}

		// set background colour
		this.offscreen32BitView.set( this.clearArray );

		// Nes.ClearScreenArray is a quicker way of clearing this array
		this.bufferIndexArray.set( gClearScreenArray );
	};


	WebGlRenderSurface.prototype.render = function( mainboard ) {

		if ( !this.ready ) {
			return;
		}
		this.glContext.clear(this.glContext.COLOR_BUFFER_BIT);
		this.texture.fill( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, this.offscreen8BitView );
		this.glContext.uniform1i(this.shader.getUniformLocation("rubyFrameCount"), mainboard.ppu.frameCounter );
		this.indexBuffer.draw();
	};


	WebGlRenderSurface.prototype._createCanvasWithScreenshotOn = function() {

		// create copy of offscreen buffer into a new canvas element
		var element = document.createElement('canvas');
		element.width = SCREEN_WIDTH;
		element.height = SCREEN_HEIGHT;
		var canvas = element.getContext( "2d" );
		var imgData = canvas.getImageData( 0, 0, SCREEN_WIDTH, SCREEN_HEIGHT );
		imgData.data.set( this.offscreen8BitView.subarray( 0, SCREEN_WIDTH * SCREEN_HEIGHT * 4 ) );
		canvas.putImageData( imgData, 0, 0 );
		return element;
	};


	WebGlRenderSurface.prototype.screenshotToFile = function() {

		var element = this.createCanvasWithScreenshotOn();
		element.toBlob( function( blob ) {
			saveAs( blob, "screenshot.png" );
		});
	};


	WebGlRenderSurface.prototype.screenshotToString = function() {

		var element = this.createCanvasWithScreenshotOn();
		return element.toDataURL("image/png");
	};


	WebGlRenderSurface.prototype.loadShaderFromUrl = function( url ) {

		this.loadShader( url, function() {} );
	};


	Gui.WebGlRenderSurface = WebGlRenderSurface;

}());
