/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  automock: false,
  resetMocks: false,
  setupFiles: ['./setupJest.js'],
}
