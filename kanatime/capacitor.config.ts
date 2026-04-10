import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.kanatime.mobile',
  appName: 'KanaTime',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
};

export default config;
