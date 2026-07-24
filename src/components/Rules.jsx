import { DICE_ACTIONS, FINAL_GOES } from '../data/diceTable'

export default function Rules({ setScreen }) {
  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="text-5xl mb-2">📖</div>
      <h1 className="font-display text-3xl sm:text-4xl text-neon-green mb-6 drop-shadow-[0_0_10px_#a3e635] text-center">
        How to Play
      </h1>

      <div className="w-full max-w-sm bg-white/5 border border-neon-green/30 rounded-2xl p-4 mb-4 grunge-overlay">
        <h2 className="font-display text-lg text-neon-green mb-3">Roll the Dice</h2>
        <div className="space-y-3">
          {Object.entries(DICE_ACTIONS).map(([roll, action]) => (
            <div key={roll} className="flex gap-3">
              <span className="font-display text-2xl text-neon-red w-6 shrink-0">{roll}</span>
              <div>
                <p className="font-display text-white leading-tight">{action.label}</p>
                <p className="text-white/60 text-sm">{action.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm bg-white/5 border border-neon-pink/30 rounded-2xl p-4 mb-4 grunge-overlay">
        <h2 className="font-display text-lg text-neon-pink mb-3">Random Events</h2>
        <p className="text-white/60 text-sm mb-2">
          🎅 <span className="text-white">Santa's Joker</span> — a rare chance on any roll where
          everyone drinks.
        </p>
        <p className="text-white/60 text-sm">
          🖤 <span className="text-white">The Grinch</span> — a rare chance where whichever team is
          still holding the gift they originally brought has to drink.
        </p>
      </div>

      <div className="w-full max-w-sm bg-white/5 border border-neon-red/30 rounded-2xl p-4 mb-8 grunge-overlay">
        <h2 className="font-display text-lg text-neon-red mb-3">Game End</h2>
        <p className="text-white/60 text-sm">
          Once every gift has been unwrapped, {FINAL_GOES} more goes are allowed — then Santa's
          Outta Here and the round is over!
        </p>
      </div>

      <button
        type="button"
        onClick={() => setScreen('setup')}
        className="w-full max-w-sm py-3 rounded-2xl bg-neon-green text-ink font-display text-xl shadow-neonGreen active:scale-95"
      >
        Back
      </button>
    </div>
  )
}
