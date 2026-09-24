import { findeFakt } from "@/content/fakten";
import { Icon } from "./Icon";

/** Zeigt die Quellen (Fakten) eines Inhalts mit Prüfdatum. */
export function Quellen({ faktIds }: { faktIds: string[] }) {
  const liste = [...new Set(faktIds)].map(findeFakt).filter((f) => f !== undefined);
  const urls = [...new Map(liste.map((f) => [f.quelle, f])).values()];
  if (urls.length === 0) return null;
  const datum = new Date(liste[0].geprueftAm).toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" });
  const unbelegt = liste.some((f) => !f.belegt);
  return (
    <div className="text-xs text-muted">
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <Icon name="book" size={14} />
        <span>Quelle{urls.length > 1 ? "n" : ""}:</span>
        {urls.map((f) => (
          <a key={f.quelle} href={f.quelle} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-6 items-center py-1 underline underline-offset-2 hover:text-accent">
            {f.quelle.replace("https://", "")}
          </a>
        ))}
        <span>· geprüft am {datum}</span>
      </p>
      {unbelegt && <p className="mt-1 font-semibold">Teilweise nicht in der Doku belegt – bitte in der offiziellen Doku prüfen.</p>}
    </div>
  );
}
