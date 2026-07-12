"use client";

import { useRef, useState } from "react";
import type { ProductionTemplate, StudioInvitation } from "./types";

type InvitationOpeningGateProps = {
  invitation: StudioInvitation;
  template: ProductionTemplate;
};

type ToneNode = {
  context: AudioContext;
  nodes: AudioNode[];
};

export function InvitationOpeningGate({ invitation, template }: InvitationOpeningGateProps) {
  const [opened, setOpened] = useState(false);
  const audioRef = useRef<ToneNode | null>(null);
  const names = invitation.hosts.map((host) => host.name).join(" & ");

  function openInvitation() {
    setOpened(true);
    if (!audioRef.current) audioRef.current = startIndianWeddingAmbient();
  }

  return (
    <section className={`invite-gate ${opened ? "is-open" : ""}`} aria-hidden={opened}>
      <div className="invite-gate__card">
        <div className="invite-gate__flap" />
        <div className="invite-gate__face">
          <p>{template.collection}</p>
          <h2>{names}</h2>
          <span>{template.motifSymbol || "✦"}</span>
          <button type="button" onClick={openInvitation}>
            Open invitation
          </button>
        </div>
      </div>
    </section>
  );
}

function startIndianWeddingAmbient(): ToneNode | null {
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) return null;

  const context = new AudioContextCtor();
  const master = context.createGain();
  master.gain.value = 0.075;
  master.connect(context.destination);

  const nodes: AudioNode[] = [master];
  const now = context.currentTime;

  [130.81, 196.0, 261.63].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = index === 1 ? "triangle" : "sine";
    oscillator.frequency.value = frequency;
    gain.gain.value = index === 0 ? 0.35 : 0.18;
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(now + index * 0.08);
    nodes.push(oscillator, gain);
  });

  const bell = context.createOscillator();
  const bellGain = context.createGain();
  bell.type = "sine";
  bell.frequency.value = 783.99;
  bellGain.gain.setValueAtTime(0, now);
  bellGain.gain.linearRampToValueAtTime(0.16, now + 0.08);
  bellGain.gain.exponentialRampToValueAtTime(0.001, now + 2.4);
  bell.connect(bellGain);
  bellGain.connect(master);
  bell.start(now);
  bell.stop(now + 2.6);
  nodes.push(bell, bellGain);

  return { context, nodes };
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
