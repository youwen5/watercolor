# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Watercolor is a course selector/scraper for Tsinghua University's visiting student courses (Spring Semester). The course catalog is accessed through Tsinghua's WebVPN and requires browser automation due to JavaScript-based pagination.

## Technical Stack

- **Platform**: NixOS with Nix flakes for reproducible development environments
- **Browser Automation**: Selenium with Firefox (preferred, as Firefox profile is pre-authenticated) or Chromium
- **Language**: Python

## Development Setup

Use `nix develop` to enter the development shell defined in `flake.nix`. The devshell should include:
- Python 3
- Selenium
- Firefox/geckodriver (or Chromium/chromedriver)

For faster downloads in China, use the Tsinghua mirror:
```bash
nix develop --option substituters 'https://mirrors.tuna.tsinghua.edu.cn/nix-channels/store?priority=1 https://cache.nixos.org?priority=2 https://nix-community.cachix.org?priority=3'
```

## Key URLs

Course catalog (requires WebVPN authentication):
```
https://webvpn.tsinghua.edu.cn/http/77726476706e69737468656265737421eaff4b8b227e6b597d469dbf915b243d1569e38ddd4b59c06f/xkJxs.vxkJxsXkbBs.do?m=main&p_xnxq=2025-2026-2&showtitle=0
```

## Authentication

Firefox profile on this machine is already authenticated with Tsinghua WebVPN. When using Selenium, load the existing Firefox profile to avoid re-authentication.

## Scraping Notes

- The course view is paginated with JavaScript buttons/links for navigation
- Must iterate through all pages to collect complete course data
- Handle dynamic content loading appropriately

## Web App (`web/`)

Interactive course selector built with Svelte 5 + Vite + Tailwind CSS 4.

### Dev Setup

```bash
nix develop .#web   # enters shell with nodejs + pnpm
cd web && pnpm install && pnpm dev
```

### Building

Always use the Nix shell to obtain `pnpm`, then use `pnpm build`:

```bash
cd web && nix develop ..#web --command pnpm build
```

Append the `--option substituters '...'` flag (see above) for faster Nix downloads in China.

### Architecture

- **Data**: `courses.json` (1,093 courses, 50 departments) in `web/static/`
- **Entry**: `index.html` → `src/main.js` → `src/App.svelte`
- **Lib modules**:
  - `lib/parser.js` — `parseClassTime()` parses `"DAY-PERIOD(week WEEKS)"` format
  - `lib/stores.js` — Svelte stores: courses, selection (localStorage-persisted), filters, derived calendar grid
  - `lib/conflicts.js` — Week-aware conflict detection (courses only conflict if weeks overlap)
  - `lib/constants.js` — Tsinghua 6-period time table, day names, color palette
  - `lib/export.js` — JSON and text schedule export
- **Components**:
  - `Header.svelte` — Title, credits/course count, export dropdown, clear all
  - `SearchPanel.svelte` — Text search + department/credit/day/period filters, collapsible
  - `CourseCard.svelte` — Search result with add/remove button
  - `Calendar.svelte` — CSS Grid: time labels + day columns, adaptive rows/columns
  - `CalendarCell.svelte` — Single day+period cell, conflict striping
  - `CourseBlock.svelte` — Colored course block with detail popover
  - `WeekSelector.svelte` — Week 1-16 navigation bar with "All" toggle
  - `ConflictModal.svelte` — Shows overlapping weeks/slots, option to add anyway
  - `CourseDetail.svelte` — Full course info popover

### Time Table

6 periods (大节) per day, mapped from `class_time` field:

| Period | Time          |
|--------|---------------|
| P1     | 8:00 – 9:35   |
| P2     | 9:50 – 12:15  |
| P3     | 13:30 – 15:05 |
| P4     | 15:20 – 16:55 |
| P5     | 17:05 – 18:40 |
| P6     | 19:20 – 21:45 |
