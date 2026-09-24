/**
 * Gemeinsame Typen für alle Inhalte und die Empfehlungslogik.
 *
 * Textfelder in Inhalten dürfen zwei Auszeichnungen enthalten:
 *   [[begriff-id]] oder [[begriff-id|Anzeigetext]]  → Glossar-Verweis mit Tooltip
 *   {{fakt:fakt-id}}                               → Wert aus content/fakten.ts
 *   `code`                                          → Inline-Code
 * Das Validierungsskript prüft, dass alle Verweise existieren.
 */

// ---------- Antworten des Interviews ----------

export type Bereich =
  | "buero"
  | "it"
  | "marketing"
  | "selbststaendig"
  | "studium"
  | "kreativ"
  | "gesundheit"
  | "sonstiges";

export type Ziel =
  | "bauen"
  | "buero"
  | "ordnen"
  | "schreiben"
  | "programmieren"
  | "lernen"
  | "unklar";

export type AlltagsTool =
  | "google"
  | "notion"
  | "slack"
  | "kalendermail"
  | "jiralinear"
  | "datenbank"
  | "keine";

export type Antworten = {
  name?: string;
  bereich?: Bereich;
  code?: "keine" | "etwas" | "gut";
  ki?: "chat" | "claude" | "claudecode";
  terminal?: "nie" | "schonmal" | "sicher";
  ziel?: Ziel[];
  idee?: string;
  haeufigkeit?: "einmalig" | "wiederkehrend" | "beides";
  os?: "windows" | "mac" | "linux" | "mobil";
  abo?: "keins" | "gratis" | "pro" | "max" | "team" | "api" | "unbekannt";
  github?: "nein" | "ja" | "unbekannt";
  rechner?: "privat" | "firma" | "beides";
  tools?: AlltagsTool[];
  sensibel?: "nein" | "manchmal" | "ja";
  zeit?: "10min" | "1h" | "abend" | "wochenende";
  lernstil?: "klein" | "ueberblick" | "beispiel";
  kontrolle?: "jeder" | "ausgewogen" | "selbst";
  kosten?: "sehr" | "etwas" | "egal";
};

export type FrageId = keyof Antworten;

// ---------- Fragen ----------

export type Option = {
  wert: string;
  label: string;
  /** Kurzer Zusatz unter dem Label. */
  hinweis?: string;
  /** Name eines Icons aus components/Icon.tsx */
  icon?: string;
  /** Wählt man diese Option, werden alle anderen abgewählt (z. B. „Keine“). */
  exklusiv?: boolean;
};

export type Frage = {
  id: FrageId;
  block: 1 | 2 | 3 | 4;
  frage: string;
  /** Satz „Warum fragen wir das?“ */
  warum: string;
  typ: "einzel" | "mehrfach" | "text";
  pflicht: boolean;
  optionen?: Option[];
  maxAuswahl?: number;
  platzhalter?: string[];
  /** Wird verwendet, wenn die Frage übersprungen wird. Pflichtfragen haben keinen. */
  standard?: string | string[];
  /** Kurzer Erklärtext unter der Frage, darf [[glossar]]-Verweise enthalten. */
  erklaerung?: string;
};

// ---------- Fakten ----------

export type Fakt = {
  id: string;
  /** Die Aussage in einfachem Deutsch. */
  aussage: string;
  /** Optional: exakter Wert, z. B. ein Befehl oder Tastenkürzel. */
  wert?: string;
  quelle: string;
  /** ISO-Datum JJJJ-MM-TT */
  geprueftAm: string;
  /** false = nicht in der offiziellen Doku belegt → App zeigt „bitte prüfen“. */
  belegt: boolean;
};

// ---------- Beispiele ----------

export type Schwierigkeit = "leicht" | "mittel" | "fortgeschritten";

export type Beispiel = {
  id: string;
  titel: string;
  kurz: string;
  warumNuetzlich: string;
  schwierigkeit: Schwierigkeit;
  dauerMin: number;
  /** Bereich- und Ziel-IDs, nach denen bewertet wird. */
  tags: (Bereich | Ziel)[];
  brauchtGithub: boolean;
  brauchtMcp: boolean;
  ersterPrompt: string;
  fertigWenn: string;
  sensibel: boolean;
  /** Pflicht, wenn sensibel = true. Sonst leerer String erlaubt. */
  dummyDatenHinweis: string;
  icon: string;
};

// ---------- MCP-Verbindungen ----------

export type Mcp = {
  id: string;
  name: string;
  wozu: string;
  fuerWen: string;
  voraussetzung: string;
  risiko: string;
  wannNicht: string;
  docsUrl: string;
  /** Nur mit Befehl aus der offiziellen Doku (über {{fakt:…}}), sonst Verweis auf die Doku. */
  installHinweis: string;
  /** Befehl kommt aus fakten.ts; leer = kein bestätigter Befehl. */
  installFaktId?: string;
  passtZuTools: AlltagsTool[];
  passtZuZielen: Ziel[];
  /** Mindest-Erfahrung, ab der wir die Verbindung „jetzt“ empfehlen. */
  abErfahrung: "keine" | "etwas" | "gut";
  brauchtGithub: boolean;
  icon: string;
};

// ---------- Schritte ----------

export type EinstiegsWeg = "desktop" | "terminal" | "web";
export type Betriebssystem = "windows" | "mac" | "linux" | "mobil";

export type DiagrammKnoten = { icon: string; label: string };

export type SchrittVariante = {
  /** Für welche Einstiegswege gilt die Variante? Leer/undefined = alle. */
  wege?: EinstiegsWeg[];
  /** Für welche Systeme? Leer/undefined = alle. */
  systeme?: Betriebssystem[];
  anleitung: string[];
  /** Optionaler Befehl aus fakten.ts zum Kopieren. */
  befehlFaktIds?: string[];
};

export type Schritt = {
  id: string;
  titel: string;
  ziel: string;
  warum: string;
  diagramm: DiagrammKnoten[];
  varianten: SchrittVariante[];
  fertigWenn: string;
  haeufigeFehler: string[];
  quellenFaktIds: string[];
  icon: string;
};

// ---------- Glossar ----------

export type Begriff = {
  id: string;
  begriff: string;
  /** Genau ein Satz. */
  kurz: string;
  lang?: string;
  beispiel?: string;
};

// ---------- Plan (Ausgabe der Empfehlungslogik) ----------

export type Einstieg = {
  weg: EinstiegsWeg;
  titel: string;
  begruendung: string;
  spaeter?: string;
};

export type Voraussetzung = {
  id: string;
  titel: string;
  text: string;
  optional: boolean;
  link?: { href: string; label: string };
};

export type BeispielEmpfehlung = {
  beispielId: string;
  grund: string;
  /** Mit erfundenen Beispieldaten üben. */
  mitDummyDaten: boolean;
};

export type McpEmpfehlung = { mcpId: string; grund: string };

export type ModusEmpfehlung = {
  modus: "default" | "acceptEdits" | "plan" | "auto";
  label: string;
  erklaerung: string;
  warnung?: string;
  planModeTipp: string;
};

export type Hinweis = {
  id: string;
  art: "info" | "achtung" | "tipp";
  titel: string;
  text: string;
};

export type SchrittImPlan = {
  schrittId: string;
  /** Darf übersprungen werden (z. B. weil schon erledigt). */
  optional: boolean;
  optionalGrund?: string;
};

export type Plan = {
  anrede: string;
  einstieg: Einstieg;
  voraussetzungen: Voraussetzung[];
  beispiele: BeispielEmpfehlung[];
  mcps: { jetzt: McpEmpfehlung[]; spaeter: McpEmpfehlung[]; begruendung: string };
  modus: ModusEmpfehlung;
  hinweise: Hinweis[];
  ersterPrompt: string;
  schritte: SchrittImPlan[];
  lernstil: "klein" | "ueberblick" | "beispiel";
};
