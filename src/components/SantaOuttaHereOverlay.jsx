export default function SantaOuttaHereOverlay({ onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center animate-flicker">
      <div className="text-8xl mb-4">🎅🚪</div>
      <h1 className="font-display text-5xl sm:text-6xl text-neon-red mb-2 drop-shadow-[0_0_12px_#ef233c]">
        SANTA'S OUTTA HERE!
      </h1>
      <p className="font-display text-2xl sm:text-3xl text-neon-green mb-8">
        All the gifts are unwrapped and the last goes are done — that's a wrap!
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="px-8 py-3 rounded-full bg-neon-green text-ink font-display text-xl shadow-neonGreen active:scale-95"
      >
        See Final Results 🎁
      </button>
    </div>
  )
}
