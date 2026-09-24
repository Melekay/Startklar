import { describe, expect, it } from "vitest";
import { findeFrage } from "@/content/fragen";
import {
  anzahlBeantwortet,
  bereinigeAntworten,
  offenePflichtfragen,
  toggleMehrfach,
  vervollstaendige,
} from "@/lib/antworten";
import {
  allesZuruecksetzen,
  bereinigeFortschritt,
  ladeAntworten,
  ladeFortschritt,
  SCHLUESSEL,
  speicherImArbeitsspeicher,
  speichereAntworten,
  speichereFortschritt,
  type SpeicherAdapter,
} from "@/lib/speicher";

describe("Speicher", () => {
  it("speichert und lädt Antworten", () => {
    const s = speicherImArbeitsspeicher();
    speichereAntworten(s, { code: "etwas", ziel: ["bauen"] });
    expect(ladeAntworten(s)).toEqual({ code: "etwas", ziel: ["bauen"] });
  });

  it("übersteht kaputtes JSON", () => {
    const s = speicherImArbeitsspeicher();
    s.schreiben(SCHLUESSEL.antworten, "{kaputt");
    s.schreiben(SCHLUESSEL.fortschritt, "null");
    expect(ladeAntworten(s)).toEqual({});
    expect(ladeFortschritt(s)).toEqual({ frage: 0, schritt: 0, erledigt: [] });
  });

  it("übersteht einen Speicher, der beim Lesen wirft", () => {
    const werfend: SpeicherAdapter = {
      lesen: () => null,
      schreiben: () => {},
      entfernen: () => {},
      dauerhaft: false,
    };
    expect(ladeAntworten(werfend)).toEqual({});
  });

  it("setzt Antworten und Fortschritt zurück", () => {
    const s = speicherImArbeitsspeicher();
    speichereAntworten(s, { code: "gut" });
    speichereFortschritt(s, { frage: 3, schritt: 2, erledigt: ["zugang"] });
    allesZuruecksetzen(s);
    expect(ladeAntworten(s)).toEqual({});
    expect(ladeFortschritt(s).erledigt).toEqual([]);
  });

  it("bereinigt Fortschritt", () => {
    expect(bereinigeFortschritt({ frage: -1, schritt: 1.5, erledigt: ["a", "a", 3] })).toEqual({ frage: 0, schritt: 0, erledigt: ["a"] });
  });
});

describe("Antworten bereinigen", () => {
  it("verwirft unbekannte Schlüssel und ungültige Werte", () => {
    expect(bereinigeAntworten({ code: "super", os: "mac", hack: 1, ziel: ["bauen", "fliegen"] })).toEqual({ os: "mac" });
  });

  it("kürzt Freitext und entfernt Leerraum", () => {
    const a = bereinigeAntworten({ name: `  ${"x".repeat(100)}  `, idee: "   " });
    expect(a.name).toHaveLength(40);
    expect(a.idee).toBeUndefined();
  });

  it("hält maximale Auswahl und exklusive Optionen ein", () => {
    expect(bereinigeAntworten({ ziel: ["bauen", "buero", "ordnen"] }).ziel).toEqual(["bauen", "buero"]);
    expect(bereinigeAntworten({ tools: ["notion", "keine"] }).tools).toEqual(["keine"]);
  });

  it("verarbeitet null, Arrays und Zahlen", () => {
    expect(bereinigeAntworten(null)).toEqual({});
    expect(bereinigeAntworten([1, 2])).toEqual({});
    expect(bereinigeAntworten(42)).toEqual({});
  });
});

describe("Mehrfachauswahl", () => {
  const ziel = findeFrage("ziel")!;
  const tools = findeFrage("tools")!;

  it("wählt an und ab", () => {
    expect(toggleMehrfach(ziel, [], "bauen")).toEqual(["bauen"]);
    expect(toggleMehrfach(ziel, ["bauen"], "bauen")).toEqual([]);
  });

  it("max. 2 Ziele: die älteste Auswahl fällt raus", () => {
    expect(toggleMehrfach(ziel, ["bauen", "buero"], "ordnen")).toEqual(["buero", "ordnen"]);
  });

  it("exklusive Option ersetzt alles und wird durch andere ersetzt", () => {
    expect(toggleMehrfach(tools, ["notion", "slack"], "keine")).toEqual(["keine"]);
    expect(toggleMehrfach(tools, ["keine"], "notion")).toEqual(["notion"]);
  });
});

describe("Standardwerte und Pflichtfragen", () => {
  it("füllt übersprungene optionale Fragen, nie Pflichtfragen", () => {
    const a = vervollstaendige({});
    expect(a.kontrolle).toBe("jeder");
    expect(a.zeit).toBe("1h");
    expect(a.code).toBeUndefined();
    expect(a.name).toBeUndefined();
  });

  it("überschreibt vorhandene Antworten nicht", () => {
    expect(vervollstaendige({ zeit: "10min" }).zeit).toBe("10min");
  });

  it("listet offene Pflichtfragen", () => {
    expect(offenePflichtfragen({})).toEqual(["code", "terminal", "ziel", "os", "abo", "github", "sensibel"]);
    expect(offenePflichtfragen({ code: "keine", terminal: "nie", ziel: ["bauen"], os: "mac", abo: "pro", github: "ja", sensibel: "nein" })).toEqual([]);
  });

  it("zählt beantwortete Fragen (leere Listen zählen nicht)", () => {
    expect(anzahlBeantwortet({ code: "keine", ziel: [] })).toBe(1);
  });
});
