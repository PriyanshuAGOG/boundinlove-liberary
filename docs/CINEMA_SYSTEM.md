# Invitation Cinema System

The upgrade that turns the 50 templates from palette-swapped clones into
distinct, cinematic experiences. Three engines drive it, all data-first and
reduced-motion safe.

## What every template now has

- **A unique opening ceremony.** Each template is assigned one of 14 reveal
  mechanics (`envelope, doors, curtain, petals, mandala, foil, diya,
  constellation, lantern, tide, scroll, ticket, box, veil`). The card is a
  full-screen sealed gate; the guest taps *Open the invitation* to break the
  seal. Nothing behind the gate scrolls until it is opened.
- **Indian classical music on open.** A procedural raga (`yaman, bhairavi,
  desh, malkauns, bilawal, kafi`) — tanpura drone + plucked sitar/santoor/
  bansuri lead + optional tabla — starts only after the deliberate tap. Never
  autoplays. A floating control mutes/unmutes and names the raga.
- **A single-video scroll.** Sections are "scenes" that fade, lift, scale and
  unblur into place as they enter, each with its own entrance direction, tuned
  per template `cinema` family. A top progress rail and drifting atmosphere
  layers tie the sequence together.
- **A layout-specific hero.** The `layout` field (`poster, cinematic, arch,
  scroll, split, rail, centered, magazine, kinetic, gallery`) now renders a
  visibly different first screen.

## Where it lives

| Concern | File |
| --- | --- |
| Opening mechanics (markup) | `components/factory/InvitationOpeningGate.tsx` |
| Opening mechanics (motion) | `components/library/invitation-cinema.css` |
| Raga audio engine | `components/factory/ragaEngine.ts` |
| Scroll choreography hook | `components/factory/useScrollCinema.ts` |
| Scene wrapping + wiring | `components/factory/InvitationRenderer.tsx` |
| Per-template art direction | `data/production-templates.json` (`opening`, `raga`, `cinema`) |
| Assignment script | `scripts/augment-templates.mjs` |

Re-run `node scripts/augment-templates.mjs` after editing the `DIRECTION` map to
re-assign openings/ragas/cinema across all templates. It is deterministic and
idempotent.

## Adding a new opening mechanic

1. Add a `case` to `OpeningScenery` in `InvitationOpeningGate.tsx` emitting the
   structural nodes.
2. Add the resting animation and the `.is-open` exit animation in
   `invitation-cinema.css`, keyed on `.invite-gate[data-opening="<name>"]`.
3. Reference the name in the `DIRECTION` map and re-run the augment script.

## Adding a new raga

Add an entry to `RAGAS` in `ragaEngine.ts` with its `swaras` (scale degrees),
`tonic`, `pace`, `colour` and `percussion`, then reference it in `DIRECTION`.

## Roadmap to fully-bespoke flagships

This system lifts the whole library and makes each template distinct. The next
tier is hand-built art direction per flagship: bespoke section layouts (not just
the shared scenes), real photography/illustration, custom motifs, and per-theme
type pairings. The renderer is structured so a template can opt into a bespoke
scene component while inheriting the gate, raga and scroll engines unchanged.
