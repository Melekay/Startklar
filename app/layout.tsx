import type { Metadata, Viewport } from "next";
import { brand } from "@/config/brand";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { MotionProvider } from "@/components/MotionProvider";
import { THEME_SKRIPT } from "@/components/ThemeToggle";
import { bodyFont, displayFont, monoFont } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${brand.name} – ${brand.claim}`, template: `%s · ${brand.name}` },
  description: brand.beschreibung,
  applicationName: brand.name,
  robots: { index: true, follow: true },
  openGraph: { title: brand.name, description: brand.beschreibung, locale: "de_DE", type: "website" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfaf6" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0c09" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      data-theme="light"
      suppressHydrationWarning
      className={`${displayFont.variable} ${bodyFont.variable} ${monoFont.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SKRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#inhalt"
          className="sr-only z-50 rounded-pille bg-ink px-4 py-2 font-semibold text-bg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Zum Inhalt springen
        </a>
        <MotionProvider>
          <Header />
          <main id="inhalt" className="flex-1">
            {children}
          </main>
          <Footer />
        </MotionProvider>
      </body>
    </html>
  );
}
