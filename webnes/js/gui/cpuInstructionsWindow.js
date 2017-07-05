

this.Nes = this.Nes || {};

(function(){
	"use strict";

	// var CpuInstructionsWindow = function( mainboard, divElement ) {

		// var that = this;
		// this.strArray = [];
		// this.dataArray = [];
		// this.element = document.createElement('textarea');
		// this.element.rows = 10;
		// this.element.cols = 40;
		// divElement.appendChild( this.element );
		// this.mainboard = mainboard;
		// this.mainboard.connect( 'reset', function() { that._reset(); } );
		// this.mainboard.cpu.setExecuteCallback( function( programCounter, instruction, instructionBytes, addressingModeArgs ) {
			// that._onCpuExecute( programCounter, instruction, instructionBytes, addressingModeArgs );
		// } );
	// };


	// CpuInstructionsWindow.prototype._reset = function() {

		// // run decompiler, display current position in window

	// };


	// CpuInstructionsWindow.prototype._onCpuExecute = function( programCounter, instruction, instructionBytes, addressingModeArgs ) {

		// // get next instruction details
		// var currentProgramCounter = this.mainboard.cpu.programCounter;
		// var nextOpCode = this.mainboard.memory.read8( currentProgramCounter );
		// var nextInstruction = Nes.getInstructionByOpcode( nextOpCode );

		// // is next instruction break pointed?
		// if ( this.mainboard.cpu.isRunning ) {
			// this.mainboard.cpu.breakPoint( false );
		// }

	// //	this.addData( [ programCounter, instruction, instructionBytes, addressingModeArgs ] );

		// //if ( !instruction.legal ) {
		// //	this.onTextRefresh( true );
		// //	debugger;
		// //}

		// // if ( instruction.name === "BRK" ) {
		// // //	this.onTextRefresh( true );
			// // debugger;
		// // }
	// };


	// Nes.CpuInstructionsWindow = CpuInstructionsWindow;

}());
