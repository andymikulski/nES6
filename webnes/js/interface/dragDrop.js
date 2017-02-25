

this.Gui = this.Gui || {};

(function(){
	"use strict";



	var hookDragDropEvents = function( fileDropCallback ) {

		if (typeof window.FileReader !== 'function') {
			//alert("The file API isn't supported on this browser yet.");
			return;
		}

		function handleFileSelect(evt) {
			evt.stopPropagation();
			evt.preventDefault();
			var files = evt.dataTransfer.files; // FileList object.

			if ( files.length > 0 )
			{
				var fr = new FileReader();
				fr.onload = function() {
					if ( fileDropCallback ) {
						fileDropCallback( files[0].name, new Uint8Array( fr.result ) );
					}
				};
				fr.readAsArrayBuffer( files[0] );
			}
		}

		function handleDragOver(evt) {
			evt.stopPropagation();
			evt.preventDefault();
			evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
		}

		// Setup the dnd listeners.
		var dropZone = document.getElementById('body');
		dropZone.addEventListener('dragover', handleDragOver, false);
		dropZone.addEventListener('drop', handleFileSelect, false);
	};

	Gui.hookDragDropEvents = hookDragDropEvents;

}());
