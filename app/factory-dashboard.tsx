"use client";

import { useMemo, useState, type CSSProperties } from "react";
import componentsData from "@/data/components.json";
import categoriesData from "@/data/categories.json";
import themesData from "@/data/themes.json";
import recipesData from "@/data/recipes.json";
import registryMeta from "@/data/registry-meta.json";
import implementationManifest from "@/data/implementation-manifest.json";

type ComponentSpec = (typeof componentsData)[number] & {
  resolvedStatus: string;
  resolvedPath: string | null;
};
type Tab = "components" | "recipes" | "themes" | "agent";

const manifestMap = new Map(implementationManifest.map((item) => [item.id, item]));
const catalog: ComponentSpec[] = componentsData.map((item) => ({
  ...item,
  resolvedStatus: manifestMap.get(item.id)?.status ?? item.status,
  resolvedPath: manifestMap.get(item.id)?.path ?? item.implementationPath,
}));

const tabs: { id: Tab; label: string; count?: number }[] = [
  { id: "components", label: "Components", count: registryMeta.componentCount },
  { id: "recipes", label: "Recipes", count: registryMeta.recipeCount },
  { id: "themes", label: "Themes", count: registryMeta.themeCount },
  { id: "agent", label: "Agent mode" },
];

function shortCategory(value: string) {
  return value.replace(/&/g, "·").split(",")[0];
}

function statusLabel(status: string) {
  return status === "spec" ? "Specification" : status[0].toUpperCase() + status.slice(1);
}

export function FactoryDashboard() {
  const [tab, setTab] = useState<Tab>("components");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");
  const [engine, setEngine] = useState("All engines");
  const [status, setStatus] = useState("All states");
  const [limit, setLimit] = useState(48);
  const [selected, setSelected] = useState<string[]>([]);
  const [detail, setDetail] = useState<ComponentSpec | null>(null);
  const [copied, setCopied] = useState("");

  const engines = useMemo(() => [...new Set(catalog.map((item) => item.engine))].sort(), []);
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return catalog.filter((item) => {
      const matchesSearch = !query || [item.id, item.name, item.category, item.family, item.motif, item.motion, item.engine, item.eventFit].join(" ").toLowerCase().includes(query);
      const matchesCategory = category === "All categories" || item.category === category;
      const matchesEngine = engine === "All engines" || item.engine === engine;
      const matchesStatus = status === "All states" || item.resolvedStatus === status;
      return matchesSearch && matchesCategory && matchesEngine && matchesStatus;
    });
  }, [search, category, engine, status]);

  const selectedSpecs = selected.map((id) => catalog.find((item) => item.id === id)).filter(Boolean) as ComponentSpec[];
  const readyCount = implementationManifest.filter((item) => item.status === "ready").length;

  function toggleSelected(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  async function copyText(text: string, message: string) {
    await navigator.clipboard.writeText(text);
    setCopied(message);
    window.setTimeout(() => setCopied(""), 1800);
  }

  function buildPrompt(items: ComponentSpec[]) {
    const lines = items.map((item) => [
      `${item.id} · ${item.family}`,
      `Layout: ${item.layout}`,
      `Motion: ${item.motion} ${item.trigger}`,
      `Motif and tone: ${item.motif}; ${item.tone}`,
      `Data: ${item.dataFields}`,
      `Fallback: ${item.reducedMotion}`,
      `Status: ${item.resolvedStatus}${item.resolvedPath ? ` at ${item.resolvedPath}` : "; implement and register it"}`,
    ].join("\n")).join("\n\n");
    return `Build a premium mobile-first invitation website inside this repository. Read AGENTS.md, docs/DESIGN_SYSTEM.md, the invitation schema, and the active project data first. Use one coherent theme and the following component specifications:\n\n${lines}\n\nDo not hardcode client content. Use structured invitation data, respect reduced motion, start audio only after consent, and run the repository validation gates before completion.`;
  }

  return (
    <main className="factory-shell">
      <div className="factory-grain" aria-hidden="true" />
      <header className="factory-header">
        <a className="factory-brand" href="#top" aria-label="Invitation Website Factory home">
          <span className="factory-mark">IW<span>/</span>F</span>
          <span><strong>Invitation Website Factory</strong><small>Private production system</small></span>
        </a>
        <nav className="factory-tabs" aria-label="Factory sections">
          {tabs.map((item) => (
            <button key={item.id} className={tab === item.id ? "is-active" : ""} onClick={() => setTab(item.id)}>
              {item.label}{item.count ? <span>{item.count.toLocaleString()}</span> : null}
            </button>
          ))}
        </nav>
        <button className="selection-button" onClick={() => selected.length && setTab("agent")}>
          Selection <span>{selected.length}</span>
        </button>
      </header>

      <section className="factory-hero" id="top">
        <div>
          <p className="factory-kicker"><span /> AI-native invitation production</p>
          <h1>Every premium invitation starts with a better vocabulary.</h1>
          <p className="factory-lede">Search 2,800 distinct component specifications, assemble coherent recipes, and hand any CLI agent an exact build brief grounded in your private design system.</p>
        </div>
        <div className="factory-stats" aria-label="Registry statistics">
          <article><strong>2,800</strong><span>Unique specifications</span><small>0 duplicates</small></article>
          <article><strong>29</strong><span>Component categories</span><small>Complete page grammar</small></article>
          <article><strong>{readyCount}</strong><span>Ready implementations</span><small>{2800 - readyCount} queued to compound</small></article>
          <article><strong>50</strong><span>Website recipes</span><small>Remix, then refine</small></article>
        </div>
      </section>

      {tab === "components" && (
        <section className="factory-workspace">
          <div className="workspace-heading">
            <div><p className="section-index">01 / COMPONENT LIBRARY</p><h2>Find the exact building block.</h2></div>
            <p>{filtered.length.toLocaleString()} matching specifications</p>
          </div>
          <div className="factory-filters">
            <label className="search-field"><span>⌕</span><input value={search} onChange={(event) => { setSearch(event.target.value); setLimit(48); }} placeholder="Search names, motion, motif, ID, event..." /></label>
            <select aria-label="Category" value={category} onChange={(event) => { setCategory(event.target.value); setLimit(48); }}>
              <option>All categories</option>{categoriesData.map((item) => <option key={item.Code}>{item.Category}</option>)}
            </select>
            <select aria-label="Engine" value={engine} onChange={(event) => { setEngine(event.target.value); setLimit(48); }}>
              <option>All engines</option>{engines.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select aria-label="Implementation state" value={status} onChange={(event) => { setStatus(event.target.value); setLimit(48); }}>
              <option>All states</option><option value="ready">Ready</option><option value="qa">QA</option><option value="spec">Specification</option>
            </select>
          </div>
          <div className="component-grid">
            {filtered.slice(0, limit).map((item, index) => {
              const isSelected = selected.includes(item.id);
              return (
                <article className={`component-card ${isSelected ? "is-selected" : ""}`} key={item.id}>
                  <div className="component-card__visual" style={{ "--card-index": index % 8 } as CSSProperties}>
                    <span className="motif-preview">{["✦", "◌", "❋", "◇", "☼", "✺", "⌁", "◍"][index % 8]}</span>
                    <span className="layout-preview"><i /><i /><i /></span>
                    <button aria-label={`${isSelected ? "Remove" : "Add"} ${item.id} ${isSelected ? "from" : "to"} selection`} onClick={() => toggleSelected(item.id)}>{isSelected ? "✓" : "+"}</button>
                  </div>
                  <div className="component-card__body" onClick={() => setDetail(item)} role="button" tabIndex={0} onKeyDown={(event) => event.key === "Enter" && setDetail(item)}>
                    <div className="component-card__meta"><span>{item.id}</span><em className={`status status--${item.resolvedStatus}`}>{statusLabel(item.resolvedStatus)}</em></div>
                    <p>{shortCategory(item.category)}</p>
                    <h3>{item.family}</h3>
                    <div className="component-tags"><span>{item.layout}</span><span>{item.motion}</span></div>
                    <footer><span>{item.engine}</span><span>Impact {item.impact}/5</span></footer>
                  </div>
                </article>
              );
            })}
          </div>
          {!filtered.length && <div className="factory-empty"><strong>No matching component.</strong><p>Try a broader motif, category, engine, or event.</p></div>}
          {limit < filtered.length && <button className="load-more" onClick={() => setLimit((value) => value + 48)}>Load 48 more <span>{filtered.length - limit} remaining</span></button>}
        </section>
      )}

      {tab === "recipes" && (
        <section className="factory-workspace">
          <div className="workspace-heading"><div><p className="section-index">02 / REMIX RECIPES</p><h2>Fifty complete starting compositions.</h2></div><p>Use a recipe as grammar, then make it yours.</p></div>
          <div className="recipe-grid">
            {recipesData.map((recipe, index) => {
              const componentIds = Object.values(recipe).filter((value): value is string => typeof value === "string" && value.startsWith("INV-"));
              return <article className="recipe-card" key={recipe.Recipe}>
                <div className="recipe-card__art"><span>{String(index + 1).padStart(2, "0")}</span><i /><i /><i /></div>
                <p>{recipe.Event}</p><h3>{recipe.Theme}</h3>
                <div className="recipe-components">{componentIds.slice(0, 5).map((id) => <span key={id}>{id}</span>)}<span>+{componentIds.length - 5}</span></div>
                <button onClick={() => { setSelected(componentIds); setTab("agent"); }}>Load recipe <span>↗</span></button>
              </article>;
            })}
          </div>
        </section>
      )}

      {tab === "themes" && (
        <section className="factory-workspace">
          <div className="workspace-heading"><div><p className="section-index">03 / THEME SYSTEMS</p><h2>Art direction with cultural intelligence.</h2></div><p>One primary theme per invitation.</p></div>
          <div className="theme-grid">
            {themesData.map((theme, index) => (
              <article className="theme-card" key={theme["Theme System"]}>
                <div className={`theme-swatch theme-swatch--${index % 8}`}><span /><span /><span /><b>{["अ", "✦", "❋", "◌", "A", "◇", "☼", "⌁"][index % 8]}</b></div>
                <p>{theme.Family}</p><h3>{theme["Theme System"]}</h3><strong>{theme["Palette Direction"]}</strong><small>{theme["Visual Vocabulary"]}</small>
                <div className="theme-note">{theme["Cultural / Production Note"]}</div>
              </article>
            ))}
          </div>
        </section>
      )}

      {tab === "agent" && (
        <section className="factory-workspace agent-workspace">
          <div className="workspace-heading"><div><p className="section-index">04 / AGENT MODE</p><h2>Turn a selection into build context.</h2></div><p>{selected.length} components selected</p></div>
          <div className="agent-layout">
            <article className="agent-panel agent-panel--primary">
              <div className="agent-panel__head"><div><span className="agent-orb">✦</span><p><strong>Agent brief</strong><small>Repository-aware implementation prompt</small></p></div><button disabled={!selected.length} onClick={() => copyText(buildPrompt(selectedSpecs), "Build brief copied")}>Copy brief</button></div>
              {selected.length ? <ol className="agent-selection">{selectedSpecs.map((item, index) => <li key={item.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.family}</strong><small>{item.id} · {item.resolvedStatus}</small></div><button aria-label={`Remove ${item.id}`} onClick={() => toggleSelected(item.id)}>×</button></li>)}</ol> : <div className="agent-empty"><span>⌘</span><h3>Select components or load a recipe.</h3><p>The factory will build a precise prompt containing layout, motion, data, fallback, implementation path, and repository rules.</p><button onClick={() => setTab("components")}>Browse components</button></div>}
            </article>
            <aside className="agent-panel agent-panel--rules">
              <p className="section-index">AGENT CONTRACT</p><h3>Context before code.</h3>
              <ol><li><span>01</span> Read AGENTS.md and project data.</li><li><span>02</span> Lock one theme and motion language.</li><li><span>03</span> Use ready code or implement the spec once.</li><li><span>04</span> Register reusable work for the next project.</li><li><span>05</span> Validate mobile, motion, access, and build.</li></ol>
              <button onClick={() => copyText(`node scripts/build-agent-brief.mjs ${selected.join(" ")}`, "CLI command copied")} disabled={!selected.length}>Copy CLI command</button>
            </aside>
          </div>
        </section>
      )}

      <footer className="factory-footer"><span>IW/F · PRIVATE SYSTEM</span><p>Specifications become components. Components become templates. Every project makes the factory stronger.</p><span>v1.0 / 2026</span></footer>

      {detail && (
        <div className="detail-backdrop" role="presentation" onMouseDown={() => setDetail(null)}>
          <section className="detail-sheet" role="dialog" aria-modal="true" aria-labelledby="detail-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="detail-close" onClick={() => setDetail(null)} aria-label="Close component detail">×</button>
            <p className="section-index">{detail.id} · {detail.category}</p><h2 id="detail-title">{detail.family}</h2><p className="detail-direction">{detail.implementation}</p>
            <div className="detail-grid"><div><span>Layout</span><strong>{detail.layout}</strong></div><div><span>Motion</span><strong>{detail.motion}</strong></div><div><span>Trigger</span><strong>{detail.trigger}</strong></div><div><span>Engine</span><strong>{detail.engine}</strong></div><div><span>Motif</span><strong>{detail.motif}</strong></div><div><span>Tone</span><strong>{detail.tone}</strong></div></div>
            <article><span>Required data</span><p>{detail.dataFields}</p></article><article><span>Reduced-motion fallback</span><p>{detail.reducedMotion}</p></article>
            <div className="detail-actions"><button onClick={() => toggleSelected(detail.id)}>{selected.includes(detail.id) ? "Remove from selection" : "Add to selection"}</button><button onClick={() => copyText(buildPrompt([detail]), "Component brief copied")}>Copy component brief</button></div>
          </section>
        </div>
      )}
      {copied && <div className="copy-toast" role="status">✓ {copied}</div>}
    </main>
  );
}
