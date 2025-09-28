import { Shield, Globe, Sun, Moon, Menu } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

type Timeframe = '1h' | '24h' | '7d' | '30d';

interface HeaderFilters {
  selectedTimeframe: Timeframe;
  setSelectedTimeframe: (timeframe: Timeframe) => void;
  selectedStablecoin: string;
  setSelectedStablecoin: (stablecoin: string) => void;
}

interface NavItem {
  to: string;
  label: string;
}

interface HeaderProps {
  filters?: HeaderFilters;
  navLinks?: NavItem[];
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

export function Header({ filters, navLinks = [] }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showFilters = Boolean(filters);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <Link to="/" className="text-2xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                Stablecoin Flow Intelligence
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dashboard tracking global stablecoin use-cases
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <nav className="hidden lg:flex items-center space-x-3 text-sm font-medium">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              type="button"
              className="lg:hidden p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle navigation"
            >
              <Menu className="h-5 w-5 text-gray-700 dark:text-gray-200" />
            </button>

            <button
              onClick={toggleTheme}
              type="button"
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Globe className="h-4 w-4" />
              <span>Live Data</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
        </div>

        {mobileMenuOpen && navLinks.length > 0 && (
          <div className="lg:hidden mb-4">
            <nav className="flex flex-col space-y-2 text-sm font-medium">
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md transition-colors ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}

        {showFilters && filters && (
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Horizon</label>
              <div className="flex space-x-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                {timeframes.map(timeframe => (
                  <button
                    key={timeframe.value}
                    type="button"
                    onClick={() => filters.setSelectedTimeframe(timeframe.value as Timeframe)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      filters.selectedTimeframe === timeframe.value
                        ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                    }`}
                  >
                    {timeframe.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Stablecoin Lens</label>
              <select
                value={filters.selectedStablecoin}
                onChange={event => filters.setSelectedStablecoin(event.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                {stablecoins.map(coin => (
                  <option key={coin.value} value={coin.value}>
                    {coin.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

