'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Dmc = exports.Noise = exports.Triangle = exports.Square = exports.Envelope = exports.Osc = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* Copyright (C) 2003-2005 Shay Green. This module is free software; you
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     can redistribute it and/or modify it under the terms of the GNU Lesser
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     General Public License as published by the Free Software Foundation; either
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     version 2.1 of the License, or (at your option) any later version. This
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     module is distributed in the hope that it will be useful, but WITHOUT ANY
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     more details. You should have received a copy of the GNU Lesser General
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     Public License along with this module; if not, write to the Free Software
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307 USA */

var _BlipSynth = require('./BlipSynth');

var _BlipSynth2 = _interopRequireDefault(_BlipSynth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var no_irq = 1073741824;

var Osc = exports.Osc = function () {
	function Osc() {
		_classCallCheck(this, Osc);

		this.regs = new Uint8Array(4);
		this.reg_written = [false, false, false, false];
		this.output = null;
		this.length_counter = 0; // length counter (0 if unused by oscillator)
		this.delay = 0; // delay until next (potential) transition
		this.last_amp = 0; // last amplitude oscillator was outputting
	}

	_createClass(Osc, [{
		key: 'clock_length',
		value: function clock_length(halt_mask) {
			if (this.length_counter > 0 && (this.regs[0] & halt_mask) === 0) {
				this.length_counter--;
			}
		}
	}, {
		key: 'period',
		value: function period(halt_mask) {
			return (this.regs[3] & 7) * 0x100 + (this.regs[2] & 0xff);
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.delay = 0;
			this.last_amp = 0;
		}
	}, {
		key: 'update_amp',
		value: function update_amp(amp) {
			var delta = amp - this.last_amp;
			this.last_amp = amp;
			return delta;
		}
	}]);

	return Osc;
}();

var Envelope = exports.Envelope = function (_Osc) {
	_inherits(Envelope, _Osc);

	function Envelope() {
		_classCallCheck(this, Envelope);

		var _this = _possibleConstructorReturn(this, (Envelope.__proto__ || Object.getPrototypeOf(Envelope)).call(this));

		_this.envelope = 0;
		_this.env_delay = 0;
		return _this;
	}

	_createClass(Envelope, [{
		key: 'clock_envelope',
		value: function clock_envelope() {
			var period = this.regs[0] & 15;
			if (this.reg_written[3]) {
				this.reg_written[3] = false;
				this.env_delay = period;
				this.envelope = 15;
			} else if (--this.env_delay < 0) {
				this.env_delay = period;
				if (this.envelope | this.regs[0] & 0x20) {
					this.envelope = this.envelope - 1 & 15;
				}
			}
		}
	}, {
		key: 'volume',
		value: function volume() {
			return this.length_counter === 0 ? 0 : this.regs[0] & 0x10 ? this.regs[0] & 15 : this.envelope;
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.envelope = 0;
			this.env_delay = 0;
			Osc.prototype.reset.call(this);
		}
	}]);

	return Envelope;
}(Osc);

var Square = exports.Square = function (_Envelope) {
	_inherits(Square, _Envelope);

	function Square() {
		_classCallCheck(this, Square);

		var _this2 = _possibleConstructorReturn(this, (Square.__proto__ || Object.getPrototypeOf(Square)).call(this));

		_this2.phase = 0;
		_this2.sweep_delay = 0;
		_this2.synth = null;
		return _this2;
	}

	_createClass(Square, [{
		key: 'clock_sweep',
		value: function clock_sweep(negative_adjust) {
			var sweep = this.regs[1];

			if (--this.sweep_delay < 0) {
				this.reg_written[1] = true;

				var period = this.period();
				var shift = sweep & Square.shift_mask;
				if (shift && sweep & 0x80 && period >= 8) {
					var offset = period >> shift;

					if (sweep & Square.negate_flag) {
						offset = negative_adjust - offset;
					}

					if (period + offset < 0x800) {
						period += offset;
						// rewrite period
						this.regs[2] = period & 0xff;
						this.regs[3] = this.regs[3] & 0xF8 | period >> 8 & 7;
					}
				}
			}

			if (this.reg_written[1]) {
				this.reg_written[1] = false;
				this.sweep_delay = sweep >> 4 & 7;
			}
		}
	}, {
		key: 'run',
		value: function run(time, end_time) {
			if (!this.output) return;

			var volume = this.volume();
			var period = this.period();
			var offset = period >> (this.regs[1] & Square.shift_mask);
			if (this.regs[1] & Square.negate_flag) {
				offset = 0;
			}

			var timer_period = (period + 1) * 2;
			if (volume === 0 || period < 8 || period + offset >= 0x800) {
				if (this.last_amp) {
					this.synth.offset(time, -this.last_amp, this.output);
					this.last_amp = 0;
				}

				time += this.delay;
				if (time < end_time) {
					// maintain proper phase
					var count = Math.floor((end_time - time + timer_period - 1) / timer_period);
					this.phase = this.phase + count & Square.phase_range - 1;
					time += count * timer_period;
				}
			} else {
				// handle duty select
				var duty_select = this.regs[0] >> 6 & 3;
				var duty = 1 << duty_select; // 1, 2, 4, 2
				var amp = 0;
				if (duty_select === 3) {
					duty = 2; // negated 25%
					amp = volume;
				}
				if (this.phase < duty) {
					amp ^= volume;
				}

				var delta = this.update_amp(amp);
				if (delta) {
					this.synth.offset(time, delta, this.output);
				}

				time += this.delay;
				if (time < end_time) {
					delta = amp * 2 - volume;

					do {
						this.phase = this.phase + 1 & Square.phase_range - 1;
						if (this.phase === 0 || this.phase === duty) {
							delta = -delta;
							this.synth.offset_inline(time, delta, this.output);
						}
						time += timer_period;
					} while (time < end_time);

					this.last_amp = delta + volume >> 1;
				}
			}

			this.delay = time - end_time;
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.sweep_delay = 0;
			Envelope.prototype.reset.call(this);
		}
	}]);

	return Square;
}(Envelope);

Square.negate_flag = 0x08;
Square.shift_mask = 0x07;
Square.phase_range = 8;

var Triangle = exports.Triangle = function (_Osc2) {
	_inherits(Triangle, _Osc2);

	function Triangle() {
		_classCallCheck(this, Triangle);

		var _this3 = _possibleConstructorReturn(this, (Triangle.__proto__ || Object.getPrototypeOf(Triangle)).call(this));

		_this3.phase = _this3.phase_range;
		_this3.linear_counter = 0;
		_this3.synth = new _BlipSynth2.default(_BlipSynth2.default.blip_good_quality, 15);
		return _this3;
	}

	_createClass(Triangle, [{
		key: 'reset',
		value: function reset() {
			this.phase = Triangle.phase_range;
			this.linear_counter = 0;
			Osc.prototype.reset.call(this);
		}
	}, {
		key: 'run',
		value: function run(time, end_time) {
			if (!this.output) return;

			// to do: track phase when period < 3
			// to do: Output 7.5 on dac when period < 2? More accurate, but results in more clicks.

			var delta = this.update_amp(this.calc_amp());
			if (delta) {
				this.synth.offset(time, delta, this.output);
			}

			time += this.delay;
			var timer_period = this.period() + 1;
			if (this.length_counter === 0 || this.linear_counter === 0 || timer_period < 3) {
				time = end_time;
			} else if (time < end_time) {
				var volume = 1;
				if (this.phase > Triangle.phase_range) {
					this.phase -= Triangle.phase_range;
					volume = -volume;
				}

				do {
					if (--this.phase === 0) {
						this.phase = Triangle.phase_range;
						volume = -volume;
					} else {
						this.synth.offset_inline(time, volume, this.output);
					}

					time += timer_period;
				} while (time < end_time);

				if (volume < 0) {
					this.phase += Triangle.phase_range;
				}
				this.last_amp = this.calc_amp();
			}
			this.delay = time - end_time;
		}
	}, {
		key: 'clock_linear_counter',
		value: function clock_linear_counter() {
			if (this.reg_written[3]) {
				this.linear_counter = this.regs[0] & 0x7f;
			} else if (this.linear_counter) {
				this.linear_counter--;
			}

			if (!(this.regs[0] & 0x80)) {
				this.reg_written[3] = false;
			}
		}
	}, {
		key: 'calc_amp',
		value: function calc_amp() {
			var amp = Triangle.phase_range - this.phase;
			if (amp < 0) {
				amp = this.phase - (Triangle.phase_range + 1);
			}
			return amp;
		}
	}]);

	return Triangle;
}(Osc);

Triangle.phase_range = 16;


var noise_period_table = [0x004, 0x008, 0x010, 0x020, 0x040, 0x060, 0x080, 0x0A0, 0x0CA, 0x0FE, 0x17C, 0x1FC, 0x2FA, 0x3F8, 0x7F2, 0xFE4];

var Noise = exports.Noise = function (_Envelope2) {
	_inherits(Noise, _Envelope2);

	function Noise() {
		_classCallCheck(this, Noise);

		var _this4 = _possibleConstructorReturn(this, (Noise.__proto__ || Object.getPrototypeOf(Noise)).call(this));

		_this4.noise = 0x4000;
		_this4.synth = new _BlipSynth2.default(_BlipSynth2.default.blip_med_quality, 15);
		return _this4;
	}

	_createClass(Noise, [{
		key: 'run',
		value: function run(time, end_time) {
			if (!this.output) return;

			var volume = this.volume();
			var amp = this.noise & 1 ? volume : 0;
			var delta = this.update_amp(amp);
			if (delta) {
				this.synth.offset(time, delta, this.output);
			}

			time += this.delay;
			if (time < end_time) {
				var mode_flag = 0x80;

				var period = noise_period_table[this.regs[2] & 15];
				if (!volume) {
					// round to next multiple of period
					time += Math.floor((end_time - time + period - 1) / period) * period;

					// approximate noise cycling while muted, by shuffling up noise register
					// to do: precise muted noise cycling?
					if (!(this.regs[2] & mode_flag)) {
						var feedback = this.noise << 13 ^ this.noise << 14;
						this.noise = feedback & 0x4000 | this.noise >> 1;
					}
				} else {
					// using resampled time avoids conversion in synth.offset()
					var rperiod = this.output.resampled_duration(period);
					var rtime = this.output.resampled_time(time);

					delta = amp * 2 - volume;
					var tap = this.regs[2] & mode_flag ? 8 : 13;

					do {
						var feedback2 = this.noise << tap ^ this.noise << 14;
						time += period;

						if (this.noise + 1 & 2) {
							// bits 0 and 1 of noise differ
							delta = -delta;
							this.synth.offset_resampled(rtime, delta, this.output);
						}

						rtime += rperiod;
						this.noise = feedback2 & 0x4000 | this.noise >> 1;
					} while (time < end_time);

					this.last_amp = delta + volume >> 1;
				}
			}

			this.delay = time - end_time;
		}
	}, {
		key: 'reset',
		value: function reset() {
			this.noise = 0x4000;
			Envelope.prototype.reset.call(this);
		}
	}]);

	return Noise;
}(Envelope);

var dmc_period_table = [[0x1ac, 0x17c, 0x154, 0x140, 0x11e, 0x0fe, 0x0e2, 0x0d6, // NTSC
0x0be, 0x0a0, 0x08e, 0x080, 0x06a, 0x054, 0x048, 0x036], [0x18e, 0x161, 0x13c, 0x129, 0x10a, 0x0ec, 0x0d2, 0x0c7, // PAL (totally untested)
0x0b1, 0x095, 0x084, 0x077, 0x062, 0x04e, 0x043, 0x032 // to do: verify PAL periods
]];

var dac_table = [0, 0, 1, 2, 2, 3, 3, 4, 5, 5, 6, 7, 7, 8, 8, 9, 10, 10, 11, 11, 12, 13, 13, 14, 14, 15, 15, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30, 31, 31, 32, 32, 32, 33, 33, 34, 34, 35, 35, 35, 36, 36, 37, 37, 38, 38, 38, 39, 39, 40, 40, 40, 41, 41, 42, 42, 42, 43, 43, 44, 44, 44, 45, 45, 45, 46, 46, 47, 47, 47, 48, 48, 48, 49, 49, 49, 50, 50, 50, 51, 51, 51, 52, 52, 52, 53, 53, 53, 54, 54, 54, 55, 55, 55, 56, 56, 56, 57, 57, 57];

var loop_flag = 0x40;

var Dmc = exports.Dmc = function (_Osc3) {
	_inherits(Dmc, _Osc3);

	function Dmc(apu) {
		_classCallCheck(this, Dmc);

		var _this5 = _possibleConstructorReturn(this, (Dmc.__proto__ || Object.getPrototypeOf(Dmc)).call(this));

		_this5.apu = apu;
		_this5.address = 0;
		_this5.dac = 0;
		_this5.buf = 0;
		_this5.bits_remain = 1;
		_this5.bits = 0;
		_this5.buf_empty = true;
		_this5.silence = true;
		_this5.next_irq = no_irq;
		_this5.irq_flag = false;
		_this5.irq_enabled = false;
		_this5.periodValue = 0;
		_this5.pal_mode = 0;
		_this5.nonlinear = false;

		_this5.rom_reader = null;

		_this5.synth = new _BlipSynth2.default(_BlipSynth2.default.blip_med_quality, 127);
		//Blip_Synth<blip_med_quality,127> synth;
		return _this5;
	}

	_createClass(Dmc, [{
		key: 'run',
		value: function run(time, end_time) {
			if (!this.output) return;

			var delta = this.update_amp(this.dac);
			if (delta) {
				this.synth.offset(time, delta, this.output);
			}

			time += this.delay;
			if (time < end_time) {
				var bits_remain_copy = this.bits_remain;
				if (this.silence && this.buf_empty) {
					var count = Math.floor((end_time - time + this.periodValue - 1) / this.periodValue);
					bits_remain_copy = (bits_remain_copy - 1 + 8 - count % 8) % 8 + 1;
					time += count * this.periodValue;
				} else {
					var bits_copy = this.bits;
					var dac_copy = this.dac;
					do {
						if (!this.silence) {
							var step = (bits_copy & 1) * 4 - 2;
							bits_copy >>= 1;
							var tot_step = dac_copy + step >>> 0; // converts to unsigned, see http://stackoverflow.com/questions/1822350/what-is-the-javascript-operator-and-how-do-you-use-it
							if (tot_step <= 0x7F) {
								dac_copy += step;
								this.synth.offset_inline(time, step, this.output);
							}
						}

						time += this.periodValue;

						if (--bits_remain_copy === 0) {
							bits_remain_copy = 8;
							if (this.buf_empty) {
								this.silence = true;
							} else {
								this.silence = false;
								bits_copy = this.buf;
								this.buf_empty = true;
								this.fill_buffer();
							}
						}
					} while (time < end_time);

					this.last_amp = dac_copy;
					this.dac = dac_copy;
					this.bits = bits_copy;
				}
				this.bits_remain = bits_remain_copy;
			}
			this.delay = time - end_time;
		}
	}, {
		key: 'reset',
		value: function reset() {

			this.address = 0;
			this.dac = 0;
			this.buf = 0;
			this.bits_remain = 1;
			this.bits = 0;
			this.buf_empty = true;
			this.silence = true;
			this.next_irq = no_irq;
			this.irq_flag = false;
			this.irq_enabled = false;
			Osc.prototype.reset.call(this);
			this.periodValue = 0x036;
		}
	}, {
		key: 'start',
		value: function start() {
			this.reload_sample();
			this.fill_buffer();
			this.recalc_irq();
		}
	}, {
		key: 'write_register',
		value: function write_register(addr, data) {
			if (addr === 0) {
				this.periodValue = dmc_period_table[this.pal_mode][data & 15];
				this.irq_enabled = (data & 0xc0) === 0x80; // enabled only if loop disabled
				this.irq_flag = this.irq_flag && this.irq_enabled;
				this.recalc_irq();
			} else if (addr === 1) {
				if (!this.nonlinear) {
					// adjust last_amp so that "pop" amplitude will be properly non-linear
					// with respect to change in dac
					var old_amp = dac_table[this.dac];
					this.dac = data & 0x7F;
					var diff = dac_table[this.dac] - old_amp;
					this.last_amp = this.dac - diff;
				}

				this.dac = data & 0x7F;
			}
		}
	}, {
		key: 'recalc_irq',
		value: function recalc_irq() {
			var irq = no_irq;
			if (this.irq_enabled && this.length_counter) {
				irq = this.apu.last_time + this.delay + ((this.length_counter - 1) * 8 + this.bits_remain - 1) * this.periodValue + 1;
			}
			if (irq !== this.next_irq) {
				this.next_irq = irq;
				this.apu.irq_changed();
			}
		}
	}, {
		key: 'fill_buffer',
		value: function fill_buffer() {
			if (this.buf_empty && this.length_counter) {
				//require( rom_reader ); // rom_reader must be set
				this.buf = this.rom_reader(0x8000 + this.address);
				this.address = this.address + 1 & 0x7FFF;
				this.buf_empty = false;
				if (--this.length_counter === 0) {
					if ((this.regs[0] & loop_flag) > 0) {
						this.reload_sample();
					} else {
						this.apu.osc_enables &= 0xEF;
						this.irq_flag = this.irq_enabled;
						this.next_irq = no_irq;
						this.apu.irq_changed();
					}
				}
			}
		}
	}, {
		key: 'reload_sample',
		value: function reload_sample() {
			this.address = 0x4000 + this.regs[2] * 0x40;
			this.length_counter = this.regs[3] * 0x10 + 1;
		}
	}]);

	return Dmc;
}(Osc);