'use strict';

var _NES = require('./NES.js');

var _NES2 = _interopRequireDefault(_NES);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = new _NES2.default();
App.start();

App.loadRomFromUrl('/SuperMarioBros.nes');

// loadRomFromUrl
// enterGameGenieCode