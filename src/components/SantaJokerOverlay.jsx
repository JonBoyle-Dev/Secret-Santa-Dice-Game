export default function SantaJokerOverlay({ onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center animate-flicker">
      <div className="text-8xl mb-4">🎅</div>
      <h1 className="font-display text-5xl sm:text-6xl text-neon-green mb-2 drop-shadow-[0_0_12px_#a3e635]">
        SANTA'S JOKER!
      </h1>
      <p className="font-display text-2xl sm:text-3xl text-neon-red mb-8">
        Everyone drinks! Ho Ho Ho 🎅
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="px-8 py-3 rounded-full bg-neon-green text-ink font-display text-xl shadow-neonGreen active:scale-95"
      >
        Cheers!
      </button>
    </div>
  )
}
