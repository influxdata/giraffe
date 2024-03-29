import React, {FunctionComponent} from 'react'
import classnames from 'classnames'
import {
  SINGLE_STAT_DEFAULT_TEST_ID,
  SINGLE_STAT_RESIZER_DEFAULT_STYLE,
  SINGLE_STAT_SVG_DEFAULT_ATTRIBUTES,
  SINGLE_STAT_SVG_TEXT_DEFAULT_ATTRIBUTES,
  SINGLE_STAT_SVG_TEXT_DEFAULT_STYLE,
} from '../../style/singleStatStyles'
import {SingleStatLayerConfig} from '../../types'
import {formatStatValue} from '../../utils/formatStatValue'

import styles from './SingleStatLayer.scss'

import {styleReducer} from '../../utils/styleReducer'

interface Props {
  stat: number
  config: SingleStatLayerConfig
}

const getDefaultViewBox = (stat: string): string =>
  `0 0 ${stat.length * 55} 100`

export const SingleStatLayer: FunctionComponent<Props> = props => {
  const {stat, config} = props
  const {
    backgroundColor = null,
    decimalPlaces,
    prefix,
    resizerStyle = {},
    style = {},
    suffix,
    svgAttributes = {viewBox: ''},
    svgStyle = {},
    svgTextAttributes = {},
    svgTextStyle = {},
    testID = SINGLE_STAT_DEFAULT_TEST_ID,
    textColor,
    textOpacity = 1,
  } = config

  const singleStatLayerClasses = styleReducer(
    styles,
    'giraffe-layer giraffe-layer-single-stat',
    classnames('giraffe-layer-single-stat')
  )

  const formattedValue = formatStatValue(stat, {decimalPlaces, prefix, suffix})

  let viewBox = getDefaultViewBox(formattedValue)

  if (svgAttributes.viewBox) {
    viewBox =
      typeof svgAttributes.viewBox === 'function'
        ? svgAttributes.viewBox(formattedValue)
        : svgAttributes.viewBox
  }

  return (
    <div
      className={singleStatLayerClasses}
      data-testid={testID}
      style={{
        ...style,
        backgroundColor: `${backgroundColor}`,
      }}
    >
      <div
        className="giraffe-single-stat--resizer"
        style={{...SINGLE_STAT_RESIZER_DEFAULT_STYLE, ...resizerStyle}}
      >
        <svg
          {...{
            ...SINGLE_STAT_SVG_DEFAULT_ATTRIBUTES,
            ...svgAttributes,
            viewBox,
          }}
          className="giraffe-single-stat--svg"
          style={{...svgStyle}}
        >
          <text
            {...{
              ...SINGLE_STAT_SVG_TEXT_DEFAULT_ATTRIBUTES,
              ...svgTextAttributes,
              opacity: textOpacity,
            }}
            className="giraffe-single-stat--text"
            style={{
              ...SINGLE_STAT_SVG_TEXT_DEFAULT_STYLE,
              ...svgTextStyle,
              fill: textColor,
            }}
          >
            {formattedValue}
          </text>
        </svg>
      </div>
    </div>
  )
}
