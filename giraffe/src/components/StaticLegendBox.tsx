import React, {FunctionComponent, useEffect, useMemo} from 'react'
import {
  Formatter,
  LayerSpec,
  LegendPropertyNames,
  SizedConfig,
  StaticLegend,
} from '../types'
import {
  CONFIG_DEFAULTS,
  STATIC_LEGEND_DEFAULTS,
  STATIC_LEGEND_BOX_PADDING,
  STATIC_LEGEND_LINE_SPACING_RATIO,
  STATIC_LEGEND_SCROLL_PADDING,
} from '../constants/index'
import {Legend} from './Legend'
import {DapperScrollbars} from './DapperScrollbars'
import {getLegendData} from '../utils/legend/staticLegend'
import {getStaticLegendTexMetrics} from '../utils/textMetrics'

interface StaticLegendBoxProps extends StaticLegend {
  config: SizedConfig
  columnFormatter: (columnKey: string) => Formatter
  height: number
  spec: LayerSpec
  top: number
  width: number
}

interface LegendOptionsOverridden {
  config: SizedConfig
  staticLegend: StaticLegend
}
const overrideLegendConfig = (
  config: SizedConfig,
  staticLegend: StaticLegend
): LegendOptionsOverridden => {
  const configWithDefaults = {...CONFIG_DEFAULTS, ...config}
  const staticLegendWithDefaults = {...STATIC_LEGEND_DEFAULTS, ...staticLegend}

  for (const property in staticLegendWithDefaults) {
    if (property in LegendPropertyNames) {
      configWithDefaults[LegendPropertyNames[property]] =
        staticLegendWithDefaults[property]
    }
  }

  return {config: configWithDefaults, staticLegend: staticLegendWithDefaults}
}

export const StaticLegendBox: FunctionComponent<StaticLegendBoxProps> = props => {
  const {config, columnFormatter, height, spec, top, width} = props
  const {staticLegend} = config

  const {
    config: configOverride,
    staticLegend: staticLegendOverride,
  } = useMemo(() => overrideLegendConfig(config, staticLegend), [
    config,
    staticLegend,
  ])

  const {style = {}} = staticLegendOverride

  const {
    legendBackgroundColor: backgroundColor,
    legendBorder: border,
    legendFont: font,
    legendFontBrightColor: fontBrightColor,
    legendOpacity: opacity,
  } = configOverride

  const layerConfig = configOverride.layers[staticLegendOverride.layer]
  const valueColumnKey = layerConfig[staticLegendOverride.valueAxis]
  const legendData = useMemo(
    () =>
      getLegendData(layerConfig.type, spec, valueColumnKey, columnFormatter),
    [layerConfig.type, spec, valueColumnKey, columnFormatter]
  )

  useEffect(() => {
    const {headerTextMetrics, sampleTextMetrics} = getStaticLegendTexMetrics()
    staticLegendOverride.renderEffect({
      totalHeight: height + top,
      staticLegendHeight: height,
      legendDataLength: legendData.length,
      lineCount: legendData.length ? legendData[0].values.length : 0,
      lineSpacingRatio: STATIC_LEGEND_LINE_SPACING_RATIO,
      padding: 2 * STATIC_LEGEND_BOX_PADDING + STATIC_LEGEND_SCROLL_PADDING,
      headerTextMetrics,
      sampleTextMetrics,
    })
  }, [height, legendData, top])

  return (
    <div
      className="giraffe-static-legend"
      style={{
        padding: STATIC_LEGEND_BOX_PADDING, // overridable, must be at the top
        ...style,
        backgroundColor,
        border,
        boxSizing: 'border-box',
        color: fontBrightColor,
        cursor: staticLegendOverride.cursor,
        font,
        height: `${height}px`,
        opacity,
        overflow: 'auto',
        width: `${width}px`,
      }}
      data-testid="giraffe-static-legend"
    >
      <DapperScrollbars removeTracksWhenNotUsed={true} autoHide={true}>
        <Legend
          type="static"
          data={legendData}
          config={configOverride}
          isScrollable={true}
        />
      </DapperScrollbars>
    </div>
  )
}
