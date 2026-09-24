/**
 * Läuft vor jedem Build (npm run validate). Bricht bei fehlerhaften Inhalten ab.
 */
import { validiereInhalte } from "../lib/validierung";

const fehler = validiereInhalte();
if (fehler.length > 0) {
  console.error(`\n✖ Inhalte ungültig (${fehler.length} Fehler):\n`);
  for (const f of fehler) console.error(`  - ${f}`);
  process.exit(1);
}
console.log("✔ Inhalte gültig: Fakten, Fragen, Beispiele, MCPs, Schritte und Glossar geprüft.");
