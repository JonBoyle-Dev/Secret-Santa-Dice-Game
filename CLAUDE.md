# Secret Santa Dice Game

Party game for Xmas in July (25 July). Single-device, pass-the-phone style — no backend, all state in localStorage. Has two fully independent modes, chosen from a Mode Select screen every time the app loads: **Adult** (drinking game) and **Kids** (Challenge Card game, ages 9–16).

## Structure
```
Secret-Santa-Dice-Game/
├── index.html
├── src/
│   ├── App.jsx                 # mode router: ModeSelect / AdultGame / KidsGame
│   ├── main.jsx
│   ├── index.css
│   ├── components/
│   │   ├── ModeSelect.jsx       # Adult Game / Kids Game picker, always shown first
│   │   │
│   │   │   ── Adult mode ──
│   │   ├── Home.jsx             # Setup: team CRUD, Start Game, How to Play, Change Mode
│   │   ├── Rules.jsx            # dice table + random events + endgame, read before playing
│   │   ├── GameBoard.jsx        # dice, prompt card, selector, Next Turn, goes-remaining banner
│   │   ├── SantaJokerOverlay.jsx
│   │   ├── GrinchOverlay.jsx
│   │   ├── EndSummary.jsx
│   │   │
│   │   │   ── Kids mode (mirrors adult 1:1, drink → Challenge Card draw) ──
│   │   ├── KidsHome.jsx         # player CRUD (no preset roster), Start Game, How to Play, Change Mode
│   │   ├── KidsRules.jsx
│   │   ├── KidsGameBoard.jsx    # same as GameBoard.jsx + drawn-card display + sticky-task badges
│   │   ├── KidsSantaJokerOverlay.jsx  # shows the drawn Group Task
│   │   ├── KidsGrinchOverlay.jsx      # shows the drawn Challenge Card
│   │   ├── KidsEndSummary.jsx
│   │   │
│   │   │   ── shared, mode-neutral, reused as-is by both ──
│   │   ├── Dice.jsx
│   │   ├── TeamSelectorModal.jsx
│   │   ├── GiftTracker.jsx
│   │   └── SantaOuttaHereOverlay.jsx  # endgame overlay
│   ├── data/
│   │   ├── defaultTeams.js
│   │   ├── diceTable.js         # adult DICE_ACTIONS, JOKER_CHANCE, GRINCH_CHANCE, FINAL_GOES (shared by both modes)
│   │   ├── kidsDiceTable.js     # KIDS_DICE_ACTIONS (label+description) for KidsRules
│   │   ├── challengeCards.js    # 12-card pool + drawChallengeCard()
│   │   └── groupTasks.js        # 8-task pool (2 sticky) + drawGroupTask()
│   ├── hooks/
│   │   ├── useGameState.js      # adult game logic + localStorage persistence — untouched by Kids mode
│   │   └── useKidsGameState.js  # parallel hook: same mechanics, Challenge Card draws, sticky-task tracking
│   └── utils/storage.js
├── tailwind.config.js
└── vite.config.js               # dev server on port 5174
```

**Kids mode is a fully parallel implementation** — separate hook, separate localStorage keys (`kidsPlayers`, `kidsGifts`, etc. vs adult's `teams`, `gifts`, etc.), separate components for anything with mode-specific text. Nothing in the adult game was changed to build it; only `Home.jsx` gained an optional `onChangeMode` prop (additive, no-op if omitted) and `App.jsx` became a mode router.

## Stack
Vite + React 18 + Tailwind CSS. No backend, no build-time secrets.

## Dice table (rolled 1-6) — identical structure in both modes
| Roll | Action | Adult | Kids |
|---|---|---|---|
| 1 | Unwrap | Unwraps the gift held; blocked (sip) if own untouched gift; already-unwrapped = bonus sip | Same, but blocked/already-unwrapped draws a Challenge Card instead |
| 2 | Steal | Take a team's gift (mutual swap), they drink; steal count tracked, no limit | Same; target draws a Challenge Card |
| 3 | Swap | Trade gifts with any team you choose | Same |
| 4 | Pass Left | Auto-swap with the team to your left (turn-order index − 1), then take a sip | Same, then draw a Challenge Card |
| 5 | Pass Right | Auto-swap with the team to your right (turn-order index + 1), then pick a team to drink | Same, then pick a player to draw a Challenge Card |
| 6 | Group Sip / Group Challenge | Everyone drinks, then next player | Draw from the Group Task pool, everyone joins in, then next player |

Before resolving the roll, each turn independently checks `JOKER_CHANCE` (~7%) then `GRINCH_CHANCE` (~7%) — only one fires per turn, Joker checked first. Adult Joker = everyone drinks; Kids Joker = draws a Group Task (can be sticky). Adult Grinch = original-gift holder drinks; Kids Grinch = original-gift holder draws a Challenge Card. Both fizzle the same way if no gift has stayed with its original owner.

## Key mechanics (both modes, via `useGameState.js` / `useKidsGameState.js`)
- `Gift.originalOwnerId` vs `Gift.ownerId` — steals/swaps/passes only ever change `ownerId`.
- `Gift.hasMoved` flips to `true` permanently the first time a gift changes hands. Can't unwrap a gift where `ownerId === originalOwnerId && !hasMoved` — once passed on, even the original owner can unwrap it if it comes back to them.
- `Gift.stealCount` is tracked purely for fun stats — no freeze/steal limit.
- "Left"/"right" for rolls 4/5 are relative to turn order (array index ± 1, wrapping), auto-swapped via the shared `swapGifts` helper — no selection modal for the pass itself.
- **Endgame**: `goesRemaining` starts `null`; set to `FINAL_GOES` (3) the moment the last gift is unwrapped. Every subsequent `rollDice()` call decrements it; hitting 0 sets `gameOver = true`. That final go still resolves normally — `SantaOuttaHereOverlay` (shared) only appears once `gameOver` is true and `pending` is null, and its only action is to jump to the summary screen.
- **Kids-only sticky tasks**: `GroupTask.sticky` items (the "until your next turn" ones) set `Team.activeTaskText` on whichever player triggered them (roll-6 Group Challenge or Joker). `KidsGameBoard` shows a badge for every team with an active sticky task. Cleared in `advanceTurn` the moment turn order comes back around to that team.
- Adult state persists under `ssdg_*` keys: `teams`, `gifts`, `currentTeamIndex`, `turnLog`, `screen`, `goesRemaining`, `gameOver`. Kids state persists under the same prefix with different key names: `kidsPlayers`, `kidsGifts`, `kidsCurrentTeamIndex`, `kidsTurnLog`, `kidsScreen`, `kidsGoesRemaining`, `kidsGameOver`. Neither mode's storage overlaps. "New Round" clears everything except the roster; `App.jsx`'s in-memory `mode` state is never persisted, so the Mode Select screen always shows first on a fresh load.

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
