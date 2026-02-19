---
name: uploadthing-elements
description: Install UploadThing file upload components from the Elements registry. Use when user needs file uploads, drag-and-drop dropzones, avatar uploads, file cards, image grids, paste-to-upload, or upload progress indicators. Triggers on "upload", "file upload", "dropzone", "uploadthing", "drag and drop upload", "image grid", "paste upload", "avatar upload".
---

# UploadThing Elements

7 file upload components. Requires `@uploadthing/react` (auto-installed as dependency).

## Install Pattern

```bash
npx shadcn@latest add @elements/uploadthing-{name}
```

## Components

| Component | Install | Description |
|-----------|---------|-------------|
| Button | `@elements/uploadthing-button` | Simple upload button |
| Dropzone | `@elements/uploadthing-dropzone` | Drag-and-drop zone with progress |
| Avatar | `@elements/uploadthing-avatar` | Avatar upload with crop |
| File Card | `@elements/uploadthing-file-card` | File display card |
| Image Grid | `@elements/uploadthing-image-grid` | Image gallery from uploads |
| Paste | `@elements/uploadthing-paste` | Paste-to-upload area |
| Progress | `@elements/uploadthing-progress` | Upload progress indicator |

## Quick Patterns

```bash
# Basic upload
npx shadcn@latest add @elements/uploadthing-button @elements/uploadthing-progress

# Full file management
npx shadcn@latest add @elements/uploadthing-dropzone @elements/uploadthing-file-card @elements/uploadthing-image-grid

# Avatar upload
npx shadcn@latest add @elements/uploadthing-avatar
```

## Setup

Requires UploadThing API key and file router. See https://docs.uploadthing.com/getting-started

## Discovery

Browse https://tryelements.dev/docs/uploadthing
