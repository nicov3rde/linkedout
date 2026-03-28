export default function Dashboard({ stats }) {
  const { buzzwordCount = 0, synergyScore = 0, jargonLevel = 0 } = stats

  const jargonLabel =
    jargonLevel < 20 ? 'Plain English' :
    jargonLevel < 40 ? 'Entry Level' :
    jargonLevel < 60 ? 'Mid-Career' :
    jargonLevel < 80 ? 'Senior Buzzword' :
    'Thought Leader'

  const synergyColor =
    synergyScore < 33 ? 'text-green-600' :
    synergyScore < 66 ? 'text-yellow-600' :
    'text-red-600'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
        Analytics Dashboard
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {/* Buzzword Count */}
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-3xl font-bold text-[#0a66c2]">{buzzwordCount}</div>
          <div className="text-xs text-gray-500 mt-1">Buzzwords Deployed</div>
        </div>

        {/* Synergy Score */}
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <div className={`text-3xl font-bold ${synergyColor}`}>{synergyScore}</div>
          <div className="text-xs text-gray-500 mt-1">Synergy Score™</div>
          <div className="text-xs text-gray-400">/100</div>
        </div>

        {/* Jargon Level */}
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-lg font-bold text-orange-600">{jargonLabel}</div>
          <div className="text-xs text-gray-500 mt-1">Jargon Level</div>
        </div>
      </div>

      {/* Jargon meter */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Normal Human</span>
          <span>CEO of Everything</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full transition-all duration-700"
            style={{
              width: `${jargonLevel}%`,
              background: 'linear-gradient(90deg, #0a66c2, #7c3aed)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
