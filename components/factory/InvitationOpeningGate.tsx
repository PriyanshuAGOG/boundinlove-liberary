"use client";

import { useEffect, useRef, useState } from "react";
import { startRaga, type RagaController, type RagaName } from "./ragaEngine";
import type { ProductionTemplate, StudioInvitation } from "./types";

type InvitationOpeningGateProps = {
  invitation: StudioInvitation;
  template: ProductionTemplate;
  onOpen?: () => void;
};

// Which opening choreographies get standing decorative layers. The visual work
// lives in invitation-cinema.css, keyed off data-opening; here we only emit the
// structural nodes each mechanic animates.
function OpeningScenery({ opening, symbol }: { opening: string; symbol: string }) {
  switch (opening) {
    case "doors":
      return (
        <div className="gate-scenery gate-doors" aria-hidden="true">
          <span className="gate-door gate-door--l" />
          <span className="gate-door gate-door--r" />
        </div>
      );
    case "curtain":
      return (
        <div className="gate-scenery gate-curtain" aria-hidden="true">
          <span className="gate-drape gate-drape--l" />
          <span className="gate-drape gate-drape--r" />
        </div>
      );
    case "petals":
      return (
        <div className="gate-scenery gate-petals" aria-hidden="true">
          {Array.from({ length: 14 }).map((_, i) => (
            <span key={i} className="gate-petal" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>
      );
    case "mandala":
      return (
        <div className="gate-scenery gate-mandala" aria-hidden="true">
          <span className="gate-ring gate-ring--1" />
          <span className="gate-ring gate-ring--2" />
          <span className="gate-ring gate-ring--3" />
        </div>
      );
    case "foil":
      return <div className="gate-scenery gate-foil" aria-hidden="true"><span /></div>;
    case "diya":
      return (
        <div className="gate-scenery gate-diya" aria-hidden="true">
          <span className="gate-flame" />
          <span className="gate-glow" />
        </div>
      );
    case "constellation":
      return (
        <div className="gate-scenery gate-constellation" aria-hidden="true">
          {Array.from({ length: 22 }).map((_, i) => (
            <span key={i} className="gate-star" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>
      );
    case "lantern":
      return (
        <div className="gate-scenery gate-lantern" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="gate-lamp" style={{ "--i": i } as React.CSSProperties} />
          ))}
        </div>
      );
    case "tide":
      return (
        <div className="gate-scenery gate-tide" aria-hidden="true">
          <span className="gate-wave gate-wave--1" />
          <span className="gate-wave gate-wave--2" />
        </div>
      );
    case "scroll":
      return (
        <div className="gate-scenery gate-scroll" aria-hidden="true">
          <span className="gate-rod gate-rod--t" />
          <span className="gate-rod gate-rod--b" />
        </div>
      );
    case "ticket":
      return (
        <div className="gate-scenery gate-ticket" aria-hidden="true">
          <span className="gate-stub" />
          <span className="gate-perf" />
        </div>
      );
    case "box":
      return <div className="gate-scenery gate-box" aria-hidden="true"><span className="gate-lid">{symbol}</span></div>;
    case "veil":
      return <div className="gate-scenery gate-veil" aria-hidden="true"><span /></div>;
    case "envelope":
    default:
      return (
        <div className="gate-scenery gate-envelope" aria-hidden="true">
          <span className="gate-flap" />
          <span className="gate-seal">{symbol}</span>
        </div>
      );
  }
}

export function InvitationOpeningGate({ invitation, template, onOpen }: InvitationOpeningGateProps) {
  const [opened, setOpened] = useState(false);
  const [muted, setMuted] = useState(false);
  const controllerRef = useRef<RagaController | null>(null);
  const names = invitation.hosts.map((host) => host.name).join(" & ");
  const symbol = template.motifSymbol || "✦";
  const opening = (template as { opening?: string }).opening || "envelope";
  const raga = ((template as { raga?: string }).raga || "yaman") as RagaName;

  useEffect(() => () => controllerRef.current?.stop(), []);

  function openInvitation() {
    if (opened) return;
    setOpened(true);
    onOpen?.();
    if (!controllerRef.current) controllerRef.current = startRaga(raga);
  }

  function toggleMute() {
    const next = !muted;
    setMuted(next);
    controllerRef.current?.setMuted(next);
  }

  return (
    <>
      <section className={`invite-gate ${opened ? "is-open" : ""}`} data-opening={opening} aria-hidden={opened}>
        <OpeningScenery opening={opening} symbol={symbol} />
        <div className="invite-gate__card">
          <p className="invite-gate__collection">{template.collection}</p>
          <span className="invite-gate__motif" aria-hidden="true">{symbol}</span>
          <h2 className="invite-gate__names">{names}</h2>
          <p className="invite-gate__cue">{invitation.headline}</p>
          <button type="button" className="invite-gate__open" onClick={openInvitation}>
            <span>Open the invitation</span>
            <small>with music &amp; ceremony</small>
          </button>
        </div>
      </section>

      {opened && (
        <button
          type="button"
          className={`invite-music ${muted ? "is-muted" : ""}`}
          onClick={toggleMute}
          aria-pressed={muted}
          aria-label={muted ? "Unmute invitation music" : "Mute invitation music"}
          title={`Raga ${raga}`}
        >
          <span className="invite-music__bars" aria-hidden="true">
            <i /><i /><i /><i />
          </span>
          <span className="invite-music__label">{muted ? "Music off" : `Raga ${raga}`}</span>
        </button>
      )}
    </>
  );
}
