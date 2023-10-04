import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  setupFilesAfterEnv: ['./jest-setup.ts', './src/setupTests.ts'],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/jest/__mocks__/styleMock.js',
  },
};
export default config;

// In jest.config.js add (if you haven't already)
