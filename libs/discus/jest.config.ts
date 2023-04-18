/* eslint-disable */
export default {
  displayName: 'discus',
  preset: '../../jest.preset.js',
  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': ['@swc/jest'],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/libs/discus',
}
