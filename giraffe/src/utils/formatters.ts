/*
  This module contains utilites for formatting values in visualizations.

  A `Formatter` takes a value in a table and formats it as a user-facing
  string. A formatter factory creates a `Formatter`. Here we define several
  formatter factories for common use cases such as formatting time values, or
  formatting quantities of bytes.

      // Create a formatter by calling the factory
      const myTimeFormatter = timeFormatter({timezone: 'America/New_York'})

      // Use the formatter to get a user-friendly string representation of a value
      myTimeFormatter(1562018849599)

      // => returns "1 July 2019"

*/

import {format as d3Format} from 'd3-format'
import {createDateFormatter} from 'intl-dateformat'

import {Formatter, FormatterType} from '../types'

const DEFAULT_TIME_FORMATS = {
  local12: 'YYYY-MM-DD hh:mm:ss A',
  local24: 'YYYY-MM-DD HH:mm:ss ZZ',
  zoned12: 'YYYY-MM-DD hh:mm:ss A ZZ',
  zoned24: 'YYYY-MM-DD HH:mm:ss ZZ',
}

const MINUTE = 1000 * 60
const HOUR = 1000 * 60 * 60
const DAY = 1000 * 60 * 60 * 24
const WEEK = 1000 * 60 * 60 * 24 * 7

const TIME_FORMATS_BY_GRANULARITY = [
  {
    minWidth: 0,
    maxWidth: 1 * MINUTE,
    local12: 'hh:mm:ss.sss A',
    local24: 'HH:mm:ss.sss ZZ',
    zoned12: 'hh:mm:ss.sss A ZZ',
    zoned24: 'HH:mm:ss.sss ZZ',
  },
  {
    minWidth: 1 * MINUTE,
    maxWidth: 1 * HOUR,
    local12: 'hh:mm:ss A',
    local24: 'HH:mm:ss ZZ',
    zoned12: 'hh:mm:ss A ZZ',
    zoned24: 'HH:mm:ss ZZ',
  },
  {
    minWidth: 1 * HOUR,
    maxWidth: 1 * DAY,
    local12: 'hh:mm A',
    local24: 'HH:mm ZZ',
    zoned12: 'hh:mm A ZZ',
    zoned24: 'HH:mm ZZ',
  },
  {
    minWidth: 1 * DAY,
    maxWidth: 2 * WEEK,
    local12: 'MMM DD, hh:mm A',
    local24: 'MMM DD, HH:mm ZZ',
    zoned12: 'MMM DD, hh:mm A ZZ',
    zoned24: 'MMM DD, HH:mm ZZ',
  },
  {
    minWidth: 2 * WEEK,
    maxWidth: 4 * WEEK,
    local12: 'MMM DD',
    local24: 'MMM DD',
    zoned12: 'MMM DD',
    zoned24: 'MMM DD',
  },
  {
    minWidth: 4 * WEEK,
    maxWidth: Infinity,
    local12: 'YYYY-MM-DD',
    local24: 'YYYY-MM-DD',
    zoned12: 'YYYY-MM-DD',
    zoned24: 'YYYY-MM-DD',
  },
]

// Get the "short" name for a time zone, e.g. "America/Los_Angeles" => PST
const getShortTimeZoneName = (timeZone: string, date: Date) => {
  const formatted = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    timeZoneName: 'short',
  }).format(date)

  return formatted.substring(formatted.indexOf(',') + 2)
}

interface TimeFormatter extends Formatter {
  (x: number, options?: {domainWidth?: number}): string

  _GIRAFFE_FORMATTER_TYPE: FormatterType.Time
}

interface TimeFormatterFactoryOptions {
  // BCP 47 language tag or "default"
  locale?: string

  // IANA Time Zone Database name (e.g. "America/New_York") or "UTC"
  timeZone?: string

  // Whether to use a 12- or 24-hour clock (default true)
  hour12?: boolean

  // Format string, e.g. "YYYY-MM-DD HH:mm".
  //
  // Support options are those [here][0], as well as:
  //
  // - `sss`: milliseconds
  // - `Z`: short time zone name (e.g. "PST")
  // - `D`: day of month without zero padding
  //
  // [0]: https://github.com/zapier/intl-dateformat#formats
  format?: string
}

export const timeFormatter = ({
  locale,
  timeZone,
  format,
  hour12,
}: TimeFormatterFactoryOptions = {}): TimeFormatter => {
  // this check is used to determine whether a user's locale is 24h or 12h
  const is24hourLocale = new Date(2014, 1, 1, 15, 0, 0, 0)
    .toLocaleTimeString()
    .includes('15')

  // createDateFormatter is very particular in terms of order of operation
  // for example, modifying the timezone before determing the `am/pm` will
  // output the timezone incorrectly. The same goes for determining the `HH`, etc...
  const formatStringFormatter = createDateFormatter({
    HH: ({lhour}) => {
      if (format && format.includes('a')) {
        if (Number(lhour) === 0) {
          return '12'
        }
        if (Number(lhour) > 12) {
          return String(Number(lhour) - 12)
        }
        return String(Number(lhour))
      }
      return lhour
    },
    sss: (_, date) => String(date.getMilliseconds()).padStart(3, '0'),
    D: parts => String(Number(parts.day)),
    a: ({dayPeriod, lhour}) => {
      if (format && format.includes('a') && is24hourLocale) {
        if (Number(lhour) >= 12) {
          return 'PM'
        } else {
          return 'AM'
        }
      }
      return dayPeriod || ''
    },
    ZZ: (_, date) => getShortTimeZoneName(timeZone, date),
  })

  let formatter

  if (format) {
    // If a `format` string is passed, we simply use it
    formatter = (x: number) =>
      formatStringFormatter(new Date(x), format, {
        locale,
        timezone: timeZone,
      })
  } else {
    // Otherwise we will return a formatter that will vary the output format
    // based on an optional `domainWidth` argument (e.g. we will show more
    // detail in a formatted timestamp if a user is viewing data in a short
    // time range)
    formatter = (x: number, {domainWidth = null} = {}) => {
      let timeFormats = DEFAULT_TIME_FORMATS

      if (domainWidth) {
        timeFormats = TIME_FORMATS_BY_GRANULARITY.find(
          d => d.minWidth <= domainWidth && d.maxWidth > domainWidth
        )
      }

      let timeFormat

      if (
        (timeZone === 'UTC' && hour12 === undefined) ||
        (timeZone && hour12 === false)
      ) {
        timeFormat = timeFormats.zoned24
      } else if (timeZone) {
        timeFormat = timeFormats.zoned12
      } else if (hour12 === false) {
        timeFormat = timeFormats.local24
      } else if (is24hourLocale) {
        // this implementation checks the user's OS/browser settings to
        // check whether their locale is 12h or 24h
        // Evaluating true means that the local is based on a 24h locale
        timeFormat = timeFormats.local24
      } else {
        timeFormat = timeFormats.local12
      }

      return formatStringFormatter(new Date(x), timeFormat, {
        timezone: timeZone,
        locale,
      })
    }
  }

  formatter._GIRAFFE_FORMATTER_TYPE = FormatterType.Time
  return formatter
}

export const BINARY_PREFIX_FORMATTER_TYPE: 'BINARY_PREFIX' = 'BINARY_PREFIX'

const BINARY_PREFIXES = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']

interface BinaryPrefixFormatter extends Formatter {
  (x: number): string

  _GIRAFFE_FORMATTER_TYPE: FormatterType.BinaryPrefix
}

interface BinaryPrefixFormatterFactoryOptions {
  prefix?: string
  suffix?: string
  significantDigits?: number
  trimZeros?: boolean
}

export const binaryPrefixFormatter = ({
  prefix = '',
  suffix = '',
  significantDigits = 6,
  trimZeros = true,
}: BinaryPrefixFormatterFactoryOptions = {}): BinaryPrefixFormatter => {
  const formatSigFigs = d3Format(
    `.${significantDigits}${trimZeros ? '~' : ''}f`
  )

  const formatter = (x: number) => {
    const isXBig = Math.abs(x) >= 1024
    const i = Math.floor(Math.log(Math.abs(x)) / Math.log(2 ** 10))
    const binaryFormattedNumber = isXBig ? x / 1024 ** i : x
    const binaryPrefix = isXBig ? ' ' + BINARY_PREFIXES[i] : ''

    const decimalFormattedNumber = formatSigFigs(binaryFormattedNumber)

    return `${prefix}${decimalFormattedNumber}${binaryPrefix}${suffix}`
  }

  formatter._GIRAFFE_FORMATTER_TYPE = FormatterType.BinaryPrefix as FormatterType.BinaryPrefix

  return formatter
}

export const SI_PREFIX_FORMATTER_TYPE: 'SI_PREFIX' = 'SI_PREFIX'

interface SIPrefixFormatter extends Formatter {
  (x: number): string

  _GIRAFFE_FORMATTER_TYPE: FormatterType.SIPrefix
}

interface SIPrefixFormatterFactoryOptions {
  prefix?: string
  suffix?: string
  significantDigits?: number
  trimZeros?: boolean
}

export const siPrefixFormatter = ({
  prefix = '',
  suffix = '',
  significantDigits = 6,
  trimZeros = true,
}: SIPrefixFormatterFactoryOptions = {}): SIPrefixFormatter => {
  const formatSIPrefix = d3Format(
    `.${significantDigits}${trimZeros ? '~' : ''}s`
  )

  const formatter = (x: number): string =>
    `${prefix}${formatSIPrefix(x)}${suffix}`

  formatter._GIRAFFE_FORMATTER_TYPE = FormatterType.SIPrefix as FormatterType.SIPrefix

  return formatter
}
