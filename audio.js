class AudioManager {
  constructor() {
    this.ctx = null;
    this.mainGain = null;
    this.globalFilter = null; // Global filter modified by sanity level
    this.bgNode = null; // Current background ambient synth node/source
    this.bgType = null; // Active background type
    this.heartbeatInterval = null;
    this.tapeNoiseNode = null;
    this.isMuted = false;
    this.volume = 0.5;
  }

  init() {
    if (this.ctx) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.mainGain = this.ctx.createGain();
      this.mainGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      
      this.globalFilter = this.ctx.createBiquadFilter();
      this.globalFilter.type = "lowpass";
      this.globalFilter.frequency.setValueAtTime(20000, this.ctx.currentTime);
      
      this.mainGain.connect(this.globalFilter);
      this.globalFilter.connect(this.ctx.destination);
    } catch (e) {
      console.error("Web Audio API not supported", e);
    }
  }

  updateSanityFilter(sanity) {
    this.init();
    if (!this.globalFilter || !this.ctx) return;
    const now = this.ctx.currentTime;
    if (sanity < 40) {
      // Muffle the entire game audio below 40% sanity
      this.globalFilter.frequency.exponentialRampToValueAtTime(600, now + 1.0);
    } else {
      // Clear frequency to pass through everything
      this.globalFilter.frequency.exponentialRampToValueAtTime(20000, now + 1.0);
    }
  }

  setVolume(volume) {
    this.volume = volume;
    if (this.mainGain && this.ctx) {
      this.mainGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.mainGain && this.ctx) {
      this.mainGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // --- BACKGROUND AMBIENTS ---
  playBackground(type) {
    this.init();
    if (!this.ctx) return;
    if (this.bgType === type) return; // Already playing

    this.stopBackground();
    this.bgType = type;

    if (type === "drone_creepy") {
      this.bgNode = this.createCreepyDrone();
    } else if (type === "drone_tense") {
      this.bgNode = this.createTenseDrone();
    } else if (type === "drone_horror_climax") {
      this.bgNode = this.createClimaxDrone();
    } else if (type === "ambient_peaceful") {
      this.bgNode = this.createPeacefulDrone();
    } else if (type === "silence") {
      this.stopHeartbeat();
      this.stopTapeNoise();
    }
  }

  stopBackground() {
    if (this.bgNode) {
      try {
        this.bgNode.stop();
      } catch (e) {}
      this.bgNode = null;
    }
    this.bgType = null;
  }

  // Procedural Sound Generator: Creepy Ambient Drone (LFO + low sine detuned oscillators)
  createCreepyDrone() {
    const ctx = this.ctx;
    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0, ctx.currentTime);
    droneGain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 3);
    droneGain.connect(this.mainGain);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.value = 3;
    filter.frequency.setValueAtTime(150, ctx.currentTime);
    filter.connect(droneGain);

    // LFO to sweep filter frequency
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.08; // Very slow sweep
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 80;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    // Detuned Low Oscillators for a beating effect
    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(55, ctx.currentTime); // A1
    osc1.connect(filter);

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(55.7, ctx.currentTime); // Beating
    osc2.connect(filter);

    const osc3 = ctx.createOscillator();
    osc3.type = "triangle";
    osc3.frequency.setValueAtTime(110, ctx.currentTime); // A2
    const osc3Gain = ctx.createGain();
    osc3Gain.gain.value = 0.3;
    osc3.connect(osc3Gain);
    osc3Gain.connect(filter);

    osc1.start();
    osc2.start();
    osc3.start();

    return {
      stop: () => {
        droneGain.gain.setValueAtTime(droneGain.gain.value, ctx.currentTime);
        droneGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.5);
        setTimeout(() => {
          osc1.stop();
          osc2.stop();
          osc3.stop();
          lfo.stop();
        }, 1600);
      }
    };
  }

  // Tense Metallic Drone with higher frequency sweeps and detuned saw waves
  createTenseDrone() {
    const ctx = this.ctx;
    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0, ctx.currentTime);
    droneGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 2);
    droneGain.connect(this.mainGain);

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(250, ctx.currentTime);
    filter.Q.value = 2;
    filter.connect(droneGain);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.3; // Faster modulation
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 120;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const osc1 = ctx.createOscillator();
    osc1.type = "sawtooth";
    osc1.frequency.setValueAtTime(82.4, ctx.currentTime); // E2
    const osc1Gain = ctx.createGain();
    osc1Gain.gain.value = 0.2;
    osc1.connect(osc1Gain);
    osc1Gain.connect(filter);

    const osc2 = ctx.createOscillator();
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(123.47, ctx.currentTime); // B2
    osc2.connect(filter);

    const osc3 = ctx.createOscillator();
    osc3.type = "sawtooth";
    osc3.frequency.setValueAtTime(83.0, ctx.currentTime); // Dissonant beating
    const osc3Gain = ctx.createGain();
    osc3Gain.gain.value = 0.15;
    osc3.connect(osc3Gain);
    osc3Gain.connect(filter);

    osc1.start();
    osc2.start();
    osc3.start();

    return {
      stop: () => {
        droneGain.gain.setValueAtTime(droneGain.gain.value, ctx.currentTime);
        droneGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
        setTimeout(() => {
          osc1.stop();
          osc2.stop();
          osc3.stop();
          lfo.stop();
        }, 1300);
      }
    };
  }

  // Climax Horror Drone (Dissonant Clusters, fast sweeps, terrifying noise blending)
  createClimaxDrone() {
    const ctx = this.ctx;
    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0, ctx.currentTime);
    droneGain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 1.5);
    droneGain.connect(this.mainGain);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, ctx.currentTime);
    filter.Q.value = 5;
    filter.connect(droneGain);

    // Fast filter modulation
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 4.0; // Fast shake
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 200;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    // Dissonant frequencies: G# (103.8), A (110.0), A# (116.5)
    const frequencies = [103.8, 110.0, 116.5, 220.0, 311.1];
    const oscs = [];

    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      osc.type = index % 2 === 0 ? "sawtooth" : "triangle";
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.15;
      
      osc.connect(gainNode);
      gainNode.connect(filter);
      osc.start();
      oscs.push(osc);
    });

    return {
      stop: () => {
        droneGain.gain.setValueAtTime(droneGain.gain.value, ctx.currentTime);
        droneGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.0);
        setTimeout(() => {
          oscs.forEach(osc => osc.stop());
          lfo.stop();
        }, 1100);
      }
    };
  }

  // Peaceful, ethereal ambient pad (soft sine minor major transitions)
  createPeacefulDrone() {
    const ctx = this.ctx;
    const droneGain = ctx.createGain();
    droneGain.gain.setValueAtTime(0, ctx.currentTime);
    droneGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 3);
    droneGain.connect(this.mainGain);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, ctx.currentTime);
    filter.connect(droneGain);

    // Ethereal chord oscillators: C3 (130.8), E3 (164.8), G3 (196.0), B3 (246.9)
    const freqs = [130.81, 164.81, 196.0, 246.94];
    const oscs = [];

    freqs.forEach(freq => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
      
      // Gentle volume swells on individual notes
      const swell = ctx.createOscillator();
      swell.frequency.value = 0.1 + Math.random() * 0.1;
      const swellGain = ctx.createGain();
      swellGain.gain.value = 0.04;
      swell.connect(swellGain);
      swellGain.connect(gainNode.gain);
      swell.start();

      osc.connect(gainNode);
      gainNode.connect(filter);
      osc.start();
      oscs.push({ osc, swell });
    });

    return {
      stop: () => {
        droneGain.gain.setValueAtTime(droneGain.gain.value, ctx.currentTime);
        droneGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.0);
        setTimeout(() => {
          oscs.forEach(o => {
            o.osc.stop();
            o.swell.stop();
          });
        }, 2200);
      }
    };
  }

  // --- SOUND EFFECTS (Sfx triggers) ---
  playSfx(type) {
    this.init();
    if (!this.ctx) return;

    if (type === "key_found") {
      this.playChime(440, 660, 0.4);
    } else if (type === "item_get") {
      this.playChime(329.63, 523.25, 0.6); // E4 to C5 chime
    } else if (type === "piano_creepy_chord") {
      this.playPianoDissonance();
    } else if (type === "jumpscare_short") {
      this.playJumpscareShort();
    } else if (type === "jumpscare_bang") {
      this.playJumpscareBang();
    } else if (type === "jumpscare_scream") {
      this.playJumpscareScream();
    } else if (type === "steps_creepy") {
      this.playThump(100, 0.25);
      setTimeout(() => this.playThump(90, 0.25), 600);
    } else if (type === "steps_ceiling") {
      this.playThump(70, 0.35);
      setTimeout(() => this.playThump(65, 0.35), 700);
      setTimeout(() => this.playThump(68, 0.35), 1400);
    } else if (type === "drag_sound") {
      this.playDragNoise();
    } else if (type === "tape_voice") {
      this.startTapeNoise(0.08);
      // Simulate distorted speech synthesizer
      this.playSynthesizedSpeech("creepy_whisper");
    } else if (type === "tape_voice_play") {
      this.startTapeNoise(0.06);
      this.playChime(349.23, 440.00, 1.2); // Sweet chime under static
    } else if (type === "car_engine") {
      this.playCarEngine();
    } else if (type === "heartbeat_fast") {
      this.startHeartbeat(0.55); // Rapid pulse
    } else if (type === "heartbeat_slow") {
      this.startHeartbeat(1.1); // Steady slow pulse
    } else if (type === "run_heartbeat") {
      this.startHeartbeat(0.4); // Extremely fast pulse
    }
  }

  // Play a simple resonant dual chime (used for items)
  playChime(freq1, freq2, duration) {
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    gainNode.connect(this.mainGain);

    const osc1 = ctx.createOscillator();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(freq1, now);
    osc1.connect(gainNode);

    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(freq2, now);
    osc2.connect(gainNode);

    osc1.start();
    osc2.start();
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  // Play a dull thud/step
  playThump(freq, duration) {
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.4, now + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    gainNode.connect(this.mainGain);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(100, now);
    filter.connect(gainNode);

    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + duration);
    osc.connect(filter);

    osc.start();
    osc.stop(now + duration);
  }

  // Synthesis of a creepy detuned piano chord (dissonant)
  playPianoDissonance() {
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const chord = [138.59, 146.83, 164.81, 233.08, 329.63]; // Dissonant cluster C#3, D3, E3, A#3, E4

    chord.forEach((freq, idx) => {
      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.18 - (idx * 0.02), now + 0.02 + (idx * 0.01)); // Slight arpeggio
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
      gainNode.connect(this.mainGain);

      // Overtones for piano simulation
      for (let overtone = 1; overtone <= 3; overtone++) {
        const osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq * overtone, now);
        
        const overtoneGain = ctx.createGain();
        overtoneGain.gain.setValueAtTime(0.2 / overtone, now);
        
        osc.connect(overtoneGain);
        overtoneGain.connect(gainNode);
        
        osc.start();
        osc.stop(now + 3.2);
      }
    });
  }

  // Jumpscare 1: Short dramatic shock/hit (metallic screech + noise blast)
  playJumpscareShort() {
    const ctx = this.ctx;
    const now = ctx.currentTime;
    
    // Noise blast
    const noise = this.createNoiseBufferNode();
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(1000, now);
    noiseFilter.Q.setValueAtTime(5, now);
    
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.6, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.mainGain);
    noise.start();

    // High metal shriek
    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.linearRampToValueAtTime(800, now + 0.3);

    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.3, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

    osc.connect(oscGain);
    oscGain.connect(this.mainGain);
    osc.start();
    osc.stop(now + 0.6);
  }

  // Jumpscare 2: Loud explosion thud with low rumble
  playJumpscareBang() {
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.8, now);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);
    gainNode.connect(this.mainGain);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(120, now);
    filter.connect(gainNode);

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.5);
    osc.connect(filter);

    // Add white noise for texture
    const noise = this.createNoiseBufferNode();
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
    noise.connect(filter);
    
    osc.start();
    noise.start();
    osc.stop(now + 2.0);
  }

  // Jumpscare 3: Screeching horror scream (FM synthesis and white noise burst)
  playJumpscareScream() {
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const mainSfxGain = ctx.createGain();
    mainSfxGain.gain.setValueAtTime(0.7, now);
    mainSfxGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
    mainSfxGain.connect(this.mainGain);

    // Pitch sweep screecher
    const carrier = ctx.createOscillator();
    carrier.type = "sawtooth";
    carrier.frequency.setValueAtTime(600, now);
    carrier.frequency.exponentialRampToValueAtTime(1500, now + 0.5);
    carrier.frequency.linearRampToValueAtTime(200, now + 1.8);

    // Modulator for terrifying vibrato/screech
    const modulator = ctx.createOscillator();
    modulator.type = "sine";
    modulator.frequency.value = 55; // Sub-harmonic distortion
    const modGain = ctx.createGain();
    modGain.gain.value = 400;

    modulator.connect(modGain);
    modGain.connect(carrier.frequency);

    carrier.connect(mainSfxGain);
    
    // Filtered noise scream
    const noise = this.createNoiseBufferNode();
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.setValueAtTime(2000, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(1000, now + 1.5);
    noiseFilter.Q.value = 3;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(mainSfxGain);

    carrier.start();
    modulator.start();
    noise.start();

    carrier.stop(now + 2.5);
    modulator.stop(now + 2.5);
  }

  // Crawling drag noise (creepy sand friction)
  playDragNoise() {
    const ctx = this.ctx;
    const now = ctx.currentTime;
    
    const noise = this.createNoiseBufferNode();
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.Q.value = 4;
    filter.frequency.setValueAtTime(150, now);
    filter.frequency.linearRampToValueAtTime(80, now + 1.5);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.25, now + 0.3);
    gain.gain.linearRampToValueAtTime(0.0001, now + 1.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.mainGain);
    noise.start();
  }

  // Synthesized scary motor for the escape sequence
  playCarEngine() {
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.2, now + 0.5);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);
    gainNode.connect(this.mainGain);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(120, now);
    filter.connect(gainNode);

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(45, now);
    osc.frequency.linearRampToValueAtTime(90, now + 2.0); // Acceleration
    osc.connect(filter);

    osc.start();
    osc.stop(now + 3.0);
  }

  // Eerie whispered voice synthesis using filtered sine frequencies (Formant-like)
  playSynthesizedSpeech(type) {
    const ctx = this.ctx;
    const now = ctx.currentTime;

    // We trigger random eerie vocal vowel frequencies
    const formants = [400, 800, 1200, 1600];
    formants.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      // Tremolo
      const tremolo = ctx.createOscillator();
      tremolo.frequency.value = 8 + (Math.random() * 6);
      const tremoloGain = ctx.createGain();
      tremoloGain.gain.value = 0.015;
      tremolo.connect(tremoloGain);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 0.2 + (idx * 0.1));
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.0);

      tremoloGain.connect(gain.gain);
      osc.connect(gain);
      gain.connect(this.mainGain);
      
      tremolo.start();
      osc.start();
      osc.stop(now + 2.5);
      tremolo.stop(now + 2.5);
    });
  }

  // --- STEADY HEARTBEAT GENERATOR ---
  startHeartbeat(intervalSec) {
    this.stopHeartbeat();
    this.playHeartbeatStep(); // Immediate beat
    this.heartbeatInterval = setInterval(() => {
      this.playHeartbeatStep();
    }, intervalSec * 1000);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  playHeartbeatStep() {
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const playThump = (timeOffset, volume) => {
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now + timeOffset);
      g.gain.linearRampToValueAtTime(volume, now + timeOffset + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, now + timeOffset + 0.18);
      g.connect(this.mainGain);

      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.setValueAtTime(65, now + timeOffset);
      f.connect(g);

      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(60, now + timeOffset);
      osc.frequency.exponentialRampToValueAtTime(10, now + timeOffset + 0.15);
      osc.connect(f);

      osc.start(now + timeOffset);
      osc.stop(now + timeOffset + 0.2);
    };

    // Heartbeat is double thump: lub-dub
    playThump(0, 0.45);
    playThump(0.18, 0.35);
  }

  // --- WHITE NOISE & TAPE TENSION ---
  startTapeNoise(volume) {
    this.stopTapeNoise();
    if (!this.ctx) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const noise = this.createNoiseBufferNode();
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.value = 1.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.3);
    
    // Slowly modulate volume to sound like old dust/tape crackle
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 12; // crackle frequency
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = volume * 0.4;
    
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.mainGain);

    lfo.start();
    noise.start();

    this.tapeNoiseNode = {
      stop: () => {
        gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
        setTimeout(() => {
          noise.stop();
          lfo.stop();
        }, 600);
      }
    };
  }

  stopTapeNoise() {
    if (this.tapeNoiseNode) {
      try {
        this.tapeNoiseNode.stop();
      } catch (e) {}
      this.tapeNoiseNode = null;
    }
  }

  // Helper: Create raw white noise buffer
  createNoiseBufferNode() {
    const bufferSize = this.ctx.sampleRate * 2; // 2 seconds buffer
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    return source;
  }
}

// Global Single Instance
window.gameAudio = new AudioManager();
