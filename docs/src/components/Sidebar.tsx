import React, {FC} from 'react'
import {Link} from 'gatsby'

import {DOCS_TOC} from '../constants'
import './Sidebar.css'

export const Sidebar: FC = () => {
  return (
    <nav className="sidebar">
      {DOCS_TOC.map(({name: sectionName, links}) => (
        <>
          {sectionName && <h2 className="sidebar__header">{sectionName}</h2>}
          {links.map(({name, url}) => (
            <Link
              to={url}
              className="sidebar__link"
              activeClassName="sidebar__link--active"
            >
              {name}
            </Link>
          ))}
        </>
      ))}
    </nav>
  )
}
