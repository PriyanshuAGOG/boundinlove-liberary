"use client";

import type { CSSProperties } from "react";
import { EditorialNamesHero, EventCountdown, EventTimeline, FloatingMotifs, GalleryMosaic, InvitationClosing, InviteShell, RsvpCard, VenueCard } from "@/components/library";
import { InvitationOpeningGate } from "./InvitationOpeningGate";
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
  ].join(" ");
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
  const event = invitation.events[0];
  const dateLabel = event ? new Intl.DateTimeFormat(invitation.locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(event.start)) : "Date to be announced";
  const location = event?.venue.address || "Location to be announced";
  return (
    <InviteShell className={`${templateClass(template)} ${compact ? "invite-compact" : ""}`} theme={templateTokens(template)}>
      <InvitationOpeningGate invitation={invitation} template={template} />
      <FloatingMotifs symbol={template.motifSymbol || "✦"} count={template.motion === "editorial" ? 8 : 14} />
      <div className="invite-ornament" aria-hidden="true"><span>{template.motifSymbol || "✦"}</span></div>
      <div className="invite-template-signal" aria-hidden="true"><span>{template.collection}</span><span>{template.layout}</span><span>{template.motion}</span></div>
      <EditorialNamesHero eyebrow={invitation.headline} hosts={invitation.hosts} dateLabel={dateLabel} locationLabel={location} message={invitation.message} />
      {template.sections.includes("countdown") && event && <EventCountdown target={event.start} />}
      {template.sections.includes("schedule") && <EventTimeline events={invitation.events} locale={invitation.locale} />}
      {template.sections.includes("gallery") && <GalleryMosaic items={fallbackGallery(template, invitation)} title={template.experience} />}
      {template.sections.includes("venue") && event && <VenueCard venue={event.venue} note="We recommend arriving thirty minutes before the ceremony." />}
      {template.sections.includes("rsvp") && invitation.rsvp.enabled && <RsvpCard title="Reserve your place" deadline={invitation.rsvp.deadline} />}
      <InvitationClosing signature={invitation.hosts.map((host) => host.name).join(" & ")} showFactoryCredit={invitation.branding.showFactoryCredit} factoryUrl={invitation.branding.factoryUrl} />
    </InviteShell>
  );
}
