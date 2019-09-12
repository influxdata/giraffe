import React, {FC} from 'react'
import {Link} from 'gatsby'
import {ExternalLink as ExternalLinkIcon} from 'react-feather'

import './Header.css'

const ExternalLink = ({name, href}) => (
  <a href={href} target="_blank" className="header__link">
    {name} <ExternalLinkIcon size={16} className="header__link-icon" />
  </a>
)

export const Header: FC = () => {
  return (
    <header className="header">
      <div className="header__left">
        <Link to="/" title="Home" className="header__link header__logo">
          🦒
        </Link>
        <Link
          to="/docs"
          getProps={({isPartiallyCurrent}) =>
            isPartiallyCurrent
              ? {className: 'header__link header__link--active'}
              : {className: 'header__link'}
          }
        >
          Documentation
        </Link>
      </div>
      <div className="header__right">
        <div className="header__version">v0.16.2</div>
        {/* TODO */}
        <ExternalLink name="Playground" href="https://codesandbox.io" />
        <ExternalLink
          name="GitHub"
          href="https://github.com/influxdata/giraffe"
        />
      </div>
    </header>
  )
}
