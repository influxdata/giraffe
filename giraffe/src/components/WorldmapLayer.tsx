import * as React from 'react'
import {useRef, useState, FunctionComponent} from 'react'

import {WorldmapLayerConfig, WorldmapLayerSpec, LayerProps} from '../types'
import {DivRenderingContext, useDiv} from '../utils/useDiv'
import {FILL, SYMBOL} from '../constants/columnKeys'
import {useMountedEffect} from '../utils/useMountedEffect'
import {drawFeatures, initMap, MapControl} from '../utils/worldmap'
import {Tooltip} from './Tooltip'
import {getPointsTooltipData} from '../utils/tooltip'

interface Props extends LayerProps {
  spec: WorldmapLayerSpec
  config: WorldmapLayerConfig
}

export const WorldmapLayer: FunctionComponent<Props> = props => {
  const {
    config,
    plotConfig,
    spec,
    width,
    height,
    xScale,
    yScale,
    columnFormatter,
  } = props

  const divRef = useRef<HTMLDivElement>(null)

  const [mapCtrl] = useState<MapControl>(
    initMap({
      variant: config.variant,
      zoom: config.zoom,
      center: config.center,
      blur: config.blur,
      radius: config.radius,
    })
  )

  const isPointmap = config.variant == 'pointmap'
  const isHeatmap = config.variant == 'heatmap'

  const context: DivRenderingContext = {}

  const drawFeaturesOptions = {
    xColData: spec.table.getColumn(config.x, 'number'),
    yColData: spec.table.getColumn(config.y, 'number'),
    fillColData: spec.table.getColumn(FILL, 'number'),
    symbolColData: spec.table.getColumn(SYMBOL, 'number'),
    xScale,
    yScale,
    fillScale: spec.scales.fill,
    symbolScale: spec.scales.symbol,
    points: mapCtrl.getPoints(),
    weightColData: spec.table.getColumn(config.weight, 'number'),
    normalizeWeight: isPointmap,
  }

  // TODO possible to detect render cause? do this only when heatmap knobs changed
  if (isHeatmap) {
    mapCtrl.setHeatmapRadius(config.radius)
    mapCtrl.setHeatmapBlur(config.blur)
  }

  useMountedEffect(() => {
    // mapCtrl.setMapTarget(divRef.current) // TODO should be here but map appears only when mouse enters div for the first time :(
  })

  useDiv(
    divRef,
    context,
    width,
    height,
    context => {
      mapCtrl.setMapTarget(divRef.current) // TODO workaround until the above TODO is solved
      drawFeatures({context, ...drawFeaturesOptions})
    },
    Object.values(drawFeaturesOptions)
  )

  let tooltipData = null

  // TODO giraffe's tooltip breaks heatmap (pointer must be moved to re-render)
  if (isPointmap) {
    const selectedFeature = mapCtrl.getSelectedFeature()
    if (selectedFeature != undefined) {
      const rowIndices = [selectedFeature.get('_rowIndex')]

      // copy-pasted from ScatterHoverLayer
      tooltipData = getPointsTooltipData(
        rowIndices,
        spec.table,
        config.x,
        config.y,
        FILL,
        columnFormatter,
        config.metrics, // [...new Set([...config.fill, ...config.symbol])],
        spec.scales.fill
      )
    }
  }

  return (
    <>
      <div
        id="worldmap"
        className="giraffe-layer worldmap"
        ref={divRef}
        style={{
          position: 'absolute',
          width: `${width}px`,
          height: `${height}px`,
        }}
        data-testid="giraffe-layer--worldmap"
      />
      {tooltipData && <Tooltip data={tooltipData} config={plotConfig} />}
    </>
  )
}

WorldmapLayer.displayName = 'WorldmapLayer'