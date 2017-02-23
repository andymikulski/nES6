'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = mapperFactory;

var _Mapper = require('./Mapper0');

var _Mapper2 = _interopRequireDefault(_Mapper);

var _Mapper3 = require('./Mapper1');

var _Mapper4 = _interopRequireDefault(_Mapper3);

var _Mapper5 = require('./Mapper2');

var _Mapper6 = _interopRequireDefault(_Mapper5);

var _Mapper7 = require('./Mapper4');

var _Mapper8 = _interopRequireDefault(_Mapper7);

var _Mapper9 = require('./Mapper9');

var _Mapper10 = _interopRequireDefault(_Mapper9);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mapperDict = {
	0: _Mapper2.default,
	1: _Mapper4.default,
	2: _Mapper6.default,
	4: _Mapper8.default,
	9: _Mapper10.default
}; /* Estimated number of games with mapper (other mappers had <10 games)
   Mapper 004: 569
   Mapper 001: 481
   Mapper 000: 260
   Mapper 002: 200
   Mapper 003: 145
   Mapper 007: 56
   Mapper 011: 35
   Mapper 019: 32
   Mapper 016: 26
   Mapper 099: 25
   Mapper 005: 24
   Mapper 018: 16
   Mapper 066: 16
   Mapper 033: 15
   Mapper 079: 15
   Mapper 045: 14
   Mapper 071: 14
   Mapper 113: 12
   Mapper 245: 11
   Mapper 023: 11
   Mapper 069: 11
   */

function mapperFactory(mapperId, mainboard, mirroringMethod) {
	var MapperClass = mapperDict[mapperId];
	if (!mapperDict.hasOwnProperty(mapperId) || !MapperClass) {
		throw new Error('Mapper id ' + mapperId + ' is not supported');
	}
	var mapper = new MapperClass(mainboard, mirroringMethod);
	if (mapper.init) {
		mapper.init();
	}
	return mapper;
}