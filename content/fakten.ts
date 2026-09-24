import type { Fakt } from "./typen";

/**
 * ALLE Aussagen über Claude Code stehen hier – mit Quelle und Prüfdatum.
 * Andere Inhalte verweisen per {{fakt:id}} oder faktId darauf.
 * belegt: false → die App zeigt „bitte in der offiziellen Doku prüfen“.
 */

const GEPRUEFT = "2026-09-24";
const DOCS = "https://code.claude.com/docs/en";

export const DOKU = {
  overview: `${DOCS}/overview`,
  quickstart: `${DOCS}/quickstart`,
  bestPractices: `${DOCS}/best-practices`,
  permissionModes: `${DOCS}/permission-modes`,
  memory: `${DOCS}/memory`,
  mcp: `${DOCS}/mcp`,
  costs: `${DOCS}/costs`,
  desktopQuickstart: `${DOCS}/desktop-quickstart`,
  webQuickstart: `${DOCS}/web-quickstart`,
  terminalGuide: `${DOCS}/terminal-guide`,
  pricing: "https://claude.com/pricing",
  academy: "https://academy.claude.com/",
  academyKurs: "https://academy.claude.com/courses/claude-code-101",
  gitForWindows: "https://git-scm.com/downloads/win",
  githubNeu: "https://github.com/signup",
} as const;

export const fakten: Fakt[] = [
  // --- Zugänge und Voraussetzungen ---
  {
    id: "oberflaechen",
    aussage:
      "Claude Code gibt es im Terminal, in VS Code und JetBrains, als Desktop-App und im Web (claude.ai/code).",
    quelle: DOKU.overview,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "zugang-allgemein",
    aussage:
      "Die meisten Zugänge brauchen ein Claude-Abo oder ein Konto in der Anthropic Console.",
    quelle: DOKU.overview,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "zugang-kontotypen",
    aussage:
      "Anmelden kannst du dich mit Claude Pro, Max, Team oder Enterprise (empfohlen) oder mit einem Claude-Console-Konto (API-Zugang mit vorab bezahltem Guthaben).",
    quelle: DOKU.quickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "desktop-abo",
    aussage:
      "Die Desktop-App braucht ein bezahltes Abo (Pro, Max, Team oder Enterprise). Sie enthält Claude Code bereits im Tab „Code“ – du musst nichts extra installieren, auch kein Node.js.",
    quelle: DOKU.desktopQuickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "desktop-systeme",
    aussage:
      "Die Desktop-App gibt es für macOS (Intel und Apple Silicon) und Windows (x64 und ARM64). Für Ubuntu und Debian gibt es eine Beta-Version.",
    quelle: DOKU.desktopQuickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "desktop-ordner",
    aussage:
      "In der Desktop-App wählst du im Tab „Code“ die Umgebung „Local“ und klickst auf „Select folder“, um deinen Projektordner zu wählen.",
    wert: "Local → Select folder",
    quelle: DOKU.desktopQuickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "web-voraussetzung",
    aussage:
      "Cloud-Sitzungen auf claude.ai/code gibt es mit Pro, Max und Team sowie für Enterprise mit passenden Plätzen. Du brauchst dafür ein GitHub-Repository.",
    quelle: DOKU.webQuickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "web-mobil",
    aussage:
      "Claude Code im Web läuft im Desktop-Browser und in der Claude-App für iOS und Android.",
    wert: "claude.ai/code",
    quelle: DOKU.overview,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "web-neues-projekt",
    aussage:
      "Cloud-Sitzungen arbeiten mit bestehenden GitHub-Repositorys. Für ein neues Projekt legst du zuerst ein leeres Repository auf GitHub an.",
    quelle: DOKU.webQuickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },

  // --- Installation ---
  {
    id: "install-mac-linux",
    aussage: "Installation im Terminal auf macOS, Linux und WSL (empfohlene native Installation).",
    wert: "curl -fsSL https://claude.ai/install.sh | bash",
    quelle: DOKU.quickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "install-windows-ps",
    aussage: "Installation unter Windows in der PowerShell (empfohlene native Installation).",
    wert: "irm https://claude.ai/install.ps1 | iex",
    quelle: DOKU.quickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "install-winget",
    aussage:
      "Alternative unter Windows mit WinGet. Aktualisiert sich nicht automatisch: ab und zu `winget upgrade Anthropic.ClaudeCode` ausführen.",
    wert: "winget install Anthropic.ClaudeCode",
    quelle: DOKU.quickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "install-homebrew",
    aussage:
      "Alternative auf dem Mac mit Homebrew. Aktualisiert sich nicht automatisch: ab und zu `brew upgrade claude-code` ausführen.",
    wert: "brew install --cask claude-code",
    quelle: DOKU.quickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "windows-git",
    aussage:
      "Auf Windows ist Git for Windows empfohlen. Ohne Git for Windows nutzt Claude Code die PowerShell. WSL ist dafür nicht nötig.",
    quelle: DOKU.quickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "windows-ps-erkennen",
    aussage:
      "In der PowerShell beginnt die Eingabezeile mit „PS C:\\“, in der Eingabeaufforderung (CMD) nur mit „C:\\“.",
    wert: "PS C:\\",
    quelle: DOKU.quickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "native-updates",
    aussage: "Die native Installation aktualisiert sich automatisch im Hintergrund.",
    quelle: DOKU.quickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "install-pruefen",
    aussage:
      "So prüfst du die Installation. Es erscheint eine Versionsnummer mit „(Claude Code)“ dahinter.",
    wert: "claude --version",
    quelle: DOKU.quickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },

  // --- Start ---
  {
    id: "start",
    aussage:
      "Zum Start wechselst du im Terminal in deinen Projektordner und tippst `claude`. Beim ersten Mal wirst du zum Einloggen aufgefordert.",
    wert: "claude",
    quelle: DOKU.quickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "ordner-wechseln",
    aussage: "Mit `cd` wechselst du im Terminal in einen Ordner.",
    wert: "cd mein-projekt",
    quelle: DOKU.quickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "login-wechseln",
    aussage: "Mit /login meldest du dich neu an oder wechselst das Konto.",
    wert: "/login",
    quelle: DOKU.quickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "hilfe",
    aussage: "Mit /help siehst du alle verfügbaren Befehle.",
    wert: "/help",
    quelle: DOKU.quickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },

  // --- CLAUDE.md ---
  {
    id: "claude-md",
    aussage:
      "CLAUDE.md ist eine Textdatei in deinem Projektordner. Claude Code liest sie zu Beginn jeder Sitzung.",
    wert: "CLAUDE.md",
    quelle: DOKU.memory,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "claude-md-kurz",
    aussage:
      "Halte CLAUDE.md kurz. Frag dich bei jeder Zeile: Würde Claude ohne sie Fehler machen? Wenn nein, streichen. Ziel: unter 200 Zeilen.",
    quelle: DOKU.bestPractices,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "init",
    aussage: "Mit /init erstellt Claude eine erste CLAUDE.md passend zu deinem Projekt.",
    wert: "/init",
    quelle: DOKU.memory,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },

  // --- Plan Mode und Berechtigungen ---
  {
    id: "plan-mode",
    aussage:
      "Im Plan Mode liest Claude und plant, ändert aber nichts an deinen Dateien, bis du den Plan freigibst.",
    quelle: DOKU.permissionModes,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "plan-mode-taste",
    aussage:
      "Im Terminal drückst du Shift+Tab, bis unten „plan mode on“ steht.",
    wert: "Shift+Tab",
    quelle: DOKU.bestPractices,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "plan-mode-start",
    aussage: "Du kannst direkt im Plan Mode starten.",
    wert: "claude --permission-mode plan",
    quelle: DOKU.bestPractices,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "modi-liste",
    aussage:
      "Es gibt sechs Berechtigungsmodi: default (in der Oberfläche „Manual“: nur Lesen ohne Nachfrage), acceptEdits (Dateiänderungen ohne Nachfrage), plan (nur lesen und planen), auto (alles, mit Sicherheitsprüfung im Hintergrund), dontAsk (nur vorab erlaubte Werkzeuge) und bypassPermissions (alles ohne Nachfrage).",
    quelle: DOKU.permissionModes,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "modus-manual",
    aussage:
      "Der Modus „default“ heißt im Terminal, in den Editor-Erweiterungen und in der Desktop-App „Manual“. Claude fragt dann vor den meisten Änderungen und Befehlen.",
    wert: "Manual",
    quelle: DOKU.permissionModes,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "modus-auto-standard",
    aussage:
      "Auf Pro, Max und Team startet das Terminal standardmäßig im Modus „auto“. Dort prüft ein zweites Modell die Aktionen statt dir. Auf anderen Zugängen startet es in „Manual“.",
    quelle: DOKU.permissionModes,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "modus-wechseln",
    aussage:
      "Den Modus wechselst du im Terminal mit Shift+Tab und in der Desktop-App über die Modus-Auswahl neben dem Senden-Knopf.",
    wert: "Shift+Tab",
    quelle: DOKU.permissionModes,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "modus-bypass",
    aussage:
      "bypassPermissions ist nur für isolierte Umgebungen gedacht, etwa Container oder virtuelle Maschinen ohne Internetzugang. Er bietet keinen Schutz vor ungewollten Aktionen.",
    wert: "bypassPermissions",
    quelle: DOKU.permissionModes,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "modus-web",
    aussage:
      "Cloud-Sitzungen im Web bieten die Modi Auto, Accept edits und Plan – aber nicht Manual oder Bypass.",
    quelle: DOKU.webQuickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },

  // --- MCP ---
  {
    id: "mcp-definition",
    aussage:
      "MCP (Model Context Protocol) ist ein offener Standard, um Claude Code mit Werkzeugen und Datenquellen zu verbinden.",
    quelle: DOKU.mcp,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "mcp-add",
    aussage: "Eine Verbindung über das Internet fügst du so hinzu (Name und Adresse ersetzen).",
    wert: "claude mcp add --transport http <name> <url>",
    quelle: DOKU.mcp,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "mcp-verwalten",
    aussage: "Mit /mcp siehst, verwaltest und authentifizierst du deine Verbindungen.",
    wert: "/mcp",
    quelle: DOKU.mcp,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "mcp-vertrauen",
    aussage:
      "Verbinde nur Server, denen du vertraust. Server, die fremde Inhalte laden, können dich Prompt-Injection aussetzen (versteckten Anweisungen in fremden Inhalten).",
    quelle: DOKU.mcp,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "mcp-connectors",
    aussage:
      "Wenn du mit einem claude.ai-Konto eingeloggt bist, stehen dir Verbindungen („Connectors“), die du auf claude.ai eingerichtet hast, automatisch auch in Claude Code zur Verfügung.",
    quelle: DOKU.mcp,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "mcp-kosten",
    aussage:
      "Werkzeuge wie die GitHub-Kommandozeile `gh` sind sparsamer im Kontext als MCP-Server. Ungenutzte Server schaltest du mit /mcp ab.",
    quelle: DOKU.costs,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "mcp-notion",
    aussage: "Befehl aus der offiziellen Doku, um Notion zu verbinden.",
    wert: "claude mcp add --transport http notion https://mcp.notion.com/mcp",
    quelle: DOKU.mcp,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "mcp-sentry",
    aussage: "Befehl aus der offiziellen Doku, um Sentry zu verbinden.",
    wert: "claude mcp add --transport http sentry https://mcp.sentry.dev/mcp",
    quelle: DOKU.mcp,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "mcp-beispiele-dienste",
    aussage:
      "Mit MCP kann Claude Code zum Beispiel Dokumente in Google Drive lesen, Tickets in Jira aktualisieren oder Daten aus Slack holen.",
    quelle: DOKU.overview,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "gh-cli",
    aussage:
      "Claude Code kann die GitHub-Kommandozeile `gh` selbst bedienen, etwa für Issues und Pull Requests.",
    wert: "gh",
    quelle: DOKU.bestPractices,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "mcp-drittanbieter",
    aussage:
      "Für Context7, Playwright, Websuche-Dienste (z. B. Exa, Firecrawl), Google Drive, Slack, Jira und Linear nennt die Claude-Code-Doku keinen eigenen Installationsbefehl. Richte sie nach der Anleitung des Anbieters ein.",
    quelle: DOKU.mcp,
    geprueftAm: GEPRUEFT,
    belegt: false,
  },

  // --- Arbeiten in der Sitzung ---
  {
    id: "clear",
    aussage:
      "Mit /clear startest du einen frischen Verlauf. Nutze es zwischen Aufgaben, die nichts miteinander zu tun haben.",
    wert: "/clear",
    quelle: DOKU.bestPractices,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "esc",
    aussage:
      "Mit Esc stoppst du Claude mitten in einer Aktion. Zweimal Esc oder /rewind öffnet das Menü zum Zurückspringen.",
    wert: "Esc",
    quelle: DOKU.bestPractices,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "checkpoints",
    aussage:
      "Zurückspringen (Checkpoints) erfasst nur Änderungen über Claudes Datei-Werkzeuge. Es ersetzt kein Git.",
    quelle: DOKU.bestPractices,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "pruefen-lassen",
    aussage:
      "Gib Claude etwas, womit es seine Arbeit prüfen kann: Tests, einen Build oder einen Screenshot zum Vergleichen. Lass dir Belege zeigen statt nur „fertig“.",
    quelle: DOKU.bestPractices,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "kontext",
    aussage:
      "Das Kontextfenster enthält das ganze Gespräch, gelesene Dateien und Befehlsausgaben. Wenn es voll wird, macht Claude eher Fehler.",
    quelle: DOKU.bestPractices,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "git-gespraech",
    aussage:
      "Git-Aufgaben kannst du in normaler Sprache stellen, zum Beispiel „commit my changes with a descriptive message“.",
    quelle: DOKU.quickstart,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "skills",
    aussage:
      "Skills sind wiederverwendbare Anleitungen in `.claude/skills/<name>/SKILL.md`. Du rufst sie mit /name auf, oder Claude nutzt sie automatisch, wenn sie passen.",
    quelle: DOKU.bestPractices,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "hooks",
    aussage:
      "Hooks sind Skripte, die automatisch an festen Punkten laufen, zum Beispiel nach jeder Dateiänderung. Anders als CLAUDE.md passieren sie garantiert.",
    quelle: DOKU.bestPractices,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "subagents",
    aussage:
      "Subagents sind Helfer mit eigenem Kontextfenster. Sie erledigen Teilaufgaben und melden nur eine Zusammenfassung zurück.",
    quelle: DOKU.bestPractices,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "geplante-aufgaben",
    aussage:
      "Wiederkehrende Aufgaben kannst du planen: Routines laufen in der Cloud, geplante Aufgaben der Desktop-App auf deinem Rechner.",
    quelle: DOKU.overview,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "academy",
    aussage:
      "In der Claude Academy gibt es kostenlose Kurse zum Selbstlernen, darunter „Claude Code 101“.",
    quelle: DOKU.overview,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "kosten-abo-api",
    aussage:
      "Mit Abo (Pro, Max, Team, Enterprise) ist die Nutzung im Monatspreis enthalten, mit Nutzungsgrenzen. Mit einem Console-Konto zahlst du nach Verbrauch.",
    quelle: DOKU.costs,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
  {
    id: "kosten-usage",
    aussage: "Mit /usage siehst du deinen Verbrauch in der aktuellen Sitzung.",
    wert: "/usage",
    quelle: DOKU.costs,
    geprueftAm: GEPRUEFT,
    belegt: true,
  },
];

export function findeFakt(id: string): Fakt | undefined {
  return fakten.find((f) => f.id === id);
}
