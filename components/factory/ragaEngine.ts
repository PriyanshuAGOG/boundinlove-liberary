// Procedural Indian classical audio for the invitation opening.
//
// No audio file assets: everything is synthesised with the Web Audio API so it
// stays licence-clean and tiny. Each raga has its own swara set (scale degrees),
// tonic, tempo and instrument colour, so different templates sound distinct.
//
// Music never autoplays. A controller is created only after a deliberate user
// gesture (opening the card) and can be muted/unmuted or stopped at any time.

export type RagaName = "yaman" | "bhairavi" | "desh" | "malkauns" | "bilawal" | "kafi";

type RagaSpec = {
  // Scale degrees in semitones above the tonic (Sa).
  swaras: number[];
  // Tonic frequency in Hz for the drone (Sa).
  tonic: number;
  // Melodic step interval in seconds.
  pace: number;
  // Timbre of the plucked lead: "sitar" is brighter, "bansuri" is breathier.
  colour: "sitar" | "santoor" | "bansuri";
  // Whether a soft tabla-like pulse plays underneath.
  percussion: boolean;
};

const RAGAS: Record<RagaName, RagaSpec> = {
  // Evening raga, serene and expansive.
  yaman: { swaras: [0, 2, 4, 6, 7, 9, 11, 12, 14], tonic: 138.59, pace: 0.62, colour: "santoor", percussion: false },
  // Devotional, tender morning raga.
  bhairavi: { swaras: [0, 1, 3, 5, 7, 8, 10, 12, 13], tonic: 130.81, pace: 0.72, colour: "bansuri", percussion: true },
  // Bright, romantic monsoon raga.
  desh: { swaras: [0, 2, 4, 5, 7, 9, 10, 12, 14], tonic: 146.83, pace: 0.5, colour: "sitar", percussion: true },
  // Deep, meditative pentatonic night raga.
  malkauns: { swaras: [0, 3, 5, 8, 10, 12, 15], tonic: 123.47, pace: 0.8, colour: "santoor", percussion: false },
  // Open, celebratory major raga.
  bilawal: { swaras: [0, 2, 4, 5, 7, 9, 11, 12, 14], tonic: 146.83, pace: 0.55, colour: "santoor", percussion: false },
  // Warm, folk-leaning festive raga.
  kafi: { swaras: [0, 2, 3, 5, 7, 9, 10, 12, 14], tonic: 155.56, pace: 0.44, colour: "sitar", percussion: true },
};

type WindowWithWebkit = Window & { webkitAudioContext?: typeof AudioContext };

export type RagaController = {
  setMuted: (muted: boolean) => void;
  isMuted: () => boolean;
  stop: () => void;
};

function semitone(base: number, steps: number) {
  return base * Math.pow(2, steps / 12);
}

export function startRaga(name: RagaName): RagaController | null {
  if (typeof window === "undefined") return null;
  const AudioContextCtor = window.AudioContext || (window as WindowWithWebkit).webkitAudioContext;
  if (!AudioContextCtor) return null;

  const spec = RAGAS[name] ?? RAGAS.yaman;
  const context = new AudioContextCtor();
  context.resume?.();

  const master = context.createGain();
  master.gain.value = 0.0001;
  master.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 2.2);
  master.connect(context.destination);

  // Gentle high shelf to keep the mix soft, never harsh on phone speakers.
  const tone = context.createBiquadFilter();
  tone.type = "lowpass";
  tone.frequency.value = 2600;
  tone.Q.value = 0.4;
  tone.connect(master);

  const stopped = { value: false };
  const timers: ReturnType<typeof setTimeout>[] = [];

  // --- Tanpura drone: Sa + Pa sustained, the harmonic bed of the raga. ---
  const droneGain = context.createGain();
  droneGain.gain.value = 0.5;
  droneGain.connect(tone);
  [spec.tonic, semitone(spec.tonic, 7), spec.tonic * 2].forEach((frequency, index) => {
    const osc = context.createOscillator();
    const oscGain = context.createGain();
    osc.type = index === 2 ? "sine" : "triangle";
    osc.frequency.value = frequency;
    oscGain.gain.value = index === 0 ? 0.22 : index === 1 ? 0.14 : 0.08;
    // Slow shimmer so the drone breathes.
    const lfo = context.createOscillator();
    const lfoGain = context.createGain();
    lfo.frequency.value = 0.12 + index * 0.05;
    lfoGain.gain.value = oscGain.gain.value * 0.4;
    lfo.connect(lfoGain);
    lfoGain.connect(oscGain.gain);
    osc.connect(oscGain);
    oscGain.connect(droneGain);
    osc.start();
    lfo.start();
  });

  // --- Plucked lead: wanders the raga's swaras with human-ish phrasing. ---
  function pluck(frequency: number, when: number, velocity: number) {
    const osc = context.createOscillator();
    const gain = context.createGain();
    const partial = context.createOscillator();
    const partialGain = context.createGain();

    osc.type = spec.colour === "bansuri" ? "sine" : "sawtooth";
    osc.frequency.value = frequency;
    partial.type = spec.colour === "sitar" ? "triangle" : "sine";
    partial.frequency.value = frequency * (spec.colour === "sitar" ? 2.01 : 3.0);
    partialGain.gain.value = spec.colour === "sitar" ? 0.14 : 0.06;

    const filter = context.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(spec.colour === "bansuri" ? 1400 : 3200, when);
    filter.frequency.exponentialRampToValueAtTime(700, when + 1.4);

    const peak = 0.16 * velocity;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(peak, when + (spec.colour === "bansuri" ? 0.12 : 0.012));
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 1.8);

    osc.connect(filter);
    partial.connect(partialGain);
    partialGain.connect(filter);
    filter.connect(gain);
    gain.connect(tone);
    osc.start(when);
    partial.start(when);
    osc.stop(when + 1.9);
    partial.stop(when + 1.9);
  }

  function tabla(when: number) {
    if (!spec.percussion) return;
    const osc = context.createOscillator();
    const gain = context.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(180, when);
    osc.frequency.exponentialRampToValueAtTime(90, when + 0.18);
    gain.gain.setValueAtTime(0.12, when);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.28);
    osc.connect(gain);
    gain.connect(tone);
    osc.start(when);
    osc.stop(when + 0.3);
  }

  // Lookahead scheduler: keeps a small buffer of notes queued ahead of time so
  // playback stays glitch-free without a heavy render loop.
  let index = 3;
  let direction = 1;
  let beat = 0;
  function schedule() {
    if (stopped.value) return;
    const now = context.currentTime;
    const when = now + 0.1;
    const octave = spec.tonic * 4;
    const step = spec.swaras[Math.max(0, Math.min(spec.swaras.length - 1, index))];
    // Occasional rest and octave lift make the phrase feel played, not looped.
    const rest = Math.random() < 0.16;
    if (!rest) pluck(semitone(octave, step), when, 0.7 + Math.random() * 0.5);
    if (beat % 2 === 0) tabla(when);
    beat += 1;

    // Meander up and down the raga, turning at the edges.
    index += direction * (Math.random() < 0.72 ? 1 : 2);
    if (index >= spec.swaras.length - 1) direction = -1;
    if (index <= 0) direction = 1;

    const nextDelay = (spec.pace + (Math.random() < 0.3 ? spec.pace * 0.5 : 0)) * 1000;
    timers.push(setTimeout(schedule, nextDelay));
  }
  timers.push(setTimeout(schedule, 700));

  return {
    setMuted(muted: boolean) {
      const target = muted ? 0.0001 : 0.16;
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.exponentialRampToValueAtTime(Math.max(0.0001, target), context.currentTime + 0.4);
    },
    isMuted() {
      return master.gain.value < 0.01;
    },
    stop() {
      stopped.value = true;
      timers.forEach(clearTimeout);
      master.gain.cancelScheduledValues(context.currentTime);
      master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.6);
      setTimeout(() => context.close().catch(() => {}), 900);
    },
  };
}
