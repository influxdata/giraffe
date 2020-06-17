import {isNumber} from './isNumber'
import {isString} from './isString'
import {preventNegativeZero} from './preventNegativeZero'

import {DecimalPlaces} from '../types'

const MAX_DECIMAL_PLACES = 10

interface FormatStatValueOptions {
  decimalPlaces?: DecimalPlaces
  prefix?: string
  suffix?: string
}

const getAutoDigits = (value: number | string): number => {
  const decimalIndex = value.toString().indexOf('.')

  return decimalIndex === -1 ? 0 : 2
}

export const formatStatValue = (
  value: number | string,
  {decimalPlaces, prefix, suffix}: FormatStatValueOptions = {}
): string => {
  let localeFormattedValue: undefined | string | number

  let digits: number

  if (decimalPlaces && decimalPlaces.isEnforced) {
    digits = decimalPlaces.digits
  } else {
    digits = getAutoDigits(value)
  }

  digits = Math.min(digits, MAX_DECIMAL_PLACES)

  if (isNumber(value)) {
    const roundedValue = Number(value).toFixed(digits)
    const endsWithZero = /\.[1-9]{0,}0{1,}$/

    localeFormattedValue = endsWithZero.test(roundedValue)
      ? roundedValue
      : Number(roundedValue).toLocaleString(undefined, {
          maximumFractionDigits: MAX_DECIMAL_PLACES,
        })
  } else if (isString(value)) {
    localeFormattedValue = value
  } else {
    return 'Data cannot be displayed'
  }

  localeFormattedValue = preventNegativeZero(localeFormattedValue)
  const formattedValue = `${prefix || ''}${localeFormattedValue}${suffix || ''}`

  return formattedValue
}
