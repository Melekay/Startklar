"use client";

import { motion } from "framer-motion";

type Props = { aktuell: number; gesamt: number; beantwortet: number; label?: string };

/** Fortschrittsbalken mit Ansage für Screenreader. */
export function Fortschritt({ aktuell, gesamt, beantwortet, label }: Props) {
  const prozent = Math.round((aktuell / gesamt) * 100);
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <p aria-live="polite" className="font-semibold">
          Frage {aktuell} von {gesamt}
          {label && <span className="font-normal text-muted"> · {label}</span>}
        </p>
        <p className="text-muted">{beantwortet} beantwortet</p>
      </div>
      <div
        role="progressbar"
        aria-label="Fortschritt im Interview"
        aria-valuemin={0}
        aria-valuemax={gesamt}
        aria-valuenow={aktuell}
        aria-valuetext={`Frage ${aktuell} von ${gesamt}`}
        className="mt-3 h-2 overflow-hidden rounded-pille bg-surface-2"
      >
        <motion.div
          className="h-full rounded-pille bg-gradient-to-r from-gold-500 to-gold-300"
          initial={false}
          animate={{ width: `${prozent}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
