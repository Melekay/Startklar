import type { Begriff } from "./typen";

/** Glossar. „kurz“ ist genau ein Satz und erscheint als Tooltip. */
export const glossar: Begriff[] = [
  {
    id: "terminal",
    begriff: "Terminal",
    kurz: "Ein Fenster, in das du Befehle als Text tippst, statt mit der Maus zu klicken.",
    lang: "Auf dem Mac heißt es „Terminal“, auf Windows „PowerShell“ oder „Eingabeaufforderung“. Du tippst einen Befehl und drückst Enter.",
    beispiel: "`claude --version` zeigt dir, welche Version installiert ist.",
  },
  {
    id: "projektordner",
    begriff: "Projektordner",
    kurz: "Der Ordner auf deinem Rechner, in dem Claude Code für eine Aufgabe arbeitet.",
    lang: "Claude sieht nur, was in diesem Ordner liegt. Ein eigener Ordner pro Projekt hält Ordnung und schützt deine anderen Dateien.",
  },
  {
    id: "prompt",
    begriff: "Prompt",
    kurz: "Deine Nachricht oder Anweisung an Claude.",
    lang: "Je genauer der Prompt, desto besser das Ergebnis: Was willst du, wofür, und woran erkennst du, dass es fertig ist?",
  },
  {
    id: "claude-md",
    begriff: "CLAUDE.md",
    kurz: "Eine Textdatei im Projektordner mit deinen Regeln, die Claude zu Beginn jeder Sitzung liest.",
    lang: "So musst du wichtige Dinge nicht jedes Mal wiederholen. Halte sie kurz.",
  },
  {
    id: "plan-mode",
    begriff: "Plan Mode",
    kurz: "Ein Modus, in dem Claude nur liest und einen Plan macht, aber noch nichts ändert.",
    lang: "Ideal am Anfang jeder größeren Aufgabe: Du prüfst den Plan, erst dann wird gebaut.",
  },
  {
    id: "berechtigungsmodus",
    begriff: "Berechtigungsmodus",
    kurz: "Die Einstellung, was Claude tun darf, ohne dich vorher zu fragen.",
    lang: "Von „fragt vor fast allem“ (Manual) bis „arbeitet selbstständig“ (auto). Du kannst ihn jederzeit wechseln.",
  },
  {
    id: "mcp",
    begriff: "MCP",
    kurz: "Ein offener Standard, über den Claude Code sich mit anderen Programmen und Daten verbindet.",
    lang: "MCP steht für Model Context Protocol. Eine MCP-Verbindung ist wie ein Adapter, etwa zu Notion oder GitHub.",
  },
  {
    id: "skill",
    begriff: "Skill",
    kurz: "Eine gespeicherte, wiederverwendbare Anleitung, die Claude bei Bedarf lädt.",
    lang: "Praktisch für Aufgaben, die du immer wieder gleich erledigst, zum Beispiel einen Wochenbericht.",
  },
  {
    id: "subagent",
    begriff: "Subagent",
    kurz: "Ein Helfer, den Claude für eine Teilaufgabe startet und der nur eine Zusammenfassung zurückgibt.",
    lang: "So bleibt dein Hauptgespräch übersichtlich.",
  },
  {
    id: "token",
    begriff: "Token",
    kurz: "Ein kleines Textstück (etwa ein Wortteil), in dem KI-Modelle Text zählen und abrechnen.",
    lang: "Mehr Text im Gespräch bedeutet mehr Tokens – und damit mehr Verbrauch.",
  },
  {
    id: "kontext",
    begriff: "Kontext",
    kurz: "Alles, was Claude in einer Sitzung gerade „im Kopf“ hat: Gespräch, gelesene Dateien und Ausgaben.",
    lang: "Der Kontext hat eine Obergrenze. Ist er voll, macht Claude eher Fehler. Frische Sitzungen helfen.",
  },
  {
    id: "cloud-session",
    begriff: "Cloud Session",
    kurz: "Eine Claude-Code-Sitzung, die nicht auf deinem Rechner läuft, sondern auf einem Server im Internet.",
    lang: "Du startest sie im Browser oder in der Claude-App. Sie arbeitet mit einem GitHub-Repository.",
  },
  {
    id: "hook",
    begriff: "Hook",
    kurz: "Ein kleines Skript, das automatisch an einem festen Punkt läuft, zum Beispiel nach jeder Dateiänderung.",
    lang: "Anders als eine Bitte in CLAUDE.md passiert ein Hook garantiert.",
  },
  {
    id: "git",
    begriff: "Git",
    kurz: "Ein Programm, das jede Version deiner Dateien speichert, damit du jederzeit zurückkannst.",
    lang: "Wie ein unendlicher Rückgängig-Knopf für ganze Projekte.",
  },
  {
    id: "repository",
    begriff: "Repository",
    kurz: "Ein Projektordner, dessen Versionen Git verwaltet – oft „Repo“ genannt.",
    lang: "Liegt es zusätzlich auf GitHub, hast du automatisch eine Sicherungskopie im Internet.",
  },
  {
    id: "commit",
    begriff: "Commit",
    kurz: "Ein gespeicherter Zwischenstand deines Projekts mit einer kurzen Beschreibung.",
    lang: "Wie ein Speicherpunkt im Spiel: Du kannst später genau dorthin zurück.",
  },
  {
    id: "branch",
    begriff: "Branch",
    kurz: "Eine Nebenlinie deines Projekts, in der du Änderungen ausprobierst, ohne das Original anzufassen.",
    lang: "Passt alles, führst du den Branch zurück in die Hauptlinie.",
  },
  {
    id: "github",
    begriff: "GitHub",
    kurz: "Ein Online-Dienst, der Git-Repositorys speichert und teilt.",
    lang: "Für Einsteiger vor allem eine sichere Ablage mit allen Versionen deiner Arbeit.",
  },
  {
    id: "diff",
    begriff: "Diff",
    kurz: "Eine Gegenüberstellung, die zeigt, welche Zeilen hinzugekommen oder weggefallen sind.",
  },
  {
    id: "dummy-daten",
    begriff: "Dummy-Daten",
    kurz: "Erfundene Beispieldaten, die echt aussehen, aber niemandem gehören.",
    lang: "Perfekt zum Üben, weil nichts Vertrauliches nach außen geht.",
  },
  {
    id: "prompt-injection",
    begriff: "Prompt-Injection",
    kurz: "Versteckte Anweisungen in fremden Inhalten, die eine KI zu ungewollten Aktionen verleiten sollen.",
    lang: "Deshalb nur vertrauenswürdige Verbindungen nutzen und Ergebnisse prüfen.",
  },
  {
    id: "csv",
    begriff: "CSV",
    kurz: "Eine einfache Tabellendatei, in der Werte durch Kommas oder Semikolons getrennt sind.",
    lang: "Excel, Numbers und Google Sheets können CSV öffnen und speichern.",
  },
];

export function findeBegriff(id: string): Begriff | undefined {
  return glossar.find((b) => b.id === id);
}
