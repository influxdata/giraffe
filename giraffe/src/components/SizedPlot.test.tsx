import React, {FC} from 'react'

import {fireEvent, render, screen} from '@testing-library/react'

import {PlotEnv} from '../utils/PlotEnv'
import {usePlotEnv} from '../utils/usePlotEnv'

import {LineLayerConfig, SizedConfig} from '../types'

jest.mock('./GeoMap', () => <></>) // this component causes all sorts of loading problems

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

interface MockComponentProps {
  children: (env: PlotEnv) => JSX.Element
  config: SizedConfig
}

const MockComponent: FC<MockComponentProps> = props => {
  const {children, config} = props
  const env = usePlotEnv(config)

  return children(env)
}

const resetSpy = jest.spyOn(PlotEnv.prototype, 'resetDomains')

const axesRef: React.RefObject<HTMLCanvasElement> = React.createRef()
const layersRef: React.RefObject<HTMLCanvasElement> = React.createRef()

describe.skip('the SizedPlot', () => {
  describe('handling user interaction', () => {
    afterEach(() => {
      resetSpy.mockClear()
    })

    describe('the default behavior', () => {
      it('handles double clicks', () => {
        render(
          <MockComponent config={config}>
            {env => (
              <SizedPlot
                config={config}
                axesCanvasRef={axesRef}
                layerCanvasRef={layersRef}
                env={env}
              />
            )}
          </MockComponent>
        )

        fireEvent.doubleClick(screen.getByTestId('giraffe-inner-plot'))

        expect(resetSpy).toHaveBeenCalled()
      })
    })

    describe('the ability to override default behavior', () => {
      it.skip('handles single clicks', () => {
        const fakeSingleClickInteractionHandler = jest.fn()
        const localConfig = {
          ...config,
          interactionHandlers: {
            singleShiftClick: fakeSingleClickInteractionHandler,
          },
        }

        render(
          <MockComponent config={localConfig}>
            {env => (
              <SizedPlot
                config={localConfig}
                axesCanvasRef={axesRef}
                layerCanvasRef={layersRef}
                env={env}
              />
            )}
          </MockComponent>
        )

        // we now do the single-click via the dragging listener,
        // and pair mouseUps with mouseDowns;
        // so doing a mousedown then a mouse Up to simulate a single click

        /**.
         * ..except that now we do shift-click; and was not able to simulate a shift mouse-Up properly.
         * the shift-click to write an annotation is tested via the e2e tests in the ui project; so skipping
         * the test here
         *
         * tried the following, none of it worked:
         *
         *  fireEvent.mouseDown(screen.getByTestId('giraffe-inner-plot'), {shiftKey: true})
         *  fireEvent.mouseUp(screen.getByTestId('giraffe-inner-plot'), {shiftKey: true})
         * fireEvent(screen.getByTestId('giraffe-inner-plot'), new MouseEvent('mousedown', {shiftKey:true}))
         * fireEvent(screen.getByTestId('giraffe-inner-plot'), new MouseEvent('mouseup', {shiftKey:true}))
         *
         * fireEvent(screen.getByTestId('giraffe-inner-plot'), new MouseEvent('mouseDown', {shiftKey:true}))
         * fireEvent(screen.getByTestId('giraffe-inner-plot'), new MouseEvent('mouseUp', {shiftKey:true}))

         * fireEvent.click(screen.getByTestId('giraffe-inner-plot'), { shiftKey: true })
         *
         * userEvent.click(screen.getByTestId('giraffe-inner-plot'), {
         *  shiftKey: true,
         * })
         * */

        //this doesn't work; leaving it in to show we need to try to trigger it......
        fireEvent.mouseDown(screen.getByTestId('giraffe-inner-plot'))
        fireEvent.mouseUp(screen.getByTestId('giraffe-inner-plot'))

        expect(resetSpy).not.toHaveBeenCalled()
        expect(fakeSingleClickInteractionHandler).toHaveBeenCalled()

        const [
          [callbackArguments],
        ] = fakeSingleClickInteractionHandler.mock.calls

        // don't care what the values are, we just care that we pass these values back
        expect(Object.keys(callbackArguments)).toEqual([
          'clampedValueX',
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
          <MockComponent config={localConfig}>
            {env => (
              <SizedPlot
                config={localConfig}
                axesCanvasRef={axesRef}
                layerCanvasRef={layersRef}
                env={env}
              />
            )}
          </MockComponent>
        )

        fireEvent.mouseOver(screen.getByTestId('giraffe-inner-plot'))

        const [[callbackArguments]] = fakeHoverCallback.mock.calls

        // don't care what the values are, we just care that we pass these values back
        expect(Object.keys(callbackArguments)).toEqual([
          'clampedValueX',
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
