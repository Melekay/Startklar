"use client";

import { useRouter } from "next/navigation";
import { zuruecksetzen } from "@/lib/store";
import { Icon } from "./Icon";

/** „Alles zurücksetzen“: löscht Antworten und Fortschritt aus diesem Browser. */
export function ZuruecksetzenButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        if (window.confirm("Alle Antworten und deinen Fortschritt in diesem Browser löschen?")) {
          zuruecksetzen();
          router.push("/");
        }
      }}
      className={`inline-flex min-h-11 items-center gap-2 rounded-pille border border-line px-4 text-sm font-semibold text-ink transition hover:border-accent ${className}`}
    >
      <Icon name="reset" size={16} />
      Alles zurücksetzen
    </button>
  );
}
