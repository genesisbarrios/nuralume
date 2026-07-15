// Tiny synthesized sound effects for the grounding games — generated on the
// fly via the Web Audio API rather than shipped as audio files, so there's
// no external asset to source, license, or load.
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    audioCtx = new Ctor();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Mobile browsers (iOS Safari in particular) only allow an AudioContext to
// be created/resumed synchronously inside a direct user-gesture event —
// and React Three Fiber dispatches its own pointer/click events through a
// pipeline that isn't reliably treated as "direct" by that check. Calling
// this from a plain native DOM listener (e.g. onPointerDown on the game's
// root element, outside the Canvas) unlocks the context up front so later
// sound calls triggered from R3F events still work.
export function unlockAudio() {
  getAudioContext();
}

export function playPopSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  // Randomize pitch and volume a bit each pop so a run of clicks doesn't
  // sound like the exact same sample looping.
  const startFreq = 700 + Math.random() * 400; // 700–1100 Hz
  const endFreq = 160 + Math.random() * 140; // 160–300 Hz
  const peakGain = 0.26 + Math.random() * 0.18; // 0.26–0.44
  const duration = 0.08 + Math.random() * 0.05; // 0.08–0.13s

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(peakGain, now + 0.008);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration + 0.03);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.05);
}

export function playWooshSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const bufferSize = Math.floor(ctx.sampleRate * 0.3);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.Q.value = 0.9;
  filter.frequency.setValueAtTime(500, now);
  filter.frequency.exponentialRampToValueAtTime(3500, now + 0.12);
  filter.frequency.exponentialRampToValueAtTime(700, now + 0.28);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.4, now + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + 0.3);
}

// A sharp crack (filtered noise burst) followed by a low rolling rumble —
// for the demon catching the seraphim in Crystal Collector.
export function playThunderSound() {
  const ctx = getAudioContext();
  if (!ctx) return;
  const now = ctx.currentTime;

  const crackSize = Math.floor(ctx.sampleRate * 0.15);
  const crackBuffer = ctx.createBuffer(1, crackSize, ctx.sampleRate);
  const crackData = crackBuffer.getChannelData(0);
  for (let i = 0; i < crackSize; i++) {
    crackData[i] = (Math.random() * 2 - 1) * (1 - i / crackSize);
  }
  const crack = ctx.createBufferSource();
  crack.buffer = crackBuffer;
  const crackFilter = ctx.createBiquadFilter();
  crackFilter.type = "highpass";
  crackFilter.frequency.setValueAtTime(1200, now);
  const crackGain = ctx.createGain();
  crackGain.gain.setValueAtTime(0.5, now);
  crackGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
  crack.connect(crackFilter);
  crackFilter.connect(crackGain);
  crackGain.connect(ctx.destination);
  crack.start(now);
  crack.stop(now + 0.15);

  const rumbleSize = Math.floor(ctx.sampleRate * 0.9);
  const rumbleBuffer = ctx.createBuffer(1, rumbleSize, ctx.sampleRate);
  const rumbleData = rumbleBuffer.getChannelData(0);
  for (let i = 0; i < rumbleSize; i++) {
    rumbleData[i] = Math.random() * 2 - 1;
  }
  const rumble = ctx.createBufferSource();
  rumble.buffer = rumbleBuffer;
  const rumbleFilter = ctx.createBiquadFilter();
  rumbleFilter.type = "lowpass";
  rumbleFilter.frequency.setValueAtTime(220, now + 0.1);
  const rumbleGain = ctx.createGain();
  rumbleGain.gain.setValueAtTime(0.0001, now + 0.1);
  rumbleGain.gain.exponentialRampToValueAtTime(0.35, now + 0.15);
  rumbleGain.gain.exponentialRampToValueAtTime(0.0001, now + 1);
  rumble.connect(rumbleFilter);
  rumbleFilter.connect(rumbleGain);
  rumbleGain.connect(ctx.destination);
  rumble.start(now + 0.1);
  rumble.stop(now + 1);
}
