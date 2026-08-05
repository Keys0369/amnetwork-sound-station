# @amnetwork/ui

Reusable UI component library for the AMNetwork Sound Station.

## Overview

Provides accessible, customizable React components for building the Sound Station interface:
- Buttons (primary, secondary, danger)
- Cards (content containers)
- Sliders (volume, pan, speed)
- Toggles (switches)
- Icon buttons (compact)
- Theme provider (light/dark modes)

## Components

### Button

```tsx
import { Button } from "@amnetwork/ui";

<Button variant="primary" size="md" onClick={() => {}}>
  Play
</Button>
```

### Card

```tsx
import { Card } from "@amnetwork/ui";

<Card>
  <h3>Sound Library</h3>
  <p>Browse available sounds</p>
</Card>
```

### Slider

```tsx
import { Slider } from "@amnetwork/ui";

<Slider min={0} max={1} step={0.01} value={0.8} onChange={(v) => setVolume(v)} />
```

### Toggle

```tsx
import { Toggle } from "@amnetwork/ui";

<Toggle checked={muted} onChange={(checked) => setMuted(checked)} />
```

### IconButton

```tsx
import { IconButton } from "@amnetwork/ui";

<IconButton size="md" onClick={() => {}}>
  🔊
</IconButton>
```

### ThemeProvider

```tsx
import { ThemeProvider, defaultDarkTheme, useTheme } from "@amnetwork/ui";

function App() {
  return (
    <ThemeProvider theme={defaultDarkTheme}>
      <MainContent />
    </ThemeProvider>
  );
}

function MainContent() {
  const theme = useTheme();
  return <div style={{ background: theme.background }}>...</div>;
}
```

## Variants

### Button
- `variant`: "primary" | "secondary" | "danger"
- `size`: "sm" | "md" | "lg"
- `disabled`: boolean

### Slider
- `min`: number (default: 0)
- `max`: number (default: 100)
- `step`: number (default: 1)
- `value`: number
- `onChange`: (value) => void

### Theme
- `defaultLightTheme` — Light mode colors
- `defaultDarkTheme` — Dark mode colors
- Custom themes supported via `ThemeProvider`

## Building

```bash
pnpm build
```

## Peer Dependencies

- React ^18.0.0
- React DOM ^18.0.0
