"use client";

import Link from "next/link";
import { fragen } from "@/content/fragen";
import { anzahlBeantwortet, offenePflichtfragen } from "@/lib/antworten";
import { useZustand } from "@/lib/store";
import { Icon } from "./Icon";

/** Startknopf, der erkennt, ob schon Antworten gespeichert sind. */
export function StartCta() {
  const { geladen, antworten, fortschritt } = useZustand();
  const beantwortet = geladen ? anzahlBeantwortet(antworten) : 0;
  const fertig = beantwortet > 0 && offenePflichtfragen(antworten).length === 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {fertig ? (
        <Link href="/plan" className="inline-flex min-h-14 items-center gap-2 rounded-pille bg-accent-fill px-8 text-lg font-bold text-on-accent shadow-gold transition hover:-translate-y-0.5">
          Zu deinem Plan <Icon name="arrow" size={20} />
        </Link>
      ) : (
        <Link href="/interview" className="inline-flex min-h-14 items-center gap-2 rounded-pille bg-accent-fill px-8 text-lg font-bold text-on-accent shadow-gold transition hover:-translate-y-0.5">
          {beantwortet > 0 ? `Weiter mit Frage ${Math.min(fortschritt.frage + 1, fragen.length)}` : "Interview starten"} <Icon name="arrow" size={20} />
        </Link>
      )}
      <Link href="/beispiele" className="inline-flex min-h-14 items-center gap-2 rounded-pille border border-line bg-surface px-7 text-lg font-semibold transition hover:border-accent">
        Erst mal umsehen
      </Link>
    </div>
  );
}
