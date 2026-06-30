// ============================================================
// CARNATIC PITCH DETECTOR
// Detects sung pitch and maps to the nearest Carnatic swara.
// Usage: call pitchDetector.start(callback) / .stop()
// ============================================================

const SWARA_NAMES  = ['S', 'R\u2081', 'R\u2082', 'G\u2082', 'G\u2083', 'M\u2081', 'M\u2082', 'P', 'D\u2081', 'D\u2082', 'N\u2082', 'N\u2083'];
const SWARA_TAMIL  = ['\u0bb8', '\u0bb0\u0bbf\u2081', '\u0bb0\u0bbf\u2082', '\u0b95\u2082', '\u0b95\u2083', '\u0bae\u2081', '\u0bae\u2082', '\u0baa', '\u0ba4\u2081', '\u0ba4\u2082', '\u0ba8\u0bbf\u2082', '\u0ba8\u0bbf\u2083'];

// Semitone positions for Mayamalavagowla raga:
// Sa=0, Ri1=1, Ga3=4, Ma1=5, Pa=7, Da1=8, Ni3=11
const MAYAMALAVAGOWLA = new Set([0, 1, 4, 5, 7, 8, 11]);

// Common shruti values (Sa frequency in Hz)
// Range: C2 to C5 — covers all vocal ranges and instruments
// C2-B2 : Bass voice / tanpura low / mridangam
// C3-F#3: Male vocal (most common Carnatic shruti)
// G3-B3 : Female alto / baritone upper range
// C4-B4 : Female soprano / violin / veena / flute
// C5    : High soprano / piccolo flute / nadaswaram upper
const SHRUTI_LIST = [
  { note: 'C2',  hz:  65.41 },
  { note: 'C#2', hz:  69.30 },
  { note: 'D2',  hz:  73.42 },
  { note: 'D#2', hz:  77.78 },
  { note: 'E2',  hz:  82.41 },
  { note: 'F2',  hz:  87.31 },
  { note: 'F#2', hz:  92.50 },
  { note: 'G2',  hz:  98.00 },
  { note: 'G#2', hz: 103.83 },
  { note: 'A2',  hz: 110.00 },
  { note: 'A#2', hz: 116.54 },
  { note: 'B2',  hz: 123.47 },
  { note: 'C3',  hz: 130.81 },
  { note: 'C#3', hz: 138.59 },
  { note: 'D3',  hz: 146.83 },
  { note: 'D#3', hz: 155.56 },
  { note: 'E3',  hz: 164.81 },
  { note: 'F3',  hz: 174.61 },
  { note: 'F#3', hz: 185.00 },
  { note: 'G3',  hz: 196.00 },
  { note: 'G#3', hz: 207.65 },
  { note: 'A3',  hz: 220.00 },
  { note: 'A#3', hz: 233.08 },
  { note: 'B3',  hz: 246.94 },
  { note: 'C4',  hz: 261.63 },
  { note: 'C#4', hz: 277.18 },
  { note: 'D4',  hz: 293.66 },
  { note: 'D#4', hz: 311.13 },
  { note: 'E4',  hz: 329.63 },
  { note: 'F4',  hz: 349.23 },
  { note: 'F#4', hz: 369.99 },
  { note: 'G4',  hz: 392.00 },
  { note: 'G#4', hz: 415.30 },
  { note: 'A4',  hz: 440.00 },
  { note: 'A#4', hz: 466.16 },
  { note: 'B4',  hz: 493.88 },
  { note: 'C5',  hz:  523.25 },
  { note: 'C#5', hz:  554.37 },
  { note: 'D5',  hz:  587.33 },
  { note: 'D#5', hz:  622.25 },
  { note: 'E5',  hz:  659.25 },
  { note: 'F5',  hz:  698.46 },
  { note: 'F#5', hz:  739.99 },
  { note: 'G5',  hz:  783.99 },
  { note: 'G#5', hz:  830.61 },
  { note: 'A5',  hz:  880.00 },
  { note: 'A#5', hz:  932.33 },
  { note: 'B5',  hz:  987.77 },
  { note: 'C6',  hz: 1046.50 }
];

class PitchDetector {
  constructor() {
    this._audioCtx = null;
    this._analyser = null;
    this._buffer   = null;
    this._stream   = null;
    this._rafId    = null;
    this.running   = false;
    this.saHz      = 130.81; // default C3
  }

  setShruti(hz) { this.saHz = hz; }

  _getCtx() {
    if (!this._audioCtx)
      this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return this._audioCtx;
  }

  async start(onResult) {
    const ctx = this._getCtx();
    if (ctx.state === 'suspended') await ctx.resume();

    this._stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    const src = ctx.createMediaStreamSource(this._stream);

    this._analyser = ctx.createAnalyser();
    this._analyser.fftSize = 2048;
    this._buffer = new Float32Array(this._analyser.fftSize);
    src.connect(this._analyser);

    this.running = true;
    const loop = () => {
      if (!this.running) return;
      this._analyser.getFloatTimeDomainData(this._buffer);
      const freq = this._autocorrelate(this._buffer, ctx.sampleRate);
      onResult(freq > 0 ? this._matchSwara(freq) : null);
      this._rafId = requestAnimationFrame(loop);
    };
    loop();
  }

  stop() {
    this.running = false;
    if (this._rafId) { cancelAnimationFrame(this._rafId); this._rafId = null; }
    if (this._stream) { this._stream.getTracks().forEach(t => t.stop()); this._stream = null; }
  }

  // Play a reference tone for swara at semitone index from Sa (0=Sa, 4=Ga3, 7=Pa, etc.)
  playSwaraTone(swaraIdx) {
    const ctx = this._getCtx();
    if (ctx.state === 'suspended') ctx.resume();
    const freq = this.saHz * Math.pow(2, swaraIdx / 12);
    const osc  = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    const t = ctx.currentTime;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.5, t + 0.05);
    gain.gain.setValueAtTime(0.5, t + 0.7);
    gain.gain.linearRampToValueAtTime(0, t + 0.9);
    osc.start(t);
    osc.stop(t + 0.9);
  }

  _autocorrelate(buf, sampleRate) {
    // Silence check
    let rms = 0;
    for (let i = 0; i < buf.length; i++) rms += buf[i] * buf[i];
    if (Math.sqrt(rms / buf.length) < 0.008) return -1;

    // Trim noisy edges
    let r1 = 0, r2 = buf.length - 1;
    for (let i = 0; i < buf.length / 2; i++)
      if (Math.abs(buf[i]) < 0.2) { r1 = i; break; }
    for (let i = 1; i < buf.length / 2; i++)
      if (Math.abs(buf[buf.length - i]) < 0.2) { r2 = buf.length - i; break; }

    const buf2 = buf.slice(r1, r2 + 1);
    const len  = buf2.length;

    // Autocorrelation
    const corr = new Float32Array(len);
    for (let lag = 0; lag < len; lag++) {
      let s = 0;
      for (let i = 0; i < len - lag; i++) s += buf2[i] * buf2[i + lag];
      corr[lag] = s;
    }

    // Skip initial downslope, find first peak
    let d = 0;
    while (d < len - 1 && corr[d] > corr[d + 1]) d++;
    let maxVal = -Infinity, maxPos = -1;
    for (let i = d; i < len; i++)
      if (corr[i] > maxVal) { maxVal = corr[i]; maxPos = i; }
    if (maxPos <= 0 || maxPos >= len - 1) return -1;

    // Parabolic interpolation for sub-sample accuracy
    const x1 = corr[maxPos - 1], x2 = corr[maxPos], x3 = corr[maxPos + 1];
    const a  = (x1 + x3 - 2 * x2) / 2;
    const b  = (x3 - x1) / 2;
    const T0 = a !== 0 ? maxPos - b / (2 * a) : maxPos;
    return sampleRate / T0;
  }

  _matchSwara(freq) {
    // Semitones above Sa (can span multiple octaves)
    const semiFromSa = 12 * Math.log2(freq / this.saHz);
    const octave     = Math.floor(semiFromSa / 12);
    const semi       = ((semiFromSa % 12) + 12) % 12; // normalise to 0..12

    // Find nearest chromatic swara
    let minDist = Infinity, bestIdx = 0;
    for (let i = 0; i < 12; i++) {
      let d = Math.abs(semi - i);
      if (d > 6) d = 12 - d; // wrap around octave
      if (d < minDist) { minDist = d; bestIdx = i; }
    }

    // Cents deviation from that swara (-50 to +50)
    let cents = (semi - bestIdx) * 100;
    if (cents >  600) cents -= 1200;
    if (cents < -600) cents += 1200;

    return {
      freq:       Math.round(freq),
      swaraIdx:   bestIdx,
      swara:      SWARA_NAMES[bestIdx],
      swaraTamil: SWARA_TAMIL[bestIdx],
      cents:      Math.round(cents),
      octave,
      inRaga:  MAYAMALAVAGOWLA.has(bestIdx),
      inTune:  Math.abs(cents) < 25
    };
  }
}

// Global singleton
const pitchDetector = new PitchDetector();
