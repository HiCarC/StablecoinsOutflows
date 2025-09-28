import { Link } from 'react-router-dom';
import { ArrowRight, Network, Building2, Workflow, Globe2, CreditCard } from 'lucide-react';
import { useCases } from '../data/useCases';

function formatTrillions(value: number): string {
  return `US$${value.toFixed(1)} T`;
}

const ICON_MAP = {
  defi: Network,
  exchange: Building2,
  mev: Workflow,
  crossBorder: Globe2,
  payments: CreditCard,
} as const;

export function DashboardPage() {
  const totalTrackedVolume = useCases.reduce((sum, useCase) => sum + useCase.annualisedVolumeUsdTrillions, 0);

  return (
    <section className="space-y-10">
      <header className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-3xl space-y-4">
            <p className="text-sm uppercase tracking-wider text-blue-600 dark:text-blue-400 font-semibold">Supervisory overview</p>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              Stablecoin flows: quantifying where digital dollars concentrate after issuance
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
              The Artemis, BCG and McKinsey datasets converge on the same conclusion: trading and liquidity provisioning dominate stablecoin utility. This landing view provides the supervisory context?how much value settles in each use case, the operational risks attached, and where to drill down for detailed analytics, policy interpretation and protocol-level evidence.
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-xl px-6 py-4 max-w-xs">
            <p className="text-xs font-medium text-blue-700 dark:text-blue-300 uppercase tracking-wide">Tracked annual settlement*</p>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">{formatTrillions(totalTrackedVolume)}</p>
            <p className="text-[11px] text-blue-700/80 dark:text-blue-200/80 mt-2">
              *Artemis Analytics harmonised dataset (2025). Totals exclude fiat redemption legs.
            </p>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {useCases.map(useCase => {
          const Icon = ICON_MAP[useCase.icon];
          return (
            <article
              key={useCase.slug}
              className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 flex flex-col shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`absolute inset-x-0 h-1 rounded-t-2xl bg-gradient-to-r ${useCase.accentClass}`} />
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-xl bg-gray-100 dark:bg-gray-900/60">
                    <Icon className="h-6 w-6 text-gray-700 dark:text-gray-200" />
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{useCase.name}</h2>
                    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">{useCase.highlight}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Share of flows</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{useCase.shareOfVolumePercent.toFixed(1)}%</p>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                {useCase.summary}
              </p>

              <div className="grid grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300 mb-4">
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                  <p className="text-[11px] font-semibold uppercase text-gray-500 dark:text-gray-400">Annualised volume</p>
                  <p className="text-base font-bold text-gray-900 dark:text-white">{formatTrillions(useCase.annualisedVolumeUsdTrillions)}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                  <p className="text-[11px] font-semibold uppercase text-gray-500 dark:text-gray-400">Key signal</p>
                  <p className="text-sm text-gray-700 dark:text-gray-200">{useCase.metrics[0]?.context ?? 'Dataset insight'}</p>
                </div>
              </div>

              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300 flex-1">
                {useCase.insightBullets.slice(0, 2).map((bullet, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400 flex-shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6">
                <Link
                  to={useCase.route}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  Explore detail
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <footer className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-sm text-gray-600 dark:text-gray-300">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide mb-3">Supervisory framing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Trading still dwarfs real economy use</p>
            <p>
              BCG and McKinsey estimate that more than three quarters of all stablecoin turnover serves trading, market-making and arbitrage. Payments and remittances remain below 3% of global stablecoin settlement, highlighting the gap between narrative and adoption.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100 mb-2">DeFi liquidity risks are systemic</p>
            <p>
              Half of tracked flow concentrates in composable DeFi venues. Supervisors should monitor collateral quality, oracle dependencies and bridge exposures that could impair redemption windows during stress.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100 mb-2">Regulation shapes the trajectory</p>
            <p>
              The GENIUS Act, MiCA and Asian licensing regimes will decide how quickly payment-grade stablecoins scale. Clear reserve rules could unlock bank-issued tokens, pushing payments share higher over the medium term.
            </p>
          </div>
        </div>
      </footer>
    </section>
  );
}
