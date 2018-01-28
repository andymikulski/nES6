const APUOutBufferSize = 4096;
const APUBaseRate = 1789773;

import {
	writeLine,
	traceApu
} from '../../utils/Trace';
import APU from './APU';
import BlipBuffer from './BlipBuffer';
import WebAudioRenderer from '../../gui/audio/WebAudioRenderer';
import {
	COLOUR_ENCODING_NAME,
	COLOUR_ENCODING_MTC_PER_CPU,
} from '../../config/consts.js';

export default class APULegacy {
	constructor(mainboard) {
		this.outBufferSize = 4096;
		this.soundRate = 44100;

		this.mainboard = mainboard;
		this.mainboard.connect('reset', this.onReset.bind(this));
		this.nextIrq = -1;
		this.irqActive = false;
		this.mLastCalculatedNextIrqTime = -1;

		this.enabled = true;
		this.justRenabled = 0;
		let soundRate = 44100;

		this.apu = new APU();

		try {
			this.renderer = new WebAudioRenderer(APUOutBufferSize);
			this.outBuffer = this.renderer.createBuffer(this.outBufferSize);
			soundRate = this.renderer.getSampleRate();
			this.buf = new BlipBuffer();

			this.buf.clock_rate(APUBaseRate);
			this.apu.output(this.buf);
			this.buf.sample_rate(soundRate);
		} catch (err) {
			this.renderer = null;
			this.enabled = false;
			console.log("WebAudio unsupported in this browser. Sound will be disabled...", err);
		}

		this.apu.dmc_reader(function (addr) {
			return mainboard.memory.read8(addr);
		});
		this.apu.irq_notifier(this.CalculateWhenIrqDue.bind(this));
		// called when the next predicted nmi changes
		//that.mainboard.synchroniser.synchronise();
	}


	enableSound(enable) {
		enable = enable === undefined ? true : enable;
		if (enable !== this.enabled) {
			if (enable) { // after re-enabling sound, fill audio buffer with zeroes to prevent static
				this.justRenabled = 2;
			}
			this.enabled = enable;
		}
	}


	soundEnabled() {
		return this.enabled && this.soundSupported();
	}


	soundSupported() {
		return !!this.renderer;
	}


	setVolume(val) {
		if (this.renderer) {
			this.renderer.setVolume(val);
		}
	}


	onReset(cold) {

		this.nextIrq = -1;
		this.apu.reset(COLOUR_ENCODING_NAME !== "NTSC");
	}


	readFromRegister(offset) {
		var ret = 0;
		if (offset === this.apu.status_addr) {
			this.mainboard.synchroniser.synchronise();
			var realTime = Math.floor(this.mainboard.synchroniser.getCpuMTC() / COLOUR_ENCODING_MTC_PER_CPU);
			if (offset === 0x4015 && this.irqActive) {
				// irq acknowledge
				this.irqActive = false;
				//this.mainboard.cpu.holdIrqLineLow( false );
			}
			ret = this.apu.read_status(realTime);
		}
		return ret;
	}


	writeToRegister(offset, data) {
		if (offset >= this.apu.start_addr && offset <= this.apu.end_addr) {
			this.mainboard.synchroniser.synchronise();
			var realTime = Math.floor(this.mainboard.synchroniser.getCpuMTC() / COLOUR_ENCODING_MTC_PER_CPU);
			this.apu.write_register(realTime, offset, data);
		}
	}


	synchronise(startTicks, endTicks) {
		var cpuClocks = Math.floor(startTicks / COLOUR_ENCODING_MTC_PER_CPU) - 1;
		this.apu.run_until(cpuClocks >= 0 ? cpuClocks : 0);

		if (this.apu.earliest_irq() === APU.irq_waiting) {
			this.irqActive = true;
		}
	}


	onEndFrame(cpuMtc) {
		var realTime = Math.floor(this.mainboard.synchroniser.getCpuMTC() / COLOUR_ENCODING_MTC_PER_CPU);
		this.apu.end_frame(realTime);

		if (this.renderer && this.enabled) {
			// Read some samples out of BlipBuffer if there are enough to
			// fill our output buffer
			this.buf.end_frame(realTime);

			var samplesAvailable = this.buf.samples_avail();

			//	if ( g_options->SoundEnabled && g_options->ApplicationSpeed == 0 ) // dont play sound if disabled or not running at normal speed
			if (samplesAvailable >= APUOutBufferSize) {
				//write samples directly to renderer's buffer
				var floatArray = this.outBuffer.lockBuffer();
				this.buf.read_samples(floatArray, APUOutBufferSize);
				this.outBuffer.unlockBuffer();
			}
		}

		this.CalculateWhenIrqDue();
	}


	eventIrqTrigger(eventTime) {
		// done in the synchronise method
		//	this.mainboard.cpu.holdIrqLineLow();
	}


	CalculateWhenIrqDue() {

		var that = this;
		var earliestIrq = this.apu.earliest_irq();
		if (earliestIrq !== this.apu.no_irq) {
			this.nextIrq = earliestIrq * COLOUR_ENCODING_MTC_PER_CPU;
			if (this.nextIrq >= 0) {
				writeLine(traceApu, 'IRQ scheduled for: ' + this.nextIrq);
				//this.mainboard.synchroniser.addEvent( 'apu irq', this.nextIrq, function( eventTime ) { that.eventIrqTrigger( eventTime ); } );
			}
		} else {
			this.nextIrq = -1;
			// TODO: change irq event if it changes
		}
	}


	saveState() {
		var data = {};
		data.apu = this.apu.save_snapshot();
		data.nextIrq = this.nextIrq;
		data.mLastCalculatedNextIrqTime = this.mLastCalculatedNextIrqTime;
		return data;
	}


	loadState(state) {

		this.apu.load_snapshot(state.apu);
		this.nextIrq = state.nextIrq;
		this.mLastCalculatedNextIrqTime = state.mLastCalculatedNextIrqTime;
	}
}
