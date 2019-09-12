import React, {FC} from 'react'
import {Link} from 'gatsby'
import {ChevronRight} from 'react-feather'
import {ChevronLeft} from 'react-feather'

import {DOCS_TOC} from '../constants'
import './ArticleButtons.css'

const pathsAreEqual = (a, b) => a.replace(/\//g, '') === b.replace(/\//g, '')

const findLinks = (path: string) => {
  const allLinks = DOCS_TOC.flatMap(d => d.links)
  const index = allLinks.findIndex(({url}) => pathsAreEqual(url, path))

  if (index === -1) {
    return [null, null]
  }

  return [allLinks[index - 1], allLinks[index + 1]]
}

interface Props {
  path: string
}

export const ArticleButtons: FC<Props> = ({path}) => {
  const [prev, next] = findLinks(path)

  if (!next && !prev) {
    return null
  }

  return (
    <div className="article-buttons">
      <div className="article-buttons__prev">
        {prev && (
          <Link to={prev.url} className="article-buttons__link">
            <ChevronLeft size={16} /> {prev.name}
          </Link>
        )}
      </div>
      <div className="article-buttons__next">
        {next && (
          <Link to={next.url} className="article-buttons__link">
            {next.name} <ChevronRight size={16} />
          </Link>
        )}
      </div>
    </div>
  )
}
