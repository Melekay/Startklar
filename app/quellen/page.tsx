import type { Metadata } from "next";
import { fakten } from "@/content/fakten";
import { Container } from "@/components/Container";
import { Icon } from "@/components/Icon";
import { Seitenkopf } from "@/components/Seitenkopf";

export const metadata: Metadata = {
  title: "Quellen",
  description: "Alle Aussagen über Claude Code mit Quelle und Prüfdatum.",
};

export default function QuellenSeite() {
  const nachQuelle = new Map<string, typeof fakten>();
  for (const f of fakten) nachQuelle.set(f.quelle, [...(nachQuelle.get(f.quelle) ?? []), f]);
  return (
    <>
      <Seitenkopf
        oberzeile="Transparenz"
        titel="Woher wir das wissen."
        text={`Alle ${fakten.length} Aussagen über Claude Code in dieser App stammen aus der offiziellen Dokumentation. Hier siehst du jede mit Quelle und Prüfdatum. Claude Code ändert sich schnell – im Zweifel gilt die offizielle Doku.`}
      />
      <Container className="space-y-10">
        {[...nachQuelle].map(([quelle, liste]) => (
          <section key={quelle} aria-label={quelle}>
            <h2 className="text-xl font-bold">
              <a href={quelle} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 break-all hover:text-accent">
                {quelle.replace("https://", "")} <Icon name="external" size={16} />
                <span className="sr-only">(öffnet in neuem Tab)</span>
              </a>
            </h2>
            <ul className="mt-4 divide-y divide-line rounded-karte border border-line bg-surface">
              {liste.map((f) => (
                <li key={f.id} className="grid gap-2 p-4 sm:grid-cols-[1fr_auto] sm:items-start">
                  <div>
                    <p className="leading-relaxed">{f.aussage.replace(/`/g, "")}</p>
                    {f.wert && <code className="mt-1 inline-block rounded-md bg-surface-2 px-2 py-0.5 text-sm">{f.wert}</code>}
                  </div>
                  <p className="text-xs text-muted sm:text-right">
                    {f.belegt ? "belegt" : <strong className="text-ink">bitte in der offiziellen Doku prüfen</strong>}
                    <br />
                    geprüft am {new Date(f.geprueftAm).toLocaleDateString("de-DE")}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Container>
    </>
  );
}
