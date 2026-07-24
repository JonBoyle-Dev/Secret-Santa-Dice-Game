# Secret Santa Dice Game

Pass-the-phone party game for the Xmas in July party (25 July), with two modes picked at launch:

- **Adult Game** — the drinking game. Roll the dice each turn to unwrap, steal, swap, or pass gifts left/right — with a chance of Santa's Joker (everyone drinks) or the Grinch (whoever's still holding their own gift drinks).
- **Kids Game** (ages 9–16) — same rules, but every drink is a Challenge Card draw instead, plus Group Tasks everyone does together.

In-app "How to Play" rules page for each mode before you start. Once every gift is unwrapped, 3 more goes and Santa's Outta Here! "Change Mode" from Setup switches between Adult and Kids without losing either roster.

## Local dev
```bash
npm install
npm run dev      # http://localhost:5174
npm run build
```

## Rules
See the dice table and full rules in [`CLAUDE.md`](./CLAUDE.md).

No backend — team roster and game state persist in localStorage on the device running the game.
