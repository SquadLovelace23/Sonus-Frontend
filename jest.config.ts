/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from 'jest';

const config: Config = {
  // Indicates whether the coverage information should be collected while executing the test
  // collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: [
  //   'src/**/*.{js,jsx,ts,tsx}',
  //   '!src/**/*.d.ts',
  //   '!src/index.tsx',
  //   '!src/serviceWorker.ts',
  // ],

  // The directory where Jest should output its coverage files
  // coverageDirectory: 'coverage',

  // Indicates which provider should be used to instrument code for coverage
  // coverageProvider: 'v8',

  // A list of reporter names that Jest uses when writing coverage reports
  // coverageReporters: ['json', 'lcov', 'text', 'clover'],

  // The test environment that will be used for testing React components
  testEnvironment: 'jsdom',

  // The glob patterns Jest uses to detect test files
  // testMatch: ['<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}', '<rootDir>/src/**/*.{spec,test}.{js,jsx,ts,tsx}'],

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'json'],

  // A map from regular expressions to module names or to arrays of module names that allow to stub out resources with a single module
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': "<rootDir>/src/__mocks__/styleMock.ts",
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src/__mocks__/fileMock.ts',
  },

  // An array of regexp pattern strings, matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: ['<rootDir>/node_modules/'],

  // An array of regexp pattern strings that are matched against all modules before the module loader will automatically return a mock for them
  // unmockedModulePathPatterns: ['<rootDir>/node_modules/react/', '<rootDir>/node_modules/enzyme/'],

  // Setup Enzyme for React component testing
  // setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],

  // Transform files with ts-jest
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
};

export default config;
