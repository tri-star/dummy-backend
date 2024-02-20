const esModules = ['@middy'].join('|')

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest/presets/default-esm',
  clearMocks: true,
  testEnvironment: 'node',
  globalSetup: '<rootDir>/src/libs/jest/setup-env.ts',
  setupFilesAfterEnv: ['<rootDir>/src/libs/jest/mock-xray.ts'],
  moduleNameMapper: {
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
    // '^@middy(.*)$': '<rootDir>/node_modules/@middy/$1',
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
  transformIgnorePatterns: [`node_modules/(?!${esModules})`],
}
