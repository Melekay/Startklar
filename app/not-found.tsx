import Link from "next/link";
import { Container } from "@/components/Container";

export default function NichtGefunden() {
  return (
    <Container className="py-24 sm:py-32">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">404</p>
      <h1 className="mt-3 text-5xl font-extrabold sm:text-7xl">Diese Seite gibt es nicht.</h1>
      <Link href="/" className="mt-10 inline-flex min-h-12 items-center rounded-pille bg-accent-fill px-6 font-bold text-on-accent">
        Zur Startseite
      </Link>
    </Container>
  );
}
