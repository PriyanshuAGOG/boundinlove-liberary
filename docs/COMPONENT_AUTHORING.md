# Component Authoring Standard

## Folder contract

```text
components/library/<category>/<ComponentName>/
  ComponentName.tsx
  ComponentName.module.css        optional
  ComponentName.fixture.ts
  ComponentName.preview.tsx
  README.md
```

Small primitives may use a flatter folder, but every public component must be
exported by `components/library/index.ts`.

## Public API rules

- Props are typed and serialisable where practical.
- Content arrives through props or invitation data.
- Theme values arrive through CSS variables or a theme object.
- No network calls inside visual components.
- No direct analytics or payments inside visual components.
- Components expose semantic callbacks such as `onRsvp` or `onOpenMap`.
- Decorative elements use `aria-hidden`.
- Interactive elements use native controls where possible.

## Registry implementation steps

1. Find the component ID in `data/components.json`.
2. Read its layout, motion, trigger, required data, performance cost, and
   reduced-motion behaviour.
3. Implement an original interpretation.
4. Add a fixture and preview.
5. Record the ID and actual source path in
   `data/implementation-manifest.json` with status `qa`.
6. Promote to `ready` only after responsive, keyboard, touch, reduced-motion,
   and performance checks.

## Performance tiers

- Low: CSS, small React state, transform and opacity.
- Medium: Motion/GSAP timelines, SVG drawing, carousel, lightweight particles.
- High: WebGL, shader, video-driven, complex Rive, audio-reactive scenes.

High-cost components are dynamically loaded and never block invitation details.

