import { useState } from 'react';
import { SankeyDiagram } from './components/SankeyDiagram';
import { MetricsPanel } from './components/MetricsPanel';
import { Header } from './components/Header';
import { DataTable } from './components/DataTable';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useStablecoinData } from './hooks/useStablecoinData';
import { ThemeProvider } from './contexts/ThemeContext';
import './App.css';

function App() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [selectedStablecoin, setSelectedStablecoin] = useState<string>('all');
  const [diagramHeight, setDiagramHeight] = useState<number>(500);
  const { data, loading, error } = useStablecoinData(selectedTimeframe, selectedStablecoin);
  const lastUpdatedLabel = data?.lastUpdated
    ? new Date(data.lastUpdated).toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZoneName: 'short',
      })
    : null;

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header
          selectedTimeframe={selectedTimeframe}
          setSelectedTimeframe={setSelectedTimeframe}
          selectedStablecoin={selectedStablecoin}
          setSelectedStablecoin={setSelectedStablecoin}
        />

        <main className="container mx-auto px-4 py-8">
          {/* Metrics Overview */}
          <MetricsPanel data={data} loading={loading} />

          {/* Sankey Diagram */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Stablecoin Flow Visualization
            </h2>
            <div className="overflow-hidden" style={{ height: `${diagramHeight}px` }}>
              <SankeyDiagram
                data={data?.flows || []}
                loading={loading}
                error={error}
                onHeightChange={setDiagramHeight}
              />
            </div>
            {(data?.metadata?.provider || lastUpdatedLabel) && (
              <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-2">
                {lastUpdatedLabel && <span>Snapshot captured {lastUpdatedLabel}</span>}
                {data?.metadata?.provider && <span>Source: {data.metadata.provider}</span>}
              </div>
            )}
          </div>

          {/* Data Table */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Detailed Flow Analysis
            </h2>
            <ErrorBoundary>
              <DataTable
                data={
                  data?.flows?.filter(
                    flow => flow && typeof flow.source === 'string' && typeof flow.target === 'string',
                  ) || []
                }
                loading={loading}
                totalValue={data?.totalValue || 0}
              />
            </ErrorBoundary>
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
