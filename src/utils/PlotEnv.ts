import {scaleLinear} from 'd3-scale'
import {extent} from 'd3-array'
import memoizeOne from 'memoize-one'

import {
  Config,
  Margins,
  Scale,
  Mappings,
  Table,
  Scales,
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

import {stats} from '../stats'
import {getTicks} from './getTicks'
import {isNumeric} from './isNumeric'
import {assert} from './assert'

const CONFIG_DEFAULTS: Partial<Config> = {
  layers: [],
  axesStroke: '#31313d',
  tickFont: 'Medium 10px Helvetica Neue',
  tickFill: '#8e91a1',
  xAxisLabel: '',
  yAxisLabel: '',
}

const DEFAULT_X_DOMAIN: [number, number] = [0, 1]
const DEFAULT_Y_DOMAIN: [number, number] = [0, 1]

interface LayerData {
  table: Table
  mappings: Mappings
  scales: Scales
}

export class PlotEnv {
  private _config: Config | null = null
  private layers: LayerData[] = []

  public get config(): Config | null {
    return this._config
  }

  public set config(config: Config) {
    const tableChanged = !this._config || config.table !== this._config.table
    const layersChanged = !this._config || config.layers !== this._config.layers
    const domainsChanged =
      !this._config ||
      config.xDomain !== this._config.xDomain ||
      config.yDomain !== this._config.yDomain

    this._config = {...CONFIG_DEFAULTS, ...config}

    if (!tableChanged && !layersChanged && !domainsChanged) {
      return
    }

    this.layers = []

    for (let i = 0; i < this._config.layers.length; i++) {
      this.registerLayer(i, this._config.layers[i])
    }
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
      this.getColumnTypeForAesthetic('x')
    )
  }

  public get yTicks(): number[] {
    return this.getYTicks(
      this.yDomain,
      this.config.height,
      this.getColumnTypeForAesthetic('y')
    )
  }

  public get xScale(): Scale<number, number> {
    return this.getXScale(this.xDomain, this.innerWidth)
  }

  public get yScale(): Scale<number, number> {
    return this.getYScale(this.yDomain, this.innerHeight)
  }

  public get xDomain(): number[] {
    return this.getXDomain(this.config.xDomain, this.layers)
  }

  public get yDomain(): number[] {
    return this.getYDomain(this.config.yDomain, this.layers)
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

  public getColumnTypeForAesthetic(aesthetic: string): ColumnType | null {
    const columnTypes = this.layers.reduce((acc: ColumnType[], layer) => {
      const mapping = layer.mappings[aesthetic]

      if (!mapping) {
        return acc
      }

      return [...acc, layer.table.columns[mapping].type]
    }, [])

    if (!columnTypes.length) {
      return null
    }

    assert(
      `found multiple column types for aesthetic "${aesthetic}"`,
      columnTypes.every(t => t === columnTypes[0])
    )

    return columnTypes[0]
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
    (preferredXDomain: number[], layers: LayerData[]) =>
      preferredXDomain ||
      getDomainForAesthetics(['x', 'xMin', 'xMax'], layers) ||
      DEFAULT_X_DOMAIN
  )

  private getYDomain = memoizeOne(
    (preferredYDomain: number[], layers: LayerData[]) =>
      preferredYDomain ||
      getDomainForAesthetics(['y', 'yMin', 'yMax'], layers) ||
      DEFAULT_Y_DOMAIN
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

  private registerLayer(layerIndex: number, layer: LayerConfig): void {
    const {table: baseTable, xDomain, yDomain} = this.config
    const stat = stats[layer.type]

    this.layers[layerIndex] = stat(baseTable, layer as any, xDomain, yDomain)
  }
}

function getDomainsForLayer(
  {table, mappings}: LayerData,
  aesthetics: string[]
): number[] {
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

function getDomainForAesthetics(
  aesthetics: string[],
  layers: LayerData[]
): number[] | null {
  const domains = layers.flatMap(layer => getDomainsForLayer(layer, aesthetics))
  const domainOfDomains = extent([].concat(...domains))

  if (domainOfDomains.some(x => x === undefined)) {
    return null
  }

  return domainOfDomains
}
