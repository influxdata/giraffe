import {addons} from '@storybook/addons'
import {create} from '@storybook/theming/create'

const theme = create({
  base: 'dark',
  appBg: '#0f0e15',
  appContentBg: '#1c1c21',
  appBorderColor: '#292933',
  appBorderRadius: 4,
  barTextColor: '#e7e8eb',
  barBg: '#292933',
})

addons.setConfig({
  panelPosition: 'right',
  theme,
})
