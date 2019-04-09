import * as React from 'react'
import {FunctionComponent} from 'react'
import {createPortal} from 'react-dom'

import {TooltipData} from '../types'
import {useTooltipElement} from '../utils/useTooltipElement'
import {PlotEnv} from '../utils/PlotEnv'
import {isNumeric} from '../utils/isNumeric'

const isVoid = (x: any) => x === null || x === undefined

const getXYLabel = (min: number, max: number): string => {
  let label = ''

  if (isVoid(min) || isVoid(max)) {
    label = ''
  } else if (min === max) {
    label = String(min)
  } else {
    label = `${min} – ${max}`
  }

  return label
}

interface Props {
  data: TooltipData
  env: PlotEnv
}

export const Tooltip: FunctionComponent<Props> = ({
  data: {xMin, xMax, yMin, yMax, columns},
  env: {
    config: {
      legendFont: font,
      legendFontColor: fontColor,
      legendFontBrightColor: fontBrightColor,
      legendBackgroundColor: backgroundColor,
      legendBorder: border,
    },
  },
}) => {
  const tooltipElement = useTooltipElement()

  let xLabel = getXYLabel(xMin, xMax)
  let yLabel = getXYLabel(yMin, yMax)

  return createPortal(
    <div
      className="vis-tooltip"
      style={{
        border,
        font,
        backgroundColor,
        color: fontBrightColor,
        borderRadius: '3px',
        padding: '10px',
      }}
    >
      {xLabel && <div className="vis-tooltip-xy-label">{xLabel}</div>}
      {yLabel && <div className="vis-tooltip-xy-label">{yLabel}</div>}
      <div
        className="vis-tooltip-table"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '10px',
        }}
      >
        {columns.map(({name, type, values, colors}, i) => (
          <div
            key={name}
            className="vis-tooltip-column"
            style={{
              marginRight: i === columns.length - 1 ? 0 : '15px',
              textAlign: isNumeric(type) ? 'right' : 'left',
            }}
          >
            <div
              className="vis-tooltip-column-header"
              style={{marginBottom: '5px', color: fontColor}}
            >
              {name}
            </div>
            {values.map((value, i) => (
              <div
                className="vis-tooltip-column-value"
                key={i}
                style={{
                  color: colors[i] ? colors[i] : fontBrightColor,
                  maxWidth: '200px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {value}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>,
    tooltipElement
  )
}
