module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.(ts?|tsx?)$',
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
  coverageReporters: ['json', 'html'],
}
