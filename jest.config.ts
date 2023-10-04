import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  setupFilesAfterEnv: ['./jest-setup.ts'],
};
export default config;

// In jest.config.js add (if you haven't already)
