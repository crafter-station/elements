---
name: upstash-elements
description: Install Upstash serverless components from the Elements registry. Use when user needs rate limit displays, Redis counters, leaderboards, queue status cards, or cache badges. Triggers on "upstash", "rate limit", "redis counter", "leaderboard component", "queue card", "cache badge", "serverless redis".
---

# Upstash Elements

5 components for Upstash Redis, QStash, and rate limiting.

## Install Pattern

```bash
npx shadcn@latest add @elements/upstash-{name}
```

## Components

| Component | Install | Description |
|-----------|---------|-------------|
| Rate Limit | `@elements/upstash-ratelimit` | Rate limit status display |
| Counter | `@elements/upstash-counter` | Redis-backed counter |
| Leaderboard | `@elements/upstash-leaderboard` | Leaderboard component |
| Queue Card | `@elements/upstash-queue-card` | QStash queue status card |
| Cache Badge | `@elements/upstash-cache-badge` | Cache hit/miss badge |

## Quick Patterns

```bash
# API dashboard
npx shadcn@latest add @elements/upstash-ratelimit @elements/upstash-cache-badge

# Gamification
npx shadcn@latest add @elements/upstash-counter @elements/upstash-leaderboard

# All Upstash components
npx shadcn@latest add @elements/upstash-ratelimit @elements/upstash-counter @elements/upstash-leaderboard @elements/upstash-queue-card @elements/upstash-cache-badge
```

## Setup

Requires environment variables:
```
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

Get keys at https://console.upstash.com

## Discovery

Browse https://tryelements.dev/docs/upstash
