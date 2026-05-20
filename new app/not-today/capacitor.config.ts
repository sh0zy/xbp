import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.nottoday.app',
  appName: 'Not Today',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
}

export default config
