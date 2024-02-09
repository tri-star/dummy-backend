/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globalSetup: '<rootDir>/src/libs/jest/setup-env.ts',
  setupFilesAfterEnv: ['<rootDir>/src/libs/jest/mock-middy.ts'],
  moduleNameMapper: {
    '^@libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}
