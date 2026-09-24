import Link from "next/link";
import { brand } from "@/config/brand";

/** Wortmarke: Name + goldener Punkt (bewusst kein fremdes Logo). */
export function Logo() {
  return (
    <Link href="/" className="group inline-flex items-center gap-2 font-display text-xl font-bold tracking-tight">
      <span aria-hidden="true" className="relative grid size-8 place-items-center rounded-xl bg-ink text-bg shadow-soft transition group-hover:rotate-6">
        <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-gold-300 to-gold-600 opacity-90" />
        <span className="relative text-sm font-extrabold text-on-accent">{brand.name.charAt(0)}</span>
      </span>
      <span>
        {brand.name}
        <span className="text-accent">.</span>
      </span>
    </Link>
  );
}
