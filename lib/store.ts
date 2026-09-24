"use client";

import { useSyncExternalStore } from "react";
import type { Antworten } from "@/content/typen";
import {
  allesZuruecksetzen,
  browserSpeicher,
  ladeAntworten,
  ladeFortschritt,
  LEERER_FORTSCHRITT,
  SCHLUESSEL,
  speichereAntworten,
  speichereFortschritt,
  type Fortschritt,
  type SpeicherAdapter,
} from "./speicher";

/**
 * Kleiner Client-Store über useSyncExternalStore.
 * Server-Render und erstes Hydrieren sehen „nicht geladen“; danach liest der Client localStorage.
 */

export type Zustand = {
  geladen: boolean;
  dauerhaft: boolean;
  antworten: Antworten;
  fortschritt: Fortschritt;
};

const SERVER_ZUSTAND: Zustand = { geladen: false, dauerhaft: false, antworten: {}, fortschritt: LEERER_FORTSCHRITT };

let speicher: SpeicherAdapter | null = null;
let zustand: Zustand = SERVER_ZUSTAND;
const zuhoerer = new Set<() => void>();

function init() {
  if (speicher || typeof window === "undefined") return;
  speicher = browserSpeicher();
  zustand = {
    geladen: true,
    dauerhaft: speicher.dauerhaft,
    antworten: ladeAntworten(speicher),
    fortschritt: ladeFortschritt(speicher),
  };
}

function melden() {
  zuhoerer.forEach((z) => z());
}

function neuLaden() {
  if (!speicher) return;
  zustand = { ...zustand, antworten: ladeAntworten(speicher), fortschritt: ladeFortschritt(speicher) };
  melden();
}

function abonnieren(z: () => void) {
  init();
  zuhoerer.add(z);
  const beiSpeicher = (e: StorageEvent) => {
    if (e.key === SCHLUESSEL.antworten || e.key === SCHLUESSEL.fortschritt || e.key === null) neuLaden();
  };
  window.addEventListener("storage", beiSpeicher);
  return () => {
    zuhoerer.delete(z);
    window.removeEventListener("storage", beiSpeicher);
  };
}

function schnappschuss() {
  init();
  return zustand;
}

export function useZustand(): Zustand {
  return useSyncExternalStore(abonnieren, schnappschuss, () => SERVER_ZUSTAND);
}

export function setzeAntworten(aendern: (a: Antworten) => Antworten) {
  init();
  const antworten = aendern(zustand.antworten);
  zustand = { ...zustand, antworten };
  if (speicher) speichereAntworten(speicher, antworten);
  melden();
}

export function setzeFortschritt(aendern: (f: Fortschritt) => Fortschritt) {
  init();
  const fortschritt = aendern(zustand.fortschritt);
  zustand = { ...zustand, fortschritt };
  if (speicher) speichereFortschritt(speicher, fortschritt);
  melden();
}

export function zuruecksetzen() {
  init();
  if (speicher) allesZuruecksetzen(speicher);
  zustand = { ...zustand, antworten: {}, fortschritt: { ...LEERER_FORTSCHRITT, erledigt: [] } };
  melden();
}
