"use client";

import { useEffect, useRef, useState } from "react";

type MusicConsentToggleProps = { src: string; title?: string };

export function MusicConsentToggle({ src, title = "Invitation music" }: MusicConsentToggleProps) {
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  useEffect(() => () => { audio.current?.pause(); }, []);
  const toggle = async () => {
    if (!audio.current) return;
    if (playing) audio.current.pause(); else await audio.current.play();
    setPlaying(!playing);
  };
  return (
    <div className="invite-music">
      <audio ref={audio} src={src} preload="none" loop />
      <button type="button" onClick={toggle} aria-pressed={playing} aria-label={`${playing ? "Pause" : "Play"} ${title}`}>
        <span aria-hidden="true">{playing ? "Ⅱ" : "♪"}</span> {playing ? "Pause" : "Play"}
      </button>
    </div>
  );
}

