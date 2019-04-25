import * as React from 'react'
import {FunctionComponent} from 'react'
import {createPortal} from 'react-dom'

import {TooltipData} from '../types'
import {useTooltipElement} from '../utils/useTooltipElement'
import {PlotEnv} from '../utils/PlotEnv'
import {isNumeric} from '../utils/isNumeric'

interface Props {
  data: TooltipData
  env: PlotEnv
}

export const Tooltip: FunctionComponent<Props> = ({data, env}) => {
  const tooltipElement = useTooltipElement()

  const {
    config: {
      legendFont: font,
      legendFontColor: fontColor,
      legendFontBrightColor: fontBrightColor,
      legendBackgroundColor: backgroundColor,
      legendBorder: border,
    },
  } = env

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
      <div
        className="vis-tooltip-table"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {data.map(({name, type, values, colors}, i) => (
          <div
            key={name}
            className="vis-tooltip-column"
            style={{
              marginRight: i === data.length - 1 ? 0 : '15px',
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
                  color: colors && colors[i] ? colors[i] : fontBrightColor,
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
