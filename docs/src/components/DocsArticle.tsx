import React, {FC} from 'react'

import './DocsArticle.css'

export const DocsArticle: FC = ({children}) => {
  return <article className="docs-article">{children}</article>
}

export default DocsArticle
