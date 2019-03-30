import * as React from 'react'
import {Link} from '@reach/router'

export const Nav = () => {
  return (
    <nav className="app-nav">
      <a className="logo" href="https://github.com/influxdata/vis">
        @influxdata/vis
      </a>
      <Link to="/">Home</Link>
      <h2>Examples</h2>
      <Link to="/examples/basic-histogram">Basic Histogram</Link>
      <Link to="/examples/stacked-histogram">Stacked Histogram</Link>
      <Link to="/examples/overlaid-histogram">Overlaid Histogram</Link>
    </nav>
  )
}
