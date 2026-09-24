import type { Metadata } from "next";
import { glossar } from "@/content/glossar";
import { Container } from "@/components/Container";
import { RichText } from "@/components/RichText";
import { Seitenkopf } from "@/components/Seitenkopf";

export const metadata: Metadata = {
  title: "Glossar",
  description: "Fachbegriffe rund um Claude Code in je einem Satz erklärt.",
};

export default function GlossarSeite() {
  const sortiert = [...glossar].sort((a, b) => a.begriff.localeCompare(b.begriff, "de"));
  const buchstaben = new Map<string, string>();
  for (const b of sortiert) {
    const k = b.begriff.charAt(0).toUpperCase();
    if (!buchstaben.has(k)) buchstaben.set(k, b.id);
  }
  return (
    <>
      <Seitenkopf
        oberzeile="Nachschlagen"
        titel={<>Fachwörter, <span className="text-gold-verlauf">einfach.</span></>}
        text="Jeder Begriff in einem Satz. Darunter ein bisschen mehr, wenn du es genauer wissen willst."
      />
      <Container>
        <nav aria-label="Buchstaben" className="no-print flex flex-wrap gap-2">
          {[...buchstaben].map(([b, id]) => (
            <a key={b} href={`#${id}`} className="grid size-11 place-items-center rounded-xl border border-line bg-surface font-display font-bold hover:border-accent">
              {b}
            </a>
          ))}
        </nav>
        <dl className="mt-10 grid gap-4 md:grid-cols-2">
          {sortiert.map((b) => {
            return (
              <div
                key={b.id}
                id={b.id}
                className="druck-karte scroll-mt-24 rounded-karte border border-line bg-surface p-6 shadow-soft target:border-gold-500 target:ring-2 target:ring-gold-300"
              >
                <dt className="font-display text-2xl font-bold">{b.begriff}</dt>
                <dd className="mt-2">
                  <p className="text-lg leading-snug">{b.kurz}</p>
                  {b.lang && <p className="mt-2 leading-relaxed text-muted">{b.lang}</p>}
                  {b.beispiel && (
                    <p className="mt-3 text-sm text-muted">
                      <strong className="text-ink">Beispiel:</strong> <RichText text={b.beispiel} />
                    </p>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </Container>
    </>
  );
}
