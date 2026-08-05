# @amnetwork/presets

Curated sound presets and mixer configurations for the AMNetwork Sound Station.

## Overview

Provides ready-to-use preset templates for common scenarios:
- Morning Meditation
- Focus & Work
- Sleep Journey
- Nature Walk
- Ocean Waves
- Frequency Healing (432 Hz)

## Usage

### Get Preset

```typescript
import { getPreset, listPresets } from "@amnetwork/presets";

const morningPreset = getPreset("morning_meditation");
const allPresets = listPresets();
```

### Create Preset Track

```typescript
import { createPresetTrack } from "@amnetwork/presets";

const track = createPresetTrack("rain", 0.8);
// {
//   name: "RAIN",
//   soundAssetId: "rain",
//   volume: 0.8,
//   pan: 0,
//   muted: false,
//   solo: false,
//   loop: true,
//   fadeInDuration: 0,
//   fadeOutDuration: 0,
//   playbackSpeed: 1
// }
```

## Presets

| ID | Name | Category | Sounds |
|----|------|----------|--------|
| `morning_meditation` | Morning Meditation | Meditation | Birds, soft rain, piano |
| `focus_work` | Focus & Work | Focus | White noise, light rain |
| `sleep_journey` | Sleep Journey | Sleep | Rain, distant thunder, harp |
| `nature_walk` | Nature Walk | Nature | Forest, birds, stream |
| `ocean_waves` | Ocean Waves | Nature | Ocean waves, seagulls |
| `frequency_432hz` | Frequency Healing (432 Hz) | Frequencies | 432 Hz tone |

## API

- `getPreset(name)` — Get preset by name
- `listPresets()` — List all available presets
- `createPresetTrack(soundAssetId, volume)` — Create mixer track for preset
- `PRESET_TEMPLATES` — Raw preset data

## Building

```bash
pnpm build
```
