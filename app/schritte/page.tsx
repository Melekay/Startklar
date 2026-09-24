import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { SchrittFolge } from "./SchrittFolge";

export const metadata: Metadata = {
  title: "Schritt für Schritt",
  description: "Deine Anleitung in kleinen Schritten – jeder endet mit „Fertig, wenn …“.",
};

export default function SchrittSeite() {
  return (
    <Suspense
      fallback={
        <Container className="py-24">
          <p className="text-muted">Anleitung wird geladen …</p>
        </Container>
      }
    >
      <SchrittFolge />
    </Suspense>
  );
}
