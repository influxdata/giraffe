import * as React from 'react'
import {FC} from 'react'

import {Layout} from './Layout'
import {Sidebar} from './Sidebar'
import {ArticleButtons} from './ArticleButtons'
import {DocsArticle} from './DocsArticle'
import './DocsLayout.css'

interface Props {
  path: string
}

export const DocsLayout: FC<Props> = ({path, children}) => {
  return (
    <Layout title="Docs">
      <div className="docs-layout">
        <div className="docs-layout__content">
          <DocsArticle>{children}</DocsArticle>
          <ArticleButtons path={path} />
        </div>
        <Sidebar />
      </div>
    </Layout>
  )
}

export default DocsLayout
