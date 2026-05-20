import { useEffect, useMemo, useState } from "react";
import type { ActionStatus, CustomStatus, LaterItem, Screen, ThemeId } from "./types";
import { BottomNav } from "./components/BottomNav";
import { Tutorial } from "./components/Tutorial";
import { HomeScreen } from "./screens/HomeScreen";
import { InboxScreen } from "./screens/InboxScreen";
import { AddScreen } from "./screens/AddScreen";
import { ProcessScreen } from "./screens/ProcessScreen";
import { CalendarScreen } from "./screens/CalendarScreen";
import { getNotificationPermission, onNotificationTap, scheduleTodayNotifications } from "./utils/notifications";
import { SettingsScreen } from "./screens/SettingsScreen";
import { DetailScreen } from "./screens/DetailScreen";
import { loadState, saveState, uid } from "./utils/storage";
import { buildSampleData } from "./data/sampleData";

export default function App() {
  const [items, setItems] = useState<LaterItem[]>([]);
  const [customStatuses, setCustomStatuses] = useState<CustomStatus[]>([]);
  const [theme, setTheme] = useState<ThemeId>("midnight");
  const [tutorialSeen, setTutorialSeen] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [screen, setScreen] = useState<Screen>("home");
  const [editing, setEditing] = useState<LaterItem | null>(null);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [installEvent, setInstallEvent] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e);
    };
    const onInstalled = () => {
      setInstalled(true);
      setInstallEvent(null);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    if (
      window.matchMedia?.("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone
    ) {
      setInstalled(true);
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  async function triggerInstall() {
    if (!installEvent) {
      alert(
        "このブラウザでは自動インストールが使えません。\nブラウザメニューの「ホーム画面に追加」または「アプリをインストール」を使ってください。"
      );
      return;
    }
    installEvent.prompt();
    const res = await installEvent.userChoice;
    if (res?.outcome === "accepted") setInstallEvent(null);
  }

  useEffect(() => {
    const s = loadState();
    if (!s.initialized) {
      const sample = buildSampleData();
      setItems(sample);
      setTutorialSeen(false);
      saveState({
        items: sample,
        initialized: true,
        tutorialSeen: false,
        theme: "midnight",
        customStatuses: [],
      });
    } else {
      setItems(s.items);
      setCustomStatuses(s.customStatuses);
      setTheme(s.theme);
      setTutorialSeen(s.tutorialSeen);
    }
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    saveState({
      items,
      initialized: true,
      tutorialSeen,
      theme,
      customStatuses,
    });
  }, [items, tutorialSeen, theme, customStatuses, initialized]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!initialized) return;
    getNotificationPermission().then((perm) => {
      if (perm === "granted") scheduleTodayNotifications(items);
    });
  }, [initialized, items]);

  useEffect(() => {
    const unsub = onNotificationTap((itemId) => {
      setViewingId(itemId);
      setEditing(null);
      setScreen("detail");
    });
    return unsub;
  }, []);

  const navigate = (s: Screen) => {
    setEditing(null);
    setViewingId(null);
    setScreen(s);
  };

  function addItem(data: Omit<LaterItem, "id" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    const newItem: LaterItem = { ...data, id: uid(), createdAt: now, updatedAt: now };
    setItems((prev) => [newItem, ...prev]);
  }

  function updateItem(id: string, data: Omit<LaterItem, "id" | "createdAt" | "updatedAt">) {
    const now = new Date().toISOString();
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...data, updatedAt: now } : i))
    );
  }

  function deleteItem(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  function addCustomStatus(label: string) {
    setCustomStatuses((prev) => [...prev, { id: `custom_${uid()}`, label }]);
  }

  function removeCustomStatus(id: string) {
    setCustomStatuses((prev) => prev.filter((c) => c.id !== id));
    setItems((prev) =>
      prev.map((i) => (i.actionStatus === id ? { ...i, actionStatus: "unprocessed" } : i))
    );
  }

  function updateStatus(id: string, status: ActionStatus) {
    const now = new Date().toISOString();
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, actionStatus: status, processedAt: now, updatedAt: now }
          : i
      )
    );
  }

  const content = useMemo(() => {
    if (screen === "add") {
      const returnTo: Screen =
        viewingId && editing && editing.id === viewingId
          ? "detail"
          : editing
          ? "inbox"
          : "home";
      return (
        <AddScreen
          initial={editing ?? undefined}
          editing={!!editing}
          onCancel={() => {
            if (returnTo === "detail") {
              setEditing(null);
              setScreen("detail");
            } else {
              navigate(returnTo);
            }
          }}
          onSave={(data) => {
            if (editing) updateItem(editing.id, data);
            else addItem(data);
            if (returnTo === "detail") {
              setEditing(null);
              setScreen("detail");
            } else {
              navigate(returnTo);
            }
          }}
          onDelete={
            editing
              ? () => {
                  deleteItem(editing.id);
                  navigate(returnTo === "detail" ? "home" : "inbox");
                }
              : undefined
          }
        />
      );
    }
    if (screen === "process") {
      return (
        <ProcessScreen
          items={items}
          onUpdateStatus={updateStatus}
          onDelete={deleteItem}
          onDone={() => navigate("home")}
        />
      );
    }
    if (screen === "inbox") {
      return (
        <InboxScreen
          items={items}
          customStatuses={customStatuses}
          onAddStatus={addCustomStatus}
          onRemoveStatus={removeCustomStatus}
          onOpenItem={(i) => {
            setEditing(i);
            setScreen("add");
          }}
        />
      );
    }
    if (screen === "calendar")
      return (
        <CalendarScreen
          items={items}
          onOpenItem={(i) => {
            setViewingId(i.id);
            setScreen("detail");
          }}
        />
      );
    if (screen === "settings")
      return (
        <SettingsScreen
          theme={theme}
          onChangeTheme={setTheme}
          onResetData={() => setItems([])}
          onRestoreSample={() => setItems(buildSampleData())}
          onReplayTutorial={() => setTutorialSeen(false)}
          canInstall={!!installEvent}
          installed={installed}
          onInstall={triggerInstall}
          items={items}
        />
      );
    if (screen === "detail") {
      const viewed = items.find((i) => i.id === viewingId);
      if (!viewed) {
        return (
          <HomeScreen
            items={items}
            onAdd={() => {
              setEditing(null);
              setScreen("add");
            }}
            onStartProcess={() => setScreen("process")}
            onOpenItem={(i) => {
              setViewingId(i.id);
              setScreen("detail");
            }}
          />
        );
      }
      return (
        <DetailScreen
          item={viewed}
          onBack={() => navigate("home")}
          onEdit={() => {
            setEditing(viewed);
            setScreen("add");
          }}
          onUpdateStatus={updateStatus}
          onDelete={() => {
            deleteItem(viewed.id);
            navigate("home");
          }}
        />
      );
    }
    return (
      <HomeScreen
        items={items}
        onAdd={() => {
          setEditing(null);
          setScreen("add");
        }}
        onStartProcess={() => setScreen("process")}
        onOpenItem={(i) => {
          setViewingId(i.id);
          setScreen("detail");
        }}
      />
    );
  }, [screen, items, editing, customStatuses, theme, installEvent, installed, viewingId]);

  return (
    <div className="min-h-screen max-w-xl mx-auto relative">
      {content}
      <BottomNav current={screen} onChange={navigate} />
      {!tutorialSeen && <Tutorial onDone={() => setTutorialSeen(true)} />}
    </div>
  );
}
