import { describe, expect, it } from "vitest";
import { findeBeispiel } from "@/content/beispiele";
import { findeMcp } from "@/content/mcps";
import type { Antworten } from "@/content/typen";
import {
  bestimmeBeispiele,
  bestimmeEinstieg,
  bestimmeHinweise,
  bestimmeMcps,
  bestimmeModus,
  bestimmeSchritte,
  bestimmeVoraussetzungen,
  erstelleErstenPrompt,
  erstellePlan,
  MAX_MCPS_JETZT,
  SCHWIERIGKEIT_RANG,
  ZEIT_MIN,
} from "@/lib/empfehlung";

/** Eine typische, vollständige Einsteigerin als Ausgangspunkt. */
const basis: Antworten = {
  bereich: "buero",
  code: "keine",
  terminal: "nie",
  ziel: ["buero"],
  os: "windows",
  abo: "pro",
  github: "nein",
  sensibel: "nein",
  kontrolle: "jeder",
};

const mit = (extra: Partial<Antworten>): Antworten => ({ ...basis, ...extra });
const DESKTOP = bestimmeEinstieg(basis);
const TERMINAL = bestimmeEinstieg(mit({ code: "gut", terminal: "sicher" }));
const WEB = bestimmeEinstieg(mit({ os: "mobil" }));

// ---------------------------------------------------------------------------
describe("Regel: Einstieg", () => {
  it("Terminal noch nie benutzt → Desktop-App, Terminal später", () => {
    const e = bestimmeEinstieg(mit({ terminal: "nie", code: "gut" }));
    expect(e.weg).toBe("desktop");
    expect(e.spaeter).toMatch(/Terminal/);
  });

  it("Keine Programmiererfahrung → Desktop-App, auch wenn Terminal sicher", () => {
    expect(bestimmeEinstieg(mit({ terminal: "sicher", code: "keine" })).weg).toBe("desktop");
  });

  it("Nur Handy/Tablet → Web, mit Hinweis auf GitHub", () => {
    const e = bestimmeEinstieg(mit({ os: "mobil", terminal: "sicher", code: "gut" }));
    expect(e.weg).toBe("web");
    expect(e.begruendung).toMatch(/GitHub/);
  });

  it("Terminal sicher und Erfahrung → Terminal", () => {
    expect(bestimmeEinstieg(mit({ terminal: "sicher", code: "etwas" })).weg).toBe("terminal");
  });

  it("Terminal schon mal + gute Erfahrung → Terminal; + etwas Erfahrung → Desktop", () => {
    expect(bestimmeEinstieg(mit({ terminal: "schonmal", code: "gut" })).weg).toBe("terminal");
    expect(bestimmeEinstieg(mit({ terminal: "schonmal", code: "etwas" })).weg).toBe("desktop");
  });

  it("Console-/API-Konto → Terminal, weil Desktop und Web ein Abo brauchen", () => {
    const e = bestimmeEinstieg(mit({ abo: "api", terminal: "nie", code: "keine" }));
    expect(e.weg).toBe("terminal");
    expect(e.begruendung).toMatch(/Abo/);
  });

  it("Linux + Desktop erwähnt die Beta", () => {
    expect(bestimmeEinstieg(mit({ os: "linux" })).begruendung).toMatch(/Beta/);
  });
});

// ---------------------------------------------------------------------------
describe("Regel: Voraussetzungen", () => {
  it.each(["keins", "gratis", "unbekannt"] as const)("abo = %s → „Zugang klären“ ganz oben mit Doku-Link", (abo) => {
    const v = bestimmeVoraussetzungen(mit({ abo }), DESKTOP);
    expect(v[0].id).toBe("zugang");
    expect(v[0].optional).toBe(false);
    expect(v[0].text).toMatch(/Abo oder ein Console-Konto/);
    expect(v[0].link?.href).toMatch(/^https:\/\/code\.claude\.com\/docs/);
  });

  it("Zugang klären kommt ohne Verkaufsdruck und ohne Affiliate-Links", () => {
    const v = bestimmeVoraussetzungen(mit({ abo: "gratis" }), DESKTOP)[0];
    expect(v.text).not.toMatch(/jetzt kaufen|sofort|Rabatt|ref=|affiliate/i);
    expect(v.link?.href).not.toMatch(/[?&](ref|aff|utm_)/);
  });

  it.each(["pro", "max", "team", "api"] as const)("abo = %s → kein Schritt „Zugang klären“ (Desktop/Terminal)", (abo) => {
    expect(bestimmeVoraussetzungen(mit({ abo }), abo === "api" ? TERMINAL : DESKTOP).map((v) => v.id)).not.toContain("zugang");
  });

  it("Web mit Console-Konto → Zugang klären, weil Web ein Abo braucht", () => {
    const v = bestimmeVoraussetzungen(mit({ abo: "api", os: "mobil" }), WEB);
    expect(v.find((x) => x.id === "zugang")?.text).toMatch(/nicht mit einem Console-Konto/);
  });

  it("GitHub ≠ ja und Ziel „bauen“ → optionaler Schritt GitHub als Sicherungskopie", () => {
    for (const github of ["nein", "unbekannt"] as const) {
      const v = bestimmeVoraussetzungen(mit({ github, ziel: ["bauen"] }), DESKTOP).find((x) => x.id === "github");
      expect(v?.optional).toBe(true);
      expect(v?.titel).toMatch(/Sicherungskopie/);
    }
  });

  it("GitHub = ja oder Ziel ohne „bauen“ → kein GitHub-Schritt", () => {
    expect(bestimmeVoraussetzungen(mit({ github: "ja", ziel: ["bauen"] }), DESKTOP).some((x) => x.id === "github")).toBe(false);
    expect(bestimmeVoraussetzungen(mit({ github: "nein", ziel: ["ordnen"] }), DESKTOP).some((x) => x.id === "github")).toBe(false);
  });

  it("Web → GitHub ist Pflicht (nicht optional)", () => {
    const v = bestimmeVoraussetzungen(mit({ os: "mobil", github: "nein" }), WEB).find((x) => x.id === "github-web");
    expect(v?.optional).toBe(false);
  });

  it("Windows + Terminal → Git for Windows empfohlen (optional)", () => {
    const v = bestimmeVoraussetzungen(mit({ code: "gut", terminal: "sicher" }), TERMINAL).find((x) => x.id === "git-windows");
    expect(v?.optional).toBe(true);
    expect(v?.text).toMatch(/WSL brauchst du nicht/);
  });

  it("Firmenrechner → „Frag vorher deine IT“", () => {
    expect(bestimmeVoraussetzungen(mit({ rechner: "firma" }), DESKTOP).some((x) => x.id === "it-fragen")).toBe(true);
    expect(bestimmeVoraussetzungen(mit({ rechner: "beides" }), DESKTOP).some((x) => x.id === "it-fragen")).toBe(true);
    expect(bestimmeVoraussetzungen(mit({ rechner: "privat" }), DESKTOP).some((x) => x.id === "it-fragen")).toBe(false);
  });
});

// ---------------------------------------------------------------------------
describe("Regel: Sensible Daten", () => {
  it.each(["manchmal", "ja"] as const)("sensibel = %s → gelbe Hinweisbox mit Dummy-Daten", (sensibel) => {
    const h = bestimmeHinweise(mit({ sensibel }), DESKTOP).find((x) => x.id === "sensibel");
    expect(h?.art).toBe("achtung");
    expect(h?.text).toMatch(/erfundenen Beispieldaten/);
  });

  it("sensibel + Firmenrechner → Hinweis „Frag vorher deine IT“ in der Box", () => {
    const h = bestimmeHinweise(mit({ sensibel: "ja", rechner: "firma" }), DESKTOP).find((x) => x.id === "sensibel");
    expect(h?.text).toMatch(/Frag vorher deine IT/);
  });

  it("sensibel = nein → keine Box", () => {
    expect(bestimmeHinweise(basis, DESKTOP).some((x) => x.id === "sensibel")).toBe(false);
  });

  it("sensibel → Manual-Modus empfohlen", () => {
    expect(bestimmeModus(mit({ sensibel: "manchmal", kontrolle: "ausgewogen" }), DESKTOP).modus).toBe("default");
  });

  it("sensibel = ja → sensible Beispiele werden ausgeblendet", () => {
    const b = bestimmeBeispiele(mit({ sensibel: "ja", ziel: ["ordnen"], bereich: "selbststaendig", zeit: "wochenende", code: "gut" }));
    expect(b.every((x) => !findeBeispiel(x.beispielId)!.sensibel)).toBe(true);
  });

  it("sensibel = manchmal → sensible Beispiele erscheinen nur mit Dummy-Daten", () => {
    const b = bestimmeBeispiele(mit({ sensibel: "manchmal", ziel: ["ordnen"], bereich: "selbststaendig", zeit: "wochenende", code: "gut" }));
    const sensible = b.filter((x) => findeBeispiel(x.beispielId)!.sensibel);
    expect(sensible.length).toBeGreaterThan(0);
    expect(sensible.every((x) => x.mitDummyDaten)).toBe(true);
  });

  it("erster Prompt bittet bei sensiblen Daten um erfundene Beispieldaten", () => {
    expect(erstelleErstenPrompt(mit({ sensibel: "ja" }))).toMatch(/erfundene Beispieldaten/);
    expect(erstelleErstenPrompt(basis)).not.toMatch(/erfundene Beispieldaten/);
  });
});

// ---------------------------------------------------------------------------
describe("Regel: Berechtigungsmodus", () => {
  it("jeden Schritt bestätigen → Manual (default)", () => {
    const m = bestimmeModus(mit({ kontrolle: "jeder" }), DESKTOP);
    expect(m.modus).toBe("default");
    expect(m.label).toBe("Manual");
  });

  it("ausgewogen → acceptEdits", () => {
    expect(bestimmeModus(mit({ kontrolle: "ausgewogen" }), DESKTOP).modus).toBe("acceptEdits");
  });

  it("selbstständig mit Pro/Max/Team → auto, mit Warnung zu bypassPermissions", () => {
    for (const abo of ["pro", "max", "team"] as const) {
      const m = bestimmeModus(mit({ kontrolle: "selbst", abo }), DESKTOP);
      expect(m.modus).toBe("auto");
      expect(m.warnung).toMatch(/bypassPermissions/);
      expect(m.warnung).toMatch(/abgeschottete Umgebungen/);
    }
  });

  it("selbstständig ohne passendes Abo → acceptEdits mit Prüfhinweis, nie bypassPermissions", () => {
    const m = bestimmeModus(mit({ kontrolle: "selbst", abo: "api" }), TERMINAL);
    expect(m.modus).toBe("acceptEdits");
    expect(m.erklaerung).toMatch(/bitte in der offiziellen Doku prüfen/);
    expect(m.modus).not.toBe("bypassPermissions" as never);
  });

  it("Plan Mode wird immer für größere Aufgaben empfohlen", () => {
    for (const kontrolle of ["jeder", "ausgewogen", "selbst"] as const) {
      for (const e of [DESKTOP, TERMINAL, WEB]) {
        expect(bestimmeModus(mit({ kontrolle }), e).planModeTipp).toMatch(/Plan Mode/);
      }
    }
  });

  it("Plan-Mode-Tipp im Terminal nennt die Taste über den Fakt", () => {
    expect(bestimmeModus(basis, TERMINAL).planModeTipp).toContain("{{fakt:plan-mode-taste}}");
  });

  it("Web kennt kein Manual → Plan statt Manual", () => {
    const m = bestimmeModus(mit({ kontrolle: "jeder", os: "mobil" }), WEB);
    expect(m.modus).toBe("plan");
    expect(m.erklaerung).toMatch(/Im Web gibt es den Modus „Manual“ nicht/);
  });

  it("Manual im Terminal mit Pro → Hinweis, dass auto voreingestellt ist", () => {
    expect(bestimmeModus(mit({ abo: "pro" }), TERMINAL).erklaerung).toMatch(/startet das Terminal im Modus „auto“/);
    expect(bestimmeModus(mit({ abo: "pro" }), DESKTOP).erklaerung).not.toMatch(/startet das Terminal/);
  });
});

// ---------------------------------------------------------------------------
describe("Regel: MCP-Verbindungen", () => {
  it("Anfänger ohne Bau-/Programmier-Ziel → kein MCP in Woche 1, mit Begründung", () => {
    const m = bestimmeMcps(mit({ code: "keine", ziel: ["buero"], tools: ["notion", "google"] }));
    expect(m.jetzt).toEqual([]);
    expect(m.begruendung).toMatch(/ersten Woche/);
    expect(m.spaeter.map((x) => x.mcpId)).toEqual(expect.arrayContaining(["notion", "google-drive"]));
  });

  it("Anfänger mit Ziel „bauen“ bekommt passende Verbindungen für Einsteiger", () => {
    const m = bestimmeMcps(mit({ code: "keine", ziel: ["bauen"], tools: ["notion"] }));
    expect(m.jetzt.map((x) => x.mcpId)).toEqual(["notion"]);
  });

  it("passend zu Tools und Zielen, höchstens 3 jetzt, Rest später", () => {
    const m = bestimmeMcps(mit({ code: "gut", ziel: ["programmieren", "bauen"], tools: ["notion", "jiralinear", "datenbank"], github: "ja" }));
    expect(m.jetzt.length).toBe(MAX_MCPS_JETZT);
    expect(m.spaeter.length).toBeGreaterThan(0);
    const alle = [...m.jetzt, ...m.spaeter].map((x) => x.mcpId);
    expect(new Set(alle).size).toBe(alle.length);
  });

  it("Tools zählen stärker als Ziele", () => {
    const m = bestimmeMcps(mit({ code: "etwas", ziel: ["programmieren"], tools: ["jiralinear"], github: "ja" }));
    expect(m.jetzt[0].mcpId).toBe("jira-linear");
  });

  it("GitHub-Verbindung nur jetzt, wenn ein GitHub-Konto vorhanden ist", () => {
    const ohne = bestimmeMcps(mit({ code: "gut", ziel: ["programmieren"], github: "nein" }));
    expect(ohne.jetzt.map((x) => x.mcpId)).not.toContain("github");
    expect(ohne.spaeter.map((x) => x.mcpId)).toContain("github");
  });

  it("Verbindungen über der eigenen Erfahrung landen unter „Später“", () => {
    const m = bestimmeMcps(mit({ code: "etwas", ziel: ["programmieren"], github: "ja" }));
    const sentry = findeMcp("sentry")!;
    expect(sentry.abErfahrung).toBe("gut");
    expect(m.jetzt.map((x) => x.mcpId)).not.toContain("sentry");
  });

  it("sensible Daten → Slack und Kalender & Mail nur später", () => {
    const m = bestimmeMcps(mit({ code: "etwas", ziel: ["buero", "bauen"], tools: ["slack", "kalendermail"], sensibel: "ja" }));
    expect(m.jetzt.map((x) => x.mcpId)).not.toContain("slack");
    expect(m.spaeter.map((x) => x.mcpId)).toEqual(expect.arrayContaining(["slack", "kalender-mail"]));
  });

  it("jede Empfehlung hat einen Grund", () => {
    const m = bestimmeMcps(mit({ code: "gut", ziel: ["bauen"], tools: ["notion"] }));
    for (const x of [...m.jetzt, ...m.spaeter]) expect(x.grund.length).toBeGreaterThan(5);
  });
});

// ---------------------------------------------------------------------------
describe("Regel: Beispiele", () => {
  const leichtUnter15 = (ids: string[]) =>
    ids.some((id) => {
      const b = findeBeispiel(id)!;
      return b.schwierigkeit === "leicht" && b.dauerMin < 15;
    });

  it("liefert genau 3 Beispiele ohne Duplikate", () => {
    const b = bestimmeBeispiele(basis);
    expect(b).toHaveLength(3);
    expect(new Set(b.map((x) => x.beispielId)).size).toBe(3);
  });

  it("bewertet nach Überschneidung mit Ziel und Bereich", () => {
    const b = bestimmeBeispiele(mit({ code: "gut", ziel: ["programmieren"], bereich: "it", zeit: "wochenende", github: "ja" }));
    for (const x of b) expect(findeBeispiel(x.beispielId)!.tags).toContain("programmieren");
  });

  it("filtert nach Schwierigkeit ≤ Erfahrung", () => {
    const b = bestimmeBeispiele(mit({ code: "keine", zeit: "wochenende", ziel: ["bauen"] }));
    for (const x of b) expect(SCHWIERIGKEIT_RANG[findeBeispiel(x.beispielId)!.schwierigkeit]).toBe(0);
  });

  it("filtert nach Dauer ≤ verfügbarer Zeit, wenn genug passende da sind", () => {
    const b = bestimmeBeispiele(mit({ code: "gut", zeit: "1h", ziel: ["bauen"] }));
    for (const x of b) expect(findeBeispiel(x.beispielId)!.dauerMin).toBeLessThanOrEqual(ZEIT_MIN["1h"]);
  });

  it("enthält immer mindestens ein leichtes Beispiel unter 15 Minuten", () => {
    const faelle: Antworten[] = [
      basis,
      mit({ code: "gut", ziel: ["programmieren"], zeit: "wochenende", bereich: "it" }),
      mit({ code: "gut", ziel: ["bauen"], zeit: "wochenende", bereich: "kreativ" }),
      mit({ code: "etwas", ziel: ["schreiben"], zeit: "abend", sensibel: "ja" }),
      {},
    ];
    for (const a of faelle) expect(leichtUnter15(bestimmeBeispiele(a).map((x) => x.beispielId))).toBe(true);
  });

  it("zeigt keine Beispiele, die GitHub brauchen, ohne GitHub-Konto", () => {
    const b = bestimmeBeispiele(mit({ code: "gut", ziel: ["programmieren"], zeit: "wochenende", github: "nein" }));
    expect(b.map((x) => x.beispielId)).not.toContain("code-review");
    const mitGh = bestimmeBeispiele(mit({ code: "gut", ziel: ["programmieren"], zeit: "wochenende", github: "ja" }));
    expect(mitGh.map((x) => x.beispielId)).toContain("code-review");
  });

  it("bei sehr wenig Zeit wird aufgefüllt statt leer zu bleiben", () => {
    expect(bestimmeBeispiele(mit({ zeit: "10min", ziel: ["bauen"] }))).toHaveLength(3);
  });
});

// ---------------------------------------------------------------------------
describe("Regel: Erster Prompt", () => {
  const ENDE = "Stell mir zuerst bis zu 5 Fragen, mache dann einen Plan und ändere noch nichts, bevor ich zustimme.";

  it("folgt der Vorlage mit Beruf, Erfahrung, Ziel und Plan-Mode-Gewohnheit", () => {
    const p = erstelleErstenPrompt(mit({ bereich: "buero", code: "keine", ziel: ["ordnen"] }));
    expect(p).toBe(
      `Ich bin im Büro und in der Verwaltung tätig und Anfänger ohne Programmiererfahrung. Ich möchte einen unordentlichen Ordner mit Dateien sortieren. ${ENDE}`,
    );
  });

  it("baut die eigene Idee ein und entfernt Satzzeichen am Ende", () => {
    const p = erstelleErstenPrompt(mit({ idee: "  Eine Website für meinen Yoga-Kurs!!  " }));
    expect(p).toContain("Ich möchte Folgendes umsetzen: Eine Website für meinen Yoga-Kurs.");
    expect(p.endsWith(ENDE)).toBe(true);
  });

  it("passt die Erfahrung an", () => {
    expect(erstelleErstenPrompt(mit({ code: "gut" }))).toMatch(/erfahren im Programmieren, aber neu bei Claude Code/);
  });

  it("ohne Bereich kein Berufsteil", () => {
    expect(erstelleErstenPrompt({ code: "etwas" })).toMatch(/^Ich bin Anfänger mit etwas Programmiererfahrung\./);
  });

  it("kürzt sehr lange Ideen", () => {
    expect(erstelleErstenPrompt(mit({ idee: "x".repeat(1000) })).length).toBeLessThan(600);
  });
});

// ---------------------------------------------------------------------------
describe("Hinweise und Schritte", () => {
  it("wiederkehrende Aufgaben → Hinweis auf Skills und geplante Aufgaben", () => {
    const h = bestimmeHinweise(mit({ haeufigkeit: "wiederkehrend" }), DESKTOP).find((x) => x.id === "wiederkehrend");
    expect(h?.text).toMatch(/\[\[skill/);
  });

  it("Kostenkontrolle → Spar-Tipps; mit Console zusätzlich Ausgabenlimit", () => {
    expect(bestimmeHinweise(mit({ kosten: "sehr" }), DESKTOP).some((x) => x.id === "kosten")).toBe(true);
    expect(bestimmeHinweise(mit({ kosten: "egal" }), DESKTOP).some((x) => x.id === "kosten")).toBe(false);
    expect(bestimmeHinweise(mit({ kosten: "sehr", abo: "api" }), TERMINAL).find((x) => x.id === "kosten")?.text).toMatch(/Ausgabenlimit/);
  });

  it("Windows + Terminal warnt vor überholten Blog-Anleitungen (WSL/Node.js)", () => {
    expect(bestimmeHinweise(mit({ code: "gut", terminal: "sicher" }), TERMINAL).some((x) => x.id === "windows-blogs")).toBe(true);
  });

  it("Schritt „Zugang klären“ nur, wenn der Zugang offen ist", () => {
    const mcps = bestimmeMcps(basis);
    const offen = bestimmeSchritte(basis, bestimmeVoraussetzungen(mit({ abo: "gratis" }), DESKTOP), mcps);
    const klar = bestimmeSchritte(basis, bestimmeVoraussetzungen(basis, DESKTOP), mcps);
    expect(offen[0].schrittId).toBe("zugang");
    expect(klar.map((s) => s.schrittId)).not.toContain("zugang");
  });

  it("Schritt „Erste MCP-Verbindung“ nur, wenn eine Verbindung empfohlen ist", () => {
    const ohne = bestimmeSchritte(basis, [], { jetzt: [], spaeter: [], begruendung: "" });
    const mitMcp = bestimmeSchritte(basis, [], { jetzt: [{ mcpId: "notion", grund: "" }], spaeter: [], begruendung: "" });
    expect(ohne.map((s) => s.schrittId)).not.toContain("mcp");
    expect(mitMcp.map((s) => s.schrittId)).toContain("mcp");
  });

  it("Claude Code schon probiert → Installation und Start überspringbar", () => {
    const s = bestimmeSchritte(mit({ ki: "claudecode" }), [], { jetzt: [], spaeter: [], begruendung: "" });
    expect(s.find((x) => x.schrittId === "installieren")?.optional).toBe(true);
    expect(s.find((x) => x.schrittId === "plan-mode")?.optional).toBe(false);
  });
});

// ---------------------------------------------------------------------------
describe("Randfälle", () => {
  it("alles übersprungen ({}): vollständiger, sicherer Plan ohne Absturz", () => {
    const p = erstellePlan({});
    expect(p.anrede).toBe("Hallo!");
    expect(p.einstieg.weg).toBe("desktop");
    expect(p.voraussetzungen[0].id).toBe("zugang");
    expect(p.beispiele).toHaveLength(3);
    expect(p.mcps.jetzt).toEqual([]);
    expect(p.modus.modus).toBe("default");
    expect(p.ersterPrompt).toMatch(/ändere noch nichts/);
    expect(p.schritte.length).toBeGreaterThanOrEqual(10);
    expect(p.lernstil).toBe("klein");
  });

  it("widersprüchlich: Terminal sicher, aber keine Programmiererfahrung → Desktop", () => {
    expect(erstellePlan(mit({ terminal: "sicher", code: "keine" })).einstieg.weg).toBe("desktop");
  });

  it("widersprüchlich: sensible Daten + möglichst selbstständig → vorsichtiger Modus mit Warnung", () => {
    const m = erstellePlan(mit({ sensibel: "ja", kontrolle: "selbst" })).modus;
    expect(m.modus).toBe("default");
    expect(m.warnung).toMatch(/sensiblen Daten/);
  });

  it("widersprüchlich: Handy + Terminal sicher + API-Konto → Web mit Zugangs-Hinweis", () => {
    const p = erstellePlan(mit({ os: "mobil", terminal: "sicher", code: "gut", abo: "api" }));
    expect(p.einstieg.weg).toBe("web");
    expect(p.voraussetzungen.map((v) => v.id)).toEqual(expect.arrayContaining(["zugang", "github-web"]));
  });

  it("„Weiß ich noch nicht“ als Ziel → Lern-Beispiele und Tipp", () => {
    const p = erstellePlan(mit({ ziel: ["unklar"] }));
    expect(p.hinweise.some((h) => h.id === "ziel-unklar")).toBe(true);
    expect(p.beispiele).toHaveLength(3);
  });

  it("Name wird bereinigt und gekürzt", () => {
    expect(erstellePlan({ name: "   Alex   " }).anrede).toBe("Hallo Alex!");
    expect(erstellePlan({ name: "A".repeat(100) }).anrede.length).toBeLessThanOrEqual(48);
  });

  it("ist rein: gleiche Eingabe → gleiches Ergebnis, Eingabe bleibt unverändert", () => {
    const eingabe = mit({ tools: ["notion"], ziel: ["bauen"] });
    const kopie = JSON.parse(JSON.stringify(eingabe));
    expect(erstellePlan(eingabe)).toEqual(erstellePlan(eingabe));
    expect(eingabe).toEqual(kopie);
  });
});
