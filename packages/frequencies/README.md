# @amnetwork/frequencies

Binaural beat and frequency generation for the AMNetwork Sound Station.

## Overview

Generates pure tones, binaural beats, and healing frequencies for wellness:
- Pure sine wave tones
- Binaural beats (isochronic tones for brain wave entrainment)
- Solfeggio healing frequencies
- Brainwave state recommendations
- Fade in/out for smooth transitions

## Brainwave States

| State | Frequency Range | Use |
|-------|-----------------|-----|
| Delta | 0.5-4 Hz | Deep sleep, recovery |
| Theta | 4-8 Hz | Meditation, creativity |
| Alpha | 8-12 Hz | Relaxation, focused calm |
| Beta | 12-30 Hz | Active thinking, alert |
| Gamma | 30-100 Hz | Cognitive processing |

## Solfeggio Frequencies

- **396 Hz** — Liberation from fear and guilt
- **417 Hz** — Transformation and positive change
- **528 Hz** — Healing and regeneration
- **639 Hz** — Connection and harmonious relationships
- **741 Hz** — Awakening and intuition
- **852 Hz** — Spiritual awakening

## Usage

### Generate Pure Tone

```typescript
import { generateTone } from "@amnetwork/frequencies";

const audioBuffer = generateTone(
  432, // frequency in Hz
  10000, // duration in ms
  44100 // sample rate
);
```

### Generate Binaural Beat

```typescript
import { generateBinauralBeat } from "@amnetwork/frequencies";

const audioBuffer = generateBinauralBeat(
  200, // base frequency
  5, // beat frequency (for theta state)
  30000 // duration in ms
);
```

### Get Frequency for State

```typescript
import { getFrequencyForState } from "@amnetwork/frequencies";

const meditationFreq = getFrequencyForState("meditation");
// { frequency: 200, beatFrequency: 5, name: "Meditation (Theta)" }

const sleepFreq = getFrequencyForState("sleep");
// { frequency: 432, beatFrequency: 2, name: "Sleep" }
```

## Constants

### FREQUENCIES
Brainwave frequency ranges:
```typescript
import { FREQUENCIES } from "@amnetwork/frequencies";

console.log(FREQUENCIES.theta); // { min: 4, max: 8, name: "Theta", ... }
```

### SOLFEGGIO
Healing frequencies:
```typescript
import { SOLFEGGIO } from "@amnetwork/frequencies";

console.log(SOLFEGGIO.s528); // 528
```

## Building

```bash
pnpm build
```

## Testing

```bash
pnpm test
```
