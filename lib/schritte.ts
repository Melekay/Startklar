import { findeSchritt } from "@/content/schritte";
import type { Betriebssystem, EinstiegsWeg, Plan, Schritt, SchrittVariante } from "@/content/typen";

/**
 * Wählt die passende Anleitung eines Schritts (reine Funktion).
 * Reihenfolge: erste Variante, die zu Weg UND System passt; sonst die erste, die zum Weg passt.
 */
export function waehleVariante(schritt: Schritt, weg: EinstiegsWeg, os?: Betriebssystem): SchrittVariante {
  const passtWeg = (v: SchrittVariante) => !v.wege?.length || v.wege.includes(weg);
  const passtOs = (v: SchrittVariante) => !v.systeme?.length || (os !== undefined && v.systeme.includes(os));
  return (
    schritt.varianten.find((v) => passtWeg(v) && passtOs(v)) ??
    schritt.varianten.find((v) => passtWeg(v) && !v.systeme?.length) ??
    schritt.varianten[0]
  );
}

export type PlanSchritt = { schritt: Schritt; optional: boolean; optionalGrund?: string };

export function schritteAusPlan(plan: Plan): PlanSchritt[] {
  return plan.schritte.flatMap((s) => {
    const schritt = findeSchritt(s.schrittId);
    return schritt ? [{ schritt, optional: s.optional, optionalGrund: s.optionalGrund }] : [];
  });
}
