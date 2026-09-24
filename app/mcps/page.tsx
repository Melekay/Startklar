import type { Metadata } from "next";
import { findeFakt } from "@/content/fakten";
import { mcps, TOKEN_REGEL, WENIGER_IST_MEHR } from "@/content/mcps";
import { Befehl } from "@/components/Befehl";
import { Container } from "@/components/Container";
import { HinweisBox } from "@/components/HinweisBox";
import { McpKarte } from "@/components/McpKarte";
import { Quellen } from "@/components/Quellen";
import { RichText } from "@/components/RichText";
import { Seitenkopf } from "@/components/Seitenkopf";

export const metadata: Metadata = {
  title: "Verbindungen (MCP)",
  description: "Welche MCP-Verbindungen sich für Einsteiger lohnen – und wann nicht.",
};

export default function McpSeite() {
  return (
    <>
      <Seitenkopf
        oberzeile="Nachschlagen"
        titel={<>Verbindungen, die <span className="text-gold-verlauf">passen.</span></>}
        text={<RichText text={`${findeFakt("mcp-definition")!.aussage} Um Daten aus einem anderen Programm zu nutzen, brauchst du eine Verbindung, weil Claude sonst nur deinen Projektordner sieht.`} />}
      />
      <Container>
        <div className="grid gap-4 lg:grid-cols-3">
          <HinweisBox art="tipp" titel="Weniger ist mehr" text={WENIGER_IST_MEHR} />
          <HinweisBox art="achtung" titel="Zugangsdaten schützen" text={TOKEN_REGEL} />
          <HinweisBox art="info" titel="Nur vertrauenswürdige Server" text={findeFakt("mcp-vertrauen")!.aussage} />
        </div>
        <div className="mt-8 max-w-2xl space-y-3">
          <p className="font-semibold">So sieht das allgemeine Muster aus:</p>
          <Befehl faktId="mcp-add" />
          <p className="text-sm text-muted">
            <RichText text={`${findeFakt("mcp-verwalten")!.aussage} ${findeFakt("mcp-connectors")!.aussage}`} />
          </p>
        </div>
        <div className="mt-12 grid gap-5 lg:grid-cols-2">
          {mcps.map((m) => (
            <McpKarte key={m.id} mcp={m} ebene="h2" />
          ))}
        </div>
        <div className="mt-10">
          <Quellen faktIds={["mcp-definition", "mcp-add", "mcp-verwalten", "mcp-vertrauen", "mcp-connectors", "mcp-kosten", "mcp-drittanbieter"]} />
        </div>
      </Container>
    </>
  );
}
