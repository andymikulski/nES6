'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Trace = require('../../utils/Trace');

var _APU = require('./APU');

var _APU2 = _interopRequireDefault(_APU);

var _BlipBuffer = require('./BlipBuffer');

var _BlipBuffer2 = _interopRequireDefault(_BlipBuffer);

var _WebAudioRenderer = require('../../gui/WebAudioRenderer');

var _WebAudioRenderer2 = _interopRequireDefault(_WebAudioRenderer);

var _consts = require('../../config/consts.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var APUOutBufferSize = 4096;
var APUBaseRate = 1789773;

var APULegacy = function () {
	function APULegacy(mainboard) {
		_classCallCheck(this, APULegacy);

		this._outBufferSize = 4096;
		this._soundRate = 44100;

		this.mainboard = mainboard;
		this.mainboard.connect('reset', this._onReset.bind(this));
		this.nextIrq = -1;
		this._irqActive = false;
		this.mLastCalculatedNextIrqTime = -1;

		this._enabled = true;
		this._justRenabled = 0;
		var soundRate = 44100;

		this.apu = new _APU2.default();

		try {
			this._renderer = new _WebAudioRenderer2.default(APUOutBufferSize);
			this._outBuffer = this._renderer.createBuffer(this._outBufferSize);
			soundRate = this._renderer.getSampleRate();
			this.buf = new _BlipBuffer2.default();

			this.buf.clock_rate(APUBaseRate);
			this.apu.output(this.buf);
			this.buf.sample_rate(soundRate);
		} catch (err) {
			this._renderer = null;
			this._enabled = false;
			console.log("WebAudio unsupported in this browser. Sound will be disabled...", err);
		}

		this.apu.dmc_reader(function (addr) {
			return mainboard.memory.read8(addr);
		});
		this.apu.irq_notifier(this.CalculateWhenIrqDue.bind(this));
		// called when the next predicted nmi changes
		//that.mainboard.synchroniser.synchronise();
	}

	_createClass(APULegacy, [{
		key: 'enableSound',
		value: function enableSound(enable) {
			enable = enable === undefined ? true : enable;
			if (enable !== this._enabled) {
				if (enable) {
					// after re-enabling sound, fill audio buffer with zeroes to prevent static
					this._justRenabled = 2;
				}
				this._enabled = enable;
			}
		}
	}, {
		key: 'soundEnabled',
		value: function soundEnabled() {
			return this._enabled && this.soundSupported();
		}
	}, {
		key: 'soundSupported',
		value: function soundSupported() {
			return !!this._renderer;
		}
	}, {
		key: 'setVolume',
		value: function setVolume(val) {
			if (this._renderer) {
				this._renderer.setVolume(val);
			}
		}
	}, {
		key: '_onReset',
		value: function _onReset(cold) {

			this.nextIrq = -1;
			this.apu.reset(_consts.COLOUR_ENCODING_NAME !== "NTSC");
		}
	}, {
		key: 'readFromRegister',
		value: function readFromRegister(offset) {
			var ret = 0;
			if (offset === this.apu.status_addr) {
				this.mainboard.synchroniser.synchronise();
				var realTime = Math.floor(this.mainboard.synchroniser.getCpuMTC() / _consts.COLOUR_ENCODING_MTC_PER_CPU);
				if (offset === 0x4015 && this._irqActive) {
					// irq acknowledge
					this._irqActive = false;
					//this.mainboard.cpu.holdIrqLineLow( false );
				}
				ret = this.apu.read_status(realTime);
			}
			return ret;
		}
	}, {
		key: 'writeToRegister',
		value: function writeToRegister(offset, data) {
			if (offset >= this.apu.start_addr && offset <= this.apu.end_addr) {
				this.mainboard.synchroniser.synchronise();
				var realTime = Math.floor(this.mainboard.synchroniser.getCpuMTC() / _consts.COLOUR_ENCODING_MTC_PER_CPU);
				this.apu.write_register(realTime, offset, data);
			}
		}
	}, {
		key: 'synchronise',
		value: function synchronise(startTicks, endTicks) {
			var cpuClocks = Math.floor(startTicks / _consts.COLOUR_ENCODING_MTC_PER_CPU) - 1;
			this.apu.run_until(cpuClocks >= 0 ? cpuClocks : 0);

			if (this.apu.earliest_irq() === _APU2.default.irq_waiting) {
				this._irqActive = true;
			}
		}
	}, {
		key: 'onEndFrame',
		value: function onEndFrame(cpuMtc) {
			var realTime = Math.floor(this.mainboard.synchroniser.getCpuMTC() / _consts.COLOUR_ENCODING_MTC_PER_CPU);
			this.apu.end_frame(realTime);

			if (this._renderer && this._enabled) {
				// Read some samples out of BlipBuffer if there are enough to
				// fill our output buffer
				this.buf.end_frame(realTime);

				var samplesAvailable = this.buf.samples_avail();

				//	if ( g_options->SoundEnabled && g_options->ApplicationSpeed == 0 ) // dont play sound if disabled or not running at normal speed
				if (samplesAvailable >= APUOutBufferSize) {
					//write samples directly to renderer's buffer
					var floatArray = this._outBuffer.lockBuffer();
					this.buf.read_samples(floatArray, APUOutBufferSize);
					this._outBuffer.unlockBuffer();
				}
			}

			this.CalculateWhenIrqDue();
		}
	}, {
		key: '_eventIrqTrigger',
		value: function _eventIrqTrigger(eventTime) {
			// done in the synchronise method
			//	this.mainboard.cpu.holdIrqLineLow();
		}
	}, {
		key: 'CalculateWhenIrqDue',
		value: function CalculateWhenIrqDue() {

			var that = this;
			var earliestIrq = this.apu.earliest_irq();
			if (earliestIrq !== this.apu.no_irq) {
				this.nextIrq = earliestIrq * _consts.COLOUR_ENCODING_MTC_PER_CPU;
				if (this.nextIrq >= 0) {
					(0, _Trace.writeLine)(_Trace.trace_apu, 'IRQ scheduled for: ' + this.nextIrq);
					//this.mainboard.synchroniser.addEvent( 'apu irq', this.nextIrq, function( eventTime ) { that._eventIrqTrigger( eventTime ); } );
				}
			} else {
				this.nextIrq = -1;
				// TODO: change irq event if it changes
			}
		}
	}, {
		key: 'saveState',
		value: function saveState() {
			var data = {};
			data.apu = this.apu.save_snapshot();
			data.nextIrq = this.nextIrq;
			data.mLastCalculatedNextIrqTime = this.mLastCalculatedNextIrqTime;
			return data;
		}
	}, {
		key: 'loadState',
		value: function loadState(state) {

			this.apu.load_snapshot(state.apu);
			this.nextIrq = state.nextIrq;
			this.mLastCalculatedNextIrqTime = state.mLastCalculatedNextIrqTime;
		}
	}]);

	return APULegacy;
}();

exports.default = APULegacy;