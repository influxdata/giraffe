/*
  @jest-environment jsdom
*/

import {Table, SizedConfig, LineLayerConfig} from '../types'
import {PlotEnv} from './PlotEnv'

import * as layerTransforms from '../layerTransforms'

describe('PlotEnv', () => {
  describe('config updates and memoization', () => {
    let histogramTransformSpy
    let lineTransformSpy

    beforeEach(() => {
      histogramTransformSpy = jest.spyOn(layerTransforms, 'getHistogramTable')
      lineTransformSpy = jest.spyOn(layerTransforms, 'getLineTable')
    })

    afterEach(() => {
      histogramTransformSpy.mockRestore()
      lineTransformSpy.mockRestore()
    })

    test('updates xScale when xDomain is updated', () => {
      const plotEnv = new PlotEnv()

      const table: Table = {
        columns: {
          a: {
            name: 'a',
            type: 'number',
            data: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
          },
        },
        length: 10,
      }

      const config: SizedConfig = {
        table,
        width: 1000,
        height: 500,
        xDomain: [10, 19],
        onSetXDomain: () => {},
        onResetXDomain: () => {},
        layers: [{type: 'histogram', x: 'a'}],
      }

      plotEnv.config = config

      expect(plotEnv.xScale(10)).toEqual(0)
      expect(plotEnv.xScale(19)).toEqual(
        1000 - plotEnv.margins.left - plotEnv.margins.right
      )

      plotEnv.config = {...config, xDomain: [10, 28]}

      expect(plotEnv.xScale(10)).toEqual(0)
      expect(plotEnv.xScale(28)).toEqual(
        1000 - plotEnv.margins.left - plotEnv.margins.right
      )
    })

    test('runs bin stat when x domain changes', () => {
      const plotEnv = new PlotEnv()

      const table: Table = {
        columns: {
          a: {
            name: 'a',
            type: 'number',
            data: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
          },
        },
        length: 10,
      }

      const config: SizedConfig = {
        table,
        width: 1000,
        height: 500,
        xDomain: [10, 19],
        onSetXDomain: () => {},
        onResetXDomain: () => {},
        layers: [{type: 'histogram', x: 'a', binCount: 10}],
      }

      plotEnv.config = config

      const getFirstBinCount = () => plotEnv.getTable(0).columns.yMax.data[0]

      expect(getFirstBinCount()).toEqual(1)

      plotEnv.config = {...config, xDomain: [10, 28]}

      expect(getFirstBinCount()).toEqual(2)

      expect(histogramTransformSpy).toHaveBeenCalledTimes(2)
    })

    test('runs bin stat when histogram layer x mapping changes', () => {
      const plotEnv = new PlotEnv()

      const table: Table = {
        columns: {
          a: {
            name: 'a',
            type: 'number',
            data: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
          },
          b: {
            name: 'b',
            type: 'number',
            data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 19],
          },
        },
        length: 10,
      }

      const config: SizedConfig = {
        table,
        width: 1000,
        height: 500,
        layers: [{type: 'histogram', x: 'a', binCount: 10}],
      }

      plotEnv.config = config

      const getFirstBinCount = () => plotEnv.getTable(0).columns.yMax.data[0]

      expect(getFirstBinCount()).toEqual(1)

      plotEnv.config = {
        ...config,
        layers: [{type: 'histogram', x: 'b', binCount: 10}],
      }

      expect(getFirstBinCount()).toEqual(9)

      expect(histogramTransformSpy).toHaveBeenCalledTimes(2)
    })

    test.skip('does not run bin stat when histogram colors change', () => {
      const plotEnv = new PlotEnv()

      const table: Table = {
        columns: {
          a: {
            name: 'a',
            type: 'number',
            data: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
          },
        },
        length: 10,
      }

      const config: SizedConfig = {
        table,
        width: 1000,
        height: 500,
        layers: [
          {type: 'histogram', x: 'a', binCount: 10, colors: ['red', 'blue']},
        ],
      }

      plotEnv.config = config
      plotEnv.config = {
        ...config,
        layers: [
          {type: 'histogram', x: 'a', binCount: 10, colors: ['red', 'green']},
        ],
      }

      expect(histogramTransformSpy).toHaveBeenCalledTimes(1)
    })

    test.skip('updating line interpolation should not reset the x domain', () => {
      const plotEnv = new PlotEnv()

      const table: Table = {
        columns: {
          a: {
            name: 'a',
            type: 'number',
            data: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
          },
          b: {
            name: 'b',
            type: 'number',
            data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 19],
          },
        },
        length: 10,
      }

      const config: SizedConfig = {
        table,
        width: 1000,
        height: 500,
        layers: [{type: 'line', x: 'b', y: 'a', interpolation: 'linear'}],
      }

      plotEnv.config = config
      plotEnv.xDomain = [12, 15]

      expect(plotEnv.xDomain).toEqual([12, 15])

      plotEnv.config = {
        ...config,
        layers: [
          {...config.layers[0], interpolation: 'monotoneX'} as LineLayerConfig,
        ],
      }

      expect(plotEnv.xDomain).toEqual([12, 15])
    })

    test.skip('does not run line stat when x domain changes', () => {
      const plotEnv = new PlotEnv()

      const table: Table = {
        columns: {
          a: {
            name: 'a',
            type: 'number',
            data: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
          },
          b: {
            name: 'b',
            type: 'number',
            data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 19],
          },
        },
        length: 10,
      }

      const config: SizedConfig = {
        table,
        width: 1000,
        height: 500,
        xDomain: [10, 19],
        onSetXDomain: () => {},
        onResetXDomain: () => {},
        layers: [{type: 'line', x: 'b', y: 'a'}],
      }

      plotEnv.config = config

      expect(lineTransformSpy).toHaveBeenCalledTimes(1)

      plotEnv.config = {...config, xDomain: [12, 14]}

      expect(lineTransformSpy).toHaveBeenCalledTimes(1)
    })
  })
})
