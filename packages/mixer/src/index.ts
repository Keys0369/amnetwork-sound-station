import type { Mixer as MixerType, MixerTrack } from "@amnetwork/types";
import { generateId } from "@amnetwork/shared";
import { AudioEngine } from "@amnetwork/audio-engine";

/**
 * Multi-track mixer
 * Manages multiple audio tracks with individual volume/pan control
 */
export class Mixer {
  private mixer: MixerType;
  private engine: AudioEngine;
  private trackSources = new Map<string, AudioBufferSourceNode>();
  private trackGains = new Map<string, GainNode>();
  private trackPans = new Map<string, StereoPannerNode>();

  constructor(engine: AudioEngine, initialMixer?: MixerType) {
    this.engine = engine;
    this.mixer = initialMixer || {
      id: generateId(),
      tracks: [],
      masterVolume: 0.8,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }

  /**
   * Add track to mixer
   */
  async addTrack(track: Omit<MixerTrack, "id" | "order" | "createdAt" | "updatedAt">): Promise<MixerTrack> {
    const newTrack: MixerTrack = {
      ...track,
      id: generateId(),
      order: this.mixer.tracks.length,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.mixer.tracks.push(newTrack);

    // Create audio nodes for this track
    const context = await this.engine.getAudioContext();
    const masterGain = await this.engine.getMasterGain();

    const gainNode = context.createGain();
    gainNode.gain.value = newTrack.volume;
    gainNode.connect(masterGain);

    const panNode = context.createStereoPanner();
    panNode.pan.value = newTrack.pan;
    panNode.connect(gainNode);

    this.trackGains.set(newTrack.id, gainNode);
    this.trackPans.set(newTrack.id, panNode);

    return newTrack;
  }

  /**
   * Remove track from mixer
   */
  async removeTrack(trackId: string): Promise<void> {
    const index = this.mixer.tracks.findIndex((t) => t.id === trackId);
    if (index > -1) {
      this.mixer.tracks.splice(index, 1);

      // Stop and disconnect track
      if (this.trackSources.has(trackId)) {
        const source = this.trackSources.get(trackId)!;
        source.stop();
        this.trackSources.delete(trackId);
      }

      this.trackGains.delete(trackId);
      this.trackPans.delete(trackId);
    }

    this.mixer.updatedAt = new Date();
  }

  /**
   * Set track volume
   */
  async setTrackVolume(trackId: string, volume: number): Promise<void> {
    const track = this.mixer.tracks.find((t) => t.id === trackId);
    if (!track) return;

    track.volume = Math.max(0, Math.min(1, volume));

    const gainNode = this.trackGains.get(trackId);
    if (gainNode) {
      gainNode.gain.value = track.volume;
    }

    this.mixer.updatedAt = new Date();
  }

  /**
   * Set track pan
   */
  async setTrackPan(trackId: string, pan: number): Promise<void> {
    const track = this.mixer.tracks.find((t) => t.id === trackId);
    if (!track) return;

    track.pan = Math.max(-1, Math.min(1, pan));

    const panNode = this.trackPans.get(trackId);
    if (panNode) {
      panNode.pan.value = track.pan;
    }

    this.mixer.updatedAt = new Date();
  }

  /**
   * Set track mute
   */
  async setTrackMute(trackId: string, muted: boolean): Promise<void> {
    const track = this.mixer.tracks.find((t) => t.id === trackId);
    if (!track) return;

    track.muted = muted;

    const gainNode = this.trackGains.get(trackId);
    if (gainNode) {
      gainNode.gain.value = muted ? 0 : track.volume;
    }

    this.mixer.updatedAt = new Date();
  }

  /**
   * Set master volume
   */
  async setMasterVolume(volume: number): Promise<void> {
    this.mixer.masterVolume = Math.max(0, Math.min(1, volume));
    await this.engine.setMasterVolume(this.mixer.masterVolume);
    this.mixer.updatedAt = new Date();
  }

  /**
   * Get mixer state
   */
  getMixer(): MixerType {
    return this.mixer;
  }

  /**
   * Get all tracks
   */
  getTracks(): MixerTrack[] {
    return this.mixer.tracks;
  }

  /**
   * Get track by ID
   */
  getTrack(trackId: string): MixerTrack | undefined {
    return this.mixer.tracks.find((t) => t.id === trackId);
  }
}
