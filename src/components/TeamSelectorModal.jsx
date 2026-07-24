export default function TeamSelectorModal({ title, teams, excludeTeamId, disabledTeamIds = [], onSelect, onClose }) {
  const options = teams.filter((t) => t.id !== excludeTeamId)

  return (
    <div className="fixed inset-0 z-40 bg-black/80 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-ink border-2 border-neon-pink rounded-2xl shadow-neonRed p-6 grunge-overlay">
        <h2 className="font-display text-2xl text-neon-pink mb-4 text-center">{title}</h2>
        <div className="space-y-2 max-h-72 overflow-y-auto">
          {options.map((t) => {
            const isDisabled = disabledTeamIds.includes(t.id)
            return (
              <button
                key={t.id}
                type="button"
                disabled={isDisabled}
                onClick={() => onSelect(t.id)}
                className="w-full text-left px-4 py-3 rounded-xl bg-white/5 border border-neon-green/40
                  hover:bg-neon-green/10 hover:border-neon-green transition-colors font-body font-medium
                  disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-white/5"
              >
                {t.name}
                {isDisabled && <span className="text-xs text-neon-pink ml-2">(frozen)</span>}
              </button>
            )
          })}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="mt-4 w-full text-center text-sm text-white/50 hover:text-white/80"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
