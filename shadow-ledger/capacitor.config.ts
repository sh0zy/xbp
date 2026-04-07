import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.kouta.shadowledger",
  appName: "Shadow Ledger",
  webDir: "dist",
  server: {
    androidScheme: "https"
  }
};

export default config;
