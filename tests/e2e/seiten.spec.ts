import { expect, test } from "@playwright/test";

const ROUTEN = ["/", "/interview", "/plan", "/schritte", "/beispiele", "/mcps", "/glossar", "/sicherheit", "/spickzettel", "/quellen", "/impressum", "/datenschutz"];

for (const farbschema of ["light", "dark"] as const) {
  test.describe(`alle Seiten (${farbschema})`, () => {
    test.use({ colorScheme: farbschema });

    test("laden ohne JavaScript-Fehler und ohne horizontales Scrollen", async ({ page }) => {
      const fehler: string[] = [];
      page.on("pageerror", (e) => fehler.push(String(e)));
      page.on("console", (m) => m.type() === "error" && fehler.push(`${page.url()}: ${m.text()}`));
      // Mit ausgefüllten Antworten, damit Plan und Stepper alle Inhalte (inkl. Tooltips) zeigen.
      await page.goto("/");
      await page.evaluate(() =>
        localStorage.setItem(
          "startklar:v1:antworten",
          JSON.stringify({ name: "Alex", bereich: "selbststaendig", code: "keine", terminal: "nie", ziel: ["bauen"], os: "windows", abo: "gratis", github: "nein", sensibel: "manchmal", rechner: "firma", tools: ["notion"], kosten: "sehr", haeufigkeit: "beides" }),
        ),
      );
      for (const route of ROUTEN) {
        await page.goto(route);
        await expect(page.locator("h1").first()).toBeVisible();
        await expect(page.locator("html")).toHaveAttribute("data-theme", farbschema);
        const zuBreit = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
        expect(zuBreit, `${route} scrollt horizontal`).toBe(false);
      }
      expect(fehler, fehler.join("\n")).toEqual([]);
    });
  });
}

test("Hinweis „inoffiziell“ steht auf der Startseite und im Footer", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Inoffizielles Lernprojekt – nicht von Anthropic")).toBeVisible();
  await expect(page.locator("footer")).toContainText("„Claude“ ist eine Marke von Anthropic");
});

test("Glossar-Tooltip erscheint bei Tastaturfokus", async ({ page }) => {
  await page.goto("/sicherheit");
  const link = page.getByRole("link", { name: "Berechtigungsmodus" }).first();
  await link.focus();
  await expect(page.getByRole("tooltip").filter({ hasText: "ohne dich vorher zu fragen" }).first()).toBeVisible();
});

test("Datei-Hinweis erscheint nur bei file://, nicht im normalen Betrieb", async ({ page }) => {
  await page.goto("/interview");
  await expect(page.locator("#datei-hinweis")).toBeHidden();
});
