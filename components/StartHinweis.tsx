/**
 * Warnt, wenn die App nicht richtig laufen kann:
 * - JavaScript ist aus (noscript)
 * - die HTML-Datei wurde direkt geöffnet (file://) – dann lädt der Browser kein JavaScript,
 *   die Seite sieht normal aus, aber Knöpfe reagieren nicht.
 * Das kleine Inline-Skript läuft auch dann, wenn die übrigen Skripte nicht laden.
 */
const KLASSE =
  "no-print border-b-2 border-warn-line bg-warn-bg px-5 py-4 text-center text-sm font-semibold leading-relaxed text-ink sm:text-base";

const HINWEIS_DATEI =
  "Die App wurde als Datei geöffnet – so reagieren die Knöpfe nicht. Starte sie im Projektordner mit „npm run dev“ und öffne http://localhost:3000.";

/** Inline, weil bei file:// auch das Stylesheet nicht lädt. */
const STIL: React.CSSProperties = {
  background: "#fff6d6",
  color: "#17140e",
  borderBottom: "2px solid #e6c250",
  padding: "16px 20px",
  fontFamily: "system-ui, sans-serif",
  fontWeight: 600,
  textAlign: "center",
};

export function StartHinweis() {
  return (
    <>
      <noscript>
        <div role="alert" className={KLASSE} style={STIL}>
          Diese App braucht JavaScript. Bitte schalte es in deinem Browser ein.
        </div>
      </noscript>
      <div id="datei-hinweis" role="alert" hidden className={KLASSE} style={STIL}>
        {HINWEIS_DATEI}
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `if(location.protocol==="file:"){var h=document.getElementById("datei-hinweis");if(h)h.hidden=false}`,
        }}
      />
    </>
  );
}
