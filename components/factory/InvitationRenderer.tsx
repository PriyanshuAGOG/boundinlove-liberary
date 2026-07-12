"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { EditorialNamesHero, EventCountdown, EventTimeline, FloatingMotifs, GalleryMosaic, InvitationClosing, InviteShell, RsvpCard, VenueCard } from "@/components/library";
import { InvitationOpeningGate } from "./InvitationOpeningGate";
import { useScrollCinema } from "./useScrollCinema";
import type { ProductionTemplate, StudioInvitation } from "./types";

function templateTokens(template: ProductionTemplate): CSSProperties {
  const [background, ink, accent, metal] = template.palette;
  return {
    "--invite-bg": background,
    "--invite-surface": `color-mix(in srgb, ${background} 88%, white)`,
    "--invite-ink": ink,
    "--invite-muted": `color-mix(in srgb, ${ink} 58%, transparent)`,
    "--invite-accent": accent,
    "--invite-metal": metal ?? accent,
  } as CSSProperties;
}

function templateClass(template: ProductionTemplate) {
  return [
    "invite-theme",
    `invite-theme--${template.theme}`,
    `invite-layout--${template.layout}`,
    `invite-frame--${template.frame}`,
    `invite-texture--${template.texture}`,
    `invite-motion--${template.motion}`,
    `invite-cinema--${(template as { cinema?: string }).cinema ?? template.motion}`,
  ].join(" ");
}

// Each section is a "scene" in the scroll film. `kind` lets the CSS give a
// section its own entrance direction so the sequence reads as choreography
// rather than one repeated fade.
function Scene({ kind, children, className = "" }: { kind: string; children: ReactNode; className?: string }) {
  return (
    <div className={`invite-scene invite-scene--${kind} ${className}`} data-scene>
      {children}
    </div>
  );
}

function fallbackGallery(template: ProductionTemplate, invitation: StudioInvitation) {
  if (invitation.gallery.length) return invitation.gallery;
  return template.sections.includes("gallery")
    ? [
        { src: `data:image/svg+xml,${encodeURIComponent(previewSvg(template, "Portrait study", 0))}`, alt: `${template.name} portrait placeholder`, caption: "Portrait study" },
        { src: `data:image/svg+xml,${encodeURIComponent(previewSvg(template, "Venue mood", 1))}`, alt: `${template.name} venue placeholder`, caption: "Venue mood" },
        { src: `data:image/svg+xml,${encodeURIComponent(previewSvg(template, "Celebration detail", 2))}`, alt: `${template.name} detail placeholder`, caption: "Celebration detail" },
      ]
    : [];
}

function previewSvg(template: ProductionTemplate, label: string, index: number) {
  const [bg, ink, accent, metal] = template.palette;
  const symbol = template.motifSymbol || "✦";
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 1100"><rect width="900" height="1100" fill="${bg}"/><circle cx="${index === 1 ? 650 : 270}" cy="${index === 2 ? 720 : 330}" r="${index === 0 ? 260 : 210}" fill="${accent}" opacity=".16"/><path d="M110 150H790V950H110Z" fill="none" stroke="${metal ?? accent}" stroke-width="6" opacity=".55"/><text x="450" y="470" text-anchor="middle" font-family="Georgia,serif" font-size="190" fill="${ink}" opacity=".9">${symbol}</text><text x="450" y="610" text-anchor="middle" font-family="Arial,sans-serif" font-size="28" fill="${ink}" letter-spacing="8">${label.toUpperCase()}</text><text x="450" y="690" text-anchor="middle" font-family="Georgia,serif" font-size="54" fill="${ink}">${template.name}</text></svg>`;
}

export function InvitationRenderer({ invitation, template, compact = false }: { invitation: StudioInvitation; template: ProductionTemplate; compact?: boolean }) {
  const shellRef = useRef<HTMLElement>(null);
  const [opened, setOpened] = useState(compact);
  useScrollCinema(shellRef, opened);

  // Lock the page behind the opening gate until the guest chooses to enter, so
  // the reveal always begins from the top of the film.
  useEffect(() => {
    if (compact) return;
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened, compact]);

  const event = invitation.events[0];
  const dateLabel = event ? new Intl.DateTimeFormat(invitation.locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(event.start)) : "Date to be announced";
  const location = event?.venue.address || "Location to be announced";

  return (
    <InviteShell
      rootRef={shellRef}
      className={`${templateClass(template)} ${compact ? "invite-compact" : ""} ${opened ? "is-entered" : "is-sealed"}`}
      theme={templateTokens(template)}
    >
      {!compact && <InvitationOpeningGate invitation={invitation} template={template} onOpen={() => setOpened(true)} />}
      <div className="invite-progress" aria-hidden="true"><span /></div>
      <FloatingMotifs symbol={template.motifSymbol || "✦"} count={template.motion === "editorial" ? 8 : 14} />
      <div className="invite-ornament" aria-hidden="true"><span>{template.motifSymbol || "✦"}</span></div>
      <div className="invite-atmosphere" aria-hidden="true"><span className="invite-atmosphere__a" /><span className="invite-atmosphere__b" /></div>

      <Scene kind="hero" className="invite-scene--first">
        <EditorialNamesHero eyebrow={invitation.headline} hosts={invitation.hosts} dateLabel={dateLabel} locationLabel={location} message={invitation.message} />
      </Scene>
      {template.sections.includes("countdown") && event && (
        <Scene kind="countdown"><EventCountdown target={event.start} /></Scene>
      )}
      {template.sections.includes("schedule") && (
        <Scene kind="schedule"><EventTimeline events={invitation.events} locale={invitation.locale} /></Scene>
      )}
      {template.sections.includes("gallery") && (
        <Scene kind="gallery"><GalleryMosaic items={fallbackGallery(template, invitation)} title={template.experience} /></Scene>
      )}
      {template.sections.includes("venue") && event && (
        <Scene kind="venue"><VenueCard venue={event.venue} note="We recommend arriving thirty minutes before the ceremony." /></Scene>
      )}
      {template.sections.includes("rsvp") && invitation.rsvp.enabled && (
        <Scene kind="rsvp"><RsvpCard title="Reserve your place" deadline={invitation.rsvp.deadline} /></Scene>
      )}
      <Scene kind="closing">
        <InvitationClosing signature={invitation.hosts.map((host) => host.name).join(" & ")} showFactoryCredit={invitation.branding.showFactoryCredit} factoryUrl={invitation.branding.factoryUrl} />
      </Scene>
    </InviteShell>
  );
}
