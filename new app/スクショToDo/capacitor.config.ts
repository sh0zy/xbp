import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.kouta.laterflow",
  appName: "スクショToDo",
  webDir: "dist",
  android: {
    allowMixedContent: false,
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_notify",
      iconColor: "#3D6BFF",
      sound: "default",
    },
  },
};

export default config;
