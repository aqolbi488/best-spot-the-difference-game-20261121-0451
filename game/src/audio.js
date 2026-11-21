// audio.js — every sound in Twin Lanterns, synthesised with WebAudio
// oscillators. No audio files, no network: the game ships no sound assets.
// The context is created lazily on the first user gesture (browsers block
// audio before one) and every effect is a short envelope over a sine or
// triangle wave.

let audioCtx = null;
let muted = false;

export function ensureAudio() {
  if (!audioCtx) {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) audioCtx = new AC();
    } catch {
      audioCtx = null;
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') void audioCtx.resume();
  return audioCtx;
}

export function isMuted() {
  return muted;
}

export function toggleMute() {
  muted = !muted;
  return muted;
}

// One note: an oscillator that rises to `peak` gain and fades out.
function tone(freq, startAt, duration, type, peak) {
  const ctx = ensureAudio();
  if (!ctx || muted) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startAt);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + startAt);
  gain.gain.exponentialRampToValueAtTime(peak, ctx.currentTime + startAt + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startAt + duration);
  osc.connect(gain).connect(ctx.destination);
  osc.start(ctx.currentTime + startAt);
  osc.stop(ctx.currentTime + startAt + duration + 0.05);
}

// A bright two-note chime when a difference is found.
export function playChime() {
  tone(880, 0, 0.28, 'sine', 0.22);
  tone(1318.5, 0.07, 0.34, 'sine', 0.18);
}

// A low dull thud for a wrong click.
export function playThud() {
  tone(110, 0, 0.22, 'triangle', 0.25);
  tone(73.4, 0.02, 0.26, 'sine', 0.2);
}

// A soft click for buttons and the hint key.
export function playClick() {
  tone(660, 0, 0.08, 'sine', 0.12);
}

// A rising three-note fanfare when a scene is completed.
export function playFanfare() {
  tone(523.25, 0, 0.22, 'triangle', 0.2);
  tone(659.25, 0.14, 0.22, 'triangle', 0.2);
  tone(783.99, 0.28, 0.4, 'triangle', 0.22);
  tone(1046.5, 0.44, 0.5, 'sine', 0.18);
}

// A short tick when the timer drops under ten seconds.
export function playTick() {
  tone(1200, 0, 0.06, 'sine', 0.08);
}
