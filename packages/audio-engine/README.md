# @amnetwork/audio-engine

Core audio playback and mixing engine for the AMNetwork Sound Station.

## Overview

Provides a low-level, browser-agnostic interface to the Web Audio API with:
- AudioContext management
- Autoplay policy handling
- Gain and volume control
- Audio buffer decoding
- Simple playback abstraction
- Comprehensive error handling

## Core Classes

### AudioEngine
Main audio context manager:

```typescript
import { AudioEngine } from "@amnetwork/audio-engine";

const engine = new AudioEngine({
  sampleRate: 44100,
  bufferSize: 4096,
});

await engine.initialize();
const context = await engine.getAudioContext();
await engine.setMasterVolume(0.8);
```

### AudioPlayer
Simple playback wrapper:

```typescript
import { AudioEngine, AudioPlayer } from "@amnetwork/audio-engine";

const engine = new AudioEngine();
const player = new AudioPlayer(engine);

// Decode audio
const response = await fetch("/audio.mp3");
const buffer = await response.arrayBuffer();
const decoded = await engine.decodeAudio(buffer);

// Play
await player.play(decoded);
await player.setVolume(0.5);
```

## API

### AudioEngine

- `initialize()` — Initialize AudioContext with autoplay handling
- `getAudioContext()` — Get or create AudioContext
- `getMasterGain()` — Get master gain node
- `setMasterVolume(volume)` — Set volume (0-1)
- `getMasterVolume()` — Get current volume
- `decodeAudio(arrayBuffer)` — Decode audio data
- `createSource(audioBuffer)` — Create connected source node
- `resume()` — Resume suspended context
- `getCurrentTime()` — Get current playback time
- `dispose()` — Clean up resources
- `isReady()` — Check if initialized

### AudioPlayer

- `play(audioBuffer)` — Start playback
- `pause()` — Pause playback
- `stop()` — Stop and reset playback
- `setVolume(volume)` — Set player volume
- `isPlayingState()` — Check if currently playing

## Error Handling

All methods include comprehensive error logging with `[AudioEngine]` and `[AudioPlayer]` prefixes for debugging.

## Browser Support

Requires Web Audio API support (all modern browsers).

## Building

```bash
pnpm build
```

## Testing

```bash
pnpm test
```
