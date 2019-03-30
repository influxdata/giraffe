import * as React from 'react'
import {FunctionComponent} from 'react'
import {RouteComponentProps} from '@reach/router'

import {Nav} from './Nav'

type Props = RouteComponentProps

export const App: FunctionComponent<Props> = ({children}) => {
  return (
    <div className="app">
      <Nav />
      <div className="app-content">{children}</div>
    </div>
  )
}
