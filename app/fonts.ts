import localFont from "next/font/local";

/**
 * Schrift-Paarung (selbst gehostet über next/font, kein Abruf bei Google):
 * Bricolage Grotesque für große Überschriften, Manrope für Fließtext, JetBrains Mono für Befehle.
 */
export const displayFont = localFont({
  src: "../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2",
  variable: "--font-display-face",
  weight: "200 800",
  display: "swap",
});

export const bodyFont = localFont({
  src: "../node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2",
  variable: "--font-body-face",
  weight: "200 800",
  display: "swap",
});

export const monoFont = localFont({
  src: "../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-mono-face",
  weight: "100 800",
  display: "swap",
  preload: false,
});
