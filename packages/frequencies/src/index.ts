import type { AudioEngine } from "@amnetwork/audio-engine";

/**
 * Binaural beat frequencies for different states
 */
export const FREQUENCIES = {
  delta: { min: 0.5, max: 4, name: "Delta", use: "Deep sleep" },
  theta: { min: 4, max: 8, name: "Theta", use: "Meditation, creativity" },
  alpha: { min: 8, max: 12, name: "Alpha", use: "Relaxation, focus" },
  beta: { min: 12, max: 30, name: "Beta", use: "Active, alert" },
  gamma: { min: 30, max: 100, name: "Gamma", use: "Cognitive processing" },
} as const;

/**
 * Solfeggio frequencies for healing
 */
export const SOLFEGGIO = {
  s396: 396,
  s417: 417,
  s528: 528,
  s639: 639,
  s741: 741,
  s852: 852,
} as const;

/**
 * Generate pure tone at specified frequency
 */
export function generateTone(
  frequency: number,
  duration: number,
  sampleRate: number = 44100
): AudioBuffer {
  // Create offline context for tone generation
  const offlineContext = new OfflineAudioContext(2, sampleRate * (duration / 1000), sampleRate);

  // Create oscillator
  const oscillator = offlineContext.createOscillator();
  oscillator.frequency.value = frequency;
  oscillator.type = "sine";

  // Create gain for fade in/out
  const gain = offlineContext.createGain();
  gain.gain.setValueAtTime(0, 0);
  gain.gain.linearRampToValueAtTime(1, 0.1); // Fade in
  gain.gain.linearRampToValueAtTime(0, duration / 1000 - 0.1); // Fade out

  oscillator.connect(gain);
  gain.connect(offlineContext.destination);

  oscillator.start(0);
  oscillator.stop(duration / 1000);

  return offlineContext.startRendering() as any; // Simplified for now
}

/**
 * Generate binaural beat
 * Left ear: baseFrequency
 * Right ear: baseFrequency + beatFrequency
 */
export function generateBinauralBeat(
  baseFrequency: number,
  beatFrequency: number,
  duration: number,
  sampleRate: number = 44100
): AudioBuffer {
  try {
    const offlineContext = new OfflineAudioContext(2, sampleRate * (duration / 1000), sampleRate);

    // Left channel: base frequency
    const oscLeft = offlineContext.createOscillator();
    oscLeft.frequency.value = baseFrequency;
    oscLeft.type = "sine";

    // Right channel: base frequency + beat frequency
    const oscRight = offlineContext.createOscillator();
    oscRight.frequency.value = baseFrequency + beatFrequency;
    oscRight.type = "sine";

    // Splitter for stereo
    const splitter = offlineContext.createChannelSplitter(2);
    const merger = offlineContext.createChannelMerger(2);

    // Gain for fade in/out
    const gainLeft = offlineContext.createGain();
    const gainRight = offlineContext.createGain();

    const fadeInTime = 0.5;
    const fadeOutTime = 0.5;
    const durationSeconds = duration / 1000;

    gainLeft.gain.setValueAtTime(0, 0);
    gainLeft.gain.linearRampToValueAtTime(1, fadeInTime);
    gainLeft.gain.linearRampToValueAtTime(0, durationSeconds - fadeOutTime);

    gainRight.gain.setValueAtTime(0, 0);
    gainRight.gain.linearRampToValueAtTime(1, fadeInTime);
    gainRight.gain.linearRampToValueAtTime(0, durationSeconds - fadeOutTime);

    // Connect graph
    oscLeft.connect(gainLeft);
    oscRight.connect(gainRight);
    gainLeft.connect(merger, 0, 0);
    gainRight.connect(merger, 0, 1);
    merger.connect(offlineContext.destination);

    oscLeft.start(0);
    oscRight.start(0);
    oscLeft.stop(durationSeconds);
    oscRight.stop(durationSeconds);

    return offlineContext.startRendering() as any;
  } catch (error) {
    console.error("[Frequencies] generateBinauralBeat error:", error);
    throw error;
  }
}

/**
 * Get frequency recommendations for a state
 */
export function getFrequencyForState(
  state: "sleep" | "meditation" | "focus" | "energy" | "healing"
): { frequency: number; beatFrequency: number; name: string } {
  try {
    const recommendations = {
      sleep: { frequency: 432, beatFrequency: 2, name: "Sleep" },
      meditation: { frequency: 200, beatFrequency: 5, name: "Meditation (Theta)" },
      focus: { frequency: 200, beatFrequency: 10, name: "Focus (Alpha)" },
      energy: { frequency: 200, beatFrequency: 20, name: "Energy (Beta)" },
      healing: { frequency: 264, beatFrequency: 0, name: "Solfeggio 528 Hz" },
    };

    return recommendations[state];
  } catch (error) {
    console.error("[Frequencies] getFrequencyForState error:", error);
    throw error;
  }
}
