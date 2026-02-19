---
name: sfx-elements
description: Install CC0 sound effects from the Elements registry. Use when user needs UI sounds (click, pop, notification), transition sounds (whoosh, swoosh), cinematic sounds (boom, riser, glitch), or audio for video production. Triggers on "sound effect", "SFX", "audio", "notification sound", "click sound", "whoosh", "UI sound", "sound for video", "play sound", "useSound".
---

# SFX Elements

17 CC0 sound effects. Dual format: TypeScript modules for React + raw MP3 for video/agents.

## Install (React / Web Audio)

```bash
npx shadcn@latest add @elements/sfx-{name}
```

Installs the sound as a TypeScript module with inline base64 audio, plus `useSound` hook and sound engine.

## Install (Video / Agents)

```bash
curl -o public/sfx/{name}.mp3 https://tryelements.dev/sfx/{name}.mp3
```

## Sounds

### Transitions (6)

| Sound | Duration | Install |
|-------|----------|---------|
| Whoosh | 0.57s | `@elements/sfx-whoosh` |
| Whoosh Alt 1 | 1.10s | `@elements/sfx-whoosh-alt1` |
| Whoosh Alt 2 | 1.56s | `@elements/sfx-whoosh-alt2` |
| Magic Reveal | 2.04s | `@elements/sfx-magic-reveal` |
| Reverse Whoosh | 5.85s | `@elements/sfx-reverse-whoosh` |
| Swoosh | 4.08s | `@elements/sfx-swoosh` |

### UI (6)

| Sound | Duration | Install |
|-------|----------|---------|
| Click | 1.03s | `@elements/sfx-click` |
| Pop | 1.02s | `@elements/sfx-pop` |
| Keyboard | 8.05s | `@elements/sfx-keyboard` |
| Notification | 2.12s | `@elements/sfx-notification` |
| Error | 0.53s | `@elements/sfx-error` |
| Success | 2.54s | `@elements/sfx-success` |

### Cinematic (5)

| Sound | Duration | Install |
|-------|----------|---------|
| Riser | 4.03s | `@elements/sfx-riser` |
| Shutter | 7.87s | `@elements/sfx-shutter` |
| Glitch | 2.64s | `@elements/sfx-glitch` |
| Boom | 4.30s | `@elements/sfx-boom` |
| Drone | 6.82s | `@elements/sfx-drone` |

## Bundles

| Need | Command |
|------|---------|
| All 17 sounds | `@elements/sfx-all` |
| Transitions | `@elements/sfx-transitions` |
| UI sounds | `@elements/sfx-ui` |
| Cinematic | `@elements/sfx-cinematic` |

## Usage

```tsx
import { useSound } from "@/hooks/use-sound";
import { whooshSound } from "@/components/sfx/whoosh";

export function TransitionButton() {
  const { play } = useSound(whooshSound, { volume: 0.5 });
  return <button onClick={() => play()}>Transition</button>;
}
```

## Timing Guidelines

| Event | Sound | When |
|-------|-------|------|
| Text appears | pop, click | exact frame |
| Scene transition | whoosh, swoosh | 100ms before cut |
| Fast cut | swoosh | 50ms before cut |
| Dramatic reveal | magic-reveal, boom | 50ms before |
| Error state | error, glitch | at reveal |
| Success/deploy | success | at reveal |
| Build tension | drone, riser | start of section |

## Discover All Sounds

```bash
curl -s https://tryelements.dev/r/sfx-index.json | jq '.sounds[].name'
```

## Discovery

Browse https://tryelements.dev/docs/sfx

## License

All sounds are CC0 (public domain). No attribution required. Free for commercial use.
