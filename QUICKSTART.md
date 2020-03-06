```bash
mkdir giraffeboi
cd giraffeboi
yarn init -y
yarn add react react-dom @influxdata/giraffe typescript rollup rollup-plugin-commonjs rollup-plugin-node-resolve rollup-plugin-replace rollup-plugin-typescript2

touch index.html
touch index.tsx
touch rollup.config.js
```

open `rollup.config.js` and paste the following in:
```js
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'
import typescript from 'rollup-plugin-typescript2'
import tsc from 'typescript'

import * as react from 'react';

let plugins = [
  typescript({typescript: tsc}),
  resolve(),
  commonjs({jsnext: true, namedExports: {react: Object.keys(react)}}),
  replace({
    'process.env.NODE_ENV': JSON.stringify('development')
  }),
]

const input = '.index.tsx'

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
}

const external = ['react', 'react-dom']

export default [
  {
    input,
    plugins,
    output: {
      name: 'giraffeboi',
      file: './dist/gb.js',
      format: 'iife',
      globals,
    },
  },
]

```



Meanwhile, in `index.tsx`

```tsx
import React from 'react'
import ReactDOM from 'react-dom'

import {Plot} from '@influxdata/giraffe'


```

## Put that in your pipe and smoke it
