import React, {FunctionComponent, CSSProperties} from 'react'

import {SizedConfig, TableGraphLayerConfig, LayerTypes} from '../types'

import {RawFluxDataTable} from './RawFluxDataTable'
import {FluxTablesTransform} from './FluxTablesTransform'
import {TableGraphLayer} from './TableGraphLayer'

import {usePlotEnv} from '../utils/usePlotEnv'

interface Props {
  config: SizedConfig
}

export const SizedTable: FunctionComponent<Props> = ({
  config: userConfig,
  children,
}) => {
  const env = usePlotEnv(userConfig)

  const {margins, config} = env
  const {width, height} = config

  const fullsizeStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }

  const fluxResponse = config.fluxResponse ? config.fluxResponse : ''

  return (
    <div
      className="giraffe-plot"
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        userSelect: 'none',
      }}
    >
      <div
        className="giraffe-inner-plot"
        style={{
          position: 'absolute',
          top: `${margins.top}px`,
          right: `${margins.right}px`,
          bottom: `${margins.bottom}px`,
          left: `${margins.left}px`,
          cursor: `${userConfig.cursor || 'auto'}`,
        }}
      >
        <div className="giraffe-layers" style={fullsizeStyle}>
          {config.layers.map((layerConfig, layerIndex) => {
            switch (layerConfig.type) {
              case LayerTypes.RawFluxDataTable:
                return (
                  <RawFluxDataTable
                    key={layerIndex}
                    config={{
                      ...layerConfig,
                      width: config.width,
                      height: config.height,
                    }}
                  />
                )

              case LayerTypes.Table:
                return (
                  <FluxTablesTransform key={layerIndex} files={[fluxResponse]}>
                    {tables => (
                      <TableGraphLayer
                        config={
                          {...layerConfig, tables} as TableGraphLayerConfig
                        }
                      />
                    )}
                  </FluxTablesTransform>
                )

              case LayerTypes.Custom:
                const renderProps = {
                  key: layerIndex,
                  width,
                  height,
                  innerWidth: env.innerWidth,
                  innerHeight: env.innerHeight,
                  xScale: env.xScale,
                  yScale: env.yScale,
                  xDomain: env.xDomain,
                  yDomain: env.yDomain,
                  columnFormatter: env.getFormatterForColumn,
                  yColumnType: env.yColumnType,
                }
                return layerConfig.render(renderProps)

              default:
                return null
            }
          })}
          {children && children}
        </div>
      </div>
    </div>
  )
}

SizedTable.displayName = 'SizedTable'
