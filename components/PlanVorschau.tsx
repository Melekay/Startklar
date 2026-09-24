"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import { findeBeispiel } from "@/content/beispiele";
import { findeMcp } from "@/content/mcps";
import type { Antworten } from "@/content/typen";
import { erstellePlan } from "@/lib/empfehlung";
import { reinerText } from "@/lib/text";
import { Icon } from "./Icon";

const EINSTIEG_ICON = { desktop: "laptop", terminal: "terminal", web: "globe" } as const;

type Baustein = { id: string; icon: string; titel: string; inhalt: React.ReactNode };

/** Zählt, was der Plan bisher enthält – für den Chip auf dem Handy. */
export function planZusammenfassung(antworten: Antworten): { beispiele: number; verbindungen: number } {
  const plan = erstellePlan(antworten);
  const hatZiel = (antworten.ziel?.length ?? 0) > 0 || !!antworten.bereich;
  return {
    beispiele: hatZiel ? plan.beispiele.length : 0,
    verbindungen: antworten.tools || antworten.ziel ? plan.mcps.jetzt.length : 0,
  };
}

/**
 * Signaturelement: Der Plan wächst sichtbar mit jeder Antwort.
 * Bausteine erscheinen erst, wenn die Antworten dafür vorliegen.
 */
export function PlanVorschau({ antworten, kompakt = false }: { antworten: Antworten; kompakt?: boolean }) {
  const plan = useMemo(() => erstellePlan(antworten), [antworten]);

  const bausteine: Baustein[] = [];
  if (antworten.abo || antworten.github === "unbekannt" || antworten.rechner) {
    const pflicht = plan.voraussetzungen.filter((v) => !v.optional);
    if (pflicht.length) {
      bausteine.push({
        id: "voraussetzungen",
        icon: "flag",
        titel: "Zuerst klären",
        inhalt: pflicht.map((v) => v.titel).join(" · "),
      });
    }
  }
  if (antworten.terminal || antworten.code || antworten.os) {
    bausteine.push({
      id: "einstieg",
      icon: EINSTIEG_ICON[plan.einstieg.weg],
      titel: "Dein Einstieg",
      inhalt: plan.einstieg.titel,
    });
  }
  if ((antworten.ziel?.length ?? 0) > 0 || antworten.bereich) {
    bausteine.push({
      id: "beispiele",
      icon: "sparkles",
      titel: `${plan.beispiele.length} Beispiele`,
      inhalt: (
        <ul className="space-y-1">
          {plan.beispiele.map((b) => (
            <li key={b.beispielId} className="truncate">
              {findeBeispiel(b.beispielId)?.titel}
            </li>
          ))}
        </ul>
      ),
    });
  }
  if (antworten.tools || antworten.ziel) {
    bausteine.push({
      id: "mcps",
      icon: "plug",
      titel: plan.mcps.jetzt.length ? `${plan.mcps.jetzt.length} Verbindungen` : "Verbindungen: später",
      inhalt: plan.mcps.jetzt.length
        ? plan.mcps.jetzt.map((m) => findeMcp(m.mcpId)?.name).join(", ")
        : "Erst die Grundlagen – das spart Kontext.",
    });
  }
  if (antworten.kontrolle || antworten.sensibel) {
    bausteine.push({ id: "modus", icon: "shield", titel: "Berechtigungsmodus", inhalt: plan.modus.label });
  }
  if (antworten.idee || (antworten.ziel?.length ?? 0) > 0) {
    bausteine.push({
      id: "prompt",
      icon: "message",
      titel: "Dein erster Prompt",
      inhalt: <span className="line-clamp-3 italic">„{reinerText(plan.ersterPrompt)}“</span>,
    });
  }

  return (
    <section aria-label="Vorschau deines Plans" className={kompakt ? "" : "rounded-karte border border-line bg-surface/80 p-6 shadow-lift backdrop-blur"}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-xl font-bold">
          {plan.anrede === "Hallo!" ? "Dein Plan" : `Plan für ${plan.anrede.replace("Hallo ", "").replace(/!$/, "")}`}
        </p>
        <span className="rounded-pille bg-gold-100 px-3 py-1 text-xs font-bold text-gold-800 dark:bg-gold-900/50 dark:text-gold-200">
          wächst mit
        </span>
      </div>
      <ol className="mt-5 space-y-3" aria-live="polite">
        <AnimatePresence initial={false}>
          {bausteine.map((b) => (
            <motion.li
              key={b.id}
              layout
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="flex gap-3 rounded-feld bg-surface-2 p-3"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-gold-400 text-on-accent">
                <Icon name={b.icon} size={18} />
              </span>
              <div className="min-w-0 text-sm">
                <p className="font-bold">{b.titel}</p>
                <div className="mt-0.5 text-muted">{b.inhalt}</div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ol>
      {bausteine.length === 0 && (
        <p className="mt-5 rounded-feld border border-dashed border-line p-4 text-sm text-muted">
          Hier entsteht dein Plan. Mit jeder Antwort kommt ein Baustein dazu.
        </p>
      )}
    </section>
  );
}
