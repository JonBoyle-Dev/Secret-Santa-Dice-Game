import { useState } from 'react'
import Dice from './Dice.jsx'
import TeamSelectorModal from './TeamSelectorModal.jsx'

const SELECTOR_TITLES = {
  steal: 'Steal from which player?',
  swap: 'Swap gifts with which player?',
  give: 'Who draws a Challenge Card?',
}

export default function KidsGameBoard({ game }) {
  const { teams, currentTeam, pending, goesRemaining, gameOver, rollDice, resolveSelection, nextTurn, setScreen } = game
  const [rolling, setRolling] = useState(false)

  const handleRoll = () => {
    if (pending || rolling || gameOver) return
    setRolling(true)
    setTimeout(() => {
      setRolling(false)
      rollDice()
    }, 550)
  }

  const showPromptCard = pending && !pending.event
  const showSelector = showPromptCard && pending.needsSelection && !pending.resolved
  const showNextButton = showPromptCard && (!pending.needsSelection || pending.resolved)
  const resultTeamName = teams.find((t) => t.id === pending?.resultTeamId)?.name
  const activeTaskTeams = teams.filter((t) => t.activeTaskText)

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-sm flex justify-between items-center mb-6">
        <button
          type="button"
          onClick={() => setScreen('tracker')}
          className="text-sm text-neon-green/80 hover:text-neon-green border border-neon-green/40 rounded-full px-3 py-1"
        >
          🎁 Gifts
        </button>
        <button
          type="button"
          onClick={() => setScreen('summary')}
          className="text-sm text-neon-red/80 hover:text-neon-red border border-neon-red/40 rounded-full px-3 py-1"
        >
          End Round
        </button>
      </div>

      {activeTaskTeams.length > 0 && (
        <div className="w-full max-w-sm mb-4 space-y-1">
          {activeTaskTeams.map((t) => (
            <p key={t.id} className="text-xs text-neon-pink text-center bg-neon-pink/10 border border-neon-pink/30 rounded-full px-3 py-1">
              🛷 {t.name} is on a sticky task until their next turn!
            </p>
          ))}
        </div>
      )}

      <p className="text-white/50 uppercase tracking-widest text-xs mb-1">Current Player</p>
      <h1 className="font-display text-3xl sm:text-4xl text-neon-green text-center mb-2 drop-shadow-[0_0_10px_#a3e635]">
        {currentTeam?.name}
      </h1>

      {goesRemaining !== null && !gameOver ? (
        <p className="text-neon-pink text-sm mb-6 text-center">
          🎁 All gifts unwrapped! {goesRemaining} more go{goesRemaining === 1 ? '' : 'es'} left...
        </p>
      ) : (
        <div className="mb-6" />
      )}

      <Dice
        value={pending?.rollValue}
        rolling={rolling}
        onRoll={handleRoll}
        disabled={!!pending || rolling || gameOver}
      />

      {showPromptCard && (
        <div className="w-full max-w-sm mt-8 bg-white/5 border border-neon-pink/40 rounded-2xl p-5 text-center grunge-overlay">
          <p className="font-display text-xl text-white">{pending.prompt}</p>
        </div>
      )}

      {showPromptCard && pending.cardText && (
        <div className="w-full max-w-sm mt-3 bg-neon-green/10 border border-neon-green rounded-2xl p-4 text-center grunge-overlay">
          <p className="text-xs uppercase tracking-widest text-neon-green mb-1">
            {resultTeamName ? `${resultTeamName} draws:` : 'Challenge Card'}
          </p>
          <p className="text-white font-medium">{pending.cardText}</p>
        </div>
      )}

      {showSelector && (
        <TeamSelectorModal
          title={SELECTOR_TITLES[pending.needsSelection]}
          teams={teams}
          excludeTeamId={currentTeam.id}
          onSelect={resolveSelection}
        />
      )}

      {showNextButton && (
        <button
          type="button"
          onClick={nextTurn}
          className="w-full max-w-sm mt-6 py-4 rounded-2xl bg-neon-green text-ink font-display text-2xl shadow-neonGreen active:scale-95"
        >
          Next Turn →
        </button>
      )}
    </div>
  )
}
