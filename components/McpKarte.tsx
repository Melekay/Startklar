import type { Mcp } from "@/content/typen";
import { TOKEN_REGEL } from "@/content/mcps";
import { Befehl } from "./Befehl";
import { Icon } from "./Icon";
import { RichText } from "./RichText";

/** Karte für eine MCP-Verbindung. Die Token-Regel ist immer sichtbar. */
export function McpKarte({ mcp: m, grund, ebene = "h3" }: { mcp: Mcp; grund?: string; ebene?: "h2" | "h3" }) {
  const Ueberschrift = ebene;
  const zeilen = [
    { icon: "users", label: "Für wen", text: m.fuerWen },
    { icon: "check", label: "Voraussetzung", text: m.voraussetzung },
    { icon: "alert", label: "Risiko", text: m.risiko },
    { icon: "x", label: "Wann nicht", text: m.wannNicht },
  ];
  return (
    <article id={m.id} className="druck-karte flex h-full flex-col rounded-karte border border-line bg-surface p-6 shadow-soft">
      <div className="flex items-center gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink text-gold-300">
          <Icon name={m.icon} size={24} />
        </span>
        <div>
          <Ueberschrift className="text-2xl font-bold leading-tight">{m.name}</Ueberschrift>
          <p className="text-sm text-muted">MCP-Verbindung</p>
        </div>
      </div>
      <p className="mt-4 text-lg leading-snug">
        <RichText text={m.wozu} />
      </p>
      {grund && (
        <p className="mt-3 flex items-start gap-2 text-sm font-semibold text-accent">
          <Icon name="target" size={16} className="mt-0.5 shrink-0" />
          {grund}
        </p>
      )}
      <dl className="mt-5 grid gap-3 text-sm">
        {zeilen.map((z) => (
          <div key={z.label} className="flex gap-3">
            <dt className="flex w-32 shrink-0 items-center gap-2 font-semibold">
              <Icon name={z.icon} size={15} className="text-muted" /> {z.label}
            </dt>
            <dd className="text-muted">
              <RichText text={z.text} />
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-5 space-y-3 border-t border-line pt-4">
        <p className="text-sm">
          <strong>Einrichten:</strong> <RichText text={m.installHinweis} />
        </p>
        {m.installFaktId && <Befehl faktId={m.installFaktId} />}
        <p className="flex items-start gap-2 rounded-feld bg-warn-bg p-3 text-sm font-semibold">
          <Icon name="lock" size={16} className="mt-0.5 shrink-0" />
          {TOKEN_REGEL}
        </p>
        <a
          href={m.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-accent underline-offset-4 hover:underline"
        >
          Dokumentation öffnen <Icon name="external" size={14} />
          <span className="sr-only">(öffnet in neuem Tab)</span>
        </a>
      </div>
    </article>
  );
}
