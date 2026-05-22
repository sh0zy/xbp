export type AmbientName = 'title' | 'campus' | 'library' | 'office' | 'basement' | 'final' | 'chase' | 'ending';

export interface AmbientSpec {
  base: number;
  second: number;
  noise: number;
  pulse: number;
}

export const ambientSpecs: Record<AmbientName, AmbientSpec> = {
  title: { base: 42, second: 58, noise: 0.04, pulse: 0.08 },
  campus: { base: 62, second: 95, noise: 0.035, pulse: 0.04 },
  library: { base: 48, second: 72, noise: 0.05, pulse: 0.03 },
  office: { base: 55, second: 110, noise: 0.045, pulse: 0.05 },
  basement: { base: 39, second: 66, noise: 0.07, pulse: 0.06 },
  final: { base: 46, second: 92, noise: 0.06, pulse: 0.09 },
  chase: { base: 74, second: 148, noise: 0.09, pulse: 0.18 },
  ending: { base: 96, second: 144, noise: 0.025, pulse: 0.05 },
};
