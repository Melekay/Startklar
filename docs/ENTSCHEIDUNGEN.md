# Entscheidungen

| # | Entscheidung | Warum |
|---|---|---|
| 1 | Statischer Export (`output: "export"`), kein Backend | Kein Login, kein Tracking, überall hostbar. |
| 2 | Inhalte als typisierte TS-Dateien unter `content/` | Typprüfung + Validierungsskript fangen Fehler vor dem Build. |
| 3 | Mini-Auszeichnung `{{fakt:id}}`, `[[begriff]]`, `` `code` `` | Fakten bleiben an einer Stelle; Glossar-Tooltips entstehen automatisch; Verweise sind prüfbar. |
| 4 | Store über `useSyncExternalStore` statt Context + Effect | Hydrierungs-sicher, kein Flackern, synchron über Tabs (storage-Event). |
| 5 | Speicher-Fallback im Arbeitsspeicher | App funktioniert auch, wenn localStorage gesperrt ist. |
| 6 | Diagramme als datengetriebene Icon-Flüsse statt Bilder | Leicht, barrierearm, hell/dunkel ohne Extra-Grafiken. |
| 7 | Native Radio-/Checkbox-Eingaben als große Karten | Tastatur (Pfeiltasten) und Screenreader funktionieren ohne Zusatzcode. |
| 8 | Lucide-Icons, keine Marken-Logos | Kein Anthropic-Logo, keine nachgebauten Seiten. |
| 9 | Schriften lokal über next/font | Kein externer Abruf, DSGVO-freundlich, Build offline-fähig. |

## Mögliche spätere Ausbaustufen (bewusst nicht gebaut)
- Fortschritt geräteübergreifend (braucht Konto/Backend oder Export/Import-Datei).
- KI-Assistent für Rückfragen direkt in der App.
- Englische Version (Inhalte sind bereits von der Oberfläche getrennt).
- Export des Plans als PDF/Markdown.
- Echte Screenshots statt Diagramm-Platzhaltern.

## Nachtrag Phase 4
| # | Entscheidung | Warum |
|---|---|---|
| 10 | Interview und Stepper werden mit dem Standardzustand vorgerendert statt mit Lade-Platzhalter | Kein Layout-Sprung (CLS 0), schnelleres LCP; wiederkehrende Nutzer sehen nach dem Laden ihren Stand. |
| 11 | Kein `?schritt=`-URL-Parameter; die Plan-Seite setzt den Schritt beim Klick im Speicher | `useSearchParams` würde im statischen Export die ganze Seite erst im Browser rendern. |
| 12 | Basis-CSS in `@layer base` | Sonst überschreiben Element-Regeln die Tailwind-Utilities. |
| 13 | Glossar-Tooltips mit `display: none` statt `visibility: hidden` | Unsichtbare Tooltips erzeugten auf dem Handy horizontales Scrollen. |
| 14 | Einzelauswahl springt per Maus/Touch automatisch weiter, per Tastatur nicht | Schneller für Touch; Pfeiltasten wechseln die Auswahl, ohne ungewollt weiterzuspringen. |
