import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));

const components = read("data/components.json");
const categories = read("data/categories.json");
const manifest = read("data/implementation-manifest.json");
const errors = [];

if (components.length !== 2800) errors.push(`Expected 2800 specs, found ${components.length}`);
if (new Set(components.map((item) => item.id)).size !== components.length) errors.push("Duplicate component IDs");
if (new Set(components.map((item) => item.signature)).size !== components.length) errors.push("Duplicate uniqueness signatures");
if (categories.length !== 29) errors.push(`Expected 29 categories, found ${categories.length}`);

const knownIds = new Set(components.map((item) => item.id));
for (const item of manifest) {
  if (!knownIds.has(item.id)) errors.push(`Manifest contains unknown ID ${item.id}`);
  if (!["building", "qa", "ready", "deprecated"].includes(item.status)) errors.push(`Invalid manifest status for ${item.id}`);
  if (item.status === "ready" && !item.path) errors.push(`Ready component ${item.id} has no path`);
  if (item.path && !fs.existsSync(path.join(root, item.path))) errors.push(`Missing implementation path for ${item.id}: ${item.path}`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "valid",
  specifications: components.length,
  categories: categories.length,
  implemented: manifest.length,
  ready: manifest.filter((item) => item.status === "ready").length,
}));

