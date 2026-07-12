import fs from "node:fs";
import path from "node:path";

const args = process.argv.slice(2);
const valueAfter = (flag) => args[args.indexOf(flag) + 1];
const slug = valueAfter("--slug");
const recipeId = valueAfter("--recipe") || "SITE-01";

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("Use --slug with lowercase letters, numbers, and hyphens");
  process.exit(1);
}

const recipes = JSON.parse(fs.readFileSync("data/recipes.json", "utf8"));
const recipe = recipes.find((item) => item.Recipe === recipeId);
if (!recipe) {
  console.error(`Unknown recipe ${recipeId}`);
  process.exit(1);
}

const directory = path.join("projects", slug);
if (fs.existsSync(directory)) {
  console.error(`Project already exists: ${directory}`);
  process.exit(1);
}
fs.mkdirSync(directory, { recursive: true });

const invitation = {
  slug,
  eventType: recipe.Event,
  locale: "en-IN",
  timezone: "Asia/Kolkata",
  hosts: [{ name: "Host One", role: "Host" }, { name: "Host Two", role: "Host" }],
  headline: "Together with our families",
  message: "We would be delighted to celebrate with you.",
  events: [{
    id: "main-event",
    title: recipe.Event,
    start: "2026-12-01T18:00:00+05:30",
    venue: { name: "Venue name", address: "Venue address", mapUrl: null }
  }],
  theme: { id: recipe.Theme, accentId: null, overrides: {} },
  gallery: [],
  story: [],
  rsvp: { enabled: true },
  audio: null,
  branding: { showFactoryCredit: true, factoryUrl: null }
};

const componentIds = Object.entries(recipe)
  .filter(([key, value]) => !["Recipe", "Event", "Theme"].includes(key) && typeof value === "string" && value.startsWith("INV-"))
  .map(([slot, id]) => ({ slot, id }));

fs.writeFileSync(path.join(directory, "invitation.json"), JSON.stringify(invitation, null, 2));
fs.writeFileSync(path.join(directory, "selection.json"), JSON.stringify({ recipeId, componentIds }, null, 2));
fs.writeFileSync(path.join(directory, "README.md"), `# ${slug}\n\nCreated from ${recipeId}. Replace all placeholder invitation data before implementation.\n`);

console.log(JSON.stringify({ project: directory, recipe: recipeId, components: componentIds.length }));

