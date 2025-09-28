
import type { ComponentType } from 'react';
import { DollarSign, TrendingUp, BarChart3, Target, Layers } from 'lucide-react';
import { StablecoinData } from '../types/stablecoin';

interface MetricsPanelProps {
  data: StablecoinData | null;
  loading: boolean;
}

function formatUsd(value: number): string {
  if (value >= 1e12) return `US$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `US$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `US$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `US$${(value / 1e3).toFixed(0)}K`;
  return `US$${value.toFixed(0)}`;
}

export function MetricsPanel({ data, loading }: MetricsPanelProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <div className="h-24 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-900/40" />
          </div>
        ))}
      </div>
    );
  }

  const flows = data?.flows || [];
  const totalValue = data?.totalValue ?? 0;
  const uniqueProtocols = new Set(flows.map(flow => flow.target)).size;
  const uniqueStablecoins = new Set(flows.map(flow => flow.source)).size;

  const totalsByStablecoin = flows.reduce<Record<string, number>>((acc, flow) => {
    acc[flow.source] = (acc[flow.source] ?? 0) + flow.value;
    return acc;
  }, {});

  const dominantStablecoin = Object.entries(totalsByStablecoin)
    .sort((a, b) => b[1] - a[1])[0];

  const sortedFlows = [...flows].sort((a, b) => b.value - a.value);
  const largestFlow = sortedFlows[0];
  const topTenValue = sortedFlows.slice(0, 10).reduce((sum, flow) => sum + flow.value, 0);
  const concentration = totalValue > 0 ? ((topTenValue / totalValue) * 100).toFixed(1) : '0.0';

  const metrics = [
    {
      title: 'Total observed flow',
      value: formatUsd(totalValue),
      detail: flows.length > 0 ? `${flows.length} protocol edges` : 'No flows detected',
      icon: DollarSign,
      description: 'Aggregate USD notional captured in the current DeFiLlama snapshot across lending, AMM and vault venues.',
      tone: 'primary',
    },
    {
      title: 'Active protocols',
      value: uniqueProtocols.toString(),
      detail: `${uniqueStablecoins} canonical stablecoins`,
      icon: BarChart3,
      description: 'Distinct protocol endpoints receiving flows from tracked stablecoins in this time window.',
      tone: 'neutral',
    },
    dominantStablecoin && {
      title: 'Dominant stablecoin',
      value: dominantStablecoin[0],
      detail: `${((dominantStablecoin[1] / (totalValue || dominantStablecoin[1])) * 100).toFixed(1)}% of value`,
      icon: TrendingUp,
      description: 'Share of total observed flow captured by the leading stablecoin across the monitored pools.',
      tone: 'accent',
    },
    largestFlow && {
      title: 'Largest single flow',
      value: `${largestFlow.source} -> ${largestFlow.target}`,
      detail: formatUsd(largestFlow.value),
      icon: Target,
      description: 'Highest individual routing observed between a stablecoin and a DeFi venue within the snapshot.',
      tone: 'neutral',
    },
    flows.length > 0 && {
      title: 'Top 10 concentration',
      value: `${concentration}%`,
      detail: 'Share of total value',
      icon: Layers,
      description: 'Indicates how much of the observed outflow is concentrated in the ten largest protocol edges.',
      tone: 'neutral',
    },
  ].filter(Boolean) as Array<{
    title: string;
    value: string;
    detail: string;
    icon: ComponentType<{ className?: string }>;
    description: string;
    tone: 'primary' | 'neutral' | 'accent';
  }>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        const isPrimary = metric.tone === 'primary';
        const isAccent = metric.tone === 'accent';
        return (
          <div
            key={index}
            className={`rounded-2xl border p-6 shadow-sm transition-transform hover:-translate-y-0.5 ${
              isPrimary
                ? 'border-blue-200 bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700 text-white dark:border-blue-900/60'
                : isAccent
                  ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-900/20'
                  : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <p
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    isPrimary
                      ? 'text-blue-100'
                      : isAccent
                        ? 'text-emerald-700 dark:text-emerald-200'
                        : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {metric.title}
                </p>
                <p
                  className={`text-2xl font-semibold ${
                    isPrimary
                      ? 'text-white'
                      : isAccent
                        ? 'text-emerald-900 dark:text-emerald-100'
                        : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {metric.value}
                </p>
                <p
                  className={`text-xs font-medium ${
                    isPrimary
                      ? 'text-blue-100'
                      : isAccent
                        ? 'text-emerald-800/80 dark:text-emerald-200/80'
                        : 'text-blue-600 dark:text-blue-400'
                  }`}
                >
                  {metric.detail}
                </p>
                <p
                  className={`text-xs leading-relaxed ${
                    isPrimary
                      ? 'text-blue-50/80'
                      : isAccent
                        ? 'text-emerald-900/80 dark:text-emerald-100/80'
                        : 'text-gray-600 dark:text-gray-300'
                  }`}
                >
                  {metric.description}
                </p>
              </div>
              <span
                className={`rounded-xl p-3 ${
                  isPrimary
                    ? 'bg-white/15 text-white'
                    : isAccent
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
                      : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                }`}
              >
                <Icon className="h-6 w-6" />
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
