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


const widest_impulse_ = 24;
const blip_res_bits_ = 5;
const BLIP_BUFFER_ACCURACY = 16;
const max_res = 1 << blip_res_bits_;


class Blip_eq_t {
  constructor(treble, cutoff, samplerate) {
    this.treble = treble || 0;
    this.cutoff = cutoff || 0;
    this.sample_rate = samplerate || 44100;
  }
}


const uintArray_memset = function (buf, data, len, startIndex) {
  startIndex = startIndex || 0;
  for (let i = 0; i < len; ++i) {
    buf[startIndex + i] = data;
  }
};


const uintArray_memmove = function (buf, srcIndex, destIndex, len) {
  let tmpArray = null;
  if (!tmpArray || tmpArray.length < len) {
    tmpArray = new Uint16Array(len);
  }
  tmpArray.set(buf.subarray(srcIndex, srcIndex + len), 0);
  buf.set(tmpArray.subarray(0, len), destIndex);
};


const uintArray_memcpy = function (buf, srcIndex, destIndex, len) {
  buf.set(buf.subarray(srcIndex, srcIndex + len), destIndex);
};


const blip_default_length = 0;
const accum_fract = 15; // less than 16 to give extra sample range
const sample_offset = 0x7F7F; // repeated byte allows memset to clear buffer


export default class BlipBuffer {
  constructor() {
    this.samples_per_sec = 44100;
    this.reader_accum = 0;
    this.bass_shift = 0;
    this.eq = new Blip_eq_t();

		// try to cause assertion failure if buffer is used before these are set
    this.clocks_per_sec = 0;
    this.buffer_ = null;
    this.factor_ = ~0;
    this.offset_ = 0;
    this.buffer_size_ = 0;
    this.length_ = 0;

    this.bass_freq_ = 16;
  }

	// Set output sample rate and buffer length in milliseconds (1/1000 sec),
	// If there is insufficient memory for the buffer, sets the buffer length
	// to 0 and returns error string (or propagates exception if compiler supports it).
  sample_rate(new_rate, msec) {
    if (new_rate === undefined) {
      return this.samples_per_sec;
    }
    msec = msec || blip_default_length;

    let new_size = 65448;// (0xFFFFFFFF >> BLIP_BUFFER_ACCURACY) + 1 - widest_impulse_ - 64;
    if (msec !== blip_default_length) {
      const s = Math.floor((new_rate * (msec + 1) + 999) / 1000);
      if (s < new_size) {
        new_size = s;
      } else {
			//		require( false ); // requested buffer length exceeds limit
      }
    }

    if (this.buffer_size_ !== new_size) {
      this.buffer_ = null; // allow for exception in allocation below
      this.buffer_size_ = 0;
      this.offset_ = 0;

      this.buffer_ = new Uint16Array(new_size + widest_impulse_);
    }

    this.buffer_size_ = new_size;
    this.length_ = Math.floor(new_size * 1000 / new_rate) - 1;
		//	if ( msec )
		//		assert( this.length_ == msec ); // ensure length is same as that passed in

    this.samples_per_sec = new_rate;
    if (this.clocks_per_sec) {
      this.clock_rate(this.clocks_per_sec); // recalculate factor
    }

    this.bass_freq(this.bass_freq_); // recalculate shift

    this.clear();
  }


	// Length of buffer, in milliseconds
  length() {
    return this.length_;
  }


	// Number of source time units per second
  clock_rate(cps) {
    if (cps === undefined) {
      return this.clocks_per_sec;
    }
    this.clocks_per_sec = cps;
    this.factor_ = Math.floor(this.samples_per_sec / cps * (1 << BLIP_BUFFER_ACCURACY) + 0.5);
		//	require( this.factor_ > 0 ); // clock_rate/sample_rate ratio is too large
  }

	// Set frequency at which high-pass filter attenuation passes -3dB
  bass_freq(freq) {
    this.bass_freq_ = freq;
    if (freq === 0) {
      this.bass_shift = 31; // 32 or greater invokes undefined behavior elsewhere
      return;
    }
    this.bass_shift = 1 + Math.floor(1.442695041 * Math.log(0.124 * this.samples_per_sec / freq));
    if (this.bass_shift < 0) {
      this.bass_shift = 0;
    }
    if (this.bass_shift > 24) {
      this.bass_shift = 24;
    }
  }

	// Remove all available samples and clear buffer to silence. If 'entire_buffer' is
	// false, just clear out any samples waiting rather than the entire buffer.
  clear(entire_buffer) {
    entire_buffer = entire_buffer === undefined ? true : entire_buffer;

    const count = (entire_buffer ? this.buffer_size_ : this.samples_avail());
    this.offset_ = 0;
    this.reader_accum = 0;
    uintArray_memset(this.buffer_, sample_offset, count + widest_impulse_);
  }

	// to do:
	// Notify Blip_Buffer that synthesis has been performed until specified time
	// void run_until( blip_time_t );

	// End current time frame of specified duration and make its samples available
	// (along with any still-unread samples) for reading with read_samples(). Begin
	// a new time frame at the end of the current frame. All transitions must have
	// been added before 'time'.
  end_frame(t) {
    this.offset_ += t * this.factor_;
	//	assert(( "Blip_Buffer::end_frame(): Frame went past end of buffer",
	//			samples_avail() <= (long) this.buffer_size_ ));
  }

	// Number of samples available for reading with read_samples()
  samples_avail() {
    return this.offset_ >> BLIP_BUFFER_ACCURACY;
  }

	// Read at most 'max_samples' out of buffer into 'dest', removing them from from
	// the buffer. Return number of samples actually read and removed. If stereo is
	// true, increment 'dest' one extra time after writing each sample, to allow
	// easy interleving of two channels into a stereo output buffer.
  read_samples(out, max_samples, stereo) {
		// require( this.buffer_ ); // sample rate must have been set

    let count = this.samples_avail();
    if (count > max_samples) {
      count = max_samples;
    }

    if (!count) {
      return 0; // optimization
    }

    const isFloatOutputArray = out instanceof Float32Array;

    let inIndex = 0;
    let outIndex = 0;
    const step = stereo ? 2 : 1;

    for (let n = count; n--;) {
      let s = this.reader_accum >> accum_fract;
      this.reader_accum -= this.reader_accum >> this.bass_shift;
      const inbyte = this.buffer_[inIndex];
      this.reader_accum += (inbyte - sample_offset) << accum_fract;
      inIndex += 1;

			// clamp sample
		//	if ( s !== ( s & 0xFFFF ) ) {
      if (s < -32767 || s > 32767) { // larger than a signed 16 bit value
        s = 0x7FFF - (s >> 24);
      }

      if (isFloatOutputArray) {
        out[outIndex] = s / 32768.0;
      } else {
        out[outIndex] = s;
      }

      outIndex += step;
    }

    this.remove_samples(count);

    return count;
  }

	// Remove 'count' samples from those waiting to be read
  remove_samples(count) {
		// require( this.buffer_ ); // sample rate must have been set

    if (!count) { // optimization
      return;
    }

    this.remove_silence(count);

		// Allows synthesis slightly past time passed to end_frame(), as long as it's
		// not more than an output sample.
		// to do: kind of hacky, could add run_until() which keeps track of extra synthesis
    const copy_extra = 1;

		// copy remaining samples to beginning and clear old samples
    const remain = this.samples_avail() + widest_impulse_ + copy_extra;
    if (count >= remain) {
      uintArray_memmove(this.buffer_, count, 0, remain);
    } else {
      uintArray_memcpy(this.buffer_, count, 0, remain);
    }
    uintArray_memset(this.buffer_, sample_offset, count, remain);
  }

	// Number of samples delay from synthesis to samples read out
  output_latency() {
    return Math.floor(widest_impulse_ / 2);
  }

	// not documented yet
  remove_silence(count) {
		// assert(( "Blip_Buffer::remove_silence(): Tried to remove more samples than available",
		//		count <= samples_avail() ));
    this.offset_ -= count << BLIP_BUFFER_ACCURACY;
  }


  resampled_time(t) {
    return t * this.factor_ + this.offset_;
  }

  resampled_duration(t) {
    return t * this.factor_;
  }
}
