// Augments data/production-templates.json with a distinct opening ceremony and
// a varied Indian raga per template. Deterministic and idempotent: re-running
// only fills or overwrites the `opening`, `raga`, and `cinema` fields.
//
// Usage: node scripts/augment-templates.mjs
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const dataPath = join(here, "..", "data", "production-templates.json");

// Per-theme art direction. `opening` picks one of the choreographed reveal
// mechanics implemented in InvitationOpeningGate + invitation-cinema.css.
// `raga` picks one of the procedural Indian melodies in the audio engine.
// `cinema` tunes the scroll choreography intensity.
const DIRECTION = {
  "noir-editorial": { opening: "curtain", raga: "malkauns", cinema: "editorial" },
  "liquid-gold": { opening: "foil", raga: "yaman", cinema: "liquid" },
  "mughal-moon": { opening: "doors", raga: "yaman", cinema: "processional" },
  "palace-scroll": { opening: "scroll", raga: "desh", cinema: "processional" },
  "phulkari-afterparty": { opening: "ticket", raga: "kafi", cinema: "festival" },
  "alpana-red": { opening: "mandala", raga: "bhairavi", cinema: "ceremonial" },
  "temple-brass": { opening: "diya", raga: "bhairavi", cinema: "ceremonial" },
  "malabar-jasmine": { opening: "petals", raga: "desh", cinema: "drift" },
  "emerald-script": { opening: "doors", raga: "yaman", cinema: "processional" },
  "sufi-night": { opening: "lantern", raga: "bhairavi", cinema: "drift" },
  "coastal-minimal": { opening: "tide", raga: "desh", cinema: "drift" },
  "santorini-blue": { opening: "tide", raga: "desh", cinema: "parallax" },
  "tuscany-olive": { opening: "petals", raga: "bilawal", cinema: "editorial" },
  "paris-couture": { opening: "envelope", raga: "yaman", cinema: "couture" },
  "loft-poster": { opening: "veil", raga: "kafi", cinema: "kinetic" },
  "glasshouse": { opening: "petals", raga: "bilawal", cinema: "drift" },
  "wildflower-notes": { opening: "petals", raga: "desh", cinema: "drift" },
  "deco-after-dark": { opening: "foil", raga: "yaman", cinema: "liquid" },
  "celestial-constellation": { opening: "constellation", raga: "yaman", cinema: "drift" },
  "desert-oasis": { opening: "scroll", raga: "malkauns", cinema: "parallax" },
  "mountain-lodge": { opening: "veil", raga: "bilawal", cinema: "parallax" },
  "tropical-cinema": { opening: "tide", raga: "desh", cinema: "parallax" },
  "cherry-pop": { opening: "ticket", raga: "kafi", cinema: "kinetic" },
  "cobalt-cocktail": { opening: "foil", raga: "kafi", cinema: "liquid" },
  "rose-letterpress": { opening: "envelope", raga: "bilawal", cinema: "editorial" },
  "ivory-script": { opening: "envelope", raga: "bilawal", cinema: "couture" },
  "chapel-light": { opening: "doors", raga: "bilawal", cinema: "ceremonial" },
  "cathedral-noir": { opening: "doors", raga: "malkauns", cinema: "processional" },
  "orchard-brunch": { opening: "petals", raga: "desh", cinema: "drift" },
  "monogram-club": { opening: "veil", raga: "kafi", cinema: "editorial" },
  "chrome-heart": { opening: "foil", raga: "kafi", cinema: "kinetic" },
  "velvet-jazz": { opening: "curtain", raga: "malkauns", cinema: "liquid" },
  "mehndi-market": { opening: "petals", raga: "kafi", cinema: "festival" },
  "haldi-sunburst": { opening: "mandala", raga: "bhairavi", cinema: "festival" },
  "garba-neon": { opening: "ticket", raga: "kafi", cinema: "festival" },
  "sakura-civil": { opening: "petals", raga: "desh", cinema: "drift" },
  "black-white-ball": { opening: "curtain", raga: "malkauns", cinema: "couture" },
  "baroque-candle": { opening: "diya", raga: "yaman", cinema: "ceremonial" },
  "aquarelle-villa": { opening: "petals", raga: "bilawal", cinema: "drift" },
  "cinema-ticket": { opening: "ticket", raga: "kafi", cinema: "kinetic" },
  "rain-city": { opening: "veil", raga: "desh", cinema: "parallax" },
  "scandi-linen": { opening: "veil", raga: "bilawal", cinema: "editorial" },
  "maximal-poppy": { opening: "petals", raga: "kafi", cinema: "kinetic" },
  "lavender-estate": { opening: "petals", raga: "bilawal", cinema: "drift" },
  "jewel-regency": { opening: "box", raga: "yaman", cinema: "couture" },
  "paper-lantern": { opening: "lantern", raga: "desh", cinema: "drift" },
  "museum-opening": { opening: "curtain", raga: "malkauns", cinema: "editorial" },
  "lake-palace": { opening: "doors", raga: "yaman", cinema: "processional" },
  "studio54-sangeet": { opening: "foil", raga: "kafi", cinema: "festival" },
  "founders-family": { opening: "envelope", raga: "bilawal", cinema: "editorial" },
};

// Deterministic fallback for any theme not listed, so the script never fails.
const OPENINGS = ["envelope", "doors", "petals", "foil", "veil", "curtain", "scroll", "mandala"];
const RAGAS = ["yaman", "bhairavi", "desh", "malkauns", "bilawal", "kafi"];
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
}

const templates = JSON.parse(readFileSync(dataPath, "utf8"));
let changed = 0;
for (const template of templates) {
  const direction = DIRECTION[template.theme] || {
    opening: OPENINGS[hash(template.theme) % OPENINGS.length],
    raga: RAGAS[hash(template.slug) % RAGAS.length],
    cinema: template.motion || "drift",
  };
  const next = { opening: direction.opening, raga: direction.raga, cinema: direction.cinema };
  if (template.opening !== next.opening || template.raga !== next.raga || template.cinema !== next.cinema) changed += 1;
  Object.assign(template, next);
}

writeFileSync(dataPath, `${JSON.stringify(templates, null, 2)}\n`);

const dist = (key) =>
  templates.reduce((acc, t) => {
    acc[t[key]] = (acc[t[key]] || 0) + 1;
    return acc;
  }, {});
console.log(`Augmented ${templates.length} templates (${changed} updated).`);
console.log("openings:", dist("opening"));
console.log("ragas:", dist("raga"));
console.log("cinema:", dist("cinema"));
