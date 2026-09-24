import { expect, test, type Page } from "@playwright/test";

/** Einzelauswahl: Klick auf die Karte springt automatisch zur nächsten Frage. */
async function waehle(page: Page, label: string, naechsteFrage: RegExp) {
  await page.getByText(label, { exact: true }).click();
  await expect(page.getByRole("heading", { level: 2, name: naechsteFrage })).toBeVisible();
}

async function weiter(page: Page) {
  // force: Bei offener Pflichtfrage ist der Knopf nur aria-disabled und zeigt beim Klick eine Meldung.
  await page.getByRole("button", { name: /^(Weiter|Plan anzeigen)/ }).click({ force: true });
}

test("komplett durchs Interview bis zur Plan-Seite", async ({ page }) => {
  const fehler: string[] = [];
  page.on("pageerror", (e) => fehler.push(String(e)));
  page.on("console", (m) => m.type() === "error" && fehler.push(m.text()));

  await page.goto("/");
  await expect(page.getByText("Inoffizielles Lernprojekt – nicht von Anthropic")).toBeVisible();
  await page.getByRole("link", { name: "Interview starten" }).first().click();
  await expect(page).toHaveURL(/\/interview/);

  // Block 1
  await page.getByRole("textbox").fill("Alex");
  await weiter(page);
  await waehle(page, "Büro & Verwaltung", /Programmiererfahrung/);

  // Pflichtfrage: Weiter ohne Antwort zeigt eine Meldung
  await weiter(page);
  await expect(page.getByText(/Bitte wähle eine Antwort/)).toBeVisible();
  await waehle(page, "Keine", /Wie viel KI/);
  await page.getByRole("button", { name: /Überspringen/ }).click(); // ki
  await waehle(page, "Noch nie benutzt", /Was willst du hauptsächlich tun/);

  // Block 2 (Mehrfachauswahl braucht „Weiter“)
  await page.getByText("Zeit bei Büroaufgaben sparen", { exact: true }).click();
  await page.getByText("Dateien & Daten ordnen", { exact: true }).click();
  await weiter(page);
  await page.getByRole("button", { name: "meine Rechnungen nach Monat sortieren" }).click();
  await weiter(page);
  await waehle(page, "Immer wieder", /Welches Gerät/);

  // Block 3
  await waehle(page, "Windows", /Claude-Zugang/);
  await waehle(page, "Gratis-Konto", /GitHub-Konto/);
  await waehle(page, "Was ist das?", /Auf welchem Rechner/);
  await waehle(page, "Firmenrechner mit Einschränkungen", /Welche Programme/);
  await page.getByText("Notion", { exact: true }).click();
  await weiter(page);
  await waehle(page, "Manchmal", /Wie viel Zeit/);

  // Block 4: alles überspringen
  for (let i = 0; i < 4; i++) await page.getByRole("button", { name: /Überspringen/ }).click();

  await expect(page).toHaveURL(/\/plan/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Dein Plan.");
  await expect(page.getByText("Hallo Alex!", { exact: false })).toBeVisible();

  // Kernaussagen des Plans
  await expect(page.getByRole("heading", { name: "Zugang klären" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Frag vorher deine IT" })).toBeVisible();
  await expect(page.getByText("Desktop-App (Tab „Code“)").first()).toBeVisible();
  await expect(page.getByText(/Ich möchte Folgendes umsetzen: meine Rechnungen nach Monat sortieren/)).toBeVisible();
  await expect(page.getByText("Sensible Daten: sicher üben")).toBeVisible();
  await expect(page.getByText(/In deiner ersten Woche brauchst du keine Verbindung/)).toBeVisible();

  // Antworten bleiben nach dem Neuladen erhalten
  await page.reload();
  await expect(page.getByText("Hallo Alex!", { exact: false })).toBeVisible();

  // Weiter in den Stepper
  await page.getByRole("link", { name: /Schritt für Schritt starten/ }).first().click();
  await expect(page.getByRole("heading", { name: "Zugang klären", level: 2 })).toBeVisible();
  await expect(page.getByText("Fertig, wenn …").first()).toBeVisible();

  expect(fehler, fehler.join("\n")).toEqual([]);
});

test("Alles zurücksetzen löscht die Antworten", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => localStorage.setItem("startklar:v1:antworten", JSON.stringify({ code: "gut" })));
  await page.goto("/plan");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Dein Plan.");
  page.once("dialog", (d) => d.accept());
  await page.getByRole("button", { name: "Alles zurücksetzen" }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/plan");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Noch leer");
});

test("funktioniert ohne localStorage", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new Error("gesperrt");
      },
    });
  });
  const fehler: string[] = [];
  page.on("pageerror", (e) => fehler.push(String(e)));
  await page.goto("/interview");
  await expect(page.getByText(/Dein Browser erlaubt kein Speichern/)).toBeVisible();
  await page.getByRole("textbox").fill("Sam");
  await weiter(page);
  await expect(page.getByRole("heading", { name: /In welchem Bereich/ })).toBeVisible();
  expect(fehler).toEqual([]);
});
