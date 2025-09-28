import { Link, useParams } from 'react-router-dom';
import { useCaseMap } from '../data/useCases';
import { DefiProtocolsDetail } from './usecases/DefiProtocolsDetail';
import { StaticUseCaseDetail } from './usecases/StaticUseCaseDetail';
import type { StablecoinTimeframe } from '../types/stablecoin';

interface UseCaseDetailPageProps {
  selectedTimeframe: StablecoinTimeframe;
  selectedStablecoin: string;
  onTimeframeChange: (timeframe: StablecoinTimeframe) => void;
  onStablecoinChange: (stablecoin: string) => void;
}

export function UseCaseDetailPage({
  selectedTimeframe,
  selectedStablecoin,
  onTimeframeChange,
  onStablecoinChange,
}: UseCaseDetailPageProps) {
  const { slug } = useParams();
  const useCase = slug ? useCaseMap.get(slug) : undefined;

  if (!useCase) {
    return (
      <section className="flex flex-col items-start gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Use case not found</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          The requested use case is not registered in the supervisory taxonomy. Please return to the dashboard to select a valid view.
        </p>
        <Link
          to="/"
          className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
        >
          Back to dashboard
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <nav className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
        <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 font-medium">Overview</Link>
        <span>/</span>
        <span>{useCase.name}</span>
      </nav>

      {useCase.type === 'defi' ? (
        <DefiProtocolsDetail
          useCase={useCase}
          selectedTimeframe={selectedTimeframe}
          selectedStablecoin={selectedStablecoin}
          onTimeframeChange={onTimeframeChange}
          onStablecoinChange={onStablecoinChange}
        />
      ) : (
        <StaticUseCaseDetail useCase={useCase} />
      )}
    </div>
  );
}
