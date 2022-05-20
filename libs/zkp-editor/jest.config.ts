const config = {
  displayName: 'zkp-editor',
  preset: '../../jest.preset.ts',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
      useESM: true,
    },
  },
  testEnvironment: 'node',
  transform: {
    // '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    // '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nrwl/next/babel'] }],
    '^.+\\.[tj]sx?$': 'ts-jest',
    //  '^.+\\.ne$': 'jest-transform-nearley',
  },
  transformIgnorePatterns: [],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/zkp-editor',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
}

export default config
