'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _BlipEqT = require('./BlipEqT.js');

var _BlipEqT2 = _interopRequireDefault(_BlipEqT);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* Copyright (C) 2003-2005 Shay Green. This module is free software; you
can redistribute it and/or modify it under the terms of the GNU Lesser
General Public License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version. This
module is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for
more details. You should have received a copy of the GNU Lesser General
Public License along with this module; if not, write to the Free Software
Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA */

// Buffer of sound samples into which band-limited waveforms can be synthesized
// using Blip_Wave or Blip_Synth.

// Blip_Buffer 0.3.3. Copyright (C) 2003-2005 Shay Green. GNU LGPL license.

var impulse_bits = 15;
var impulse_amp = 1 << impulse_bits;
var impulse_offset = Math.floor(impulse_amp / 2);
var widest_impulse_ = 24;
var blip_res_bits_ = 5;
var max_res = 1 << blip_res_bits_;

var uintArray_memcpy = function uintArray_memcpy(buf, srcIndex, destIndex, len) {
	buf.set(buf.subarray(srcIndex, srcIndex + len), destIndex);
};

var BlipImpulse = function () {
	function BlipImpulse() {
		_classCallCheck(this, BlipImpulse);

		this.impulses = null;
		this.impulse = null;
	}

	_createClass(BlipImpulse, [{
		key: 'init',
		value: function init(imps, w, r, fb) {
			this.fine_bits = fb || 0;
			this.width = w;
			this.impulses = new Uint16Array(imps.buffer);
			this.generate = true;
			this.volume_unit_ = -1.0;
			this.res = r;
			this.buf = null;

			this.impulse = new Uint16Array(this.impulses.buffer, this.width * this.res * 2 * (this.fine_bits ? 2 : 1) * 2);
			this.offset = 0;
		}

		// TODO: examine this if there are any problems

	}, {
		key: 'scale_impulse',
		value: function scale_impulse(unit, imp_in) {

			var offset = (unit << impulse_bits) - impulse_offset * unit + (1 << impulse_bits - 1);
			var impIndex = 0;
			var fimpIndex = 0;
			for (var n = Math.floor(this.res / 2) + 1; n--;) {
				var error = unit;
				for (var nn = this.width; nn--;) {
					var a = this.impulse[fimpIndex++] * unit + offset >> impulse_bits;
					error -= a - unit;
					imp_in[impIndex++] = a;
				}

				// add error to middle
				imp_in[impIndex - Math.floor(this.width / 2) - 1] += error;
			}

			if (this.res > 2) {
				// second half is mirror-image
				var revIndex = impIndex - this.width - 1;
				for (var mm = (Math.floor(this.res / 2) - 1) * this.width - 1; mm--;) {
					imp_in[impIndex++] = imp_in[--revIndex];
				}
				imp_in[impIndex++] = unit;
			}

			// copy to odd offset
			imp_in[impIndex++] = unit;
			//memcpy( imp, imp_in, (res * width - 1) * sizeof *imp );
			uintArray_memcpy(imp_in, 0, impIndex, this.res * this.width - 1);
		}
	}, {
		key: 'fine_volume_unit',
		value: function fine_volume_unit() {
			// to do: find way of merging in-place without temporary buffer

			var temp = new Uint16Array(max_res * 2 * widest_impulse_);
			this.scale_impulse((this.offset & 0xffff) << this.fine_bits, temp);
			var imp2 = this.impulse.subarray(this.res * 2 * this.width);
			this.scale_impulse(this.offset & 0xffff, imp2);

			// merge impulses
			var impIndex = 0;
			var imp2Index = 0;
			var src2Index = 0;
			for (var n = Math.floor(this.res / 2) * 2 * this.width; n--;) {
				this.impulses[impIndex++] = imp2[imp2Index++];
				this.impulses[impIndex++] = imp2[imp2Index++];
				this.impulses[impIndex++] = temp[src2Index++];
				this.impulses[impIndex++] = temp[src2Index++];
			}
		}
	}, {
		key: 'volume_unit',
		value: function volume_unit(new_unit) {
			if (new_unit === this.volume_unit_) {
				return;
			}

			if (this.generate) {
				this.treble_eq(new _BlipEqT2.default(-8.87, 8800, 44100));
			}

			this.volume_unit_ = new_unit;

			this.offset = 0x10001 * Math.floor(this.volume_unit_ * 0x10000 + 0.5);

			if (this.fine_bits) {
				this.fine_volume_unit();
			} else {
				this.scale_impulse(this.offset & 0xffff, this.impulses);
			}
		}
	}, {
		key: 'treble_eq',
		value: function treble_eq(new_eq) {

			if (!this.generate && new_eq.treble === this.eq.treble && new_eq.cutoff === this.eq.cutoff && new_eq.sample_rate === this.eq.sample_rate) {
				return; // already calculated with same parameters
			}

			var pi = 3.1415926535897932384626433832795029;

			this.generate = false;
			this.eq = new_eq;

			var treble = Math.pow(10.0, 1.0 / 20 * this.eq.treble); // dB (-6dB = 0.50)
			if (treble < 0.000005) {
				treble = 0.000005;
			}

			var treble_freq = 22050.0; // treble level at 22 kHz harmonic
			var sample_rate = this.eq.sample_rate;
			var pt = treble_freq * 2 / sample_rate;
			var cutoff = this.eq.cutoff * 2 / sample_rate;
			if (cutoff >= pt * 0.95 || cutoff >= 0.95) {
				cutoff = 0.5;
				treble = 1.0;
			}

			// DSF Synthesis (See T. Stilson & J. Smith (1996),
			// Alias-free digital synthesis of classic analog waveforms)

			// reduce adjacent impulse interference by using small part of wide impulse
			var n_harm = 4096;
			var rolloff = Math.pow(treble, 1.0 / (n_harm * pt - n_harm * cutoff));
			var rescale = 1.0 / Math.pow(rolloff, n_harm * cutoff);

			var pow_a_n = rescale * Math.pow(rolloff, n_harm);
			var pow_a_nc = rescale * Math.pow(rolloff, n_harm * cutoff);

			var total = 0.0;
			var to_angle = pi / 2 / n_harm / max_res;

			var buf = [];
			buf.length = Math.floor(max_res * (widest_impulse_ - 2) / 2);
			var size = Math.floor(max_res * (this.width - 2) / 2);
			for (var i = size; i--;) {
				var angle = (i * 2 + 1) * to_angle;

				// equivalent
				//double y =     dsf( angle, n_harm * cutoff, 1.0 );
				//y -= rescale * dsf( angle, n_harm * cutoff, rolloff );
				//y += rescale * dsf( angle, n_harm,          rolloff );

				var cos_angle = Math.cos(angle);
				var cos_nc_angle = Math.cos(n_harm * cutoff * angle);
				var cos_nc1_angle = Math.cos((n_harm * cutoff - 1.0) * angle);

				var b = 2.0 - 2.0 * cos_angle;
				var a = 1.0 - cos_angle - cos_nc_angle + cos_nc1_angle;

				var d = 1.0 + rolloff * (rolloff - 2.0 * cos_angle);
				var c = pow_a_n * rolloff * Math.cos((n_harm - 1.0) * angle) - pow_a_n * Math.cos(n_harm * angle) - pow_a_nc * rolloff * cos_nc1_angle + pow_a_nc * cos_nc_angle;

				// optimization of a / b + c / d
				var y = (a * d + c * b) / (b * d);

				// fixed window which affects wider impulses more
				if (this.width > 12) {
					var windowVar = Math.cos(n_harm / 1.25 / widest_impulse_ * angle);
					y *= windowVar * windowVar;
				}

				total += y;
				buf[i] = y;
			}

			// integrate runs of length 'max_res'
			var factor = impulse_amp * 0.5 / total; // 0.5 accounts for other mirrored half
			var impIndex = 0;
			var step = Math.floor(max_res / this.res);
			var offset = this.res > 1 ? max_res : Math.floor(max_res / 2);
			for (var n = Math.floor(this.res / 2) + 1; n--; offset -= step) {
				for (var w = -Math.floor(this.width / 2); w < Math.floor(this.width / 2); w++) {
					var sum = 0;
					for (var k = max_res; k--;) {
						var index = w * max_res + offset + k;
						if (index < 0) {
							index = -index - 1;
						}
						if (index < size) {
							sum += buf[index];
						}
					}
					this.impulse[impIndex++] = Math.floor(sum * factor + (impulse_offset + 0.5));
				}
			}

			// rescale
			var unit = this.volume_unit_;
			if (unit >= 0) {
				this.volume_unit_ = -1;
				this.volume_unit(unit);
			}
		}
	}]);

	return BlipImpulse;
}();

exports.default = BlipImpulse;