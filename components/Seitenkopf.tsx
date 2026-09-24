import { Container } from "./Container";

type Props = { oberzeile?: string; titel: React.ReactNode; text?: React.ReactNode; children?: React.ReactNode };

/** Großer Seitenkopf im Keynote-Stil. */
export function Seitenkopf({ oberzeile, titel, text, children }: Props) {
  return (
    <div className="gold-glow relative overflow-hidden">
      <Container className="pb-12 pt-16 sm:pb-16 sm:pt-24">
        {oberzeile && <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">{oberzeile}</p>}
        <h1 className="mt-3 max-w-4xl text-balance text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">{titel}</h1>
        {text && <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted sm:text-xl">{text}</p>}
        {children}
      </Container>
    </div>
  );
}
