"use client";

import { useSyncExternalStore } from "react";
import { SCHLUESSEL } from "@/lib/speicher";
import { Icon } from "./Icon";

type Theme = "light" | "dark";

function aktuell(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function abonnieren(z: () => void) {
  const beobachter = new MutationObserver(z);
  beobachter.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => beobachter.disconnect();
}

/** Umschalter hell/dunkel. Die Wahl wird (falls möglich) im Browser gemerkt. */
export function ThemeToggle() {
  const theme = useSyncExternalStore<Theme | null>(abonnieren, aktuell, () => null);

  function umschalten() {
    const neu: Theme = aktuell() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = neu;
    try {
      localStorage.setItem(SCHLUESSEL.theme, neu);
    } catch {
      /* ohne Speicher gilt die Wahl nur bis zum Neuladen */
    }
  }

  const dunkel = theme === "dark";
  return (
    <button
      type="button"
      onClick={umschalten}
      aria-label={dunkel ? "Hellen Modus einschalten" : "Dunklen Modus einschalten"}
      className="grid size-11 place-items-center rounded-pille border border-line bg-surface text-ink transition hover:border-accent"
    >
      <Icon name={dunkel ? "sun" : "moon"} size={18} />
    </button>
  );
}

/** Läuft vor dem ersten Zeichnen, damit es kein Aufblitzen gibt. */
export const THEME_SKRIPT = `(function(){var t=null;try{t=localStorage.getItem(${JSON.stringify(SCHLUESSEL.theme)})}catch(e){}var d=t==="dark"||(t!=="light"&&window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.dataset.theme=d?"dark":"light"})();`;
