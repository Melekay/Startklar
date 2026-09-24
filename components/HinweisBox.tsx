import { Icon } from "./Icon";
import { RichText } from "./RichText";

const STIL = {
  achtung: { rahmen: "border-warn-line bg-warn-bg", icon: "alert", label: "Wichtig" },
  info: { rahmen: "border-info-line bg-info-bg", icon: "info", label: "Info" },
  tipp: { rahmen: "border-tip-line bg-tip-bg", icon: "lightbulb", label: "Tipp" },
} as const;

type Props = {
  art: keyof typeof STIL;
  titel: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
};

/** Farbige Hinweisbox: gelb = wichtig (ohne Angst-Mache), blau = Info, grün = Tipp. */
export function HinweisBox({ art, titel, text, children, className = "" }: Props) {
  const s = STIL[art];
  return (
    <aside className={`druck-karte flex gap-4 rounded-karte border p-5 ${s.rahmen} ${className}`}>
      <Icon name={s.icon} size={22} className="mt-0.5 shrink-0 text-ink" />
      <div className="min-w-0">
        <p className="font-display text-lg font-semibold leading-tight">
          <span className="sr-only">{s.label}: </span>
          {titel}
        </p>
        {text && (
          <p className="mt-1.5 leading-relaxed text-ink/90">
            <RichText text={text} />
          </p>
        )}
        {children}
      </div>
    </aside>
  );
}
