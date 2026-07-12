# Invitation Website Factory

This repository is an AI-native private production system for designing and
building premium invitation websites. It contains a canonical registry of
2,800 unique component specifications, implementation manifests, design tokens,
schemas, complete-site recipes, source references, authoring rules, and an
internal catalogue dashboard.

## Mission

Generate original, mobile-first invitation websites quickly without producing
generic template mashups. The component registry is a vocabulary. A finished
website must feel like one coherent art direction.

## Source-of-truth order

1. The current client brief and `projects/<slug>/invitation.json`.
2. `docs/DESIGN_SYSTEM.md` and the selected theme in `data/themes.json`.
3. `projects/<slug>/selection.json` and component specifications in
   `data/components.json`.
4. Ready code registered in `data/implementation-manifest.json`.
5. `docs/COMPONENT_AUTHORING.md`, `docs/TEMPLATE_AUTHORING.md`, and schemas.
6. `docs/reference/Invitation_Component_Library_2800.xlsx` for audit detail.

## Required agent workflow

1. Read `data/registry-meta.json` and this file.
2. Create or inspect `projects/<slug>/invitation.json`.
3. Choose exactly one primary theme and optionally one restrained accent theme.
4. Select components by ID. Use 8 to 16 components for a normal invitation.
5. Run `npm run agent:brief -- <component ids>` to generate implementation
   context.
6. Check `data/implementation-manifest.json` before importing a component.
7. If a selected component is only a specification, implement it in
   `components/library/<category>/`, add a preview, then register its path and
   status in the implementation manifest.
8. Build the invitation using structured data. Never hardcode client names,
   dates, addresses, contact details, gallery items, or event schedules.
9. Test at 360px, 390px, 430px, 768px, and 1440px.
10. Run `npm run registry:validate`, `npm run lint`, and `npm run build`.

## Non-negotiable rules

- A specification is not production code. Never import a component unless the
  implementation manifest marks it `ready` or `qa` and provides a real path.
- Do not build a page by stacking unrelated animations. Reuse one motion
  language, one spacing rhythm, one typography system, and one motif family.
- Every animation needs a meaningful final static state and reduced-motion
  behaviour.
- Never autoplay audible music. Audio starts only after deliberate interaction.
- Use transform and opacity for routine motion. Load WebGL, Rive, Lottie, audio,
  and video only when their section becomes relevant.
- Keep the first mobile viewport useful before heavy assets arrive.
- Use semantic HTML, keyboard-safe controls, visible focus states, useful alt
  text, and adequate contrast.
- Sacred text and religious symbols are not decorative particles, morph
  targets, hover toys, or loading icons.
- Finished free and standard invitations use the configured factory credit.
  White-label and bespoke projects may disable it through invitation data.
- Do not copy another invitation business's composition, artwork, template, or
  visual identity. External sources are capability references.

## Definition of ready

A component can be marked `ready` only when it includes:

- typed props and structured-data compatibility;
- mobile and desktop layouts;
- empty, loading, and error-safe behaviour where relevant;
- reduced-motion treatment;
- keyboard and touch QA;
- a catalogue preview or fixture;
- source and licence provenance for external code or assets;
- no client-specific hardcoding.

## Useful commands

```bash
npm run registry:extract
npm run registry:validate
npm run agent:brief -- INV-HER-0001 INV-SCH-0001 INV-RSV-0001
node scripts/create-project.mjs --slug aarav-meera --recipe SITE-01
```

