import * as React from 'react'
import {Link} from '@reach/router'

import {APP_ROOT} from '../'

export const Nav = () => {
  return (
    <nav className="app-nav">
      <a className="logo" href="https://github.com/influxdata/vis">
        @influxdata/vis
      </a>
      <Link to={APP_ROOT}>Home</Link>
      <h2>Examples</h2>
      <Link to={`${APP_ROOT}/examples/basic-histogram`}>Basic Histogram</Link>
      <Link to={`${APP_ROOT}/examples/stacked-histogram`}>
        Stacked Histogram
      </Link>
      <Link to={`${APP_ROOT}/examples/overlaid-histogram`}>
        Overlaid Histogram
      </Link>
    </nav>
  )
}
