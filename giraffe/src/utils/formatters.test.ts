import {
  timeFormatter,
  siPrefixFormatter,
  binaryPrefixFormatter,
} from './formatters'

describe('timeFormatter', () => {
  it('defaults to 12 hour time unless timezone is UTC', () => {
    const utcFormatter = timeFormatter({timeZone: 'UTC'})
    const nonUTCFormatter = timeFormatter({timeZone: 'America/Los_Angeles'})

    const d = new Date('2019-01-01T00:00Z')

    // 24 hour time when using UTC
    expect(utcFormatter(d)).toEqual('2019-01-01 00:00:00 UTC')

    // Defaults to 12 hour time when not UTC
    expect(nonUTCFormatter(d)).toEqual('2018-12-31  4:00:00 PM PST')
  })

  it('handles ante meridiem and post meridiem', () => {
    let d = new Date('2019-01-01T00:00Z')

    let meridiemFormatter = timeFormatter({
      timeZone: 'Europe/London',
      format: 'HH:mm a',
    })
    expect(meridiemFormatter(d)).toEqual('12:00 AM')

    meridiemFormatter = timeFormatter({
      timeZone: 'Europe/London',
      format: 'HH:mm A',
    })
    expect(meridiemFormatter(d)).toEqual('12:00 AM')

    d = new Date('2019-01-01T13:00Z')

    meridiemFormatter = timeFormatter({
      timeZone: 'Europe/London',
      format: 'HH:mm a',
    })
    expect(meridiemFormatter(d)).toEqual('1:00 PM')

    meridiemFormatter = timeFormatter({
      timeZone: 'Europe/London',
      format: 'HH:mm A',
    })
    expect(meridiemFormatter(d)).toEqual('1:00 PM')

    meridiemFormatter = timeFormatter({
      timeZone: 'America/Los_Angeles',
      format: 'HH:mm a',
    })
    expect(meridiemFormatter(d)).toEqual('5:00 AM')

    meridiemFormatter = timeFormatter({
      timeZone: 'America/Los_Angeles',
      format: 'HH:mm A',
    })
    expect(meridiemFormatter(d)).toEqual('5:00 AM')

    d = new Date('2019-01-01T00:00Z')

    meridiemFormatter = timeFormatter({
      timeZone: 'America/Los_Angeles',
      format: 'HH:mm a',
    })
    expect(meridiemFormatter(d)).toEqual('4:00 PM')

    meridiemFormatter = timeFormatter({
      timeZone: 'America/Los_Angeles',
      format: 'HH:mm A',
    })
    expect(meridiemFormatter(d)).toEqual('4:00 PM')
  })

  it('uses AM/PM when given "a" in the format regardless of time zone or time format', () => {
    const utcFormatterWithFormat = timeFormatter({
      timeZone: 'UTC',
      format: 'YYYY-MM-DD HH:mm:ss a ZZ',
    })
    const utcFormatterWithFormatWithLowerH = timeFormatter({
      timeZone: 'UTC',
      format: 'YYYY-MM-DD hh:mm:ss a ZZ',
    })
    const nonUTCFormatterWithFormat = timeFormatter({
      timeZone: 'America/Los_Angeles',
      format: 'YYYY-MM-DD HH:mm:ss a ZZ',
    })
    const nonUTCFormatterWithFormatWithLowerH = timeFormatter({
      timeZone: 'America/Los_Angeles',
      format: 'YYYY-MM-DD hh:mm:ss a ZZ',
    })

    const d = new Date('2019-01-01T00:00Z')

    expect(utcFormatterWithFormat(d)).toEqual('2019-01-01 12:00:00 AM UTC')
    expect(utcFormatterWithFormatWithLowerH(d)).toEqual(
      '2019-01-01 12:00:00 AM UTC'
    )
    expect(nonUTCFormatterWithFormat(d)).toEqual('2018-12-31 4:00:00 PM PST')
    expect(nonUTCFormatterWithFormatWithLowerH(d)).toEqual(
      '2018-12-31  4:00:00 PM PST'
    )
  })

  it('24 hour format and UTC format without "a" should not show "24" for midnight', () => {
    const utcFormatterWithFormat = timeFormatter({
      timeZone: 'UTC',
      format: 'YYYY-MM-DD HH:mm:ss ZZ',
    })
    const nonUTCFormatterWithFormat = timeFormatter({
      timeZone: 'Europe/Berlin',
      format: 'YYYY-MM-DD HH:mm:ss ZZ',
      hour12: false,
    })

    let midnight = new Date('2019-01-01T00:00Z')
    expect(utcFormatterWithFormat(midnight)).toEqual('2019-01-01 00:00:00 UTC')

    midnight = new Date('2019-01-01T24:00Z')
    expect(utcFormatterWithFormat(midnight)).toEqual('2019-01-02 00:00:00 UTC')

    midnight = new Date('2019-01-01T23:00Z')
    expect(nonUTCFormatterWithFormat(midnight)).toEqual(
      '2019-01-02 00:00:00 GMT+1'
    )
  })

  it('24 hour format and UTC format without "a" should display correctly', () => {
    const utcFormatterWithFormat = timeFormatter({
      timeZone: 'UTC',
      format: 'YYYY-MM-DD HH:mm:ss ZZ',
    })
    const nonUTCFormatterWithFormat = timeFormatter({
      timeZone: 'Europe/Berlin',
      format: 'YYYY-MM-DD HH:mm:ss ZZ',
      hour12: false,
    })

    let date = new Date('2019-01-01T15:00Z')
    expect(utcFormatterWithFormat(date)).toEqual('2019-01-01 15:00:00 UTC')
    expect(nonUTCFormatterWithFormat(date)).toEqual('2019-01-01 16:00:00 GMT+1')

    date = new Date('2019-01-01T07:00Z')
    expect(utcFormatterWithFormat(date)).toEqual('2019-01-01 07:00:00 UTC')
    expect(nonUTCFormatterWithFormat(date)).toEqual('2019-01-01 08:00:00 GMT+1')
  })

  it('can format times with format strings', () => {
    const tests = [
      ['YYYY-MM-DD HH:mm:ss', '2019-01-01 00:00:00'],
      ['YYYY-MM-DD HH:mm:ss ZZ', '2019-01-01 00:00:00 UTC'],
      ['DD/MM/YYYY HH:mm:ss.sss', '01/01/2019 00:00:00.000'],
      ['MM/DD/YYYY HH:mm:ss.sss', '01/01/2019 00:00:00.000'],
      ['YYYY/MM/DD HH:mm:ss', '2019/01/01 00:00:00'],
      ['hh:mm a', '12:00 AM'],
      ['HH:mm a', '12:00 AM'],
      ['HH:mm', '00:00'],
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

  it('it can format times with a variable level of detail', () => {
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
  it('can format numbers with SI unit prefixes', () => {
    const f = siPrefixFormatter({significantDigits: 6})

    expect(f(123456)).toEqual('123.456k')
    expect(f(123456789.1)).toEqual('123.457M')
    expect(f(12345678912345.123456789)).toEqual('12.3457T')
  })

  it('can format numbers with a unit suffix', () => {
    const f = siPrefixFormatter({suffix: 'm'})

    expect(f(1000)).toEqual('1km')
  })

  it('can format numbers with a prefix', () => {
    const f = siPrefixFormatter({prefix: 'howdy'})

    expect(f(1000)).toEqual('howdy1k')
  })

  it('can specify zeros are always included', () => {
    const f = siPrefixFormatter({trimZeros: false, significantDigits: 4})

    expect(f(37)).toEqual('37.00')
    expect(f(37.1234)).toEqual('37.12')
  })

  it('can shorten a positive number larger than septillion', () => {
    const f = siPrefixFormatter()
    expect(f(1.7e308)).toEqual('1.7e+284Y') 
  })

  it('can shorten a negative number smaller than septillion', () => {
    const f = siPrefixFormatter()
    expect(f(-1.7e308)).toEqual('-1.7e+284Y') 
  })
})

describe('binaryPrefixFormatter', () => {
  it('can format numbers with binary unit prefixes', () => {
    const f = binaryPrefixFormatter()

    expect(f(2 ** 10)).toEqual('1 K')
    expect(f(2 ** 20)).toEqual('1 M')
    expect(f(2 ** 30)).toEqual('1 G')
  })

  it('can format negative numbers with a binary unit prefix', () => {
    const f = binaryPrefixFormatter()

    expect(f(0 - 2 ** 30)).toEqual('-1 G')
  })

  it('formats small numbers without unit prefixes', () => {
    const f = binaryPrefixFormatter()

    expect(f(0.551249)).toEqual('0.551249')
    expect(f(0.551249)).toEqual('0.551249')
  })

  it('can add a prefix to formatted numbers', () => {
    const f = binaryPrefixFormatter({prefix: 'my favorite number '})

    expect(f(1)).toEqual('my favorite number 1')
  })

  it('can add a suffix to formatted numbers', () => {
    const f = binaryPrefixFormatter({suffix: ' snorp'})

    expect(f(1)).toEqual('1 snorp')
  })

  it('can configure the significant digits for formatted number', () => {
    const f = binaryPrefixFormatter({significantDigits: 1})
    const g = binaryPrefixFormatter({significantDigits: 8})
    const h = binaryPrefixFormatter({significantDigits: 0})

    expect(f(1.551249)).toEqual('1.6')
    expect(f(0.1)).toEqual('0.1')
    expect(g(1.551249)).toEqual('1.551249')
    expect(h(1.551249)).toEqual('2')
  })
})
