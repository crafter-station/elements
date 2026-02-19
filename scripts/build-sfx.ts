#!/usr/bin/env bun

import { execSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";

function getMp3Duration(buffer: Buffer): number {
  let offset = 0;

  if (
    buffer.length > 10 &&
    buffer[0] === 0x49 &&
    buffer[1] === 0x44 &&
    buffer[2] === 0x33
  ) {
    const size =
      (buffer[6] << 21) | (buffer[7] << 14) | (buffer[8] << 7) | buffer[9];
    offset = 10 + size;
  }

  const MPEG1_BITRATES = [
    0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, -1,
  ];
  const MPEG2_BITRATES = [
    0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160, -1,
  ];
  const MPEG1_SAMPLE_RATES = [44100, 48000, 32000, 0];
  const MPEG2_SAMPLE_RATES = [22050, 24000, 16000, 0];
  const MPEG25_SAMPLE_RATES = [11025, 12000, 8000, 0];

  while (offset < buffer.length - 4) {
    const header = buffer.readUInt32BE(offset);
    if ((header & 0xffe00000) >>> 0 !== 0xffe00000) {
      offset++;
      continue;
    }
    const mpegVersion = (header >> 19) & 0x03;
    const layer = (header >> 17) & 0x03;
    const bitrateIndex = (header >> 12) & 0x0f;
    const sampleRateIndex = (header >> 10) & 0x03;

    if (layer !== 1 || mpegVersion === 1 || sampleRateIndex === 3) {
      offset++;
      continue;
    }

    let sampleRate: number;
    if (mpegVersion === 3) sampleRate = MPEG1_SAMPLE_RATES[sampleRateIndex];
    else if (mpegVersion === 2)
      sampleRate = MPEG2_SAMPLE_RATES[sampleRateIndex];
    else sampleRate = MPEG25_SAMPLE_RATES[sampleRateIndex];

    const xingOffset = offset + 4 + (mpegVersion === 3 ? 32 : 17);
    if (xingOffset + 12 < buffer.length) {
      const tag = buffer.toString("ascii", xingOffset, xingOffset + 4);
      if (tag === "Xing" || tag === "Info") {
        const flags = buffer.readUInt32BE(xingOffset + 4);
        if (flags & 0x01) {
          const frames = buffer.readUInt32BE(xingOffset + 8);
          const samplesPerFrame = mpegVersion === 3 ? 1152 : 576;
          return (frames * samplesPerFrame) / sampleRate;
        }
      }
    }

    const bitrates = mpegVersion === 3 ? MPEG1_BITRATES : MPEG2_BITRATES;
    const bitrate = bitrates[bitrateIndex] * 1000;
    if (bitrate > 0) {
      return (buffer.length * 8) / bitrate;
    }

    break;
  }

  return 0;
}

const ROOT = resolve(import.meta.dirname, "..");
const SFX_REGISTRY_DIR = join(ROOT, "registry/default/blocks/sfx");
const PUBLIC_SFX_DIR = join(ROOT, "public/sfx");
const PUBLIC_R_DIR = join(ROOT, "public/r");
const TEMP_DIR = join(ROOT, ".tmp-sfx");
const MAX_BASE64_SIZE_KB = 100;

interface SfxEntry {
  name: string;
  exportName: string;
  category: string;
  duration: number;
  sizeBytes: number;
  compressedSizeBytes: number;
  license: string;
}

function toCamelCase(kebab: string): string {
  return kebab.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function findSoundDirs(): string[] {
  const dirs: string[] = [];
  if (!existsSync(SFX_REGISTRY_DIR)) return dirs;

  for (const entry of readdirSync(SFX_REGISTRY_DIR)) {
    if (entry.startsWith("_")) continue;
    const dir = join(SFX_REGISTRY_DIR, entry);
    if (!statSync(dir).isDirectory()) continue;
    const assetsDir = join(dir, "assets");
    if (!existsSync(assetsDir)) continue;
    const mp3s = readdirSync(assetsDir).filter((f) => f.endsWith(".mp3"));
    if (mp3s.length > 0) dirs.push(entry);
  }
  return dirs.sort();
}

function getCategoryFromRegistry(soundDir: string): string {
  const regPath = join(SFX_REGISTRY_DIR, soundDir, "registry-item.json");
  if (!existsSync(regPath)) return "other";
  const reg = JSON.parse(readFileSync(regPath, "utf-8"));
  const cats: string[] = reg.categories || [];
  return cats.find((c: string) => c !== "sfx") || "other";
}

function main() {
  console.log("Building SFX registry...\n");

  mkdirSync(PUBLIC_SFX_DIR, { recursive: true });
  mkdirSync(PUBLIC_R_DIR, { recursive: true });
  mkdirSync(TEMP_DIR, { recursive: true });

  const soundDirs = findSoundDirs();
  console.log(`Found ${soundDirs.length} sounds\n`);

  const entries: SfxEntry[] = [];

  for (const name of soundDirs) {
    const assetPath = join(SFX_REGISTRY_DIR, name, "assets", `${name}.mp3`);
    if (!existsSync(assetPath)) {
      console.log(`  SKIP ${name} - no asset file`);
      continue;
    }

    const originalBuffer = readFileSync(assetPath);
    const originalSizeKb = Math.round(originalBuffer.length / 1024);
    const category = getCategoryFromRegistry(name);

    let mp3Path = assetPath;
    const needsCompress = originalSizeKb > MAX_BASE64_SIZE_KB;

    if (needsCompress) {
      const tempPath = join(TEMP_DIR, `${name}.mp3`);
      try {
        execSync(
          `ffmpeg -y -i "${assetPath}" -c:a libmp3lame -b:a 64k -ac 1 -ar 44100 "${tempPath}"`,
          { stdio: "pipe" },
        );
        mp3Path = tempPath;
        console.log(
          `  COMPRESS ${name}: ${originalSizeKb}KB -> ${Math.round(statSync(tempPath).size / 1024)}KB`,
        );
      } catch {
        console.log(
          `  WARN ${name} - ffmpeg compression failed, using original`,
        );
        mp3Path = assetPath;
      }
    }

    const mp3Buffer = readFileSync(mp3Path);
    const finalSizeKb = Math.round(mp3Buffer.length / 1024);

    const duration = getMp3Duration(mp3Buffer);

    const base64 = mp3Buffer.toString("base64");
    const dataUri = `data:audio/mpeg;base64,${base64}`;
    const exportName = `${toCamelCase(name)}Sound`;

    const tsContent = `import type { SoundAsset } from "@/lib/sound-types";

export const ${exportName}: SoundAsset = {
  name: "${name}",
  dataUri: "${dataUri}",
  duration: ${duration.toFixed(3)},
  format: "mp3",
  license: "CC0",
  author: "Elements",
};
`;

    const componentDir = join(SFX_REGISTRY_DIR, name, "components", "sfx");
    mkdirSync(componentDir, { recursive: true });
    writeFileSync(join(componentDir, `${name}.ts`), tsContent);

    cpSync(mp3Path, join(PUBLIC_SFX_DIR, `${name}.mp3`));

    entries.push({
      name,
      exportName,
      category,
      duration: Number.parseFloat(duration.toFixed(3)),
      sizeBytes: originalBuffer.length,
      compressedSizeBytes: mp3Buffer.length,
      license: "CC0",
    });

    console.log(
      `  OK ${name} (${finalSizeKb}KB, ${duration.toFixed(2)}s, ${category})`,
    );
  }

  const sfxIndex = {
    generated: new Date().toISOString(),
    count: entries.length,
    sounds: entries.map((e) => ({
      name: e.name,
      category: e.category,
      duration: e.duration,
      sizeBytes: e.compressedSizeBytes,
      license: e.license,
      url: `https://tryelements.dev/sfx/${e.name}.mp3`,
      registry: `https://tryelements.dev/r/sfx-${e.name}.json`,
    })),
    bundles: {
      transitions: entries
        .filter((e) => e.category === "transition")
        .map((e) => e.name),
      ui: entries.filter((e) => e.category === "ui").map((e) => e.name),
      cinematic: entries
        .filter((e) => e.category === "cinematic")
        .map((e) => e.name),
    },
  };

  writeFileSync(
    join(PUBLIC_R_DIR, "sfx-index.json"),
    JSON.stringify(sfxIndex, null, 2),
  );
  console.log(`\nWrote sfx-index.json (${entries.length} sounds)`);

  try {
    rmSync(TEMP_DIR, { recursive: true });
  } catch {}

  console.log("\nSFX build complete!");
}

main();
