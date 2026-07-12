# Invitation Website Factory

Private AI-native production repository for building premium invitation
websites from a structured design system, 2,800 unique component
specifications, reusable coded components, complete website recipes, and
agent-readable project data.

## Start here

1. Read `AGENTS.md`.
2. Open the internal catalogue dashboard with `npm run dev`.
3. Create a project:

```bash
node scripts/create-project.mjs --slug aarav-meera --recipe SITE-01
```

4. Replace placeholder data in `projects/aarav-meera/invitation.json`.
5. Generate an agent brief:

```bash
npm run agent:brief -- INV-HER-0001 INV-SCH-0001 INV-VEN-0001 INV-RSV-0001
```

6. Ask the AI agent to build the project using the generated context and
   repository rules.

## Registry model

The 2,800 entries are unique implementation specifications. The
`data/implementation-manifest.json` file is the honest source of truth for what
has already been coded. When an agent implements a specification, it promotes
that work into the reusable component library and registers its path. This
means every paid client project can make future projects faster.

## Important paths

```text
AGENTS.md                       agent operating contract
app/                            internal visual catalogue
components/library/             reusable coded invitation components
data/components.json            2,800 searchable specifications
data/implementation-manifest.json coded-component truth
data/recipes.json               50 complete compositions
data/themes.json                24 theme systems
docs/                           design and authoring standards
projects/                       client and internal invitation projects
schemas/                        component, invitation, and template contracts
templates/                      sellable quality-assured templates
```

## Validation

```bash
npm run registry:validate
npm run lint
npm run build
```

## Registry regeneration

The canonical research workbook is stored at
`docs/reference/Invitation_Component_Library_2800.xlsx`.

```bash
npm run registry:extract
```

