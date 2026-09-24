"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { EinstiegsWeg } from "@/content/typen";
import { Container } from "@/components/Container";
import { HinweisBox } from "@/components/HinweisBox";
import { Icon } from "@/components/Icon";
import { KopierenButton } from "@/components/KopierenButton";
import { SchrittAnsicht } from "@/components/SchrittAnsicht";
import { anzahlBeantwortet } from "@/lib/antworten";
import { erstellePlan } from "@/lib/empfehlung";
import { schritteAusPlan } from "@/lib/schritte";
import { setzeFortschritt, useZustand } from "@/lib/store";

const WEGE: { weg: EinstiegsWeg; label: string }[] = [
  { weg: "desktop", label: "Desktop-App" },
  { weg: "terminal", label: "Terminal" },
  { weg: "web", label: "Web" },
];

export function SchrittFolge() {
  const { geladen, antworten, fortschritt } = useZustand();
  const reduziert = useReducedMotion();
  const titelRef = useRef<HTMLHeadingElement>(null);
  const [wegWahl, setWegWahl] = useState<EinstiegsWeg | null>(null);
  const [uebersichtOffen, setUebersichtOffen] = useState<boolean | null>(null);
  const letzterIndex = useRef<number | null>(null);

  const plan = useMemo(() => erstellePlan(antworten), [antworten]);
  const liste = useMemo(() => schritteAusPlan(plan), [plan]);

  const index = Math.min(Math.max(fortschritt.schritt, 0), liste.length - 1);
  const aktuell = liste[index];
  const weg = wegWahl ?? plan.einstieg.weg;
  const erledigt = new Set(fortschritt.erledigt);

  useEffect(() => {
    if (!geladen) return;
    if (letzterIndex.current !== null && letzterIndex.current !== index) titelRef.current?.focus();
    letzterIndex.current = index;
  }, [index, geladen]);

  function gehe(ziel: number) {
    const neu = Math.max(0, Math.min(ziel, liste.length - 1));
    setzeFortschritt((f) => ({ ...f, schritt: neu }));
    window.scrollTo({ top: 0 });
  }

  function erledigtUmschalten(id: string) {
    setzeFortschritt((f) => ({
      ...f,
      erledigt: f.erledigt.includes(id) ? f.erledigt.filter((x) => x !== id) : [...f.erledigt, id],
    }));
  }

  const anzahlErledigt = liste.filter((s) => erledigt.has(s.schritt.id)).length;
  const zeigeUebersicht = uebersichtOffen ?? plan.lernstil === "ueberblick";
  const ohneInterview = anzahlBeantwortet(antworten) === 0;

  return (
    <div className="gold-glow">
      <Container className="grid gap-10 pb-24 pt-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-16">
        {/* Seitenleiste: alle Schritte */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between gap-3 lg:block">
            <div>
              <h1 className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-accent">Schritt für Schritt</h1>
              <p className="mt-1 text-sm text-muted" aria-live="polite">
                {anzahlErledigt} von {liste.length} erledigt
              </p>
            </div>
            <button
              type="button"
              onClick={() => setUebersichtOffen(!zeigeUebersicht)}
              aria-expanded={zeigeUebersicht}
              aria-controls="schritt-liste"
              className="inline-flex min-h-11 items-center gap-2 rounded-pille border border-line bg-surface px-4 text-sm font-semibold lg:hidden"
            >
              Alle Schritte <Icon name="chevron" size={16} className={zeigeUebersicht ? "rotate-90" : ""} />
            </button>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-pille bg-surface-2" aria-hidden="true">
            <div className="h-full rounded-pille bg-gradient-to-r from-gold-500 to-gold-300 transition-all" style={{ width: `${(anzahlErledigt / liste.length) * 100}%` }} />
          </div>
          <nav aria-label="Alle Schritte" id="schritt-liste" className={`${zeigeUebersicht ? "block" : "hidden"} mt-4 lg:block`}>
            <ol className="space-y-1">
              {liste.map((s, i) => {
                const fertig = erledigt.has(s.schritt.id);
                return (
                  <li key={s.schritt.id}>
                    <button
                      type="button"
                      onClick={() => gehe(i)}
                      aria-current={i === index ? "step" : undefined}
                      className={`flex min-h-11 w-full items-center gap-3 rounded-feld px-3 py-2 text-left text-sm transition hover:bg-surface ${
                        i === index ? "bg-surface font-bold shadow-soft" : "text-muted"
                      }`}
                    >
                      <span
                        className={`grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                          fertig ? "bg-gold-400 text-on-accent" : i === index ? "bg-ink text-bg" : "bg-surface-2 text-ink"
                        }`}
                      >
                        {fertig ? <Icon name="check" size={14} strokeWidth={3} /> : i + 1}
                      </span>
                      <span className="min-w-0 flex-1 leading-tight">
                        {s.schritt.titel}
                        {fertig && <span className="sr-only"> (erledigt)</span>}
                        {s.optional && <span className="block text-xs font-normal text-muted">optional</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </aside>

        <div className="min-w-0">
          {ohneInterview && (
            <HinweisBox art="info" titel="Allgemeine Anleitung" className="mb-8">
              <p className="mt-1.5">
                Du hast das Interview noch nicht gemacht. Diese Anleitung nutzt Standardwerte.{" "}
                <Link href="/interview" className="font-bold text-accent underline underline-offset-4">
                  Jetzt personalisieren
                </Link>
              </p>
            </HinweisBox>
          )}

          <div role="group" aria-label="Anleitung anzeigen für" className="no-print mb-8 inline-flex flex-wrap gap-1 rounded-pille border border-line bg-surface p-1">
            {WEGE.map((w) => (
              <button
                key={w.weg}
                type="button"
                aria-pressed={weg === w.weg}
                onClick={() => setWegWahl(w.weg)}
                className={`min-h-10 rounded-pille px-4 text-sm font-semibold transition ${weg === w.weg ? "bg-ink text-bg" : "text-muted hover:text-ink"}`}
              >
                {w.label}
                {w.weg === plan.einstieg.weg && <span className="sr-only"> (empfohlen)</span>}
                {w.weg === plan.einstieg.weg && <span aria-hidden="true"> ★</span>}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={aktuell.schritt.id}
              initial={{ opacity: 0, y: reduziert ? 0 : 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: reduziert ? 0 : -16 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              <SchrittAnsicht
                schritt={aktuell.schritt}
                nummer={index + 1}
                weg={weg}
                os={antworten.os}
                beispielZuerst={plan.lernstil === "beispiel"}
                titelRef={titelRef}
                zusatz={
                  <>
                    {aktuell.optional && aktuell.optionalGrund && (
                      <p className="inline-flex items-center gap-2 rounded-pille bg-surface-2 px-4 py-2 text-sm font-semibold">
                        <Icon name="skip" size={14} /> Optional: {aktuell.optionalGrund}
                      </p>
                    )}
                    {aktuell.schritt.id === "erste-aufgabe" && (
                      <div className="druck-karte rounded-karte border-2 border-gold-400 bg-surface p-6">
                        <p className="text-sm font-bold uppercase tracking-[0.14em] text-muted">Dein persönlicher Prompt</p>
                        <p className="mt-2 font-display text-xl font-semibold leading-snug">{plan.ersterPrompt}</p>
                        <KopierenButton text={plan.ersterPrompt} label="Prompt kopieren" className="mt-4" />
                      </div>
                    )}
                  </>
                }
              />
            </motion.div>
          </AnimatePresence>

          <div className="no-print mt-10 flex flex-wrap items-center gap-3 border-t border-line pt-8">
            <label className="inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-pille border border-line bg-surface px-5 font-semibold">
              <input
                type="checkbox"
                checked={erledigt.has(aktuell.schritt.id)}
                onChange={() => erledigtUmschalten(aktuell.schritt.id)}
                className="size-5 accent-[var(--gold-500)]"
              />
              Erledigt
            </label>
            <button
              type="button"
              onClick={() => gehe(index - 1)}
              disabled={index === 0}
              className="inline-flex min-h-12 items-center gap-2 rounded-pille border border-line bg-surface px-5 font-semibold hover:border-accent disabled:opacity-40"
            >
              <Icon name="back" size={18} /> Zurück
            </button>
            {index < liste.length - 1 ? (
              <button
                type="button"
                onClick={() => {
                  if (!erledigt.has(aktuell.schritt.id)) erledigtUmschalten(aktuell.schritt.id);
                  gehe(index + 1);
                }}
                className="inline-flex min-h-12 items-center gap-2 rounded-pille bg-accent-fill px-6 font-bold text-on-accent shadow-gold transition hover:-translate-y-0.5"
              >
                Erledigt &amp; weiter <Icon name="arrow" size={18} />
              </button>
            ) : (
              <Link href="/beispiele" className="inline-flex min-h-12 items-center gap-2 rounded-pille bg-accent-fill px-6 font-bold text-on-accent shadow-gold">
                Zu den Beispielen <Icon name="arrow" size={18} />
              </Link>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
