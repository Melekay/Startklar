import { describe, expect, it } from "vitest";
import { beispiele } from "@/content/beispiele";
import { fakten } from "@/content/fakten";
import { fragen } from "@/content/fragen";
import { glossar } from "@/content/glossar";
import { mcps } from "@/content/mcps";
import { schritte } from "@/content/schritte";
import { validiereInhalte } from "@/lib/validierung";

const inhalte = { fakten, fragen, beispiele, mcps, schritte, glossar };

describe("Inhalts-Validierung", () => {
  it("akzeptiert die ausgelieferten Inhalte", () => {
    expect(validiereInhalte()).toEqual([]);
  });

  it("erfüllt die Mindestmengen der Definition of Done", () => {
    expect(fragen).toHaveLength(18);
    expect(beispiele.length).toBeGreaterThanOrEqual(14);
    expect(mcps.length).toBeGreaterThanOrEqual(8);
    expect(schritte.length).toBeGreaterThanOrEqual(12);
    expect(glossar.length).toBeGreaterThanOrEqual(15);
  });

  it("jeder Fakt hat Quelle und Prüfdatum", () => {
    for (const f of fakten) {
      expect(f.quelle).toMatch(/^https:\/\//);
      expect(f.geprueftAm).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("meldet fehlende Pflichtfelder", () => {
    const kaputt = { ...inhalte, beispiele: [{ ...beispiele[0], titel: "" }, ...beispiele.slice(1)] };
    expect(validiereInhalte(kaputt)).toContain(`Beispiel ${beispiele[0].id}: titel fehlt`);
  });

  it("meldet Verweise auf unbekannte Fakten und Begriffe", () => {
    const s = { ...schritte[0], warum: "Siehe {{fakt:gibt-es-nicht}} und [[auch-nicht]]." };
    const fehler = validiereInhalte({ ...inhalte, schritte: [s, ...schritte.slice(1)] });
    expect(fehler.some((f) => f.includes("unbekannten Fakt „gibt-es-nicht“"))).toBe(true);
    expect(fehler.some((f) => f.includes("unbekannten Begriff „auch-nicht“"))).toBe(true);
  });

  it("meldet sensible Beispiele ohne Dummy-Daten-Hinweis", () => {
    const b = { ...beispiele[0], sensibel: true, dummyDatenHinweis: "" };
    expect(validiereInhalte({ ...inhalte, beispiele: [b, ...beispiele.slice(1)] })).toContain(
      `Beispiel ${b.id}: sensibel, aber dummyDatenHinweis fehlt`,
    );
  });

  it("meldet MCP-Installationsbefehle ohne Beleg", () => {
    const m = { ...mcps[0], installFaktId: "mcp-drittanbieter" };
    const fehler = validiereInhalte({ ...inhalte, mcps: [m, ...mcps.slice(1)] });
    expect(fehler).toContain(`MCP ${m.id}: Installationsbefehl ist nicht belegt`);
  });

  it("meldet doppelte IDs und zu wenige Fragen", () => {
    const fehler = validiereInhalte({ ...inhalte, fragen: [...fragen.slice(0, 17), fragen[0]] });
    expect(fehler).toContain(`Frage-ID doppelt: ${fragen[0].id}`);
  });
});
