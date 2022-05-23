const { join } = require('path')
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind')

module.exports = {
  content: [
    join(__dirname, '**/*!(*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
