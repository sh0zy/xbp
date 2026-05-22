export type SfxName =
  | 'footstep'
  | 'inspect'
  | 'log'
  | 'door'
  | 'pc'
  | 'noise'
  | 'approach'
  | 'save'
  | 'error'
  | 'success'
  | 'breath';

export interface ToneSpec {
  type: OscillatorType;
  frequency: number;
  duration: number;
  gain: number;
  slide?: number;
}

export const sfxSpecs: Record<SfxName, ToneSpec[]> = {
  footstep: [
    { type: 'sine', frequency: 95, duration: 0.055, gain: 0.18, slide: -20 },
    { type: 'triangle', frequency: 44, duration: 0.08, gain: 0.08 },
  ],
  inspect: [{ type: 'triangle', frequency: 520, duration: 0.08, gain: 0.1, slide: 90 }],
  log: [
    { type: 'sine', frequency: 780, duration: 0.12, gain: 0.11 },
    { type: 'sine', frequency: 1170, duration: 0.18, gain: 0.06 },
  ],
  door: [
    { type: 'sawtooth', frequency: 70, duration: 0.22, gain: 0.16, slide: -35 },
    { type: 'triangle', frequency: 140, duration: 0.08, gain: 0.06 },
  ],
  pc: [
    { type: 'square', frequency: 340, duration: 0.08, gain: 0.07 },
    { type: 'sine', frequency: 680, duration: 0.18, gain: 0.08, slide: 90 },
  ],
  noise: [{ type: 'sawtooth', frequency: 42, duration: 0.28, gain: 0.12, slide: 25 }],
  approach: [
    { type: 'sine', frequency: 58, duration: 0.5, gain: 0.18 },
    { type: 'sawtooth', frequency: 116, duration: 0.5, gain: 0.05, slide: -30 },
  ],
  save: [
    { type: 'sine', frequency: 420, duration: 0.08, gain: 0.08 },
    { type: 'sine', frequency: 620, duration: 0.12, gain: 0.07 },
  ],
  error: [{ type: 'sawtooth', frequency: 110, duration: 0.18, gain: 0.13, slide: -40 }],
  success: [
    { type: 'sine', frequency: 440, duration: 0.08, gain: 0.08 },
    { type: 'sine', frequency: 660, duration: 0.1, gain: 0.08 },
    { type: 'sine', frequency: 880, duration: 0.14, gain: 0.06 },
  ],
  breath: [{ type: 'sine', frequency: 90, duration: 0.5, gain: 0.09, slide: -15 }],
};
