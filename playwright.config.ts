import { defineConfig, devices } from "@playwright/test";

/**
 * Smoke-Test gegen den statischen Export (vorher `npm run build`).
 * Chromium: Cloud-Umgebung nutzt den vorinstallierten Browser; lokal ggf. `npx playwright install chromium`.
 */
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 60_000,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: "http://localhost:3123", trace: "retain-on-failure" },
  webServer: {
    command: "npx serve out -l 3123 --no-clipboard",
    url: "http://localhost:3123",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "handy", use: { ...devices["Pixel 7"] } },
  ],
});
