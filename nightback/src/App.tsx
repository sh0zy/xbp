import { useEffect } from "react";
import AppRouter from "./app/router";

export default function App() {
  useEffect(() => {
    // Capacitor native glue - lazy-loaded so web build works without native.
    (async () => {
      try {
        const { StatusBar, Style } = await import("@capacitor/status-bar");
        const { SplashScreen } = await import("@capacitor/splash-screen");
        await StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
        await StatusBar.setBackgroundColor({ color: "#08090d" }).catch(() => {});
        await SplashScreen.hide().catch(() => {});
      } catch {
        /* web context */
      }
    })();
  }, []);

  return <AppRouter />;
}
