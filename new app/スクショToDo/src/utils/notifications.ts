import type { LaterItem } from "../types";
import { isDoneStatus } from "../types";
import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

const CHANNEL_ID = "laterflow-today";

let channelEnsured = false;
async function ensureChannel() {
  if (channelEnsured || !Capacitor.isNativePlatform()) return;
  try {
    await LocalNotifications.createChannel({
      id: CHANNEL_ID,
      name: "今日の行動",
      description: "期限が今日のスクショについて通知します",
      importance: 4, // IMPORTANCE_HIGH: heads-up + sound
      visibility: 1,
      lights: true,
      lightColor: "#3D6BFF",
      vibration: true,
      sound: undefined,
    });
    channelEnsured = true;
  } catch (e) {
    console.warn("createChannel failed", e);
  }
}

const FIRED_KEY = "laterflow-notif-fired-v1";
const timers: number[] = [];

const isNative = Capacitor.isNativePlatform();

function loadFired(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(FIRED_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveFired(map: Record<string, string>) {
  localStorage.setItem(FIRED_KEY, JSON.stringify(map));
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function pruneFired(map: Record<string, string>): Record<string, string> {
  const today = todayKey();
  const next: Record<string, string> = {};
  for (const [k, v] of Object.entries(map)) if (v === today) next[k] = v;
  return next;
}

// Deterministic small integer id from item id (required by LocalNotifications)
function numericId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) | 0;
  }
  // Keep positive 31-bit int
  return Math.abs(h) % 2147483647;
}

export async function requestNotificationPermission(): Promise<"granted" | "denied" | "default"> {
  if (isNative) {
    try {
      const res = await LocalNotifications.requestPermissions();
      return res.display === "granted" ? "granted" : "denied";
    } catch {
      return "denied";
    }
  }
  if (!("Notification" in window)) return "denied";
  if (Notification.permission !== "default") return Notification.permission;
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

export async function getNotificationPermission(): Promise<"granted" | "denied" | "default"> {
  if (isNative) {
    try {
      const res = await LocalNotifications.checkPermissions();
      return res.display === "granted"
        ? "granted"
        : res.display === "denied"
        ? "denied"
        : "default";
    } catch {
      return "denied";
    }
  }
  if (!("Notification" in window)) return "denied";
  return Notification.permission;
}

async function showWebNotification(item: LaterItem) {
  if (!("Notification" in window) || Notification.permission !== "granted") return;
  const body = item.dueTime ? `${item.dueTime} — ${item.title}` : item.title;
  try {
    new Notification("今日の行動", { body, icon: "/icons/icon-192.png", tag: item.id });
  } catch {
    // noop
  }
}

export function clearScheduledWeb() {
  for (const t of timers) clearTimeout(t);
  timers.length = 0;
}

async function scheduleNative(items: LaterItem[]) {
  await ensureChannel();
  const today = todayKey();
  const fired = pruneFired(loadFired());
  saveFired(fired);

  const targets = items.filter(
    (i) => i.dueDate === today && !isDoneStatus(i.actionStatus)
  );

  // Cancel previously scheduled so edits/time changes apply
  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }
  } catch {
    // noop
  }

  const now = new Date();
  const toSchedule = [] as any[];

  for (const item of targets) {
    let when: Date;
    if (item.dueTime) {
      const [h, m] = item.dueTime.split(":").map((n) => parseInt(n, 10));
      when = new Date();
      when.setHours(h || 0, m || 0, 0, 0);
    } else {
      // No time: fire in ~5s after scheduling so it appears in tray
      when = new Date(now.getTime() + 5000);
    }

    if (when.getTime() < now.getTime() - 60 * 60 * 1000) continue; // >1h past
    if (fired[item.id] === today && when.getTime() <= now.getTime()) continue;

    const firstLine = item.dueTime ? `${item.dueTime}` : "今日の予定";
    toSchedule.push({
      id: numericId(item.id),
      title: `🕒 ${firstLine} — ${item.title}`,
      body: item.content || item.memo || "タップして内容を確認",
      largeBody: [item.title, item.content, item.memo, item.url]
        .filter(Boolean)
        .join("\n"),
      summaryText: "スクショToDo",
      channelId: CHANNEL_ID,
      smallIcon: "ic_stat_notify",
      iconColor: "#3D6BFF",
      schedule: {
        at: when.getTime() <= now.getTime() ? new Date(now.getTime() + 3000) : when,
        allowWhileIdle: true,
      },
      extra: { itemId: item.id },
    });

    // Mark as fired for today to prevent re-notifying on next open
    fired[item.id] = today;
  }

  if (toSchedule.length > 0) {
    try {
      await LocalNotifications.schedule({ notifications: toSchedule });
    } catch (e) {
      console.error("LocalNotifications.schedule failed", e);
    }
  }

  saveFired(fired);
}

function scheduleWeb(items: LaterItem[]) {
  clearScheduledWeb();
  if (!("Notification" in window) || Notification.permission !== "granted") return;

  const today = todayKey();
  const fired = pruneFired(loadFired());
  const targets = items.filter(
    (i) => i.dueDate === today && !isDoneStatus(i.actionStatus)
  );
  const now = Date.now();

  for (const item of targets) {
    if (fired[item.id] === today) continue;
    let when: number;
    if (item.dueTime) {
      const [h, m] = item.dueTime.split(":").map((n) => parseInt(n, 10));
      const d = new Date();
      d.setHours(h || 0, m || 0, 0, 0);
      when = d.getTime();
    } else {
      when = now;
    }
    const delay = when - now;
    if (delay < -60 * 60 * 1000) continue;

    const fire = () => {
      showWebNotification(item);
      const map = loadFired();
      map[item.id] = today;
      saveFired(map);
    };

    if (delay <= 0) fire();
    else if (delay <= 24 * 60 * 60 * 1000) {
      timers.push(window.setTimeout(fire, delay));
    }
  }
  saveFired(fired);
}

export async function scheduleTodayNotifications(items: LaterItem[]) {
  const perm = await getNotificationPermission();
  if (perm !== "granted") return;
  if (isNative) await scheduleNative(items);
  else scheduleWeb(items);
}

export function onNotificationTap(handler: (itemId: string) => void) {
  if (!isNative) return () => {};
  const sub = LocalNotifications.addListener(
    "localNotificationActionPerformed",
    (action) => {
      const itemId = (action.notification.extra as any)?.itemId;
      if (typeof itemId === "string") handler(itemId);
    }
  );
  return () => {
    sub.then((s) => s.remove()).catch(() => {});
  };
}

export async function sendTestNotification() {
  const perm = await getNotificationPermission();
  if (perm !== "granted") {
    const next = await requestNotificationPermission();
    if (next !== "granted") {
      alert(
        "通知が許可されていません。\nスマホの設定 → アプリ → スクショToDo → 通知 をオンにしてください。"
      );
      return;
    }
  }
  if (isNative) {
    try {
      await ensureChannel();
      await LocalNotifications.schedule({
        notifications: [
          {
            id: 999999,
            title: "🔔 通知テスト",
            body: "通知は有効です。今日の予定があると時刻にお知らせします。",
            summaryText: "スクショToDo",
            channelId: CHANNEL_ID,
            smallIcon: "ic_stat_notify",
            iconColor: "#3D6BFF",
            schedule: { at: new Date(Date.now() + 1500) },
          },
        ],
      });
    } catch (e) {
      console.error(e);
      alert("通知の送信に失敗しました");
    }
  } else {
    try {
      new Notification("通知テスト", {
        body: "通知は有効です。",
        icon: "/icons/icon-192.png",
      });
    } catch {
      alert("このブラウザでは通知を表示できません");
    }
  }
}
