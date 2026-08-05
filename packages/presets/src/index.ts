import type { Preset, MixerTrack } from "@amnetwork/types";

/**
 * Curated preset templates
 */
export const PRESET_TEMPLATES: Record<string, Preset> = {
  morning_meditation: {
    id: "morning_meditation",
    name: "Morning Meditation",
    description: "Start your day with gentle nature sounds and soft instruments",
    category: "Meditation",
    soundAssetIds: ["birds_chirping", "soft_rain", "piano_calm"],
    tags: ["morning", "meditation", "nature"],
    mixer: {
      id: "mixer_morning",
      tracks: [],
      masterVolume: 0.75,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  focus_work: {
    id: "focus_work",
    name: "Focus & Work",
    description: "Boost concentration with white noise and light rain",
    category: "Focus",
    soundAssetIds: ["white_noise", "light_rain"],
    tags: ["focus", "work", "concentration"],
    mixer: {
      id: "mixer_focus",
      tracks: [],
      masterVolume: 0.6,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  sleep_journey: {
    id: "sleep_journey",
    name: "Sleep Journey",
    description: "Drift into peaceful sleep with rain, thunder, and harp",
    category: "Sleep",
    soundAssetIds: ["heavy_rain", "distant_thunder", "harp_gentle"],
    tags: ["sleep", "relaxation", "night"],
    mixer: {
      id: "mixer_sleep",
      tracks: [],
      masterVolume: 0.5,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  nature_walk: {
    id: "nature_walk",
    name: "Nature Walk",
    description: "Immerse yourself in a forest walk with birds and streams",
    category: "Nature",
    soundAssetIds: ["forest_ambience", "birds_singing", "stream_flowing"],
    tags: ["nature", "outdoor", "relaxation"],
    mixer: {
      id: "mixer_nature",
      tracks: [],
      masterVolume: 0.7,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  ocean_waves: {
    id: "ocean_waves",
    name: "Ocean Waves",
    description: "Feel the calm of ocean waves and seagulls",
    category: "Nature",
    soundAssetIds: ["ocean_waves", "seagulls"],
    tags: ["ocean", "beach", "relaxation"],
    mixer: {
      id: "mixer_ocean",
      tracks: [],
      masterVolume: 0.65,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  frequency_432hz: {
    id: "frequency_432hz",
    name: "Frequency Healing (432 Hz)",
    description: "Experience the resonance of 432 Hz healing frequency",
    category: "Frequencies",
    soundAssetIds: ["432hz_tone"],
    tags: ["frequency", "healing", "meditation"],
    mixer: {
      id: "mixer_432hz",
      tracks: [],
      masterVolume: 0.7,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    isFavorite: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

/**
 * Get preset by name
 */
export function getPreset(name: string): Preset | undefined {
  return PRESET_TEMPLATES[name];
}

/**
 * List all available presets
 */
export function listPresets(): Preset[] {
  return Object.values(PRESET_TEMPLATES);
}

/**
 * Create a mixer track for a sound asset
 */
export function createPresetTrack(
  soundAssetId: string,
  volume: number = 0.8
): Omit<MixerTrack, "id" | "order" | "createdAt" | "updatedAt"> {
  return {
    name: soundAssetId.replace(/_/g, " ").toUpperCase(),
    soundAssetId,
    volume: Math.max(0, Math.min(1, volume)),
    pan: 0,
    muted: false,
    solo: false,
    loop: true,
    fadeInDuration: 0,
    fadeOutDuration: 0,
    playbackSpeed: 1,
  };
}
