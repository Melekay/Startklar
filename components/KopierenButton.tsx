"use client";

import { useState } from "react";
import { Icon } from "./Icon";

/** Kopiert Text in die Zwischenablage. Funktioniert auch ohne Clipboard-API (Fallback). */
export function KopierenButton({ text, label = "Kopieren", className = "" }: { text: string; label?: string; className?: string }) {
  const [status, setStatus] = useState<"bereit" | "kopiert" | "fehler">("bereit");

  async function kopieren() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const feld = document.createElement("textarea");
        feld.value = text;
        feld.setAttribute("readonly", "");
        feld.style.position = "fixed";
        feld.style.opacity = "0";
        document.body.appendChild(feld);
        feld.select();
        const ok = document.execCommand("copy");
        feld.remove();
        if (!ok) throw new Error("copy");
      }
      setStatus("kopiert");
    } catch {
      setStatus("fehler");
    }
    window.setTimeout(() => setStatus("bereit"), 2200);
  }

  return (
    <button
      type="button"
      onClick={kopieren}
      className={`no-print inline-flex min-h-11 items-center gap-2 rounded-pille bg-ink px-4 py-2 text-sm font-semibold text-bg transition hover:-translate-y-0.5 hover:shadow-lift active:translate-y-0 ${className}`}
    >
      <Icon name={status === "kopiert" ? "check" : "copy"} size={16} />
      <span aria-live="polite">
        {status === "kopiert" ? "Kopiert!" : status === "fehler" ? "Bitte manuell markieren" : label}
      </span>
    </button>
  );
}
