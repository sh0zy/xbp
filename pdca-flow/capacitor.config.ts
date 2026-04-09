import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kouta.pdcaflow',
  appName: 'PDCA Flow',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
  },
};

export default config;
