# Invitation Design System

## Design principles

1. Emotional before decorative.
2. Mobile-first because most guests open links through messaging apps.
3. One visual story per invitation.
4. Motion reveals meaning and hierarchy. It does not fill empty space.
5. Cultural specificity beats generic “Indian” styling.
6. Premium means controlled contrast, typography, spacing, timing, and media.

## Foundation tokens

```css
:root {
  --invite-bg: #f8f4ec;
  --invite-surface: #fffdf8;
  --invite-ink: #171512;
  --invite-muted: #706a62;
  --invite-accent: #8b2f3d;
  --invite-metal: #bd9153;
  --invite-line: color-mix(in srgb, var(--invite-ink) 14%, transparent);
  --invite-radius-sm: 14px;
  --invite-radius-md: 24px;
  --invite-radius-lg: 40px;
  --invite-section-space: clamp(5rem, 12vw, 10rem);
  --invite-content: 72rem;
  --invite-reading: 42rem;
  --invite-fast: 180ms;
  --invite-base: 520ms;
  --invite-cinematic: 1100ms;
  --invite-ease: cubic-bezier(.22, 1, .36, 1);
}
```

Each project overrides semantic values, never component internals. Components
consume tokens such as `--invite-accent`, not literal theme colours.

## Typography

- Display: expressive serif, calligraphic, editorial sans, or culturally
  appropriate display family.
- Body: highly legible sans or serif with complete language coverage.
- Metadata: compact sans with clear time, venue, and instruction hierarchy.
- Use two families by default and three only when one is a restrained accent.
- Never use a display script for addresses, schedules, buttons, or long copy.

## Spacing and layout

- Base grid: 4px. Primary rhythm: 8, 12, 16, 24, 32, 48, 64, 96.
- Mobile side padding: 20px to 24px.
- Desktop side padding: 48px to 80px.
- Reading widths stay between 34rem and 46rem.
- Touch targets are at least 44px.
- Use safe-area insets for fixed mobile controls.

## Motion language

- Everyday reveal: 420ms to 620ms.
- Microinteraction: 140ms to 220ms.
- Hero or opening sequence: 900ms to 1,600ms, skippable when prolonged.
- Stagger: 35ms to 90ms.
- Use one main reveal and at most two supporting motion behaviours per page.
- Continuous ambient layers must pause when hidden and respect reduced motion.

## Media

- Store focal-point metadata for every important photo.
- Use responsive sizes, modern formats, blur placeholders, and lazy loading.
- Hero media must have a lightweight poster or static alternative.
- Audio begins muted and only after deliberate interaction.
- WebGL receives a static poster and a low-power device fallback.

## Cultural review

Every culturally specific theme requires an explicit vocabulary, forbidden
mixes, sacred-symbol policy, and reviewer note. The theme registry contains the
starting guidance, not final authority for every family or faith.

