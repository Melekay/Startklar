import { describe, expect, it } from "vitest";
import { findeSchritt, schritte } from "@/content/schritte";
import { erstellePlan } from "@/lib/empfehlung";
import { schritteAusPlan, waehleVariante } from "@/lib/schritte";

describe("Schritt-Varianten", () => {
  const installieren = findeSchritt("installieren")!;

  it("Terminal + Windows → PowerShell-Befehl", () => {
    expect(waehleVariante(installieren, "terminal", "windows").befehlFaktIds).toContain("install-windows-ps");
  });

  it("Terminal + Mac/Linux → curl-Befehl", () => {
    expect(waehleVariante(installieren, "terminal", "mac").befehlFaktIds).toContain("install-mac-linux");
    expect(waehleVariante(installieren, "terminal", "linux").befehlFaktIds).toContain("install-mac-linux");
    expect(waehleVariante(installieren, "terminal").befehlFaktIds).toContain("install-mac-linux");
  });

  it("Desktop und Web haben eigene Anleitungen ohne Terminal-Befehl", () => {
    expect(waehleVariante(installieren, "desktop", "windows").befehlFaktIds).toBeUndefined();
    expect(waehleVariante(installieren, "web", "mobil").anleitung.join(" ")).toMatch(/nichts installieren/);
  });

  it("jeder Schritt liefert für jeden Weg eine Anleitung", () => {
    for (const s of schritte) {
      for (const weg of ["desktop", "terminal", "web"] as const) {
        expect(waehleVariante(s, weg).anleitung.length).toBeGreaterThan(0);
      }
    }
  });

  it("jeder Schritt endet mit „Fertig, wenn …“", () => {
    for (const s of schritte) expect(s.fertigWenn.length).toBeGreaterThan(10);
  });

  it("wandelt den Plan in Schritte um", () => {
    const liste = schritteAusPlan(erstellePlan({}));
    expect(liste[0].schritt.id).toBe("zugang");
    expect(liste.at(-1)?.schritt.id).toBe("weiter");
  });
});
