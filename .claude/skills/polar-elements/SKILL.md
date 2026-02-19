---
name: polar-elements
description: Install Polar monetization components from the Elements registry. Use when user needs pricing cards, sponsor grids, subscription badges, revenue displays, or license key inputs. Triggers on "polar", "monetization", "pricing card", "subscription badge", "sponsor grid", "license key", "revenue card", "sponsorship", "pricing page".
---

# Polar Elements

5 monetization and subscription components for Polar.sh integration.

## Install Pattern

```bash
npx shadcn@latest add @elements/polar-{name}
```

## Components

| Component | Install | Description |
|-----------|---------|-------------|
| Pricing Card | `@elements/polar-pricing-card` | Pricing tier card |
| Sponsor Grid | `@elements/polar-sponsor-grid` | Sponsor/backer grid |
| Subscription Badge | `@elements/polar-subscription-badge` | Active subscription badge |
| Revenue Card | `@elements/polar-revenue-card` | Revenue metrics card |
| License Key | `@elements/polar-license-key` | License key display/input |

## Quick Patterns

```bash
# Pricing page
npx shadcn@latest add @elements/polar-pricing-card @elements/polar-subscription-badge

# OSS sponsorship
npx shadcn@latest add @elements/polar-sponsor-grid @elements/polar-revenue-card

# License management
npx shadcn@latest add @elements/polar-license-key
```

## Setup

Requires Polar.sh account and API key. See https://docs.polar.sh

## Discovery

Browse https://tryelements.dev/docs/polar
