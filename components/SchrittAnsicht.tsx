import type { Betriebssystem, EinstiegsWeg, Schritt } from "@/content/typen";
import { waehleVariante } from "@/lib/schritte";
import { Befehl } from "./Befehl";
import { Diagramm } from "./Diagramm";
import { Icon } from "./Icon";
import { Quellen } from "./Quellen";
import { RichText } from "./RichText";

type Props = {
  schritt: Schritt;
  nummer: number;
  weg: EinstiegsWeg;
  os?: Betriebssystem;
  beispielZuerst?: boolean;
  titelRef?: React.Ref<HTMLHeadingElement>;
  zusatz?: React.ReactNode;
};

/** Ein Schritt der Anleitung: Ziel, Warum, Diagramm, Anleitung, „Fertig, wenn …“, häufige Fehler. */
export function SchrittAnsicht({ schritt: s, nummer, weg, os, beispielZuerst = false, titelRef, zusatz }: Props) {
  const variante = waehleVariante(s, weg, os);

  const fertig = (
    <div className="druck-karte flex gap-3 rounded-karte border-2 border-gold-400 bg-gold-50 p-5 dark:bg-gold-900/25">
      <Icon name="check-circle" size={24} className="mt-0.5 shrink-0 text-gold-700 dark:text-gold-300" />
      <p className="text-lg leading-snug">
        <strong className="font-display">Fertig, wenn …</strong>{" "}
        <RichText text={s.fertigWenn.charAt(0).toLowerCase() + s.fertigWenn.slice(1)} />
      </p>
    </div>
  );

  return (
    <article aria-labelledby={`schritt-${s.id}`} className="space-y-8">
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Schritt {nummer}</p>
        <h2 id={`schritt-${s.id}`} ref={titelRef} tabIndex={-1} className="mt-2 text-4xl font-extrabold leading-[1.05] outline-none sm:text-5xl">
          {s.titel}
        </h2>
        <p className="mt-4 flex items-start gap-2 text-xl leading-snug">
          <Icon name="target" size={22} className="mt-1 shrink-0 text-accent" />
          <span>
            <span className="sr-only">Ziel: </span>
            {s.ziel}
          </span>
        </p>
      </header>
      {zusatz}

      <div className="grid gap-4 rounded-karte bg-surface-2 p-5 sm:grid-cols-[auto_1fr] sm:items-start">
        <span className="font-display text-lg font-bold">Warum?</span>
        <p className="leading-relaxed">
          <RichText text={s.warum} />
        </p>
      </div>

      {beispielZuerst && fertig}
      <Diagramm knoten={s.diagramm} titel={s.titel} />

      <section aria-label="Anleitung">
        <h3 className="text-2xl font-bold">So geht’s</h3>
        <ol className="mt-4 space-y-3">
          {variante.anleitung.map((zeile, i) => (
            <li key={i} className="flex gap-4">
              <span aria-hidden="true" className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-bg">
                {i + 1}
              </span>
              <p className="pt-1 leading-relaxed">
                <RichText text={zeile} />
              </p>
            </li>
          ))}
        </ol>
        {variante.befehlFaktIds && (
          <div className="mt-5 space-y-3">
            {variante.befehlFaktIds.map((id) => (
              <Befehl key={id} faktId={id} />
            ))}
          </div>
        )}
      </section>

      {!beispielZuerst && fertig}

      <details className="rounded-karte border border-line p-5">
        <summary className="flex min-h-11 cursor-pointer items-center gap-2 font-semibold">
          <Icon name="alert" size={18} /> Häufige Fehler
        </summary>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-muted">
          {s.haeufigeFehler.map((f) => (
            <li key={f}>
              <RichText text={f} />
            </li>
          ))}
        </ul>
      </details>

      <Quellen faktIds={s.quellenFaktIds} />
    </article>
  );
}
