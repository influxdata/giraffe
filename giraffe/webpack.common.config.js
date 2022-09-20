const path = require('path')
const webpack = require('webpack')
const pkg = require('./package.json')

module.exports = {
  entry: './src/index.ts',
  output: {
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'Giraffe',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '',
    sourceMapFilename: '[file].map[query]',
  },
  externals: {
    react: {
      amd: 'react',
      commonjs: 'react',
      commonjs2: 'react',
      root: 'React',
    },
    'react-dom': {
      amd: 'react-dom',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      root: 'ReactDOM',
    },
    lodash: {
      commonjs: 'lodash',
      commonjs2: 'lodash',
      amd: 'lodash',
      root: '_',
    },
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-modules-typescript-loader'},
          {loader: 'css-loader', options: {modules: true}},
          {loader: 'sass-loader'},
        ],
      },
      {
        test: /\.css$/,
        use: [{loader: 'style-loader'}, 'css-loader'],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[contenthash:10].[ext]',
            },
          },
        ],
      },
      {
        test: /\.(eot|ttf|woff|woff2|otf)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: Infinity
            },
          },
        ],
      }
    ],
  },
}
