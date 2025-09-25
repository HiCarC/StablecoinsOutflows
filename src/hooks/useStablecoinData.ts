import { useEffect, useRef, useState } from 'react';
import { StablecoinData, StablecoinFlow, StablecoinTimeframe } from '../types/stablecoin';

const DEFI_LLAMA_YIELDS_ENDPOINT = 'https://yields.llama.fi/pools';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const FETCH_TIMEOUT_MS = 20 * 1000;

const CANONICAL_STABLECOINS = ['USDT', 'USDC', 'DAI', 'BUSD', 'TUSD'] as const;

type CanonicalStablecoin = typeof CANONICAL_STABLECOINS[number];

type LlamaPool = {
  chain: string;
  project: string;
  symbol: string;
  tvlUsd: number | string;
  volumeUsd1d: number | string | null;
  volumeUsd7d: number | string | null;
  stablecoin?: boolean;
  poolMeta?: string | null;
  underlyingTokens?: string[] | null;
};

interface PoolsCache {
  timestamp: number;
  pools: LlamaPool[];
}

const ADDRESS_CANONICAL_MAP: Record<CanonicalStablecoin, string[]> = {
  USDT: [
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
    '0x55d398326f99059ff775485246999027b3197955',
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    '0xdea80a6d3f9db8e3c06c7a9d59bffb9f8b4ef8ae',
    '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7',
    '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9',
    '0x38c3a5e9c3d0140c3f2a8b5f2da5d963b6dca1d8',
  ],
  USDC: [
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
    '0x2791bfd60d232150bff86b39b7146c0eaaa2ba81',
    '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
    '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4',
    '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e',
    '0x04068da6c83afcfa0e13ba15a6696662335d5b75',
  ],
  DAI: [
    '0x6b175474e89094c44da98b954eedeac495271d0f',
    '0x1af3f329e8bea43b0fdc1d7a2ee20978fd99c64d',
    '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1',
    '0x50c5725949a6f0c72e6c4a641f96e0d53687e15b',
    '0x861a83c8a4bd8c683b6cccf8bcffad5e215296fe',
  ],
  BUSD: [
    '0xe9e7cea3dedca5984780bafc599bd69add087d56',
    '0x4fabb145d64652a948d72533023f6e7a623c7c53',
    '0x97e2768e8e73511ca874545dc5ff8067eb19b787',
    '0x0b1f2c2af6c05f7a0d0a52d06b9a60b77a1bdc24',
  ],
  TUSD: [
    '0x0000000000085d4780b73119b644ae5ecd22b376',
    '0x8dd5fbce2f6a956c3022ba3663759011dd51e73e',
    '0x14016e85a25aeb13065688cafb43044c2ef86784',
    '0x4dca4d427511bc327639b6d8b17505b7603a2dfb',
  ],
};

const ADDRESS_LOOKUP = new Map<string, CanonicalStablecoin>();
CANONICAL_STABLECOINS.forEach(stable => {
  ADDRESS_CANONICAL_MAP[stable].forEach(address => {
    ADDRESS_LOOKUP.set(address.toLowerCase(), stable);
  });
});

function normalisePart(part: string): string {
  return part.replace(/[^a-z0-9]/gi, '').toUpperCase();
}

function toNumber(value: unknown): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }
  if (typeof value === 'string') {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

function inferStablecoinFromSymbol(symbol: string | null | undefined): CanonicalStablecoin | null {
  if (!symbol) {
    return null;
  }

  const candidates = symbol.split(/[-_+\/:\s]/).map(normalisePart).filter(Boolean);

  for (const candidate of candidates) {
    for (const stable of CANONICAL_STABLECOINS) {
      if (candidate === stable) {
        return stable;
      }
      if (candidate.endsWith(stable) && candidate.length <= stable.length + 3) {
        return stable;
      }
      if (candidate.startsWith(stable) && candidate.length <= stable.length + 3) {
        return stable;
      }
    }
  }

  const upperSymbol = symbol.toUpperCase();
  for (const stable of CANONICAL_STABLECOINS) {
    if (upperSymbol.includes(stable)) {
      return stable;
    }
  }

  return null;
}

function inferStablecoinFromAddresses(addresses: string[] | null | undefined): CanonicalStablecoin | null {
  if (!addresses?.length) {
    return null;
  }

  for (const address of addresses) {
    const match = ADDRESS_LOOKUP.get(address.toLowerCase());
    if (match) {
      return match;
    }
  }

  return null;
}

function identifyStablecoin(pool: LlamaPool): CanonicalStablecoin | null {
  const byAddress = inferStablecoinFromAddresses(pool.underlyingTokens);
  if (byAddress) {
    return byAddress;
  }

  if (pool.poolMeta) {
    const byMeta = inferStablecoinFromSymbol(pool.poolMeta);
    if (byMeta) {
      return byMeta;
    }
  }

  return inferStablecoinFromSymbol(pool.symbol);
}

function formatProtocolLabel(pool: LlamaPool): string {
  const project = pool.project.replace(/[-_]/g, ' ');
  const projectTitle = project.replace(/\b\w/g, char => char.toUpperCase());
  const chain = pool.chain.replace(/\b\w/g, char => char.toUpperCase());
  return `${projectTitle} (${chain})`;
}

function computeValueForTimeframe(pool: LlamaPool, timeframe: StablecoinTimeframe): number {
  const tvl = toNumber(pool.tvlUsd);
  const volume1d = toNumber(pool.volumeUsd1d);
  const volume7d = toNumber(pool.volumeUsd7d);

  switch (timeframe) {
    case '1h':
      if (volume1d > 0) return volume1d / 24;
      if (volume7d > 0) return volume7d / (7 * 24);
      return tvl / (30 * 24);
    case '24h':
      if (volume1d > 0) return volume1d;
      if (volume7d > 0) return volume7d / 7;
      return tvl / 30;
    case '7d':
      if (volume7d > 0) return volume7d;
      if (volume1d > 0) return volume1d * 7;
      return tvl / 4;
    case '30d':
    default:
      if (volume7d > 0) return volume7d * (30 / 7);
      if (volume1d > 0) return volume1d * 30;
      return tvl;
  }
}

function aggregateFlows(
  pools: LlamaPool[],
  timeframe: StablecoinTimeframe,
  stablecoinFilter: CanonicalStablecoin | null,
): StablecoinData {
  const totalsByStablecoin = new Map<CanonicalStablecoin, Map<string, number>>();

  pools.forEach(pool => {
    const stablecoin = identifyStablecoin(pool);
    if (!stablecoin) {
      return;
    }

    if (stablecoinFilter && stablecoin !== stablecoinFilter) {
      return;
    }

    const value = computeValueForTimeframe(pool, timeframe);
    if (!Number.isFinite(value) || value <= 0) {
      return;
    }

    const protocolLabel = formatProtocolLabel(pool);

    if (!totalsByStablecoin.has(stablecoin)) {
      totalsByStablecoin.set(stablecoin, new Map());
    }
    const protocolMap = totalsByStablecoin.get(stablecoin)!;
    protocolMap.set(protocolLabel, (protocolMap.get(protocolLabel) ?? 0) + value);
  });

  const flows: StablecoinFlow[] = [];

  totalsByStablecoin.forEach((protocolMap, stablecoin) => {
    protocolMap.forEach((value, protocol) => {
      flows.push({
        source: stablecoin,
        target: protocol,
        value,
        percentage: 0,
      });
    });
  });

  flows.sort((a, b) => b.value - a.value);

  const totalValue = flows.reduce((sum, flow) => sum + flow.value, 0);
  flows.forEach(flow => {
    flow.percentage = totalValue > 0 ? (flow.value / totalValue) * 100 : 0;
  });

  return {
    flows: flows.slice(0, 120),
    totalValue,
    lastUpdated: new Date().toISOString(),
    metadata: {
      provider: 'DeFiLlama Yields API',
      note: 'Aggregated stablecoin pool liquidity and reported volumes across protocols and chains.',
    },
  };
}

function mergeAbortSignals(signals: AbortSignal[]): AbortSignal {
  const controller = new AbortController();

  const onAbort = () => controller.abort();
  signals.forEach(signal => {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', onAbort, { once: true });
    }
  });

  return controller.signal;
}

async function fetchPools(externalSignal: AbortSignal): Promise<LlamaPool[]> {
  const timeoutController = new AbortController();
  const signal = mergeAbortSignals([externalSignal, timeoutController.signal]);
  const timeout = setTimeout(() => timeoutController.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(DEFI_LLAMA_YIELDS_ENDPOINT, {
      method: 'GET',
      signal,
    });

    if (!response.ok) {
      throw new Error(`DeFiLlama request failed with status ${response.status}`);
    }

    const payload = await response.json();
    if (!payload || !Array.isArray(payload.data)) {
      throw new Error('Unexpected response structure from DeFiLlama Yields API');
    }

    return payload.data as LlamaPool[];
  } finally {
    clearTimeout(timeout);
  }
}

export function useStablecoinData(timeframe: StablecoinTimeframe, selectedStablecoin: string) {
  const [data, setData] = useState<StablecoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<PoolsCache | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        let pools: LlamaPool[];
        const cache = cacheRef.current;
        const now = Date.now();

        if (cache && now - cache.timestamp < CACHE_TTL_MS) {
          pools = cache.pools;
        } else {
          pools = await fetchPools(controller.signal);
          cacheRef.current = { pools, timestamp: now };
        }

        if (controller.signal.aborted) {
          return;
        }

        const filterSymbol = selectedStablecoin.toUpperCase();
        const stablecoinFilter = filterSymbol === 'ALL'
          ? null
          : (CANONICAL_STABLECOINS.find(stable => stable === filterSymbol) ?? null);

        const snapshot = aggregateFlows(pools, timeframe, stablecoinFilter);

        if (!controller.signal.aborted) {
          setData(snapshot);
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') {
          return;
        }
        console.error('Error fetching stablecoin data', err);
        setError('Failed to load stablecoin flows from DeFiLlama');
        setData(null);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    load();

    const interval = setInterval(load, CACHE_TTL_MS);

    return () => {
      controller.abort();
      clearInterval(interval);
    };
  }, [timeframe, selectedStablecoin]);

  return { data, loading, error };
}
