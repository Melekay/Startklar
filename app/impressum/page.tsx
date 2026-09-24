import type { Metadata } from "next";
import { brand } from "@/config/brand";
import { Container } from "@/components/Container";
import { HinweisBox } from "@/components/HinweisBox";

export const metadata: Metadata = { title: "Impressum", robots: { index: false } };

export default function ImpressumSeite() {
  return (
    <Container schmal className="py-16 sm:py-24">
      <h1 className="text-5xl font-extrabold">Impressum</h1>
      <HinweisBox art="achtung" titel="TODO: Platzhalter" className="mt-8">
        <p className="mt-1.5">
          Diese Seite ist ein Platzhalter. Vor der Veröffentlichung müssen hier die Pflichtangaben nach § 5 DDG (Name, Anschrift, Kontakt) stehen.
          Bitte rechtlich prüfen lassen.
        </p>
      </HinweisBox>
      <div className="mt-10 space-y-4 text-lg leading-relaxed">
        <p>
          <strong>Angaben gemäß § 5 DDG</strong>
          <br />
          [TODO: Name / Firma]
          <br />
          [TODO: Straße, Hausnummer]
          <br />
          [TODO: PLZ, Ort]
        </p>
        <p>
          <strong>Kontakt</strong>
          <br />
          [TODO: E-Mail-Adresse]
        </p>
        <p className="text-muted">{brand.hinweisInoffiziell}</p>
      </div>
    </Container>
  );
}
