const esModules = ['@middy'].join('|')

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  clearMocks: true,
  testEnvironment: 'node',
  globalSetup: '<rootDir>/src/libs/jest/setup-env.ts',
  setupFilesAfterEnv: ['<rootDir>/src/libs/jest/mock-xray.ts'],
  moduleNameMapper: {
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@functions/(.*)$': '<rootDir>/src/functions/$1',
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

export default config
