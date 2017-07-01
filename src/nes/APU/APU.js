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

// NES 2A03 APU sound chip emulator

// Nes_Snd_Emu 0.1.7. Copyright (C) 2003-2005 Shay Green. GNU LGPL license.

import { Square, Triangle, Noise, Dmc } from './Tones';
import BlipSynth from './BlipSynth';

const osc_count = 5;
const start_addr = 0x4000;
const end_addr = 0x4017;
const no_irq = 1073741824;
export const irq_waiting = 0;

// registers
const length_table = [
  0x0A, 0xFE, 0x14, 0x02, 0x28, 0x04, 0x50, 0x06,
  0xA0, 0x08, 0x3C, 0x0A, 0x0E, 0x0C, 0x1A, 0x0E,
  0x0C, 0x10, 0x18, 0x12, 0x30, 0x14, 0x60, 0x16,
  0xC0, 0x18, 0x48, 0x1A, 0x10, 0x1C, 0x20, 0x1E,
];


export default class APU {
  constructor() {
    this.start_addr = start_addr;
    this.end_addr = end_addr;
    this.status_addr = 0x4015;

    this._square1 = new Square();
    this._square2 = new Square();
    this._triangle = new Triangle();
    this._noise = new Noise();
    this._dmc = new Dmc();
    this.osc = [this._square1, this._square2, this._triangle, this._noise, this._dmc];

    this.last_time = 0; // has been run until this time in current frame
    this.earliest_irq_ = 0;
    this.next_irq = 0;

    this._square_synth = new BlipSynth(BlipSynth.blip_good_quality, 15);
    this._irqCallback = null;
    this.frame_mode = 0;
    this.frame = 0;

    this._dmc.apu = this;
    this._dmc.rom_reader = null;
    this._square1.synth = this._square_synth;
    this._square2.synth = this._square_synth;

    this.output(null);
    this.volume(1.0);
    this.reset(false);
  }

	// Reset internal frame counter, registers, and all oscillators.
	// Use PAL timing if pal_timing is true, otherwise use NTSC timing.
	// Set the DMC oscillator's initial DAC value to initial_dmc_dac without
	// any audible click.
  reset(pal_mode, initial_dmc_dac) {
    pal_mode = pal_mode || false;
    initial_dmc_dac = initial_dmc_dac || 0;

		// to do: time pal frame periods exactly
    this.frame_period = pal_mode ? 8314 : 7458;
    this._dmc.pal_mode = pal_mode ? 1 : 0;

    this._square1.reset();
    this._square2.reset();
    this._triangle.reset();
    this._noise.reset();
    this._dmc.reset();

    this.last_time = 0;
    this.osc_enables = 0;
    this.irq_flag = false;
    this.earliest_irq_ = no_irq;
    this.frame_delay = 1; // cycles until frame counter runs next
    this.write_register(0, 0x4017, 0x00);
    this.write_register(0, 0x4015, 0x00);

    for (let addr = start_addr; addr <= 0x4013; addr++) {
      this.write_register(0, addr, (addr & 3) ? 0x00 : 0x10);
    }

    this._dmc.dac = initial_dmc_dac;
    if (!this._dmc.nonlinear) {
      this._dmc.last_amp = initial_dmc_dac; // prevent output transition
    }
  }


	// Set buffer to generate all sound into, or disable sound if NULL
  output(buffer) {
    for (let i = 0; i < osc_count; i++) {
      this.osc_output(i, buffer);
    }
  }

	// Set memory reader callback used by DMC oscillator to fetch samples.
	// When callback is invoked, 'user_data' is passed unchanged as the
	// first parameter.
  dmc_reader(dmcCallback) {
    this._dmc.rom_reader = dmcCallback;
  }

	// All time values are the number of CPU clock cycles relative to the
	// beginning of the current time frame. Before resetting the CPU clock
	// count, call end_frame( last_cpu_time ).
	// Write to register (0x4000-0x4017, except 0x4014 and 0x4016)
  write_register(time, addr, data) {
		//	require( addr > 0x20 ); // addr must be actual address (i.e. 0x40xx)
		//	require( (unsigned) data <= 0xff );

		// Ignore addresses outside range
    if (addr < start_addr || end_addr < addr) {
      return;
    }

    this.run_until(time);

    if (addr < 0x4014) {
			// Write to channel
      const osc_index = (addr - start_addr) >> 2;
      const osc = this.osc[osc_index];

      const reg = addr & 3;
      osc.regs[reg] = data;
      osc.reg_written[reg] = true;

      if (osc_index === 4) {
				// handle DMC specially
        this._dmc.write_register(reg, data);
      } else if (reg === 3) {
				// load length counter
        if ((this.osc_enables >> osc_index) & 1) {
          osc.length_counter = length_table[(data >> 3) & 0x1f];
        }

				// reset square phase
        if (osc_index < 2) {
          osc.phase = Square.phase_range - 1;
        }
      }
    } else if (addr === 0x4015) {
			// Channel enables
      for (let i = 0; i < osc_count; ++i) {
        const enabled = (data >> i) & 1;
        if (enabled === 0) {
          this.osc[i].length_counter = 0;
        }
      }

      let recalc_irq = this._dmc.irq_flag;
      this._dmc.irq_flag = false;

      const old_enables = this.osc_enables;
      this.osc_enables = data;
      if (!(data & 0x10)) {
        this._dmc.next_irq = no_irq;
        recalc_irq = true;
      } else if (!(old_enables & 0x10)) {
        this._dmc.start(); // dmc just enabled
      }

      if (recalc_irq) {
        this.irq_changed();
      }
    } else if (addr === 0x4017) {
			// Frame mode
      this.frame_mode = data;

      const irq_enabled = !(data & 0x40);
      this.irq_flag &= irq_enabled;
      this.next_irq = no_irq;

			// mode 1
      this.frame_delay = (this.frame_delay & 1);
      this.frame = 0;

      if (!(data & 0x80)) {
				// mode 0
        this.frame = 1;
        this.frame_delay += this.frame_period;
        if (irq_enabled) {
          this.next_irq = time + this.frame_delay + this.frame_period * 3;
        }
      }

      this.irq_changed();
    }
  }

	// Read from status register at 0x4015
  read_status(time) {
    this.run_until(time - 1);

    let result = (this._dmc.irq_flag ? 0x80 : 0) | (this.irq_flag ? 0x40 : 0);

    for (let i = 0; i < osc_count; i++) {
      if (this.osc[i].length_counter > 0) {
        result |= 1 << i;
      }
    }

    this.run_until(time);

    if (this.irq_flag) {
      this.irq_flag = false;
      this.irq_changed();
    }

    return result;
  }

	// Run all oscillators up to specified time, end current time frame, then
	// start a new time frame at time 0. Time frames have no effect on emulation
	// and each can be whatever length is convenient.
  end_frame(end_time) {
    if (end_time > this.last_time) {
      this.run_until(end_time);
    }

		// make times relative to new frame
    this.last_time -= end_time;
		// require( this.last_time >= 0 );

    if (this.next_irq !== no_irq) {
      this.next_irq -= end_time;
			// assert( this.next_irq >= 0 );
    }
    if (this._dmc.next_irq !== no_irq) {
      this._dmc.next_irq -= end_time;
			// assert( this._dmc.next_irq >= 0 );
    }
    if (this.earliest_irq_ !== no_irq) {
      this.earliest_irq_ -= end_time;
      if (this.earliest_irq_ < 0) {
        this.earliest_irq_ = 0;
      }
    }
  }


	// Save/load snapshot of exact emulation state
  save_snapshot(apu_snapshot_t) {

  }


  load_snapshot(apu_snapshot_t) {

  }

	// Set overall volume (default is 1.0)
  volume(v) {
    v = v || 1.0;
    this._dmc.nonlinear = false;
    this._square_synth.volume(0.1128 * v);
    this._triangle.synth.volume(0.12765 * v);
    this._noise.synth.volume(0.0741 * v);
    this._dmc.synth.volume(0.42545 * v);
  }


	// Set IRQ time callback that is invoked when the time of earliest IRQ
	// may have changed, or NULL to disable. When callback is invoked,
	// 'user_data' is passed unchanged as the first parameter.
  irq_notifier(irqCallback) {
    this._irqCallback = irqCallback;
  }


	// Get time that APU-generated IRQ will occur if no further register reads
	// or writes occur. If IRQ is already pending, returns irq_waiting. If no
	// IRQ will occur, returns no_irq.
  earliest_irq() {
    return this.earliest_irq_;
  }


	// Run APU until specified time, so that any DMC memory reads can be
	// accounted for (i.e. inserting CPU wait states).
  run_until(end_time) {
		// require( end_time >= this.last_time );

    if (end_time === this.last_time) {
      return;
    }

    while (true) {
			// earlier of next frame time or end time
      let time = this.last_time + this.frame_delay;
      if (time > end_time) {
        time = end_time;
      }
      this.frame_delay -= time - this.last_time;

			// run oscs to present
      this._square1.run(this.last_time, time);
      this._square2.run(this.last_time, time);
      this._triangle.run(this.last_time, time);
      this._noise.run(this.last_time, time);
      this._dmc.run(this.last_time, time);
      this.last_time = time;

      if (time === end_time) {
        break; // no more frames to run
      }

			// take frame-specific actions
      this.frame_delay = this.frame_period;
      switch (this.frame++) {
        case 0:
          if (!(this.frame_mode & 0xc0)) {
            this.next_irq = time + this.frame_period * 4 + 1;
            this.irq_flag = true;
          }
					// fall through
        case 2:
					// clock length and sweep on frames 0 and 2
          this._square1.clock_length(0x20);
          this._square2.clock_length(0x20);
          this._noise.clock_length(0x20);
          this._triangle.clock_length(0x80); // different bit for halt flag on triangle

          this._square1.clock_sweep(-1);
          this._square2.clock_sweep(0);
          break;

        case 1:
					// frame 1 is slightly shorter
          this.frame_delay -= 2;
          break;

        case 3:
          this.frame = 0;

					// frame 3 is almost twice as long in mode 1
          if (this.frame_mode & 0x80) {
            this.frame_delay += this.frame_period - 6;
          }
          break;
      }

			// clock envelopes and linear counter every frame
      this._triangle.clock_linear_counter();
      this._square1.clock_envelope();
      this._square2.clock_envelope();
      this._noise.clock_envelope();
    }
  }


  irq_changed() {
    let new_irq = this._dmc.next_irq;
    if (this._dmc.irq_flag || this.irq_flag) {
      new_irq = 0;
    } else if (new_irq > this.next_irq) {
      new_irq = this.next_irq;
    }

    if (new_irq !== this.earliest_irq_) {
      this.earliest_irq_ = new_irq;
      if (this._irqCallback) {
        this._irqCallback();
      }
    }
  }


  osc_output(osc, buf) {
    this.osc[osc].output = buf;
  }


  save_snapshot() {
    return {};
  }

  load_snapshot() {}
}
