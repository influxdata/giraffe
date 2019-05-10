import {scaleLinear} from 'd3-scale'
import {extent} from 'd3-array'
import memoizeOne from 'memoize-one'

import {
  SizedConfig,
  Margins,
  Scale,
  Mappings,
  Table,
  Scales,
  ColumnType,
} from '../types'

import {
  TICK_PADDING_TOP,
  TICK_PADDING_RIGHT,
  AXIS_LABEL_PADDING_BOTTOM,
  LAYER_DEFAULTS,
} from '../constants'

import {stats} from '../stats'
import {getTicks} from './getTicks'
import {getTickFormatter} from '../utils/getTickFormatter'
import {isNumeric} from './isNumeric'
import {assert} from './assert'
import {getTextMetrics} from './getTextMetrics'
import {maxBy} from './extrema'
import {isMostlyEqual} from './isMostlyEqual'
import {identityMerge} from './identityMerge'

const CONFIG_DEFAULTS: Partial<SizedConfig> = {
  layers: [],
  xAxisLabel: '',
  yAxisLabel: '',
  showAxes: true,
  axisColor: '#292933',
  axisOpacity: 1,
  gridColor: '#292933',
  gridOpacity: 1,
  tickFont: '10px sans-serif',
  tickFontColor: '#8e91a1',
  legendFont: '10px monospace',
  legendFontColor: '#8e91a1',
  legendFontBrightColor: '#c6cad3',
  legendBackgroundColor: '#1c1c21',
  legendBorder: '1px solid #202028',
  legendCrosshairColor: '#31313d',
}

const DEFAULT_X_DOMAIN: [number, number] = [0, 1]
const DEFAULT_Y_DOMAIN: [number, number] = [0, 1]

interface LayerData {
  table: Table
  mappings: Mappings
  scales: Scales
}

export class PlotEnv {
  private _config: SizedConfig | null = null
  private _xDomain: number[] | null = null
  private _yDomain: number[] | null = null
  private layers: LayerData[] = []

  public get config(): SizedConfig | null {
    return this._config
  }

  public set config(config: SizedConfig) {
    const prevConfig = this._config

    // TODO: config.table should be compared by reference equality only
    this._config = identityMerge(prevConfig, {
      ...CONFIG_DEFAULTS,
      ...config,
      layers: applyLayerDefaults(config.layers),
    })

    const shouldRunStats =
      !prevConfig ||
      this._config.table !== prevConfig.table ||
      this._config.xDomain !== prevConfig.xDomain ||
      this._config.yDomain !== prevConfig.yDomain ||
      this._config.layers.some((_, i) =>
        isLayerStale(this._config, prevConfig, i)
      )

    if (shouldRunStats) {
      this._xDomain = null
      this._yDomain = null

      this.layers = this._config.layers.map(layerConfig => {
        const stat = stats[layerConfig.type]

        return stat(this._config, layerConfig as any)
      })
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
      this._xDomain = this.getXDomain(this.layers)
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
      this._yDomain = this.getYDomain(this.layers)
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
    return this.layers[layerIndex].table
  }

  public getScale(layerIndex: number, aesthetic: string): Scale {
    return this.layers[layerIndex].scales[aesthetic]
  }

  public getMapping(layerIndex: number, aesthetic: string) {
    return this.layers[layerIndex].mappings[aesthetic]
  }

  public getColumnTypeForAesthetics(aesthetics: string[]): ColumnType | null {
    const columnTypes = []

    for (const layer of this.layers) {
      for (const aesthetic of aesthetics) {
        const mapping = layer.mappings[aesthetic]

        if (mapping) {
          columnTypes.push(layer.table.columns[mapping].type)
        }
      }
    }

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
      this._xDomain = this.getXDomain(this.layers)
    }

    if (this.isYControlled) {
      this.config.onResetYDomain()
    } else {
      this._yDomain = this.getYDomain(this.layers)
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

  private getXDomain = memoizeOne(
    (layers: LayerData[]) =>
      getDomainForAesthetics(['x', 'xMin', 'xMax'], layers) || DEFAULT_X_DOMAIN
  )

  private getYDomain = memoizeOne(
    (layers: LayerData[]) =>
      getDomainForAesthetics(['y', 'yMin', 'yMax'], layers) || DEFAULT_Y_DOMAIN
  )

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

const getDomainsForLayer = (
  {table, mappings}: LayerData,
  aesthetics: string[]
): number[] => {
  return aesthetics.reduce((acc, aes) => {
    if (!mappings[aes]) {
      return acc
    }

    const column = table.columns[mappings[aes]]

    assert(
      `"${aes}" aesthetic mapped to non-existant column "${mappings[aes]}"`,
      !!column
    )

    assert(
      `expected column "${mappings[aes]}" to be numeric`,
      isNumeric(column.type)
    )

    return [...acc, extent(column.data as number[])]
  }, [])
}

const getDomainForAesthetics = (
  aesthetics: string[],
  layers: LayerData[]
): number[] | null => {
  const domains = [].concat(
    ...layers.map(layer => getDomainsForLayer(layer, aesthetics))
  )
  const domainOfDomains = extent([].concat(...domains))

  if (domainOfDomains.some(x => x === undefined)) {
    return null
  }

  return domainOfDomains
}

const isLayerStale = (
  config: SizedConfig,
  prevConfig: SizedConfig | null,
  layerIndex: number
): boolean => {
  if (!prevConfig) {
    return true
  }

  if (prevConfig.table !== config.table) {
    return true
  }

  const layer = config.layers[layerIndex]
  const prevLayer = prevConfig.layers[layerIndex]

  if (!prevLayer) {
    return true
  }

  return !isMostlyEqual(layer, prevLayer)
}

const applyLayerDefaults = (
  layers: SizedConfig['layers']
): SizedConfig['layers'] =>
  layers.map(layer =>
    LAYER_DEFAULTS[layer.type]
      ? {...LAYER_DEFAULTS[layer.type], ...layer}
      : layer
  )
