import type { AudioEngineConfig, PlaybackState } from "@amnetwork/types";

/**
 * Core Audio Engine
 * Handles playback, mixing, and audio context management
 */
export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isInitialized = false;
  private config: AudioEngineConfig;

  constructor(config: Partial<AudioEngineConfig> = {}) {
    this.config = {
      sampleRate: config.sampleRate ?? 44100,
      bufferSize: config.bufferSize ?? 4096,
      numberOfChannels: config.numberOfChannels ?? 2,
      latency: config.latency,
    };
  }

  /**
   * Initialize the audio context and master gain
   * Handles browser autoplay policies
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;

      if (!AudioContextClass) {
        throw new Error("AudioContext not supported in this browser");
      }

      this.audioContext = new AudioContextClass({
        sampleRate: this.config.sampleRate,
        latencyHint: this.config.latency ? "interactive" : undefined,
      });

      // Create master gain node
      this.masterGain = this.audioContext.createGain();
      this.masterGain.connect(this.audioContext.destination);
      this.masterGain.gain.value = 0.8; // Default volume at 80%

      this.isInitialized = true;

      // Resume context if suspended (autoplay policy)
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }
    } catch (error) {
      console.error("[AudioEngine] Initialization error:", error);
      throw error;
    }
  }

  /**
   * Get or create audio context
   */
  async getAudioContext(): Promise<AudioContext> {
    if (!this.audioContext) {
      await this.initialize();
    }

    if (!this.audioContext) {
      throw new Error("[AudioEngine] Failed to initialize AudioContext");
    }

    return this.audioContext;
  }

  /**
   * Get master gain node
   */
  async getMasterGain(): Promise<GainNode> {
    if (!this.masterGain) {
      await this.initialize();
    }

    if (!this.masterGain) {
      throw new Error("[AudioEngine] Failed to initialize master gain");
    }

    return this.masterGain;
  }

  /**
   * Set master volume (0-1)
   */
  async setMasterVolume(volume: number): Promise<void> {
    try {
      const gain = await this.getMasterGain();
      gain.gain.value = Math.max(0, Math.min(1, volume));
    } catch (error) {
      console.error("[AudioEngine] setMasterVolume error:", error);
      throw error;
    }
  }

  /**
   * Get current master volume
   */
  async getMasterVolume(): Promise<number> {
    try {
      const gain = await this.getMasterGain();
      return gain.gain.value;
    } catch (error) {
      console.error("[AudioEngine] getMasterVolume error:", error);
      throw error;
    }
  }

  /**
   * Decode audio data
   */
  async decodeAudio(arrayBuffer: ArrayBuffer): Promise<AudioBuffer> {
    try {
      const context = await this.getAudioContext();
      return context.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error("[AudioEngine] decodeAudio error:", error);
      throw error;
    }
  }

  /**
   * Create a source and connect to master output
   */
  async createSource(audioBuffer: AudioBuffer): Promise<AudioBufferSourceNode> {
    try {
      const context = await this.getAudioContext();
      const masterGain = await this.getMasterGain();

      const source = context.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(masterGain);

      return source;
    } catch (error) {
      console.error("[AudioEngine] createSource error:", error);
      throw error;
    }
  }

  /**
   * Resume audio context (required for autoplay policy)
   */
  async resume(): Promise<void> {
    try {
      if (this.audioContext && this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }
    } catch (error) {
      console.error("[AudioEngine] resume error:", error);
      throw error;
    }
  }

  /**
   * Get current time
   */
  async getCurrentTime(): Promise<number> {
    try {
      const context = await this.getAudioContext();
      return context.currentTime;
    } catch (error) {
      console.error("[AudioEngine] getCurrentTime error:", error);
      throw error;
    }
  }

  /**
   * Dispose of resources
   */
  async dispose(): Promise<void> {
    try {
      if (this.audioContext) {
        await this.audioContext.close();
        this.audioContext = null;
        this.masterGain = null;
        this.isInitialized = false;
      }
    } catch (error) {
      console.error("[AudioEngine] dispose error:", error);
      throw error;
    }
  }

  /**
   * Check if initialized
   */
  isReady(): boolean {
    return this.isInitialized && this.audioContext !== null;
  }
}

/**
 * Simple audio player for testing
 */
export class AudioPlayer {
  private engine: AudioEngine;
  private source: AudioBufferSourceNode | null = null;
  private startTime: number = 0;
  private pauseTime: number = 0;
  private isPlaying: boolean = false;
  private audioBuffer: AudioBuffer | null = null;

  constructor(engine: AudioEngine) {
    this.engine = engine;
  }

  async play(audioBuffer: AudioBuffer): Promise<void> {
    try {
      await this.engine.initialize();

      if (this.isPlaying) {
        await this.stop();
      }

      this.audioBuffer = audioBuffer;
      this.source = await this.engine.createSource(audioBuffer);

      const currentTime = await this.engine.getCurrentTime();
      this.startTime = currentTime - this.pauseTime;

      this.source.start(0, this.pauseTime);
      this.isPlaying = true;
    } catch (error) {
      console.error("[AudioPlayer] play error:", error);
      throw error;
    }
  }

  async pause(): Promise<void> {
    try {
      if (this.source && this.isPlaying) {
        const currentTime = await this.engine.getCurrentTime();
        this.pauseTime = currentTime - this.startTime;
        this.source.stop();
        this.isPlaying = false;
      }
    } catch (error) {
      console.error("[AudioPlayer] pause error:", error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      if (this.source && this.isPlaying) {
        this.source.stop();
        this.isPlaying = false;
        this.pauseTime = 0;
        this.startTime = 0;
      }
    } catch (error) {
      console.error("[AudioPlayer] stop error:", error);
      throw error;
    }
  }

  async setVolume(volume: number): Promise<void> {
    try {
      await this.engine.setMasterVolume(volume);
    } catch (error) {
      console.error("[AudioPlayer] setVolume error:", error);
      throw error;
    }
  }

  isPlayingState(): boolean {
    return this.isPlaying;
  }
}
