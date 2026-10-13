import { useState, useEffect, useRef, useCallback } from 'react';
import type { SoundChannel, SoundPreset } from '../types';
import { INITIAL_SOUND_CHANNELS, PRESET_COMBOS } from '../data/soundTracks';
import { useLocalStorage } from './useLocalStorage';

class WebAudioAmbientEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private channelGains: Map<string, GainNode> = new Map();
  private channelSources: Map<string, { stop: () => void }> = new Map();
  private noiseBuffers: Map<string, AudioBuffer> = new Map();

  private initContext() {
    if (this.ctx) return;
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    this.ctx = new AudioContextClass();
    const compressor = this.ctx.createDynamicsCompressor();
    compressor.threshold.setValueAtTime(-18, this.ctx.currentTime);
    compressor.knee.setValueAtTime(12, this.ctx.currentTime);
    compressor.ratio.setValueAtTime(6, this.ctx.currentTime);
    compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
    compressor.release.setValueAtTime(0.25, this.ctx.currentTime);

    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(1, this.ctx.currentTime);
    this.masterGain.connect(compressor);
    compressor.connect(this.ctx.destination);

    this.createNoiseBuffers();
  }

  private createNoiseBuffers() {
    if (!this.ctx) return;
    const sampleRate = this.ctx.sampleRate;

    // 1. Pink Noise Buffer (5 giây loop)
    const duration = 5;
    const bufferSize = sampleRate * duration;
    const pinkBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
    const data = pinkBuffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    }
    this.noiseBuffers.set('pink', pinkBuffer);

    // 2. Campfire Crackle Buffer (6 giây loop mô phỏng tiếng gỗ nổ lách tách chân thực)
    const crackleDuration = 6;
    const crackleSize = sampleRate * crackleDuration;
    const crackleBuffer = this.ctx.createBuffer(1, crackleSize, sampleRate);
    const cData = crackleBuffer.getChannelData(0);

    let pos = Math.floor(sampleRate * 0.04);
    while (pos < crackleSize) {
      pos += Math.floor((0.018 + Math.random() * 0.052) * sampleRate);
      if (pos >= crackleSize) break;

      const isBigSnap = Math.random() < 0.07;
      const isMediumPop = Math.random() < 0.28;
      const snapDuration = isBigSnap ? 0.022 : isMediumPop ? 0.01 : 0.004;
      const snapLen = Math.floor(snapDuration * sampleRate);
      const snapFreq = isBigSnap ? 550 + Math.random() * 600 : 1900 + Math.random() * 2800;
      const amplitude = isBigSnap ? 0.75 : isMediumPop ? 0.35 : 0.15;

      for (let j = 0; j < snapLen && pos + j < crackleSize; j++) {
        const t = j / sampleRate;
        const decay = Math.exp(-t * (isBigSnap ? 190 : 550));
        const wave = Math.sin(2 * Math.PI * snapFreq * t);
        const noise = (Math.random() * 2 - 1) * 0.35;
        cData[pos + j] += (wave + noise) * decay * amplitude;
      }
    }
    this.noiseBuffers.set('crackle', crackleBuffer);
  }

  public resume() {
    this.initContext();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterMute(isMuted: boolean) {
    if (!this.masterGain || !this.ctx) return;
    this.masterGain.gain.setTargetAtTime(isMuted ? 0 : 1, this.ctx.currentTime, 0.05);
  }

  public setChannelVolume(id: string, volume: number) {
    this.resume();
    if (!this.ctx || !this.masterGain) return;
    let gain = this.channelGains.get(id);
    if (!gain) {
      gain = this.ctx.createGain();
      gain.connect(this.masterGain);
      this.channelGains.set(id, gain);
    }
    const targetGain = Math.pow(volume / 100, 1.8) * 0.7;
    gain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
  }

  // 1. Mưa rào (Rain)
  private startRain(gain: GainNode): { stop: () => void } {
    if (!this.ctx) return { stop: () => {} };
    const pink = this.noiseBuffers.get('pink');
    if (!pink) return { stop: () => {} };

    const src = this.ctx.createBufferSource();
    src.buffer = pink;
    src.loop = true;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(1500, this.ctx.currentTime);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(260, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.18, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    const rainGain = this.ctx.createGain();
    rainGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(rainGain.gain);

    src.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(rainGain);
    rainGain.connect(gain);

    src.start();
    lfo.start();

    return {
      stop: () => {
        try {
          src.stop();
          lfo.stop();
          src.disconnect();
          lfo.disconnect();
        } catch {}
      },
    };
  }

  // 2. Sấm chớp xa (Thunder)
  private startThunder(gain: GainNode): { stop: () => void } {
    if (!this.ctx) return { stop: () => {} };
    const ctx = this.ctx;
    const pink = this.noiseBuffers.get('pink');
    if (!pink) return { stop: () => {} };

    // Nền giông bão âm ỉ xa
    const stormSrc = ctx.createBufferSource();
    stormSrc.buffer = pink;
    stormSrc.loop = true;
    const stormFilter = ctx.createBiquadFilter();
    stormFilter.type = 'lowpass';
    stormFilter.frequency.setValueAtTime(65, ctx.currentTime);
    const stormGain = ctx.createGain();
    stormGain.gain.setValueAtTime(0.04, ctx.currentTime);
    stormSrc.connect(stormFilter);
    stormFilter.connect(stormGain);
    stormGain.connect(gain);
    stormSrc.start();

    let isRunning = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const activeNodes: (AudioBufferSourceNode | OscillatorNode)[] = [];

    const triggerThunderclap = () => {
      if (!isRunning || !this.ctx) return;
      const now = this.ctx.currentTime;

      // Tiếng rung trầm rung chuyển (sub rumble)
      const subOsc = this.ctx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(52, now);
      subOsc.frequency.exponentialRampToValueAtTime(36, now + 2.0);

      const subGain = this.ctx.createGain();
      subGain.gain.setValueAtTime(0.001, now);
      subGain.gain.linearRampToValueAtTime(0.7, now + 0.12);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

      subOsc.connect(subGain);
      subGain.connect(gain);
      subOsc.start(now);
      subOsc.stop(now + 2.3);
      activeNodes.push(subOsc);

      // Thân tiếng sấm rền rền vang xa
      const strikeSrc = this.ctx.createBufferSource();
      strikeSrc.buffer = pink;
      strikeSrc.loop = true;

      const bpf = this.ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.setValueAtTime(70, now);
      bpf.Q.setValueAtTime(3.5, now);

      const strikeGain = this.ctx.createGain();
      strikeGain.gain.setValueAtTime(0.001, now);
      strikeGain.gain.linearRampToValueAtTime(0.9, now + 0.28);
      strikeGain.gain.setValueAtTime(0.5, now + 0.7);
      strikeGain.gain.linearRampToValueAtTime(0.75, now + 1.15);
      strikeGain.gain.setValueAtTime(0.4, now + 1.7);
      strikeGain.gain.linearRampToValueAtTime(0.55, now + 2.2);
      strikeGain.gain.exponentialRampToValueAtTime(0.001, now + 5.8);

      strikeSrc.connect(bpf);
      bpf.connect(strikeGain);
      strikeGain.connect(gain);
      strikeSrc.start(now);
      strikeSrc.stop(now + 6.0);
      activeNodes.push(strikeSrc);

      const nextWait = 9000 + Math.random() * 7000;
      timer = setTimeout(triggerThunderclap, nextWait);
    };

    timer = setTimeout(triggerThunderclap, 800);

    return {
      stop: () => {
        isRunning = false;
        if (timer) clearTimeout(timer);
        try {
          stormSrc.stop();
          stormSrc.disconnect();
        } catch {}
        activeNodes.forEach((node) => {
          try {
            node.stop();
            node.disconnect();
          } catch {}
        });
        activeNodes.length = 0;
      },
    };
  }

  // 3. Lửa trại (Campfire)
  private startCampfire(gain: GainNode): { stop: () => void } {
    if (!this.ctx) return { stop: () => {} };
    const pink = this.noiseBuffers.get('pink');
    const crackle = this.noiseBuffers.get('crackle');
    if (!pink || !crackle) return { stop: () => {} };

    // Tiếng bập bùng ấm áp của ngọn lửa
    const lowSrc = this.ctx.createBufferSource();
    lowSrc.buffer = pink;
    lowSrc.loop = true;
    const lowFilter = this.ctx.createBiquadFilter();
    lowFilter.type = 'lowpass';
    lowFilter.frequency.setValueAtTime(320, this.ctx.currentTime);
    const lowGain = this.ctx.createGain();
    lowGain.gain.setValueAtTime(0.45, this.ctx.currentTime);

    lowSrc.connect(lowFilter);
    lowFilter.connect(lowGain);
    lowGain.connect(gain);

    // Tiếng gỗ cháy nổ lách tách đanh giòn
    const crackleSrc = this.ctx.createBufferSource();
    crackleSrc.buffer = crackle;
    crackleSrc.loop = true;
    const crackleFilter = this.ctx.createBiquadFilter();
    crackleFilter.type = 'highpass';
    crackleFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);
    const crackleGain = this.ctx.createGain();
    crackleGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    crackleSrc.connect(crackleFilter);
    crackleFilter.connect(crackleGain);
    crackleGain.connect(gain);

    lowSrc.start();
    crackleSrc.start();

    return {
      stop: () => {
        try {
          lowSrc.stop();
          crackleSrc.stop();
          lowSrc.disconnect();
          crackleSrc.disconnect();
        } catch {}
      },
    };
  }

  // 4. Gió thoảng (Wind)
  private startWind(gain: GainNode): { stop: () => void } {
    if (!this.ctx) return { stop: () => {} };
    const pink = this.noiseBuffers.get('pink');
    if (!pink) return { stop: () => {} };

    const src = this.ctx.createBufferSource();
    src.buffer = pink;
    src.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(360, this.ctx.currentTime);
    filter.Q.setValueAtTime(2.6, this.ctx.currentTime);

    const lfo1 = this.ctx.createOscillator();
    lfo1.frequency.setValueAtTime(0.08, this.ctx.currentTime);
    const lfo1Gain = this.ctx.createGain();
    lfo1Gain.gain.setValueAtTime(180, this.ctx.currentTime);
    lfo1.connect(lfo1Gain);
    lfo1Gain.connect(filter.frequency);

    const lfo2 = this.ctx.createOscillator();
    lfo2.frequency.setValueAtTime(0.19, this.ctx.currentTime);
    const lfo2Gain = this.ctx.createGain();
    lfo2Gain.gain.setValueAtTime(110, this.ctx.currentTime);
    lfo2.connect(lfo2Gain);
    lfo2Gain.connect(filter.frequency);

    const windGain = this.ctx.createGain();
    windGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
    const ampLfo = this.ctx.createOscillator();
    ampLfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
    const ampLfoGain = this.ctx.createGain();
    ampLfoGain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    ampLfo.connect(ampLfoGain);
    ampLfoGain.connect(windGain.gain);

    src.connect(filter);
    filter.connect(windGain);
    windGain.connect(gain);

    src.start();
    lfo1.start();
    lfo2.start();
    ampLfo.start();

    return {
      stop: () => {
        try {
          src.stop();
          lfo1.stop();
          lfo2.stop();
          ampLfo.stop();
          src.disconnect();
          filter.disconnect();
        } catch {}
      },
    };
  }

  // 5. Sóng biển (Waves)
  private startWaves(gain: GainNode): { stop: () => void } {
    if (!this.ctx) return { stop: () => {} };
    const pink = this.noiseBuffers.get('pink');
    if (!pink) return { stop: () => {} };

    const src = this.ctx.createBufferSource();
    src.buffer = pink;
    src.loop = true;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(350, this.ctx.currentTime);

    const waveGain = this.ctx.createGain();
    waveGain.gain.setValueAtTime(0.45, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.085, this.ctx.currentTime);

    const filterMod = this.ctx.createGain();
    filterMod.gain.setValueAtTime(450, this.ctx.currentTime);
    lfo.connect(filterMod);
    filterMod.connect(lowpass.frequency);

    const gainMod = this.ctx.createGain();
    gainMod.gain.setValueAtTime(0.3, this.ctx.currentTime);
    lfo.connect(gainMod);
    gainMod.connect(waveGain.gain);

    const foamSrc = this.ctx.createBufferSource();
    foamSrc.buffer = pink;
    foamSrc.loop = true;
    const foamFilter = this.ctx.createBiquadFilter();
    foamFilter.type = 'highpass';
    foamFilter.frequency.setValueAtTime(2200, this.ctx.currentTime);
    const foamGain = this.ctx.createGain();
    foamGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gainMod.connect(foamGain.gain);

    src.connect(lowpass);
    lowpass.connect(waveGain);
    waveGain.connect(gain);

    foamSrc.connect(foamFilter);
    foamFilter.connect(foamGain);
    foamGain.connect(gain);

    src.start();
    foamSrc.start();
    lfo.start();

    return {
      stop: () => {
        try {
          src.stop();
          foamSrc.stop();
          lfo.stop();
          src.disconnect();
          foamSrc.disconnect();
        } catch {}
      },
    };
  }

  // 6. Suối rừng (Forest Stream)
  private startStream(gain: GainNode): { stop: () => void } {
    if (!this.ctx) return { stop: () => {} };
    const pink = this.noiseBuffers.get('pink');
    if (!pink) return { stop: () => {} };

    const src = this.ctx.createBufferSource();
    src.buffer = pink;
    src.loop = true;
    const baseFilter = this.ctx.createBiquadFilter();
    baseFilter.type = 'bandpass';
    baseFilter.frequency.setValueAtTime(900, this.ctx.currentTime);
    baseFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);

    const streamGain = this.ctx.createGain();
    streamGain.gain.setValueAtTime(0.5, this.ctx.currentTime);

    src.connect(baseFilter);
    baseFilter.connect(streamGain);
    streamGain.connect(gain);

    const lfos: OscillatorNode[] = [];
    const configs = [
      { freq: 950, q: 5.5, lfoFreq: 1.6, depth: 220, vol: 0.35 },
      { freq: 1700, q: 6.5, lfoFreq: 2.5, depth: 320, vol: 0.3 },
      { freq: 2450, q: 5.8, lfoFreq: 3.6, depth: 380, vol: 0.2 },
    ];

    configs.forEach((cfg) => {
      if (!this.ctx) return;
      const bpf = this.ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.setValueAtTime(cfg.freq, this.ctx.currentTime);
      bpf.Q.setValueAtTime(cfg.q, this.ctx.currentTime);

      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(cfg.lfoFreq, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(cfg.depth, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(bpf.frequency);

      const bpfGain = this.ctx.createGain();
      bpfGain.gain.setValueAtTime(cfg.vol, this.ctx.currentTime);

      src.connect(bpf);
      bpf.connect(bpfGain);
      bpfGain.connect(gain);

      lfo.start();
      lfos.push(lfo);
    });

    src.start();

    return {
      stop: () => {
        try {
          src.stop();
          lfos.forEach((lfo) => lfo.stop());
          src.disconnect();
        } catch {}
      },
    };
  }

  // 7. Chim hót (Bird Song)
  private startBirds(gain: GainNode): { stop: () => void } {
    if (!this.ctx) return { stop: () => {} };
    let isRunning = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const activeNodes: (OscillatorNode | GainNode)[] = [];

    const delay = this.ctx.createDelay();
    delay.delayTime.setValueAtTime(0.14, this.ctx.currentTime);
    const delayFeedback = this.ctx.createGain();
    delayFeedback.gain.setValueAtTime(0.2, this.ctx.currentTime);
    delay.connect(delayFeedback);
    delayFeedback.connect(delay);
    delay.connect(gain);

    const birdOutput = this.ctx.createGain();
    birdOutput.gain.setValueAtTime(0.4, this.ctx.currentTime);
    birdOutput.connect(gain);
    birdOutput.connect(delay);

    const playChirp = (startFreq: number, endFreq: number, dur: number, startTime: number, vol = 0.6) => {
      if (!this.ctx || !isRunning) return;
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(startFreq, startTime);
      osc.frequency.exponentialRampToValueAtTime(endFreq, startTime + dur);

      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0.001, startTime);
      g.gain.linearRampToValueAtTime(vol, startTime + 0.012);
      g.gain.exponentialRampToValueAtTime(0.001, startTime + dur);

      osc.connect(g);
      g.connect(birdOutput);
      osc.start(startTime);
      osc.stop(startTime + dur + 0.02);
      activeNodes.push(osc, g);
    };

    const playPhrase = () => {
      if (!isRunning || !this.ctx) return;
      const now = this.ctx.currentTime;
      const motif = Math.floor(Math.random() * 4);

      if (motif === 0) {
        playChirp(3100, 4800, 0.075, now);
        playChirp(3400, 5200, 0.085, now + 0.12);
      } else if (motif === 1) {
        playChirp(4600, 3400, 0.07, now);
        playChirp(4300, 3200, 0.07, now + 0.08);
        playChirp(3900, 2900, 0.09, now + 0.16);
      } else if (motif === 2) {
        playChirp(3200, 4400, 0.06, now);
        playChirp(4400, 3500, 0.07, now + 0.065);
        playChirp(3600, 4800, 0.09, now + 0.14);
      } else {
        playChirp(3800, 4600, 0.05, now);
        playChirp(4100, 4900, 0.06, now + 0.07);
      }

      const nextWait = 1800 + Math.random() * 2000;
      timer = setTimeout(playPhrase, nextWait);
    };

    timer = setTimeout(playPhrase, 200);

    return {
      stop: () => {
        isRunning = false;
        if (timer) clearTimeout(timer);
        try {
          delay.disconnect();
          delayFeedback.disconnect();
          birdOutput.disconnect();
        } catch {}
        activeNodes.forEach((node) => {
          try {
            if ('stop' in node) node.stop();
            node.disconnect();
          } catch {}
        });
        activeNodes.length = 0;
      },
    };
  }

  // 8. Quán cafe (Coffee Shop Ambience)
  private startCafe(gain: GainNode): { stop: () => void } {
    if (!this.ctx) return { stop: () => {} };
    const pink = this.noiseBuffers.get('pink');
    if (!pink) return { stop: () => {} };

    // Tiếng trò chuyện rì rầm mờ mờ xa xa (room tone / murmur)
    const src = this.ctx.createBufferSource();
    src.buffer = pink;
    src.loop = true;

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(800, this.ctx.currentTime);

    const bpf = this.ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.setValueAtTime(450, this.ctx.currentTime);
    bpf.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.22, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    const murmurGain = this.ctx.createGain();
    murmurGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(murmurGain.gain);

    src.connect(lowpass);
    lowpass.connect(bpf);
    bpf.connect(murmurGain);
    murmurGain.connect(gain);
    src.start();
    lfo.start();

    // Tiếng ly tách / thìa gốm va chạm nhẹ nhàng thỉnh thoảng
    let isRunning = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const activeNodes: (OscillatorNode | GainNode)[] = [];

    const triggerCupClink = () => {
      if (!isRunning || !this.ctx) return;
      const now = this.ctx.currentTime;
      const freq = 2900 + Math.random() * 800;

      const osc1 = this.ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      const osc2 = this.ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 1.5, now);

      const clinkGain = this.ctx.createGain();
      clinkGain.gain.setValueAtTime(0.001, now);
      clinkGain.gain.linearRampToValueAtTime(0.07, now + 0.003);
      clinkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc1.connect(clinkGain);
      osc2.connect(clinkGain);
      clinkGain.connect(gain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.14);
      osc2.stop(now + 0.14);
      activeNodes.push(osc1, osc2, clinkGain);

      const nextWait = 4500 + Math.random() * 4500;
      timer = setTimeout(triggerCupClink, nextWait);
    };

    timer = setTimeout(triggerCupClink, 1500);

    return {
      stop: () => {
        isRunning = false;
        if (timer) clearTimeout(timer);
        try {
          src.stop();
          lfo.stop();
          src.disconnect();
          lfo.disconnect();
        } catch {}
        activeNodes.forEach((node) => {
          try {
            if ('stop' in node) node.stop();
            node.disconnect();
          } catch {}
        });
        activeNodes.length = 0;
      },
    };
  }

  // 9. Bàn phím cơ (Mechanical Keyboard)
  private startKeyboard(gain: GainNode): { stop: () => void } {
    if (!this.ctx) return { stop: () => {} };
    const pink = this.noiseBuffers.get('pink');
    if (!pink) return { stop: () => {} };

    let isRunning = true;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const activeNodes: (AudioBufferSourceNode | OscillatorNode | GainNode)[] = [];

    const playKeyPress = (isSpacebar: boolean, time: number) => {
      if (!this.ctx || !isRunning) return;

      // Click đanh của switch cơ
      const clickSrc = this.ctx.createBufferSource();
      clickSrc.buffer = pink;
      const bpf = this.ctx.createBiquadFilter();
      bpf.type = 'bandpass';
      bpf.frequency.setValueAtTime(2800 + Math.random() * 800, time);
      bpf.Q.setValueAtTime(3.5, time);

      const clickGain = this.ctx.createGain();
      clickGain.gain.setValueAtTime(0.001, time);
      clickGain.gain.linearRampToValueAtTime(0.35, time + 0.002);
      clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.015);

      clickSrc.connect(bpf);
      bpf.connect(clickGain);
      clickGain.connect(gain);
      clickSrc.start(time);
      clickSrc.stop(time + 0.02);
      activeNodes.push(clickSrc, clickGain);

      // Âm trầm bottom-out "thock"
      const thockOsc = this.ctx.createOscillator();
      thockOsc.type = 'sine';
      const thockFreq = isSpacebar ? 420 : 750 + Math.random() * 250;
      thockOsc.frequency.setValueAtTime(thockFreq, time);
      thockOsc.frequency.exponentialRampToValueAtTime(thockFreq * 0.6, time + 0.03);

      const thockGain = this.ctx.createGain();
      thockGain.gain.setValueAtTime(0.001, time);
      thockGain.gain.linearRampToValueAtTime(isSpacebar ? 0.45 : 0.3, time + 0.003);
      thockGain.gain.exponentialRampToValueAtTime(0.001, time + (isSpacebar ? 0.045 : 0.03));

      thockOsc.connect(thockGain);
      thockGain.connect(gain);
      thockOsc.start(time);
      thockOsc.stop(time + 0.05);
      activeNodes.push(thockOsc, thockGain);
    };

    const triggerTypingBurst = () => {
      if (!isRunning || !this.ctx) return;
      const burstCount = 3 + Math.floor(Math.random() * 6);
      let currentDelay = 0;

      for (let i = 0; i < burstCount; i++) {
        const isSpace = i === burstCount - 1 || Math.random() < 0.12;
        const keyTime = this.ctx.currentTime + currentDelay;
        playKeyPress(isSpace, keyTime);
        currentDelay += 0.085 + Math.random() * 0.075;
      }

      const nextWait = currentDelay * 1000 + 800 + Math.random() * 1400;
      timer = setTimeout(triggerTypingBurst, nextWait);
    };

    timer = setTimeout(triggerTypingBurst, 120);

    return {
      stop: () => {
        isRunning = false;
        if (timer) clearTimeout(timer);
        activeNodes.forEach((node) => {
          try {
            if ('stop' in node) node.stop();
            node.disconnect();
          } catch {}
        });
        activeNodes.length = 0;
      },
    };
  }

  // 10. Dế đêm (Night Crickets)
  private startCrickets(gain: GainNode): { stop: () => void } {
    if (!this.ctx) return { stop: () => {} };

    const osc1 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(4550, this.ctx.currentTime);

    const osc2 = this.ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(4900, this.ctx.currentTime);

    const osc3 = this.ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(9400, this.ctx.currentTime);

    const pulseGain = this.ctx.createGain();
    pulseGain.gain.setValueAtTime(0.25, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(3.8, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(pulseGain.gain);

    const harmGain = this.ctx.createGain();
    harmGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    osc3.connect(harmGain);
    harmGain.connect(pulseGain);

    osc1.connect(pulseGain);
    osc2.connect(pulseGain);
    pulseGain.connect(gain);

    osc1.start();
    osc2.start();
    osc3.start();
    lfo.start();

    return {
      stop: () => {
        try {
          osc1.stop();
          osc2.stop();
          osc3.stop();
          lfo.stop();
          osc1.disconnect();
          osc2.disconnect();
          osc3.disconnect();
          lfo.disconnect();
        } catch {}
      },
    };
  }

  public startChannel(id: string) {
    this.resume();
    if (!this.ctx || !this.masterGain) return;
    if (this.channelSources.has(id)) return;

    let gain = this.channelGains.get(id);
    if (!gain) {
      gain = this.ctx.createGain();
      gain.connect(this.masterGain);
      this.channelGains.set(id, gain);
    }

    switch (id) {
      case 'rain':
        this.channelSources.set(id, this.startRain(gain));
        break;
      case 'thunder':
        this.channelSources.set(id, this.startThunder(gain));
        break;
      case 'campfire':
        this.channelSources.set(id, this.startCampfire(gain));
        break;
      case 'wind':
        this.channelSources.set(id, this.startWind(gain));
        break;
      case 'waves':
        this.channelSources.set(id, this.startWaves(gain));
        break;
      case 'stream':
        this.channelSources.set(id, this.startStream(gain));
        break;
      case 'birds':
        this.channelSources.set(id, this.startBirds(gain));
        break;
      case 'cafe':
        this.channelSources.set(id, this.startCafe(gain));
        break;
      case 'keyboard':
        this.channelSources.set(id, this.startKeyboard(gain));
        break;
      case 'crickets':
        this.channelSources.set(id, this.startCrickets(gain));
        break;
      default:
        break;
    }
  }

  public stopChannel(id: string) {
    const source = this.channelSources.get(id);
    if (source) {
      try {
        source.stop();
      } catch {
        // Ignored
      }
      this.channelSources.delete(id);
    }
  }
}

export function useAudioMixer() {
  const [channels, setChannels] = useLocalStorage<SoundChannel[]>(
    'vibespace_mixer_v1',
    INITIAL_SOUND_CHANNELS
  );

  const [isMasterMuted, setIsMasterMuted] = useState(false);
  const engineRef = useRef<WebAudioAmbientEngine | null>(null);

  useEffect(() => {
    engineRef.current = new WebAudioAmbientEngine();

    const unlockAudio = () => {
      engineRef.current?.resume();
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('keydown', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    return () => {
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, []);

  // Đồng bộ trạng thái audio engine khi channels hoặc mute thay đổi
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.setMasterMute(isMasterMuted);

    channels.forEach((ch) => {
      engine.setChannelVolume(ch.id, ch.volume);
      if (ch.isActive) {
        engine.startChannel(ch.id);
      } else {
        engine.stopChannel(ch.id);
      }
    });
  }, [channels, isMasterMuted]);

  const toggleChannel = useCallback((id: string) => {
    engineRef.current?.resume();
    setChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, isActive: !ch.isActive } : ch))
    );
  }, [setChannels]);

  const updateChannelVolume = useCallback((id: string, volume: number) => {
    engineRef.current?.resume();
    setChannels((prev) =>
      prev.map((ch) => (ch.id === id ? { ...ch, volume } : ch))
    );
  }, [setChannels]);

  const applyPreset = useCallback((preset: SoundPreset) => {
    engineRef.current?.resume();
    setChannels((prev) =>
      prev.map((ch) => {
        const presetVol = preset.channels[ch.id];
        if (presetVol !== undefined) {
          return { ...ch, isActive: true, volume: presetVol };
        }
        return { ...ch, isActive: false };
      })
    );
  }, [setChannels]);

  const muteAll = useCallback(() => {
    setChannels((prev) => prev.map((ch) => ({ ...ch, isActive: false })));
  }, [setChannels]);

  const toggleMasterMute = useCallback(() => {
    setIsMasterMuted((prev) => !prev);
  }, []);

  const activeCount = channels.filter((ch) => ch.isActive).length;

  return {
    channels,
    presets: PRESET_COMBOS,
    isMasterMuted,
    activeCount,
    toggleChannel,
    updateChannelVolume,
    applyPreset,
    muteAll,
    toggleMasterMute,
  };
}
