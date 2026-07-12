"use client";

import { useState } from "react";

type RsvpCardProps = {
  title?: string;
  deadline?: string;
  onSubmit?: (response: { name: string; attending: boolean }) => Promise<void> | void;
};

export function RsvpCard({ title = "Will you join us?", deadline, onSubmit }: RsvpCardProps) {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState(true);
  const [sent, setSent] = useState(false);

  return (
    <section className="invite-rsvp" aria-labelledby="rsvp-title">
      <p className="invite-eyebrow">Kindly respond</p>
      <h2 id="rsvp-title" className="invite-display invite-section__title">{title}</h2>
      {deadline && <p className="invite-muted">Please respond by {deadline}.</p>}
      {sent ? (
        <p className="invite-rsvp__success" role="status">Thank you. Your response has been recorded.</p>
      ) : (
        <form onSubmit={async (event) => { event.preventDefault(); await onSubmit?.({ name, attending }); setSent(true); }}>
          <label>
            Your name
            <input value={name} onChange={(event) => setName(event.target.value)} required />
          </label>
          <fieldset>
            <legend>Attendance</legend>
            <label><input type="radio" checked={attending} onChange={() => setAttending(true)} /> Joyfully attending</label>
            <label><input type="radio" checked={!attending} onChange={() => setAttending(false)} /> Unable to attend</label>
          </fieldset>
          <button className="invite-button" type="submit">Send response</button>
        </form>
      )}
    </section>
  );
}

