"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";
import { findeBeispiel } from "@/content/beispiele";
import { findeMcp, WENIGER_IST_MEHR } from "@/content/mcps";
import { BeispielKarte } from "@/components/BeispielKarte";
import { Container } from "@/components/Container";
import { HinweisBox } from "@/components/HinweisBox";
import { Icon } from "@/components/Icon";
import { KopierenButton } from "@/components/KopierenButton";
import { McpKarte } from "@/components/McpKarte";
import { RichText } from "@/components/RichText";
import { anzahlBeantwortet, offenePflichtfragen } from "@/lib/antworten";
import { erstellePlan } from "@/lib/empfehlung";
import { schritteAusPlan } from "@/lib/schritte";
import { useZustand } from "@/lib/store";
import { anzahl } from "@/lib/text";

const EINSTIEG_ICON = { desktop: "laptop", terminal: "terminal", web: "globe" } as const;

function Abschnitt({ id, nummer, titel, children }: { id: string; nummer: number; titel: string; children: React.ReactNode }) {
  return (
    <motion.section
      id={id}
      aria-labelledby={`${id}-titel`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="scroll-mt-24 border-t border-line py-14"
    >
      <div className="flex items-baseline gap-4">
        <span aria-hidden="true" className="font-display text-lg font-bold text-accent">
          {String(nummer).padStart(2, "0")}
        </span>
        <h2 id={`${id}-titel`} className="text-3xl font-extrabold leading-tight sm:text-4xl">
          {titel}
        </h2>
      </div>
      <div className="mt-8">{children}</div>
    </motion.section>
  );
}

export function PlanAnsicht() {
  const { geladen, antworten } = useZustand();
  const plan = useMemo(() => erstellePlan(antworten), [antworten]);

  if (!geladen) {
    return (
      <Container className="py-24">
        <p className="text-muted">Dein Plan wird geladen …</p>
      </Container>
    );
  }

  const beantwortet = anzahlBeantwortet(antworten);
  const offen = offenePflichtfragen(antworten);
  const schritte = schritteAusPlan(plan);

  if (beantwortet === 0) {
    return (
      <div className="gold-glow">
        <Container className="py-24 sm:py-32">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Dein Plan</p>
          <h1 className="mt-3 max-w-3xl text-5xl font-extrabold leading-[1.02] sm:text-7xl">Noch leer – aber gleich nicht mehr.</h1>
          <p className="mt-6 max-w-xl text-xl text-muted">
            Beantworte ein paar Fragen. Danach bekommst du einen Plan, der zu dir passt. Dauert etwa 5 Minuten.
          </p>
          <Link href="/interview" className="mt-10 inline-flex min-h-14 items-center gap-2 rounded-pille bg-accent-fill px-8 text-lg font-bold text-on-accent shadow-gold transition hover:-translate-y-0.5">
            Interview starten <Icon name="arrow" size={20} />
          </Link>
        </Container>
      </div>
    );
  }

  // Reihenfolge je nach Lernstil: „Erst ein Beispiel sehen“ zieht Prompt und Beispiele nach vorn.
  const abschnitte: { id: string; titel: string; inhalt: React.ReactNode }[] = [];

  const voraussetzungen = plan.voraussetzungen.length > 0 && {
    id: "voraussetzungen",
    titel: "Zuerst klären",
    inhalt: (
      <ul className="grid gap-4 md:grid-cols-2">
        {plan.voraussetzungen.map((v) => (
          <li key={v.id} className="druck-karte rounded-karte border border-line bg-surface p-6 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-bold">{v.titel}</h3>
              <span className={`rounded-pille px-3 py-1 text-xs font-bold ${v.optional ? "bg-surface-2" : "bg-gold-100 text-gold-800 dark:bg-gold-900/50 dark:text-gold-200"}`}>
                {v.optional ? "Optional" : "Wichtig"}
              </span>
            </div>
            <p className="mt-2 leading-relaxed text-muted">
              <RichText text={v.text} />
            </p>
            {v.link && (
              <a href={v.link.href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-2 font-bold text-accent underline-offset-4 hover:underline">
                {v.link.label} <Icon name="external" size={14} />
                <span className="sr-only">(öffnet in neuem Tab)</span>
              </a>
            )}
          </li>
        ))}
      </ul>
    ),
  };

  const einstieg = {
    id: "einstieg",
    titel: "Dein Einstieg",
    inhalt: (
      <div className="druck-karte grid gap-6 rounded-karte bg-ink p-8 text-bg sm:grid-cols-[auto_1fr] sm:p-10">
        <span className="grid size-20 place-items-center rounded-3xl bg-gradient-to-br from-gold-300 to-gold-600 text-on-accent">
          <Icon name={EINSTIEG_ICON[plan.einstieg.weg]} size={40} />
        </span>
        <div>
          <p className="font-display text-3xl font-extrabold sm:text-4xl">{plan.einstieg.titel}</p>
          <p className="mt-3 max-w-2xl text-lg leading-relaxed opacity-85">{plan.einstieg.begruendung}</p>
          {plan.einstieg.spaeter && (
            <p className="mt-4 text-sm opacity-70">
              <strong>Später:</strong> {plan.einstieg.spaeter}
            </p>
          )}
        </div>
      </div>
    ),
  };

  const prompt = {
    id: "prompt",
    titel: "Dein erster Prompt",
    inhalt: (
      <div className="druck-karte relative overflow-hidden rounded-karte border-2 border-gold-400 bg-surface p-8 shadow-gold sm:p-10">
        <Icon name="quote" size={48} className="absolute right-6 top-6 text-gold-200 dark:text-gold-800" />
        <p className="relative max-w-3xl font-display text-2xl font-semibold leading-snug sm:text-3xl">{plan.ersterPrompt}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <KopierenButton text={plan.ersterPrompt} label="Prompt kopieren" />
          <p className="text-sm text-muted">Einfügen, absenden, Fragen beantworten. Claude ändert nichts ohne dein OK.</p>
        </div>
      </div>
    ),
  };

  const modus = {
    id: "modus",
    titel: "Dein Berechtigungsmodus",
    inhalt: (
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <div className="druck-karte rounded-karte border border-line bg-surface p-8 shadow-soft">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-muted">Empfehlung</p>
          <p className="mt-2 font-display text-3xl font-extrabold">{plan.modus.label}</p>
          <p className="mt-3 leading-relaxed text-muted">
            <RichText text={plan.modus.erklaerung} />
          </p>
          <Link href="/sicherheit#modi" className="mt-4 inline-flex min-h-11 items-center gap-2 font-bold text-accent underline-offset-4 hover:underline">
            Alle Modi verstehen <Icon name="arrow" size={16} />
          </Link>
        </div>
        <div className="space-y-4">
          <HinweisBox art="tipp" titel="Plan Mode für größere Aufgaben" text={plan.modus.planModeTipp} />
          {plan.modus.warnung && <HinweisBox art="achtung" titel="Gut zu wissen" text={plan.modus.warnung} />}
        </div>
      </div>
    ),
  };

  const beispiele = {
    id: "beispiele",
    titel: "Drei Beispiele für dich",
    inhalt: (
      <>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {plan.beispiele.map((e) => {
            const b = findeBeispiel(e.beispielId);
            return b ? <BeispielKarte key={b.id} beispiel={b} grund={e.grund} mitDummyDaten={e.mitDummyDaten} /> : null;
          })}
        </div>
        <Link href="/beispiele" className="mt-6 inline-flex min-h-11 items-center gap-2 font-bold text-accent underline-offset-4 hover:underline">
          Alle Beispiele ansehen <Icon name="arrow" size={16} />
        </Link>
      </>
    ),
  };

  const mcps = {
    id: "verbindungen",
    titel: "Deine Verbindungen (MCP)",
    inhalt: (
      <>
        <p className="max-w-2xl text-lg leading-relaxed text-muted">
          <RichText text={plan.mcps.begruendung} />
        </p>
        {plan.mcps.jetzt.length > 0 && (
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {plan.mcps.jetzt.map((e) => {
              const m = findeMcp(e.mcpId);
              return m ? <McpKarte key={m.id} mcp={m} grund={e.grund} /> : null;
            })}
          </div>
        )}
        {plan.mcps.spaeter.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-bold">Später interessant</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {plan.mcps.spaeter.map((e) => (
                <li key={e.mcpId}>
                  <Link href={`/mcps#${e.mcpId}`} className="inline-flex min-h-11 items-center gap-2 rounded-pille border border-line bg-surface px-4 text-sm font-semibold hover:border-accent">
                    {findeMcp(e.mcpId)?.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="mt-6 text-sm text-muted">
          <RichText text={WENIGER_IST_MEHR} />
        </p>
      </>
    ),
  };

  const hinweise = plan.hinweise.length > 0 && {
    id: "hinweise",
    titel: "Gut zu wissen",
    inhalt: (
      <div className="grid gap-4 md:grid-cols-2">
        {plan.hinweise.map((h) => (
          <HinweisBox key={h.id} art={h.art} titel={h.titel} text={h.text} />
        ))}
      </div>
    ),
  };

  const anleitung = {
    id: "anleitung",
    titel: "Deine Schritt-für-Schritt-Anleitung",
    inhalt: (
      <>
        <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {schritte.map((s, i) => (
            <li key={s.schritt.id}>
              <Link
                href={`/schritte?schritt=${i + 1}`}
                className="flex min-h-16 items-center gap-4 rounded-feld border border-line bg-surface p-4 transition hover:-translate-y-0.5 hover:border-accent"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-surface-2 font-display font-bold">{i + 1}</span>
                <span className="min-w-0">
                  <span className="block font-semibold leading-tight">{s.schritt.titel}</span>
                  {s.optional && <span className="text-xs text-muted">Optional</span>}
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <Link href="/schritte" className="mt-8 inline-flex min-h-14 items-center gap-2 rounded-pille bg-accent-fill px-8 text-lg font-bold text-on-accent shadow-gold transition hover:-translate-y-0.5">
          Schritt für Schritt starten <Icon name="arrow" size={20} />
        </Link>
      </>
    ),
  };

  if (voraussetzungen) abschnitte.push(voraussetzungen);
  if (plan.lernstil === "beispiel") abschnitte.push(prompt, beispiele, einstieg, modus, mcps);
  else if (plan.lernstil === "ueberblick") abschnitte.push(anleitung, einstieg, prompt, modus, beispiele, mcps);
  else abschnitte.push(einstieg, prompt, modus, beispiele, mcps);
  if (hinweise) abschnitte.push(hinweise);
  if (plan.lernstil !== "ueberblick") abschnitte.push(anleitung);

  return (
    <>
      <div className="gold-glow">
        <Container className="pb-10 pt-16 sm:pt-24">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">{plan.anrede} Das ist</p>
          <h1 className="mt-3 text-6xl font-extrabold leading-[0.98] sm:text-8xl">
            Dein <span className="text-gold-verlauf">Plan.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">
            Zusammengestellt aus deinen {beantwortet} Antworten. Alle Angaben zu Claude Code stammen aus der offiziellen Doku.
          </p>
          <ul className="mt-8 flex flex-wrap gap-2 text-sm font-semibold" aria-label="Zusammenfassung">
            <li className="rounded-pille bg-surface px-4 py-2 shadow-soft">{plan.einstieg.titel}</li>
            <li className="rounded-pille bg-surface px-4 py-2 shadow-soft">Modus: {plan.modus.label.split(" (")[0]}</li>
            <li className="rounded-pille bg-surface px-4 py-2 shadow-soft">{anzahl(plan.beispiele.length, "Beispiel", "Beispiele")}</li>
            <li className="rounded-pille bg-surface px-4 py-2 shadow-soft">{anzahl(plan.mcps.jetzt.length, "Verbindung", "Verbindungen")}</li>
            <li className="rounded-pille bg-surface px-4 py-2 shadow-soft">{anzahl(schritte.length, "Schritt", "Schritte")}</li>
          </ul>
          <div className="no-print mt-8 flex flex-wrap gap-3">
            <Link href="/schritte" className="inline-flex min-h-12 items-center gap-2 rounded-pille bg-accent-fill px-6 font-bold text-on-accent shadow-gold transition hover:-translate-y-0.5">
              Schritt für Schritt starten <Icon name="arrow" size={18} />
            </Link>
            <Link href="/interview" className="inline-flex min-h-12 items-center gap-2 rounded-pille border border-line bg-surface px-6 font-semibold hover:border-accent">
              <Icon name="pen" size={16} /> Antworten ändern
            </Link>
            <button type="button" onClick={() => window.print()} className="inline-flex min-h-12 items-center gap-2 rounded-pille border border-line bg-surface px-6 font-semibold hover:border-accent">
              <Icon name="print" size={16} /> Drucken
            </button>
          </div>
          {offen.length > 0 && (
            <HinweisBox art="info" titel="Vorläufiger Plan" className="mt-8 max-w-2xl">
              <p className="mt-1.5 text-ink/90">
                Es fehlen noch {offen.length} Pflichtfragen. Bis dahin nutzen wir vorsichtige Standardwerte.{" "}
                <Link href="/interview" className="font-bold text-accent underline underline-offset-4">
                  Jetzt ergänzen
                </Link>
              </p>
            </HinweisBox>
          )}
        </Container>
      </div>
      <Container>
        {abschnitte.map((a, i) => (
          <Abschnitt key={a.id} id={a.id} nummer={i + 1} titel={a.titel}>
            {a.inhalt}
          </Abschnitt>
        ))}
      </Container>
    </>
  );
}
