import { useState, useMemo } from 'react';
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';

interface StablecoinFlow {
  source: string;
  target: string;
  value: number;
  percentage: number;
}

interface DataTableProps {
  data: StablecoinFlow[];
  loading: boolean;
  totalValue: number;
}

type SortField = 'source' | 'target' | 'value' | 'percentage';
type SortDirection = 'asc' | 'desc';

export function DataTable({ data, loading, totalValue }: DataTableProps) {
  const [sortField, setSortField] = useState<SortField>('value');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchTerm, setSearchTerm] = useState('');


  const sortedData = useMemo(() => {
    // Ensure we have valid flow data with string properties
    const validData = data.filter(flow => 
      flow && 
      typeof flow === 'object' && 
      typeof flow.source === 'string' && 
      typeof flow.target === 'string'
    );

    const filtered = validData.filter(flow => 
      flow.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flow.target.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
        case 'value':
          aValue = a.value;
          bValue = b.value;
          break;
        case 'percentage':
          aValue = a.percentage;
          bValue = b.percentage;
          break;
        default:
          aValue = a.value;
          bValue = b.value;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortDirection === 'asc' 
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
    });
  }, [data, sortField, sortDirection, searchTerm]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const formatValue = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  const getProtocolIcon = (protocol: string) => {
    if (!protocol || typeof protocol !== 'string') return '🔗';
    const protocolLower = protocol.toLowerCase();
    if (protocolLower.includes('aave')) return '🦉';
    if (protocolLower.includes('compound')) return '🏛️';
    if (protocolLower.includes('uniswap')) return '🦄';
    if (protocolLower.includes('curve')) return '🌊';
    if (protocolLower.includes('yearn')) return '📈';
    if (protocolLower.includes('maker')) return '⚙️';
    return '🔗';
  };

  const getStablecoinColor = (stablecoin: string) => {
    if (!stablecoin || typeof stablecoin !== 'string') return 'bg-gray-100 text-gray-800';
    const colors: { [key: string]: string } = {
      'USDT': 'bg-blue-100 text-blue-800',
      'USDC': 'bg-blue-100 text-blue-800',
      'DAI': 'bg-orange-100 text-orange-800',
      'BUSD': 'bg-yellow-100 text-yellow-800',
      'TUSD': 'bg-green-100 text-green-800',
    };
    return colors[stablecoin] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Search bar skeleton */}
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 rounded-lg w-1/3"></div>
        </div>
        
        {/* Table skeleton */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[...Array(4)].map((_, i) => (
                  <th key={i} className="px-6 py-3 text-left">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  {[...Array(4)].map((_, j) => (
                    <td key={j} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded w-16"></div>
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
    <div className="space-y-4">
      {/* Search and Summary */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div className="flex-1 max-w-md">
          <input
            type="text"
            placeholder="Search stablecoins or protocols..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {sortedData.length} of {data.length} flows
          {totalValue > 0 && (
            <span className="ml-2 font-medium">
              • Total: {formatValue(totalValue)}
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('source')}
              >
                <div className="flex items-center space-x-1">
                  <span>Stablecoin</span>
                  <ArrowUpDown className="h-3 w-3" />
                  {sortField === 'source' && (
                    sortDirection === 'asc' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('target')}
              >
                <div className="flex items-center space-x-1">
                  <span>DeFi Protocol</span>
                  <ArrowUpDown className="h-3 w-3" />
                  {sortField === 'target' && (
                    sortDirection === 'asc' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('value')}
              >
                <div className="flex items-center space-x-1">
                  <span>Value</span>
                  <ArrowUpDown className="h-3 w-3" />
                  {sortField === 'value' && (
                    sortDirection === 'asc' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={() => handleSort('percentage')}
              >
                <div className="flex items-center space-x-1">
                  <span>Percentage</span>
                  <ArrowUpDown className="h-3 w-3" />
                  {sortField === 'percentage' && (
                    sortDirection === 'asc' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedData.map((flow, index) => (
               <tr key={`${flow.source}-${flow.target}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStablecoinColor(flow.source)}`}>
                    {flow.source}
                  </span>
                </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex items-center space-x-2">
                     <span className="text-lg">{getProtocolIcon(flow.target)}</span>
                     <span className="text-sm font-medium text-gray-900 dark:text-white">{flow.target}</span>
                   </div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="text-sm font-semibold text-gray-900 dark:text-white">
                     {formatValue(flow.value)}
                   </div>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <div className="flex items-center">
                     <div className="text-sm text-gray-900 dark:text-white font-medium">
                       {flow.percentage.toFixed(2)}%
                     </div>
                    <div className="ml-2 w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, flow.percentage)}%` }}
                      ></div>
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
           <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">🔍 No Results Found</div>
           <div className="text-gray-600 dark:text-gray-400">Try adjusting your search terms</div>
         </div>
      )}
    </div>
  );
}
