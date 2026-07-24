const PIP_LAYOUTS = {
  1: ['c'],
  2: ['tl', 'br'],
  3: ['tl', 'c', 'br'],
  4: ['tl', 'tr', 'bl', 'br'],
  5: ['tl', 'tr', 'c', 'bl', 'br'],
  6: ['tl', 'tr', 'ml', 'mr', 'bl', 'br'],
}

const POSITION_CLASSES = {
  tl: 'top-2 left-2',
  tr: 'top-2 right-2',
  ml: 'top-1/2 -translate-y-1/2 left-2',
  mr: 'top-1/2 -translate-y-1/2 right-2',
  bl: 'bottom-2 left-2',
  br: 'bottom-2 right-2',
  c: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
}

export default function Dice({ value, rolling, onRoll, disabled }) {
  const pips = PIP_LAYOUTS[value] || []

  return (
    <button
      type="button"
      onClick={onRoll}
      disabled={disabled}
      className={`relative w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-white border-4 border-neon-green
        shadow-neonGreen transition-transform active:scale-95
        disabled:opacity-50 disabled:cursor-not-allowed
        ${rolling ? 'animate-dice-roll' : ''}`}
      aria-label="Roll the dice"
    >
      {value
        ? pips.map((pos, i) => (
            <span
              key={i}
              className={`absolute w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-ink ${POSITION_CLASSES[pos]}`}
            />
          ))
        : (
          <span className="text-ink font-display text-4xl">?</span>
        )}
    </button>
  )
}
