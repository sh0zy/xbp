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
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-ink-50 text-ink-800 shadow-none md:shadow-[0_30px_80px_rgba(15,23,42,0.18)] dark:bg-ink-900 dark:text-ink-50 dark:md:shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
      <TopBar />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <BottomTabBar />
    </div>
  );
}
