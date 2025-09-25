import { TrendingUp, Shield, Globe, Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  selectedTimeframe: '1h' | '24h' | '7d' | '30d';
  setSelectedTimeframe: (timeframe: '1h' | '24h' | '7d' | '30d') => void;
  selectedStablecoin: string;
  setSelectedStablecoin: (stablecoin: string) => void;
}

const stablecoins = [
  { value: 'all', label: 'All Stablecoins' },
  { value: 'USDT', label: 'Tether (USDT)' },
  { value: 'USDC', label: 'USD Coin (USDC)' },
  { value: 'DAI', label: 'Dai (DAI)' },
  { value: 'BUSD', label: 'Binance USD (BUSD)' },
  { value: 'TUSD', label: 'TrueUSD (TUSD)' },
];

const timeframes = [
  { value: '1h', label: '1 Hour' },
  { value: '24h', label: '24 Hours' },
  { value: '7d', label: '7 Days' },
  { value: '30d', label: '30 Days' },
];

export function Header({ 
  selectedTimeframe, 
  setSelectedTimeframe, 
  selectedStablecoin, 
  setSelectedStablecoin 
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 py-6">
        {/* Title Section */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
             <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
               <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Stablecoin Outflow Monitor
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Real-time DeFi Protocol Flow Analysis for Regulatory Supervision
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Globe className="h-4 w-4" />
              <span>Live Data</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4">
          {/* Timeframe Selector */}
           <div className="flex flex-col space-y-2">
             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Period</label>
             <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              {timeframes.map((timeframe) => (
                <button
                  key={timeframe.value}
                  onClick={() => setSelectedTimeframe(timeframe.value as any)}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    selectedTimeframe === timeframe.value
                      ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  {timeframe.label}
                </button>
              ))}
            </div>
          </div>

          {/* Stablecoin Selector */}
           <div className="flex flex-col space-y-2">
             <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stablecoin</label>
             <select
               value={selectedStablecoin}
               onChange={(e) => setSelectedStablecoin(e.target.value)}
               className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {stablecoins.map((coin) => (
                <option key={coin.value} value={coin.value}>
                  {coin.label}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Button */}
           <div className="flex flex-col space-y-2">
             <label className="text-sm font-medium text-gray-700 dark:text-gray-300 opacity-0">Refresh</label>
             <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-medium">Refresh Data</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
