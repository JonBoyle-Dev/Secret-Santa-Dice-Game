export default function GiftTracker({ teams, gifts, setScreen }) {
  const teamName = (id) => teams.find((t) => t.id === id)?.name ?? '—'

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <h1 className="font-display text-3xl text-neon-green mb-6 drop-shadow-[0_0_10px_#a3e635]">
        🎁 Gift Tracker
      </h1>

      <div className="w-full max-w-sm space-y-3 mb-8">
        {gifts.map((gift) => (
          <div
            key={gift.id}
            className="bg-white/5 border border-neon-green/30 rounded-xl p-4 grunge-overlay"
          >
            <p className="text-white/40 text-xs uppercase tracking-wide">
              Brought by {teamName(gift.originalOwnerId)}
            </p>
            <p className="font-display text-lg text-white mb-2">
              Held by {teamName(gift.ownerId)}
            </p>
            <div className="flex gap-2 flex-wrap text-xs">
              <span
                className={`px-2 py-1 rounded-full ${
                  gift.unwrapped ? 'bg-neon-green/20 text-neon-green' : 'bg-white/10 text-white/50'
                }`}
              >
                {gift.unwrapped ? 'Unwrapped' : 'Still Wrapped'}
              </span>
              <span className="px-2 py-1 rounded-full bg-white/10 text-white/50">
                {gift.stealCount} steal{gift.stealCount === 1 ? '' : 's'}
              </span>
              {gift.frozen && (
                <span className="px-2 py-1 rounded-full bg-neon-red/20 text-neon-red">Frozen ❄️</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setScreen('board')}
        className="w-full max-w-sm py-3 rounded-2xl bg-neon-green text-ink font-display text-xl shadow-neonGreen active:scale-95"
      >
        Back to Game
      </button>
    </div>
  )
}
