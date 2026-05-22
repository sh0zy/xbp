import type { AudioSettings } from '../game/types';
import { DEFAULT_AUDIO_SETTINGS } from '../game/constants';
import { ambientSpecs, type AmbientName } from './ambient';
import { sfxSpecs, type SfxName } from './sfx';

class AudioManager {
  private context: AudioContext | null = null;
  private master: GainNode | null = null;
  private bgm: GainNode | null = null;
  private se: GainNode | null = null;
  private ambientNodes: AudioNode[] = [];
  private chaseNodes: AudioNode[] = [];
  private currentAmbient: AmbientName | null = null;
  private settings: AudioSettings = DEFAULT_AUDIO_SETTINGS;

  async init(settings?: AudioSettings): Promise<void> {
    if (settings) {
      this.settings = settings;
    }
    if (this.context) {
      if (this.context.state === 'suspended') {
        await this.context.resume().catch(() => undefined);
      }
      return;
    }

    const AudioCtor = window.AudioContext ?? window.webkitAudioContext;
    if (!AudioCtor) {
      return;
    }

    try {
      this.context = new AudioCtor();
      this.master = this.context.createGain();
      this.bgm = this.context.createGain();
      this.se = this.context.createGain();
      this.bgm.connect(this.master);
      this.se.connect(this.master);
      this.master.connect(this.context.destination);
      this.applySettings();
      if (this.context.state === 'suspended') {
        await this.context.resume().catch(() => undefined);
      }
    } catch {
      this.context = null;
    }
  }

  setSettings(settings: AudioSettings): void {
    this.settings = settings;
    this.applySettings();
  }

  startAmbient(name: AmbientName): void {
    if (!this.context || !this.bgm || this.currentAmbient === name || !this.settings.enabled) {
      return;
    }
    this.stopAmbient();
    const spec = ambientSpecs[name];
    try {
      const oscA = this.context.createOscillator();
      const oscB = this.context.createOscillator();
      const filter = this.context.createBiquadFilter();
      const tremolo = this.context.createOscillator();
      const tremoloGain = this.context.createGain();
      const padGain = this.context.createGain();

      oscA.type = 'sine';
      oscB.type = 'triangle';
      oscA.frequency.value = spec.base;
      oscB.frequency.value = spec.second;
      tremolo.frequency.value = spec.pulse;
      tremoloGain.gain.value = 0.08;
      padGain.gain.value = 0.18;
      filter.type = 'lowpass';
      filter.frequency.value = name === 'chase' ? 680 : 420;

      tremolo.connect(tremoloGain);
      tremoloGain.connect(padGain.gain);
      oscA.connect(filter);
      oscB.connect(filter);
      filter.connect(padGain);
      padGain.connect(this.bgm);
      oscA.start();
      oscB.start();
      tremolo.start();
      this.ambientNodes = [oscA, oscB, tremolo, filter, tremoloGain, padGain];
      this.currentAmbient = name;
      this.playNoiseBed(spec.noise, this.bgm, this.ambientNodes);
    } catch {
      this.stopAmbient();
    }
  }

  stopAmbient(): void {
    this.ambientNodes.forEach((node) => {
      try {
        if ('stop' in node && typeof node.stop === 'function') {
          node.stop();
        }
        node.disconnect();
      } catch {
        // silent audio cleanup
      }
    });
    this.ambientNodes = [];
    this.currentAmbient = null;
  }

  startChase(): void {
    if (!this.context || !this.bgm || !this.settings.enabled || this.chaseNodes.length > 0) {
      return;
    }
    this.startAmbient('chase');
    try {
      const pulse = this.context.createOscillator();
      const gain = this.context.createGain();
      pulse.type = 'square';
      pulse.frequency.value = 7.5;
      gain.gain.value = 0.04;
      pulse.connect(gain);
      gain.connect(this.bgm);
      pulse.start();
      this.chaseNodes = [pulse, gain];
    } catch {
      this.chaseNodes = [];
    }
  }

  stopChase(nextAmbient: AmbientName): void {
    this.chaseNodes.forEach((node) => {
      try {
        if ('stop' in node && typeof node.stop === 'function') {
          node.stop();
        }
        node.disconnect();
      } catch {
        // silent audio cleanup
      }
    });
    this.chaseNodes = [];
    this.startAmbient(nextAmbient);
  }

  play(name: SfxName): void {
    if (!this.context || !this.se || !this.settings.enabled) {
      return;
    }
    const now = this.context.currentTime;
    const specs = sfxSpecs[name];
    specs.forEach((spec, index) => {
      try {
        const osc = this.context!.createOscillator();
        const gain = this.context!.createGain();
        osc.type = spec.type;
        osc.frequency.setValueAtTime(spec.frequency, now + index * 0.035);
        if (spec.slide) {
          osc.frequency.exponentialRampToValueAtTime(Math.max(20, spec.frequency + spec.slide), now + spec.duration);
        }
        gain.gain.setValueAtTime(0.0001, now + index * 0.035);
        gain.gain.exponentialRampToValueAtTime(spec.gain, now + index * 0.035 + 0.012);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.035 + spec.duration);
        osc.connect(gain);
        gain.connect(this.se!);
        osc.start(now + index * 0.035);
        osc.stop(now + index * 0.035 + spec.duration + 0.03);
      } catch {
        // ignore individual voice failures
      }
    });
    if (name === 'noise' || name === 'approach') {
      this.playBurstNoise(name === 'approach' ? 0.18 : 0.1, name === 'approach' ? 0.45 : 0.22);
    }
  }

  private applySettings(): void {
    if (!this.master || !this.bgm || !this.se) {
      return;
    }
    const enabled = this.settings.enabled ? 1 : 0;
    this.master.gain.value = enabled;
    this.bgm.gain.value = this.settings.bgmVolume;
    this.se.gain.value = this.settings.seVolume;
  }

  private playNoiseBed(amount: number, destination: AudioNode, keepNodes: AudioNode[]): void {
    if (!this.context || amount <= 0) {
      return;
    }
    const bufferSize = Math.floor(this.context.sampleRate * 2);
    const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i += 1) {
      data[i] = (Math.random() * 2 - 1) * amount;
    }
    const source = this.context.createBufferSource();
    const gain = this.context.createGain();
    const filter = this.context.createBiquadFilter();
    source.buffer = buffer;
    source.loop = true;
    filter.type = 'lowpass';
    filter.frequency.value = 520;
    gain.gain.value = amount;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(destination);
    source.start();
    keepNodes.push(source, filter, gain);
  }

  private playBurstNoise(amount: number, duration: number): void {
    if (!this.context || !this.se) {
      return;
    }
    try {
      const bufferSize = Math.floor(this.context.sampleRate * duration);
      const buffer = this.context.createBuffer(1, bufferSize, this.context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i += 1) {
        data[i] = (Math.random() * 2 - 1) * amount;
      }
      const source = this.context.createBufferSource();
      const gain = this.context.createGain();
      gain.gain.value = amount;
      source.buffer = buffer;
      source.connect(gain);
      gain.connect(this.se);
      source.start();
    } catch {
      // iOS unlock failures can safely be ignored
    }
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export const audioManager = new AudioManager();
