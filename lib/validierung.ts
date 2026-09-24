import { fakten } from "@/content/fakten";
import { fragen } from "@/content/fragen";
import { beispiele } from "@/content/beispiele";
import { mcps } from "@/content/mcps";
import { schritte } from "@/content/schritte";
import { glossar } from "@/content/glossar";
import type { AlltagsTool, Bereich, Ziel } from "@/content/typen";
import { ICON_NAMEN } from "./icon-namen";
import { findeVerweise } from "./text";

/**
 * Prüft alle Inhalte: Pflichtfelder, Mindestmengen, eindeutige IDs und Verweise.
 * Reine Funktion – das Skript scripts/validiere-inhalte.ts ruft sie beim Build auf.
 */

export const BEREICHE: Bereich[] = ["buero", "it", "marketing", "selbststaendig", "studium", "kreativ", "gesundheit", "sonstiges"];
export const ZIELE: Ziel[] = ["bauen", "buero", "ordnen", "schreiben", "programmieren", "lernen", "unklar"];
export const TOOLS: AlltagsTool[] = ["google", "notion", "slack", "kalendermail", "jiralinear", "datenbank", "keine"];

export const PFLICHT_GLOSSAR = [
  "terminal", "repository", "commit", "claude-md", "plan-mode", "berechtigungsmodus", "mcp",
  "skill", "subagent", "token", "kontext", "cloud-session", "prompt", "hook", "branch",
];

export const PFLICHT_FRAGEN = ["code", "terminal", "ziel", "os", "abo", "github", "sensibel"];

type Inhalte = {
  fakten: typeof fakten;
  fragen: typeof fragen;
  beispiele: typeof beispiele;
  mcps: typeof mcps;
  schritte: typeof schritte;
  glossar: typeof glossar;
};

const standardInhalte: Inhalte = { fakten, fragen, beispiele, mcps, schritte, glossar };

function leer(v: unknown): boolean {
  return typeof v !== "string" || v.trim() === "";
}

function doppelte(ids: string[]): string[] {
  return ids.filter((id, i) => ids.indexOf(id) !== i);
}

function sammleStrings(wert: unknown, ziel: string[] = []): string[] {
  if (typeof wert === "string") ziel.push(wert);
  else if (Array.isArray(wert)) wert.forEach((w) => sammleStrings(w, ziel));
  else if (wert && typeof wert === "object") Object.values(wert).forEach((w) => sammleStrings(w, ziel));
  return ziel;
}

export function validiereInhalte(inhalte: Inhalte = standardInhalte): string[] {
  const fehler: string[] = [];
  const f = (msg: string) => fehler.push(msg);

  const faktIds = new Set(inhalte.fakten.map((x) => x.id));
  const begriffIds = new Set(inhalte.glossar.map((x) => x.id));
  const icons = new Set<string>(ICON_NAMEN);

  const pruefeIcon = (wo: string, icon: string | undefined) => {
    if (icon && !icons.has(icon)) f(`${wo}: unbekanntes Icon „${icon}“`);
  };

  // ---- Fakten ----
  doppelte(inhalte.fakten.map((x) => x.id)).forEach((id) => f(`Fakt-ID doppelt: ${id}`));
  for (const x of inhalte.fakten) {
    if (leer(x.aussage)) f(`Fakt ${x.id}: aussage fehlt`);
    if (!/^https:\/\//.test(x.quelle)) f(`Fakt ${x.id}: quelle muss eine https-URL sein`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(x.geprueftAm)) f(`Fakt ${x.id}: geprueftAm muss JJJJ-MM-TT sein`);
  }

  // ---- Fragen ----
  if (inhalte.fragen.length !== 18) f(`Es müssen genau 18 Fragen sein (sind ${inhalte.fragen.length})`);
  doppelte(inhalte.fragen.map((x) => x.id)).forEach((id) => f(`Frage-ID doppelt: ${id}`));
  for (const id of PFLICHT_FRAGEN) {
    const q = inhalte.fragen.find((x) => x.id === id);
    if (!q?.pflicht) f(`Frage ${id} muss Pflicht sein`);
  }
  for (const q of inhalte.fragen) {
    if (leer(q.frage)) f(`Frage ${q.id}: frage fehlt`);
    if (leer(q.warum)) f(`Frage ${q.id}: „Warum fragen wir das?“ fehlt`);
    if (q.typ !== "text" && (!q.optionen || q.optionen.length < 2)) f(`Frage ${q.id}: mindestens 2 Optionen nötig`);
    if (q.pflicht && q.standard !== undefined) f(`Frage ${q.id}: Pflichtfragen haben keinen Standardwert`);
    if (!q.pflicht && q.standard === undefined) f(`Frage ${q.id}: optionale Fragen brauchen einen Standardwert`);
    const werte = new Set((q.optionen ?? []).map((o) => o.wert));
    const standards = q.standard === undefined ? [] : Array.isArray(q.standard) ? q.standard : [q.standard];
    if (q.typ !== "text") {
      for (const s of standards) if (!werte.has(s)) f(`Frage ${q.id}: Standardwert „${s}“ ist keine Option`);
    }
    for (const o of q.optionen ?? []) {
      if (leer(o.label)) f(`Frage ${q.id}: Option ${o.wert} ohne Label`);
      pruefeIcon(`Frage ${q.id}/${o.wert}`, o.icon);
    }
  }

  // ---- Beispiele ----
  if (inhalte.beispiele.length < 14) f(`Mindestens 14 Beispiele nötig (sind ${inhalte.beispiele.length})`);
  doppelte(inhalte.beispiele.map((x) => x.id)).forEach((id) => f(`Beispiel-ID doppelt: ${id}`));
  const erlaubteTags = new Set<string>([...BEREICHE, ...ZIELE]);
  for (const b of inhalte.beispiele) {
    for (const feld of ["titel", "kurz", "warumNuetzlich", "ersterPrompt", "fertigWenn"] as const) {
      if (leer(b[feld])) f(`Beispiel ${b.id}: ${feld} fehlt`);
    }
    if (!(b.dauerMin > 0)) f(`Beispiel ${b.id}: dauerMin muss > 0 sein`);
    if (b.tags.length === 0) f(`Beispiel ${b.id}: mindestens ein Tag nötig`);
    for (const t of b.tags) if (!erlaubteTags.has(t)) f(`Beispiel ${b.id}: unbekannter Tag „${t}“`);
    if (b.sensibel && leer(b.dummyDatenHinweis)) f(`Beispiel ${b.id}: sensibel, aber dummyDatenHinweis fehlt`);
    pruefeIcon(`Beispiel ${b.id}`, b.icon);
  }
  if (!inhalte.beispiele.some((b) => b.schwierigkeit === "leicht" && b.dauerMin < 15 && !b.sensibel)) {
    f("Es braucht mindestens ein leichtes, nicht sensibles Beispiel unter 15 Minuten");
  }

  // ---- MCPs ----
  if (inhalte.mcps.length < 8) f(`Mindestens 8 MCPs nötig (sind ${inhalte.mcps.length})`);
  doppelte(inhalte.mcps.map((x) => x.id)).forEach((id) => f(`MCP-ID doppelt: ${id}`));
  for (const m of inhalte.mcps) {
    for (const feld of ["name", "wozu", "fuerWen", "voraussetzung", "risiko", "wannNicht", "installHinweis"] as const) {
      if (leer(m[feld])) f(`MCP ${m.id}: ${feld} fehlt`);
    }
    if (!/^https:\/\//.test(m.docsUrl)) f(`MCP ${m.id}: docsUrl muss eine https-URL sein`);
    if (m.installFaktId) {
      const fakt = inhalte.fakten.find((x) => x.id === m.installFaktId);
      if (!fakt) f(`MCP ${m.id}: installFaktId „${m.installFaktId}“ existiert nicht`);
      else if (!fakt.belegt || !fakt.wert) f(`MCP ${m.id}: Installationsbefehl ist nicht belegt`);
    }
    for (const t of m.passtZuTools) if (!TOOLS.includes(t)) f(`MCP ${m.id}: unbekanntes Tool „${t}“`);
    for (const z of m.passtZuZielen) if (!ZIELE.includes(z)) f(`MCP ${m.id}: unbekanntes Ziel „${z}“`);
    pruefeIcon(`MCP ${m.id}`, m.icon);
  }

  // ---- Schritte ----
  if (inhalte.schritte.length < 12) f(`Mindestens 12 Schritte nötig (sind ${inhalte.schritte.length})`);
  doppelte(inhalte.schritte.map((x) => x.id)).forEach((id) => f(`Schritt-ID doppelt: ${id}`));
  for (const s of inhalte.schritte) {
    for (const feld of ["titel", "ziel", "warum", "fertigWenn"] as const) {
      if (leer(s[feld])) f(`Schritt ${s.id}: ${feld} fehlt`);
    }
    if (s.varianten.length === 0) f(`Schritt ${s.id}: mindestens eine Variante nötig`);
    // Jeder Einstiegsweg muss eine Variante ohne System-Einschränkung haben (Rückfall).
    for (const weg of ["desktop", "terminal", "web"] as const) {
      const gedeckt = s.varianten.some((v) => (!v.wege?.length || v.wege.includes(weg)) && !v.systeme?.length);
      if (!gedeckt) f(`Schritt ${s.id}: keine allgemeine Variante für Weg „${weg}“`);
    }
    for (const v of s.varianten) {
      if (v.anleitung.length === 0) f(`Schritt ${s.id}: Variante ohne Anleitung`);
      for (const id of v.befehlFaktIds ?? []) {
        const fakt = inhalte.fakten.find((x) => x.id === id);
        if (!fakt) f(`Schritt ${s.id}: Befehl-Fakt „${id}“ existiert nicht`);
        else if (!fakt.wert) f(`Schritt ${s.id}: Fakt „${id}“ hat keinen Befehl (wert)`);
      }
    }
    if (s.diagramm.length < 2) f(`Schritt ${s.id}: Diagramm braucht mindestens 2 Knoten`);
    for (const k of s.diagramm) pruefeIcon(`Schritt ${s.id}/Diagramm`, k.icon);
    if (s.quellenFaktIds.length === 0) f(`Schritt ${s.id}: mindestens eine Quelle nötig`);
    for (const id of s.quellenFaktIds) if (!faktIds.has(id)) f(`Schritt ${s.id}: Quelle „${id}“ existiert nicht`);
    if (s.haeufigeFehler.length === 0) f(`Schritt ${s.id}: häufige Fehler fehlen`);
    pruefeIcon(`Schritt ${s.id}`, s.icon);
  }

  // ---- Glossar ----
  if (inhalte.glossar.length < 15) f(`Mindestens 15 Glossar-Begriffe nötig (sind ${inhalte.glossar.length})`);
  doppelte(inhalte.glossar.map((x) => x.id)).forEach((id) => f(`Begriff-ID doppelt: ${id}`));
  for (const id of PFLICHT_GLOSSAR) if (!begriffIds.has(id)) f(`Glossar: Pflichtbegriff „${id}“ fehlt`);
  for (const g of inhalte.glossar) {
    if (leer(g.begriff)) f(`Begriff ${g.id}: begriff fehlt`);
    if (leer(g.kurz)) f(`Begriff ${g.id}: kurz fehlt`);
    else if (!/[.!?]$/.test(g.kurz.trim()) || /[.!?]\s+\S/.test(g.kurz.trim().replace(/z\. B\./g, "zB"))) {
      f(`Begriff ${g.id}: kurz muss genau ein Satz sein`);
    }
  }

  // ---- Verweise in allen Texten ----
  const alleTexte = sammleStrings([inhalte.fragen, inhalte.beispiele, inhalte.mcps, inhalte.schritte, inhalte.glossar]);
  for (const t of alleTexte) {
    const v = findeVerweise(t);
    for (const id of v.fakten) if (!faktIds.has(id)) f(`Verweis auf unbekannten Fakt „${id}“ in: ${t.slice(0, 60)}…`);
    for (const id of v.begriffe) if (!begriffIds.has(id)) f(`Verweis auf unbekannten Begriff „${id}“ in: ${t.slice(0, 60)}…`);
  }

  return fehler;
}
