"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { bloecke, fragen } from "@/content/fragen";
import type { Antworten, FrageId } from "@/content/typen";
import { Container } from "@/components/Container";
import { FrageKarte } from "@/components/FrageKarte";
import { Fortschritt } from "@/components/Fortschritt";
import { Icon } from "@/components/Icon";
import { planZusammenfassung, PlanVorschau } from "@/components/PlanVorschau";
import { anzahlBeantwortet, istBeantwortet, offenePflichtfragen } from "@/lib/antworten";
import { setzeAntworten, setzeFortschritt, useZustand } from "@/lib/store";
import { anzahl } from "@/lib/text";

export function InterviewAblauf() {
  const { geladen, antworten, fortschritt, dauerhaft } = useZustand();
  const router = useRouter();
  const reduziert = useReducedMotion();
  const titelRef = useRef<HTMLHeadingElement>(null);
  const [richtung, setRichtung] = useState(1);
  const [meldung, setMeldung] = useState("");
  const [vorschauOffen, setVorschauOffen] = useState(false);
  const ersterRender = useRef(true);

  const index = Math.min(fortschritt.frage, fragen.length - 1);
  const frage = fragen[index];
  const beantwortet = istBeantwortet(antworten, frage.id);

  // Fokus auf die neue Frage setzen (nicht beim ersten Laden der Seite).
  useEffect(() => {
    if (!geladen) return;
    if (ersterRender.current) {
      ersterRender.current = false;
      return;
    }
    titelRef.current?.focus({ preventScroll: false });
  }, [index, geladen]);

  function aendern(id: FrageId, wert: string | string[] | undefined) {
    setMeldung("");
    setzeAntworten((a) => {
      const neu: Record<string, unknown> = { ...a };
      if (wert === undefined || (Array.isArray(wert) && wert.length === 0)) delete neu[id];
      else neu[id] = wert;
      return neu as Antworten;
    });
  }

  function gehe(ziel: number) {
    setRichtung(ziel > index ? 1 : -1);
    setzeFortschritt((f) => ({ ...f, frage: Math.max(0, Math.min(ziel, fragen.length - 1)) }));
  }

  function weiter() {
    if (frage.pflicht && !istBeantwortet(antworten, frage.id)) {
      setMeldung("Diese Frage brauchen wir für deinen Plan. Bitte wähle eine Antwort.");
      return;
    }
    if (index < fragen.length - 1) {
      gehe(index + 1);
      return;
    }
    const offen = offenePflichtfragen(antworten);
    if (offen.length > 0) {
      setMeldung("Es fehlen noch Pflichtfragen. Wir springen zur ersten offenen Frage.");
      gehe(fragen.findIndex((f) => f.id === offen[0]));
      return;
    }
    router.push("/plan");
  }

  function ueberspringen() {
    aendern(frage.id, undefined);
    if (index < fragen.length - 1) gehe(index + 1);
    else weiter();
  }

  if (!geladen) {
    return (
      <Container className="py-24">
        <p className="text-muted">Interview wird geladen …</p>
      </Container>
    );
  }

  const zusammenfassung = planZusammenfassung(antworten);
  const letzte = index === fragen.length - 1;
  const bewegung = reduziert ? 0 : 40;

  return (
    <div className="gold-glow">
      <Container className="grid gap-10 pb-32 pt-8 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-16">
        <div className="min-w-0">
          <Fortschritt aktuell={index + 1} gesamt={fragen.length} beantwortet={anzahlBeantwortet(antworten)} label={bloecke[frage.block]} />
          {!dauerhaft && (
            <p className="mt-3 text-xs text-muted">
              Hinweis: Dein Browser erlaubt kein Speichern. Die Antworten gehen beim Neuladen verloren.
            </p>
          )}

          <div className="relative mt-8 min-h-[18rem] sm:mt-10 sm:min-h-[28rem]">
            <AnimatePresence mode="wait" initial={false} custom={richtung}>
              <motion.div
                key={frage.id}
                custom={richtung}
                initial={{ opacity: 0, x: richtung * bewegung }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -richtung * bewegung }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-accent">
                  Block {frage.block} · {bloecke[frage.block]}
                </p>
                <FrageKarte
                  frage={frage}
                  wert={antworten[frage.id] as string | string[] | undefined}
                  onAendern={(w) => aendern(frage.id, w)}
                  onAuswahlFertig={() => window.setTimeout(() => gehe(index + 1 < fragen.length ? index + 1 : index), 280)}
                  onEnter={weiter}
                  titelRef={titelRef}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <p role="alert" className="mt-6 min-h-6 font-semibold text-gold-800 dark:text-gold-200">
            {meldung}
          </p>

          <nav aria-label="Interview-Navigation" className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => gehe(index - 1)}
              disabled={index === 0}
              className="inline-flex min-h-12 items-center gap-2 rounded-pille border border-line bg-surface px-5 font-semibold transition hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon name="back" size={18} /> Zurück
            </button>
            <button
              type="button"
              onClick={weiter}
              aria-disabled={frage.pflicht && !beantwortet}
              className={`inline-flex min-h-12 items-center gap-2 rounded-pille px-6 font-bold shadow-gold transition hover:-translate-y-0.5 ${
                frage.pflicht && !beantwortet ? "bg-surface-2 text-muted shadow-none" : "bg-accent-fill text-on-accent"
              }`}
            >
              {letzte ? "Plan anzeigen" : "Weiter"} <Icon name="arrow" size={18} />
            </button>
            {!frage.pflicht && (
              <button type="button" onClick={ueberspringen} className="inline-flex min-h-12 items-center gap-2 rounded-pille px-4 font-semibold text-muted underline-offset-4 hover:text-ink hover:underline">
                Überspringen <Icon name="skip" size={16} />
              </button>
            )}
            {anzahlBeantwortet(antworten) > 0 && offenePflichtfragen(antworten).length === 0 && !letzte && (
              <Link href="/plan" className="ml-auto inline-flex min-h-12 items-center gap-2 rounded-pille px-4 text-sm font-semibold text-accent underline-offset-4 hover:underline">
                Direkt zum Plan
              </Link>
            )}
          </nav>
          {!frage.pflicht && (
            <p className="mt-3 text-sm text-muted">Überspringen ist okay – wir nehmen dann einen sinnvollen Standardwert.</p>
          )}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <PlanVorschau antworten={antworten} />
          </div>
        </aside>
      </Container>

      {/* Handy: kleiner Chip mit dem wachsenden Plan */}
      <div className="no-print fixed inset-x-0 bottom-0 z-30 p-4 lg:hidden">
        <AnimatePresence>
          {vorschauOffen && (
            <motion.div
              id="plan-vorschau-mobil"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-3 max-h-[60vh] overflow-auto rounded-karte border border-line bg-surface p-5 shadow-lift"
            >
              <PlanVorschau antworten={antworten} kompakt />
            </motion.div>
          )}
        </AnimatePresence>
        <button
          type="button"
          onClick={() => setVorschauOffen((o) => !o)}
          aria-expanded={vorschauOffen}
          aria-controls="plan-vorschau-mobil"
          className="mx-auto flex min-h-12 items-center gap-2 rounded-pille bg-ink px-5 text-sm font-bold text-bg shadow-lift"
        >
          <Icon name="sparkles" size={16} className="text-gold-300" />
          <span aria-live="polite">
            Dein Plan: {anzahl(zusammenfassung.beispiele, "Beispiel", "Beispiele")}, {anzahl(zusammenfassung.verbindungen, "Verbindung", "Verbindungen")}
          </span>
          <Icon name="chevron" size={16} className={`transition ${vorschauOffen ? "-rotate-90" : "rotate-90"}`} />
        </button>
      </div>
    </div>
  );
}
