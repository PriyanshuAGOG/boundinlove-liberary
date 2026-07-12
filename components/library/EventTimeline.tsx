import type { InvitationEvent } from "./types";

type EventTimelineProps = {
  title?: string;
  events: InvitationEvent[];
  locale?: string;
};

export function EventTimeline({ title = "Celebration schedule", events, locale = "en-IN" }: EventTimelineProps) {
  const format = new Intl.DateTimeFormat(locale, { weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
  return (
    <section className="invite-section" aria-labelledby="schedule-title">
      <p className="invite-eyebrow">The itinerary</p>
      <h2 id="schedule-title" className="invite-display invite-section__title">{title}</h2>
      <ol className="invite-timeline">
        {events.map((event, index) => (
          <li key={event.id} className="invite-timeline__item">
            <span className="invite-timeline__number">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <p className="invite-timeline__date">{format.format(new Date(event.start))}</p>
              <h3>{event.title}</h3>
              <p>{event.venue.name}</p>
              {event.dressCode && <span className="invite-chip">{event.dressCode}</span>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

