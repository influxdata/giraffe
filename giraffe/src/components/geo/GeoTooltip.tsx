import {FunctionComponent, useState} from 'react'
import React from 'react'
import {Config} from '../../types'
import {Tooltip} from '../Tooltip'

interface Props {
  stylingConfig: Partial<Config>
  onCreate
}

export const GeoTooltip: FunctionComponent<Props> = props => {
  const {stylingConfig, onCreate} = props
  const [tooltipData, setTooltipData] = useState(null)
  onCreate(setTooltipData)
  return (
    <>
      {tooltipData && (
        <Tooltip
          data={tooltipData}
          config={{
            ...(stylingConfig as Config),
            legendColumns: tooltipData.map(c => c.key),
          }}
        />
      )}
    </>
  )
}
