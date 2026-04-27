# AlgoRealm

A dark corrupted futuristic game UI for an algorithmic coding platform. Built with React + Vite.

## Stack

- **React 18** + **React Router v6**
- **Vite 5**
- **Framer Motion** — animations
- **Lucide React** — icons
- **CSS Modules** — scoped styling
- **Orbitron + Share Tech Mono + Rajdhani** — Google Fonts

---

## Setup

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

---

## Pages

| Route | Page |
|---|---|
| `/dashboard` | Main hub with stats, quests, daily challenges |
| `/world` | Interactive zone map with Phaser.js mount points |
| `/practice` | Filterable quest browser by difficulty/type |
| `/arena` | PvP matchmaking — duel, battle royale, team raid |
| `/heist` | Co-op team missions with phase tracking |
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

## Phaser.js Integration

Three mount points are pre-wired in the DOM, ready for Phaser game instances:

```js
// Dashboard minimap
document.getElementById('phaser-dashboard-mount')

// World map engine
document.getElementById('phaser-world-mount')

// Arena battle visualization
document.getElementById('phaser-arena-mount')
```

Example integration:

```js
import Phaser from 'phaser'

const config = {
  type: Phaser.AUTO,
  parent: 'phaser-world-mount',
  width: '100%',
  height: 420,
  transparent: true,
  scene: { /* ... */ }
}

const game = new Phaser.Game(config)
```

---

## Project Structure

```
algorealm/
├── index.html
├── vite.config.js
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles/
    │   └── globals.css          # CSS variables, animations, base styles
    ├── data/
    │   └── mockData.js          # All mock data (player, quests, zones, etc.)
    ├── components/
    │   ├── Layout.jsx / .module.css
    │   ├── TopBar.jsx / .module.css
    │   ├── SidePanel.jsx / .module.css
    │   ├── BottomNav.jsx / .module.css
    │   ├── QuestCard.jsx / .module.css
    │   ├── StatCard.jsx / .module.css
    │   ├── MissionModal.jsx / .module.css
    │   └── RewardPopup.jsx / .module.css
    └── pages/
        ├── Dashboard.jsx / .module.css
        ├── World.jsx / .module.css
        ├── Practice.jsx / .module.css
        ├── Arena.jsx / .module.css
        ├── Heist.jsx / .module.css
        ├── Leaderboard.jsx / .module.css
        └── Profile.jsx / .module.css
```

---

## Design Tokens

All design tokens are defined in `src/styles/globals.css` as CSS custom properties:

```css
--cyan: #00f5ff        /* Primary accent */
--purple: #a855f7      /* Secondary accent */
--red-corrupt: #ff3366 /* Danger / arena */
--orange-warn: #ff9500 /* Warning / streak */
--green-ok: #00ff88    /* Success */
--bg-void: #04040a     /* Deepest background */
--font-display: 'Orbitron', monospace
--font-mono: 'Share Tech Mono', monospace
--font-body: 'Rajdhani', sans-serif
```
