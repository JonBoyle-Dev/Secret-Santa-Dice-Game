export default function KidsEndSummary({ teams, gifts, turnLog, setScreen, resetToSetup }) {
  const teamName = (id) => teams.find((t) => t.id === id)?.name ?? '—'

  const count = (type) => turnLog.filter((e) => e.type === type).length
  const totalChallenges =
    count('challenge') +
    count('bonus-card') +
    count('unwrap-blocked') +
    count('steal') +
    count('give') +
    count('grinch') +
    count('group-challenge') +
    count('joker')

  const jokerHits = turnLog.filter((e) => e.type === 'joker').map((e) => teamName(e.teamId))
  const grinchHits = turnLog.filter((e) => e.type === 'grinch' && e.teamId).map((e) => teamName(e.teamId))

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <h1 className="font-display text-3xl text-neon-red mb-6 drop-shadow-[0_0_10px_#ef233c] text-center">
        🎄 Round Summary
      </h1>

      <div className="w-full max-w-sm bg-white/5 border border-neon-green/30 rounded-2xl p-4 mb-4 grunge-overlay">
        <h2 className="font-display text-lg text-neon-green mb-3">Final Gifts</h2>
        <div className="space-y-1 text-sm">
          {gifts.map((gift) => (
            <p key={gift.id} className="text-white/80">
              {teamName(gift.originalOwnerId)}'s gift → <span className="text-white">{teamName(gift.ownerId)}</span>
            </p>
          ))}
        </div>
      </div>

      <div className="w-full max-w-sm bg-white/5 border border-neon-pink/30 rounded-2xl p-4 mb-8 grunge-overlay">
        <h2 className="font-display text-lg text-neon-pink mb-3">Fun Stats</h2>
        <ul className="space-y-1 text-sm text-white/80">
          <li>Total steals: <span className="text-white">{count('steal')}</span></li>
          <li>Total swaps: <span className="text-white">{count('swap')}</span></li>
          <li>Total challenges triggered: <span className="text-white">{totalChallenges}</span></li>
          <li>Santa's Joker hit: <span className="text-white">{jokerHits.length ? jokerHits.join(', ') : 'nobody'}</span></li>
          <li>Grinched: <span className="text-white">{grinchHits.length ? grinchHits.join(', ') : 'nobody'}</span></li>
        </ul>
      </div>

      <div className="w-full max-w-sm flex gap-3">
        <button
          type="button"
          onClick={() => setScreen('board')}
          className="flex-1 py-3 rounded-2xl bg-neon-green text-ink font-display text-lg shadow-neonGreen active:scale-95"
        >
          Back to Game
        </button>
        <button
          type="button"
          onClick={resetToSetup}
          className="flex-1 py-3 rounded-2xl bg-neon-red text-white font-display text-lg shadow-neonRed active:scale-95"
        >
          New Round
        </button>
      </div>
    </div>
  )
}
