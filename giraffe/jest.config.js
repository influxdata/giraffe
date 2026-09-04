const path = require('path')

// d3-color 3.x is ESM-only, which Jest's CommonJS loader cannot parse. Point it
// at the UMD build instead. Resolved via require.resolve so it follows yarn
// workspace hoisting (d3-color lands in the repo-root node_modules).
const d3ColorUmd = path.resolve(
  path.dirname(require.resolve('d3-color')),
  '../dist/d3-color.min.js'
)

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.(ts?|tsx?)$',
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '.+\\.(css|scss)$': 'jest-css-modules-transform',
  },
  moduleNameMapper: {
    '^d3-color$': d3ColorUmd,
  },
  coverageReporters: ['json', 'html'],
}
