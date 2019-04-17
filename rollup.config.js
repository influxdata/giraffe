import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import sourceMaps from 'rollup-plugin-sourcemaps'
import {terser} from 'rollup-plugin-terser'
import gzip from 'rollup-plugin-gzip'
import typescript from 'rollup-plugin-typescript2'
import tsc from 'typescript'

const pkg = require('./package.json')

const globals = {
  react: 'React',
  'react-dom': 'ReactDOM',
}

export default {
  input: 'src/index.ts',
  output: [
    {
      name: '@influxdata/vis',
      file: pkg.main,
      format: 'umd',
      sourcemap: true,
      globals,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
      globals,
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({typescript: tsc}),
    sourceMaps(),
    terser(),
    gzip(),
  ],
  external: ['react', 'react-dom'],
}
