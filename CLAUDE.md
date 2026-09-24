@AGENTS.md

# Startklar – Projektregeln

Deutschsprachige Lern-App für Claude-Code-Einsteiger. Statischer Next.js-Export, kein Backend.

## Befehle
- `npm run dev` – Entwicklung
- `npm run check` – Typecheck, Lint, Unit-Tests, Build (vor jedem Commit)
- `npm run test:e2e` – Playwright (braucht vorher `npm run build`)
- `npm run validate` – nur Inhalte prüfen

## Struktur
- `app/` Seiten · `components/` UI · `config/brand.ts` Name (nur dort ändern)
- `content/` alle Inhalte als typisierte Daten · `lib/` reine Logik · `tests/unit`, `tests/e2e`

## Regeln
- Fakten über Claude Code NUR in `content/fakten.ts` (mit `quelle` + `geprueftAm`). Andere Texte verweisen per `{{fakt:id}}`. Nicht Belegtes: `belegt: false` → App zeigt „bitte in der offiziellen Doku prüfen“.
- Fachbegriffe in Texten als `[[glossar-id|Text]]` verlinken.
- `lib/empfehlung.ts` bleibt frei von Seiteneffekten; jede Regel braucht einen Vitest-Test.
- localStorage nur über `lib/speicher.ts` (immer try/catch).
- Kein Tracking, keine Cookies, kein Backend, kein Three.js, keine Anthropic-Logos.
- Sprache: Deutsch, du-Form, kurze Sätze. Schritte enden mit „Fertig, wenn …“.
- Nur Dateien im Repo, keine Secrets, keine interaktiven Befehle.
