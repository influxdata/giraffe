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

import {Formatter} from '../types'

export const TIME_FORMATTER_TYPE: 'TIME' = 'TIME'

interface TimeFormatter extends Formatter {
  (x: number, options?: {domainWidth?: number}): string

  _GIRAFFE_FORMATTER_TYPE: typeof TIME_FORMATTER_TYPE
}

interface TimeFormatterFactoryOptions {
  // BCP 47 language tag or "default"
  locale?: string

  // IANA Time Zone Database name (e.g. "America/New_York") or "UTC"
  timeZone?: string

  // Should time be displayed on a 12 or 24 hour clock? Default is based on locale
  hour12?: boolean
}

export const timeFormatter = ({
  locale,
  timeZone,
  hour12,
}: TimeFormatterFactoryOptions = {}): TimeFormatter => {
  const formatter = (x: number, {domainWidth = null} = {}) => {
    // We will format times differently based on the passed `domainWidth`. For
    // example, if a user is viewing 10 years of data at a time, they probably
    // don't need seconds granularity on their axis ticks
    let granularityOptions: {} = DEFAULT_GRANULARITY_OPTIONS

    if (domainWidth) {
      granularityOptions = TIME_GRANULARITY_OPTIONS.find(
        d => d.minWidth <= domainWidth && d.maxWidth > domainWidth
      ).options
    }

    const dateFormatOptions = {
      timeZone,
      hour12: timeZone === 'UTC' && hour12 === undefined ? false : hour12,
      timeZoneName: timeZone ? 'short' : undefined,
      ...granularityOptions,
    }

    return new Intl.DateTimeFormat(locale, dateFormatOptions).format(x)
  }

  formatter._GIRAFFE_FORMATTER_TYPE = TIME_FORMATTER_TYPE

  return formatter
}

const DEFAULT_GRANULARITY_OPTIONS = {
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
}

const HOUR = 1000 * 60 * 60
const DAY = 1000 * 60 * 60 * 24
const WEEK = 1000 * 60 * 60 * 24 * 7

const TIME_GRANULARITY_OPTIONS = [
  {
    minWidth: 0,
    maxWidth: 1 * HOUR,
    options: {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    },
  },
  {
    minWidth: 1 * HOUR,
    maxWidth: 1 * DAY,
    options: {
      hour: 'numeric',
      minute: 'numeric',
    },
  },
  {
    minWidth: 1 * DAY,
    maxWidth: 2 * WEEK,
    options: {
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    },
  },
  {
    minWidth: 2 * WEEK,
    maxWidth: 4 * WEEK,
    options: {
      month: 'numeric',
      day: 'numeric',
    },
  },
  {
    minWidth: 4 * WEEK,
    maxWidth: Infinity,
    options: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    },
  },
]

export const BINARY_PREFIX_FORMATTER_TYPE: 'BINARY_PREFIX' = 'BINARY_PREFIX'

interface BinaryPrefixFormatter extends Formatter {
  (x: number): string

  _GIRAFFE_FORMATTER_TYPE: typeof BINARY_PREFIX_FORMATTER_TYPE
}

interface BinaryPrefixFormatterFactoryOptions {
  prefix?: string
  suffix?: string
  significantDigits?: number
}

const BINARY_PREFIXES = ['', 'K', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y']

export const binaryPrefixFormatter = ({
  prefix = '',
  suffix = '',
  significantDigits = 6,
}: BinaryPrefixFormatterFactoryOptions = {}): BinaryPrefixFormatter => {
  const formatSigFigs = d3Format(`.${significantDigits}~f`)

  const formatter = (x: number) => {
    const isXBig = Math.abs(x) >= 1024
    const i = Math.floor(Math.log(Math.abs(x)) / Math.log(2 ** 10))
    const binaryFormattedNumber = isXBig ? x / 1024 ** i : x
    const binaryPrefix = isXBig ? ' ' + BINARY_PREFIXES[i] : ''

    const decimalFormattedNumber = formatSigFigs(binaryFormattedNumber)

    return `${prefix}${decimalFormattedNumber}${binaryPrefix}${suffix}`
  }

  formatter._GIRAFFE_FORMATTER_TYPE = BINARY_PREFIX_FORMATTER_TYPE

  return formatter
}

export const SI_PREFIX_FORMATTER_TYPE: 'SI_PREFIX' = 'SI_PREFIX'

interface SIPrefixFormatter extends Formatter {
  (x: number): string

  _GIRAFFE_FORMATTER_TYPE: typeof SI_PREFIX_FORMATTER_TYPE
}

interface SIPrefixFormatterFactoryOptions {
  prefix?: string
  suffix?: string
  significantDigits?: number
}

export const siPrefixFormatter = ({
  prefix = '',
  suffix = '',
  significantDigits = 6,
}: SIPrefixFormatterFactoryOptions = {}): SIPrefixFormatter => {
  const formatSIPrefix = d3Format(`.${significantDigits}~s`)

  const formatter = (x: number): string =>
    `${prefix}${formatSIPrefix(x)}${suffix}`

  formatter._GIRAFFE_FORMATTER_TYPE = SI_PREFIX_FORMATTER_TYPE

  return formatter
}
