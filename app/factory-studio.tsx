"use client";

import { useMemo, useState } from "react";
import templatesData from "@/data/production-templates.json";
import registryMeta from "@/data/registry-meta.json";
import implementationManifest from "@/data/implementation-manifest.json";
import { InvitationRenderer } from "@/components/factory/InvitationRenderer";
import { demoInvitation, type ProductionTemplate, type StudioInvitation } from "@/components/factory/types";

type View = "overview" | "templates" | "studio" | "library";
type Device = "mobile" | "tablet" | "desktop";
const templates = templatesData as ProductionTemplate[];

function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

export function FactoryStudio() {
  const [view, setView] = useState<View>("overview");
  const [templateId, setTemplateId] = useState(templates[0].id);
  const [invitation, setInvitation] = useState<StudioInvitation>(demoInvitation);
  const [device, setDevice] = useState<Device>("mobile");
  const [step, setStep] = useState(1);
  const [notice, setNotice] = useState("");
  const template = templates.find((item) => item.id === templateId) ?? templates[0];
  const readiness = useMemo(() => [
    { label: "Host names", ok: invitation.hosts.every((host) => host.name.trim().length > 1) },
    { label: "Event date", ok: invitation.events.every((event) => !Number.isNaN(new Date(event.start).getTime())) },
    { label: "Venue", ok: invitation.events.every((event) => event.venue.name.trim() && event.venue.address.trim()) },
    { label: "Invitation copy", ok: invitation.message.trim().length > 20 },
    { label: "Publish slug", ok: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(invitation.slug) },
  ], [invitation]);
  const ready = readiness.every((item) => item.ok);

  function patchInvitation(patch: Partial<StudioInvitation>) { setInvitation((current) => ({ ...current, ...patch })); }
  function patchHost(index: number, name: string) { patchInvitation({ hosts: invitation.hosts.map((host, i) => i === index ? { ...host, name } : host) }); }
  function patchEvent(field: "title" | "start", value: string) { patchInvitation({ events: invitation.events.map((event, i) => i === 0 ? { ...event, [field]: value } : event) }); }
  function patchVenue(field: "name" | "address", value: string) { patchInvitation({ events: invitation.events.map((event, i) => i === 0 ? { ...event, venue: { ...event.venue, [field]: value } } : event) }); }
  function chooseTemplate(id: string) { setTemplateId(id); setView("studio"); setStep(2); }
  function exportProject() {
    if (!ready) { setNotice("Complete the required fields before exporting."); return; }
    const payload = { templateId, generatedAt: new Date().toISOString(), invitation };
    const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `${invitation.slug}-invitation.json`; anchor.click(); URL.revokeObjectURL(url);
    setNotice("Production project downloaded.");
  }

  return <main className="studio-shell">
    <header className="studio-header">
      <button className="studio-brand" onClick={() => setView("overview")}><span>IW/F</span><b>Invitation Factory</b><small>Production OS</small></button>
      <nav aria-label="Factory navigation">
        {(["overview", "templates", "studio", "library"] as View[]).map((item) => <button key={item} className={view === item ? "active" : ""} onClick={() => setView(item)}>{item}</button>)}
      </nav>
      <button className="studio-primary" onClick={() => setView("studio")}>New invitation <span>＋</span></button>
    </header>

    {view === "overview" && <div className="studio-page">
      <section className="ops-hero">
        <p className="studio-eyebrow">Private production system · v1</p>
        <h1>Exceptional invitations.<br/><em>Ready in minutes.</em></h1>
        <p>A deterministic design and delivery system for culturally intelligent, premium event websites—without template noise or AI-looking output.</p>
        <div><button className="studio-primary" onClick={() => setView("templates")}>Browse production templates</button><button className="studio-secondary" onClick={() => setView("studio")}>Open active project</button></div>
      </section>
      <section className="ops-metrics">
        <article><small>Production templates</small><strong>{templates.length}</strong><span>Launch collection</span></article>
        <article><small>Registry vocabulary</small><strong>{registryMeta.componentCount.toLocaleString()}</strong><span>{registryMeta.categoryCount} categories</span></article>
        <article><small>Ready components</small><strong>{implementationManifest.length}</strong><span>Validated runtime</span></article>
        <article><small>Target turnaround</small><strong>15<sup>m</sup></strong><span>Brief to publish</span></article>
      </section>
      <section className="workflow-section"><div><p className="studio-eyebrow">The production line</p><h2>One controlled workflow.<br/>No blank-page decisions.</h2></div><ol>{["Select a proven composition","Enter structured client details","Art-direct colour and motion","Validate, export and deploy"].map((x,i)=><li key={x}><span>0{i+1}</span><p>{x}</p></li>)}</ol></section>
    </div>}

    {view === "templates" && <section className="studio-page template-page">
      <div className="page-heading"><div><p className="studio-eyebrow">Curated launch collection</p><h1>Production templates</h1></div><p>Each composition is responsive, content-safe and built from registered implementation code.</p></div>
      <div className="production-grid">{templates.map((item, index) => <article className="production-card" key={item.id}>
        <div className={`production-art production-art--${item.theme}`}><span>{String(index + 1).padStart(2,"0")}</span><div><i/><b>{item.name}</b><i/></div></div>
        <div className="production-copy"><p>{item.collection} · {item.tier}</p><h2>{item.name}</h2><span>{item.description}</span><div className="palette">{item.palette.map(color=><i key={color} style={{background:color}}/>)}</div><button onClick={() => chooseTemplate(item.id)}>Customize template <span>↗</span></button></div>
      </article>)}</div>
    </section>}

    {view === "studio" && <section className="builder">
      <aside className="builder-panel">
        <div className="builder-title"><p className="studio-eyebrow">Active production</p><h2>{invitation.hosts.map(h=>h.name).join(" & ")}</h2><span>{template.name} · {template.id}</span></div>
        <div className="step-row">{[1,2,3,4].map(n=><button key={n} className={step===n?"active":""} onClick={()=>setStep(n)}><span>{n}</span>{["Details","Design","Sections","Publish"][n-1]}</button>)}</div>
        <div className="builder-form">
          {step===1 && <><h3>Invitation details</h3><div className="field-pair"><label>First name<input value={invitation.hosts[0]?.name||""} onChange={e=>patchHost(0,e.target.value)}/></label><label>Second name<input value={invitation.hosts[1]?.name||""} onChange={e=>patchHost(1,e.target.value)}/></label></div><label>Invitation headline<input value={invitation.headline} onChange={e=>patchInvitation({headline:e.target.value})}/></label><label>Message<textarea rows={4} value={invitation.message} onChange={e=>patchInvitation({message:e.target.value})}/></label><div className="field-pair"><label>Event title<input value={invitation.events[0].title} onChange={e=>patchEvent("title",e.target.value)}/></label><label>Date and time<input type="datetime-local" value={invitation.events[0].start.slice(0,16)} onChange={e=>patchEvent("start",e.target.value+":00+05:30")}/></label></div><label>Venue<input value={invitation.events[0].venue.name} onChange={e=>patchVenue("name",e.target.value)}/></label><label>City and address<input value={invitation.events[0].venue.address} onChange={e=>patchVenue("address",e.target.value)}/></label></>}
          {step===2 && <><h3>Art direction</h3><p className="form-help">Select one coherent visual system. Palette, ornament and motion update together.</p><div className="mini-templates">{templates.map(item=><button className={item.id===templateId?"active":""} key={item.id} onClick={()=>setTemplateId(item.id)}><span>{item.name}</span><div>{item.palette.map(c=><i key={c} style={{background:c}}/>)}</div><small>{item.motion} motion</small></button>)}</div></>}
          {step===3 && <><h3>Page structure</h3><p className="form-help">The selected template uses a professionally paced, tested composition.</p><ol className="section-list">{template.sections.map((section,index)=><li key={section}><span>0{index+1}</span><b>{section}</b><em>Included</em></li>)}</ol></>}
          {step===4 && <><h3>Production readiness</h3><div className="readiness">{readiness.map(item=><p key={item.label} className={item.ok?"ok":""}><span>{item.ok?"✓":"!"}</span>{item.label}<small>{item.ok?"Ready":"Needs attention"}</small></p>)}</div><label>Publish slug<input value={invitation.slug} onChange={e=>patchInvitation({slug:slugify(e.target.value)})}/></label><label className="check"><input type="checkbox" checked={invitation.branding.showFactoryCredit} onChange={e=>patchInvitation({branding:{...invitation.branding,showFactoryCredit:e.target.checked}})}/> Show factory credit</label><button className="export-button" disabled={!ready} onClick={exportProject}>Export production project <span>↓</span></button>{notice&&<p className="builder-notice" role="status">{notice}</p>}</>}
        </div>
        <footer><button disabled={step===1} onClick={()=>setStep(step-1)}>Back</button><button disabled={step===4} onClick={()=>setStep(step+1)}>Continue</button></footer>
      </aside>
      <div className="preview-stage"><div className="preview-toolbar"><p><span className="live-dot"/> Live preview <small>Autosaved locally</small></p><div>{(["mobile","tablet","desktop"] as Device[]).map(d=><button key={d} className={device===d?"active":""} onClick={()=>setDevice(d)} aria-label={`${d} preview`}>{d[0].toUpperCase()}</button>)}</div><button onClick={()=>window.open("#preview","_blank")}>Open ↗</button></div><div className={`device-frame device-frame--${device}`} id="preview"><InvitationRenderer invitation={invitation} template={template} compact /></div></div>
    </section>}

    {view === "library" && <section className="studio-page library-summary"><p className="studio-eyebrow">Design vocabulary</p><h1>{registryMeta.componentCount.toLocaleString()} specifications.<br/><em>{implementationManifest.length} ready for production.</em></h1><p>The registry remains the research and expansion layer. Production templates only resolve components with tested implementation paths.</p><button className="studio-primary" onClick={()=>location.assign("?catalogue=1")}>Catalogue architecture preserved</button></section>}
  </main>;
}
