module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom-sixteen',
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.(ts?|tsx?)$',
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
    window: {},
    document: {},
  },
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    '.+\\.(css|scss)$': 'jest-css-modules-transform',
  },
  coverageReporters: ['json', 'html'],
}
