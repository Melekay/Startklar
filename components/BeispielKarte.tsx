import type { Beispiel } from "@/content/typen";
import { Icon } from "./Icon";
import { KopierenButton } from "./KopierenButton";

const SCHWIERIGKEIT = { leicht: "Leicht", mittel: "Mittel", fortgeschritten: "Fortgeschritten" } as const;

type Props = { beispiel: Beispiel; grund?: string; mitDummyDaten?: boolean; offen?: boolean; ebene?: "h2" | "h3" };

/** Karte für ein Beispiel mit kopierbarem erstem Prompt. */
export function BeispielKarte({ beispiel: b, grund, mitDummyDaten = b.sensibel, offen = false, ebene = "h3" }: Props) {
  const Ueberschrift = ebene;
  return (
    <article id={b.id} className="druck-karte group flex h-full flex-col rounded-karte border border-line bg-surface p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
      <div className="flex items-start justify-between gap-4">
        <span className="grid size-12 place-items-center rounded-2xl bg-gold-100 text-gold-800 dark:bg-gold-900/50 dark:text-gold-200">
          <Icon name={b.icon} size={24} />
        </span>
        <ul className="flex flex-wrap justify-end gap-1.5 text-xs font-bold" aria-label="Eigenschaften">
          <li className="rounded-pille bg-surface-2 px-2.5 py-1">{SCHWIERIGKEIT[b.schwierigkeit]}</li>
          <li className="rounded-pille bg-surface-2 px-2.5 py-1">ca. {b.dauerMin} Min.</li>
          {b.brauchtGithub && <li className="rounded-pille bg-surface-2 px-2.5 py-1">GitHub</li>}
        </ul>
      </div>
      <Ueberschrift className="mt-5 text-2xl font-bold leading-tight">{b.titel}</Ueberschrift>
      <p className="mt-2 leading-relaxed text-muted">{b.kurz}</p>
      {grund && (
        <p className="mt-3 flex items-start gap-2 text-sm font-semibold text-accent">
          <Icon name="target" size={16} className="mt-0.5 shrink-0" />
          {grund}
        </p>
      )}
      {mitDummyDaten && b.dummyDatenHinweis && (
        <p className="mt-4 flex gap-2 rounded-feld border border-warn-line bg-warn-bg p-3 text-sm">
          <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
          <span>{b.dummyDatenHinweis}</span>
        </p>
      )}
      <details className="group/details mt-5 border-t border-line pt-4" open={offen}>
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 font-semibold [&::-webkit-details-marker]:hidden">
          Prompt &amp; „Fertig, wenn …“
          <Icon name="chevron" size={18} className="transition group-open/details:rotate-90" />
        </summary>
        <p className="mt-2 text-sm text-muted">
          <strong className="text-ink">Warum nützlich?</strong> {b.warumNuetzlich}
        </p>
        <blockquote className="mt-3 rounded-feld bg-surface-2 p-4 text-sm leading-relaxed">„{b.ersterPrompt}“</blockquote>
        <KopierenButton text={b.ersterPrompt} label="Prompt kopieren" className="mt-3" />
        <p className="mt-4 flex gap-2 text-sm">
          <Icon name="check-circle" size={16} className="mt-0.5 shrink-0 text-accent" />
          <span>
            <strong>Fertig, wenn</strong> {b.fertigWenn.charAt(0).toLowerCase() + b.fertigWenn.slice(1)}
          </span>
        </p>
      </details>
    </article>
  );
}
