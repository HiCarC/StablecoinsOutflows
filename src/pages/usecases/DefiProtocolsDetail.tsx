import { useMemo, useState } from 'react';
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
}

function formatShare(value: number): string {
  return `${value.toFixed(1)} %`;
}

function formatTrillions(value: number): string {
  return `US$${value.toFixed(1)} T`;
}

export function DefiProtocolsDetail({ useCase, selectedTimeframe, selectedStablecoin }: DefiProtocolsDetailProps) {
  const [diagramHeight, setDiagramHeight] = useState(520);
  const { data, loading, error } = useStablecoinData(selectedTimeframe, selectedStablecoin);

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
      <header className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">Use case deep dive</p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{useCase.name}</h1>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">{useCase.summary}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Share of tracked volume</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatShare(useCase.shareOfVolumePercent)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Artemis harmonised dataset</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Annualised settlement</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatTrillions(useCase.annualisedVolumeUsdTrillions)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Aggregated lending, AMM and structured pools</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Current lens</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stablecoinLabel}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Time horizon {selectedTimeframe}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/40 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">Key revenue signal</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{useCase.metrics[2]?.value ?? '30 %+'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{useCase.metrics[2]?.context ?? 'Share of DeFi protocol fees.'}</p>
            </div>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-300">
            {useCase.insightBullets.map((bullet, index) => (
              <li key={index} className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 flex gap-3">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <section>
        <MetricsPanel data={data} loading={loading} />
      </section>

      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Stablecoin flow topology</h2>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Tracks protocol edges ranked by value. Use the header filters to rescope by timeframe or canonical stablecoin.
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
              {data.metadata.note ? ` ? ${data.metadata.note}` : ''}
            </div>
          )}
        </div>
      </section>

      <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Protocol-level breakdown</h2>
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
                <span className="text-gray-500 dark:text-gray-400"> ? {source.url}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

