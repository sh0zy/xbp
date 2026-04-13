import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.kiwadori.app',
  appName: 'キワドリ',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
}

export default config
