import type { Metadata } from "next";
import { findeFakt } from "@/content/fakten";
import { Container } from "@/components/Container";
import { HinweisBox } from "@/components/HinweisBox";
import { Icon } from "@/components/Icon";
import { Quellen } from "@/components/Quellen";
import { RichText } from "@/components/RichText";
import { Seitenkopf } from "@/components/Seitenkopf";

export const metadata: Metadata = {
  title: "Sicherheit",
  description: "Was Claude Code darf, wie du es begrenzt und was nie in den Chat gehört.",
};

const f = (id: string) => findeFakt(id)!.aussage;

const MODI = [
  { name: "Manual", technisch: "default", icon: "hand" },
  { name: "Accept edits", technisch: "acceptEdits", icon: "pen" },
  { name: "Plan", technisch: "plan", icon: "list" },
  { name: "Auto", technisch: "auto", icon: "zap" },
  { name: "Don’t ask", technisch: "dontAsk", icon: "lock" },
  { name: "Bypass", technisch: "bypassPermissions", icon: "alert" },
];

const NIE = [
  { icon: "key", text: "Passwörter, API-Schlüssel und Tokens" },
  { icon: "users", text: "Echte Kunden-, Patienten- oder Personaldaten" },
  { icon: "wallet", text: "Kontodaten, Kreditkarten, Gehälter" },
  { icon: "building", text: "Vertrauliche Firmenunterlagen ohne Erlaubnis" },
];

export default function SicherheitSeite() {
  return (
    <>
      <Seitenkopf
        oberzeile="Sicher arbeiten"
        titel={<>Du behältst die <span className="text-gold-verlauf">Kontrolle.</span></>}
        text="Claude Code kann Dateien ändern und Befehle ausführen. Das ist praktisch – und genau deshalb lohnt sich ein kurzer Blick auf die Sicherheitsregeln."
      />
      <Container className="space-y-20">
        <section id="modi" aria-labelledby="modi-titel" className="scroll-mt-24">
          <h2 id="modi-titel" className="text-4xl font-extrabold">Was Claude darf</h2>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            Um festzulegen, was ohne Nachfrage passiert, wählst du einen <RichText text="[[berechtigungsmodus|Berechtigungsmodus]]" />, weil jeder Modus
            Komfort gegen Kontrolle abwägt. <RichText text={f("modus-wechseln")} />
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {MODI.map((m) => (
              <div key={m.technisch} className="druck-karte rounded-karte border border-line bg-surface p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-surface-2">
                    <Icon name={m.icon} size={20} />
                  </span>
                  <div>
                    <h3 className="text-xl font-bold leading-tight">{m.name}</h3>
                    <code className="text-xs text-muted">{m.technisch}</code>
                  </div>
                </div>
                {(() => {
                  const [darf, fuer] = f(`modus-info-${m.technisch}`).split(" Gut für: ");
                  return (
                    <>
                      <p className="mt-4 leading-relaxed">{darf}</p>
                      {fuer && (
                        <p className="mt-2 text-sm text-muted">
                          <strong className="text-ink">Gut für:</strong> {fuer}
                        </p>
                      )}
                    </>
                  );
                })()}
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <HinweisBox art="info" titel="Voreinstellung beachten" text={f("modus-auto-standard")} />
            <HinweisBox art="achtung" titel="bypassPermissions" text={f("modus-bypass")} />
          </div>
          <div className="mt-4">
            <Quellen faktIds={["modi-liste", "modus-manual", "modus-auto-standard", "modus-bypass", "modus-web"]} />
          </div>
        </section>

        <section aria-labelledby="begrenzen-titel">
          <h2 id="begrenzen-titel" className="text-4xl font-extrabold">So begrenzt du Claude</h2>
          <ol className="mt-8 grid gap-4 md:grid-cols-2">
            {[
              { icon: "folder", titel: "Eigener Projektordner", text: "Um deine übrigen Dateien zu schützen, startest du Claude in einem eigenen Ordner, weil es alles darin sehen und ändern kann." },
              { icon: "list", titel: "Erst planen", text: `Um Überraschungen zu vermeiden, beginnst du größere Aufgaben im [[plan-mode|Plan Mode]]. ${f("plan-mode")}` },
              { icon: "lock", titel: "Regeln festlegen", text: f("permissions") },
              { icon: "hand", titel: "Jederzeit stoppen", text: f("esc") },
            ].map((p) => (
              <li key={p.titel} className="druck-karte flex gap-4 rounded-karte border border-line bg-surface p-6">
                <Icon name={p.icon} size={24} className="mt-1 shrink-0 text-accent" />
                <div>
                  <h3 className="text-xl font-bold">{p.titel}</h3>
                  <p className="mt-1 leading-relaxed text-muted">
                    <RichText text={p.text} />
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="nie-titel">
          <h2 id="nie-titel" className="text-4xl font-extrabold">Gehört nie in den Chat</h2>
          <p className="mt-3 max-w-2xl text-lg text-muted">
            Um sicher zu üben, nutzt du <RichText text="[[dummy-daten|Dummy-Daten]]" />, weil alles, was du einfügst, an einen Online-Dienst geht.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {NIE.map((n) => (
              <li key={n.text} className="flex min-h-16 items-center gap-4 rounded-feld border border-warn-line bg-warn-bg px-5">
                <Icon name={n.icon} size={22} />
                <span className="font-semibold">{n.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="firma-titel" className="grid gap-4 lg:grid-cols-2">
          <h2 id="firma-titel" className="sr-only">
            Firmenregeln, Sicherungen und fremde Inhalte
          </h2>
          <HinweisBox art="achtung" titel="Firmenregeln gehen vor" text="Auf Firmenrechnern und mit Firmendaten gilt: Frag vorher deine IT oder Datenschutzbeauftragte, ob und womit du Claude Code nutzen darfst." />
          <HinweisBox art="tipp" titel="Sicherungskopie vor großen Änderungen" text={`Lass vorher einen [[commit|Commit]] anlegen. ${f("checkpoints")}`} />
          <HinweisBox art="info" titel="Fremde Inhalte prüfen" text={`Webseiten, E-Mails und Dokumente können versteckte Anweisungen enthalten ([[prompt-injection|Prompt-Injection]]). ${f("mcp-vertrauen")}`} />
          <HinweisBox art="tipp" titel="Ergebnisse zeigen lassen" text={f("pruefen-lassen")} />
        </section>
        <Quellen faktIds={["permissions", "esc", "plan-mode", "checkpoints", "mcp-vertrauen", "pruefen-lassen"]} />
      </Container>
    </>
  );
}
