"use client";

import { useEffect, useState } from "react";

type EventCountdownProps = { target: string; label?: string };

function difference(target: string) {
  const value = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(value / 86400000),
    hours: Math.floor((value / 3600000) % 24),
    minutes: Math.floor((value / 60000) % 60),
    seconds: Math.floor((value / 1000) % 60),
  };
}

export function EventCountdown({ target, label = "Until we celebrate" }: EventCountdownProps) {
  const [time, setTime] = useState(() => difference(target));
  useEffect(() => { const timer = window.setInterval(() => setTime(difference(target)), 1000); return () => window.clearInterval(timer); }, [target]);
  return (
    <section className="invite-countdown" aria-label={label}>
      <p className="invite-eyebrow">{label}</p>
      <div className="invite-countdown__grid">
        {Object.entries(time).map(([unit, value]) => <span key={unit}><strong>{String(value).padStart(2, "0")}</strong><small>{unit}</small></span>)}
      </div>
    </section>
  );
}

