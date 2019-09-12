import React from 'react'
import {navigate} from 'gatsby'

import {Layout} from '../components/Layout'
import {Page} from '../components/Page'
import {IndexPageExample} from '../examples/IndexPageExample'
import {Button} from '../components/Button'
import './index.css'

const IndexPage = () => (
  <Layout>
    <Page>
      <div className="index-page">
        <h1>Giraffe</h1>
        <h2>A fast and flexible data visualization library for React</h2>
        <div className="index-page__actions">
          <Button
            className="index-page__action"
            kind="primary"
            onClick={() => navigate('/docs')}
          >
            View the Docs
          </Button>
          <Button className="index-page__action">See Some Examples</Button>
        </div>
        <div className="index-page__plot">
          <IndexPageExample />
        </div>
      </div>
    </Page>
  </Layout>
)

export default IndexPage
