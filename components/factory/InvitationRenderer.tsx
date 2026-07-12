"use client";

import type { CSSProperties } from "react";
import { EditorialNamesHero, EventCountdown, EventTimeline, GalleryMosaic, InvitationClosing, InviteShell, RsvpCard, VenueCard } from "@/components/library";
import type { ProductionTemplate, StudioInvitation } from "./types";

const themeTokens: Record<string, CSSProperties> = {
  editorial: { "--invite-bg": "#f4efe6", "--invite-surface": "#fffaf2", "--invite-ink": "#191714", "--invite-muted": "#6f685e", "--invite-accent": "#9f3f47", "--invite-metal": "#a88554" } as CSSProperties,
  rajasthani: { "--invite-bg": "#f3e4cd", "--invite-surface": "#faeedc", "--invite-ink": "#4b1720", "--invite-muted": "#765c50", "--invite-accent": "#8d2634", "--invite-metal": "#bd8748" } as CSSProperties,
  mughal: { "--invite-bg": "#f4f0df", "--invite-surface": "#fbf8eb", "--invite-ink": "#173b31", "--invite-muted": "#637168", "--invite-accent": "#275f4d", "--invite-metal": "#b99655" } as CSSProperties,
  temple: { "--invite-bg": "#fff4d6", "--invite-surface": "#fffaf0", "--invite-ink": "#5b241d", "--invite-muted": "#7e6554", "--invite-accent": "#8d291f", "--invite-metal": "#b47b26" } as CSSProperties,
  phulkari: { "--invite-bg": "#171329", "--invite-surface": "#211b38", "--invite-ink": "#fff7e7", "--invite-muted": "#c8bfd5", "--invite-accent": "#e74978", "--invite-metal": "#f2b84b" } as CSSProperties,
  alpana: { "--invite-bg": "#fff9ef", "--invite-surface": "#fffdf7", "--invite-ink": "#56151c", "--invite-muted": "#806763", "--invite-accent": "#a51f29", "--invite-metal": "#d0a762" } as CSSProperties,
  celestial: { "--invite-bg": "#0d1630", "--invite-surface": "#14203f", "--invite-ink": "#f3e8cd", "--invite-muted": "#aaaeca", "--invite-accent": "#91a9dc", "--invite-metal": "#bfa46c" } as CSSProperties,
  garden: { "--invite-bg": "#f5f1e8", "--invite-surface": "#fbfaf5", "--invite-ink": "#29473a", "--invite-muted": "#718078", "--invite-accent": "#9d5d5e", "--invite-metal": "#bb8e61" } as CSSProperties,
  deco: { "--invite-bg": "#11100f", "--invite-surface": "#1a1815", "--invite-ink": "#f0e7d6", "--invite-muted": "#aaa092", "--invite-accent": "#c49a54", "--invite-metal": "#c49a54" } as CSSProperties,
  storybook: { "--invite-bg": "#fff5dc", "--invite-surface": "#fffaf0", "--invite-ink": "#315f68", "--invite-muted": "#6e7d7c", "--invite-accent": "#df755d", "--invite-metal": "#d6a649" } as CSSProperties,
  coastal: { "--invite-bg": "#edf3ef", "--invite-surface": "#f8fbf8", "--invite-ink": "#174c54", "--invite-muted": "#668085", "--invite-accent": "#b56f52", "--invite-metal": "#d59b72" } as CSSProperties,
  chapel: { "--invite-bg": "#faf8f1", "--invite-surface": "#fffef9", "--invite-ink": "#26322e", "--invite-muted": "#727973", "--invite-accent": "#7d6546", "--invite-metal": "#aa8b5e" } as CSSProperties,
};

export function InvitationRenderer({ invitation, template, compact = false }: { invitation: StudioInvitation; template: ProductionTemplate; compact?: boolean }) {
  const event = invitation.events[0];
  const dateLabel = event ? new Intl.DateTimeFormat(invitation.locale, { day: "numeric", month: "long", year: "numeric" }).format(new Date(event.start)) : "Date to be announced";
  const location = event?.venue.address || "Location to be announced";
  return (
    <InviteShell className={`invite-theme invite-theme--${template.theme} invite-motion--${template.motion} ${compact ? "invite-compact" : ""}`} theme={themeTokens[template.theme]}>
      <div className="invite-ornament" aria-hidden="true"><span>✦</span></div>
      <EditorialNamesHero eyebrow={invitation.headline} hosts={invitation.hosts} dateLabel={dateLabel} locationLabel={location} message={invitation.message} />
      {template.sections.includes("countdown") && event && <EventCountdown target={event.start} />}
      {template.sections.includes("schedule") && <EventTimeline events={invitation.events} locale={invitation.locale} />}
      {template.sections.includes("gallery") && <GalleryMosaic items={invitation.gallery} />}
      {template.sections.includes("venue") && event && <VenueCard venue={event.venue} note="We recommend arriving thirty minutes before the ceremony." />}
      {template.sections.includes("rsvp") && invitation.rsvp.enabled && <RsvpCard deadline={invitation.rsvp.deadline} />}
      <InvitationClosing signature={invitation.hosts.map((host) => host.name).join(" & ")} showFactoryCredit={invitation.branding.showFactoryCredit} factoryUrl={invitation.branding.factoryUrl} />
    </InviteShell>
  );
}
