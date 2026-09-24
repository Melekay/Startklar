import { findeFakt } from "@/content/fakten";

/**
 * Mini-Auszeichnung für Inhaltstexte (reine Funktionen, ohne React):
 *   {{fakt:id}}           → Wert (oder Aussage) aus content/fakten.ts
 *   [[id]] / [[id|Text]]  → Glossar-Verweis
 *   `code`                → Inline-Code
 */

export type TextTeil =
  | { art: "text"; text: string }
  | { art: "code"; text: string }
  | { art: "begriff"; id: string; text: string };

const FAKT_RE = /\{\{fakt:([a-z0-9-]+)\}\}/g;
const BEGRIFF_RE = /\[\[([a-z0-9-]+)(?:\|([^\]]+))?\]\]/g;

export function ersetzeFakten(text: string): string {
  return text.replace(FAKT_RE, (_, id: string) => {
    const f = findeFakt(id);
    if (!f) return `[fehlender Fakt: ${id}]`;
    return f.wert ?? f.aussage;
  });
}

function zerlegeBegriffe(text: string): TextTeil[] {
  const teile: TextTeil[] = [];
  let letzte = 0;
  for (const m of text.matchAll(BEGRIFF_RE)) {
    const start = m.index ?? 0;
    if (start > letzte) teile.push({ art: "text", text: text.slice(letzte, start) });
    const id = m[1];
    teile.push({ art: "begriff", id, text: m[2] ?? id });
    letzte = start + m[0].length;
  }
  if (letzte < text.length) teile.push({ art: "text", text: text.slice(letzte) });
  return teile;
}

export function zerlegeText(roh: string): TextTeil[] {
  const text = ersetzeFakten(roh);
  const teile: TextTeil[] = [];
  const stuecke = text.split("`");
  stuecke.forEach((stueck, i) => {
    if (stueck === "") return;
    if (i % 2 === 1) teile.push({ art: "code", text: stueck });
    else teile.push(...zerlegeBegriffe(stueck));
  });
  return teile;
}

/** Nur der lesbare Text, z. B. für aria-Labels oder die Kopier-Funktion. */
export function reinerText(roh: string): string {
  return zerlegeText(roh)
    .map((t) => t.text)
    .join("");
}

export function findeVerweise(text: string): { fakten: string[]; begriffe: string[] } {
  return {
    fakten: [...text.matchAll(FAKT_RE)].map((m) => m[1]),
    begriffe: [...text.matchAll(BEGRIFF_RE)].map((m) => m[1]),
  };
}
