# Startklar

Deutschsprachige Web-App, die absoluten Einsteigern beibringt, **Claude Code** richtig zu nutzen.

**Ablauf:** Willkommen → Interview (18 Fragen) → „Dein Plan“ → Schritt für Schritt → Nachschlagen

Aus den Antworten entsteht ein persönlicher Plan: Einstieg (Desktop-App, Terminal oder Web), Voraussetzungen, drei passende Beispiele, passende MCP-Verbindungen, ein empfohlener Berechtigungsmodus, ein erster Prompt zum Kopieren und eine Schritt-für-Schritt-Anleitung.

> Inoffizielles Lernprojekt, nicht von Anthropic. „Claude“ ist eine Marke von Anthropic.

- Kein Backend, kein Login, kein Tracking, keine Cookies – reiner statischer Export.
- Antworten bleiben im Browser (localStorage, mit Fallback, falls gesperrt). „Alles zurücksetzen“ im Footer.
- Alle Aussagen über Claude Code stehen mit Quelle und Prüfdatum in `content/fakten.ts` (Seite `/quellen`).

## Start

Voraussetzung: Node.js 20+ und npm.

```bash
npm install
npm run dev          # http://localhost:3000
```

## Befehle

| Befehl | Was es tut |
|---|---|
| `npm run dev` | Entwicklungsserver |
| `npm run build` | Inhalte validieren und statisch nach `out/` exportieren |
| `npm start` | `out/` lokal ausliefern (Port 3000) |
| `npm run typecheck` | TypeScript (strict) |
| `npm run lint` | ESLint |
| `npm test` | Vitest: Empfehlungslogik, Speicher, Textparser, Inhalts-Validierung |
| `npm run test:e2e` | Playwright gegen `out/` (vorher `npm run build`; lokal einmalig `npx playwright install chromium`) |
| `npm run check` | Typecheck + Lint + Tests + Build |
| `npm run validate` | Nur Inhalte prüfen |

Den Ordner `out/` kannst du auf jedem Webspace/Static-Hosting veröffentlichen.

## Ordnerstruktur

```
app/          Seiten: / interview plan schritte beispiele mcps glossar sicherheit
              spickzettel quellen impressum datenschutz
components/   UI-Bausteine (FrageKarte, Fortschritt, PlanVorschau, BeispielKarte,
              McpKarte, SchrittAnsicht, KopierenButton, HinweisBox, …)
config/       brand.ts – Name und Claim (nur hier ändern)
content/      Inhalte als typisierte Daten: fakten, fragen, beispiele, mcps,
              schritte, glossar, typen
lib/          Reine Logik: empfehlung.ts, antworten.ts, speicher.ts, store.ts,
              text.ts, schritte.ts, validierung.ts
scripts/      validiere-inhalte.ts (läuft vor jedem Build)
tests/        unit/ (Vitest) und e2e/ (Playwright)
docs/         ANNAHMEN.md, ENTSCHEIDUNGEN.md
```

Design-Tokens (Farben, Radien, Schatten, Abstände) stehen an einer Stelle: `app/globals.css` (`:root`, `[data-theme="dark"]`, `@theme`).

## Inhalte schreiben

In allen Textfeldern unter `content/` gibt es drei Auszeichnungen:

| Schreibweise | Ergebnis |
|---|---|
| `[[terminal]]` oder `[[terminal\|Terminal]]` | Glossar-Link mit Ein-Satz-Tooltip |
| `{{fakt:plan-mode-taste}}` | Wert (bzw. Aussage) aus `content/fakten.ts` |
| `` `claude` `` | Inline-Code |

Das Validierungsskript bricht den Build ab, wenn ein Verweis ins Leere zeigt.

**Regel:** Neue Aussagen über Claude Code kommen nur als Eintrag in `content/fakten.ts` mit `quelle` (URL) und `geprueftAm`. Nicht belegbar? Dann `belegt: false` – die App zeigt dazu „bitte in der offiziellen Doku prüfen“.

## Wie füge ich ein Beispiel hinzu?

1. Öffne `content/beispiele.ts` und hänge ein Objekt an:

   ```ts
   {
     id: "rezepte-sammeln",               // eindeutig, klein, mit Bindestrichen
     titel: "Rezepte sammeln",
     kurz: "Aus Fotos und Notizen wird eine Rezeptliste.",
     warumNuetzlich: "Alles an einem Ort, durchsuchbar.",
     schwierigkeit: "leicht",             // leicht | mittel | fortgeschritten
     dauerMin: 20,
     tags: ["ordnen", "sonstiges"],       // Ziel- und Bereich-IDs aus content/typen.ts
     brauchtGithub: false,
     brauchtMcp: false,
     ersterPrompt: "… Stell mir zuerst bis zu 5 Fragen …",
     fertigWenn: "Die Liste enthält alle Rezepte aus dem Ordner.",
     sensibel: false,
     dummyDatenHinweis: "",               // Pflicht, wenn sensibel: true
     icon: "notebook",                    // Name aus lib/icon-namen.ts
   },
   ```

2. `npm run validate` – prüft Pflichtfelder, Tags und Icon.
3. `npm test` – die Empfehlungslogik bewertet das neue Beispiel automatisch nach `tags`, `schwierigkeit` und `dauerMin`.

Neue Icons: Name in `lib/icon-namen.ts` ergänzen und in `components/Icon.tsx` einem Lucide-Icon zuordnen.

## Name ändern

`config/brand.ts` → `name`. Alles andere (Header, Footer, Titel, Speicher-Schlüssel-Präfix) liest von dort.

## Lizenz und Hinweise

Inoffizielles Lernprojekt. Kein Anthropic-Logo, keine nachgebauten Anthropic-Seiten. Impressum und Datenschutz sind Platzhalter mit TODO und müssen vor einer Veröffentlichung ausgefüllt und rechtlich geprüft werden.
