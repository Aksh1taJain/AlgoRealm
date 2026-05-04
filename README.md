# AlgoRealm
A dark corrupted futuristic game UI for an algorithmic coding platform. Built with React + Vite.

## Stack

- **React 18** + **React Router v6**
- **Vite 5**
- **Framer Motion** — animations
- **Lucide React** — icons
- **CSS Modules** — scoped styling

---

## Setup

```bash
npm install
npm run dev
```

## Pages

| Route | Page |
|---|---|
| `/dashboard` | Main hub with stats, quests, daily challenges |
| `/world` | Interactive zone map with Phaser.js mount points |
| `/practice` | Filterable quest browser by difficulty/type |
| `/arena` | 1vs1 one will write code and the other player will right test cases ai will judge |
| `/heist` | 3 player team one will write code, other will write the test cases and the third player will do the time/space analysis |
| `/leaderboard` | Global rankings with podium + full table |
| `/profile` | Player identity, badges, rank tree |

## Components

| Component | Purpose |
|---|---|
| `TopBar` | Fixed header — logo, nav, currency, notifications, player chip |
| `SidePanel` | Fixed sidebar — nav links, XP bar, system status |
| `BottomNav` | Mobile bottom navigation |
| `QuestCard` | Reusable mission card with difficulty, tags, rewards |
| `StatCard` | Metric display card with icon, value, trend |
| `MissionModal` | Full quest detail modal with start CTA |
| `RewardPopup` | Animated toast for earned rewards |

---
