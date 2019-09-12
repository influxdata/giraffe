import * as React from 'react'
import {FC} from 'react'
import {Helmet} from 'react-helmet'

import {Header} from './Header'
import './Layout.css'

interface Props {
  className?: string
  title?: string
}

export const Layout: FC<Props> = ({className = '', title, children}) => {
  return (
    <div className={`layout ${className}`}>
      <Helmet>
        <title>{title ? `${title} | Giraffe` : 'Giraffe'}</title>
      </Helmet>
      <Header />
      <div className="layout__content">{children}</div>
    </div>
  )
}

export default Layout
