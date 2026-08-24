import { Strategy } from "passport";

import { googleStrategy } from "./google.strategy";

/**
 * Strategy Registry
 * Centralized location for managing all OAuth strategies
 * New strategies can be easily added here without refactoring other files
 */

export type StrategyConfig = {
  name: string;
  strategy: Strategy | null;
  enabled: boolean;
};

// Register all available strategies
const strategies: StrategyConfig[] = [
  {
    name: "google",
    strategy: googleStrategy,
    enabled: true
  }
  // Future strategies can be added here:
  // {
  //   name: 'facebook',
  //   strategy: facebookStrategy,
  //   enabled: false,
  // },
  // {
  //   name: 'github',
  //   strategy: githubStrategy,
  //   enabled: false,
  // },
];

export const getEnabledStrategies = (): StrategyConfig[] => {
  return strategies.filter((s) => s.enabled && s.strategy !== null);
};

export const getAllStrategies = (): StrategyConfig[] => {
  return strategies;
};

export default strategies;
