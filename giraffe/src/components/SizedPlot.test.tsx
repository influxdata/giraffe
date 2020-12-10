import React from 'react'

import {fireEvent, render, screen} from '@testing-library/react'

import {PlotEnv} from '../utils/PlotEnv'

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
  },
]

const config = {
  table,
  layers,
  showAxes: false,
  width: '350px',
  height: '350px',
}

const resetSpy = jest.spyOn(PlotEnv.prototype, 'resetDomains')

describe('the SizedPlot', () => {
  describe('handling user interaction', () => {
    afterEach(() => {
      resetSpy.mockClear()
    })

    describe('the default behavior', () => {
      it('handles double clicks', () => {
        render(<SizedPlot config={config} />)
        fireEvent.doubleClick(screen.getByTestId('giraffe-inner-plot'))

        expect(resetSpy).toHaveBeenCalled()
      })
    })

    describe('the ability to override default behavior', () => {
      it('handles double clicks', () => {
        const fakeDoubleClickInteractionHandler = jest.fn()
        const localConfig = {
          ...config,
          interactionHandlers: {doubleClick: fakeDoubleClickInteractionHandler},
        }

        render(<SizedPlot config={localConfig} />)
        fireEvent.doubleClick(screen.getByTestId('giraffe-inner-plot'))

        expect(resetSpy).not.toHaveBeenCalled()
        expect(fakeDoubleClickInteractionHandler).toHaveBeenCalled()

        const [
          [callbackArguments],
        ] = fakeDoubleClickInteractionHandler.mock.calls

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

        render(<SizedPlot config={localConfig} />)

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
