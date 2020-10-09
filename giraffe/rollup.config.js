import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import postcss from 'rollup-plugin-postcss'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'
import {terser} from 'rollup-plugin-terser'
import gzip from 'rollup-plugin-gzip'
import typescript from 'rollup-plugin-typescript2'
import tsc from 'typescript'

const pkg = require('./package.json')

let plugins = [
  resolve({browser: true}),
  commonjs(),
  typescript({typescript: tsc}),
  sourceMaps(),
  peerDepsExternal(),
  postcss({
    extract: false,
    modules: {
      globalModulePaths: ['leaflet/dist'],
    },
    use: ['sass'],
  }),
]

// Minify and compress output when in production
if (process.env.NODE_ENV === 'production') {
  plugins = [...plugins, terser(), gzip()]
}

const input = 'src/index.ts'

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
}

// Do not bundle peer dependencies
const external = ['react', 'react-dom']

export default [
  {
    input,
    plugins,
    external,
    output: {
      name: pkg.name,
      file: pkg.main,
      format: 'umd',
      sourcemap: true,
      globals,
    },
  },
]
