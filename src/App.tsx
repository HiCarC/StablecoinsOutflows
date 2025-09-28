import { useMemo, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { DashboardPage } from './pages/DashboardPage';
import { UseCaseDetailPage } from './pages/UseCaseDetailPage';
import { useCases } from './data/useCases';
import type { StablecoinTimeframe } from './types/stablecoin';

function AppShell() {
  const [selectedTimeframe, setSelectedTimeframe] = useState<StablecoinTimeframe>('24h');
  const [selectedStablecoin, setSelectedStablecoin] = useState<string>('all');

  const navLinks = useMemo(
    () => [
      { to: '/', label: 'Overview' },
      ...useCases.map(useCase => ({ to: useCase.route, label: useCase.name })),
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header navLinks={navLinks} />

      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route
            path="/use-cases/:slug"
            element={
              <UseCaseDetailPage
                selectedTimeframe={selectedTimeframe}
                selectedStablecoin={selectedStablecoin}
                onTimeframeChange={setSelectedTimeframe}
                onStablecoinChange={setSelectedStablecoin}
              />
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppShell />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
