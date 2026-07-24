# Secret Santa Dice Game

Party drinking game for Xmas in July (25 July, 33 Roxie). Single-device, pass-the-phone style — no backend, all state in localStorage.

## Structure
```
Secret-Santa-Dice-Game/
├── index.html
├── src/
│   ├── App.jsx                 # screen router + overlay wiring
│   ├── main.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Home.jsx             # Setup: team CRUD, Start Game
│   │   ├── GameBoard.jsx        # dice, prompt card, selector, Next Turn
│   │   ├── Dice.jsx
│   │   ├── TeamSelectorModal.jsx
│   │   ├── SantaJokerOverlay.jsx
│   │   ├── GrinchOverlay.jsx
│   │   ├── GiftTracker.jsx
│   │   └── EndSummary.jsx
│   ├── data/
│   │   ├── defaultTeams.js
│   │   └── diceTable.js         # JOKER_CHANCE, GRINCH_CHANCE, STEAL_LIMIT
│   ├── hooks/useGameState.js    # all game logic + localStorage persistence
│   └── utils/storage.js
├── tailwind.config.js
└── vite.config.js               # dev server on port 5174
```

## Stack
Vite + React 18 + Tailwind CSS. No backend, no build-time secrets.

## Dice table (rolled 1-6)
| Roll | Action | Effect |
|---|---|---|
| 1 | Unwrap | Unwraps the gift currently held; already-unwrapped gives a bonus sip |
| 2 | Steal | Pick a team, take their gift (mutual swap of ownership), that gift's steal count +1; frozen at 3 steals |
| 3 | Swap | Trade gifts with any team (no steal-count effect) |
| 4 | Drink | No gift action |
| 5 | Give | Pick a team to drink |
| 6 | Wild | Drink, then roll again (same team) |

Before resolving the roll, each turn independently checks `JOKER_CHANCE` (~7%, everyone drinks) then `GRINCH_CHANCE` (~7%, whichever team currently holds their own original gift drinks — fizzles if no gift has stayed with its original owner). Only one event fires per turn; Joker is checked first in `useGameState.rollDice` (`src/hooks/useGameState.js`).

## Key mechanics
- `Gift.originalOwnerId` vs `Gift.ownerId` — steals/swaps only ever change `ownerId`; `originalOwnerId` is what the Grinch check and end-of-round summary key off.
- Steal targets with `frozen: true` (3+ steals) are disabled in the team selector, but frozen gifts can still be swapped.
- `pending.chainRoll` (Wild) keeps `currentTeamIndex` unchanged so the same team rolls again.
- Game state persists under `ssdg_*` localStorage keys (see `src/utils/storage.js`); "New Round" clears everything except the team roster.

## Local dev
```bash
npm install
npm run dev      # http://localhost:5174
npm run build
```

## Reset progress (browser console)
```js
Object.keys(localStorage).filter(k => k.startsWith('ssdg_')).forEach(k => localStorage.removeItem(k))
```
