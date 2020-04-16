module.exports = {
  clearMocks: true,
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./jest.setup.js'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  verbose: false
}
