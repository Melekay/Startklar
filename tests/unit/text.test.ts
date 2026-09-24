import { describe, expect, it } from "vitest";
import { ersetzeFakten, findeVerweise, reinerText, zerlegeText } from "@/lib/text";

describe("Textauszeichnung", () => {
  it("ersetzt Fakten durch ihren Wert", () => {
    expect(ersetzeFakten("Drück {{fakt:plan-mode-taste}}.")).toBe("Drück Shift+Tab.");
  });

  it("markiert unbekannte Fakten sichtbar", () => {
    expect(ersetzeFakten("{{fakt:gibtsnicht}}")).toBe("[fehlender Fakt: gibtsnicht]");
  });

  it("zerlegt Begriffe, Code und Text", () => {
    expect(zerlegeText("Im [[terminal|Terminal]] tippst du `claude`.")).toEqual([
      { art: "text", text: "Im " },
      { art: "begriff", id: "terminal", text: "Terminal" },
      { art: "text", text: " tippst du " },
      { art: "code", text: "claude" },
      { art: "text", text: "." },
    ]);
  });

  it("Fakten in Code-Blöcken werden ersetzt", () => {
    expect(zerlegeText("`{{fakt:install-pruefen}}`")).toEqual([{ art: "code", text: "claude --version" }]);
  });

  it("Begriff ohne Anzeigetext nutzt die ID", () => {
    expect(zerlegeText("[[mcp]]")).toEqual([{ art: "begriff", id: "mcp", text: "mcp" }]);
  });

  it("liefert reinen Text und alle Verweise", () => {
    expect(reinerText("[[kontext|Kontext]] mit `/clear`")).toBe("Kontext mit /clear");
    expect(findeVerweise("{{fakt:a}} [[b]] [[c|C]]")).toEqual({ fakten: ["a"], begriffe: ["b", "c"] });
  });
});
