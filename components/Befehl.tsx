import { findeFakt } from "@/content/fakten";
import { KopierenButton } from "./KopierenButton";

/** Zeigt einen Befehl aus content/fakten.ts mit Kopieren-Knopf und Quelle. */
export function Befehl({ faktId }: { faktId: string }) {
  const fakt = findeFakt(faktId);
  if (!fakt?.wert) return null;
  return (
    <figure className="druck-karte overflow-hidden rounded-feld border border-line bg-[#15130e] text-[#f6f1e6]">
      <figcaption className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2 text-xs text-[#c9c1ad]">
        <span>{fakt.aussage.replace(/`/g, "")}</span>
      </figcaption>
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <code className="min-w-0 break-all font-mono text-sm sm:text-base">{fakt.wert}</code>
        <KopierenButton text={fakt.wert} className="!bg-gold-400 !text-on-accent" />
      </div>
    </figure>
  );
}
