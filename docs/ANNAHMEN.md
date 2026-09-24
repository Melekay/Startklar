# Annahmen

Getroffen ohne Rückfrage, weil sie nicht blockierend waren. Jede lässt sich später ändern.

## Inhalt und Fakten
1. **Faktenstand 24.09.2026.** Alle Aussagen über Claude Code wurden an diesem Tag gegen die offizielle Doku (code.claude.com/docs) geprüft und stehen in `content/fakten.ts`.
2. **Abweichungen zu den Startwerten des Auftrags** (Doku gewinnt):
   - Der Modus `default` heißt in allen Oberflächen jetzt **„Manual“**. Die App nennt beide Namen.
   - Auf Pro, Max und Team startet das Terminal standardmäßig im Modus **`auto`**. Empfiehlt der Plan „Manual“, weist er darauf hin, mit Shift+Tab umzuschalten.
   - Cloud-Sitzungen im Web bieten **kein Manual**, nur Auto, Accept edits und Plan. Wer im Web „jeden Schritt bestätigen“ will, bekommt deshalb **Plan** empfohlen.
   - Mit einem **Console-/API-Konto** gibt es weder Desktop-App (braucht bezahltes Abo) noch Web (Pro/Max/Team/Enterprise). Diese Nutzer bekommen das Terminal empfohlen.
3. **MCP-Installationsbefehle** werden nur für Notion und Sentry gezeigt – nur diese stehen wortgleich in der offiziellen MCP-Doku. GitHub (braucht Token) und Datenbank (braucht Passwort) verlinken bewusst nur auf die Doku. Context7 und Playwright verlinken auf die GitHub-Seiten der Anbieter (am 24.09.2026 erreichbar); Websuche, Jira/Linear verweisen auf die Claude-Code-MCP-Doku mit „bitte prüfen“.
4. Zusätzlich zu den geforderten 8 MCPs gibt es **„Kalender & Mail“** und **„Datenbank (nur lesend)“**, damit jede Antwort bei der Frage „Programme im Alltag“ eine passende Karte hat. Die Doku nennt Gmail, Google Calendar und Microsoft 365 als claude.ai-Connectors.
5. Das Glossar hat **22 Begriffe** (15 Pflichtbegriffe plus Projektordner, GitHub, Git, Diff, Dummy-Daten, Prompt-Injection, CSV), weil diese Wörter in Schritten und Beispielen vorkommen.

## Empfehlungslogik (Details, die der Auftrag offenließ)
6. **Einstieg „nach Vorliebe“**: Terminal nur bei `terminal = sicher` oder (`schonmal` und `code = gut`), sonst Desktop-App.
7. **Widerspruch sensible Daten vs. „möglichst selbstständig“**: Sensible Daten gewinnen → Manual (bzw. Plan im Web) mit erklärender Warnung.
8. **„Möglichst selbstständig“** empfiehlt `auto` bei Pro/Max/Team (und „weiß nicht“ mit Prüfhinweis), sonst `acceptEdits`. `bypassPermissions` wird nie empfohlen, nur als Warnung erklärt.
9. **Sensible Daten = ja** blendet sensible Beispiele aus; **manchmal** zeigt sie mit Dummy-Daten-Hinweis. Außerdem wandern Slack und Kalender & Mail dann nach „Später“.
10. **Beispiel-Bewertung**: Ziel-Treffer zählen doppelt, Bereich-Treffer einfach. Reichen die gefilterten Beispiele nicht für 3, wird erst die Zeit, dann die Schwierigkeit gelockert.
11. Die Standardwerte übersprungener Fragen stehen in `content/fragen.ts` (z. B. Kontrolle = „Jeden Schritt bestätigen“, weil das für Einsteiger am sichersten ist).
12. **Erster Prompt**: Die Idee wird als „Ich möchte Folgendes umsetzen: …“ eingebaut, damit die Grammatik unabhängig von der Eingabe stimmt.
13. `ki = Claude Code schon probiert` markiert „Installieren“ und „Erster Start“ als überspringbar.

## Technik
14. **Next.js 16 / React 19 / Tailwind 4** (aktuelle Versionen am 24.09.2026). Framer Motion 13.
15. **Schriften selbst gehostet** über `next/font/local` aus `@fontsource-variable` (Bricolage Grotesque + Manrope + JetBrains Mono). Grund: Der Build braucht so kein Internet, und es gehen keine Anfragen an Google.
16. **Playwright ist auf 1.56.1 gepinnt**, passend zum vorinstallierten Chromium der Cloud-Umgebung. Lokal ggf. `npx playwright install chromium`.
17. Hell ist Standard; folgt aber dem System, bis man selbst umschaltet. Die Wahl wird in localStorage gemerkt.
18. Zusätzliche Seite **/quellen** listet alle Fakten mit Quelle und Prüfdatum (Transparenz).
