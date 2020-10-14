import * as React from 'react'
import {select, text, boolean, number} from '@storybook/addon-knobs'

import {Table} from '../../giraffe/src'
import {CPU} from './data/cpu'
import {CPUString} from './data/cpuString'

import * as giraffe from '../../giraffe/src'

export const PlotContainer = ({children}) => (
  <div
    style={{
      width: 'calc(100vw - 100px)',
      height: 'calc(100vh - 100px)',
      margin: '50px',
    }}
  >
    {children}
  </div>
)

const multiSelect = (
  label: string,
  options: string[],
  defaultValues: string[]
): string[] => {
  const values = []

  options.forEach((value: string) => {
    const checkboxLabel = `${label}: ${value}`

    const selected = boolean(checkboxLabel, defaultValues.includes(value))

    if (selected) {
      values.push(value)
    }
  })

  return values
}

export const tickFontKnob = (initial?: string) =>
  text('Tick Font', initial || '10px sans-serif')

export const legendFontKnob = (initial?: string) =>
  text('Legend Font', initial || '12px sans-serif')

export const colorSchemeKnob = (initial?: string[]) =>
  select(
    'Color Scheme',
    {
      'Nineteen Eighty Four': giraffe.NINETEEN_EIGHTY_FOUR,
      Atlantis: giraffe.ATLANTIS,
      'Do Androids Dream': giraffe.DO_ANDROIDS_DREAM,
      Delorean: giraffe.DELOREAN,
      Cthulhu: giraffe.CTHULHU,
      Ectoplasm: giraffe.ECTOPLASM,
      'T Max 400 Film': giraffe.T_MAX_400_FILM,
      Viridis: giraffe.VIRIDIS,
      Magma: giraffe.MAGMA,
      Inferno: giraffe.INFERNO,
      Plasma: giraffe.PLASMA,
      ylOrRd: giraffe.YL_OR_RD,
      ylGnBu: giraffe.YL_GN_BU,
      buGn: giraffe.BU_GN,
    },
    initial || giraffe.NINETEEN_EIGHTY_FOUR
  )

export const tableKnob = (initial?: Table) =>
  select('Data', {CPU, CPUString}, initial || CPU)

/*
  Find all column keys in a table suitable for mapping to the `x` or `y`
  aesthetic, and retun as a map from column keys to column names.
*/
const findXYColumns = (table: Table) =>
  table.columnKeys.reduce((acc, k) => {
    const columnType = table.getColumnType(k)

    if (columnType !== 'number' && columnType !== 'time') {
      return acc
    }

    return {
      ...acc,
      [k]: table.getColumnName(k),
    }
  }, {})

export const findStringColumns = (table: Table) =>
  table.columnKeys.filter(k => table.getColumnType(k) === 'string')

export const xKnob = (table: Table, initial?: string) =>
  select('x', findXYColumns(table), initial || '_time')

export const yKnob = (table: Table, initial?: string) =>
  select('y', findXYColumns(table), initial || '_value' || 'cpu')

export const fillKnob = (table: Table, initial?: string[]) =>
  multiSelect('fill', findStringColumns(table), initial || ['cpu'])

export const symbolKnob = (table: Table, initial?: string[]) =>
  multiSelect('symbol', findStringColumns(table), initial || ['host'])

export const interpolationKnob = () =>
  select(
    'Interpolation',
    {
      linear: 'linear',
      monotoneX: 'monotoneX',
      monotoneY: 'monotoneY',
      cubic: 'cubic',
      step: 'step',
      stepBefore: 'stepBefore',
      stepAfter: 'stepAfter',
      natural: 'natural',
    },
    'monotoneX'
  )

export const xScaleKnob = () =>
  select(
    'X-Scale',
    {
      linear: 'linear',
      log: 'log',
    },
    'linear'
  )

export const yScaleKnob = () =>
  select(
    'Y-Scale',
    {
      linear: 'linear',
      log: 'log',
    },
    'linear'
  )

export const showAxesKnob = () => boolean('Axes', true)

export const timeZoneKnob = (initial?: string) =>
  select(
    'Time Zone',
    {
      UTC: 'UTC',
      'America/Los_Angeles': 'America/Los_Angeles',
      'America/New_York': 'America/New_York',
    },
    initial || 'UTC'
  )

export const tooltipOrientationThresholdKnob = () =>
  number('tooltipOrientationThreshold', 5)

export const zoomBrushKnobs = () => {
  const zoomBrushOpacity = number('Zoom brush Opacity (drag)', 0.1, {
    range: true,
    min: 0,
    max: 1,
    step: 0.01,
  })
  const zoomBrushColor = select(
    'Zoom brush color (drag)',
    {
      aliceblue: 'aliceblue',
      white: 'white',
      yellow: 'yellow',
      green: 'green',
      red: 'red',
      '#003b6f': '#003b6f',
    },
    'aliceblue'
  )
  return {zoomBrushColor, zoomBrushOpacity}
}
