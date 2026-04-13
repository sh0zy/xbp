import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.flownest.routine',
  appName: 'FlowNest',
  webDir: 'dist',
  backgroundColor: '#0B1020',
  android: {
    allowMixedContent: false,
  },
};

export default config;
