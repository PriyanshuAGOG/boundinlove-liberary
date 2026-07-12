import type { InvitationVenue } from "./types";

type VenueCardProps = {
  venue: InvitationVenue;
  eyebrow?: string;
  note?: string;
};

export function VenueCard({ venue, eyebrow = "Where to arrive", note }: VenueCardProps) {
  return (
    <section className="invite-venue" aria-labelledby="venue-title">
      <div>
        <p className="invite-eyebrow">{eyebrow}</p>
        <h2 id="venue-title" className="invite-display invite-section__title">{venue.name}</h2>
        <p>{venue.address}</p>
        {note && <p className="invite-muted">{note}</p>}
      </div>
      {venue.mapUrl && (
        <a className="invite-button" href={venue.mapUrl} target="_blank" rel="noreferrer">
          Open directions <span aria-hidden="true">↗</span>
        </a>
      )}
    </section>
  );
}

