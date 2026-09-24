"use client";

import { motion } from "framer-motion";
import type { Antworten } from "@/content/typen";
import { PlanVorschau } from "./PlanVorschau";

const BEISPIEL: Antworten = {
  name: "Alex",
  bereich: "selbststaendig",
  code: "keine",
  terminal: "nie",
  ziel: ["bauen"],
  idee: "eine Website für meinen Yoga-Kurs",
  os: "mac",
  abo: "pro",
  tools: ["notion"],
  kontrolle: "jeder",
};

/** Beispiel-Plan als Schaubild auf der Startseite (schwebt sanft, außer bei reduzierter Bewegung). */
export function HeroVorschau() {
  return (
    <motion.div
      aria-hidden="true"
      inert
      initial={{ opacity: 0, y: 30, rotate: 2 }}
      animate={{ opacity: 1, y: [0, -8, 0], rotate: 2 }}
      transition={{ opacity: { duration: 0.6 }, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
      className="relative mx-auto w-full max-w-sm"
    >
      <div className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-gradient-to-br from-gold-300/50 via-gold-100/20 to-transparent blur-2xl dark:from-gold-500/25" />
      <PlanVorschau antworten={BEISPIEL} />
    </motion.div>
  );
}
