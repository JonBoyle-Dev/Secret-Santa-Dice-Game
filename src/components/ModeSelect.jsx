export default function ModeSelect({ onSelect }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="text-6xl mb-2">🎅</div>
      <h1 className="font-display text-4xl sm:text-6xl text-neon-green drop-shadow-[0_0_10px_#a3e635] leading-tight mb-1">
        SECRET SANTA
      </h1>
      <h2 className="font-display text-3xl sm:text-5xl text-neon-red drop-shadow-[0_0_10px_#ef233c] mb-10">
        DICE GAME
      </h2>

      <div className="w-full max-w-sm flex flex-col gap-4">
        <button
          type="button"
          onClick={() => onSelect('adult')}
          className="py-6 rounded-2xl bg-neon-red text-white font-display text-2xl shadow-neonRed active:scale-95 grunge-overlay"
        >
          🥂 Adult Game
        </button>
        <button
          type="button"
          onClick={() => onSelect('kids')}
          className="py-6 rounded-2xl bg-neon-green text-ink font-display text-2xl shadow-neonGreen active:scale-95 grunge-overlay"
        >
          🎄 Kids Game
        </button>
      </div>
    </div>
  )
}
