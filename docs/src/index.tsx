import * as React from 'react'
import {render} from 'react-dom'
import {Router} from '@reach/router'

import {App} from './components/App'
import {HistogramExample} from './components/examples/Histogram'
import {LineExample} from './components/examples/Line'

import './index.css'

export const APP_ROOT = process.env.APP_ROOT || '/'

render(
  <Router>
    <App path={APP_ROOT}>
      <HistogramExample path="examples/histogram" />
      <LineExample path="examples/line" />
    </App>
  </Router>,
  document.querySelector('#root')
)
