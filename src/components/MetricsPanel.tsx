import type { ComponentType } from 'react';
import { DollarSign, TrendingUp, BarChart3, Target } from 'lucide-react';
import { StablecoinData } from '../types/stablecoin';

interface MetricsPanelProps {
  data: StablecoinData | null;
  loading: boolean;
}

function formatUsd(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

export function MetricsPanel({ data, loading }: MetricsPanelProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
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

  const largestFlow = [...flows].sort((a, b) => b.value - a.value)[0];

  const metrics = [
    {
      title: 'Total Observed Flow',
      value: formatUsd(totalValue),
      detail: flows.length > 0 ? `${flows.length} stablecoin protocol edges` : 'No flows detected',
      icon: DollarSign,
      description: 'USD value derived from DeFiLlama TVL and reported volumes for monitored pools.'
    },
    {
      title: 'Active Protocols',
      value: uniqueProtocols.toString(),
      detail: `${uniqueStablecoins} stablecoin issuers`,
      icon: BarChart3,
      description: 'Distinct protocol endpoints currently receiving the tracked stablecoins.'
    },
    dominantStablecoin && {
      title: 'Dominant Stablecoin',
      value: dominantStablecoin[0],
      detail: `${((dominantStablecoin[1] / (totalValue || dominantStablecoin[1])) * 100).toFixed(1)}% of flows`,
      icon: TrendingUp,
      description: 'Share of total observed flow commanded by the leading stablecoin.'
    },
    largestFlow && {
      title: 'Largest Single Flow',
      value: `${largestFlow.source} to ${largestFlow.target}`,
      detail: formatUsd(largestFlow.value),
      icon: Target,
      description: 'Highest individual protocol allocation within the current snapshot.'
    }
  ].filter(Boolean) as Array<{
    title: string;
    value: string;
    detail: string;
    icon: ComponentType<{ className?: string }>;
    description: string;
  }>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{metric.value}</p>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{metric.detail}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 leading-relaxed">{metric.description}</p>
              </div>
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

