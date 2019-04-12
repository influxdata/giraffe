import {scaleLinear} from 'd3-scale'
import {extent} from 'd3-array'
import memoizeOne from 'memoize-one'

import {
  SizedConfig,
  Margins,
  Scale,
  Table,
  LayerConfig,
  ColumnType,
} from '../types'

import {
  PLOT_PADDING,
  TICK_CHAR_WIDTH,
  TICK_CHAR_HEIGHT,
  TICK_PADDING_TOP,
  TICK_PADDING_RIGHT,
  AXIS_LABEL_PADDING_BOTTOM,
} from '../constants'

import {getTicks} from './getTicks'
import {getTickFormatter} from '../utils/getTickFormatter'
import {getNumericColumn} from './getNumericColumn'
import {assert} from './assert'

const CONFIG_DEFAULTS: Partial<SizedConfig> = {
  layers: [],
  xAxisLabel: '',
  yAxisLabel: '',
  axisColor: '#292933',
  axisOpacity: 1,
  gridColor: '#292933',
  gridOpacity: 1,
  tickFont: '10px "Helvetica Neue"',
  tickFontColor: '#8e91a1',
  legendFont: '12px "Helvetica Neue"',
  legendFontColor: '#8e91a1',
  legendFontBrightColor: '#c6cad3',
  legendBackgroundColor: '#1c1c21',
  legendBorder: '1px solid #202028',
  legendCrosshairColor: '#31313d',
}

const DEFAULT_X_DOMAIN: [number, number] = [0, 1]
const DEFAULT_Y_DOMAIN: [number, number] = [0, 1]

export class PlotEnv {
  private _config: SizedConfig | null = null
  private _xDomain: number[] | null = null
  private _yDomain: number[] | null = null

  public get config(): SizedConfig | null {
    return this._config
  }

  public set config(config: SizedConfig) {
    this._config = {...CONFIG_DEFAULTS, ...config}
  }

  public get margins(): Margins {
    const {
      yTicks,
      config: {xAxisLabel, yAxisLabel},
    } = this

    return this.getMargins(xAxisLabel, yAxisLabel, yTicks)
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
      getColumnTypeForAesthetic('x', this.config.table, this.config.layers)
    )
  }

  public get yTicks(): number[] {
    return this.getYTicks(
      this.yDomain,
      this.config.height,
      getColumnTypeForAesthetic('y', this.config.table, this.config.layers)
    )
  }

  public get xScale(): Scale<number, number> {
    return this.getXScale(this.xDomain, this.innerWidth)
  }

  public get yScale(): Scale<number, number> {
    return this.getYScale(this.yDomain, this.innerHeight)
  }

  public get xDomain(): number[] {
    if (this.config.xDomain) {
      return this.config.xDomain
    }

    if (!this._xDomain) {
      // TODO: Clear when stale (check for staleness when config is set)
      this._xDomain = this.getXDomain(this.config.table, this.config.layers)
    }

    return this._xDomain
  }

  public set xDomain(newXDomain: number[]) {
    if (this.config.onSetXDomain) {
      this.config.onSetXDomain(newXDomain)
    } else {
      this._xDomain = newXDomain
    }
  }

  public get yDomain(): number[] {
    if (this.config.yDomain) {
      return this.config.yDomain
    }

    if (!this._yDomain) {
      this._yDomain = this.getYDomain(this.config.table, this.config.layers)
    }

    return this._yDomain
  }

  public set yDomain(newYDomain: number[]) {
    if (this.config.onSetYDomain) {
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

  public resetDomains(): void {
    if (this.config.xDomain) {
      this.config.onResetXDomain()
    } else {
      this._xDomain = this.getXDomain(this.config.table, this.config.layers)
    }

    if (this.config.yDomain) {
      this.config.onResetYDomain()
    } else {
      this._yDomain = this.getYDomain(this.config.table, this.config.layers)
    }
  }

  private getMargins = memoizeOne(
    (xAxisLabel: string, yAxisLabel: string, yTicks: number[]) => {
      const xAxisLabelHeight = xAxisLabel
        ? TICK_CHAR_HEIGHT + AXIS_LABEL_PADDING_BOTTOM
        : 0

      const yAxisLabelHeight = yAxisLabel
        ? TICK_CHAR_HEIGHT + AXIS_LABEL_PADDING_BOTTOM
        : 0

      const yTickWidth =
        Math.max(...yTicks.map(t => String(t).length)) * TICK_CHAR_WIDTH

      return {
        top: PLOT_PADDING,
        right: PLOT_PADDING,
        bottom:
          TICK_CHAR_HEIGHT + TICK_PADDING_TOP + PLOT_PADDING + xAxisLabelHeight,
        left: yTickWidth + TICK_PADDING_RIGHT + PLOT_PADDING + yAxisLabelHeight,
      }
    }
  )

  private getXTicks = memoizeOne(getTicks)

  private getYTicks = memoizeOne(getTicks)

  private getXDomain = memoizeOne(
    (table: Table, layers: LayerConfig[]) =>
      getDomainForAesthetic('x', table, layers) || DEFAULT_X_DOMAIN
  )

  private getYDomain = memoizeOne(
    (table: Table, layers: LayerConfig[]) =>
      getDomainForAesthetic('y', table, layers) || DEFAULT_Y_DOMAIN
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
          getColumnTypeForAesthetic('x', this.config.table, this.config.layers)
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
          getColumnTypeForAesthetic('y', this.config.table, this.config.layers)
        )
      )
    }
  )
}

function getDomainForAesthetic(
  aesthetic: string,
  table: Table,
  layers: LayerConfig[]
) {
  const domains = layers.reduce((acc, layerConfig) => {
    // Assumes that if the aesthetic is mapped in a layer, it is mapped to a
    // single numeric column
    const mapping = layerConfig[aesthetic] as string

    if (!mapping) {
      return acc
    }

    const column = getNumericColumn(table, mapping)

    return [...acc, extent(column.data)]
  }, [])

  const domainOfDomains = extent([].concat(...domains))

  if (domainOfDomains.some(x => x === undefined)) {
    return null
  }

  return domainOfDomains
}

function getColumnTypeForAesthetic(
  aesthetic: string,
  table: Table,
  layers: LayerConfig[]
): ColumnType | null {
  const columnTypes = []

  for (const layerConfig of layers) {
    const mapping = layerConfig[aesthetic]

    if (mapping) {
      columnTypes.push(table.columns[mapping].type)
    }
  }

  if (!columnTypes.length) {
    return null
  }

  assert(
    `found multiple column types for aesthetic "${aesthetic}"`,
    columnTypes.every(t => t === columnTypes[0])
  )

  return columnTypes[0]
}
