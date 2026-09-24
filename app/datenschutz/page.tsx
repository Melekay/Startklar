import type { Metadata } from "next";
import { Container } from "@/components/Container";
import { HinweisBox } from "@/components/HinweisBox";
import { Icon } from "@/components/Icon";
import { SCHLUESSEL } from "@/lib/speicher";

export const metadata: Metadata = { title: "Datenschutz", robots: { index: false } };

export default function DatenschutzSeite() {
  return (
    <Container schmal className="py-16 sm:py-24">
      <h1 className="text-5xl font-extrabold">Datenschutz</h1>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {[
          { icon: "x", text: "Keine Cookies" },
          { icon: "eye-off", text: "Kein Tracking" },
          { icon: "home", text: "Antworten bleiben im Browser" },
        ].map((p) => (
          <p key={p.text} className="flex min-h-16 items-center gap-3 rounded-feld border border-line bg-surface px-4 font-bold">
            <Icon name={p.icon} size={20} className="text-accent" />
            {p.text}
          </p>
        ))}
      </div>
      <HinweisBox art="achtung" titel="TODO: Platzhalter" className="mt-8">
        <p className="mt-1.5">
          Vor der Veröffentlichung um Verantwortlichen, Hosting-Anbieter (Server-Logfiles) und Betroffenenrechte ergänzen und rechtlich prüfen lassen.
        </p>
      </HinweisBox>
      <div className="mt-10 space-y-6 text-lg leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold">Was diese App speichert</h2>
          <p className="mt-2">
            Deine Interview-Antworten, deinen Fortschritt und deine Wahl zwischen hell und dunkel speichert die App ausschließlich im
            lokalen Speicher deines Browsers (localStorage). Sie werden nicht an einen Server gesendet. Die Schlüssel lauten:
          </p>
          <ul className="mt-3 space-y-1 text-base">
            {Object.values(SCHLUESSEL).map((k) => (
              <li key={k}>
                <code className="rounded-md bg-surface-2 px-2 py-0.5">{k}</code>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-bold">Löschen</h2>
          <p className="mt-2">Mit „Alles zurücksetzen“ unten auf jeder Seite löschst du Antworten und Fortschritt sofort.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold">Externe Links</h2>
          <p className="mt-2">Links zur offiziellen Doku und zu Anbietern öffnen fremde Seiten. Dort gelten deren Datenschutzregeln.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold">Hosting</h2>
          <p className="mt-2">[TODO: Anbieter und Umgang mit Server-Logfiles eintragen.]</p>
        </section>
      </div>
    </Container>
  );
}
