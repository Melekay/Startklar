import type { Metadata } from "next";
import { beispiele } from "@/content/beispiele";
import { Seitenkopf } from "@/components/Seitenkopf";
import { BeispielListe } from "./BeispielListe";

export const metadata: Metadata = {
  title: "Beispiele",
  description: `${beispiele.length} Einstiegs-Aufgaben für Claude Code – mit kopierbarem Prompt und „Fertig, wenn …“.`,
};

export default function BeispielSeite() {
  return (
    <>
      <Seitenkopf
        oberzeile="Nachschlagen"
        titel={<>Lernen durch <span className="text-gold-verlauf">Machen.</span></>}
        text={`${beispiele.length} Aufgaben, die viele Einsteiger als Erstes lösen. Jede mit einem Prompt zum Kopieren und einer klaren Aussage, wann du fertig bist.`}
      />
      <BeispielListe />
    </>
  );
}
