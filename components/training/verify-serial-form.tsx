"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { AlertCircle, Loader2, ScanLine, ShieldCheck } from "lucide-react";

function toLatin(value: string) {
  return value.replace(/[۰-۹٠-٩]/g, (d) => {
    const code = d.charCodeAt(0);
    return String(code - (code >= 0x06f0 ? 0x06f0 : 0x0660));
  });
}

const SERIAL_PATTERN = /^JJ-CERT-\d{4}-\d{4,6}$/;

type State = "idle" | "invalid" | "checking";

export function VerifySerialForm() {
  const router = useRouter();
  const [serial, setSerial] = useState("");
  const [state, setState] = useState<State>("idle");

  const trimmed = serial.trim();
  const looksValid = SERIAL_PATTERN.test(toLatin(trimmed).toUpperCase());
  const isError = state === "invalid" || (trimmed.length > 0 && !looksValid && state !== "checking");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const cleaned = toLatin(trimmed).toUpperCase();
    if (!SERIAL_PATTERN.test(cleaned)) {
      setState("invalid");
      return;
    }
    setState("checking");
    // Brief pause gives the user visible "checking" feedback before navigation.
    setTimeout(() => router.push(`/training/verify/${encodeURIComponent(cleaned)}`), 350);
  }

  const borderTone = isError
    ? "border-red-500/60 focus-within:border-red-500"
    : looksValid
      ? "border-emerald-500/60 focus-within:border-emerald-400"
      : "border-white/15 focus-within:border-emerald-400/70";

  return (
    <form onSubmit={submit} noValidate>
      <div
        className={`flex flex-col gap-3 rounded-2xl border bg-white/[0.03] p-3 transition-colors sm:flex-row sm:items-center ${borderTone}`}
      >
        <div className="relative flex-1">
          <ScanLine
            size={18}
            className={`pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 ${isError ? "text-red-400" : looksValid ? "text-emerald-400" : "text-neutral-500"
              }`}
          />
          <input
            type="text"
            value={serial}
            onChange={(event) => {
              setSerial(event.target.value);
              if (state !== "idle") setState("idle");
            }}
            placeholder="JJ-CERT-1404-000101"
            aria-label="شماره سریال گواهینامه"
            aria-invalid={isError}
            dir="ltr"
            className="w-full rounded-xl bg-transparent px-11 py-3 font-mono text-sm tracking-wider text-white outline-none placeholder:text-neutral-600"
          />
        </div>
        <button
          type="submit"
          disabled={state === "checking"}
          className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-black transition ${isError
            ? "bg-red-500 text-white hover:bg-red-400"
            : "bg-emerald-500 text-neutral-950 hover:bg-emerald-400 disabled:opacity-60"
            }`}
        >
          {state === "checking" ? (
            <>
              <Loader2 size={16} className="animate-spin" /> در حال بررسی…
            </>
          ) : isError ? (
            <>
              <AlertCircle size={16} /> بررسی مجدد
            </>
          ) : (
            "استعلام فوری"
          )}
        </button>
      </div>

      {/* Live feedback */}
      <div aria-live="polite" className="mt-3 min-h-5 text-xs font-bold">
        {isError && (
          <p className="flex items-center gap-1.5 text-red-400">
            <AlertCircle size={14} />
            قالب سریال معتبر نیست؛ نمونه صحیح:{" "}
            <span dir="ltr" className="font-mono">JJ-CERT-1404-000101</span>
          </p>
        )}
        {looksValid && !isError && (
          <p className="flex items-center gap-1.5 text-emerald-400">
            <ShieldCheck size={14} />
            قالب سریال معتبر است — برای مشاهده نتیجه، استعلام را بزنید.
          </p>
        )}
      </div>
    </form>
  );
}
