import { useState } from 'react'
import { useGameState } from './hooks/useGameState.js'
import { useKidsGameState } from './hooks/useKidsGameState.js'
import ModeSelect from './components/ModeSelect.jsx'
import Home from './components/Home.jsx'
import Rules from './components/Rules.jsx'
import GameBoard from './components/GameBoard.jsx'
import GiftTracker from './components/GiftTracker.jsx'
import EndSummary from './components/EndSummary.jsx'
import SantaJokerOverlay from './components/SantaJokerOverlay.jsx'
import GrinchOverlay from './components/GrinchOverlay.jsx'
import SantaOuttaHereOverlay from './components/SantaOuttaHereOverlay.jsx'
import KidsHome from './components/KidsHome.jsx'
import KidsRules from './components/KidsRules.jsx'
import KidsGameBoard from './components/KidsGameBoard.jsx'
import KidsEndSummary from './components/KidsEndSummary.jsx'
import KidsSantaJokerOverlay from './components/KidsSantaJokerOverlay.jsx'
import KidsGrinchOverlay from './components/KidsGrinchOverlay.jsx'

function AdultGame({ onChangeMode }) {
  const game = useGameState()
  const { screen, teams, gifts, turnLog, pending, gameOver, dismissEvent, setScreen, resetToSetup } = game

  return (
    <>
      {screen === 'setup' && (
        <Home
          teams={teams}
          addTeam={game.addTeam}
          removeTeam={game.removeTeam}
          renameTeam={game.renameTeam}
          startGame={game.startGame}
          setScreen={setScreen}
          onChangeMode={onChangeMode}
        />
      )}

      {screen === 'rules' && <Rules setScreen={setScreen} />}

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
      {gameOver && !pending && screen === 'board' && (
        <SantaOuttaHereOverlay onDismiss={() => setScreen('summary')} />
      )}
    </>
  )
}

function KidsGame({ onChangeMode }) {
  const game = useKidsGameState()
  const { screen, teams, gifts, turnLog, pending, gameOver, dismissEvent, setScreen, resetToSetup } = game

  return (
    <>
      {screen === 'setup' && (
        <KidsHome
          teams={teams}
          addTeam={game.addTeam}
          removeTeam={game.removeTeam}
          renameTeam={game.renameTeam}
          startGame={game.startGame}
          setScreen={setScreen}
          onChangeMode={onChangeMode}
        />
      )}

      {screen === 'rules' && <KidsRules setScreen={setScreen} />}

      {screen === 'board' && <KidsGameBoard game={game} />}

      {screen === 'tracker' && (
        <GiftTracker teams={teams} gifts={gifts} setScreen={setScreen} />
      )}

      {screen === 'summary' && (
        <KidsEndSummary
          teams={teams}
          gifts={gifts}
          turnLog={turnLog}
          setScreen={setScreen}
          resetToSetup={resetToSetup}
        />
      )}

      {pending?.event === 'joker' && (
        <KidsSantaJokerOverlay taskText={pending.cardText} onDismiss={dismissEvent} />
      )}
      {pending?.event === 'grinch' && (
        <KidsGrinchOverlay
          targetTeamName={teams.find((t) => t.id === pending.targetTeamId)?.name}
          cardText={pending.cardText}
          onDismiss={dismissEvent}
        />
      )}
      {gameOver && !pending && screen === 'board' && (
        <SantaOuttaHereOverlay onDismiss={() => setScreen('summary')} />
      )}
    </>
  )
}

export default function App() {
  const [mode, setMode] = useState(null)

  if (mode === 'adult') return <AdultGame onChangeMode={() => setMode(null)} />
  if (mode === 'kids') return <KidsGame onChangeMode={() => setMode(null)} />
  return <ModeSelect onSelect={setMode} />
}
