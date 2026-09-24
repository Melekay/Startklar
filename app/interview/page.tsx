import type { Metadata } from "next";
import { InterviewAblauf } from "./InterviewAblauf";

export const metadata: Metadata = {
  title: "Interview",
  description: "18 kurze Fragen – danach bekommst du deinen persönlichen Plan für Claude Code.",
};

export default function InterviewSeite() {
  return <InterviewAblauf />;
}
