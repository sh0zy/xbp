import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";
import type { NotificationSchedule } from "../types/app";

const TITLE = "3分だけ始めませんか？";
const BODY = "やる気じゃなく、最初の1歩だけ。タップして開いてみよう。";

export type NotificationCapability =
  | "native"
  | "web"
  | "unsupported";

export function getNotificationCapability(): NotificationCapability {
  if (typeof window === "undefined") return "unsupported";
  if (Capacitor.isNativePlatform()) return "native";
  if ("Notification" in window) return "web";
  return "unsupported";
}

function scheduleIdToNumber(id: string, index: number): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  // keep in safe range, ensure unique-ish per index
  return Math.abs(hash % 1_000_000) * 10 + (index % 10) + 1;
}

export async function requestNotificationPermission(): Promise<boolean> {
  const cap = getNotificationCapability();
  if (cap === "native") {
    try {
      const result = await LocalNotifications.requestPermissions();
      return result.display === "granted";
    } catch {
      return false;
    }
  }
  if (cap === "web") {
    try {
      const perm = await Notification.requestPermission();
      return perm === "granted";
    } catch {
      return false;
    }
  }
  return false;
}

export async function cancelAllScheduled(): Promise<void> {
  const cap = getNotificationCapability();
  if (cap !== "native") return;
  try {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      await LocalNotifications.cancel({ notifications: pending.notifications });
    }
  } catch {
    // ignore
  }
}

export async function syncSchedules(
  schedules: NotificationSchedule[],
  masterEnabled: boolean,
): Promise<void> {
  const cap = getNotificationCapability();
  if (cap === "unsupported") return;

  if (cap === "native") {
    await cancelAllScheduled();
    if (!masterEnabled) return;
    const enabled = schedules.filter((s) => s.enabled);
    if (enabled.length === 0) return;
    try {
      await LocalNotifications.schedule({
        notifications: enabled.map((s, i) => ({
          id: scheduleIdToNumber(s.id, i),
          title: TITLE,
          body: BODY,
          schedule: {
            on: { hour: s.hour, minute: s.minute },
            allowWhileIdle: true,
          },
          smallIcon: "ic_stat_notify_3",
          iconColor: "#2b6df6",
          autoCancel: true,
        })),
      });
    } catch {
      // ignore scheduling errors
    }
    return;
  }

  // web fallback: schedule a single in-tab Notification for the next occurrence.
  if (cap === "web" && masterEnabled) {
    if (Notification.permission !== "granted") return;
    const now = Date.now();
    const enabled = schedules.filter((s) => s.enabled);
    if (enabled.length === 0) return;
    const next = enabled
      .map((s) => {
        const t = new Date();
        t.setHours(s.hour, s.minute, 0, 0);
        if (t.getTime() <= now) t.setDate(t.getDate() + 1);
        return t.getTime();
      })
      .sort((a, b) => a - b)[0];
    const delay = next - now;
    // Cap delay to 24h for tab-life robustness; the real OS-level scheduling is via native.
    const safeDelay = Math.min(delay, 24 * 60 * 60 * 1000);
    if (typeof window !== "undefined" && window.setTimeout) {
      window.setTimeout(() => {
        try {
          new Notification(TITLE, { body: BODY });
        } catch {
          // ignore
        }
      }, safeDelay);
    }
  }
}
