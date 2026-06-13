interface SoundConfig {
  readonly frequency: number;
  readonly duration: number;
  readonly type: OscillatorType;
  readonly volume: number;
}

const SOUNDS: Record<string, SoundConfig> = {
  click: { frequency: 800, duration: 0.05, type: "square", volume: 0.1 },
  hover: { frequency: 600, duration: 0.03, type: "sine", volume: 0.05 },
  success: { frequency: 1200, duration: 0.1, type: "sine", volume: 0.08 },
  error: { frequency: 200, duration: 0.15, type: "square", volume: 0.1 },
};

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (audioCtx) return audioCtx;

  try {
    if (typeof AudioContext !== "undefined") {
      audioCtx = new AudioContext();
      return audioCtx;
    }

    return null;
  } catch {
    return null;
  }
}

export function playSound(name: string): void {
  const config = SOUNDS[name];
  if (!config) return;

  if (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    if (ctx.state === "suspended") {
      void ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, ctx.currentTime);

    gainNode.gain.setValueAtTime(config.volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      ctx.currentTime + config.duration,
    );

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + config.duration);
  } catch {
    // Silently fail — sound is non-critical
  }
}

export function resumeAudioContext(): void {
  const ctx = getAudioContext();
  if (ctx && ctx.state === "suspended") {
    void ctx.resume();
  }
}