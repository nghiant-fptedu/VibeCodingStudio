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
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(1, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.createNoiseBuffers();
  }

  private createNoiseBuffers() {
    if (!this.ctx) return;
    const sampleRate = this.ctx.sampleRate;
    const duration = 5; // 5 giây noise lặp vô hạn

    // White & Pink noise buffer
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
    // Chuyển đổi phi tuyến tính (logarithmic/quadratic curve) cho âm lượng tự nhiên
    const targetGain = Math.pow(volume / 100, 1.8) * 0.7;
    gain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.05);
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

    const pinkBuffer = this.noiseBuffers.get('pink');
    if (!pinkBuffer) return;

    // Bộ sinh âm thanh procedural riêng cho từng loại âm thanh
    if (id === 'rain' || id === 'stream') {
      const src = this.ctx.createBufferSource();
      src.buffer = pinkBuffer;
      src.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = id === 'rain' ? 'lowpass' : 'bandpass';
      filter.frequency.setValueAtTime(id === 'rain' ? 1400 : 800, this.ctx.currentTime);

      src.connect(filter);
      filter.connect(gain);
      src.start();
      this.channelSources.set(id, { stop: () => src.stop() });
    } else if (id === 'wind' || id === 'waves') {
      const src = this.ctx.createBufferSource();
      src.buffer = pinkBuffer;
      src.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, this.ctx.currentTime);

      // LFO tạo nhịp sóng hoặc gió thoảng
      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(id === 'waves' ? 0.1 : 0.25, this.ctx.currentTime);
      const lfoGain = this.ctx.createGain();
      lfoGain.gain.setValueAtTime(id === 'waves' ? 250 : 150, this.ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      src.connect(filter);
      filter.connect(gain);
      src.start();
      lfo.start();
      this.channelSources.set(id, {
        stop: () => {
          src.stop();
          lfo.stop();
        },
      });
    } else if (id === 'thunder') {
      const src = this.ctx.createBufferSource();
      src.buffer = pinkBuffer;
      src.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(110, this.ctx.currentTime);

      src.connect(filter);
      filter.connect(gain);
      src.start();
      this.channelSources.set(id, { stop: () => src.stop() });
    } else if (id === 'campfire') {
      const src = this.ctx.createBufferSource();
      src.buffer = pinkBuffer;
      src.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1800, this.ctx.currentTime);

      src.connect(filter);
      filter.connect(gain);
      src.start();
      this.channelSources.set(id, { stop: () => src.stop() });
    } else if (id === 'crickets') {
      // Âm thanh dế đêm tần số cao
      const osc = this.ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(4600, this.ctx.currentTime);

      const pulseGain = this.ctx.createGain();
      pulseGain.gain.setValueAtTime(0.3, this.ctx.currentTime);

      const lfo = this.ctx.createOscillator();
      lfo.frequency.setValueAtTime(3.5, this.ctx.currentTime);
      lfo.connect(pulseGain.gain);

      osc.connect(pulseGain);
      pulseGain.connect(gain);
      osc.start();
      lfo.start();
      this.channelSources.set(id, {
        stop: () => {
          osc.stop();
          lfo.stop();
        },
      });
    } else {
      // Fallback ambient texture cho birds, cafe, keyboard
      const src = this.ctx.createBufferSource();
      src.buffer = pinkBuffer;
      src.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(id === 'birds' ? 3200 : 700, this.ctx.currentTime);

      src.connect(filter);
      filter.connect(gain);
      src.start();
      this.channelSources.set(id, { stop: () => src.stop() });
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
