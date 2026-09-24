import { fragen } from "@/content/fragen";
import type { Antworten, Frage, FrageId } from "@/content/typen";

/** Reine Hilfsfunktionen rund um Interview-Antworten. */

export const MAX_TEXT = { name: 40, idee: 280 } as const;

export function bereinigeText(wert: string, max: number): string {
  return wert.replace(/\s+/g, " ").trim().slice(0, max);
}

function istGueltigerWert(frage: Frage, wert: unknown): boolean {
  if (frage.typ === "text") return typeof wert === "string";
  const erlaubt = new Set((frage.optionen ?? []).map((o) => o.wert));
  if (frage.typ === "einzel") return typeof wert === "string" && erlaubt.has(wert);
  return Array.isArray(wert) && wert.every((w) => typeof w === "string" && erlaubt.has(w));
}

/**
 * Macht aus beliebigen Daten (z. B. aus localStorage) gültige Antworten.
 * Unbekannte Schlüssel und ungültige Werte werden verworfen.
 */
export function bereinigeAntworten(roh: unknown): Antworten {
  if (!roh || typeof roh !== "object" || Array.isArray(roh)) return {};
  const quelle = roh as Record<string, unknown>;
  const ergebnis: Record<string, unknown> = {};
  for (const frage of fragen) {
    const wert = quelle[frage.id];
    if (wert === undefined || !istGueltigerWert(frage, wert)) continue;
    if (frage.typ === "text") {
      const max = frage.id === "name" ? MAX_TEXT.name : MAX_TEXT.idee;
      const text = bereinigeText(wert as string, max);
      if (text) ergebnis[frage.id] = text;
    } else if (frage.typ === "mehrfach") {
      const liste = normalisiereMehrfach(frage, [...new Set(wert as string[])]);
      if (liste.length) ergebnis[frage.id] = liste;
    } else {
      ergebnis[frage.id] = wert;
    }
  }
  return ergebnis as Antworten;
}

/** Hält max. Auswahl und exklusive Optionen („Keine“, „Weiß ich nicht“) ein. */
export function normalisiereMehrfach(frage: Frage, werte: string[]): string[] {
  const exklusiv = new Set((frage.optionen ?? []).filter((o) => o.exklusiv).map((o) => o.wert));
  const exklusiverWert = werte.find((w) => exklusiv.has(w));
  let liste = exklusiverWert ? [exklusiverWert] : werte;
  if (frage.maxAuswahl) liste = liste.slice(0, frage.maxAuswahl);
  return liste;
}

/** Wählt eine Option in einer Mehrfachfrage an oder ab (reine Funktion). */
export function toggleMehrfach(frage: Frage, aktuell: string[], wert: string): string[] {
  if (aktuell.includes(wert)) return aktuell.filter((w) => w !== wert);
  const option = frage.optionen?.find((o) => o.wert === wert);
  if (option?.exklusiv) return [wert];
  const exklusiv = new Set((frage.optionen ?? []).filter((o) => o.exklusiv).map((o) => o.wert));
  const ohneExklusiv = aktuell.filter((w) => !exklusiv.has(w));
  if (frage.maxAuswahl && ohneExklusiv.length >= frage.maxAuswahl) {
    // Älteste Auswahl fällt raus, damit die neue sichtbar greift.
    return [...ohneExklusiv.slice(1), wert];
  }
  return [...ohneExklusiv, wert];
}

/** Ergänzt übersprungene optionale Fragen um ihren Standardwert. */
export function vervollstaendige(antworten: Antworten): Antworten {
  const ergebnis: Record<string, unknown> = { ...antworten };
  for (const frage of fragen) {
    if (ergebnis[frage.id] !== undefined || frage.pflicht || frage.standard === undefined) continue;
    if (frage.typ === "text") continue; // leerer Text = kein Wert
    ergebnis[frage.id] = frage.standard;
  }
  return ergebnis as Antworten;
}

export function istBeantwortet(antworten: Antworten, id: FrageId): boolean {
  const wert = antworten[id];
  if (wert === undefined) return false;
  if (Array.isArray(wert)) return wert.length > 0;
  if (typeof wert === "string") return wert.trim().length > 0;
  return true;
}

export function offenePflichtfragen(antworten: Antworten): FrageId[] {
  return fragen.filter((f) => f.pflicht && !istBeantwortet(antworten, f.id)).map((f) => f.id);
}

export function anzahlBeantwortet(antworten: Antworten): number {
  return fragen.filter((f) => istBeantwortet(antworten, f.id)).length;
}

export function labelFuer(id: FrageId, wert: string): string {
  const frage = fragen.find((f) => f.id === id);
  return frage?.optionen?.find((o) => o.wert === wert)?.label ?? wert;
}
