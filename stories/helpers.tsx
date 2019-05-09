import * as React from 'react'
import {select, text, boolean} from '@storybook/addon-knobs'

import {Table, isNumeric} from '../src'
import {TABLE} from './data'
import * as colorSchemes from '../src/constants/colorSchemes'

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

export const tickFontKnob = (initial?: string) =>
  text('Tick Font', initial || '10px sans-serif')

export const legendFontKnob = (initial?: string) =>
  text('Legend Font', initial || '12px sans-serif')

export const colorSchemeKnob = (initial?: string[]) =>
  select(
    'Color Scheme',
    {
      'Nineteen Eighty Four': colorSchemes.NINETEEN_EIGHTY_FOUR,
      Atlantis: colorSchemes.ATLANTIS,
      'Do Androids Dream': colorSchemes.DO_ANDROIDS_DREAM,
      Delorean: colorSchemes.DELOREAN,
      Cthulhu: colorSchemes.CTHULHU,
      Ectoplasm: colorSchemes.ECTOPLASM,
      'T Max 400 Film': colorSchemes.T_MAX_400_FILM,
      Viridis: colorSchemes.VIRIDIS,
      Magma: colorSchemes.MAGMA,
      Inferno: colorSchemes.INFERNO,
      Plasma: colorSchemes.PLASMA,
      ylOrRd: colorSchemes.YL_OR_RD,
      ylGnBu: colorSchemes.YL_GN_BU,
      buGn: colorSchemes.BU_GN,
    },
    initial || colorSchemes.NINETEEN_EIGHTY_FOUR
  )

export const tableKnob = (initial?: Table) =>
  select(
    'Data',
    {
      CPU: TABLE,
    },
    initial || TABLE
  )

/*
  Find all column keys in a table suitable for mapping to the `x` or `y`
  aesthetic, and retun as a map from column keys to column names.
*/
const findXYColumns = (table: Table) =>
  Object.keys(table.columns).reduce((acc, k) => {
    if (!isNumeric(table.columns[k].type)) {
      return acc
    }

    return {
      ...acc,
      [k]: table.columns[k].name,
    }
  }, {})

const findGroupableColumns = (table: Table) =>
  Object.keys(table.columns).reduce((acc, k) => {
    if (table.columns[k].type !== 'string') {
      return acc
    }

    return {
      ...acc,
      [k]: table.columns[k].name,
    }
  }, {})

export const xKnob = (table: Table, initial?: string) =>
  select('x', findXYColumns(table), initial || '_time')

export const yKnob = (table: Table, initial?: string) =>
  select('y', findXYColumns(table), initial || '_value')

export const fillKnob = (table: Table, initial?: string) =>
  select('fill', findGroupableColumns(table), initial || 'cpu')

export const symbolKnob = (table: Table, initial?: string) =>
  select('symbol', findGroupableColumns(table), initial || 'host')

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

export const showAxesKnob = () => boolean('Axes', true)
