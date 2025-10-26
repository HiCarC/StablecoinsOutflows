import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Building2,
  CreditCard,
  Globe2,
  Network,
  Workflow,
  Sparkles,
  ShieldCheck,
  Globe,
} from 'lucide-react';
import { CategorySankey, type CategorySankeyItem } from '../components/CategorySankey';
import { useCases } from '../data/useCases';

const ICON_MAP = {
  defi: Network,
  exchange: Building2,
  mev: Workflow,
  crossBorder: Globe2,
  payments: CreditCard,
} as const;

const CATEGORY_BADGE_CLASSES: Record<string, string> = {
  'defi-protocols': 'bg-indigo-950/60 text-indigo-100 border border-indigo-400/40',
  'centralised-exchanges': 'bg-blue-800/60 text-blue-50 border border-blue-300/40',
  'mev-arbitrage': 'bg-sky-600/60 text-sky-50 border border-sky-200/40',
  'cross-border': 'bg-emerald-700/60 text-emerald-50 border border-emerald-300/50',
  payments: 'bg-emerald-500/60 text-emerald-50 border border-emerald-200/50',
};

const TRADING_SLUGS = new Set(['defi-protocols', 'centralised-exchanges', 'mev-arbitrage']);

function formatTrillions(value: number): string {
  return `US$${value.toFixed(1)}T`;
}

function formatSettlement(value: number): string {
  if (value >= 1) {
    return `US$${value.toFixed(1)}T`;
  }
  return `US$${(value * 1000).toFixed(0)}B`;
}

export function DashboardPage() {
  const categories = useMemo<CategorySankeyItem[]>(() => {
    return useCases.map(useCase => ({
      slug: useCase.slug,
      name: useCase.name,
      share: useCase.shareOfVolumePercent,
      annualisedVolume: useCase.annualisedVolumeUsdTrillions,
      isTrading: TRADING_SLUGS.has(useCase.slug),
    }));
  }, []);

  const totalTrackedVolume = useMemo(
    () => useCases.reduce((sum, useCase) => sum + useCase.annualisedVolumeUsdTrillions, 0),
    [],
  );

  const tradingShare = categories
    .filter(item => item.isTrading)
    .reduce((sum, item) => sum + item.share, 0);
  const realEconomyShare = 100 - tradingShare;
  const tradingVolume = categories
    .filter(item => item.isTrading)
    .reduce((sum, item) => sum + item.annualisedVolume, 0);
  const realEconomyVolume = totalTrackedVolume - tradingVolume;

  return (
    <section className="space-y-10">
      <header className="relative overflow-hidden rounded-3xl border border-slate-300/40 dark:border-slate-700/60 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white shadow-xl">
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(99,102,241,0.35),_transparent_60%)]"
          aria-hidden
        />
        <div className="relative px-8 py-10 md:px-12 md:py-14">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-10">
            {/* Left text block */}
            <div className="max-w-3xl space-y-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-blue-100">
                <ShieldCheck className="h-4 w-4" />
                Overview
              </span>
              <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                Stablecoin flow intelligence for prudential financial stability
              </h1>
              <p className="text-base md:text-lg text-slate-200 leading-relaxed">
                The report shows that digital dollars overwhelmingly circulate inside trading
                infrastructure. DeFi protocol liquidity, centralised exchanges and MEV activity
                together account for {tradingShare.toFixed(1)} % of observed settlement, while
                cross-border transfers and payments represent the remaining{' '}
                {realEconomyShare.toFixed(1)} %.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-200">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                  <Sparkles className="h-4 w-4" />
                  Data harmonised from Artemis, BCG, McKinsey and Visa Onchain
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1">
                  Trading lanes dominate ({formatSettlement(tradingVolume)} vs{' '}
                  {formatSettlement(realEconomyVolume)} real economy)
                </span>
              </div>
            </div>

            {/* Right stacked cards */}
            <div className="flex flex-col items-center gap-4">
              {/* First card */}
              <div className="w-full rounded-2xl border border-white/15 bg-white/10 px-8 py-6 text-center backdrop-blur">
                <p className="text-xs uppercase tracking-wide text-blue-100/80">
                  Reported annual settlement
                </p>
                <p className="mt-2 text-4xl font-semibold">
                  {formatTrillions(totalTrackedVolume)}
                </p>
                <p className="mt-3 text-[11px] leading-5 text-blue-100/70">
                  Harmonised snapshot combining 2024/25 datasets. Figures remain static until the
                  next report iteration.
                </p>
              </div>

              {/* Second card */}
              <div className="w-full rounded-2xl border border-white/15 bg-white/10 px-8 py-6 text-center backdrop-blur">
              <p className="text-xs uppercase tracking-wide text-blue-100/80">EUR denominated stablecoins</p>
              <p className="mt-2 text-4xl font-semibold">&lt;0.16%</p>
              <p className="mt-3 text-[11px] leading-5 text-blue-100/70">~$477M, 2nd after USD (Oct 2025)</p>
            </div>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Reported flow distribution</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Only the DeFi Protocol Liquidity page provides live telemetry. All other data is static from published datasets.
            </p>
          </div>
          <div className="px-4 py-6">
            <CategorySankey categories={categories} />
          </div>
        </div>
        <div className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Trading versus real economy</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Static view anchored in the published dataset.</p>
          </div>
          <div className="px-6 py-6 space-y-5">
            <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-4 dark:border-blue-900/50 dark:bg-blue-900/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-800 dark:text-blue-200">Trading use-case share</p>
              <p className="mt-1 text-2xl font-semibold text-blue-900 dark:text-blue-100">{tradingShare.toFixed(1)} %</p>
              <p className="mt-1 text-[11px] text-blue-800/80 dark:text-blue-200/70">Includes DeFi protocols, centralised exchanges and MEV activity ({formatSettlement(tradingVolume)} annualised).</p>
            </div>
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 dark:border-emerald-900/50 dark:bg-emerald-900/20">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-200">Real-economy share</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-900 dark:text-emerald-100">{realEconomyShare.toFixed(1)} %</p>
              <p className="mt-1 text-[11px] text-emerald-800/80 dark:text-emerald-200/80">Cross-border transfers and payments channels ({formatSettlement(realEconomyVolume)} annualised).</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 dark:border-slate-800 dark:bg-slate-900/40">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-600 dark:text-slate-300">Takeaway</p>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                Trading infrastructure remains the systemic dependency; real-economy usage is material but comparatively small. Focus prudential reviews on liquidity management at trading venues while cultivating compliant rails for payments and remittances.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {useCases.map(useCase => {
          const Icon = ICON_MAP[useCase.icon];
          const isTrading = TRADING_SLUGS.has(useCase.slug);
          const badgeClasses = CATEGORY_BADGE_CLASSES[useCase.slug] ?? 'bg-slate-200 text-slate-900';
          return (
            <article
              key={useCase.slug}
              className="group relative overflow-hidden rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className={`absolute inset-0 opacity-90 transition-opacity group-hover:opacity-100 bg-gradient-to-br ${useCase.accentClass}`} aria-hidden />
              <div className="relative h-full p-6 text-white flex flex-col gap-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="rounded-xl bg-white/15 p-3">
                      <Icon className="h-6 w-6" />
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold tracking-tight">{useCase.name}</h2>
                        {useCase.slug === 'defi-protocols' && (
                          <div className="flex items-center gap-1.5 text-sm text-green-300">
                            <Globe className="h-4 w-4" />
                            <span className="font-semibold">Live</span>
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                          </div>
                        )}
                      </div>
                      <p className="text-xs uppercase tracking-wide text-white/80">{useCase.highlight}</p>
                    </div>
                  </div>
                  <div className="text-right text-xs font-semibold uppercase tracking-wide space-y-2">
                    <span className={`inline-flex rounded-full px-2 py-1 ${badgeClasses}`}>
                      {isTrading ? 'Trading' : 'Real economy'}
                    </span>
                    <p className="text-2xl font-semibold">{useCase.shareOfVolumePercent.toFixed(1)}%</p>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-white/85">{useCase.summary}</p>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-white/10 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-white/70">Annualised volume</p>
                    <p className="text-base font-semibold">{formatSettlement(useCase.annualisedVolumeUsdTrillions)}</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wide text-white/70">Share of flows</p>
                    <p className="text-base font-semibold">{useCase.shareOfVolumePercent.toFixed(1)}%</p>
                  </div>
                </div>

                <ul className="space-y-2 text-sm text-white/85">
                  {useCase.insightBullets.slice(0, 2).map((bullet, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <Link
                    to={useCase.route}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                  >
                    Explore detail
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <section className="rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Framing</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">Policy narratives tied to the static flow distribution.</p>
        </div>
        <div className="px-6 py-6 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 dark:border-blue-900/40 dark:bg-blue-900/20">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Trading still dwarfs real economy use</p>
            <p className="text-sm text-blue-900/90 dark:text-blue-100/90 leading-relaxed">
              Reported data shows trading, market-making and arbitrage absorbing nearly {tradingShare.toFixed(1)} % of stablecoin settlement. Payments and remittances remain a thin layer despite rapid growth.
            </p>
          </div>
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 dark:border-blue-900/40 dark:bg-blue-900/20">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">DeFi and CEX venues remain systemic</p>
            <p className="text-sm text-blue-900/90 dark:text-blue-100/90 leading-relaxed">
              To assess the systemic risk, it would be useful to monitor the collateral quality, oracle dependencies and operational resilience at DeFi protocols and centralised exchanges where the majority of settlement concentrates.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 dark:border-emerald-900/40 dark:bg-emerald-900/20">
            <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100 mb-2">Real-economy rails need policy support</p>
            <p className="text-sm text-emerald-900/90 dark:text-emerald-100/90 leading-relaxed">
              Cross-border transfer and payments adoption is measurable but modest. Regulatory clarity (MiCA, GENIUS Act, Asian regimes) is essential to scale compliant stablecoin payments.
            </p>
          </div>
        </div>
      </section>

      <section className="relative rounded-3xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-yellow-200/40 via-amber-700/30 to-amber-950/40 text-white shadow-lg">
  {/* Overlay for legibility */}
  <div className="absolute inset-0 rounded-3xl bg-black/25" aria-hidden="true" />

  <div className="relative flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
    <div className="space-y-4">
      <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/30 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/90">
        <Sparkles className="h-4 w-4" />
        Supervisory telemetry
      </span>
      <h2 className="text-2xl font-semibold tracking-tight text-white">
        Live monitoring of stablecoins
      </h2>
      <p className="text-sm leading-relaxed text-gray-200">
        The Cambridge Centre for Alternative Finance maintains a regulator-grade dashboard for tracking the health of global stablecoins. Is a perfect complement to understand and monitor with live risk analytics designed for supervisors and central bankers.
      </p>
      <ul className="space-y-2 text-sm text-gray-200">
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/80" />
          <span>Real-time peg surveillance across major tokens with configurable alert thresholds.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/80" />
          <span>Statistical tooling to quantify drawdowns, recovery velocity and de-peg scenarios.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/80" />
          <span>Comparative dashboards tracking issuance momentum and market share shifts across issuers.</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-white/80" />
          <span>Reserve composition analytics highlighting changes in backing quality and liquidity buffers.</span>
        </li>
      </ul>
    </div>
    <a
      href="https://ccaf.io/cdmd/risks-and-protections"
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-full bg-amber-600/30 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-600/50"
    >
      Cambridge Digital Money Dashboard
      <ArrowRight className="h-7 w-7" />
    </a>
  </div>
</section>





    </section>
  );
}



