---
name: github-elements
description: Install GitHub display components from the Elements registry. Use when user needs GitHub repo cards, profile cards, contribution calendars, star counters, language breakdowns, or activity displays. Triggers on "github component", "github card", "repo card", "contributions calendar", "github stars", "github profile", "github activity", "github languages", "star button".
---

# GitHub Elements

7 components for displaying GitHub data. Great for portfolios and OSS project pages.

## Install Pattern

```bash
npx shadcn@latest add @elements/github-{name}
```

## Components

| Component | Install | Description |
|-----------|---------|-------------|
| Repo Card | `@elements/github-repo-card` | Repository info (name, description, stars, forks) |
| Profile Card | `@elements/github-profile-card` | User profile card |
| Activity Calendar | `@elements/github-activity-calendar` | Contribution heatmap |
| Contributions | `@elements/github-contributions` | Contribution graph |
| Languages | `@elements/github-languages` | Language breakdown chart |
| Star Button | `@elements/github-star-button` | Star count button |
| Stars | `@elements/github-stars` | Star count display |

## Quick Patterns

```bash
# Portfolio page
npx shadcn@latest add @elements/github-profile-card @elements/github-activity-calendar @elements/github-languages

# OSS project page
npx shadcn@latest add @elements/github-repo-card @elements/github-star-button @elements/github-stars

# All GitHub components
npx shadcn@latest add @elements/github-repo-card @elements/github-profile-card @elements/github-activity-calendar @elements/github-contributions @elements/github-languages @elements/github-star-button @elements/github-stars
```

## Common Props

Most components accept `owner` and `repo` props for API-connected data. Static data props available for SSR/demos.

## Discovery

Browse https://tryelements.dev/docs/github
