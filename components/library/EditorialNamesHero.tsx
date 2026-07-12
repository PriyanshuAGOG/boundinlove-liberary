import type { InvitationHost } from "./types";

type EditorialNamesHeroProps = {
  eyebrow?: string;
  hosts: InvitationHost[];
  dateLabel: string;
  locationLabel: string;
  message?: string;
};

export function EditorialNamesHero({ eyebrow = "Together with our families", hosts, dateLabel, locationLabel, message }: EditorialNamesHeroProps) {
  return (
    <section className="invite-hero" aria-labelledby="invitation-title">
      <p className="invite-eyebrow">{eyebrow}</p>
      <h1 id="invitation-title" className="invite-display invite-hero__names">
        {hosts.map((host, index) => (
          <span key={`${host.name}-${index}`}>
            {index > 0 && <span className="invite-hero__ampersand"> &amp; </span>}
            {host.name}
          </span>
        ))}
      </h1>
      {message && <p className="invite-hero__message">{message}</p>}
      <div className="invite-hero__meta">
        <span>{dateLabel}</span>
        <span aria-hidden="true">✦</span>
        <span>{locationLabel}</span>
      </div>
    </section>
  );
}

