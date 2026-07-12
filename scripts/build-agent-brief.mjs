import fs from "node:fs";

const ids = process.argv.slice(2);
const components = JSON.parse(fs.readFileSync("data/components.json", "utf8"));
const manifest = JSON.parse(fs.readFileSync("data/implementation-manifest.json", "utf8"));
const implemented = new Map(manifest.map((item) => [item.id, item]));
const index = new Map(components.map((item) => [item.id, item]));

if (!ids.length) {
  console.error("Pass one or more component IDs, for example INV-HER-0001 INV-SCH-0001");
  process.exit(1);
}

const selected = ids.map((id) => index.get(id)).filter(Boolean);
if (selected.length !== ids.length) {
  const found = new Set(selected.map((item) => item.id));
  console.error(`Unknown component IDs: ${ids.filter((id) => !found.has(id)).join(", ")}`);
  process.exit(1);
}

console.log("# Invitation Agent Build Brief\n");
console.log("Read `AGENTS.md`, `docs/DESIGN_SYSTEM.md`, and the project invitation data before implementation.\n");
for (const item of selected) {
  const impl = implemented.get(item.id);
  console.log(`## ${item.id} · ${item.family}`);
  console.log(`- Status: ${impl?.status ?? "spec only"}`);
  console.log(`- Implementation path: ${impl?.path ?? "Build and register an original implementation"}`);
  console.log(`- Category: ${item.category}`);
  console.log(`- Layout: ${item.layout}`);
  console.log(`- Motion: ${item.motion} · ${item.trigger}`);
  console.log(`- Direction: ${item.implementation}`);
  console.log(`- Data: ${item.dataFields}`);
  console.log(`- Reduced motion: ${item.reducedMotion}`);
  console.log(`- Performance: ${item.performance} · difficulty ${item.difficulty}/5\n`);
}

console.log("## Composition rules\n");
console.log("Use one theme, one typography pair, one motif family, and a restrained motion language. Do not treat unrelated specifications as a collage. All content comes from structured invitation data.");

