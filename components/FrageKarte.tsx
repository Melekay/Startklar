"use client";

import { useRef } from "react";
import type { Frage } from "@/content/typen";
import { toggleMehrfach } from "@/lib/antworten";
import { Icon } from "./Icon";
import { RichText } from "./RichText";

type Props = {
  frage: Frage;
  wert: string | string[] | undefined;
  onAendern: (wert: string | string[] | undefined) => void;
  /** Wird nach einer Auswahl per Maus/Touch bei Einzelfragen aufgerufen. */
  onAuswahlFertig?: () => void;
  onEnter?: () => void;
  titelRef?: React.Ref<HTMLHeadingElement>;
};

/** Eine Interview-Frage mit großen, antippbaren Karten (native Radio/Checkbox-Felder). */
export function FrageKarte({ frage, wert, onAendern, onAuswahlFertig, onEnter, titelRef }: Props) {
  const zeiger = useRef(false);
  const titelId = `frage-${frage.id}`;
  const hilfeId = `frage-${frage.id}-hilfe`;

  return (
    <fieldset aria-labelledby={titelId} aria-describedby={hilfeId} className="min-w-0">
      <h2 id={titelId} ref={titelRef} tabIndex={-1} className="text-balance text-4xl font-extrabold leading-[1.05] outline-none sm:text-5xl">
        {frage.frage}
        {frage.pflicht && (
          <span className="ml-2 align-top text-2xl text-accent" aria-label="Pflichtfrage" title="Pflichtfrage">
            ★
          </span>
        )}
      </h2>
      <div id={hilfeId} className="mt-4 space-y-2 text-muted">
        {frage.erklaerung && (
          <p className="text-lg leading-relaxed text-ink/85">
            <RichText text={frage.erklaerung} />
          </p>
        )}
        <p className="flex items-start gap-2 text-sm">
          <Icon name="info" size={16} className="mt-0.5 shrink-0 text-accent" />
          <span>
            <strong className="font-semibold text-ink">Warum fragen wir das?</strong> <RichText text={frage.warum} />
          </span>
        </p>
        {frage.typ === "mehrfach" && (
          <p className="text-sm font-semibold text-ink">
            {frage.maxAuswahl ? `Wähle bis zu ${frage.maxAuswahl}.` : "Mehrere möglich."}
          </p>
        )}
      </div>

      {frage.typ === "text" ? (
        <TextFeld frage={frage} wert={typeof wert === "string" ? wert : ""} onAendern={onAendern} onEnter={onEnter} />
      ) : (
        <div
          className={`mt-8 grid gap-3 ${(frage.optionen?.length ?? 0) > 4 ? "sm:grid-cols-2" : ""}`}
          onPointerDown={() => (zeiger.current = true)}
          onKeyDown={() => (zeiger.current = false)}
        >
          {frage.optionen?.map((o) => {
            const mehrfach = frage.typ === "mehrfach";
            const gewaehlt = mehrfach ? Array.isArray(wert) && wert.includes(o.wert) : wert === o.wert;
            return (
              <label
                key={o.wert}
                className={`group relative flex min-h-16 cursor-pointer items-center gap-4 rounded-feld border-2 bg-surface p-4 shadow-soft transition focus-within:outline focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-focus hover:-translate-y-0.5 hover:border-gold-400 ${
                  gewaehlt ? "border-gold-500 bg-gold-50 dark:bg-gold-900/30" : "border-transparent"
                }`}
              >
                <input
                  type={mehrfach ? "checkbox" : "radio"}
                  name={frage.id}
                  value={o.wert}
                  checked={gewaehlt}
                  className="sr-only"
                  onChange={() => {
                    if (mehrfach) {
                      onAendern(toggleMehrfach(frage, Array.isArray(wert) ? wert : [], o.wert));
                    } else {
                      onAendern(o.wert);
                      if (zeiger.current) onAuswahlFertig?.();
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onEnter?.();
                    }
                  }}
                />
                {o.icon && (
                  <span
                    className={`grid size-11 shrink-0 place-items-center rounded-xl transition ${
                      gewaehlt ? "bg-gold-400 text-on-accent" : "bg-surface-2 text-ink group-hover:bg-gold-100 dark:group-hover:bg-gold-900/40"
                    }`}
                  >
                    <Icon name={o.icon} size={20} />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block text-base font-bold leading-snug sm:text-lg">{o.label}</span>
                  {o.hinweis && <span className="mt-0.5 block text-sm text-muted">{o.hinweis}</span>}
                </span>
                <span
                  aria-hidden="true"
                  className={`grid size-6 shrink-0 place-items-center border-2 transition ${mehrfach ? "rounded-md" : "rounded-full"} ${
                    gewaehlt ? "border-gold-500 bg-gold-500 text-white" : "border-line"
                  }`}
                >
                  {gewaehlt && <Icon name="check" size={14} strokeWidth={3} />}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}

function TextFeld({
  frage,
  wert,
  onAendern,
  onEnter,
}: {
  frage: Frage;
  wert: string;
  onAendern: (w: string | undefined) => void;
  onEnter?: () => void;
}) {
  const max = frage.id === "name" ? 40 : 280;
  const feldId = `eingabe-${frage.id}`;
  return (
    <div className="mt-8">
      <label htmlFor={feldId} className="sr-only">
        {frage.frage}
      </label>
      <input
        id={feldId}
        type="text"
        value={wert}
        maxLength={max}
        autoComplete={frage.id === "name" ? "given-name" : "off"}
        placeholder={frage.platzhalter ? `z. B. ${frage.platzhalter[0]}` : ""}
        onChange={(e) => onAendern(e.target.value === "" ? undefined : e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            onEnter?.();
          }
        }}
        className="min-h-16 w-full rounded-feld border-2 border-line bg-surface px-5 text-xl shadow-soft outline-none transition placeholder:text-muted/70 focus:border-gold-500"
      />
      {frage.platzhalter && frage.id === "idee" && (
        <div className="mt-4">
          <p className="text-sm text-muted">Oder übernimm eine Idee:</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {frage.platzhalter.map((p) => (
              <li key={p}>
                <button
                  type="button"
                  onClick={() => onAendern(p)}
                  className="min-h-11 rounded-pille border border-line bg-surface px-4 text-sm font-semibold transition hover:border-gold-400"
                >
                  {p}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
