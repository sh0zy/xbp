import { Capacitor } from "@capacitor/core";
import { SpeechRecognition as NativeSpeechRecognition } from "@capacitor-community/speech-recognition";

export type SpeechStatus = "idle" | "listening" | "recognized" | "error" | "unsupported";
export type SpeechErrorCode =
  | "unsupported"
  | "insecure"
  | "language-not-supported"
  | "not-allowed"
  | "no-speech"
  | "audio-capture"
  | "network"
  | "aborted"
  | "unknown";

type SpeechAvailability = "available" | "downloadable" | "downloading" | "unavailable";
type SpeechRecognitionConstructor = {
  new (): SpeechRecognitionLike;
  available?: (options: { langs: string[]; processLocally?: boolean }) => Promise<SpeechAvailability>;
  install?: (options: { langs: string[] }) => Promise<boolean>;
};

export interface SpeechSession {
  abort: () => void;
  stop: () => void;
}

interface SpeechRecognitionResultLike {
  readonly isFinal: boolean;
  readonly [index: number]: {
    transcript: string;
  };
}

interface SpeechRecognitionEventLike extends Event {
  readonly resultIndex: number;
  readonly results: {
    readonly length: number;
    readonly [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionLike extends EventTarget {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives: number;
  processLocally?: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onnomatch: (() => void) | null;
  onspeechend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionErrorEventLike extends Event {
  error?: SpeechErrorCode | string;
}

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const isLocalhost = () => {
  if (typeof window === "undefined") {
    return false;
  }
  return ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
};

const isNativeSpeechPlatform = () => typeof window !== "undefined" && Capacitor.isNativePlatform();

export const getSpeechSupport = (): { supported: boolean; reason?: SpeechErrorCode; message?: string } => {
  if (typeof window === "undefined") {
    return { supported: false, reason: "unsupported", message: "Speech input is not available during server rendering." };
  }
  if (isNativeSpeechPlatform()) {
    return { supported: true };
  }
  if (!window.isSecureContext && !isLocalhost()) {
    return {
      supported: false,
      reason: "insecure",
      message: "Voice input needs HTTPS or localhost. Open this app on localhost, HTTPS, Chrome, or the installed PWA.",
    };
  }
  if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
    return {
      supported: false,
      reason: "unsupported",
      message: "This browser does not support Web Speech recognition. Chrome or Edge is recommended.",
    };
  }
  return { supported: true };
};

export const isSpeechSupported = () => getSpeechSupport().supported;

export const speechErrorMessage = (code: SpeechErrorCode | string = "unknown") => {
  if (code === "not-allowed") {
    return "マイクの許可がブロックされています。ブラウザや端末の設定でマイクを許可してから、もう一度試してください。";
  }
  if (code === "no-speech") {
    return "うまく聞き取れませんでした。マイクに少し近づいて、もう一度話してみよう。";
  }
  if (code === "audio-capture") {
    return "マイクが見つかりませんでした。端末のマイク設定を確認してください。";
  }
  if (code === "language-not-supported") {
    return "このブラウザでは英語の端末内音声認識を準備できませんでした。Chrome/Edgeを更新するか、Androidアプリ版で試してください。";
  }
  if (code === "network") {
    return "ブラウザの音声認識サービスに接続できません。対応ブラウザでは端末内音声認識を試します。だめな場合はChrome/Edgeの更新、またはAndroidアプリ版で試してください。";
  }
  if (code === "insecure") {
    return "音声入力にはHTTPSまたはlocalhostが必要です。Webプレビューはlocalhostで開いてください。";
  }
  if (code === "unsupported") {
    return "このブラウザでは音声入力を使えません。Chrome/Edgeで開くか、テキスト入力で進めてください。";
  }
  return "うまく聞き取れませんでした。もう一度話してみよう。";
};

const nativeErrorToCode = (error: unknown): SpeechErrorCode => {
  const message = error instanceof Error ? error.message : String(error ?? "");
  const normalized = message.toLowerCase();
  if (normalized.includes("permission")) {
    return "not-allowed";
  }
  if (normalized.includes("language") || normalized.includes("not supported")) {
    return "language-not-supported";
  }
  if (normalized.includes("network") || normalized.includes("server")) {
    return "network";
  }
  if (normalized.includes("no match") || normalized.includes("no speech") || normalized.includes("speech timeout")) {
    return "no-speech";
  }
  if (normalized.includes("audio recording") || normalized.includes("microphone")) {
    return "audio-capture";
  }
  if (normalized.includes("not available") || normalized.includes("unavailable")) {
    return "unsupported";
  }
  return "unknown";
};

const getRecognitionConstructor = () =>
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : undefined;

const prepareLocalSpeechRecognition = async (Recognition: SpeechRecognitionConstructor): Promise<boolean> => {
  if (!Recognition.available || !Recognition.install) {
    return false;
  }

  try {
    const availability = await Recognition.available({ langs: ["en-US"], processLocally: true });
    if (availability === "available") {
      return true;
    }
    if (availability === "downloadable" || availability === "downloading") {
      return await Recognition.install({ langs: ["en-US"] });
    }
  } catch {
    return false;
  }

  return false;
};

const startNativeSpeechRecognition = ({
  onStart,
  onResult,
  onEnd,
  onError,
}: {
  onStart: () => void;
  onResult: (text: string) => void;
  onEnd: () => void;
  onError: (code: SpeechErrorCode | string) => void;
}): SpeechSession => {
  let active = true;
  let ended = false;

  const endOnce = () => {
    if (!ended) {
      ended = true;
      onEnd();
    }
  };

  void (async () => {
    try {
      const availability = await NativeSpeechRecognition.available();
      if (!availability.available) {
        onError("unsupported");
        return;
      }

      const currentPermission = await NativeSpeechRecognition.checkPermissions();
      const permission =
        currentPermission.speechRecognition === "granted"
          ? currentPermission
          : await NativeSpeechRecognition.requestPermissions();

      if (permission.speechRecognition !== "granted") {
        onError("not-allowed");
        return;
      }

      if (!active) {
        return;
      }

      onStart();
      const result = await NativeSpeechRecognition.start({
        language: "en-US",
        maxResults: 3,
        partialResults: false,
        popup: false,
        prompt: "Speak your English answer",
      });

      if (!active) {
        return;
      }

      const text = result.matches?.find((match) => match.trim().length > 0)?.trim() ?? "";
      if (text) {
        onResult(text);
      } else {
        onError("no-speech");
      }
    } catch (error) {
      if (active) {
        onError(nativeErrorToCode(error));
      }
    } finally {
      if (active) {
        endOnce();
      }
    }
  })();

  return {
    abort: () => {
      active = false;
      void NativeSpeechRecognition.stop().catch(() => undefined);
    },
    stop: () => {
      void NativeSpeechRecognition.stop().finally(endOnce);
    },
  };
};

export const startSpeechRecognition = ({
  onStart,
  onResult,
  onEnd,
  onError,
}: {
  onStart: () => void;
  onResult: (text: string) => void;
  onEnd: () => void;
  onError: (code: SpeechErrorCode | string) => void;
}): SpeechSession | undefined => {
  if (isNativeSpeechPlatform()) {
    return startNativeSpeechRecognition({ onStart, onResult, onEnd, onError });
  }

  const support = getSpeechSupport();
  if (!support.supported) {
    onError(support.reason ?? "unsupported");
    return undefined;
  }

  const Recognition = getRecognitionConstructor();
  if (!Recognition) {
    onError("unsupported");
    return undefined;
  }

  let active = true;
  let recognition: SpeechRecognitionLike | undefined;
  let ended = false;
  let started = false;
  let gotResult = false;
  let gotError = false;

  const endOnce = () => {
    if (!ended) {
      ended = true;
      onEnd();
    }
  };

  const startRecognition = async (forceLocal: boolean) => {
    recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 3;
    if (forceLocal) {
      recognition.processLocally = true;
    }
    recognition.onstart = () => {
      started = true;
      onStart();
    };
    recognition.onend = () => {
      if (!gotResult && !gotError && started) {
        onError("no-speech");
      }
      endOnce();
    };
    recognition.onerror = (event) => {
      gotError = true;
      const code = event.error ?? "unknown";
      onError(code);
      endOnce();
    };
    recognition.onnomatch = () => {
      gotError = true;
      onError("no-speech");
      endOnce();
    };
    recognition.onspeechend = () => recognition?.stop();
    recognition.onresult = (event) => {
      let transcript = "";
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript;
      }
      const text = transcript.trim();
      if (text) {
        gotResult = true;
        onResult(text);
      }
    };

    recognition.start();
  };

  void (async () => {
    try {
      const localReady = await prepareLocalSpeechRecognition(Recognition);
      if (!active) {
        return;
      }
      await startRecognition(localReady);
    } catch {
      if (active) {
        onError("unknown");
        endOnce();
      }
    }
  })();

  return {
    abort: () => {
      active = false;
      recognition?.abort();
    },
    stop: () => {
      recognition?.stop();
      endOnce();
    },
  };
};
