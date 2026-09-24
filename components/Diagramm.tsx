import type { DiagrammKnoten } from "@/content/typen";
import { Icon } from "./Icon";

/** Einfaches Ablauf-Diagramm aus Icons und Pfeilen (Platzhalter für spätere Grafiken). */
export function Diagramm({ knoten, titel }: { knoten: DiagrammKnoten[]; titel: string }) {
  return (
    <figure className="druck-karte rounded-karte border border-line bg-gradient-to-br from-surface to-surface-2 p-5 sm:p-6">
      <ol className="flex flex-wrap items-center justify-center gap-2 sm:gap-3" aria-label={`Ablauf: ${titel}`}>
        {knoten.map((k, i) => (
          <li key={`${k.label}-${i}`} className="flex items-center gap-2 sm:gap-3">
            <span className="flex flex-col items-center gap-2 text-center">
              <span className="grid size-14 place-items-center rounded-2xl bg-surface text-ink shadow-soft ring-1 ring-line sm:size-16">
                <Icon name={k.icon} size={26} className="text-gold-600 dark:text-gold-300" />
              </span>
              <span className="max-w-24 text-xs font-semibold leading-tight sm:text-sm">{k.label}</span>
            </span>
            {i < knoten.length - 1 && <Icon name="arrow" size={18} className="mb-6 shrink-0 text-muted" />}
          </li>
        ))}
      </ol>
      <figcaption className="sr-only">{knoten.map((k) => k.label).join(" → ")}</figcaption>
    </figure>
  );
}
