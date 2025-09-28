import type { UseCaseDefinition } from '../../data/useCases';

function formatShare(value: number): string {
  return `${value.toFixed(1)} %`;
}

function formatTrillions(value: number): string {
  if (value >= 1) {
    return `US$${value.toFixed(1)} T`;
  }
  return `US$${(value * 1000).toFixed(0)} B`;
}

export function StaticUseCaseDetail({ useCase }: { useCase: UseCaseDefinition }) {
  return (
    <div className="space-y-10">
      <header className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">Use case deep dive</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{useCase.name}</h1>
          <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">{useCase.summary}</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Share of tracked volume</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatShare(useCase.shareOfVolumePercent)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Artemis harmonised dataset</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Annualised settlement</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatTrillions(useCase.annualisedVolumeUsdTrillions)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Normalised to 2024/25 run rate</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Headline insight</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{useCase.highlight}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Derived from primary sources below</p>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Supervisory signals</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {useCase.metrics.map(metric => (
            <div key={metric.label} className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4 space-y-2">
              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">{metric.label}</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{metric.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{metric.context}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Key observations</h2>
        <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
          {useCase.insightBullets.map((bullet, index) => (
            <li key={index} className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0" />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </section>

      {useCase.paymentBreakdown && (
        <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payments mix (Artemis survey run rate)</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">Breakdown of the US$72.3 billion annualised payments run rate reported by 31 providers.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/40 text-gray-600 dark:text-gray-300 uppercase text-xs">
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-right">Run rate (US$B)</th>
                    <th className="px-4 py-3 text-right">Share of payments</th>
                    <th className="px-4 py-3 text-right">Share of total volume</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 text-gray-700 dark:text-gray-200">
                  {useCase.paymentBreakdown.map(item => (
                    <tr key={item.label}>
                      <td className="px-4 py-3 font-medium">{item.label}</td>
                      <td className="px-4 py-3 text-right">{item.runRateUsdBillions.toFixed(1)}</td>
                      <td className="px-4 py-3 text-right">{item.shareOfPayments.toFixed(1)}%</td>
                      <td className="px-4 py-3 text-right">{item.shareOfTotalVolume.toFixed(3)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm space-y-6">
        {useCase.narrative.map(section => (
          <article key={section.title} className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{section.title}</h3>
            {section.paragraphs.map((paragraph, index) => (
              <p key={index} className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                {paragraph}
              </p>
            ))}
          </article>
        ))}
      </section>

      <section className="bg-gray-50 dark:bg-gray-900/40 border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wide">Source references</h2>
        <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-300">
          {useCase.sources.map(source => (
            <li key={source.label} className="flex items-baseline gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />
              <span>
                {source.label}
                <span className="text-gray-500 dark:text-gray-400"> - {source.url}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

