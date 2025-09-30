import { Wallet } from 'lucide-react';
import type { UseCaseDefinition } from '../../data/useCases';
import { PaymentsMixSankey } from '../../components/PaymentsMixSankey';

const TRADING_SLUGS = new Set(['defi-protocols', 'centralised-exchanges', 'mev-arbitrage']);

const HEADER_STYLE: Record<string, { border: string; glow: string; badge: string; meta: string }> = {
  'defi-protocols': {
    border: 'border-[#172554]/40 dark:border-[#172554]/50',
    glow: 'bg-[radial-gradient(circle_at_top_left,_rgba(23,37,84,0.45),_transparent_55%)]',
    badge: 'bg-[#172554]/80 text-indigo-100 border border-[#2a3d9f]/60',
    meta: 'text-indigo-100/80',
  },
  'centralised-exchanges': {
    border: 'border-[#1d4ed8]/40 dark:border-[#1d4ed8]/45',
    glow: 'bg-[radial-gradient(circle_at_top_left,_rgba(29,78,216,0.45),_transparent_55%)]',
    badge: 'bg-[#1d4ed8]/80 text-blue-50 border border-[#2563eb]/60',
    meta: 'text-blue-100/80',
  },
  'mev-arbitrage': {
    border: 'border-[#3b82f6]/40 dark:border-[#3b82f6]/45',
    glow: 'bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.45),_transparent_55%)]',
    badge: 'bg-[#3b82f6]/80 text-sky-50 border border-[#60a5fa]/60',
    meta: 'text-sky-100/80',
  },
  'cross-border': {
    border: 'border-[#047857]/40 dark:border-[#047857]/50',
    glow: 'bg-[radial-gradient(circle_at_top_left,_rgba(4,120,87,0.45),_transparent_55%)]',
    badge: 'bg-[#047857]/80 text-emerald-50 border border-[#34d399]/60',
    meta: 'text-emerald-100/80',
  },
  payments: {
    border: 'border-[#10b981]/40 dark:border-[#10b981]/45',
    glow: 'bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.45),_transparent_55%)]',
    badge: 'bg-[#10b981]/80 text-emerald-50 border border-[#6ee7b7]/60',
    meta: 'text-emerald-100/80',
  },
};

const DEFAULT_HEADER_STYLE = {
  border: 'border-slate-300/40 dark:border-slate-700/60',
  glow: 'bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.25),_transparent_55%)]',
  badge: 'bg-white/10 text-white',
  meta: 'text-white/80',
};

function formatShare(value: number): string {
  return `${value.toFixed(1)} %`;
}

function formatSettlement(value: number): string {
  if (value >= 1) {
    return `US$${value.toFixed(1)} T`;
  }
  return `US$${(value * 1000).toFixed(0)} B`;
}

export function StaticUseCaseDetail({ useCase }: { useCase: UseCaseDefinition }) {
  const isTrading = TRADING_SLUGS.has(useCase.slug);
  const isPayments = useCase.slug === 'payments';
  const classificationLabel = isTrading ? 'Trading-related activity' : 'Real-economy adoption';
  const palette = HEADER_STYLE[useCase.slug] ?? DEFAULT_HEADER_STYLE;
  const shareMetric = useCase.metrics.find(metric => metric.label === 'Share of tracked volume');
  const settlementMetric = useCase.metrics.find(metric => metric.label === 'Annualised settlement');
  const runRateMetric = useCase.metrics.find(metric => metric.label === 'Verified run rate');
  const b2bBreakdown = useCase.paymentBreakdown?.find(item => item.label === 'B2B payments');

  return (
    <div className="space-y-10">
      <header className={`relative overflow-hidden rounded-3xl border ${palette.border} bg-gradient-to-br ${useCase.accentClass} text-white shadow-lg`}>
        <div className={`absolute inset-0 ${palette.glow}`} aria-hidden />
        <div className="relative p-8 md:p-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="space-y-5 max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">{useCase.name}</h1>
              <p className="text-base md:text-lg text-slate-100 leading-relaxed">{useCase.summary}</p>
              <div className="flex flex-wrap gap-3 text-sm">
                <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-semibold ${palette.badge}`}>
                  {isTrading ? 'Trading' : 'Real economy'}
                  <span className="text-xs font-medium uppercase tracking-wide">{classificationLabel}</span>
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-slate-100">
                  <Wallet className="h-4 w-4" />
                  {useCase.highlight}
                </span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center backdrop-blur">
                <p className={`text-xs uppercase tracking-wide ${palette.meta}`}>Share of tracked volume</p>
                <p className="mt-2 text-3xl font-semibold text-white">{formatShare(useCase.shareOfVolumePercent)}</p>
                <p className="mt-2 text-[11px] uppercase tracking-wide text-white/70">Report harmonised dataset</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center backdrop-blur">
                <p className={`text-xs uppercase tracking-wide ${palette.meta}`}>Annualised settlement</p>
                <p className="mt-2 text-3xl font-semibold text-white">{formatSettlement(useCase.annualisedVolumeUsdTrillions)}</p>
                <p className="mt-2 text-[11px] uppercase tracking-wide text-white/70">Snapshot as published in the report</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {!isPayments && useCase.metrics.length > 0 && (
        <section className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white p-6 shadow-sm dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Supervisory signals</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {useCase.metrics.map(metric => (
              <div key={metric.label} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5 shadow-sm dark:border-gray-700/60 dark:bg-gray-900/30">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">{metric.label}</p>
                <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">{metric.value}</p>
                <p className="mt-2 text-xs leading-relaxed text-gray-600 dark:text-gray-300">{metric.context}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white p-6 shadow-sm dark:bg-gray-800">
        <div className={isPayments ? 'flex flex-col gap-6 lg:flex-row lg:items-start' : undefined}>
          <div className={isPayments ? 'flex-1 space-y-4' : 'space-y-4'}>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Key observations</h2>
            <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              {useCase.insightBullets.map((bullet, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500 dark:bg-blue-400" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          {isPayments && (
            <div className="lg:w-80 space-y-3">
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-200">{useCase.headline}</p>
              <aside className="rounded-3xl border border-emerald-300/60 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 p-6 text-emerald-50 shadow-lg">
                <p className="text-xs font-semibold uppercase tracking-wide text-emerald-100">Payments dossier</p>
                {runRateMetric && (
                  <div className="mt-4 space-y-1">
                    <p className="text-[11px] uppercase tracking-wide text-emerald-100/80">Verified run rate</p>
                    <p className="text-2xl font-semibold">{runRateMetric.value}</p>
                    <p className="text-xs text-emerald-100/70">{runRateMetric.context}</p>
                  </div>
                )}
                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-wide text-emerald-100/80">Share of flows</p>
                    <p className="text-lg font-semibold">
                      {shareMetric ? shareMetric.value : `${useCase.shareOfVolumePercent.toFixed(1)} %`}
                    </p>
                    <p className="text-[11px] text-emerald-100/70">Report dataset</p>
                  </div>
                  {b2bBreakdown && (
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-wide text-emerald-100/80">B2B share</p>
                      <p className="text-lg font-semibold">{b2bBreakdown.shareOfPayments.toFixed(1)}%</p>
                      <p className="text-[11px] text-emerald-100/70">Payments mix leader</p>
                    </div>
                  )}
                </div>
                {settlementMetric && (
                  <div className="mt-5 border-t border-emerald-300/40 pt-4 space-y-1">
                    <p className="text-[11px] uppercase tracking-wide text-emerald-100/80">Annualised settlement</p>
                    <p className="text-lg font-semibold">{settlementMetric.value}</p>
                    <p className="text-[11px] text-emerald-100/70">{settlementMetric.context}</p>
                  </div>
                )}
              </aside>
            </div>
          )}
        </div>
      </section>

      {useCase.paymentBreakdown && (
        <section className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="px-6 py-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payments mix</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Breakdown of the reported payments run rate (US$72.3 billion annualised).</p>
            <div className="mt-4 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
                <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-600 dark:text-gray-300 uppercase text-xs">
                  <tr>
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

            <div className="mt-6 rounded-3xl border border-emerald-200/60 bg-gradient-to-br from-emerald-100/80 via-white to-emerald-50/60 p-6 shadow-inner dark:border-emerald-700/50 dark:from-emerald-900/40 dark:via-transparent dark:to-emerald-800/40">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-200">Flow visualisation</p>
              <p className="mt-1 text-sm text-emerald-900/90 dark:text-emerald-100/80">
                Visualises how the payments run rate distributes across sub-categories while preserving the supervisory colour scheme.
              </p>
              <div className="mt-4">
                <PaymentsMixSankey breakdown={useCase.paymentBreakdown} />
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-6 py-6 space-y-6">
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
        </div>
      </section>

      <section className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 shadow-sm">
        <div className="px-6 py-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-700 dark:text-gray-200">Source references</h2>
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
        </div>
      </section>
    </div>
  );
}
