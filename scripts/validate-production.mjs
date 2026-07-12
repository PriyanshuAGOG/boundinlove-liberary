import fs from "node:fs";

const templates = JSON.parse(fs.readFileSync("data/production-templates.json", "utf8"));
const allowedSections = new Set(["hero", "countdown", "schedule", "gallery", "venue", "rsvp", "closing"]);
const errors = [];
if (templates.length < 10) errors.push("Production launch requires at least 10 templates");
if (new Set(templates.map((item) => item.id)).size !== templates.length) errors.push("Duplicate production template IDs");
if (new Set(templates.map((item) => item.slug)).size !== templates.length) errors.push("Duplicate production template slugs");
for (const item of templates) {
  if (!item.id || !item.name || !item.theme || item.status !== "ready") errors.push(`${item.id || "Unknown template"} is incomplete`);
  if (!Array.isArray(item.sections) || !item.sections.includes("hero") || !item.sections.includes("closing")) errors.push(`${item.id} needs hero and closing sections`);
  for (const section of item.sections || []) if (!allowedSections.has(section)) errors.push(`${item.id} has unknown section ${section}`);
  if (!Array.isArray(item.palette) || item.palette.length < 3) errors.push(`${item.id} needs a production palette`);
}
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log(JSON.stringify({ status: "valid", templates: templates.length, ready: templates.filter((item) => item.status === "ready").length }));
