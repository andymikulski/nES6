


"use strict";


function ASSERT_NUMBER( num ) {
	if ( ( typeof num !== 'number' ) || isNaN( num ) || !isFinite( num ) ) {
		throw new Error( "ASSERT_NUMBER: Invalid parameter" );
	}
};


function TYPED_ARRAY_GET_UINT32( array, offset ) {

	if ( !( array instanceof Uint32Array ) || ( typeof offset !== 'number' ) ) {
		throw new Error( "Invalid parameter" );
	}
	if ( offset < 0 || offset >= array.length ) {
		throw new Error( "Out of bounds" );
	}
	return array[ offset ];
};


function TYPED_ARRAY_GET_INT32( array, offset ) {

	if ( !( array instanceof Int32Array ) || ( typeof offset !== 'number' ) ) {
		throw new Error( "Invalid parameter" );
	}
	if ( offset < 0 || offset >= array.length ) {
		throw new Error( "Out of bounds" );
	}
	return array[ offset ];
};


function TYPED_ARRAY_SET_UINT32( array, offset, data ) {

	if ( !( array instanceof Uint32Array ) || ( typeof offset !== 'number' ) || ( typeof data !== 'number' ) ) {
		throw new Error( "Invalid parameter" );
	}
	if ( offset < 0 || offset >= array.length ) {
		throw new Error( "Out of bounds" );
	}
	array[ offset ] = data;
};


function TYPED_ARRAY_SET_INT32( array, offset, data ) {

	if ( !( array instanceof Int32Array ) || ( typeof offset !== 'number' ) || ( typeof data !== 'number' ) ) {
		throw new Error( "Invalid parameter" );
	}
	if ( offset < 0 || offset >= array.length ) {
		throw new Error( "Out of bounds" );
	}
	array[ offset ] = data;
};

