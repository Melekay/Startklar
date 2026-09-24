import { beispiele as alleBeispiele } from "@/content/beispiele";
import { DOKU } from "@/content/fakten";
import { mcps as alleMcps } from "@/content/mcps";
import { schritte as alleSchritte } from "@/content/schritte";
import type {
  AlltagsTool,
  Antworten,
  Beispiel,
  BeispielEmpfehlung,
  Bereich,
  Einstieg,
  Hinweis,
  Mcp,
  McpEmpfehlung,
  ModusEmpfehlung,
  Plan,
  SchrittImPlan,
  Voraussetzung,
  Ziel,
} from "@/content/typen";
import { bereinigeText, labelFuer, MAX_TEXT, vervollstaendige } from "./antworten";

/**
 * Empfehlungslogik: reine Funktionen ohne Seiteneffekte.
 * Eingabe: Antworten (auch unvollständig). Ausgabe: ein Plan.
 * Texte dürfen {{fakt:…}} und [[begriff]] enthalten – die Oberfläche löst sie auf.
 */

export const ERFAHRUNG_RANG = { keine: 0, etwas: 1, gut: 2 } as const;
export const SCHWIERIGKEIT_RANG = { leicht: 0, mittel: 1, fortgeschritten: 2 } as const;
export const ZEIT_MIN = { "10min": 10, "1h": 60, abend: 180, wochenende: 960 } as const;
export const MAX_MCPS_JETZT = 3;
export const SCHNELLSTART_MIN = 15;

const ABO_MIT_AUTO = new Set(["pro", "max", "team"]);
const ABO_UNKLAR = new Set(["keins", "gratis", "unbekannt"]);

// ---------- Einstieg ----------

export function bestimmeEinstieg(a: Antworten): Einstieg {
  if (a.os === "mobil") {
    return {
      weg: "web",
      titel: "Claude Code im Web",
      begruendung:
        "Auf Handy oder Tablet kannst du nichts installieren. Claude Code läuft dort im Browser oder in der Claude-App. Dafür brauchst du ein GitHub-Konto, weil Cloud-Sitzungen mit einem GitHub-Repository arbeiten.",
      spaeter: "Sobald du an einem Computer sitzt, probier die Desktop-App aus.",
    };
  }
  if (a.abo === "api") {
    return {
      weg: "terminal",
      titel: "Claude Code im Terminal",
      begruendung:
        "Mit einem Console-Konto nutzt du Claude Code im Terminal, weil Desktop-App und Web ein Abo voraussetzen. Keine Sorge: Wir erklären jeden Befehl.",
    };
  }
  const anfaenger = (a.terminal ?? "nie") === "nie" || (a.code ?? "keine") === "keine";
  const linuxHinweis = a.os === "linux" ? " Auf Linux ist die Desktop-App noch eine Beta für Ubuntu und Debian." : "";
  if (anfaenger) {
    return {
      weg: "desktop",
      titel: "Desktop-App (Tab „Code“)",
      begruendung: `Du musst kein Terminal lernen: Die Desktop-App hat Claude Code eingebaut, weil sie alles per Klick bedienbar macht.${linuxHinweis}`,
      spaeter: "Das Terminal kannst du später ausprobieren – dort gibt es alle Funktionen.",
    };
  }
  if (a.terminal === "sicher" || (a.terminal === "schonmal" && a.code === "gut")) {
    return {
      weg: "terminal",
      titel: "Claude Code im Terminal",
      begruendung: "Du kennst dich im Terminal aus. Dort hat Claude Code den vollen Funktionsumfang.",
      spaeter: "Die Desktop-App ist praktisch, um Änderungen visuell zu prüfen.",
    };
  }
  return {
    weg: "desktop",
    titel: "Desktop-App (Tab „Code“)",
    begruendung: `Die Desktop-App ist der bequemste Start, weil du Änderungen dort visuell prüfen kannst.${linuxHinweis}`,
    spaeter: "Wenn du dich sicherer fühlst, wechsle ins Terminal.",
  };
}

// ---------- Voraussetzungen ----------

export function bestimmeVoraussetzungen(a: Antworten, einstieg: Einstieg): Voraussetzung[] {
  const liste: Voraussetzung[] = [];
  const abo = a.abo ?? "unbekannt";

  if (ABO_UNKLAR.has(abo)) {
    const zusatz =
      einstieg.weg === "terminal"
        ? " Im Terminal geht auch ein Console-Konto, bei dem du nach Verbrauch zahlst."
        : " Für die Desktop-App und das Web ist ein bezahltes Abo nötig.";
    liste.push({
      id: "zugang",
      titel: "Zugang klären",
      text: `Ehrlich gesagt: Die meisten Zugänge zu Claude Code brauchen ein Claude-Abo oder ein Console-Konto.${zusatz} Prüfe die aktuellen Bedingungen in der offiziellen Doku, bevor du etwas abschließt.`,
      optional: false,
      link: { href: DOKU.overview, label: "Offizielle Doku öffnen" },
    });
  } else if (einstieg.weg === "web" && abo === "api") {
    liste.push({
      id: "zugang",
      titel: "Zugang klären",
      text: "Cloud-Sitzungen im Web gibt es mit Pro, Max, Team und Enterprise – nicht mit einem Console-Konto. Prüfe die Bedingungen in der offiziellen Doku.",
      optional: false,
      link: { href: DOKU.webQuickstart, label: "Offizielle Doku öffnen" },
    });
  }

  if (einstieg.weg === "web") {
    liste.push({
      id: "github-web",
      titel: a.github === "ja" ? "Leeres Repository auf GitHub anlegen" : "GitHub-Konto und Repository anlegen",
      text:
        a.github === "ja"
          ? "Cloud-Sitzungen arbeiten mit einem GitHub-Repository. Leg für dein erstes Projekt ein neues, privates Repository an."
          : "Cloud-Sitzungen arbeiten mit einem GitHub-Repository, weil dort deine Arbeit gespeichert wird. Leg ein kostenloses Konto und ein privates Repository an.",
      optional: false,
      link: { href: DOKU.githubNeu, label: "GitHub öffnen" },
    });
  } else if (a.github !== "ja" && (a.ziel ?? []).includes("bauen")) {
    liste.push({
      id: "github",
      titel: "GitHub-Konto anlegen (als Sicherungskopie deiner Arbeit)",
      text: "Optional, aber hilfreich: Auf [[github|GitHub]] liegt eine Kopie deines Projekts mit allen Versionen. Geht auf deinem Rechner etwas schief, ist nichts verloren.",
      optional: true,
      link: { href: DOKU.githubNeu, label: "GitHub öffnen" },
    });
  }

  if (a.os === "windows" && einstieg.weg === "terminal") {
    liste.push({
      id: "git-windows",
      titel: "Git for Windows installieren (empfohlen)",
      text: "Empfohlen, damit Claude Code unter Windows alle Werkzeuge nutzen kann. Ohne Git for Windows nutzt es die PowerShell. WSL brauchst du nicht.",
      optional: true,
      link: { href: DOKU.gitForWindows, label: "Git for Windows" },
    });
  }

  if (a.rechner === "firma" || a.rechner === "beides") {
    liste.push({
      id: "it-fragen",
      titel: "Frag vorher deine IT",
      text: "Auf Firmenrechnern darfst du oft nicht selbst installieren oder Firmendaten mit KI-Diensten teilen. Klär vorher, ob und womit du Claude Code nutzen darfst.",
      optional: false,
    });
  }

  return liste;
}

// ---------- Berechtigungsmodus ----------

const PLAN_TIPP_TERMINAL =
  "Starte jede größere Aufgabe im [[plan-mode|Plan Mode]]: Claude plant zuerst und ändert erst nach deiner Freigabe. Im Terminal: `{{fakt:plan-mode-taste}}`, bis „plan mode on“ erscheint.";
const PLAN_TIPP_KLICK =
  "Starte jede größere Aufgabe im [[plan-mode|Plan Mode]]: Claude plant zuerst und ändert erst nach deiner Freigabe. Wähle dazu „Plan“ in der Modus-Auswahl neben dem Eingabefeld.";

const BYPASS_WARNUNG =
  "Nutze `bypassPermissions` nie auf deinem normalen Rechner: Dieser Modus ist nur für abgeschottete Umgebungen wie Container oder virtuelle Maschinen gedacht und schützt dich vor nichts.";

export function bestimmeModus(a: Antworten, einstieg: Einstieg): ModusEmpfehlung {
  const planModeTipp = einstieg.weg === "terminal" ? PLAN_TIPP_TERMINAL : PLAN_TIPP_KLICK;
  const kontrolle = a.kontrolle ?? "jeder";
  const sensibel = (a.sensibel ?? "nein") !== "nein";
  const abo = a.abo ?? "unbekannt";

  const manuell = (erklaerung: string, warnung?: string): ModusEmpfehlung => {
    if (einstieg.weg === "web") {
      return {
        modus: "plan",
        label: "Plan",
        erklaerung: `${erklaerung} Im Web gibt es den Modus „Manual“ nicht. „Plan“ kommt ihm am nächsten: Claude schlägt vor und wartet auf deine Freigabe, bevor es Dateien ändert.`,
        warnung,
        planModeTipp,
      };
    }
    const autoStart =
      einstieg.weg === "terminal" && ABO_MIT_AUTO.has(abo)
        ? " Achtung: Auf Pro, Max und Team startet das Terminal im Modus „auto“. Wechsle mit `{{fakt:modus-wechseln}}` zu „Manual“."
        : "";
    return {
      modus: "default",
      label: "Manual",
      erklaerung: `${erklaerung}${autoStart}`,
      warnung,
      planModeTipp,
    };
  };

  if (sensibel) {
    return manuell(
      "Weil du mit sensiblen Daten arbeitest: Claude fragt vor Änderungen und Befehlen. So siehst du alles, bevor es passiert.",
      kontrolle === "selbst"
        ? "Du wolltest möglichst selbstständig arbeiten. Bei sensiblen Daten empfehlen wir trotzdem erst einmal den vorsichtigen Modus."
        : undefined,
    );
  }

  if (kontrolle === "jeder") {
    return manuell("Du willst jeden Schritt bestätigen: Claude fragt vor Änderungen und Befehlen. Ideal zum Lernen, weil du alles mitverfolgst.");
  }

  if (kontrolle === "ausgewogen") {
    return {
      modus: "acceptEdits",
      label: "Accept edits (Änderungen automatisch akzeptieren)",
      erklaerung:
        "Claude darf Dateien in deinem Projektordner ändern, ohne zu fragen. Bei anderen Befehlen fragt es weiterhin. Du prüfst die Änderungen danach.",
      planModeTipp,
    };
  }

  // kontrolle === "selbst"
  if (ABO_MIT_AUTO.has(abo) || abo === "unbekannt") {
    return {
      modus: "auto",
      label: "Auto",
      erklaerung:
        "Claude arbeitet selbstständig. Ein zweites Modell prüft im Hintergrund jede Aktion und blockiert, was riskant aussieht. Du wirst kaum unterbrochen, solltest Ergebnisse aber trotzdem prüfen." +
        (abo === "unbekannt" ? " Ob „Auto“ für deinen Zugang verfügbar ist, bitte in der offiziellen Doku prüfen." : ""),
      warnung: BYPASS_WARNUNG,
      planModeTipp,
    };
  }
  return {
    modus: "acceptEdits",
    label: "Accept edits (Änderungen automatisch akzeptieren)",
    erklaerung:
      "Claude ändert Dateien ohne Nachfrage und fragt nur bei anderen Befehlen. Den Modus „Auto“ gibt es laut Doku als Standard nur bei Pro, Max und Team – bitte in der offiziellen Doku prüfen, ob er für dich verfügbar ist.",
    warnung: BYPASS_WARNUNG,
    planModeTipp,
  };
}

// ---------- MCP-Verbindungen ----------

function mcpGrund(m: Mcp, a: Antworten, treffer: { tools: string[]; ziele: string[] }): string {
  const teile: string[] = [];
  if (treffer.tools.length) teile.push(`du nutzt ${treffer.tools.map((t) => labelFuer("tools", t)).join(", ")}`);
  if (treffer.ziele.length) teile.push(`dein Ziel „${labelFuer("ziel", treffer.ziele[0])}“`);
  if (m.brauchtGithub && a.github !== "ja") teile.push("braucht ein GitHub-Konto");
  return teile.length ? `Passt, weil ${teile.join(" und ")}.` : m.wozu;
}

export function bestimmeMcps(a: Antworten): Plan["mcps"] {
  const tools: AlltagsTool[] = (a.tools ?? []).filter((t) => t !== "keine");
  const ziele: Ziel[] = (a.ziel ?? []).filter((z) => z !== "unklar");
  const rang = ERFAHRUNG_RANG[a.code ?? "keine"];
  const sensibel = (a.sensibel ?? "nein") !== "nein";

  const bewertet = alleMcps
    .map((m, index) => {
      const treffer = {
        tools: m.passtZuTools.filter((t) => tools.includes(t)),
        ziele: m.passtZuZielen.filter((z) => ziele.includes(z)),
      };
      return { m, index, treffer, score: 3 * treffer.tools.length + 2 * treffer.ziele.length };
    })
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score || x.index - y.index);

  const alsEmpfehlung = (x: (typeof bewertet)[number]): McpEmpfehlung => ({
    mcpId: x.m.id,
    grund: mcpGrund(x.m, a, x.treffer),
  });

  const anfaenger = rang === 0;
  const technisch = ziele.includes("bauen") || ziele.includes("programmieren");
  if (anfaenger && !technisch) {
    return {
      jetzt: [],
      spaeter: bewertet.map(alsEmpfehlung),
      begruendung:
        "In deiner ersten Woche brauchst du keine Verbindung. Lerne zuerst die Grundlagen, weil jede Verbindung einem weiteren Programm Zugriff gibt und [[kontext|Kontext]] kostet.",
    };
  }

  const kommunikation = new Set(["slack", "kalender-mail"]);
  const geeignet = (x: (typeof bewertet)[number]) =>
    rang >= ERFAHRUNG_RANG[x.m.abErfahrung] &&
    (!x.m.brauchtGithub || a.github === "ja") &&
    !(sensibel && kommunikation.has(x.m.id));

  const jetzt = bewertet.filter(geeignet).slice(0, MAX_MCPS_JETZT);
  const jetztIds = new Set(jetzt.map((x) => x.m.id));
  const spaeter = bewertet.filter((x) => !jetztIds.has(x.m.id));

  return {
    jetzt: jetzt.map(alsEmpfehlung),
    spaeter: spaeter.map(alsEmpfehlung),
    begruendung: jetzt.length
      ? "Wenige, dafür passende Verbindungen – weil jede Verbindung [[kontext|Kontext]] kostet. Richte zuerst nur die erste ein."
      : "Für deine Ziele brauchst du gerade keine Verbindung. Das spart Kontext und hält es einfach.",
  };
}

// ---------- Beispiele ----------

function istSchnellstart(b: Beispiel): boolean {
  return b.schwierigkeit === "leicht" && b.dauerMin < SCHNELLSTART_MIN;
}

export function bestimmeBeispiele(a: Antworten, mcpsJetzt: McpEmpfehlung[] = []): BeispielEmpfehlung[] {
  const rang = ERFAHRUNG_RANG[a.code ?? "keine"];
  const zeit = ZEIT_MIN[a.zeit ?? "1h"];
  let ziele: Ziel[] = (a.ziel ?? []).filter((z) => z !== "unklar");
  if (ziele.length === 0) ziele = ["lernen"];
  const bereich: Bereich | undefined = a.bereich;

  const kandidaten = alleBeispiele
    .map((b, index) => ({ b, index }))
    .filter(({ b }) => !(a.sensibel === "ja" && b.sensibel))
    .filter(({ b }) => !(b.brauchtMcp && mcpsJetzt.length === 0))
    .filter(({ b }) => !(b.brauchtGithub && a.github !== "ja"));

  const score = (b: Beispiel) =>
    (bereich && b.tags.includes(bereich) ? 1 : 0) + 2 * ziele.filter((z) => b.tags.includes(z)).length;

  const sortiert = [...kandidaten].sort(
    (x, y) => score(y.b) - score(x.b) || x.b.dauerMin - y.b.dauerMin || x.index - y.index,
  );

  const passtSchwierigkeit = (b: Beispiel) => SCHWIERIGKEIT_RANG[b.schwierigkeit] <= rang;
  const passtZeit = (b: Beispiel) => b.dauerMin <= zeit;

  const auswahl: Beispiel[] = [];
  const nimm = (liste: typeof sortiert) => {
    for (const { b } of liste) {
      if (auswahl.length >= 3) return;
      if (!auswahl.includes(b)) auswahl.push(b);
    }
  };
  nimm(sortiert.filter(({ b }) => passtSchwierigkeit(b) && passtZeit(b)));
  nimm(sortiert.filter(({ b }) => passtSchwierigkeit(b)));
  nimm(sortiert);

  // Immer mindestens ein leichtes Beispiel unter 15 Minuten.
  if (!auswahl.some(istSchnellstart)) {
    const schnell = sortiert.find(({ b }) => istSchnellstart(b));
    if (schnell) auswahl.splice(Math.max(auswahl.length - 1, 0), 1, schnell.b);
  }

  return auswahl.map((b) => ({
    beispielId: b.id,
    grund: beispielGrund(b, a, ziele),
    mitDummyDaten: b.sensibel,
  }));
}

function beispielGrund(b: Beispiel, a: Antworten, ziele: Ziel[]): string {
  const teile: string[] = [];
  const zielTreffer = ziele.find((z) => b.tags.includes(z));
  if (zielTreffer && zielTreffer !== "lernen") teile.push(`passt zu „${labelFuer("ziel", zielTreffer)}“`);
  if (a.bereich && a.bereich !== "sonstiges" && b.tags.includes(a.bereich)) {
    teile.push(`typisch für ${labelFuer("bereich", a.bereich)}`);
  }
  const start = teile.length ? `${teile.join(", ")}. `.replace(/^./, (c) => c.toUpperCase()) : "";
  const dauer = istSchnellstart(b) ? `Schneller Erfolg: in unter ${SCHNELLSTART_MIN} Minuten fertig.` : `Dauer: etwa ${b.dauerMin} Minuten.`;
  return `${start}${dauer}`;
}

// ---------- Erster Prompt ----------

const BERUF: Record<Bereich, string | null> = {
  buero: "im Büro und in der Verwaltung tätig",
  it: "in der IT tätig",
  marketing: "in Marketing und Vertrieb tätig",
  selbststaendig: "selbstständig",
  studium: "im Studium bzw. in der Ausbildung",
  kreativ: "im Kreativ- und Medienbereich tätig",
  gesundheit: "im Gesundheitswesen tätig",
  sonstiges: null,
};

const ZIEL_TEXT: Record<Ziel, string> = {
  bauen: "eine kleine, einfache Website bauen",
  buero: "bei einer wiederkehrenden Büroaufgabe Zeit sparen",
  ordnen: "einen unordentlichen Ordner mit Dateien sortieren",
  schreiben: "aus meinen Notizen eine kurze Zusammenfassung schreiben",
  programmieren: "in meinem Projekt schneller programmieren",
  lernen: "Claude Code an einer kleinen Übungsaufgabe ausprobieren",
  unklar: "Claude Code an einer kleinen Übungsaufgabe ausprobieren",
};

const ERFAHRUNG_TEXT = {
  keine: "Anfänger ohne Programmiererfahrung",
  etwas: "Anfänger mit etwas Programmiererfahrung",
  gut: "erfahren im Programmieren, aber neu bei Claude Code",
} as const;

export function erstelleErstenPrompt(a: Antworten): string {
  const erfahrung = ERFAHRUNG_TEXT[a.code ?? "keine"];
  const beruf = a.bereich ? BERUF[a.bereich] : null;
  const wer = beruf ? `Ich bin ${beruf} und ${erfahrung}.` : `Ich bin ${erfahrung}.`;

  const idee = a.idee ? bereinigeText(a.idee, MAX_TEXT.idee).replace(/[.!?…]+$/, "") : "";
  const ziel = idee ? `Ich möchte Folgendes umsetzen: ${idee}.` : `Ich möchte ${ZIEL_TEXT[(a.ziel ?? [])[0] ?? "lernen"]}.`;

  const sensibel =
    (a.sensibel ?? "nein") !== "nein" ? " Nutze bitte nur erfundene Beispieldaten, keine echten Kunden- oder Personendaten." : "";

  return `${wer} ${ziel}${sensibel} Stell mir zuerst bis zu 5 Fragen, mache dann einen Plan und ändere noch nichts, bevor ich zustimme.`;
}

// ---------- Hinweise ----------

export function bestimmeHinweise(a: Antworten, einstieg: Einstieg): Hinweis[] {
  const liste: Hinweis[] = [];

  if ((a.sensibel ?? "nein") !== "nein") {
    const it = a.rechner && a.rechner !== "privat" ? " Frag vorher deine IT, ob und womit du Claude Code nutzen darfst." : "";
    liste.push({
      id: "sensibel",
      art: "achtung",
      titel: "Sensible Daten: sicher üben",
      text: `Übe zuerst mit erfundenen Beispieldaten ([[dummy-daten|Dummy-Daten]]). Füge nie Passwörter, Kunden- oder Patientendaten in den Chat ein und beachte die Regeln deiner Firma.${it}`,
    });
  }

  if (a.haeufigkeit === "wiederkehrend" || a.haeufigkeit === "beides") {
    liste.push({
      id: "wiederkehrend",
      art: "tipp",
      titel: "Für Aufgaben, die immer wiederkommen",
      text: "Speichere bewährte Anleitungen als [[skill|Skill]], dann musst du sie nicht jedes Mal neu schreiben. Später kannst du wiederkehrende Aufgaben sogar planen lassen: als Routine in der Cloud oder als geplante Aufgabe in der Desktop-App.",
    });
  }

  if (a.kosten === "sehr" || a.kosten === "etwas") {
    const api = a.abo === "api" ? " Mit einem Console-Konto zahlst du nach Verbrauch: Setz dir in der Console ein Ausgabenlimit." : "";
    liste.push({
      id: "kosten",
      art: "info",
      titel: "Kosten im Griff",
      text: `Mit Abo ist die Nutzung im Monatspreis enthalten (mit Nutzungsgrenzen). Spar-Tipps: \`{{fakt:clear}}\` zwischen Aufgaben, eine kurze CLAUDE.md, wenige Verbindungen und genaue Prompts. Deinen Verbrauch zeigt \`{{fakt:kosten-usage}}\`.${api}`,
    });
  }

  if (a.ki === "claudecode") {
    liste.push({
      id: "erfahren",
      art: "tipp",
      titel: "Du kennst Claude Code schon",
      text: "Installation und Login kannst du überspringen. Konzentrier dich auf Plan Mode, CLAUDE.md und das Prüfen von Ergebnissen.",
    });
  }

  if (a.github === "unbekannt") {
    liste.push({
      id: "github-erklaert",
      art: "info",
      titel: "Was ist GitHub?",
      text: "[[github|GitHub]] ist ein Online-Speicher für Projekte mit allen Versionen – wie ein Sicherungsordner mit Zeitmaschine. Am Anfang brauchst du es nur für Claude Code im Web.",
    });
  }

  if ((a.ziel ?? []).includes("unklar")) {
    liste.push({
      id: "ziel-unklar",
      art: "tipp",
      titel: "Noch kein Ziel? Kein Problem.",
      text: "Starte mit dem kürzesten Beispiel in deinem Plan. Beim Ausprobieren kommen die Ideen meist von selbst.",
    });
  }

  if (a.os === "windows" && einstieg.weg === "terminal") {
    liste.push({
      id: "windows-blogs",
      art: "info",
      titel: "Achtung bei alten Anleitungen",
      text: "Manche Blogs behaupten, Windows brauche zwingend WSL oder Node.js. Laut aktueller offizieller Doku stimmt das nicht mehr. Folge den Befehlen in deinem Plan.",
    });
  }

  return liste;
}

// ---------- Schritte ----------

export function bestimmeSchritte(
  a: Antworten,
  voraussetzungen: Voraussetzung[],
  mcps: Plan["mcps"],
): SchrittImPlan[] {
  const brauchtZugang = voraussetzungen.some((v) => v.id === "zugang");
  const erfahren = a.ki === "claudecode";
  return alleSchritte
    .filter((s) => (s.id === "zugang" ? brauchtZugang : true))
    .filter((s) => (s.id === "mcp" ? mcps.jetzt.length > 0 : true))
    .map((s) => {
      if (erfahren && (s.id === "installieren" || s.id === "erster-start")) {
        return { schrittId: s.id, optional: true, optionalGrund: "Hast du vermutlich schon erledigt." };
      }
      return { schrittId: s.id, optional: false };
    });
}

// ---------- Gesamtplan ----------

export function erstellePlan(eingabe: Antworten): Plan {
  const a = vervollstaendige(eingabe);
  const einstieg = bestimmeEinstieg(a);
  const voraussetzungen = bestimmeVoraussetzungen(a, einstieg);
  const mcps = bestimmeMcps(a);
  const name = a.name ? bereinigeText(a.name, MAX_TEXT.name) : "";
  return {
    anrede: name ? `Hallo ${name}!` : "Hallo!",
    einstieg,
    voraussetzungen,
    beispiele: bestimmeBeispiele(a, mcps.jetzt),
    mcps,
    modus: bestimmeModus(a, einstieg),
    hinweise: bestimmeHinweise(a, einstieg),
    ersterPrompt: erstelleErstenPrompt(a),
    schritte: bestimmeSchritte(a, voraussetzungen, mcps),
    lernstil: a.lernstil ?? "klein",
  };
}
