"use client";

import Link from "next/link";
import { useId } from "react";
import { findeBegriff } from "@/content/glossar";

/** Fachbegriff mit Ein-Satz-Erklärung als Tooltip (Hover und Tastaturfokus) und Link ins Glossar. */
export function Begriff({ id, children }: { id: string; children: React.ReactNode }) {
  const tooltipId = useId();
  const begriff = findeBegriff(id);
  if (!begriff) return <>{children}</>;
  return (
    <span className="group/begriff relative inline">
      <Link
        href={`/glossar#${begriff.id}`}
        aria-describedby={tooltipId}
        className="font-semibold text-ink underline decoration-accent decoration-dotted decoration-2 underline-offset-4 hover:decoration-solid"
      >
        {children}
      </Link>
      <span
        id={tooltipId}
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 hidden w-[min(16rem,75vw)] -translate-x-1/2 rounded-xl border border-line bg-surface p-3 text-left text-sm font-normal leading-snug text-ink shadow-lift group-focus-within/begriff:block group-hover/begriff:block"
      >
        <strong className="block font-display text-accent">{begriff.begriff}</strong>
        {begriff.kurz}
      </span>
    </span>
  );
}
