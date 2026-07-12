# Template Authoring Standard

A template is a tested composition of components, theme tokens, content rules,
and media slots. It is not a screenshot or a hardcoded client website.

## Required template files

```text
templates/<template-slug>/
  template.json
  preview-data.json
  README.md
  thumbnail.webp
```

`template.json` must validate against `schemas/template.schema.json` and record:

- template ID, name, tier, and supported events;
- primary theme and optional accent theme;
- ordered component IDs;
- content requirements and optional sections;
- media slot dimensions and focal-point rules;
- performance tier and fallback policy;
- factory attribution behaviour;
- QA devices and completion state.

## Template quality gate

- no client names or assets;
- complete with both short and long names;
- complete with missing optional sections;
- works with one event and multi-day schedules;
- supports reduced motion;
- loads essential details before decorative media;
- screenshot-tested on target breakpoints;
- all component IDs resolve to ready implementations.

