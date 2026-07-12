# Ready Component Library

This directory contains real reusable code. The complete idea registry lives in
`data/components.json`; the mapping from registry ID to coded component lives in
`data/implementation-manifest.json`.

Import the shared invitation CSS once in the consuming application:

```ts
import "@/components/library/invitation.css";
```

Then import components through the barrel:

```ts
import { EditorialNamesHero, EventTimeline } from "@/components/library";
```

