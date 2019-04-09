import * as React from 'react'
import {FunctionComponent} from 'react'
import {createPortal} from 'react-dom'

import {TooltipData} from '../types'
import {useTooltipElement} from '../utils/useTooltipElement'
import {PlotEnv} from '../utils/PlotEnv'
import {isNumeric} from '../utils/isNumeric'

const isVoid = (x: any) => x === null || x === undefined

const getXYLabel = (min: number, max: number, formatter): string => {
  let label = ''

  if (isVoid(min) || isVoid(max)) {
    label = ''
  } else if (min === max) {
    label = formatter(min)
  } else {
    label = `${formatter(min)} – ${formatter(max)}`
  }

  return label
}

interface Props {
  data: TooltipData
  env: PlotEnv
}

export const Tooltip: FunctionComponent<Props> = ({
  data: {xMin, xMax, yMin, yMax, columns},
  env,
}) => {
  const tooltipElement = useTooltipElement()

  const {
    xTickFormatter,
    yTickFormatter,
    config: {
      legendFont: font,
      legendFontColor: fontColor,
      legendFontBrightColor: fontBrightColor,
      legendBackgroundColor: backgroundColor,
      legendBorder: border,
    },
  } = env

  let xLabel = getXYLabel(xMin, xMax, xTickFormatter)
  let yLabel = getXYLabel(yMin, yMax, yTickFormatter)

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
                {/* TODO: Figure out a better way to decide if the `yTickFormatter` should be applied */}
                {isNumeric(type) ? yTickFormatter(value) : value}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>,
    tooltipElement
  )
}
