import { useState } from 'react'

export default function KidsHome({ teams, addTeam, removeTeam, renameTeam, startGame, setScreen, onChangeMode }) {
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editValue, setEditValue] = useState('')

  const handleAdd = () => {
    const name = newName.trim()
    if (!name) return
    addTeam(name)
    setNewName('')
  }

  const startEdit = (team) => {
    setEditingId(team.id)
    setEditValue(team.name)
  }

  const commitEdit = () => {
    const name = editValue.trim()
    if (name) renameTeam(editingId, name)
    setEditingId(null)
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10 sm:py-16">
      <div className="text-6xl mb-2">🎄</div>
      <h1 className="font-display text-4xl sm:text-6xl text-center text-neon-green drop-shadow-[0_0_10px_#a3e635] leading-tight">
        SECRET SANTA
      </h1>
      <h2 className="font-display text-3xl sm:text-5xl text-center text-neon-red drop-shadow-[0_0_10px_#ef233c] mb-2">
        KIDS EDITION
      </h2>
      <p className="text-white/60 text-center mb-4 max-w-xs">
        Xmas in July · Roll, steal, swap and pass gifts — draw a Challenge Card instead of drinking!
      </p>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setScreen('rules')}
          className="text-sm text-neon-green/80 hover:text-neon-green border border-neon-green/40 rounded-full px-4 py-1"
        >
          📖 How to Play
        </button>
        {onChangeMode && (
          <button
            type="button"
            onClick={onChangeMode}
            className="text-sm text-white/60 hover:text-white/90 border border-white/30 rounded-full px-4 py-1"
          >
            🔄 Change Mode
          </button>
        )}
      </div>

      <div className="w-full max-w-sm bg-white/5 border border-neon-green/30 rounded-2xl p-4 mb-6 grunge-overlay">
        <h3 className="font-display text-xl text-neon-green mb-3">Players</h3>
        <div className="space-y-2 mb-4">
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex items-center justify-between bg-black/40 rounded-lg px-3 py-2"
            >
              {editingId === team.id ? (
                <input
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={commitEdit}
                  onKeyDown={(e) => e.key === 'Enter' && commitEdit()}
                  className="bg-transparent border-b border-neon-green outline-none flex-1 mr-2 text-white"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => startEdit(team)}
                  className="text-left flex-1 text-white font-medium"
                >
                  {team.name}
                </button>
              )}
              <button
                type="button"
                onClick={() => removeTeam(team.id)}
                className="text-neon-red/80 hover:text-neon-red text-sm px-2"
                aria-label={`Remove ${team.name}`}
              >
                ✕
              </button>
            </div>
          ))}
          {teams.length === 0 && (
            <p className="text-white/40 text-sm text-center py-4">No players yet — add one below.</p>
          )}
        </div>

        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Player name e.g. Alex"
            className="flex-1 bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white
              placeholder-white/30 outline-none focus:border-neon-green"
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 rounded-lg bg-neon-green text-ink font-bold"
          >
            Add
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={startGame}
        disabled={teams.length < 2}
        className="w-full max-w-sm py-4 rounded-2xl bg-neon-red text-white font-display text-2xl
          shadow-neonRed active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Start Game 🎲
      </button>
      {teams.length < 2 && (
        <p className="text-white/40 text-xs mt-2">Add at least 2 players to start.</p>
      )}
    </div>
  )
}
