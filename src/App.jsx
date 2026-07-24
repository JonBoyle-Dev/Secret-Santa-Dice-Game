import { useGameState } from './hooks/useGameState.js'
import Home from './components/Home.jsx'
import GameBoard from './components/GameBoard.jsx'
import GiftTracker from './components/GiftTracker.jsx'
import EndSummary from './components/EndSummary.jsx'
import SantaJokerOverlay from './components/SantaJokerOverlay.jsx'
import GrinchOverlay from './components/GrinchOverlay.jsx'

export default function App() {
  const game = useGameState()
  const { screen, teams, gifts, turnLog, pending, dismissEvent, setScreen, resetToSetup } = game

  return (
    <>
      {screen === 'setup' && (
        <Home
          teams={teams}
          addTeam={game.addTeam}
          removeTeam={game.removeTeam}
          renameTeam={game.renameTeam}
          startGame={game.startGame}
        />
      )}

      {screen === 'board' && <GameBoard game={game} />}

      {screen === 'tracker' && (
        <GiftTracker teams={teams} gifts={gifts} setScreen={setScreen} />
      )}

      {screen === 'summary' && (
        <EndSummary
          teams={teams}
          gifts={gifts}
          turnLog={turnLog}
          setScreen={setScreen}
          resetToSetup={resetToSetup}
        />
      )}

      {pending?.event === 'joker' && <SantaJokerOverlay onDismiss={dismissEvent} />}
      {pending?.event === 'grinch' && (
        <GrinchOverlay
          targetTeamName={teams.find((t) => t.id === pending.targetTeamId)?.name}
          onDismiss={dismissEvent}
        />
      )}
    </>
  )
}
