import Link from "next/link";
import { brand } from "@/config/brand";
import { fakten } from "@/content/fakten";
import { fragen } from "@/content/fragen";
import { Container } from "@/components/Container";
import { HeroVorschau } from "@/components/HeroVorschau";
import { Icon } from "@/components/Icon";
import { StartCta } from "@/components/StartCta";

const ABLAUF = [
  { icon: "sparkles", titel: "Willkommen", text: "Worum es geht" },
  { icon: "message", titel: "Interview", text: `${fragen.length} kurze Fragen` },
  { icon: "map", titel: "Dein Plan", text: "Passend zu dir" },
  { icon: "footprints", titel: "Schritt für Schritt", text: "Mit „Fertig, wenn …“" },
  { icon: "book", titel: "Nachschlagen", text: "Glossar & Beispiele" },
];

const LEISTUNGEN = [
  { icon: "laptop", titel: "Der richtige Einstieg", text: "Desktop-App, Terminal oder Web – je nachdem, was zu dir passt." },
  { icon: "copy", titel: "Dein erster Prompt", text: "Fertig formuliert. Kopieren, einfügen, loslegen." },
  { icon: "sparkles", titel: "Drei Beispiele", text: "Aufgaben aus deinem Alltag – eine davon in unter 15 Minuten." },
  { icon: "plug", titel: "Passende Verbindungen", text: "Nur die, die du wirklich brauchst. Oft: erst mal keine." },
  { icon: "shield", titel: "Sicherer Modus", text: "Wie viel Claude allein darf – mit ehrlicher Erklärung." },
  { icon: "list", titel: "Schritt-Anleitung", text: "Jeder Schritt endet mit einer prüfbaren Aussage." },
];

export default function Startseite() {
  const stand = new Date(fakten[0].geprueftAm).toLocaleDateString("de-DE");
  return (
    <>
      {/* Hero */}
      <section className="gold-glow relative overflow-hidden">
        <Container className="grid items-center gap-16 pb-20 pt-16 sm:pt-24 lg:grid-cols-[1.25fr_1fr] lg:pb-28">
          <div>
            <p className="inline-flex items-center gap-2 rounded-pille border border-line bg-surface/80 px-4 py-1.5 text-sm font-semibold text-muted backdrop-blur">
              <Icon name="info" size={14} /> Inoffizielles Lernprojekt – nicht von Anthropic
            </p>
            <h1 className="mt-6 text-balance text-6xl font-extrabold leading-[0.95] sm:text-7xl lg:text-8xl">
              Claude Code.
              <br />
              <span className="text-gold-verlauf">Endlich verständlich.</span>
            </h1>
            <p className="mt-8 max-w-xl text-pretty text-xl leading-relaxed text-muted">
              {brand.beschreibung} Ohne Vorwissen, auf Deutsch, in kleinen Schritten.
            </p>
            <div className="mt-10">
              <StartCta />
            </div>
            <p className="mt-6 text-sm text-muted">Etwa 5 Minuten · Keine Anmeldung · Deine Antworten bleiben in deinem Browser</p>
          </div>
          <HeroVorschau />
        </Container>
      </section>

      {/* Ablauf */}
      <section aria-labelledby="ablauf-titel" className="py-sektion">
        <Container>
          <h2 id="ablauf-titel" className="max-w-3xl text-5xl font-extrabold leading-[1.02] sm:text-6xl">
            Fünf Stationen. <span className="text-muted">Ein Ziel.</span>
          </h2>
          <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {ABLAUF.map((s, i) => (
              <li key={s.titel} className="relative rounded-karte border border-line bg-surface p-6 shadow-soft">
                <span className="font-display text-sm font-bold text-accent">{String(i + 1).padStart(2, "0")}</span>
                <Icon name={s.icon} size={28} className="mt-4 text-ink" />
                <p className="mt-4 font-display text-xl font-bold">{s.titel}</p>
                <p className="mt-1 text-sm text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Vorher / Nachher */}
      <section aria-labelledby="vergleich-titel" className="bg-bg-tint py-sektion">
        <Container>
          <h2 id="vergleich-titel" className="max-w-3xl text-5xl font-extrabold leading-[1.02] sm:text-6xl">
            Weniger suchen. <span className="text-gold-verlauf">Mehr machen.</span>
          </h2>
          <div className="mt-14 grid gap-5 md:grid-cols-2">
            <div className="rounded-karte border border-line bg-surface p-8">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-muted">Vorher</p>
              <ul className="mt-5 space-y-4 text-lg">
                {["Zehn Blogartikel, die sich widersprechen", "Befehle, die auf deinem Rechner nicht gehen", "Fachwörter ohne Erklärung", "Unklar, was Claude eigentlich darf"].map((t) => (
                  <li key={t} className="flex gap-3">
                    <Icon name="x" size={22} className="mt-0.5 shrink-0 text-muted" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-karte bg-ink p-8 text-bg">
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-gold-300">Mit {brand.name}</p>
              <ul className="mt-5 space-y-4 text-lg">
                {[
                  "Ein Plan, der zu deinem Gerät und Zugang passt",
                  `Geprüft an der offiziellen Doku (Stand ${stand})`,
                  "Jeder Fachbegriff mit Ein-Satz-Erklärung",
                  "Ein sicherer Modus mit ehrlicher Begründung",
                ].map((t) => (
                  <li key={t} className="flex gap-3">
                    <Icon name="check" size={22} className="mt-0.5 shrink-0 text-gold-300" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      {/* Was du bekommst */}
      <section aria-labelledby="leistung-titel" className="py-sektion">
        <Container>
          <h2 id="leistung-titel" className="max-w-3xl text-5xl font-extrabold leading-[1.02] sm:text-6xl">
            Das steckt in deinem Plan.
          </h2>
          <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {LEISTUNGEN.map((l) => (
              <li key={l.titel} className="rounded-karte border border-line bg-surface p-7 shadow-soft transition hover:-translate-y-1 hover:shadow-lift">
                <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-gold-300 to-gold-500 text-on-accent">
                  <Icon name={l.icon} size={22} />
                </span>
                <p className="mt-5 font-display text-2xl font-bold">{l.titel}</p>
                <p className="mt-2 leading-relaxed text-muted">{l.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* Abschluss */}
      <section className="pb-8">
        <Container>
          <div className="gold-glow relative overflow-hidden rounded-[2rem] border border-line bg-surface px-8 py-16 text-center shadow-lift sm:px-16">
            <h2 className="mx-auto max-w-3xl text-5xl font-extrabold leading-[1.02] sm:text-6xl">Bereit? In 5 Minuten hast du deinen Plan.</h2>
            <div className="mt-10 flex justify-center">
              <StartCta />
            </div>
            <p className="mx-auto mt-8 max-w-xl text-sm text-muted">
              {brand.hinweisInoffiziell} Alle Angaben ohne Gewähr – im Zweifel gilt die{" "}
              <Link href="/quellen" className="font-semibold underline underline-offset-4">
                offizielle Doku
              </Link>
              .
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
