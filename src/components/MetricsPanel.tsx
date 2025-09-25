import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface StablecoinFlow {
  source: string;
  target: string;
  value: number;
  percentage: number;
}

interface StablecoinData {
  flows: StablecoinFlow[];
  totalValue: number;
  lastUpdated: string;
}

interface MetricsPanelProps {
  data: StablecoinData | null;
  loading: boolean;
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

  const totalValue = data?.totalValue || 0;
  const flows = data?.flows || [];
  const uniqueProtocols = new Set(flows.map(flow => flow.target)).size;
  const uniqueStablecoins = new Set(flows.map(flow => flow.source)).size;
  
  // Calculate growth rate (mock data for now)
  const growthRate = 12.5; // This would come from historical comparison

  const metrics = [
    {
      title: 'Total Outflow Value',
      value: `$${(totalValue / 1e9).toFixed(2)}B`,
      change: `+${growthRate}%`,
      changeType: 'positive' as const,
      icon: DollarSign,
      description: 'Total stablecoin value flowing to DeFi'
    },
    {
      title: 'Active Protocols',
      value: uniqueProtocols.toString(),
      change: '+3',
      changeType: 'positive' as const,
      icon: Activity,
      description: 'DeFi protocols receiving stablecoin flows'
    },
    {
      title: 'Stablecoin Types',
      value: uniqueStablecoins.toString(),
      change: 'Stable',
      changeType: 'neutral' as const,
      icon: TrendingUp,
      description: 'Different stablecoin types monitored'
    },
    {
      title: 'Average Flow Size',
      value: flows.length > 0 ? `$${(totalValue / flows.length / 1e6).toFixed(1)}M` : '$0M',
      change: '-2.1%',
      changeType: 'negative' as const,
      icon: TrendingDown,
      description: 'Average value per flow transaction'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{metric.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{metric.value}</p>
                <div className="flex items-center space-x-1">
                  {metric.changeType === 'positive' && <TrendingUp className="h-3 w-3 text-green-500" />}
                  {metric.changeType === 'negative' && <TrendingDown className="h-3 w-3 text-red-500" />}
                  <span className={`text-xs font-medium ${
                    metric.changeType === 'positive' ? 'text-green-600' :
                    metric.changeType === 'negative' ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'
                  }`}>
                    {metric.change}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{metric.description}</p>
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
