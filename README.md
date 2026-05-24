# Hedron Clicker — React

A fully-featured idle clicker game built in React.

## Setup

```bash
cd /Users/danieliryszek/Desktop/Claude/HedronClicker
npm install
npm start
```

Then open http://localhost:3000

## Build for production

```bash
npm run build
```

---

## Feature overview

### Core gameplay
- Click the Hedron/Creeper to earn points
- Click multiplier (faster clicks = up to 2× multiplier)
- Auto-clickers via upgrades
- Critical hits (upgradeable chance)
- Bosses spawn every 2 minutes — HP is based on click power, and defeating them awards points + crate keys

### Weather system
- Rolls every 10 minutes (5 min duration): ☀️ Sun (50%) / 🌧️ Rain (30%) / ⛈️ Storm (20%)
- Sun: burns Creeper after 3 min (-1 HP/s) unless Sun Cap is equipped
- Rain: shrinks Creeper after 3 min (harder to click)
- Storm: 0.1%/s lightning strike (-90 HP visual effect)

### Gems & Minigames
- **Gems**: 1 gem = 10,000 points. Buy in the Skins tab gem shop.
- **Minigames button** (🎮, left of daily reward): opens full-screen overlay
  - Unlocking the section costs **10 gems** (one-time)
  - **Tic Tac Toe**: costs **1 gem** to unlock; wins track streaks but do not award gems
  - Easy mode: bot plays randomly 50% of the time
  - Hard mode: bot plays near-perfectly (minimax AI) 90% of the time
  - Auto-clicker and boss spawns are **paused** while minigames are open

### Security
- **localStorage** is AES-256-CBC encrypted (Web Crypto API, key embedded in build)
- **Export/import** files (`.hcs`) use the same AES encryption + triple base64
- Tampering with localStorage or save files will fail decryption
- Mods can be imported from Settings as a ZIP containing one folder with `clicker_image.png` and `config.txt`

### Other features
- 14 themes, FPS boost mode
- Daily reward calendar (7-day streak, escalating rewards per week)
- Crate system (3 keys → random loot)
- 6 skins including custom color picker
- Accessories tab (Sun Cap)
- Offline income
- Full save/export/import/delete

---

## File structure

```
src/
  index.js              Entry point
  App.jsx               Root component + Particles
  App.css               Global styles
  App.extra.css         Minigames button + weather tints

  constants.js          Boss names, themes, skin data, upgrade defaults
  
  hooks/
    useGameState.js     Encrypted save/load, autosave, daily streak, gems
    useClicker.js       Click handling, multiplier, boss system, pause support
    useToast.js         Toast notification state
    useWeather.js       Weather timer, burn/shrink/lightning effects
  
  utils/
    crypto.js           AES-256-CBC + triple-base64 encrypt/decrypt
    helpers.js          formatNumber, formatTime, CSS vars, gem conversion
    skins.jsx           SVG generators for all skins
  
  components/
    ClickerArea.jsx/css     Main button, boss display, HP bar, fire/shrink effects
    RightPanel.jsx/css      Tab navigation, gem bar, gem shop
    UpgradesTab.jsx/css     5 upgrade cards
    StatsTab.jsx/css        Statistics grid
    CratesTab.jsx/css       Crate opening, centered loot popup
    AccessoriesTab.jsx/css  Sun Cap purchase, weather status
    DailyModal.jsx/css      7-day reward calendar
    SettingsModal.jsx/css   Theme/FPS/save/export/import
    DeleteConfirm.jsx       Two-step delete confirmation
    OfflineModal.jsx/css    Offline income claim
    WeatherLayer.jsx/css    Rain, storm clouds, sun orb, lightning bolt, fire flames
    MinigamesModal.jsx/css  Full-screen minigames overlay
    TicTacToe.jsx/css       Tic Tac Toe with minimax AI
```
