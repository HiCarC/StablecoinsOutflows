import { useState, useEffect } from 'react';

interface StablecoinFlow {
  source: string;
  target: string;
  value: number;
  percentage: number;
}

interface StablecoinData {
  flows: StablecoinFlow[];
  totalValue: number;
  lastUpdated: string;
}


export function useStablecoinData(timeframe: string, selectedStablecoin: string) {
  const [data, setData] = useState<StablecoinData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // For now, we'll use mock data that simulates real stablecoin flows
        // In production, this would integrate with APIs like DeFiLlama, CoinGecko, etc.
        const mockData = generateMockData(timeframe, selectedStablecoin);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setData(mockData);
      } catch (err) {
        setError('Failed to fetch stablecoin data');
        console.error('Error fetching stablecoin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [timeframe, selectedStablecoin]);

  return { data, loading, error };
}

function generateMockData(timeframe: string, selectedStablecoin: string): StablecoinData {
  // Base stablecoins and protocols for realistic data
  const stablecoins = ['USDT', 'USDC', 'DAI', 'BUSD', 'TUSD'];
  const protocols = [
    'Aave V3', 'Compound V3', 'Uniswap V3', 'Curve Finance', 
    'Yearn Finance', 'MakerDAO', 'Lido', 'Convex Finance',
    'Balancer', 'SushiSwap', '1inch', 'PancakeSwap'
  ];

  // Filter stablecoins based on selection
  const filteredStablecoins = selectedStablecoin === 'all' 
    ? stablecoins 
    : [selectedStablecoin];

  // Generate flows based on timeframe
  const flows: StablecoinFlow[] = [];
  let totalValue = 0;

  // Base multiplier for different timeframes
  const timeframeMultipliers: { [key: string]: number } = {
    '1h': 0.1,
    '24h': 1,
    '7d': 7,
    '30d': 30
  };

  const multiplier = timeframeMultipliers[timeframe] || 1;

  // Generate realistic flow data
  filteredStablecoins.forEach(stablecoin => {
    protocols.forEach(protocol => {
      // Random chance of having a flow (not all combinations exist)
      if (Math.random() > 0.3) {
        // Base value ranges by stablecoin and protocol popularity
        const baseValue = getBaseValue(stablecoin, protocol) * multiplier;
        const randomFactor = 0.5 + Math.random(); // 0.5 to 1.5
        const value = baseValue * randomFactor;
        
        if (value > 1000) { // Only include significant flows
          flows.push({
            source: String(stablecoin),
            target: String(protocol),
            value: Number(value),
            percentage: 0 // Will be calculated below
          });
          totalValue += value;
        }
      }
    });
  });

  // Calculate percentages
  flows.forEach(flow => {
    flow.percentage = (flow.value / totalValue) * 100;
  });

  // Sort by value descending
  flows.sort((a, b) => b.value - a.value);

  return {
    flows,
    totalValue,
    lastUpdated: new Date().toISOString()
  };
}

function getBaseValue(stablecoin: string, protocol: string): number {
  // Base values in USD
  const stablecoinBases: { [key: string]: number } = {
    'USDT': 500000000, // $500M base
    'USDC': 400000000, // $400M base
    'DAI': 200000000,  // $200M base
    'BUSD': 100000000, // $100M base
    'TUSD': 50000000   // $50M base
  };

  const protocolMultipliers: { [key: string]: number } = {
    'Aave V3': 1.5,
    'Compound V3': 1.3,
    'Uniswap V3': 2.0,
    'Curve Finance': 1.8,
    'Yearn Finance': 1.2,
    'MakerDAO': 1.4,
    'Lido': 1.6,
    'Convex Finance': 1.1,
    'Balancer': 0.8,
    'SushiSwap': 0.9,
    '1inch': 0.7,
    'PancakeSwap': 1.0
  };

  const baseValue = stablecoinBases[stablecoin] || 100000000;
  const multiplier = protocolMultipliers[protocol] || 1.0;

  return baseValue * multiplier;
}

// Future implementation for real API integration
// async function fetchRealData(): Promise<StablecoinData> {
//   // This would integrate with real APIs like:
//   // - DeFiLlama API for TVL data
//   // - CoinGecko API for market data
//   // - Blockchain explorers (Etherscan, etc.) for transaction data
//   // - DEX aggregators for swap data
//   
//   const defillamaAPI = 'https://api.llama.fi/protocols';
//   const coingeckoAPI = 'https://api.coingecko.com/api/v3';
//   
//   // Example implementation:
//   // const response = await fetch(defillamaAPI);
//   // const protocols = await response.json();
//   
//   // Process and transform the data...
//   
//   throw new Error('Real API integration not implemented yet');
// }
