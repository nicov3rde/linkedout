export default function RegenButton({ onClick, spinning, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || spinning}
      title="Regenerate"
      className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 border border-gray-200 hover:border-gray-300 bg-white rounded-full px-2.5 py-1 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none"
    >
      <span
        className={`inline-block leading-none ${spinning ? 'animate-spin' : ''}`}
        style={{ fontSize: 14 }}
      >
        ↻
      </span>
      {spinning ? 'Regenerating…' : 'Regenerate'}
    </button>
  )
}
