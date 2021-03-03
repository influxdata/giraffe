import React from 'react'

import {fireEvent, render, screen} from '@testing-library/react'

import {PlotEnv} from '../utils/PlotEnv'

import {LineLayerConfig, SizedConfig} from '../types'

jest.mock('./Geo', () => <></>) // this component causes all sorts of loading problems

import {newTable} from '../utils/newTable'

import {SizedPlot} from './SizedPlot'

const table = newTable(3)
  .addColumn('_time', 'dateTime:RFC3339', 'time', [
    1589838401244,
    1589838461244,
    1589838521244,
  ])
  .addColumn('_value', 'double', 'number', [2.58, 7.11, 4.79])

const layers = [
  {
    type: 'line',
    x: '_time',
    y: '_value',
    fill: [],
  } as LineLayerConfig,
]

const config: SizedConfig = {
  table,
  layers,
  showAxes: false,
  width: 350,
  height: 350,
}

const resetSpy = jest.spyOn(PlotEnv.prototype, 'resetDomains')

const axesRef: React.RefObject<HTMLCanvasElement> = React.createRef()
const layersRef: React.RefObject<HTMLCanvasElement> = React.createRef()

describe('the SizedPlot', () => {
  describe('handling user interaction', () => {
    afterEach(() => {
      resetSpy.mockClear()
    })

    describe('the default behavior', () => {
      it('handles double clicks', () => {
        render(
          <SizedPlot
            config={config}
            axesCanvasRef={axesRef}
            layerCanvasRef={layersRef}
          />
        )

        // when the user (for real) does a single click, then a mouse up happens.
        // chose mouse up because the single click listener wasn't triggering except on
        // double clicks
        fireEvent.mouseUp(screen.getByTestId('giraffe-inner-plot'))

        expect(resetSpy).toHaveBeenCalled()
      })
    })

    describe('the ability to override default behavior', () => {
      it('handles single clicks', () => {
        const fakeSingleClickInteractionHandler = jest.fn()
        const localConfig = {
          ...config,
          interactionHandlers: {singleClick: fakeSingleClickInteractionHandler},
        }

        render(
          <SizedPlot
            config={localConfig}
            axesCanvasRef={axesRef}
            layerCanvasRef={layersRef}
          />
        )
        // when the user (for real) does a single click, then a mouse up happens.
        // chose mouse up because the single click listener wasn't triggering except on
        // double clicks
        fireEvent.mouseUp(screen.getByTestId('giraffe-inner-plot'))

        expect(resetSpy).not.toHaveBeenCalled()
        expect(fakeSingleClickInteractionHandler).toHaveBeenCalled()

        const [
          [callbackArguments],
        ] = fakeSingleClickInteractionHandler.mock.calls

        // don't care what the values are, we just care that we pass these values back
        expect(Object.keys(callbackArguments)).toEqual([
          'hoverX',
          'hoverY',
          'valueX',
          'valueY',
          'xDomain',
          'yDomain',
          'resetDomains',
        ])
      })

      it('calls a hover handler callback if one is passed in', () => {
        const fakeHoverCallback = jest.fn()
        const localConfig = {
          ...config,
          interactionHandlers: {hover: fakeHoverCallback},
        }

        render(
          <SizedPlot
            config={localConfig}
            axesCanvasRef={axesRef}
            layerCanvasRef={layersRef}
          />
        )

        fireEvent.mouseOver(screen.getByTestId('giraffe-inner-plot'))

        const [[callbackArguments]] = fakeHoverCallback.mock.calls

        // don't care what the values are, we just care that we pass these values back
        expect(Object.keys(callbackArguments)).toEqual([
          'hoverX',
          'hoverY',
          'valueX',
          'valueY',
          'xDomain',
          'yDomain',
          'resetDomains',
        ])
      })
    })
  })
})
