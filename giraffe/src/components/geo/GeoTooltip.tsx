import {FunctionComponent, useLayoutEffect, useState} from 'react'
import React from 'react'
import {Tooltip} from '../Tooltip'

// Utils
import {defineToolTipEffect} from './processing/toolTips'

// Types
import {Config} from '../../types'
import {GeoTable} from './processing/GeoTable'
import {GeoCircleViewLayer, GeoPointMapViewLayer} from '../../types/geo'
interface Props {
  stylingConfig: Partial<Config>
  properties: GeoPointMapViewLayer | GeoCircleViewLayer
  table: GeoTable
  tooltips: Array<{markerRef; rowInfo}>
}

export const GeoTooltip: FunctionComponent<Props> = props => {
  const {stylingConfig, properties, table, tooltips} = props
  const [tooltipData, setTooltipData] = useState(null)
  useLayoutEffect(defineToolTipEffect(tooltips, setTooltipData), [
    properties,
    table,
  ])

  return (
    <>
      {tooltipData && (
        <Tooltip
          data={tooltipData}
          config={{
            ...(stylingConfig as Config),
          }}
        />
      )}
    </>
  )
}
