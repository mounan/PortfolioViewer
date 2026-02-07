# PR: Holdings MVP (Portfolio + Multi-Currency + Heatmap)

## Scope
- Added holdings MVP (no transaction history).
- Added portfolio valuation in base currency (default `JPY`).
- Added graceful degradation for missing FX / missing after-hours values.
- Added `My Holdings Heatmap`:
  - Tile area = holding market-value weight
  - Tile color = price change percent

## Commits (Task Order)
1. `feat(holdings): add user-scoped holdings model and server actions`
2. `feat(holdings): add fx-aware valuation and market snapshot aggregation`
3. `feat(holdings): add portfolio dashboard page, form, and holdings table`
4. `feat(holdings): add holdings heatmap weighted by market value`
5. `docs(holdings): add PR acceptance notes and screenshot checklist` (this commit)

## Key Acceptance Points
- Holdings are isolated by current authenticated user (no client `userId` trust).
- Existing watchlist/alert schema and behavior unchanged.
- Missing FX rate does not crash page; affected rows display `--` and summary shows missing currencies.
- Missing after-hours data does not crash page; field is displayed as `--`.
- Portfolio page:
  - Holdings list includes `symbol/exchange/quantity/avg_cost/currency`
  - Summary cards show total market value/cost/unrealized P&L in `JPY`
  - Heatmap is rendered using market-value weight + change-percent color

## Commands
Run:
```bash
npm run lint
npm run build
npm run test:db
```

Current environment note:
- Dependency installation failed due network DNS (`registry.npmjs.org` unreachable), so lint/build/test cannot be executed to completion in this environment.

## Manual QA Checklist
1. Sign in and open `/holdings`.
2. Add holdings in different currencies (e.g. `USD`, `JPY`).
3. Verify table columns:
   - Symbol
   - Exchange
   - Quantity
   - Avg Cost
   - Currency
4. Verify summary cards are in base currency (`JPY`) and update after add/edit/delete.
5. Verify missing FX cases do not crash page and show warning chips.
6. Verify missing AH values show `--`, no runtime error.
7. Verify heatmap:
   - Larger position => larger tile area
   - Positive change => green tone
   - Negative change => red tone
8. Re-check `/watchlist` and alerts behavior unchanged.

## Screenshot Checklist (attach in PR)
- [ ] Holdings page (with at least 3 holdings)
- [ ] Summary cards showing JPY totals
- [ ] Heatmap with mixed positive/negative tiles
- [ ] Edit holding modal
- [ ] Missing FX / missing price warning chips
