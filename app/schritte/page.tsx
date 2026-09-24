import type { Metadata } from "next";
import { SchrittFolge } from "./SchrittFolge";

export const metadata: Metadata = {
  title: "Schritt für Schritt",
  description: "Deine Anleitung in kleinen Schritten – jeder endet mit „Fertig, wenn …“.",
};

export default function SchrittSeite() {
  return <SchrittFolge />;
}
