import {isNumber} from './isNumber'
import {isString} from './isString'
import {preventNegativeZero} from './preventNegativeZero'

import {SingleStatDecimalPlaces} from '../types'

const MAX_DECIMAL_PLACES = 10

interface FormatStatValueOptions {
  decimalPlaces?: SingleStatDecimalPlaces
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

  if (isNumber(value)) {
    let digits: number

    if (decimalPlaces && decimalPlaces.isEnforced) {
      digits = decimalPlaces.digits
    } else {
      digits = getAutoDigits(value)
    }

    const roundedValue = Number(value).toFixed(digits)

    localeFormattedValue =
      Number(roundedValue) === 0
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
