import {scaleLinear} from 'd3-scale'
import {range} from 'd3-array'
import memoizeOne from 'memoize-one'

import {
  SizedConfig,
  Margins,
  Scale,
  Table,
  TableColumn,
  ColumnType,
  HeatmapTable,
} from '../types'

import {
  TICK_PADDING_TOP,
  TICK_PADDING_RIGHT,
  AXIS_LABEL_PADDING_BOTTOM,
  LAYER_DEFAULTS,
  CONFIG_DEFAULTS,
} from '../constants'

import * as transforms from '../layerTransforms'
import {getTicks} from './getTicks'
import {getTickFormatter} from '../utils/getTickFormatter'
import {isNumeric} from './isNumeric'
import {assert} from './assert'
import {getTextMetrics} from './getTextMetrics'
import {maxBy, extentOfExtents} from './extrema'
import {flatMap} from './flatMap'
import {identityMerge} from './identityMerge'
import {MemoizedFunctionCache} from './MemoizedFunctionCache'

const X_DOMAIN_AESTHETICS = ['x', 'xMin', 'xMax']
const Y_DOMAIN_AESTHETICS = ['y', 'yMin', 'yMax']
const DEFAULT_X_DOMAIN: [number, number] = [0, 1]
const DEFAULT_Y_DOMAIN: [number, number] = [0, 1]

export class PlotEnv {
  private _config: SizedConfig | null = null
  private _xDomain: number[] | null = null
  private _yDomain: number[] | null = null
  private fns = new MemoizedFunctionCache()

  public get config(): SizedConfig | null {
    return this._config
  }

  public set config(config: SizedConfig) {
    const prevConfig = this._config

    console.log('setting config')

    this._config = mergeConfigs(config, prevConfig)

    if (areUncontrolledDomainsStale(this._config, prevConfig)) {
      this._xDomain = null
      this._yDomain = null
    }
  }

  public get margins(): Margins {
    const {
      yTicks,
      config: {xAxisLabel, yAxisLabel, tickFont},
    } = this

    return this.getMargins(
      this.config.showAxes,
      xAxisLabel,
      yAxisLabel,
      yTicks,
      this.yTickFormatter,
      tickFont
    )
  }

  public get innerWidth(): number {
    const {width} = this.config
    const {margins} = this

    return width - margins.left - margins.right
  }

  public get innerHeight(): number {
    const {height} = this.config
    const {margins} = this

    return height - margins.top - margins.bottom
  }

  public get xTicks(): number[] {
    return this.getXTicks(
      this.xDomain,
      this.config.width,
      'horizontal',
      this.getColumnTypeForAesthetics(['x', 'xMin', 'xMax']),
      this.getCharMetrics(this.config.tickFont)
    )
  }

  public get yTicks(): number[] {
    return this.getYTicks(
      this.yDomain,
      this.config.height,
      'vertical',
      this.getColumnTypeForAesthetics(['y', 'yMin', 'yMax']),
      this.getCharMetrics(this.config.tickFont)
    )
  }

  public get xScale(): Scale<number, number> {
    return this.getXScale(this.xDomain, this.innerWidth)
  }

  public get yScale(): Scale<number, number> {
    return this.getYScale(this.yDomain, this.innerHeight)
  }

  public get xDomain(): number[] {
    if (this.isXControlled) {
      return this.config.xDomain
    }

    if (!this._xDomain) {
      this._xDomain = this.getXDomain()
    }

    return this._xDomain
  }

  public set xDomain(newXDomain: number[]) {
    if (this.isXControlled) {
      this.config.onSetXDomain(newXDomain)
    } else {
      this._xDomain = newXDomain
    }
  }

  public get yDomain(): number[] {
    if (this.isYControlled) {
      return this.config.yDomain
    }

    if (!this._yDomain) {
      this._yDomain = this.getYDomain()
    }

    return this._yDomain
  }

  public set yDomain(newYDomain: number[]) {
    if (this.isYControlled) {
      this.config.onSetYDomain(newYDomain)
    } else {
      this._yDomain = newYDomain
    }
  }

  public get xTickFormatter(): (tick: number) => string {
    return this.getXTickFormatter(this.config, this.xDomain)
  }

  public get yTickFormatter(): (tick: number) => string {
    return this.getYTickFormatter(this.config, this.yDomain)
  }

  public getTable(layerIndex: number): Table {
    const table = this.config.table
    const layerConfig = this.config.layers[layerIndex]
    const transformKey = `${layerIndex} ${layerConfig.type} table`

    switch (layerConfig.type) {
      case 'line': {
        const {fill} = layerConfig
        const transform = this.fns.get(transformKey, transforms.getLineTable)

        return transform(table, fill)
      }
      case 'scatter': {
        const {fill, symbol} = layerConfig
        const transform = this.fns.get(transformKey, transforms.getScatterTable)

        return transform(table, fill, symbol)
      }
      case 'histogram': {
        const {x, fill, binCount, position} = layerConfig

        const transform = this.fns.get(
          transformKey,
          transforms.getHistogramTable
        )

        return transform(
          table,
          x,
          this.config.xDomain,
          fill,
          binCount,
          position
        )
      }
      case 'heatmap': {
        const {x, y} = layerConfig
        const {width, height, xDomain, yDomain} = this.config
        const transform = this.fns.get(transformKey, transforms.getHeatmapTable)

        return transform(table, x, y, xDomain, yDomain, width, height)
      }
      default: {
        return this.config.table
      }
    }
  }

  public getScale(layerIndex: number, aesthetic: string): Scale {
    const {type: layerType, colors} = this.config.layers[layerIndex]
    const transformKey = `${layerIndex} ${layerType} scales`
    const table = this.getTable(layerIndex)

    switch (layerType) {
      case 'line': {
        const getter = this.fns.get(transformKey, transforms.getLineScales)

        return getter(table, colors)[aesthetic]
      }
      case 'scatter': {
        const getter = this.fns.get(transformKey, transforms.getScatterScales)

        return getter(table, colors)[aesthetic]
      }
      case 'histogram': {
        const getter = this.fns.get(transformKey, transforms.getHistogramScales)

        return getter(table, colors)[aesthetic]
      }
      case 'heatmap': {
        const getter = this.fns.get(transformKey, transforms.getHeatmapScales)

        return getter(table as HeatmapTable, colors)[aesthetic]
      }
      default: {
        throw new Error(`${aesthetic} scale for layer ${layerIndex} not found`)
      }
    }
  }

  public getMapping(layerIndex: number, aesthetic: string): string | null {
    const layerConfig = this.config.layers[layerIndex]

    switch (layerConfig.type) {
      case 'line':
        return transforms.getLineMappings(layerConfig)[aesthetic]
      case 'scatter':
        return transforms.getScatterMappings(layerConfig)[aesthetic]
      case 'heatmap':
        return transforms.getHeatmapMappings()[aesthetic]
      case 'histogram':
        return transforms.getHistogramMappings(layerConfig.fill)[aesthetic]
      default:
        return null
    }
  }

  public getColumnTypeForAesthetics(aesthetics: string[]): ColumnType | null {
    const columnTypes = this.getColumnsForAesthetics(aesthetics).map(
      col => col.type
    )

    if (!columnTypes.length) {
      return null
    }

    assert(
      `found multiple column types for aesthetics "${aesthetics}"`,
      columnTypes.every(t => t === columnTypes[0])
    )

    return columnTypes[0]
  }

  public resetDomains(): void {
    if (this.isXControlled) {
      this.config.onResetXDomain()
    } else {
      this._xDomain = this.getXDomain()
    }

    if (this.isYControlled) {
      this.config.onResetYDomain()
    } else {
      this._yDomain = this.getYDomain()
    }
  }

  private getCharMetrics = memoizeOne((font: string) => {
    // https://stackoverflow.com/questions/3949422/which-letter-of-the-english-alphabet-takes-up-most-pixels
    return getTextMetrics(font, 'W')
  })

  private get isXControlled() {
    return (
      this.config.xDomain &&
      this.config.onSetXDomain &&
      this.config.onResetXDomain
    )
  }

  private get isYControlled() {
    return (
      this.config.yDomain &&
      this.config.onSetYDomain &&
      this.config.onResetYDomain
    )
  }

  private getMargins = memoizeOne(
    (
      showAxes: boolean,
      xAxisLabel: string,
      yAxisLabel: string,
      yTicks: number[],
      yTickFormatter: (tick: number) => string,
      tickFont: string
    ) => {
      if (!showAxes) {
        return {top: 1, right: 1, bottom: 1, left: 1}
      }

      const longestYTick = maxBy(
        d => d.length,
        yTicks.map(t => yTickFormatter(t))
      )

      const {width: maxTextWidth, height: textHeight} = getTextMetrics(
        tickFont,
        longestYTick
      )

      const xAxisLabelHeight = xAxisLabel
        ? textHeight + AXIS_LABEL_PADDING_BOTTOM
        : 0

      const yAxisLabelHeight = yAxisLabel
        ? textHeight + AXIS_LABEL_PADDING_BOTTOM
        : 0

      return {
        top: textHeight / 2,
        right: 1,
        bottom: textHeight + TICK_PADDING_TOP + xAxisLabelHeight,
        left: maxTextWidth + TICK_PADDING_RIGHT + yAxisLabelHeight,
      }
    }
  )

  private getXTicks = memoizeOne(getTicks)

  private getYTicks = memoizeOne(getTicks)

  private getXDomain() {
    return this.getDomainForAesthetics(X_DOMAIN_AESTHETICS) || DEFAULT_X_DOMAIN
  }

  private getYDomain() {
    return this.getDomainForAesthetics(Y_DOMAIN_AESTHETICS) || DEFAULT_Y_DOMAIN
  }

  private getColumnsForAesthetics(aesthetics: string[]): TableColumn[] {
    const columns = flatMap(layerIndex => {
      const table = this.getTable(layerIndex)

      const colKeys = aesthetics
        .map(aes => this.getMapping(layerIndex, aes))
        .filter(d => !!d)

      const layerColumns = colKeys.map(k => table.columns[k]).filter(d => !!d)

      return layerColumns
    }, range(this.config.layers.length))

    return columns
  }

  private getDomainForAesthetics(aesthetics: string[]): number[] {
    // Collect column data arrays for all columns in the plot currently mapped
    // to any of the passed `aesthetics`
    const colData = this.getColumnsForAesthetics(aesthetics).map(col => {
      assert(`expected column ${col.name} to be numeric`, isNumeric(col.type))

      return col.data as number[]
    })

    const fnKey = `extentOfExtents ${aesthetics.join(', ')}`
    const fn = this.fns.get(fnKey, extentOfExtents)

    // Compute the domain of all of those columns (memoized, since doing so is
    // an expensive operation)
    const domain = fn(...colData)

    return domain
  }

  private getXScale = memoizeOne((xDomain: number[], innerWidth: number) => {
    return scaleLinear()
      .domain(xDomain)
      .range([0, innerWidth])
  })

  private getYScale = memoizeOne((yDomain: number[], innerHeight: number) => {
    return scaleLinear()
      .domain(yDomain)
      .range([innerHeight, 0])
  })

  private getXTickFormatter = memoizeOne(
    (config: SizedConfig, xDomain: number[]) => {
      return (
        config.xTickFormatter ||
        getTickFormatter(
          xDomain,
          this.getColumnTypeForAesthetics(['x', 'xMin', 'xMax'])
        )
      )
    }
  )

  private getYTickFormatter = memoizeOne(
    (config: SizedConfig, yDomain: number[]) => {
      return (
        config.yTickFormatter ||
        getTickFormatter(
          yDomain,
          this.getColumnTypeForAesthetics(['y', 'yMin', 'yMax'])
        )
      )
    }
  )
}

const applyLayerDefaults = (
  layers: SizedConfig['layers']
): SizedConfig['layers'] =>
  layers.map(layer =>
    LAYER_DEFAULTS[layer.type]
      ? {...LAYER_DEFAULTS[layer.type], ...layer}
      : layer
  )

const mergeConfigs = (
  config: SizedConfig,
  prevConfig: SizedConfig | null
): SizedConfig => ({
  ...identityMerge(prevConfig, {
    ...CONFIG_DEFAULTS,
    ...config,
    layers: applyLayerDefaults(config.layers),
    // Avoid passing the `table` to `identityMerge` since checking its identity
    // can be quite expensive if it is a large object
    table: null,
  }),
  table: config.table,
})

const areUncontrolledDomainsStale = (
  config: SizedConfig,
  prevConfig: SizedConfig
): boolean => {
  if (!prevConfig) {
    return true
  }

  if (config.table !== prevConfig.table) {
    return true
  }

  // TODO: Or if any of the mappings change

  return false
}
