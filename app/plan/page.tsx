import type { Metadata } from "next";
import { PlanAnsicht } from "./PlanAnsicht";

export const metadata: Metadata = {
  title: "Dein Plan",
  description: "Dein persönlicher Plan: Einstieg, erster Prompt, Beispiele, Verbindungen und Berechtigungsmodus.",
};

export default function PlanSeite() {
  return <PlanAnsicht />;
}
