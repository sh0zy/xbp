import { Mic, MicOff } from "lucide-react";
import clsx from "clsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { getSpeechSupport, speechErrorMessage, startSpeechRecognition, type SpeechErrorCode, type SpeechStatus } from "../utils/speech";

export default function VoiceInputButton({
  enemyQuestion,
  hint,
  disabled,
  onRecognized,
}: {
  enemyQuestion: string;
  hint: string;
  disabled?: boolean;
  onRecognized: (text: string) => void;
}) {
  const support = useMemo(() => getSpeechSupport(), []);
  const sessionRef = useRef<ReturnType<typeof startSpeechRecognition>>();
  const [status, setStatus] = useState<SpeechStatus>(support.supported ? "idle" : "unsupported");
  const [message, setMessage] = useState("");
  const [lastError, setLastError] = useState<SpeechErrorCode | string | undefined>(support.reason);

  useEffect(() => {
    return () => {
      sessionRef.current?.abort();
      sessionRef.current = undefined;
    };
  }, []);

  const start = () => {
    if (!support.supported) {
      setStatus("unsupported");
      setLastError(support.reason ?? "unsupported");
      setMessage(support.message ?? speechErrorMessage("unsupported"));
      return;
    }
    if (disabled || status === "listening") {
      return;
    }
    setMessage("");
    setLastError(undefined);
    sessionRef.current?.abort();
    sessionRef.current = startSpeechRecognition({
      onStart: () => setStatus("listening"),
      onResult: (text) => {
        if (text) {
          setStatus("recognized");
          setLastError(undefined);
          setMessage(`Recognized: ${text}`);
          onRecognized(text);
        } else {
          setStatus("error");
          setLastError("no-speech");
          setMessage("I could not hear it clearly. Try speaking once more.");
        }
      },
      onEnd: () => {
        setStatus((current) => (current === "listening" ? "idle" : current));
        sessionRef.current = undefined;
      },
      onError: (code) => {
        setStatus(code === "network" || code === "unsupported" ? "unsupported" : "error");
        setLastError(code);
        setMessage(speechErrorMessage(code));
        sessionRef.current = undefined;
      },
    });
  };

  const buttonLabel =
    status === "listening"
      ? "Listening..."
      : status === "recognized"
        ? "Recognized!"
        : lastError === "network" || status === "unsupported"
          ? "Text OK"
          : "Speak";

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        disabled={disabled}
        onClick={start}
        className={clsx("mic-button", status === "listening" && "listening", disabled && "opacity-60")}
        aria-label="Speak"
      >
        {status === "listening" ? <span className="mic-pulse" /> : null}
        {support.supported ? <Mic size={34} strokeWidth={2.5} /> : <MicOff size={34} strokeWidth={2.5} />}
      </button>
      <p className="text-sm font-black text-white">{buttonLabel}</p>
      {message ? <div className="speech-result-card rounded px-3 py-2 text-center text-xs text-amber">{message}</div> : null}

      {status === "listening" ? (
        <div className="listening-overlay">
          <div className="rpg-window w-full max-w-[360px] p-5 text-center">
            <div className="mx-auto mb-5 grid h-24 w-24 place-items-center rounded border-2 border-[#fff6d0] bg-black/35">
              <div className="mic-button listening scale-90">
                <span className="mic-pulse" />
                <Mic size={32} />
              </div>
            </div>
            <p className="rpg-small-label text-xs">Listening...</p>
            <p className="rpg-log-line mt-3 text-lg font-black leading-7 text-white">{enemyQuestion}</p>
            <p className="mt-2 rounded border border-white/20 bg-black/25 p-3 text-sm leading-6 text-skyglass/90">{hint}</p>
            <div className="mt-5 flex justify-center">
              <div className="voice-wave" aria-hidden>
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
