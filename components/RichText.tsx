import { Fragment } from "react";
import { zerlegeText } from "@/lib/text";
import { Begriff } from "./Begriff";

/** Rendert Inhaltstexte mit {{fakt:…}}, [[begriff]] und `code`. */
export function RichText({ text }: { text: string }) {
  return (
    <>
      {zerlegeText(text).map((teil, i) => {
        if (teil.art === "code") {
          return (
            <code
              key={i}
              className="whitespace-nowrap rounded-md border border-line bg-surface-2 px-1.5 py-0.5 text-[0.88em] text-ink"
            >
              {teil.text}
            </code>
          );
        }
        if (teil.art === "begriff") {
          return (
            <Begriff key={i} id={teil.id}>
              {teil.text}
            </Begriff>
          );
        }
        return <Fragment key={i}>{teil.text}</Fragment>;
      })}
    </>
  );
}
