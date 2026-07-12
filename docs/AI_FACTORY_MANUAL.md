# AI Factory Manual

## What the factory contains

- `data/components.json`: 2,800 unique, searchable component specifications.
- `data/implementation-manifest.json`: the honest list of coded components.
- `data/recipes.json`: 50 complete invitation compositions.
- `data/themes.json`: 24 art-direction systems with cultural notes.
- `schemas/`: contracts for invitation data, components, themes, and templates.
- `components/library/`: reusable coded components.
- `projects/`: one structured folder for every client or sellable template.
- `templates/`: finished, quality-assured invitation templates.
- `app/`: the internal catalogue dashboard.

## How an AI agent should create a website

### 1. Convert the brief into structured data

Create `projects/<slug>/invitation.json` from
`schemas/invitation.schema.json`. Separate content from presentation so the
same invitation can switch themes or templates without data re-entry.

### 2. Establish one art direction

Choose one theme from `data/themes.json`. Extract a small set of tokens:
background, foreground, accent, muted accent, display font, body font, border,
radius, shadow, ornament density, motion intensity, and media treatment.

### 3. Select the page grammar

A typical premium invitation uses:

1. opening or envelope reveal;
2. hero and primary event information;
3. host, couple, or honouree introduction;
4. story or meaning section;
5. schedule or multi-function cards;
6. venue and travel;
7. gallery;
8. RSVP;
9. closing and factory attribution.

Optional layers include audio, guest personalisation, rituals, dress code,
registry, menus, accommodation, FAQs, wishes, and post-event memories.

### 4. Build from ready code or implement a spec

Search the implementation manifest first. If a component exists, use its public
API. If it does not exist, treat its registry entry as an implementation brief,
build the component once, validate it, then register it for future projects.

### 5. Compose, do not collage

The registry deliberately contains distant concepts. A website should not use
all of them. Select a coherent subset and carry the same visual vocabulary
through every section. Premium work comes from restraint, timing, typography,
photography, and transitions between sections.

### 6. Promote repeated work into the library

After each client project:

- promote reusable sections into `components/library/`;
- add new theme tokens only when they are broadly reusable;
- update the implementation manifest;
- create fixtures and reduced-motion behaviour;
- run the registry validator;
- promote the entire composition to `templates/` only after cross-device QA.

## Project states

`draft → assembling → client-review → qa → delivered → template-candidate`

Component states are separate:

`spec → building → qa → ready → deprecated`

Never confuse a detailed specification with implemented code.

