import { useMemo, useState } from 'react';
import type { StablecoinFlow } from '../types/stablecoin';
import { ArrowUpDown, TrendingDown, TrendingUp } from 'lucide-react';

interface DataTableProps {
  data: StablecoinFlow[];
  loading: boolean;
  totalValue: number;
}

type SortField = 'source' | 'target' | 'value' | 'percentage';
type SortDirection = 'asc' | 'desc';

function formatValue(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
  return `$${value.toFixed(0)}`;
}

function getStablecoinBadge(stablecoin: string): string {
  const palette: Record<string, string> = {
    USDT: 'bg-emerald-100 text-emerald-900',
    USDC: 'bg-blue-100 text-blue-900',
    DAI: 'bg-amber-100 text-amber-900',
    BUSD: 'bg-yellow-100 text-yellow-900',
    TUSD: 'bg-green-100 text-green-900',
  };
  return palette[stablecoin] || 'bg-gray-100 text-gray-700';
}

export function DataTable({ data, loading, totalValue }: DataTableProps) {
  const [sortField, setSortField] = useState<SortField>('value');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');

  const sortedData = useMemo(() => {
    const normalized = data.filter(
      flow => flow && typeof flow.source === 'string' && typeof flow.target === 'string',
    );

    const needle = searchTerm.trim().toLowerCase();
    const filtered = needle
      ? normalized.filter(flow =>
          flow.source.toLowerCase().includes(needle) || flow.target.toLowerCase().includes(needle),
        )
      : normalized;

    return [...filtered].sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'source':
          aValue = a.source;
          bValue = b.source;
          break;
        case 'target':
          aValue = a.target;
          bValue = b.target;
          break;
        case 'percentage':
          aValue = a.percentage;
          bValue = b.percentage;
          break;
        case 'value':
        default:
          aValue = a.value;
          bValue = b.value;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      const delta = (aValue as number) - (bValue as number);
      return sortDirection === 'asc' ? delta : -delta;
    });
  }, [data, sortDirection, sortField, searchTerm]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg w-1/3"></div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[...Array(4)].map((_, index) => (
                  <th key={index} className="px-6 py-3 text-left">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[...Array(6)].map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {[...Array(4)].map((__, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search stablecoins or protocols..."
            value={searchTerm}
            onChange={event => setSearchTerm(event.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {sortedData.length} of {data.length} flows
          {totalValue > 0 && (
            <span className="ml-2 font-semibold text-gray-800 dark:text-gray-200">
              Total observed: {formatValue(totalValue)}
            </span>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {(
                [
                  { field: 'source' as SortField, label: 'Stablecoin' },
                  { field: 'target' as SortField, label: 'DeFi Protocol' },
                  { field: 'value' as SortField, label: 'Value (USD)' },
                  { field: 'percentage' as SortField, label: 'Share' },
                ]
              ).map(({ field, label }) => {
                const isActive = sortField === field;
                const SortIndicator = sortDirection === 'asc' ? TrendingUp : TrendingDown;
                return (
                  <th
                    key={field}
                    onClick={() => handleSort(field)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <div className="flex items-center space-x-1">
                      <span>{label}</span>
                      <ArrowUpDown className="h-3 w-3" />
                      {isActive && <SortIndicator className="h-3 w-3" />}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.map((flow, index) => (
              <tr key={`${flow.source}-${flow.target}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStablecoinBadge(flow.source)}`}>
                    {flow.source}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {flow.target}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                  {formatValue(flow.value)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {flow.percentage.toFixed(2)}%
                    </span>
                    <div className="w-20 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div
                        className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full"
                        style={{ width: `${Math.min(100, flow.percentage)}%` }}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedData.length === 0 && !loading && (
        <div className="text-center py-8">
          <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">No results found</div>
          <div className="text-gray-600 dark:text-gray-400">Try adjusting your search terms</div>
        </div>
      )}
    </div>
  );
}
