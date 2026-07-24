import { useState } from 'react'
import Dice from './Dice.jsx'
import TeamSelectorModal from './TeamSelectorModal.jsx'

const SELECTOR_TITLES = {
  steal: 'Steal from which team?',
  swap: 'Swap gifts with which team?',
  give: 'Who drinks?',
}

export default function GameBoard({ game }) {
  const { teams, gifts, currentTeam, pending, rollDice, resolveSelection, nextTurn, setScreen } = game
  const [rolling, setRolling] = useState(false)

  const handleRoll = () => {
    if (pending || rolling) return
    setRolling(true)
    setTimeout(() => {
      setRolling(false)
      rollDice()
    }, 550)
  }

  const frozenGiftTeamIds = gifts.filter((g) => g.frozen).map((g) => g.ownerId)

  const showPromptCard = pending && !pending.event
  const showSelector = showPromptCard && pending.needsSelection && !pending.resolved
  const showNextButton = showPromptCard && (!pending.needsSelection || pending.resolved)

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

      <p className="text-white/50 uppercase tracking-widest text-xs mb-1">Current Team</p>
      <h1 className="font-display text-3xl sm:text-4xl text-neon-green text-center mb-8 drop-shadow-[0_0_10px_#a3e635]">
        {currentTeam?.name}
      </h1>

      <Dice
        value={pending?.rollValue}
        rolling={rolling}
        onRoll={handleRoll}
        disabled={!!pending || rolling}
      />

      {showPromptCard && (
        <div className="w-full max-w-sm mt-8 bg-white/5 border border-neon-pink/40 rounded-2xl p-5 text-center grunge-overlay">
          <p className="font-display text-xl text-white">{pending.prompt}</p>
        </div>
      )}

      {showSelector && (
        <TeamSelectorModal
          title={SELECTOR_TITLES[pending.needsSelection]}
          teams={teams}
          excludeTeamId={currentTeam.id}
          disabledTeamIds={pending.needsSelection === 'steal' ? frozenGiftTeamIds : []}
          onSelect={resolveSelection}
        />
      )}

      {showNextButton && (
        <button
          type="button"
          onClick={nextTurn}
          className="w-full max-w-sm mt-6 py-4 rounded-2xl bg-neon-green text-ink font-display text-2xl shadow-neonGreen active:scale-95"
        >
          {pending.chainRoll ? 'Roll Again 🎲' : 'Next Turn →'}
        </button>
      )}
    </div>
  )
}
