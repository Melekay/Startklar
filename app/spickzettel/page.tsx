import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { findeFakt } from "@/content/fakten";
import { Container } from "@/components/Container";
import { DruckenButton } from "@/components/DruckenButton";
import { Icon } from "@/components/Icon";
import { Quellen } from "@/components/Quellen";

export const metadata: Metadata = {
  title: "Spickzettel",
  description: "Die 8 wichtigsten Handgriffe für Claude Code auf einer druckbaren Seite.",
};

const HANDGRIFFE = [
  { icon: "play", titel: "Starten", faktId: "start", tasten: "cd ordner → claude" },
  { icon: "list", titel: "Erst planen", faktId: "plan-mode-taste" },
  { icon: "hand", titel: "Stoppen", faktId: "esc" },
  { icon: "undo", titel: "Zurückspringen", faktId: "rewind" },
  { icon: "sparkles", titel: "Frisch anfangen", faktId: "clear" },
  { icon: "file", titel: "Regeln speichern", faktId: "init" },
  { icon: "plug", titel: "Verbindungen", faktId: "mcp-verwalten" },
  { icon: "help", titel: "Hilfe", faktId: "hilfe" },
];

export default function SpickzettelSeite() {
  return (
    <Container className="py-12 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Spickzettel</p>
          <h1 className="mt-2 text-5xl font-extrabold leading-none sm:text-6xl">Die 8 wichtigsten Handgriffe</h1>
        </div>
        <DruckenButton />
      </div>
      <ol className="mt-10 grid gap-4 sm:grid-cols-2 print:grid-cols-2 print:gap-3">
        {HANDGRIFFE.map((h, i) => {
          const fakt = findeFakt(h.faktId)!;
          return (
            <li key={h.titel} className="druck-karte flex gap-4 rounded-karte border border-line bg-surface p-5 shadow-soft print:p-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gold-100 text-gold-800 print:bg-transparent print:text-black dark:bg-gold-900/50 dark:text-gold-200">
                <Icon name={h.icon} size={22} />
              </span>
              <div className="min-w-0">
                <h2 className="text-xl font-bold">
                  <span className="text-muted">{i + 1}.</span> {h.titel}
                </h2>
                <p className="mt-2">
                  <kbd className="rounded-lg border border-line bg-surface-2 px-2 py-1 font-mono text-base font-semibold">{h.tasten ?? fakt.wert}</kbd>
                </p>
                <p className="mt-2 text-sm leading-snug text-muted">{fakt.aussage.replace(/`/g, "")}</p>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="druck-karte mt-8 rounded-karte border-2 border-gold-400 p-6">
        <p className="font-display text-lg font-bold">Die goldene Regel für jeden Prompt</p>
        <p className="mt-2 text-lg">„Stell mir zuerst bis zu 5 Fragen, mache dann einen Plan und ändere noch nichts, bevor ich zustimme.“</p>
      </div>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <Quellen faktIds={HANDGRIFFE.map((h) => h.faktId)} />
        <p className="text-xs text-muted">{brand.hinweisInoffiziell}</p>
      </div>
    </Container>
  );
}
