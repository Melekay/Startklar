"use client";

import { useState } from "react";
import { beispiele } from "@/content/beispiele";
import type { Schwierigkeit } from "@/content/typen";
import { BeispielKarte } from "@/components/BeispielKarte";
import { Container } from "@/components/Container";

const FILTER: { wert: Schwierigkeit | "alle"; label: string }[] = [
  { wert: "alle", label: "Alle" },
  { wert: "leicht", label: "Leicht" },
  { wert: "mittel", label: "Mittel" },
  { wert: "fortgeschritten", label: "Fortgeschritten" },
];

export function BeispielListe() {
  const [filter, setFilter] = useState<Schwierigkeit | "alle">("alle");
  const liste = filter === "alle" ? beispiele : beispiele.filter((b) => b.schwierigkeit === filter);
  return (
    <Container>
      <div role="group" aria-label="Nach Schwierigkeit filtern" className="no-print flex flex-wrap gap-2">
        {FILTER.map((f) => (
          <button
            key={f.wert}
            type="button"
            aria-pressed={filter === f.wert}
            onClick={() => setFilter(f.wert)}
            className={`min-h-11 rounded-pille border px-5 text-sm font-semibold transition ${
              filter === f.wert ? "border-ink bg-ink text-bg" : "border-line bg-surface hover:border-accent"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {liste.length} Beispiele angezeigt
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {liste.map((b) => (
          <BeispielKarte key={b.id} beispiel={b} />
        ))}
      </div>
    </Container>
  );
}
