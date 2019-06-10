import {configure, addParameters, addDecorator} from '@storybook/react'
import {create} from '@storybook/theming'
import {addReadme} from 'storybook-readme'
import 'storybook-chromatic'
import './Story.scss'

addDecorator(addReadme)

addParameters({
  options: {
    theme: create({
      base: 'dark',
      appBg: '#0f0e15',
      appContentBg: '#1c1c21',
      appBorderColor: '#292933',
      appBorderRadius: 4,
      barTextColor: '#e7e8eb',
      barBg: '#292933',
    }),
    panelPosition: 'right',
  },
})

function loadStories() {
  const req = require.context('../stories', true, /\.stories\.tsx$/)
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
