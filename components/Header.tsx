"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Container } from "./Container";
import { Icon } from "./Icon";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

export const NAVIGATION = [
  { href: "/plan", label: "Dein Plan" },
  { href: "/schritte", label: "Schritte" },
  { href: "/beispiele", label: "Beispiele" },
  { href: "/mcps", label: "Verbindungen" },
  { href: "/glossar", label: "Glossar" },
  { href: "/sicherheit", label: "Sicherheit" },
] as const;

export function Header() {
  const pfad = usePathname();
  const [offen, setOffen] = useState(false);
  const aktiv = (href: string) => pfad === href || pfad === `${href}/`;

  return (
    <header className="no-print sticky top-0 z-40 border-b border-line/70 bg-bg/80 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav aria-label="Hauptnavigation" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAVIGATION.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={aktiv(n.href) ? "page" : undefined}
                  className={`rounded-pille px-3.5 py-2 text-sm font-semibold transition hover:bg-surface-2 ${
                    aktiv(n.href) ? "bg-surface-2 text-ink" : "text-muted"
                  }`}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Link
            href="/interview"
            className="hidden min-h-11 items-center rounded-pille bg-accent-fill px-4 text-sm font-bold text-on-accent shadow-gold transition hover:-translate-y-0.5 sm:inline-flex"
          >
            Interview
          </Link>
          <ThemeToggle />
          <button
            type="button"
            className="grid size-11 place-items-center rounded-pille border border-line bg-surface lg:hidden"
            aria-expanded={offen}
            aria-controls="mobil-navigation"
            aria-label={offen ? "Menü schließen" : "Menü öffnen"}
            onClick={() => setOffen((o) => !o)}
          >
            <Icon name={offen ? "close" : "menu"} size={20} />
          </button>
        </div>
      </Container>
      {offen && (
        <nav id="mobil-navigation" aria-label="Mobile Navigation" className="border-t border-line bg-bg lg:hidden">
          <Container>
            <ul className="grid gap-1 py-3">
              {[{ href: "/interview", label: "Interview" }, ...NAVIGATION].map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    onClick={() => setOffen(false)}
                    aria-current={aktiv(n.href) ? "page" : undefined}
                    className="flex min-h-12 items-center rounded-feld px-4 text-base font-semibold hover:bg-surface-2"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </nav>
      )}
    </header>
  );
}
