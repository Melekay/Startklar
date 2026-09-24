"use client";

import { Icon } from "./Icon";

export function DruckenButton({ label = "Drucken" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print inline-flex min-h-12 items-center gap-2 rounded-pille bg-ink px-6 font-bold text-bg transition hover:-translate-y-0.5"
    >
      <Icon name="print" size={18} /> {label}
    </button>
  );
}
