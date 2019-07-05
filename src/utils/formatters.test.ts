import {
  timeFormatter,
  siPrefixFormatter,
  binaryPrefixFormatter,
} from './formatters'

describe('timeFormatter', () => {
  test('defaults to 12 hour time unless timezone is UTC', () => {
    const utcFormatter = timeFormatter({timeZone: 'UTC'})
    const nonUTCFormatter = timeFormatter({timeZone: 'America/Los_Angeles'})

    const d = new Date('2019-01-01T00:00Z')

    // 24 hour time when using UTC
    expect(utcFormatter(d)).toEqual('2019-01-01 00:00:00 UTC')

    // Defaults to 12 hour time when not UTC
    expect(nonUTCFormatter(d)).toEqual('2018-12-31 4:00:00 PM PST')
  })

  test('can format times with format strings', () => {
    const tests = [
      ['YYYY-MM-DD HH:mm:ss', '2019-01-01 00:00:00'],
      ['YYYY-MM-DD HH:mm:ss ZZ', '2019-01-01 00:00:00 UTC'],
      ['MM/DD/YYYY HH:mm:ss.sss', '01/01/2019 00:00:00.000'],
      ['YYYY/MM/DD HH:mm:ss', '2019/01/01 00:00:00'],
      ['HH:mm:ss', '00:00:00'],
      ['HH:mm:ss.sss', '00:00:00.000'],
      ['MMMM D, YYYY HH:mm:ss', 'January 1, 2019 00:00:00'],
      ['dddd, MMMM D, YYYY HH:mm:ss', 'Tuesday, January 1, 2019 00:00:00'],
    ]

    for (const [format, expected] of tests) {
      const d = new Date('2019-01-01T00:00:00Z')
      const formatter = timeFormatter({format, timeZone: 'UTC'})

      expect(formatter(d)).toEqual(expected)
    }
  })

  test('it can format times with a variable level of detail', () => {
    const formatter = timeFormatter({timeZone: 'UTC'})

    // Defaults to quite detailed if no domainWidth passed
    expect(formatter(0)).toEqual('1970-01-01 00:00:00 UTC')

    const WEEK = 1000 * 60 * 60 * 24 * 7
    const YEAR = 1000 * 60 * 60 * 24 * 365

    // Otherwise formats numbers according to domainWidth
    expect(formatter(0, {domainWidth: 1})).toEqual('00:00:00.000 UTC')
    expect(formatter(0, {domainWidth: WEEK})).toEqual('Jan 01, 00:00 UTC')
    expect(formatter(0, {domainWidth: YEAR})).toEqual('1970-01-01')
  })
})

describe('siPrefixFormatter', () => {
  test('can format numbers with SI unit prefixes', () => {
    const f = siPrefixFormatter({significantDigits: 6})

    expect(f(123456)).toEqual('123.456k')
    expect(f(123456789.1)).toEqual('123.457M')
    expect(f(12345678912345.123456789)).toEqual('12.3457T')
  })

  test('can format numbers with a unit suffix', () => {
    const f = siPrefixFormatter({suffix: 'm'})

    expect(f(1000)).toEqual('1km')
  })

  test('can format numbers with a prefix', () => {
    const f = siPrefixFormatter({prefix: 'howdy'})

    expect(f(1000)).toEqual('howdy1k')
  })
})

describe('binaryPrefixFormatter', () => {
  test('can format numbers with binary unit prefixes', () => {
    const f = binaryPrefixFormatter()

    expect(f(2 ** 10)).toEqual('1 K')
    expect(f(2 ** 20)).toEqual('1 M')
    expect(f(2 ** 30)).toEqual('1 G')
  })

  test('can format negative numbers with a binary unit prefix', () => {
    const f = binaryPrefixFormatter()

    expect(f(0 - 2 ** 30)).toEqual('-1 G')
  })

  test('formats small numbers without unit prefixes', () => {
    const f = binaryPrefixFormatter()

    expect(f(0.551249)).toEqual('0.551249')
    expect(f(0.551249)).toEqual('0.551249')
  })

  test('can add a prefix to formatted numbers', () => {
    const f = binaryPrefixFormatter({prefix: 'my favorite number '})

    expect(f(1)).toEqual('my favorite number 1')
  })

  test('can add a suffix to formatted numbers', () => {
    const f = binaryPrefixFormatter({suffix: ' snorp'})

    expect(f(1)).toEqual('1 snorp')
  })

  test('can configure the significant digits for formatted number', () => {
    const f = binaryPrefixFormatter({significantDigits: 1})
    const g = binaryPrefixFormatter({significantDigits: 8})
    const h = binaryPrefixFormatter({significantDigits: 0})

    expect(f(1.551249)).toEqual('1.6')
    expect(f(0.1)).toEqual('0.1')
    expect(g(1.551249)).toEqual('1.551249')
    expect(h(1.551249)).toEqual('2')
  })
})
