import { brand } from "@/config/brand";
import type { Antworten } from "@/content/typen";
import { bereinigeAntworten } from "./antworten";

/**
 * Speichern nur im Browser (localStorage), immer mit try/catch.
 * Ist localStorage gesperrt (privater Modus, Einstellungen), fällt alles
 * auf einen Speicher im Arbeitsspeicher zurück – die App funktioniert weiter.
 */

export type SpeicherAdapter = {
  lesen(schluessel: string): string | null;
  schreiben(schluessel: string, wert: string): void;
  entfernen(schluessel: string): void;
  dauerhaft: boolean;
};

export const SCHLUESSEL = {
  antworten: `${brand.speicherPrefix}:antworten`,
  fortschritt: `${brand.speicherPrefix}:fortschritt`,
  theme: `${brand.speicherPrefix}:theme`,
} as const;

export type Fortschritt = {
  /** Index der aktuellen Interview-Frage */
  frage: number;
  /** Index des aktuellen Schritts im Stepper */
  schritt: number;
  /** IDs erledigter Schritte */
  erledigt: string[];
};

export const LEERER_FORTSCHRITT: Fortschritt = { frage: 0, schritt: 0, erledigt: [] };

export function speicherImArbeitsspeicher(): SpeicherAdapter {
  const daten = new Map<string, string>();
  return {
    lesen: (k) => daten.get(k) ?? null,
    schreiben: (k, v) => void daten.set(k, v),
    entfernen: (k) => void daten.delete(k),
    dauerhaft: false,
  };
}

export function browserSpeicher(): SpeicherAdapter {
  try {
    const ls = window.localStorage;
    const test = `${brand.speicherPrefix}:test`;
    ls.setItem(test, "1");
    ls.removeItem(test);
    return {
      lesen: (k) => {
        try {
          return ls.getItem(k);
        } catch {
          return null;
        }
      },
      schreiben: (k, v) => {
        try {
          ls.setItem(k, v);
        } catch {
          /* Speicher voll oder gesperrt – ignorieren */
        }
      },
      entfernen: (k) => {
        try {
          ls.removeItem(k);
        } catch {
          /* ignorieren */
        }
      },
      dauerhaft: true,
    };
  } catch {
    return speicherImArbeitsspeicher();
  }
}

function jsonLesen(s: SpeicherAdapter, k: string): unknown {
  const roh = s.lesen(k);
  if (!roh) return null;
  try {
    return JSON.parse(roh);
  } catch {
    return null;
  }
}

export function ladeAntworten(s: SpeicherAdapter): Antworten {
  return bereinigeAntworten(jsonLesen(s, SCHLUESSEL.antworten));
}

export function speichereAntworten(s: SpeicherAdapter, a: Antworten): void {
  s.schreiben(SCHLUESSEL.antworten, JSON.stringify(a));
}

export function bereinigeFortschritt(roh: unknown): Fortschritt {
  if (!roh || typeof roh !== "object") return { ...LEERER_FORTSCHRITT };
  const r = roh as Record<string, unknown>;
  const zahl = (v: unknown) => (typeof v === "number" && Number.isInteger(v) && v >= 0 ? v : 0);
  const erledigt = Array.isArray(r.erledigt) ? r.erledigt.filter((x): x is string => typeof x === "string") : [];
  return { frage: zahl(r.frage), schritt: zahl(r.schritt), erledigt: [...new Set(erledigt)] };
}

export function ladeFortschritt(s: SpeicherAdapter): Fortschritt {
  return bereinigeFortschritt(jsonLesen(s, SCHLUESSEL.fortschritt));
}

export function speichereFortschritt(s: SpeicherAdapter, f: Fortschritt): void {
  s.schreiben(SCHLUESSEL.fortschritt, JSON.stringify(f));
}

/** Löscht Antworten und Fortschritt. Die Farbwahl (hell/dunkel) bleibt. */
export function allesZuruecksetzen(s: SpeicherAdapter): void {
  s.entfernen(SCHLUESSEL.antworten);
  s.entfernen(SCHLUESSEL.fortschritt);
}
