const { join } = require('path')
const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind')
// const { join } = import('path')
// const { createGlobPatternsForDependencies } = import('@nrwl/react/tailwind.js')

const typography = require('@tailwindcss/typography')

module.exports = {
  content: [
    join(__dirname, '**/*!(*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [typography],
}
