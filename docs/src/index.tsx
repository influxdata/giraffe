import * as React from 'react'
import {render} from 'react-dom'
import {Router} from '@reach/router'

import {App} from './components/App'
import {StackedHistogram} from './components/examples/StackedHistogram'
import {OverlaidHistogram} from './components/examples/OverlaidHistogram'
import {BasicHistogram} from './components/examples/BasicHistogram'

import './index.css'

export const APP_ROOT = '/vis'

render(
  <Router>
    <App path={APP_ROOT}>
      <BasicHistogram path="examples/basic-histogram" />
      <StackedHistogram path="examples/stacked-histogram" />
      <OverlaidHistogram path="examples/overlaid-histogram" />
    </App>
  </Router>,
  document.querySelector('#root')
)
