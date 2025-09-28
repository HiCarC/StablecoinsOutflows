import { useMemo, useState } from 'react';
import { Activity, BarChart3, Gauge } from 'lucide-react';
import { MetricsPanel } from '../../components/MetricsPanel';
import { SankeyDiagram } from '../../components/SankeyDiagram';
import { DataTable } from '../../components/DataTable';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useStablecoinData } from '../../hooks/useStablecoinData';
import type { UseCaseDefinition } from '../../data/useCases';
import type { StablecoinTimeframe } from '../../types/stablecoin';

interface DefiProtocolsDetailProps {
  useCase: UseCaseDefinition;
  selectedTimeframe: StablecoinTimeframe;
  selectedStablecoin: string;
  onTimeframeChange: (timeframe: StablecoinTimeframe) => void;
  onStablecoinChange: (stablecoin: string) => void;
}

function formatShare(value: number): string {
  return `${value.toFixed(1)} %`;
}

function formatTrillions(value: number): string {
  return `US$${value.toFixed(1)} T`;
}

const HEADER_STYLE: Record<string, { border: string; glow: string; badge: string }> = {
  'defi-protocols': {
    border: 'border-[#172554]/40 dark:border-[#172554]/50',
    glow: 'bg-[radial-gradient(circle_at_top_left,_rgba(23,37,84,0.45),_transparent_60%)]',
    badge: 'bg-[#172554]/80 text-indigo-100 border border-[#2a3d9f]/60',
  },
  'centralised-exchanges': {
    border: 'border-[#1d4ed8]/40 dark:border-[#1d4ed8]/45',
    glow: 'bg-[radial-gradient(circle_at_top_left,_rgba(29,78,216,0.45),_transparent_60%)]',
    badge: 'bg-[#1d4ed8]/80 text-blue-50 border border-[#2563eb]/60',
  },
  'mev-arbitrage': {
    border: 'border-[#3b82f6]/40 dark:border-[#3b82f6]/45',
    glow: 'bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.45),_transparent_60%)]',
    badge: 'bg-[#3b82f6]/80 text-sky-50 border border-[#60a5fa]/60',
  },
  'cross-border': {
    border: 'border-[#047857]/40 dark:border-[#047857]/50',
    glow: 'bg-[radial-gradient(circle_at_top_left,_rgba(4,120,87,0.45),_transparent_60%)]',
    badge: 'bg-[#047857]/80 text-emerald-50 border border-[#34d399]/60',
  },
  payments: {
    border: 'border-[#10b981]/40 dark:border-[#10b981]/45',
    glow: 'bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.45),_transparent_60%)]',
    badge: 'bg-[#10b981]/80 text-emerald-50 border border-[#6ee7b7]/60',
  },
};

const DEFAULT_HEADER_STYLE = {
  border: 'border-slate-300/40 dark:border-slate-700/60',
  glow: 'bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.25),_transparent_60%)]',
  badge: 'bg-white/10 text-white',
};

const TIMEFRAME_OPTIONS: Array<{ value: StablecoinTimeframe; label: string }> = [
  { value: '1h', label: '1 Hour' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
];

const STABLECOIN_OPTIONS = [
  { value: 'all', label: 'All monitored stablecoins' },
  { value: 'USDT', label: 'Tether (USDT)' },
  { value: 'USDC', label: 'USD Coin (USDC)' },
  { value: 'DAI', label: 'Dai (DAI)' },
  { value: 'BUSD', label: 'Binance USD (BUSD)' },
  { value: 'TUSD', label: 'TrueUSD (TUSD)' },
];

export function DefiProtocolsDetail({
  useCase,
  selectedTimeframe,
  selectedStablecoin,
  onTimeframeChange,
  onStablecoinChange,
}: DefiProtocolsDetailProps) {
  const [diagramHeight, setDiagramHeight] = useState(520);
  const { data, loading, error } = useStablecoinData(selectedTimeframe, selectedStablecoin);
  const palette = HEADER_STYLE[useCase.slug] ?? DEFAULT_HEADER_STYLE;

  const lastUpdatedLabel = useMemo(() => {
    if (!data?.lastUpdated) {
      return null;
    }

    return new Date(data.lastUpdated).toLocaleString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZoneName: 'short',
    });
  }, [data?.lastUpdated]);

  const stablecoinLabel = selectedStablecoin.toLowerCase() === 'all'
    ? 'All monitored stablecoins'
    : selectedStablecoin;

  return (
    <div className="space-y-10">
      <header className={`relative overflow-hidden rounded-3xl border ${palette.border} bg-gradient-to-br ${useCase.accentClass} text-white shadow-lg`}>
        <div className={`absolute inset-0 ${palette.glow}`} aria-hidden />
        <div className="relative p-8 md:p-10">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
            <div className="space-y-4 max-w-3xl">
              <span className={`inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${palette.badge}`}>
                <Activity className="h-4 w-4" />
                DeFi telemetry
              </span>
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">{useCase.name}</h1>
              <p className="text-base md:text-lg text-slate-100 leading-relaxed">{useCase.summary}</p>
              <div className="flex flex-wrap gap-3 text-sm text-slate-100/90">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-semibold">
                  <BarChart3 className="h-4 w-4" />
                  {`Time horizon ${selectedTimeframe}`}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 font-semibold">
                  <Gauge className="h-4 w-4" />
                  {stablecoinLabel}
                </span>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-indigo-100/80">Share of tracked volume</p>
                <p className="mt-2 text-3xl font-semibold text-white">{formatShare(useCase.shareOfVolumePercent)}</p>
                <p className="mt-2 text-[11px] uppercase tracking-wide text-indigo-100/70">Artemis harmonised dataset</p>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 px-5 py-4 text-center backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-indigo-100/80">Annualised settlement</p>
                <p className="mt-2 text-3xl font-semibold text-white">{formatTrillions(useCase.annualisedVolumeUsdTrillions)}</p>
                <p className="mt-2 text-[11px] uppercase tracking-wide text-indigo-100/70">Aggregated lending, AMM and structured pools</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Telemetry scope</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Select the observation window and canonical stablecoin before drilling into the flow topology.
            </p>
          </div>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">Time Horizon</span>
              <div className="flex flex-wrap gap-2 rounded-2xl bg-gray-100 p-1 dark:bg-gray-900/40">
                {TIMEFRAME_OPTIONS.map(option => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onTimeframeChange(option.value)}
                    className={`px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                      selectedTimeframe === option.value
                        ? 'bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-300'
                        : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">Stablecoin Lens</span>
              <select
                value={selectedStablecoin}
                onChange={event => onStablecoinChange(event.target.value)}
                className="w-full min-w-[220px] rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              >
                {STABLECOIN_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>
      <section>
        <MetricsPanel data={data} loading={loading} />
      </section>


      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Stablecoin flow topology</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Tracks protocol edges ranked by value. Use the controls above to rescope by timeframe or canonical stablecoin.
              </p>
            </div>
            {lastUpdatedLabel && (
              <p className="text-xs text-gray-500 dark:text-gray-400">Snapshot captured {lastUpdatedLabel}</p>
            )}
          </div>

          <div className="overflow-hidden" style={{ height: `${diagramHeight}px` }}>
            <SankeyDiagram
              data={data?.flows || []}
              loading={loading}
              error={error}
              onHeightChange={setDiagramHeight}
            />
          </div>

          {data?.metadata?.provider && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Source: {data.metadata.provider}
              {data.metadata.note ? ` - ${data.metadata.note}` : ''}
            </div>
          )}
        </div>
      </section>
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
      </section>


      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Protocol-level breakdown</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Ordered by reported capital allocation. Supervisors can export this table from the codebase for independent stress testing or scenario work.
            </p>
          </div>
          <ErrorBoundary>
            <DataTable
              data={
                data?.flows?.filter(
                  flow => flow && typeof flow.source === 'string' && typeof flow.target === 'string'
                ) || []
              }
              loading={loading}
              totalValue={data?.totalValue || 0}
            />
          </ErrorBoundary>
        </div>
      </section>
    </div>
  );
}
