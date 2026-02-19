export interface SoundAsset {
  name: string;
  dataUri: string;
  duration: number;
  format: "mp3" | "wav" | "ogg";
  license: "CC0" | "OGA-BY" | "MIT";
  author: string;
}

export interface UseSoundOptions {
  volume?: number;
  playbackRate?: number;
  interrupt?: boolean;
  soundEnabled?: boolean;
  onPlay?: () => void;
  onEnd?: () => void;
  onPause?: () => void;
  onStop?: () => void;
}

export type PlayFunction = (overrides?: {
  volume?: number;
  playbackRate?: number;
}) => void;

export interface SoundControls {
  stop: () => void;
  pause: () => void;
  isPlaying: boolean;
  duration: number | null;
  sound: SoundAsset;
}

export type UseSoundReturn = readonly [PlayFunction, SoundControls];
