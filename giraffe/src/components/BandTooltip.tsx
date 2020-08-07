import * as React from 'react'
import {FunctionComponent} from 'react'
import {createPortal} from 'react-dom'

import {TooltipData, Config} from '../types'
import {useTooltipElement} from '../utils/useTooltipElement'

interface Props {
  data: TooltipData
  config: Config
}

export const BandTooltip: FunctionComponent<Props> = ({data, config}) => {
  const tooltipElement = useTooltipElement()

  const {
    legendFont: font,
    legendFontColor: fontColor,
    legendFontBrightColor: fontBrightColor,
    legendBackgroundColor: backgroundColor,
    legendBorder: border,
    legendColumns: columnsWhitelist,
  } = config

  const columns = columnsWhitelist
    ? data.filter(column => columnsWhitelist.includes(column.key))
    : data

  return createPortal(
    <div
      className="giraffe-tooltip"
      style={{
        border,
        font,
        backgroundColor,
        color: fontBrightColor,
        borderRadius: '3px',
        padding: '10px',
        cursor: 'crosshair',
      }}
      data-testid="giraffe-tooltip"
    >
      <div
        className="giraffe-tooltip-table"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
        data-testid="giraffe-tooltip-table"
      >
        {columns.map(({name, type, values, colors}, i) => (
          <div
            key={name}
            className="giraffe-tooltip-column"
            style={{
              marginRight: i === data.length - 1 ? 0 : '15px',
              textAlign: type === 'number' ? 'right' : 'left',
            }}
          >
            <div
              className="giraffe-tooltip-column-header"
              style={{marginBottom: '5px', color: fontColor}}
            >
              {name}
            </div>
            {values.map((value, i) => (
              <div
                className="giraffe-tooltip-column-value"
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

BandTooltip.displayName = 'BandTooltip'
