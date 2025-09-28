# Supervisory Use-Case Taxonomy

The dashboard presents a fixed taxonomy of stablecoin use cases. Figures remain static until the dataset is re-issued.

| Slug | Display name | Share of tracked volume | Annualised settlement (US$T) | Classification | Primary sources |
| ---- | ------------- | ----------------------- | ---------------------------- | -------------- | --------------- |
| defi-protocols | DeFi Protocol Liquidity | 49.7 % | 7.8 | Trading-related | Artemis Analytics, Keyrock, Visa Onchain |
| centralised-exchanges | Centralised Exchange Liquidity | 27.4 % | 4.3 | Trading-related | Visa Onchain, BCG, a16z |
| mev-arbitrage | MEV & Arbitrage Bots | 12.1 % | 1.9 | Trading-related | Artemis Analytics, Flashbots |
| cross-border | Cross-Border Transfers | 2.6 % | 0.4 | Real-economy | IMF, BIS, Artemis |
| payments | Payments & Treasury | 8.3 % | 1.3 | Real-economy | Artemis survey, BCG, McKinsey |

## Change management checklist

1. **Add or edit taxonomy entries** in `src/data/useCases.ts`. Keep narrative text, metrics and source attributions aligned with cited research.
2. **Keep category figures** aligned with the report so the dashboard remains consistent with published numbers.
3. **Update the dashboard narrative** (`src/pages/DashboardPage.tsx`) if shares or volumes change materially.
4. **Re-run `npm run build`** to validate the TypeScript surface before shipping.

Document updated: 2025-09-28
