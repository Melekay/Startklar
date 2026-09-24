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
        className="pointer-events-none invisible absolute bottom-full left-1/2 z-30 mb-2 w-64 -translate-x-1/2 rounded-xl border border-line bg-surface p-3 text-left text-sm font-normal leading-snug text-ink opacity-0 shadow-lift transition-opacity group-focus-within/begriff:visible group-focus-within/begriff:opacity-100 group-hover/begriff:visible group-hover/begriff:opacity-100"
      >
        <strong className="block font-display text-accent">{begriff.begriff}</strong>
        {begriff.kurz}
      </span>
    </span>
  );
}
