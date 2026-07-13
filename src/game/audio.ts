// ============================================================================
//  Procedural audio — every sound is synthesized at runtime with WebAudio.
//  No external audio files, so nothing to download and nothing copyrighted.
// ============================================================================

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private master!: GainNode;
  private noiseBuffer!: AudioBuffer;
  enabled = true;

  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.6;
    this.master.connect(this.ctx.destination);

    // Pre-bake a white-noise buffer for guns / footsteps.
    const len = this.ctx.sampleRate * 1.0;
    this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }

  resume() { this.ctx?.resume(); }
  setVolume(v: number) { if (this.master) this.master.gain.value = v; }

  private now() { return this.ctx!.currentTime; }

  private noise(dur: number, gain: number, filterFreq: number, q = 1) {
    if (!this.ctx || !this.enabled) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const flt = this.ctx.createBiquadFilter();
    flt.type = 'bandpass';
    flt.frequency.value = filterFreq;
    flt.Q.value = q;
    const g = this.ctx.createGain();
    const t = this.now();
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(flt).connect(g).connect(this.master);
    src.start(t);
    src.stop(t + dur);
  }

  private tone(freq: number, dur: number, gain: number, type: OscillatorType = 'sine', slideTo?: number) {
    if (!this.ctx || !this.enabled) return;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    const t = this.now();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(gain, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(this.master);
    osc.start(t);
    osc.stop(t + dur);
  }

  // ---- Game sounds --------------------------------------------------------
  shoot(category: string) {
    if (!this.ctx) return;
    switch (category) {
      case 'sniper':
        this.tone(90, 0.35, 0.5, 'sawtooth', 40);
        this.noise(0.3, 0.55, 1400, 0.6);
        break;
      case 'rifle':
        this.tone(140, 0.12, 0.32, 'square', 70);
        this.noise(0.12, 0.5, 2200, 0.8);
        break;
      case 'smg':
        this.tone(180, 0.07, 0.22, 'square', 110);
        this.noise(0.08, 0.4, 2600, 0.9);
        break;
      case 'melee':
        this.tone(600, 0.08, 0.2, 'triangle', 200);
        break;
      default: // sidearm
        this.tone(160, 0.1, 0.28, 'square', 80);
        this.noise(0.1, 0.42, 2400, 0.8);
    }
  }

  reload() {
    this.tone(220, 0.05, 0.15, 'square');
    setTimeout(() => this.noise(0.05, 0.2, 800), 120);
    setTimeout(() => this.tone(340, 0.05, 0.15, 'square'), 380);
  }

  hitMarker() { this.tone(1400, 0.05, 0.18, 'sine'); }
  headshot() { this.tone(2000, 0.06, 0.22, 'sine', 1600); }
  hurt() { this.noise(0.18, 0.4, 500, 0.5); this.tone(120, 0.2, 0.2, 'sawtooth', 60); }
  footstep() { this.noise(0.06, 0.08, 1200, 1.2); }

  plantBeep() { this.tone(880, 0.06, 0.2, 'square'); }
  spikeArmed() { this.tone(440, 0.2, 0.25, 'square', 660); setTimeout(() => this.tone(660, 0.3, 0.25, 'square', 880), 200); }
  spikeTick(fast: boolean) { this.tone(fast ? 1200 : 700, 0.05, 0.18, 'square'); }
  explosion() {
    this.tone(60, 0.9, 0.6, 'sawtooth', 25);
    this.noise(0.9, 0.7, 300, 0.4);
  }
  defused() { this.tone(520, 0.15, 0.25, 'sine', 780); setTimeout(() => this.tone(780, 0.3, 0.25, 'sine', 1040), 150); }

  ability() { this.tone(300, 0.25, 0.22, 'triangle', 900); }
  flash() { this.noise(0.4, 0.4, 4000, 0.3); this.tone(2000, 0.4, 0.2, 'sine', 200); }

  roundWin() { [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => this.tone(f, 0.3, 0.22, 'triangle'), i * 130)); }
  roundLoss() { [400, 320, 240].forEach((f, i) => setTimeout(() => this.tone(f, 0.35, 0.22, 'sawtooth'), i * 160)); }
  buy() { this.tone(700, 0.08, 0.2, 'sine', 1000); }
  uiClick() { this.tone(500, 0.04, 0.14, 'sine'); }
}

export const audio = new AudioEngine();
