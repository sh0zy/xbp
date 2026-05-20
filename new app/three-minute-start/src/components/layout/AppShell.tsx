import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { TopBar } from "./TopBar";
import { BottomTabBar } from "./BottomTabBar";
import { useAppStore } from "../../store/useAppStore";

function applyTheme(mode: "light" | "dark" | "system") {
  const root = document.documentElement;
  const prefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;
  const dark = mode === "dark" || (mode === "system" && prefersDark);
  root.classList.toggle("dark", dark);
}

export function AppShell() {
  const themeMode = useAppStore((s) => s.settings.themeMode);
  const hydrated = useAppStore((s) => s.hydrated);
  const hydrate = useAppStore((s) => s.hydrate);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrated, hydrate]);

  useEffect(() => {
    applyTheme(themeMode);
    if (themeMode !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => applyTheme("system");
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, [themeMode]);

  return (
    <div className="flex min-h-screen flex-col bg-ink-50 text-ink-800 dark:bg-ink-900 dark:text-ink-50">
      <TopBar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}
