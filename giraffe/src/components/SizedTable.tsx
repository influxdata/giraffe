import React, {FunctionComponent, CSSProperties} from 'react'

import {
  GaugeLayerConfig,
  SizedConfig,
  TableGraphLayerConfig,
  LayerTypes,
  SimpleTableLayerConfig,
} from '../types'

import {GaugeLayer} from './GaugeLayer'
import {LatestValueTransform} from './LatestValueTransform'
import {newTableFromConfig} from '../utils/newTable'
import {RawFluxDataTable} from './RawFluxDataTable'
import {FluxTablesTransform} from './FluxTablesTransform'
import {TableGraphLayer} from './TableGraphLayer'
import {SimpleTableLayer} from './SimpleTableLayer'

import {usePlotEnv} from '../utils/usePlotEnv'

interface Props {
  config: SizedConfig
}

export const SizedTable: FunctionComponent<Props> = ({
  config: userConfig,
  children,
}) => {
  const env = usePlotEnv(userConfig)

  const {config} = env
  const {width, height} = config

  config.showAxes = false
  const fullsizeStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  }

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
          cursor: `${userConfig.cursor || 'auto'}`,
        }}
      >
        <div className="giraffe-layers" style={fullsizeStyle}>
          {config.layers.map((layerConfig, layerIndex) => {
            switch (layerConfig.type) {
              case LayerTypes.Gauge:
                return (
                  <LatestValueTransform
                    key={layerIndex}
                    table={newTableFromConfig(config)}
                    allowString={true}
                  >
                    {latestValue => (
                      <GaugeLayer
                        value={latestValue}
                        config={layerConfig as GaugeLayerConfig}
                      />
                    )}
                  </LatestValueTransform>
                )
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

              case LayerTypes.SimpleTable: {
                return (
                  <SimpleTableLayer
                    key={layerIndex}
                    config={layerConfig as SimpleTableLayerConfig}
                    fluxResponse={config.fluxResponse}
                    fromFluxResult={config.fromFluxResult}
                  />
                )
              }

              case LayerTypes.Table:
                return (
                  <FluxTablesTransform
                    key={layerIndex}
                    files={[config.fluxResponse]}
                  >
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
