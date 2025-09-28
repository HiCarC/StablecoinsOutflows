export type UseCaseType = 'defi' | 'static';

export interface UseCaseMetric {
  label: string;
  value: string;
  context: string;
}

export interface UseCaseNarrativeSection {
  title: string;
  paragraphs: string[];
}

export interface UseCaseSource {
  label: string;
  url: string;
}

export interface PaymentBreakdownItem {
  label: string;
  runRateUsdBillions: number;
  shareOfPayments: number;
  shareOfTotalVolume: number;
}

export interface UseCaseDefinition {
  slug: string;
  name: string;
  route: string;
  headline: string;
  summary: string;
  type: UseCaseType;
  shareOfVolumePercent: number;
  annualisedVolumeUsdTrillions: number;
  highlight: string;
  insightBullets: string[];
  metrics: UseCaseMetric[];
  narrative: UseCaseNarrativeSection[];
  sources: UseCaseSource[];
  paymentBreakdown?: PaymentBreakdownItem[];
  accentClass: string;
  icon: 'defi' | 'exchange' | 'mev' | 'crossBorder' | 'payments';
}

export const useCases: UseCaseDefinition[] = [
  {
    slug: 'defi-protocols',
    name: 'DeFi Protocol Liquidity',
    route: '/use-cases/defi-protocols',
    headline: 'Protocols remain the primary sink for circulating stablecoins, underwriting leverage, swaps and structured yields.',
    summary:
      'Roughly half of on-chain stablecoin value rotates through lending markets, automated market makers and structured vaults. These venues consume US$7.8 trillion of stablecoin settlement annually, enabling leverage, liquidity provisioning and risk transfer for the wider crypto ecosystem.',
    type: 'defi',
    shareOfVolumePercent: 49.7,
    annualisedVolumeUsdTrillions: 7.8,
    highlight: 'Deepest liquidity engine for digital dollars',
    insightBullets: [
      'Artemis Analytics shows lending, AMM and yield protocols process almost US$8 trillion of stablecoin settlement per year, dwarfing other on-chain use cases.',
      'Keyrock reports stablecoins contributing 30.8% of aggregate DeFi protocol revenue in 2025, up from just 4.7% at the 2024 trough.',
      'Lending protocols captured 65% of stablecoin revenue in 2023 but AMMs narrowed the gap to 15% vs 11% by mid-2025 as volume returned to Layer-2 liquidity venues.',
    ],
    metrics: [
      {
        label: 'Share of tracked volume',
        value: '49.7 %',
        context: 'Artemis on-chain dataset covering major stablecoins in 2024/25.',
      },
      {
        label: 'Annualised settlement',
        value: 'US$7.8 T',
        context: 'DeFi pool inflows and outflows harmonised across DEX, lending and yield aggregators.',
      },
      {
        label: 'Revenue contribution',
        value: '30.8 %',
        context: 'Share of total DeFi protocol fees attributable to stablecoin-denominated activity (Keyrock, 2025).',
      },
    ],
    narrative: [
      {
        title: 'Liquidity backbone for digital assets',
        paragraphs: [
          'DeFi protocols recycle stablecoins across lending pools, derivatives collateral and automated market makers. The scale of flows reflects the demand for synthetic dollars to underwrite leverage and market-making. Large treasuries and professional market makers provide liquidity across Layer-1 and Layer-2 venues, using stablecoins as operational capital.',
          'Stablecoin velocity within DeFi is amplified by composability: the same token leg can be rehypothecated across lending markets, AMM pools and structured vaults. This loop explains the high share of settlement relative to unique users. Regulatory supervision therefore focuses on collateral quality, oracle governance and liquidity management.',
        ],
      },
      {
        title: 'Risk considerations for supervisors',
        paragraphs: [
          'Stress in DeFi protocols propagates instantly to stablecoin liquidity. Supervisors monitor collateral mix, utilisation ratios and cross-protocol dependencies to detect fragility. Circuit breakers and dynamic fee switches on leading protocols have reduced reflexivity, but liquidity remains procyclical.',
          'The supervisory objective is to map critical DeFi venues (Aave, Maker, Curve, Uniswap v3/v4, Pendle, Morpho) and quantify their reliance on specific stablecoins. Cross-chain bridges and L2 sequencers add operational dependencies that must be folded into prudential assessments.',
        ],
      },
    ],
    sources: [
      { label: 'Artemis Analytics ? Stablecoin payments from the ground up (2025)', url: 'reports.artemisanalytics.com' },
      { label: 'Keyrock ? Stablecoin revenue share (2025)', url: 'keyrock.com' },
      { label: 'Visa Onchain Analytics ? 2024 dataset', url: 'visaonchainanalytics.com' },
    ],
    accentClass: 'from-blue-500 via-sky-500 to-cyan-500',
    icon: 'defi',
  },
  {
    slug: 'centralised-exchanges',
    name: 'Centralised Exchange Liquidity',
    route: '/use-cases/centralised-exchanges',
    headline: 'Centralised exchanges remain the core distribution rail for stablecoins, intermediating fiat ramps and crypto trading.',
    summary:
      'CEX platforms capture US$4.3 trillion of annualised stablecoin settlement, acting as gateways between banking rails and on-chain liquidity. They underpin arbitrage, express price discovery and institutional access, even as DeFi share expands.',
    type: 'static',
    shareOfVolumePercent: 27.4,
    annualisedVolumeUsdTrillions: 4.3,
    highlight: 'Primary on/off-ramps for stablecoin liquidity',
    insightBullets: [
      'Visa Onchain attributes 41% of adjusted stablecoin flow to CEX interactions, underscoring persistent reliance on intermediated order books.',
      'BCG estimates that roughly 88% of overall stablecoin usage is trading-related, with centralised venues accounting for three quarters of that activity.',
      'Institutional desks maintain large intraday stablecoin balances on CEXs to support perpetual futures and basis trades, recycling flow back to DeFi when yields are attractive.',
    ],
    metrics: [
      {
        label: 'Share of tracked volume',
        value: '27.4 %',
        context: 'Artemis dataset ? centralised exchange category.',
      },
      {
        label: 'Annualised settlement',
        value: 'US$4.3 T',
        context: 'Net deposits and withdrawals between wallets and exchange clusters.',
      },
      {
        label: 'Trading share',
        value: '~75 % of total',
        context: 'Combined BCG and a16z estimates for CEX vs DEX spot activity (2025).',
      },
    ],
    narrative: [
      {
        title: 'Market structure implications',
        paragraphs: [
          'Stablecoins provide the base collateral for crypto derivatives and spot trading pairs across Binance, OKX, Coinbase and Bybit. Order-book liquidity in USDT and USDC enables rapid hedging and basis trades, while internal transfers support cross-exchange arbitrage.',
          'From a supervisory lens, exchange concentration represents a single point of failure for settlement finality. Monitoring cold-wallet attestations, proof-of-reserve disclosures and fiat redemption channels remains essential for systemic oversight.',
        ],
      },
      {
        title: 'Linkages with TradFi liquidity',
        paragraphs: [
          'Large exchanges have integrated with prime brokers and banking correspondents to support stablecoin issuance and redemption. Sudden restrictions on fiat rails (e.g., USD banking access) can therefore cascade across the stablecoin ecosystem, tightening spreads and reducing exchange liquidity.',
        ],
      },
    ],
    sources: [
      { label: 'Visa Onchain Analytics (2024)', url: 'visaonchainanalytics.com' },
      { label: 'Boston Consulting Group ? Stablecoins: five killer tests (2025)', url: 'media-publications.bcg.com' },
      { label: 'a16z State of Crypto (2025)', url: 'a16zcrypto.com' },
    ],
    accentClass: 'from-amber-500 via-orange-500 to-rose-500',
    icon: 'exchange',
  },
  {
    slug: 'mev-arbitrage',
    name: 'MEV & Arbitrage Bots',
    route: '/use-cases/mev-arbitrage',
    headline: 'Validator strategies and searcher bots recycle stablecoins to arbitrage inefficiencies across chains and liquidity venues.',
    summary:
      'Miner-extractable value (MEV) represents US$1.9 trillion of stablecoin settlement annually. Searchers continuously borrow and repay stablecoins to capture sandwich, liquidation and cross-venue arbitrage opportunities, particularly on Ethereum rollups.',
    type: 'static',
    shareOfVolumePercent: 12.1,
    annualisedVolumeUsdTrillions: 1.9,
    highlight: 'Latency-sensitive recycling of stablecoins for strategy execution',
    insightBullets: [
      'Artemis attributes 12% of tracked stablecoin flows to MEV activity, concentrated on Ethereum mainnet and rollups with transparent mempools.',
      'MEV-induced bursts can destabilise prices and increase gas volatility, impacting retail settlement reliability.',
      'Protocol-level mitigations (PBS, inclusion lists, mev-boost) seek to limit harmful externalities without removing arbitrage liquidity.',
    ],
    metrics: [
      {
        label: 'Share of tracked volume',
        value: '12.1 %',
        context: 'Artemis on-chain classification (2024/25).',
      },
      {
        label: 'Annualised settlement',
        value: 'US$1.9 T',
        context: 'Stablecoin legs inside MEV bundles and liquidations.',
      },
      {
        label: 'Network concentration',
        value: 'Ethereum + rollups',
        context: 'MEV opportunities largest where transparent mempools exist.',
      },
    ],
    narrative: [
      {
        title: 'Operational profile',
        paragraphs: [
          'Searchers maintain inventories of USDT and USDC across bundles of smart contracts. They borrow stablecoins from flash-loan providers or DeFi pools, execute arbitrage trades and repay capital within the same block. This creates high gross settlement figures despite minimal end-of-day balances.',
          'Supervisors track MEV patterns to evaluate fairness of transaction ordering and identify points where stablecoin liquidity might evaporate during congestion events.',
        ],
      },
      {
        title: 'Mitigation levers',
        paragraphs: [
          'Mechanism design responses?proposer-builder separation, encrypted mempools, and inclusion lists?aim to limit negative externalities while preserving the liquidity benefits MEV searchers deliver to DeFi markets.',
        ],
      },
    ],
    sources: [
      { label: 'Artemis Analytics (2025)', url: 'reports.artemisanalytics.com' },
      { label: 'Flashbots research ? MEV landscape', url: 'flashbots.net' },
    ],
    accentClass: 'from-fuchsia-500 via-purple-500 to-indigo-500',
    icon: 'mev',
  },
  {
    slug: 'cross-border',
    name: 'Cross-Border Transfers',
    route: '/use-cases/cross-border',
    headline: 'Stablecoins provide near-instant settlement for corridors underserved by traditional correspondent banking networks.',
    summary:
      'Cross-border stablecoin transfers account for roughly US$0.4 trillion in annual settlement. Usage spikes when the US dollar appreciates or when capital controls bind, highlighting their role as synthetic dollars for emerging markets.',
    type: 'static',
    shareOfVolumePercent: 2.6,
    annualisedVolumeUsdTrillions: 0.4,
    highlight: 'Synthetic dollar rails for emerging-market users',
    insightBullets: [
      'IMF research finds North America recorded US$633 billion of stablecoin flows in 2024, with net outflows towards Asia-Pacific and other regions.',
      'BIS monitoring shows quarterly cross-border trading volumes for USDT and USDC topping US$400 billion during USD appreciation phases.',
      'Regional adoption is highest in LatAm and MEA relative to GDP, signalling use as a hedge against local currency volatility.',
    ],
    metrics: [
      {
        label: 'Share of tracked volume',
        value: '2.6 %',
        context: 'Artemis cross-border classification.',
      },
      {
        label: 'Annualised settlement',
        value: 'US$0.4 T',
        context: 'Cross-wallet transfers tagged to remittance corridors.',
      },
      {
        label: 'Regional leaders',
        value: 'LatAm & Africa',
        context: 'Flows represent 7.7% and 6.7% of regional GDP respectively (IMF 2025).',
      },
    ],
    narrative: [
      {
        title: 'Regulatory perimeter',
        paragraphs: [
          'Cross-border stablecoin corridors raise AML/CFT considerations. Supervisors assess VASP licensing, travel-rule compliance and the quality of fiat redemption partners supporting OTC brokers.',
          'In dollarised regions, authorities balance capital-control objectives with the efficiency gains of programmable cross-border money. Data-sharing frameworks with chain analytics firms help isolate illicit flows.',
        ],
      },
      {
        title: 'Infrastructure outlook',
        paragraphs: [
          'Payment companies are piloting stablecoin settlement networks with on/off-ramps in Asia-Pacific, LatAm and Africa. Partnerships with telecom operators and fintechs can extend reach beyond crypto-native audiences, but regulatory clarity is a prerequisite for scale.',
        ],
      },
    ],
    sources: [
      { label: 'IMF Working Paper ? Decrypting Crypto (2025)', url: 'imf.org' },
      { label: 'Bank for International Settlements ? Stablecoin monitoring', url: 'bis.org' },
      { label: 'Artemis Analytics (2025)', url: 'reports.artemisanalytics.com' },
    ],
    accentClass: 'from-emerald-500 via-teal-500 to-cyan-500',
    icon: 'crossBorder',
  },
  {
    slug: 'payments',
    name: 'Payments & Treasury',
    route: '/use-cases/payments',
    headline: 'Genuine commerce payments remain a small but fast-growing share of stablecoin usage, led by B2B settlement networks.',
    summary:
      'Payments use cases account for roughly US$1.3 trillion in annualised settlement?about 8% of the on-chain volume captured by Artemis. B2B flows dominate, with payroll, card-linked spending and remittances scaling as compliance-grade infrastructure matures.',
    type: 'static',
    shareOfVolumePercent: 8.3,
    annualisedVolumeUsdTrillions: 1.3,
    highlight: 'Early traction for programmable commerce rails',
    insightBullets: [
      'Artemis survey (2025) records US$94.2 billion of payments between Jan 2023 and Feb 2025, with a run rate of US$72.3 billion per year.',
      'B2B transactions represent 49.8% of observed payment volume; P2P and card-linked programmes follow at 24.9% and 18.3%.',
      'Despite growth, payments equal just 0.28% of total stablecoin settlement when benchmarked against BCG?s US$26.1 trillion volume estimate.',
    ],
    metrics: [
      {
        label: 'Share of tracked volume',
        value: '8.3 %',
        context: 'Artemis payments classification.',
      },
      {
        label: 'Annualised settlement',
        value: 'US$1.3 T',
        context: 'Includes B2B, P2P, card-linked, B2C payouts and prefunding.',
      },
      {
        label: 'Verified run rate',
        value: 'US$72.3 B',
        context: 'Artemis survey of 31 payment providers (Jan 2025).',
      },
    ],
    paymentBreakdown: [
      { label: 'B2B payments', runRateUsdBillions: 36.0, shareOfPayments: 49.8, shareOfTotalVolume: 0.14 },
      { label: 'P2P payments', runRateUsdBillions: 18.0, shareOfPayments: 24.9, shareOfTotalVolume: 0.07 },
      { label: 'Card-linked spend', runRateUsdBillions: 13.2, shareOfPayments: 18.3, shareOfTotalVolume: 0.05 },
      { label: 'B2C payouts', runRateUsdBillions: 3.3, shareOfPayments: 4.5, shareOfTotalVolume: 0.013 },
      { label: 'Prefunding float', runRateUsdBillions: 2.5, shareOfPayments: 3.5, shareOfTotalVolume: 0.010 },
    ],
    narrative: [
      {
        title: 'Commercial adoption patterns',
        paragraphs: [
          'Corporate treasurers experiment with stablecoins for just-in-time payouts and supplier settlement, particularly where treasury teams seek intraday finality. Payroll and gig-economy disbursements leverage stablecoins for weekend settlement and multi-currency coverage.',
          'Consumer-facing programmes remain niche but improving: card-linked wallets on Solana, Polygon and Base abstract crypto UX via stable-denominated rewards and spend controls.',
        ],
      },
      {
        title: 'Regulatory runway',
        paragraphs: [
          'MiCA licensing (EU) and state-level US frameworks will determine how quickly regulated institutions can launch stablecoin payment services. Requirements around reserve composition, capital buffers and redemption SLAs need harmonisation with card and ACH standards.',
          'Supervisors evaluate how stablecoin payment processors manage AML, sanctions screening and safeguarding of float. Collaboration with commercial banks is crucial to keep settlement flows anchored in supervised entities.',
        ],
      },
    ],
    sources: [
      { label: 'Artemis Analytics ? Payments survey (2025)', url: 'reports.artemisanalytics.com' },
      { label: 'Boston Consulting Group (2025)', url: 'media-publications.bcg.com' },
      { label: 'McKinsey ? Stablecoins as payment infrastructure (2025)', url: 'mckinsey.com' },
    ],
    accentClass: 'from-blue-600 via-indigo-500 to-slate-500',
    icon: 'payments',
  },
];

export const useCaseMap = new Map(useCases.map(useCase => [useCase.slug, useCase]));
