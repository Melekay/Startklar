import Link from "next/link";
import { brand } from "@/config/brand";
import { Container } from "./Container";
import { ZuruecksetzenButton } from "./ZuruecksetzenButton";

export function Footer() {
  return (
    <footer className="no-print mt-24 border-t border-line bg-bg-tint">
      <Container className="grid gap-8 py-12 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="font-display text-lg font-bold">
            {brand.name}
            <span className="text-accent">.</span>
          </p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{brand.hinweisInoffiziell}</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            Keine Cookies, kein Tracking. Deine Antworten bleiben in deinem Browser.
          </p>
        </div>
        <div className="flex flex-col items-start gap-4 md:items-end">
          <nav aria-label="Fußzeile">
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold">
              <li><Link className="hover:text-accent" href="/spickzettel">Spickzettel</Link></li>
              <li><Link className="hover:text-accent" href="/quellen">Quellen</Link></li>
              <li><Link className="hover:text-accent" href="/impressum">Impressum</Link></li>
              <li><Link className="hover:text-accent" href="/datenschutz">Datenschutz</Link></li>
            </ul>
          </nav>
          <ZuruecksetzenButton />
        </div>
      </Container>
    </footer>
  );
}
