import type { Schritt } from "./typen";

/**
 * Die Schritt-für-Schritt-Anleitung. Jede Variante gilt für bestimmte
 * Einstiegswege (desktop/terminal/web) und/oder Systeme. Die erste
 * passende Variante wird angezeigt.
 */
export const schritte: Schritt[] = [
  {
    id: "zugang",
    titel: "Zugang klären",
    ziel: "Du weißt, mit welchem Konto du Claude Code nutzen kannst.",
    warum:
      "Um Claude Code zu nutzen, brauchst du einen passenden Zugang, weil die meisten Wege ein Abo oder ein Console-Konto voraussetzen.",
    diagramm: [
      { icon: "user", label: "Du" },
      { icon: "key", label: "Abo oder Console" },
      { icon: "terminal", label: "Claude Code" },
    ],
    varianten: [
      {
        anleitung: [
          "Öffne die Preisseite von Claude und vergleiche in Ruhe die Angebote.",
          "Möglich sind ein Abo (Pro, Max, Team, Enterprise) oder ein Console-Konto mit Guthaben, bei dem du nach Verbrauch zahlst.",
          "Für die Desktop-App und das Web brauchst du ein bezahltes Abo. Ein Console-Konto funktioniert im Terminal.",
          "Unsicher? Dann warte mit dem Kauf. Du kannst diese Anleitung trotzdem schon lesen.",
        ],
      },
    ],
    fertigWenn: "Du kannst dich auf claude.ai mit einem Konto anmelden, das Claude Code enthält – oder du hast bewusst entschieden, noch zu warten.",
    haeufigeFehler: [
      "Mit dem Gratis-Konto im Tab „Code“ landen und eine Upgrade-Meldung sehen – das ist normal.",
      "Abo und Console-Konto verwechseln: Das Abo zahlst du monatlich, die Console nach Verbrauch.",
    ],
    quellenFaktIds: ["zugang-allgemein", "zugang-kontotypen", "desktop-abo", "kosten-abo-api"],
    icon: "key",
  },
  {
    id: "installieren",
    titel: "Installieren",
    ziel: "Claude Code ist auf deinem Gerät bereit.",
    warum:
      "Um mit deinen eigenen Dateien zu arbeiten, muss Claude Code auf deinem Rechner laufen, weil es dort Ordner lesen und Dateien schreiben soll.",
    diagramm: [
      { icon: "download", label: "Herunterladen" },
      { icon: "package", label: "Installieren" },
      { icon: "check", label: "Bereit" },
    ],
    varianten: [
      {
        wege: ["desktop"],
        anleitung: [
          "Lade die Claude-Desktop-App für dein System herunter und installiere sie wie jedes andere Programm.",
          "Die App enthält Claude Code bereits – du musst nichts zusätzlich installieren.",
          "Auf Linux gibt es die App bisher als Beta für Ubuntu und Debian.",
        ],
      },
      {
        wege: ["web"],
        anleitung: [
          "Du musst nichts installieren. Claude Code läuft im Browser oder in der Claude-App auf deinem Handy.",
          "Öffne `claude.ai/code` und melde dich an.",
          "Verbinde dein GitHub-Konto, wenn du dazu aufgefordert wirst. Für ein neues Projekt legst du vorher ein leeres [[repository|Repository]] auf GitHub an.",
        ],
      },
      {
        wege: ["terminal"],
        systeme: ["windows"],
        anleitung: [
          "Öffne die PowerShell: Startmenü → „PowerShell“ tippen → Enter.",
          "Prüfe, dass die Zeile mit `{{fakt:windows-ps-erkennen}}` beginnt. Dann bist du richtig.",
          "Kopiere den Befehl unten, füge ihn ein und drücke Enter.",
          "Empfohlen: Installiere zusätzlich Git for Windows. WSL brauchst du nicht.",
          "Prüfe danach mit `{{fakt:install-pruefen}}`, ob alles geklappt hat.",
        ],
        befehlFaktIds: ["install-windows-ps", "install-winget"],
      },
      {
        wege: ["terminal"],
        anleitung: [
          "Öffne das [[terminal|Terminal]]. Auf dem Mac: Spotlight (Cmd+Leertaste) → „Terminal“ → Enter.",
          "Kopiere den Befehl unten, füge ihn ein und drücke Enter.",
          "Prüfe danach mit `{{fakt:install-pruefen}}`, ob alles geklappt hat.",
        ],
        befehlFaktIds: ["install-mac-linux", "install-homebrew"],
      },
    ],
    fertigWenn: "Die App startet – oder das Terminal zeigt eine Versionsnummer mit „(Claude Code)“.",
    haeufigeFehler: [
      "Auf Windows den Befehl in der Eingabeaufforderung (CMD) statt in der PowerShell einfügen.",
      "Das Terminal nach der Installation nicht neu öffnen – dann kennt es den Befehl `claude` noch nicht.",
      "Blogs folgen, die Node.js oder WSL als Pflicht nennen. Laut offizieller Doku ist das überholt.",
    ],
    quellenFaktIds: ["desktop-abo", "desktop-systeme", "install-mac-linux", "install-windows-ps", "windows-git", "install-pruefen", "web-mobil"],
    icon: "download",
  },
  {
    id: "erster-start",
    titel: "Erster Start und Login",
    ziel: "Du bist angemeldet und siehst das Eingabefeld von Claude Code.",
    warum: "Um Aufgaben zu stellen, musst du angemeldet sein, weil Claude Code über dein Konto abgerechnet wird.",
    diagramm: [
      { icon: "play", label: "Starten" },
      { icon: "log-in", label: "Anmelden" },
      { icon: "message", label: "Eingabefeld" },
    ],
    varianten: [
      {
        wege: ["desktop"],
        anleitung: [
          "Starte die Claude-App und melde dich mit deinem Konto an.",
          "Klicke oben in der Mitte auf den Tab „Code“.",
          "Siehst du eine Upgrade-Meldung, fehlt ein bezahltes Abo (siehe Schritt „Zugang klären“).",
        ],
      },
      {
        wege: ["web"],
        anleitung: [
          "Öffne `claude.ai/code` und melde dich an.",
          "Folge der Aufforderung, GitHub zu verbinden, und bestätige die Freigabe auf GitHub.",
          "Wähle dein Repository über die Auswahl unter dem Eingabefeld.",
        ],
      },
      {
        wege: ["terminal"],
        anleitung: [
          "Tippe `{{fakt:start}}` und drücke Enter.",
          "Beim ersten Mal öffnet sich der Browser zum Anmelden. Folge den Schritten.",
          "Später kannst du mit `{{fakt:login-wechseln}}` das Konto wechseln.",
        ],
      },
    ],
    fertigWenn: "Du siehst ein Eingabefeld, in das du eine Nachricht an Claude tippen kannst.",
    haeufigeFehler: [
      "Mit einem anderen Konto angemeldet sein als dem, das dein Abo hat.",
      "Den Browser-Tab zum Anmelden schließen, bevor die Anmeldung fertig ist.",
    ],
    quellenFaktIds: ["start", "login-wechseln", "desktop-abo", "web-voraussetzung"],
    icon: "log-in",
  },
  {
    id: "projektordner",
    titel: "Projektordner anlegen",
    ziel: "Du hast einen eigenen, leeren Ordner für dein erstes Projekt.",
    warum:
      "Um sicher zu üben, brauchst du einen eigenen Ordner, weil Claude immer in einem Ordner arbeitet und alles darin sehen und ändern kann.",
    diagramm: [
      { icon: "folder-plus", label: "Neuer Ordner" },
      { icon: "terminal", label: "Claude öffnen" },
      { icon: "shield", label: "Rest bleibt sicher" },
    ],
    varianten: [
      {
        wege: ["desktop"],
        anleitung: [
          "Lege in deinem Dokumente-Ordner einen neuen Ordner an, z. B. „claude-uebung“.",
          "Wähle im Tab „Code“ die Umgebung „Local“ und klicke auf „Select folder“.",
          "Wähle deinen neuen Ordner aus.",
        ],
      },
      {
        wege: ["web"],
        anleitung: [
          "Im Web ist dein [[repository|Repository]] auf GitHub der Projektordner.",
          "Lege auf GitHub ein neues, leeres Repository an, z. B. „claude-uebung“.",
          "Wähle es in `claude.ai/code` über die Repository-Auswahl aus.",
        ],
      },
      {
        wege: ["terminal"],
        anleitung: [
          "Lege einen neuen Ordner an, z. B. „claude-uebung“ in deinen Dokumenten.",
          "Wechsle im Terminal hinein, z. B. mit `{{fakt:ordner-wechseln}}`.",
          "Starte dort `claude`. Claude arbeitet jetzt nur in diesem Ordner.",
        ],
      },
    ],
    fertigWenn: "Claude Code ist in deinem neuen Übungsordner geöffnet.",
    haeufigeFehler: [
      "Claude im Benutzer- oder Desktop-Ordner starten. Dann sieht es viel zu viele Dateien.",
      "Echte, wichtige Dateien zum Üben benutzen. Nimm lieber Kopien.",
    ],
    quellenFaktIds: ["start", "ordner-wechseln", "desktop-ordner", "web-neues-projekt"],
    icon: "folder",
  },
  {
    id: "plan-mode",
    titel: "Plan Mode kennenlernen",
    ziel: "Du kannst den Plan Mode ein- und ausschalten.",
    warum:
      "Um Überraschungen zu vermeiden, startest du größere Aufgaben im Plan Mode, weil Claude dort nur liest und plant, aber nichts ändert.",
    diagramm: [
      { icon: "search", label: "Lesen" },
      { icon: "list", label: "Plan" },
      { icon: "check", label: "Du gibst frei" },
      { icon: "hammer", label: "Dann bauen" },
    ],
    varianten: [
      {
        wege: ["terminal"],
        anleitung: [
          "Drücke `{{fakt:plan-mode-taste}}` so oft, bis unten „plan mode on“ steht.",
          "Alternativ startest du direkt so: `{{fakt:plan-mode-start}}`.",
          "Zum Verlassen drückst du erneut Shift+Tab oder gibst den Plan frei.",
        ],
      },
      {
        anleitung: [
          "Klicke auf die Modus-Auswahl neben dem Senden-Knopf.",
          "Wähle „Plan“.",
          "Claude schlägt jetzt nur einen Weg vor und wartet auf deine Freigabe.",
        ],
      },
    ],
    fertigWenn: "Du siehst, dass der Plan Mode aktiv ist, und weißt, wie du ihn wieder verlässt.",
    haeufigeFehler: [
      "Kleinste Aufgaben planen lassen. Für einen Tippfehler brauchst du keinen Plan.",
      "Den Plan freigeben, ohne ihn gelesen zu haben.",
    ],
    quellenFaktIds: ["plan-mode", "plan-mode-taste", "plan-mode-start", "modus-wechseln"],
    icon: "list",
  },
  {
    id: "erste-aufgabe",
    titel: "Erste Aufgabe mit deinem Prompt",
    ziel: "Claude hat dir Fragen gestellt und einen Plan für deine Idee gemacht.",
    warum:
      "Um ein passendes Ergebnis zu bekommen, lässt du Claude zuerst fragen, weil es sonst Annahmen trifft, die nicht zu dir passen.",
    diagramm: [
      { icon: "copy", label: "Prompt kopieren" },
      { icon: "help", label: "Fragen beantworten" },
      { icon: "list", label: "Plan prüfen" },
    ],
    varianten: [
      {
        anleitung: [
          "Kopiere deinen persönlichen [[prompt|Prompt]] aus deinem Plan (Knopf „Kopieren“).",
          "Füge ihn in Claude Code ein und sende ihn ab.",
          "Beantworte Claudes Fragen in eigenen Worten. „Weiß ich nicht, schlag was vor“ ist auch eine gute Antwort.",
          "Lies den Plan. Passt er, gib ihn frei.",
        ],
      },
    ],
    fertigWenn: "Du hast einen Plan von Claude gelesen und freigegeben – oder um Änderungen gebeten.",
    haeufigeFehler: [
      "Zu viel auf einmal verlangen. Starte klein und baue dann aus.",
      "Echte Kunden- oder Passwortdaten in den Prompt schreiben.",
    ],
    quellenFaktIds: ["plan-mode"],
    icon: "message",
  },
  {
    id: "pruefen",
    titel: "Ergebnis prüfen und verbessern",
    ziel: "Du hast selbst gesehen, dass das Ergebnis funktioniert.",
    warum:
      "Um dich auf das Ergebnis verlassen zu können, lässt du es dir zeigen, weil „fertig“ noch nicht „funktioniert“ bedeutet.",
    diagramm: [
      { icon: "eye", label: "Zeig es mir" },
      { icon: "check-circle", label: "Prüfen" },
      { icon: "repeat", label: "Verbessern" },
    ],
    varianten: [
      {
        anleitung: [
          "Schreib: „Zeig mir, dass es funktioniert.“ Claude soll einen Test, eine Prüfung oder einen Screenshot liefern.",
          "Öffne das Ergebnis selbst: die Datei, die Seite oder die Tabelle.",
          "Beschreibe Abweichungen konkret: „Der Knopf ist zu klein“ statt „Gefällt mir nicht“.",
          "Läuft etwas schief, stoppst du Claude mit `{{fakt:esc}}`.",
        ],
      },
    ],
    fertigWenn: "Du hast das Ergebnis mit eigenen Augen geprüft und es erfüllt deine „Fertig, wenn …“-Aussage.",
    haeufigeFehler: [
      "Claude einfach glauben, dass es fertig ist.",
      "Nach dem zweiten erfolglosen Korrekturversuch weitermachen. Besser: `/clear` und mit einem genaueren Prompt neu starten.",
    ],
    quellenFaktIds: ["pruefen-lassen", "esc", "clear"],
    icon: "check-circle",
  },
  {
    id: "claude-md",
    titel: "CLAUDE.md anlegen",
    ziel: "Dein Projekt hat eine kurze CLAUDE.md mit deinen wichtigsten Regeln.",
    warum:
      "Um Regeln nicht ständig zu wiederholen, schreibst du sie in eine [[claude-md|CLAUDE.md]], weil Claude sie bei jedem Start liest.",
    diagramm: [
      { icon: "file", label: "CLAUDE.md" },
      { icon: "play", label: "Jeder Start" },
      { icon: "brain", label: "Claude kennt deine Regeln" },
    ],
    varianten: [
      {
        wege: ["terminal"],
        anleitung: [
          "Tippe `{{fakt:init}}`. Claude erstellt eine erste Version passend zu deinem Projekt.",
          "Lies sie durch und streiche alles, was Claude auch ohne diese Zeile richtig machen würde.",
          "Ergänze 2–3 eigene Regeln, z. B. „Antworte auf Deutsch“ oder „Lösche nie Dateien ohne Nachfrage“.",
        ],
      },
      {
        anleitung: [
          "Schreib: „Erstelle eine kurze CLAUDE.md für dieses Projekt.“",
          "Lies sie durch und streiche alles, was Claude auch ohne diese Zeile richtig machen würde.",
          "Ergänze 2–3 eigene Regeln, z. B. „Antworte auf Deutsch“ oder „Lösche nie Dateien ohne Nachfrage“.",
        ],
      },
    ],
    fertigWenn: "Die Datei CLAUDE.md liegt in deinem Projektordner und hat weniger als 30 Zeilen.",
    haeufigeFehler: [
      "Eine riesige CLAUDE.md schreiben. Dann gehen die wichtigen Regeln unter.",
      "Passwörter oder Zugangsdaten hineinschreiben.",
    ],
    quellenFaktIds: ["claude-md", "claude-md-kurz", "init"],
    icon: "file",
  },
  {
    id: "sichern",
    titel: "Arbeit sichern",
    ziel: "Du hast einen gespeicherten Zwischenstand, zu dem du zurückkannst.",
    warum:
      "Um Fehler rückgängig machen zu können, speicherst du Zwischenstände mit [[git|Git]], weil Claudes eigenes Zurückspringen nicht alles erfasst.",
    diagramm: [
      { icon: "save", label: "Commit" },
      { icon: "cloud", label: "GitHub (optional)" },
      { icon: "undo", label: "Jederzeit zurück" },
    ],
    varianten: [
      {
        wege: ["web"],
        anleitung: [
          "Im Web sichert Claude automatisch: Es legt einen [[branch|Branch]] auf GitHub an.",
          "Prüfe die Änderungen in der Ansicht mit den geänderten Zeilen ([[diff|Diff]]).",
          "Bist du zufrieden, klickst du auf „Create PR“, um sie zu übernehmen.",
        ],
      },
      {
        anleitung: [
          "Schreib: „Richte Git in diesem Ordner ein und speichere den aktuellen Stand mit einer kurzen Beschreibung.“",
          "Claude erklärt dir, was es tut. Das Ergebnis ist ein [[commit|Commit]] – ein Speicherpunkt.",
          "Optional: „Lade das Projekt in ein neues privates Repository auf GitHub hoch.“ So hast du eine Kopie im Internet.",
          "Vor jeder größeren Änderung: noch einmal speichern lassen.",
        ],
      },
    ],
    fertigWenn: "Claude zeigt dir mindestens einen Commit mit deiner Beschreibung.",
    haeufigeFehler: [
      "Erst sichern, wenn schon etwas kaputt ist.",
      "Ein GitHub-Repository versehentlich öffentlich statt privat anlegen.",
    ],
    quellenFaktIds: ["checkpoints", "git-gespraech", "gh-cli"],
    icon: "save",
  },
  {
    id: "berechtigungen",
    titel: "Berechtigungen bewusst wählen",
    ziel: "Du weißt, in welchem Modus du arbeitest und warum.",
    warum:
      "Um das richtige Maß an Kontrolle zu haben, wählst du den [[berechtigungsmodus|Berechtigungsmodus]] bewusst, weil er festlegt, was Claude ohne Nachfrage darf.",
    diagramm: [
      { icon: "hand", label: "Manual" },
      { icon: "pen", label: "Accept edits" },
      { icon: "list", label: "Plan" },
      { icon: "zap", label: "Auto" },
    ],
    varianten: [
      {
        wege: ["terminal"],
        anleitung: [
          "Schau unten in der Statuszeile nach, welcher Modus aktiv ist.",
          "Mit `{{fakt:modus-wechseln}}` wechselst du zwischen den Modi.",
          "Nimm den Modus, den dein Plan empfiehlt. Wechsle jederzeit, wenn es sich falsch anfühlt.",
        ],
      },
      {
        wege: ["web"],
        anleitung: [
          "Öffne die Modus-Auswahl neben dem Eingabefeld.",
          "Im Web gibt es Auto, Accept edits und Plan – aber kein Manual.",
          "Für den Anfang empfehlen wir Plan: Claude schlägt vor, du gibst frei.",
        ],
      },
      {
        anleitung: [
          "Öffne die Modus-Auswahl neben dem Senden-Knopf.",
          "Wähle den Modus, den dein Plan empfiehlt.",
          "Wechsle jederzeit, wenn es sich falsch anfühlt.",
        ],
      },
    ],
    fertigWenn: "Du kannst in einem Satz sagen, was Claude in deinem Modus ohne Nachfrage darf.",
    haeufigeFehler: [
      "Aus Bequemlichkeit alles erlauben. `bypassPermissions` ist nur für abgeschottete Umgebungen gedacht.",
      "Nachfragen ungelesen bestätigen. Dann ist der Manual-Modus nutzlos.",
    ],
    quellenFaktIds: ["modi-liste", "modus-manual", "modus-auto-standard", "modus-wechseln", "modus-bypass", "modus-web"],
    icon: "shield",
  },
  {
    id: "mcp",
    titel: "Erste MCP-Verbindung",
    ziel: "Claude kann auf eines deiner Alltags-Programme zugreifen.",
    warum:
      "Um Daten aus anderen Programmen zu nutzen, brauchst du eine [[mcp|MCP]]-Verbindung, weil Claude sonst nur deinen Projektordner sieht.",
    diagramm: [
      { icon: "terminal", label: "Claude Code" },
      { icon: "plug", label: "MCP" },
      { icon: "notebook", label: "Dein Programm" },
    ],
    varianten: [
      {
        anleitung: [
          "Nimm nur die erste Verbindung aus deinem Plan – eine reicht für den Anfang.",
          "Folge dem Installationshinweis auf der Karte. Das allgemeine Muster lautet: `{{fakt:mcp-add}}`.",
          "Prüfe mit `{{fakt:mcp-verwalten}}`, ob die Verbindung steht, und melde dich dort an.",
          "Gib Passwörter oder Tokens nur dort ein, wo das Programm danach fragt – nie in den Chat.",
        ],
      },
    ],
    fertigWenn: "`/mcp` zeigt deine Verbindung als verbunden und Claude kann eine einfache Frage dazu beantworten.",
    haeufigeFehler: [
      "Viele Verbindungen auf einmal einrichten. Jede kostet Kontext.",
      "Verbindungen von unbekannten Anbietern installieren.",
    ],
    quellenFaktIds: ["mcp-definition", "mcp-add", "mcp-verwalten", "mcp-vertrauen", "mcp-kosten"],
    icon: "plug",
  },
  {
    id: "weiter",
    titel: "Wie geht es weiter?",
    ziel: "Du hast einen Plan für deine nächsten Schritte.",
    warum:
      "Um dranzubleiben, brauchst du ein nächstes kleines Ziel, weil Übung mehr bringt als Theorie.",
    diagramm: [
      { icon: "graduation", label: "Kurs" },
      { icon: "repeat", label: "Wiederholen" },
      { icon: "rocket", label: "Größeres Projekt" },
    ],
    varianten: [
      {
        anleitung: [
          "Mach den kostenlosen Kurs „Claude Code 101“ in der Claude Academy.",
          "Wiederkehrende Aufgaben speicherst du als [[skill|Skill]] oder lässt sie planen.",
          "Nimm dir das nächste Beispiel aus deinem Plan vor.",
          "Zwischen verschiedenen Aufgaben: `{{fakt:clear}}` für einen frischen Kontext.",
        ],
      },
    ],
    fertigWenn: "Du hast dir ein nächstes Beispiel oder den Kurs für diese Woche vorgenommen.",
    haeufigeFehler: ["Alles an einem Tag schaffen wollen. Kleine, regelmäßige Schritte gewinnen."],
    quellenFaktIds: ["academy", "skills", "geplante-aufgaben", "clear"],
    icon: "rocket",
  },
];

export function findeSchritt(id: string): Schritt | undefined {
  return schritte.find((s) => s.id === id);
}
