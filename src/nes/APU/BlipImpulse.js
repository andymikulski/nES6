import BlipEqT from './BlipEqT.js';

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

const impulse_bits = 15;
const impulse_amp = 1 << impulse_bits;
const impulse_offset = Math.floor(impulse_amp / 2);
const widest_impulse_ = 24;
const blip_res_bits_ = 5;
const max_res = 1 << blip_res_bits_;

const uintArray_memcpy = function (buf, srcIndex, destIndex, len) {
  buf.set(buf.subarray(srcIndex, srcIndex + len), destIndex);
};


export default class BlipImpulse {
  constructor() {
    this.impulses = null;
    this.impulse = null;
  }

  init(imps, w, r, fb) {
    this.fine_bits = fb || 0;
    this.width = w;
    this.impulses = new Uint16Array(imps.buffer);
    this.generate = true;
    this.volume_unit_ = -1.0;
    this.res = r;
    this.buf = null;

    this.impulse = new Uint16Array(this.impulses.buffer, (this.width * this.res * 2 * (this.fine_bits ? 2 : 1)) * 2);
    this.offset = 0;
  }


	// TODO: examine this if there are any problems
  scale_impulse(unit, imp_in) {
    const offset = (unit << impulse_bits) - impulse_offset * unit + (1 << (impulse_bits - 1));
    let impIndex = 0;
    let fimpIndex = 0;
    for (let n = Math.floor(this.res / 2) + 1; n--;) {
      let error = unit;
      for (let nn = this.width; nn--;) {
        const a = (this.impulse[fimpIndex++] * unit + offset) >> impulse_bits;
        error -= a - unit;
        imp_in[impIndex++] = a;
      }

			// add error to middle
      imp_in[impIndex - Math.floor(this.width / 2) - 1] += error;
    }

    if (this.res > 2) {
			// second half is mirror-image
      let revIndex = impIndex - this.width - 1;
      for (let mm = (Math.floor(this.res / 2) - 1) * this.width - 1; mm--;) {
        imp_in[impIndex++] = imp_in[--revIndex];
      }
      imp_in[impIndex++] = unit;
    }

		// copy to odd offset
    imp_in[impIndex++] = unit;
		// memcpy( imp, imp_in, (res * width - 1) * sizeof *imp );
    uintArray_memcpy(imp_in, 0, impIndex, (this.res * this.width - 1));
  }


  fine_volume_unit() {
		// to do: find way of merging in-place without temporary buffer

    const temp = new Uint16Array(max_res * 2 * widest_impulse_);
    this.scale_impulse((this.offset & 0xffff) << this.fine_bits, temp);
    const imp2 = this.impulse.subarray(this.res * 2 * this.width);
    this.scale_impulse(this.offset & 0xffff, imp2);

		// merge impulses
    let impIndex = 0;
    let imp2Index = 0;
    let src2Index = 0;
    for (let n = Math.floor(this.res / 2) * 2 * this.width; n--;) {
      this.impulses[impIndex++] = imp2[imp2Index++];
      this.impulses[impIndex++] = imp2[imp2Index++];
      this.impulses[impIndex++] = temp[src2Index++];
      this.impulses[impIndex++] = temp[src2Index++];
    }
  }


  volume_unit(new_unit) {
    if (new_unit === this.volume_unit_) {
      return;
    }

    if (this.generate) {
      this.treble_eq(new BlipEqT(-8.87, 8800, 44100));
    }

    this.volume_unit_ = new_unit;

    this.offset = 0x10001 * Math.floor(this.volume_unit_ * 0x10000 + 0.5);

    if (this.fine_bits) {
      this.fine_volume_unit();
    } else {
      this.scale_impulse(this.offset & 0xffff, this.impulses);
    }
  }


  treble_eq(new_eq) {
    if (!this.generate && new_eq.treble === this.eq.treble && new_eq.cutoff === this.eq.cutoff && new_eq.sample_rate === this.eq.sample_rate) {
      return; // already calculated with same parameters
    }

    const pi = 3.1415926535897932384626433832795029;

    this.generate = false;
    this.eq = new_eq;

    let treble = Math.pow(10.0, 1.0 / 20 * this.eq.treble); // dB (-6dB = 0.50)
    if (treble < 0.000005) {
      treble = 0.000005;
    }

    const treble_freq = 22050.0; // treble level at 22 kHz harmonic
    const sample_rate = this.eq.sample_rate;
    const pt = treble_freq * 2 / sample_rate;
    let cutoff = this.eq.cutoff * 2 / sample_rate;
    if (cutoff >= pt * 0.95 || cutoff >= 0.95) {
      cutoff = 0.5;
      treble = 1.0;
    }

		// DSF Synthesis (See T. Stilson & J. Smith (1996),
		// Alias-free digital synthesis of classic analog waveforms)

		// reduce adjacent impulse interference by using small part of wide impulse
    const n_harm = 4096;
    const rolloff = Math.pow(treble, 1.0 / (n_harm * pt - n_harm * cutoff));
    const rescale = 1.0 / Math.pow(rolloff, n_harm * cutoff);

    const pow_a_n = rescale * Math.pow(rolloff, n_harm);
    const pow_a_nc = rescale * Math.pow(rolloff, n_harm * cutoff);

    let total = 0.0;
    const to_angle = (((pi / 2) / n_harm) / max_res);

    const buf = [];
    buf.length = Math.floor(max_res * (widest_impulse_ - 2) / 2);
    const size = Math.floor(max_res * (this.width - 2) / 2);
    for (let i = size; i--;)		{
      const angle = (i * 2 + 1) * to_angle;

			// equivalent
			// double y =     dsf( angle, n_harm * cutoff, 1.0 );
			// y -= rescale * dsf( angle, n_harm * cutoff, rolloff );
			// y += rescale * dsf( angle, n_harm,          rolloff );

      const cos_angle = Math.cos(angle);
      const cos_nc_angle = Math.cos(n_harm * cutoff * angle);
      const cos_nc1_angle = Math.cos((n_harm * cutoff - 1.0) * angle);

      const b = 2.0 - 2.0 * cos_angle;
      const a = 1.0 - cos_angle - cos_nc_angle + cos_nc1_angle;

      const d = 1.0 + rolloff * (rolloff - 2.0 * cos_angle);
      const c = pow_a_n * rolloff * Math.cos((n_harm - 1.0) * angle) -
					pow_a_n * Math.cos(n_harm * angle) -
					pow_a_nc * rolloff * cos_nc1_angle +
					pow_a_nc * cos_nc_angle;

			// optimization of a / b + c / d
      let y = (a * d + c * b) / (b * d);

			// fixed window which affects wider impulses more
      if (this.width > 12) {
        const windowVar = Math.cos(n_harm / 1.25 / widest_impulse_ * angle);
        y *= windowVar * windowVar;
      }

      total += y;
      buf[i] = y;
    }

		// integrate runs of length 'max_res'
    const factor = impulse_amp * 0.5 / total; // 0.5 accounts for other mirrored half
    let impIndex = 0;
    const step = Math.floor(max_res / this.res);
    let offset = this.res > 1 ? max_res : Math.floor(max_res / 2);
    for (let n = Math.floor(this.res / 2) + 1; n--; offset -= step)		{
      for (let w = -Math.floor(this.width / 2); w < Math.floor(this.width / 2); w++)			{
        let sum = 0;
        for (let k = max_res; k--;)				{
          let index = w * max_res + offset + k;
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
    const unit = this.volume_unit_;
    if (unit >= 0) {
      this.volume_unit_ = -1;
      this.volume_unit(unit);
    }
  }
}
