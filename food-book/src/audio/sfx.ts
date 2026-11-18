/**
 * Sound design for The Food Book.
 * All sounds are synthesized with the Web Audio API — no audio files to load.
 * Muted by default; the AudioContext is only created after the visitor
 * enables sound with the HUD control (never autoplays).
 */
export type SfxName = "page" | "pour" | "crunch" | "chime" | "open";

const KEY = "foodbook.sound";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let noise: AudioBuffer | null = null;
let on = false;
const subs = new Set<(v: boolean) => void>();

const read = () => {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch {
      return null;
    }
    master = ctx.createGain();
    master.gain.value = 0.45;
    master.connect(ctx.destination);
    const len = Math.floor(ctx.sampleRate * 2);
    noise = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = noise.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Read persisted preference (call once at start-up). */
export function initSound(): boolean {
  on = read();
  return on;
}
export const isSoundOn = () => on;
export function subscribeSound(fn: (v: boolean) => void) {
  subs.add(fn);
  return () => subs.delete(fn);
}
export function setSound(v: boolean) {
  on = v;
  try {
    localStorage.setItem(KEY, v ? "1" : "0");
  } catch {
    /* ignore */
  }
  if (v) ensure();
  subs.forEach((fn) => fn(v));
}

function burst(o: {
  t: number;
  dur: number;
  type: BiquadFilterType;
  f0: number;
  f1?: number;
  q?: number;
  gain: number;
  attack?: number;
  curve?: "lin" | "exp";
}) {
  const c = ctx!;
  const src = c.createBufferSource();
  src.buffer = noise!;
  src.playbackRate.value = 0.8 + Math.random() * 0.4;
  const flt = c.createBiquadFilter();
  flt.type = o.type;
  flt.frequency.setValueAtTime(o.f0, o.t);
  if (o.f1) flt.frequency.exponentialRampToValueAtTime(Math.max(60, o.f1), o.t + o.dur);
  flt.Q.value = o.q ?? 1;
  const g = c.createGain();
  const a = o.attack ?? 0.012;
  g.gain.setValueAtTime(0.0001, o.t);
  g.gain.exponentialRampToValueAtTime(o.gain, o.t + a);
  g.gain.exponentialRampToValueAtTime(0.0001, o.t + o.dur);
  src.connect(flt).connect(g).connect(master!);
  src.start(o.t, Math.random() * 1.2);
  src.stop(o.t + o.dur + 0.05);
}

function tone(t: number, freq: number, dur: number, gain: number, type: OscillatorType = "sine") {
  const c = ctx!;
  const osc = c.createOscillator();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(master!);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

/** Play a sound. Silently does nothing while sound is off. */
export function play(name: SfxName, delay = 0) {
  if (!on) return;
  const c = ensure();
  if (!c || !master || !noise) return;
  const t = c.currentTime + Math.max(0, delay);

  switch (name) {
    case "page": {
      // paper: two-stage swoosh + a soft flap as the leaf settles
      burst({ t, dur: 0.34, type: "bandpass", f0: 900, f1: 3400, q: 0.7, gain: 0.5, attack: 0.03 });
      burst({ t: t + 0.1, dur: 0.2, type: "highpass", f0: 2400, q: 0.6, gain: 0.22, attack: 0.02 });
      tone(t + 0.3, 96, 0.16, 0.06, "triangle");
      break;
    }
    case "pour": {
      // liquid: low, airy stream with a few glugs
      burst({ t, dur: 1.5, type: "lowpass", f0: 700, f1: 1500, q: 0.5, gain: 0.34, attack: 0.4 });
      burst({ t: t + 0.2, dur: 1.1, type: "bandpass", f0: 2600, f1: 1400, q: 1.6, gain: 0.1, attack: 0.35 });
      for (let i = 0; i < 5; i++) tone(t + 0.35 + i * 0.21 + Math.random() * 0.08, 210 + Math.random() * 160, 0.1, 0.05, "sine");
      break;
    }
    case "crunch": {
      for (let i = 0; i < 3; i++) burst({ t: t + i * 0.07, dur: 0.09, type: "highpass", f0: 1900, q: 0.8, gain: 0.3 - i * 0.07, attack: 0.006 });
      break;
    }
    case "chime": {
      tone(t, 880, 0.5, 0.09);
      tone(t + 0.07, 1320, 0.45, 0.05);
      break;
    }
    case "open": {
      burst({ t, dur: 0.5, type: "lowpass", f0: 420, f1: 1900, q: 0.6, gain: 0.22, attack: 0.16 });
      break;
    }
  }
}
