export type StablecoinTimeframe = '1h' | '24h' | '7d' | '30d';

export interface StablecoinFlow {
  source: string;
  target: string;
  value: number;
  percentage: number;
}

export interface StablecoinData {
  flows: StablecoinFlow[];
  totalValue: number;
  lastUpdated: string;
  metadata?: {
    provider: string;
    note?: string;
  };
}
