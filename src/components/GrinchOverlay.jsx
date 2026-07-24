export default function GrinchOverlay({ targetTeamName, onDismiss }) {
  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 text-center animate-flicker">
      <div className="text-8xl mb-4">🖤</div>
      <h1 className="font-display text-5xl sm:text-6xl text-neon-red mb-2 drop-shadow-[0_0_12px_#ef233c]">
        THE GRINCH!
      </h1>
      {targetTeamName ? (
        <p className="font-display text-2xl sm:text-3xl text-neon-green mb-8">
          {targetTeamName} still has their own gift — drink up!
        </p>
      ) : (
        <p className="font-display text-2xl sm:text-3xl text-neon-green mb-8">
          The Grinch found nothing to steal!
        </p>
      )}
      <button
        type="button"
        onClick={onDismiss}
        className="px-8 py-3 rounded-full bg-neon-red text-white font-display text-xl shadow-neonRed active:scale-95"
      >
        Bah Humbug
      </button>
    </div>
  )
}
